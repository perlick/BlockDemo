'use strict';

angular.module('app.examples', ['ngRoute'])

	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/examples', {
			templateUrl: 'app/components/examples/view.html',
			controller: 'examplesCtrl'
		});
	}])

	.controller('examplesCtrl', function ($scope) {
		console.log("ran");
		//functions for reset and shuffle buttons
	});