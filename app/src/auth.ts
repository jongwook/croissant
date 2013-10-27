
module Croissant {
	export class AuthController {
		hi = "hello";

		constructor(private $scope, private $location, private safeApply) {
			$scope.vm = this;
			Drive.onload(() => {
				Drive.authorize(true, () => {
					console.log("Already logged in");
					safeApply($scope, () => {
						$location.path("/");
					});
				});
			})
		}

		auth() {
			var self = this;
			Drive.authorize(false, () => {
				console.log("auth successful!");
				self.safeApply(self.$scope, () => {
					self.$location.path("/");
				});
			}, (error: string) => {
				throw new Error("Could not connect to Google Drive : " + error);
			})
		}
	}
}

