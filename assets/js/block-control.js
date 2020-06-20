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
	//camera.attachControl(canvas, false);
	//set scene ambient color to green
	scene.clearColor = new BABYLON.Color3(0.2, 0.56, 0.08);
	// Create a basic light, aiming 0,1,0 - meaning, to the sky.
	var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
	// Create a built-in "ground" shape.
	var ground = BABYLON.MeshBuilder.CreateGround('ground1', { height: 2.5, width: 2.5, subdivisions: 2 }, scene);
	// Return the created scene.
	return scene;
}

//cretes random locations for blocks - does not add to scene
var getRandomBlocks = function () {
	var i;
	var block_locations = [];
	for (i = 0; i < 3; i++) {
		x = Math.random() * 2 - 1;
		z = Math.random() * 2 - 1;
		block_locations.push({ 'x': x, 'y': 0.08, 'z': z });
	}
	return block_locations;
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