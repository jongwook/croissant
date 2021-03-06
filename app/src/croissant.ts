
module Croissant {
	export var croissant = angular.module("croissant", ["ngRoute"]);

	croissant.run(($location, $rootScope) => {
		$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
			$rootScope.title = current.$$route.title;
		});
	});

	croissant.factory('safeApply', [function($rootScope) {
		return function($scope, fn) {
			var phase = $scope.$root.$$phase;
			if(phase == '$apply' || phase == '$digest') {
				if (fn) {
					$scope.$eval(fn);
				}
			} else {
				if (fn) {
					$scope.$apply(fn);
				} else {
					$scope.$apply();
				}
			}
		}
	}])
}

