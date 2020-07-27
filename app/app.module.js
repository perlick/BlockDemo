'use strict';

var app = angular.module("app", [
	'ngRoute',
	'app.home'
])
.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('!');
	$routeProvider.otherwise({ redirectTo: '/home' });
}])
.controller('appCtrl', ['$scope', function ($scope) {
	var block_locations = getRandomBlocks();
	block_locations = fixAllBlockLocations(block_locations);

	//this always stores the current board config. 
	//Used to recover locations after leaving home tab
	$scope.block_locations = block_locations; 

	//used to store locations for the reset button
	$scope.block_locations_original = block_locations;
}]);