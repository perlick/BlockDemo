'use strict';

var app = angular.module("app", [
	'ngRoute',
	'app.home',
	'app.examples'
]).
	config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
		$locationProvider.hashPrefix('!');

		$routeProvider.otherwise({ redirectTo: '/home' });
	}]);
