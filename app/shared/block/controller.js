function blockCtrl() {
	var ctrl = this;

	ctrl.delete = function () {
		ctrl.onDelete({ block: ctrl.block });
	};
}

angular.module('app.home').component('block', {
	templateUrl: 'app/shared/block/view.html',
	controller: blockCtrl,
	bindings: {
		block: '=',
		onDelete: '&'
	}
});