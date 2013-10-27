
module Croissant {
	export class MainController {
		constructor($scope, $location, safeApply) {
			Drive.onload(function() {
				console.log("Checking if logged in...");
				Drive.authorize(true, () => {
					console.log("Successfully authorized");
					safeApply($scope, () => {
						$location.path("/browse");
					});
				}, (error: string) => {
					console.log("Not authorized; moving to /auth");
					safeApply($scope, () => {
						$location.path("/auth");
					});
				});
			});
		}
	}
}