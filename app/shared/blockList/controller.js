function blockListCtrl($scope, $element, $attrs) {
	var ctrl = this;

	ctrl.list = $scope.$parent.block_objects;

	ctrl.deleteBlock = function (block) {
		block.dispose(); //remove block from babylon scene
		//delete block from list
		var idx = ctrl.list.indexOf(block);
		if (idx >= 0) {
			ctrl.list.splice(idx, 1);
		}
		//get new block and set as filler
		filler_block = newBlock();
		filler_block.position.x = -1;
		filler_block.position.y = -1;
		filler_block.position.z = -1;
		filler_block.visibility = 0;
		//add filler block to list
		ctrl.list.push(filler_block);
	};
}

angular.module('app.home').component('blockList', {
	templateUrl: 'app/shared/blockList/view.html',
	controller: blockListCtrl
});