//color for each side of the blocks
var Colors = [new BABYLON.Color4(0.98, 0.9, 0.05),
	new BABYLON.Color4(0.98, 0.9, 0.05),
	new BABYLON.Color4(0.98, 0.9, 0.05),
	new BABYLON.Color4(0.98, 0.9, 0.05),
	new BABYLON.Color4(0.98, 0.9, 0.05),
	new BABYLON.Color4(0.98, 0.9, 0.05)];

//setup ground, camera, lighting
var createScene = function (engine) {
	// Create a basic BJS Scene object.
	var scene = new BABYLON.Scene(engine);
	// Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
	var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 2.5, -2.5), scene);
	// Target the camera to scene origin.
	camera.setTarget(BABYLON.Vector3.Zero());
	// Attach the camera to the canvas. - don't do this to prevent movement
	// get the canvas DOM element
	var canvas = document.getElementById('renderCanvas');
	camera.attachControl(canvas, false);
	camera.speed = camera.speed/4;
	//set scene ambient color to green
	scene.clearColor = new BABYLON.Color3(0.2, 0.56, 0.08);
	// Create a basic light, aiming 0,1,0 - meaning, to the sky.
	var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(-1, 5, -2), scene);
	// Create a built-in "ground" shape.
	var ground = BABYLON.MeshBuilder.CreateGround('ground1', { height: 2.5, width: 2.5, subdivisions: 2 }, scene);
	// Return the created scene.
	return scene;
}

//cretes random locations for blocks - does not add to scene
var getRandomBlocks = function () {
	var i;
	var block_locations = [];
	for (i = 0; i < 10; i++) {
		x = Math.random() * 2 - 1;
		z = Math.random() * 2 - 1;
		block_locations.push({ 'x': x, 'y': 0.08, 'z': z });
	}
	return block_locations;
}

var fixAllBlockLocations = function (block_locations) {
	//fix blocks one by one. If a block was moved, It needs to be rechecked.
	block_locations.forEach(block1 => {
		//big bad O>=n^2 algorithm here. Should be OK for now because block_objects ~< 15 elems
		fixBlockClip(block1, block_locations);

		//fix block float

		//fix block off board
	});
	return block_locations;
}

//check one block against others for intersection.
//moves a block if necessary.
//rechecks moved block for collisions.
var fixBlockClip = function (block1, block_locations) {
	block_locations.forEach(block2 => {
		if (block1.x == block2.x &&
				block1.z == block2.z &&
				block1.y == block2.y) {
			return; //functions the same as a continue statement
		}
		//if (block1.intersectsMesh(block2, false, false)) {
		if (Math.abs(block1.x - block2.x) < 0.159 &&
				Math.abs(block1.z - block2.z) < 0.159 &&
				Math.abs(block1.y - block2.y) < 0.159) { // for some reason, 0.08 - 0.24 = -0.159999 not -0.16
			if (block1.z > block2.z) {
				block1.y += 0.16;
				fixBlockClip(block1, block_locations); //recheck moved block
			} else {
				block2.y += 0.16;
				fixBlockClip(block2, block_locations); //recheck moved block
			}
		}
	});
}

//adds block locations to scene
var addBlocksToScene = function (block_locations, scene) {
	var block_objects = [];

	//add each block to scene
	block_locations.forEach(block => {
		block_objects.push(BABYLON.MeshBuilder.CreateBox('block', { size: 0.16, faceColors: Colors }, scene));
		block_objects[block_objects.length - 1].position.x = block.x;
		block_objects[block_objects.length - 1].position.y = block.y;
		block_objects[block_objects.length - 1].position.z = block.z;
	});

	return block_objects;
}

var newBlock = function (scene) {
	block = BABYLON.MeshBuilder.CreateBox('block', { size: 0.16, faceColors: Colors }, scene);
	block.position.y = 0.08;
	return block;
}