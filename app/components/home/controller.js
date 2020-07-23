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
	$scope.presetListVis = false;

	$scope.submit = function () {
		var dataset = [];
		$scope.block_objects.forEach(block => {
			dataset.push([block.position.x, block.position.y, block.position.z]);
		});
		$.ajax({
			type: "POST",
			url: "./model",
			datatype: 'json',
			contentType: 'application/json;charset=UTF-8',
			data: JSON.stringify({
				sent: $scope.instruction,
				dataset: dataset
			}),
			success: function(msg){
				//annotate blocks with 'source', 'target', or 'unmoved'
				var source_block;
				dataset.forEach(block_old => {
					var moved = true;
					msg.forEach(block_new => {
						if(block_old[0] == block_new[0]
						&& block_old[1] == block_new[1]
						&& block_old[2] == block_new[2]) {
							moved = false;
							block_new[3] = "unmoved";
							block_old[3] = "unmoved";
						}
					});
					if(moved){
						source_block = block_old;
						block_old[3] = "source";
					}
				});
				msg.forEach(block_new => {
					if(block_new.length < 4){
						block_new[3] = "target";
					}
				});
				//clear all current blocks from scene
				for (var i = $scope.block_objects.length - 1; i >= 0; i--) {
					$scope.block_objects[i].dispose(); //remove block from babylon scene
					$scope.block_objects.splice(i, 1); //delete block from block_objects
				}
				//get rid of any extra blocks not included in block_objects
				$scope.scene.meshes.forEach(mesh => {
					if(mesh.name != 'ground1'){
						mesh.dispose();
					}
				});
				//create a new block to show movement
				var source_marker = newBlock();
				source_marker.position.x = source_block[0];
				source_marker.position.y = source_block[1];
				source_marker.position.z = source_block[2];
				source_marker.material = $scope.scene.getMaterialByName('source');
				//get new block locations and update scope block_objects
				var block_locations = [];
				msg.forEach(block => {
					block_locations.push({x: block[0], y: block[1], z: block[2], tag: block[3]});
				});
				var block_locations = fixAllBlockLocations(block_locations);
				var block_objects = addBlocksToScene(block_locations, $scope.scene);

				$scope.$parent.block_locations = block_locations;
				block_objects.forEach(block => {
					$scope.block_objects.push(block);
				});
			}});
	}

	$scope.reset = function () {
		//clear all blocks from scene
		for (var i = $scope.block_objects.length-1; i>=0; i--) {
			$scope.block_objects[i].dispose(); //remove block from babylon scene
			$scope.block_objects.splice(i, 1); //delete block from block_objects
		}
		//get rid of any extra blocks not included in block_objects
		$scope.scene.meshes.forEach(mesh => {
			if (mesh.name != 'ground1') {
				mesh.dispose();
			}
		});
		//create blocks at original locations and update scope block_objects.
		//Stange behavior here. Updating $scope.block_objects = addBlocksToScene()
		//does create the block cards in the DOM. but, adding them one at a time does.
		var block_objects = addBlocksToScene($scope.block_locations_original, $scope.scene);
		$scope.$parent.block_locations = $scope.block_locations_original;
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
		//get rid of any extra blocks not included in block_objects
		$scope.scene.meshes.forEach(mesh => {
			if (mesh.name != 'ground1') {
				mesh.dispose();
			}
		});
		//get new block locations and update scope block_objects.
		//Stange behavior here. see reset() above
		var block_locations = getRandomBlocks();
		var block_locations = fixAllBlockLocations(block_locations);
		var block_objects = addBlocksToScene(block_locations, $scope.scene);
		$scope.$parent.block_locations_original = block_locations;
		$scope.$parent.block_locations = block_locations;
		block_objects.forEach(block => {
			$scope.block_objects.push(block);
		});
	}

	$scope.toggleBlockCards = function () {
		if ($scope.checkSelect == true) {
			$scope.blockListVis = true;
			//also put the grid on the board
			$scope.scene.getMeshByName('ground1').material = $scope.scene.getMaterialByName('grid');
		} else {
			$scope.blockListVis = false;
			$scope.scene.getMeshByName('ground1').material = null;
		}
	}

	$scope.existsFiller = function () {
		var exists = false;
		for(var i = 0; i < $scope.block_objects.length; i++){
			if($scope.block_objects[i].position.x == -1
				&& $scope.block_objects[i].position.y == -1
				&& $scope.block_objects[i].position.z == -1) {
					exists = true;
				}
		}
		return exists;
	}

	$scope.createBlock = function () {
		//find any filler block
		var filler_block;
		$scope.block_objects.forEach(block => {
			if(block.position.x == -1
				&& block.position.y == -1
				&& block.position.z == -1) {
					filler_block = block;
				}
		});
		filler_block.dispose(); //remove filler block from babylon scene
		//delete block from block_objects
		var idx = $scope.block_objects.indexOf(filler_block);
		if (idx >= 0) {
			$scope.block_objects.splice(idx, 1);
		}
		//create and add new block
		$scope.block_objects.push(newBlock($scope.scene));
	}

	$scope.togglePresetList = function () {
		if ($scope.presetListVis == false) {
			$scope.presetListVis = true;
		} else {
			$scope.presetListVis = false;
		}
	}

	$scope.setPreset = function () {
		var dataset = document.getElementById("selectedPreset").dataset;
		if (typeof dataset.instruction == 'undefined') {
			alert("Please choose a preset from the drop-down list.");
			return;
		}
		//clear all blocks from scene
		for (var i = $scope.block_objects.length - 1; i >= 0; i--) {
			$scope.block_objects[i].dispose(); //remove block from babylon scene
			$scope.block_objects.splice(i, 1); //delete block from block_objects
		}
		//get rid of any extra blocks not included in block_objects
		$scope.scene.meshes.forEach(mesh => {
			if (mesh.name != 'ground1') {
				mesh.dispose();
			}
		});

		var locations = JSON.parse(dataset.blockcords);
		$scope.block_locations_original = locations;
		$scope.block_locations = locations;

		var block_objects = addBlocksToScene($scope.block_locations, $scope.scene);
		block_objects.forEach(block => {
			$scope.block_objects.push(block);
		});

		$scope.instruction = dataset.instruction;
	}

	$scope.$on('$viewContentLoaded', function (event) {
		var canvas = document.getElementById('renderCanvas');
		var engine = new BABYLON.Engine(canvas, true);
		var scene = createScene(engine);
		var block_objects = addBlocksToScene($scope.$parent.block_locations, scene);

		event.currentScope.scene = scene;
		event.currentScope.block_objects = block_objects;

		engine.runRenderLoop(function () {
			scene.render();
		});

		window.addEventListener('resize', function () {
			engine.resize();
		});
	});
});

function selectPreset(el) {
	var old = document.getElementById("selectedPreset");
	var new_elem = el.cloneNode(true);
	new_elem.classList.add("selected-preset");
	new_elem.id = "selectedPreset";
	old.parentNode.replaceChild(new_elem, old);
}
