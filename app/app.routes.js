app.config(function ($stateProvider, $urlRouterProvider) {
	var states = [
		{
			name: 'home',
			url: '/home',
			templateURL: './components/home/view.html',
			controller: 'homeController'
		},
		{
			name: 'example',
			url: '/example',
			template: '<h1>This is about</h1>'
		}
	];
	states.forEach((state) => $stateProvider.state(state));
	$urlRouterProvider.otherwise('/');
});

app.run(function ($http, $templateRequest) {
	$templateRequest('app/components/home/view.html');
})