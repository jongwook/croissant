
module Croissant {
	croissant.config(($routeProvider) => {
		$routeProvider
			.when("/", {
				title: "Croissant",
				template: main.html,
				controller: "Croissant.MainController"
			})
			.when("/browse", {
				title: "Croissant",
				template: browse.html,
				controller: "Croissant.BrowseController"
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

}