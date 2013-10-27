/// <reference path="croissant.ts">
/// <reference path="drive.ts">

module Croissant {
	export class MainController {
		constructor($scope, $location, safeApply) {
			var self = this;
			Drive.onload(function() {
				Drive.authorize(true, () => {
					console.log("Successfully authorized");
					self.init();
				}, (error: string) => {
					console.log("Not authorized; moving to /auth");
					safeApply($scope, () => {
						$location.path("/auth");
					});
				});
			});
		}

		init() {
			console.log("loading...");
		}
	}
}