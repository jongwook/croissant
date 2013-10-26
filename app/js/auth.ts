/// <reference src="croissant.ts" />

module Croissant {
	export class AuthController {
		hi = "hello";

		constructor($scope) {
			$scope.vm = this;
		}

		auth() {
			console.log("auth");
		}
	}
}

