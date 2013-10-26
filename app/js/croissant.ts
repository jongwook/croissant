
module Croissant {
	export var croissant = angular.module("croissant", []);

	croissant.config(function($routeProvider) {
		$routeProvider
			.when("/", {
				title: "Croissant",
				template: main.html,
				controller: "Croissant.MainController"
			})
			.when("/auth", {
				title: "Sign in with Google",
				template: auth.html,
				controller: "Croissant.AuthController"
			})
			.otherwise({
				redirectTo: "/"
			})
	});

	croissant.run(function($location, $rootScope) {
		$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
			$rootScope.title = current.$$route.title;
		});
	});

}

