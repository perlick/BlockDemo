function blockListCtrl($scope, $element, $attrs) {
	var ctrl = this;

	ctrl.list = $scope.$parent.block_objects;

	ctrl.deleteBlock = function (block) {
		block.dispose(); //remove block from babylon scene
		delete this.list[block.name]; //delete block from block list
	};
}

angular.module('app.home').component('blockList', {
	templateUrl: 'app/shared/blockList/view.html',
	controller: blockListCtrl,
});