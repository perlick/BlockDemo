'use strict';

angular.module('app.home', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/home', {
		templateUrl: 'app/components/home/view.html',
		controller: 'homeCtrl'
	});
}])

.controller('homeCtrl', function ($scope) {
	$scope.instruction = "";
	$scope.block_objects = [];

	$scope.reset = function () {
		//clear all blocks from scene
		for (var i = $scope.block_objects.length-1; i>=0; i--) {
			$scope.block_objects[i].dispose(); //remove block from babylon scene
			$scope.block_objects.splice(i, 1); //delete block from block_objects
		}
		//create blocks at original locations and update scope block_objects.
		//Stange behavior here. Updating $scope.block_objects = addBlocksToScene()
		//does create the block cards in the DOM. but, adding them one at a time does.
		var block_objects = addBlocksToScene($scope.block_locations_original, $scope.scene);
		block_objects.forEach(block => {
			$scope.block_objects.push(block);
		});
	}

	$scope.shuffle = function () {
		//clear all blocks from scene
		for (var i = $scope.block_objects.length - 1; i >= 0; i--) {
			$scope.block_objects[i].dispose(); //remove block from babylon scene
			$scope.block_objects.splice(i, 1); //delete block from block_objects
		}
		//get new block locations and update scope block_objects.
		//Stange behavior here. see reset() above
		var block_locations = getRandomBlocks();
		var block_objects = addBlocksToScene(block_locations, $scope.scene);
		$scope.block_locations_original = block_locations;
		block_objects.forEach(block => {
			$scope.block_objects.push(block);
		});
	}

	$scope.createBlock = function () {
		$scope.block_objects.push(newBlock($scope.scene));
	}

	$scope.$on('$viewContentLoaded', function (event) {
		// setup canvas every time this view is loaded
		var canvas = document.getElementById('renderCanvas');
		var engine = new BABYLON.Engine(canvas, true);

		var scene = createScene(engine);
		var block_locations = getRandomBlocks();
		var block_objects = addBlocksToScene(block_locations, scene);

		event.currentScope.scene = scene;
		event.currentScope.block_locations_original = block_locations;
		event.currentScope.block_objects = block_objects;

		engine.runRenderLoop(function () {
			scene.render();
		});

		window.addEventListener('resize', function () {
			engine.resize();
		});
	});
});