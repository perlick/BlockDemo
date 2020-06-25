function navCtrl($scope, $location) {
	$scope.isActive = function (viewLocation) {
		return viewLocation === $location.path();
	};
}

angular.module('app').component('nav', {
	templateUrl: 'app/shared/nav/view.html',
	controller: navCtrl
});