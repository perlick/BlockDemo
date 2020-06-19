function blockListCtrl($scope, $element, $attrs) {
	var ctrl = this;

	//ctrl.list = $scope.$parent.block_objects;

	ctrl.updateBlock = function (block, prop, value) {
		block[prop] = value;
	};

	ctrl.deleteBlock = function (block) {
		var idx = ctrl.list.indexOf(block);
		if (idx >= 0) {
			ctrl.list.splice(idx, 1);
		}
	};
}

angular.module('app.home').component('blockList', {
	templateUrl: 'app/shared/blockList/view.html',
	controller: blockListCtrl,
	bindings : {
		list: '='
	}
});