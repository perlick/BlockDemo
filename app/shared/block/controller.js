function blockCtrl() {
	var ctrl = this;

	ctrl.delete = function () {
		ctrl.onDelete({ hero: ctrl.hero });
	};

	ctrl.update = function (prop, value) {
		ctrl.onUpdate({ block: ctrl.hero, prop: prop, value: value });
	};
}

angular.module('app.home').component('block', {
	templateUrl: 'app/shared/block/view.html',
	controller: blockCtrl,
	bindings: {
		block: '=',
		onDelete: '&',
		onUpdate: '&'
	}
});