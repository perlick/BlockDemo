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
	$scope.block_objects = {};

	//write functions for reset and shuffle buttons

	$scope.$on('$viewContentLoaded', function (event) {
		// setup canvas every time this view is loaded
		var canvas = document.getElementById('renderCanvas');
		var engine = new BABYLON.Engine(canvas, true);

		var scene = createScene(engine);
		var block_locations = getRandomBlocks();
		var block_objects = addBlocksToScene(block_locations, scene);

		event.currentScope.block_objects = block_objects;

		engine.runRenderLoop(function () {
			scene.render();
		});

		window.addEventListener('resize', function () {
			engine.resize();
		});
	});
});