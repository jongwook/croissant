var auth;
(function (auth) {
    auth.html = '<link rel="stylesheet" type="text/css" href="css/auth.css"><div id="auth-content">	<div id="auth-logo">		&#67;roissant	</div>	<div id="auth-login">		<a ng-click="vm.auth()">Sign in with Google</a>	</div></div>';
})(auth || (auth = {}));
var main;
(function (main) {
    main.html = '{{\'Croissant\' + \' \' + \'main\'}}!{{text}}<a href="#/auth">auth</a>';
})(main || (main = {}));
var Croissant;
(function (Croissant) {
    var AuthController = (function () {
        function AuthController($scope) {
            this.hi = "hello";
            $scope.vm = this;
        }
        AuthController.prototype.auth = function () {
            console.log("auth");
        };
        return AuthController;
    })();
    Croissant.AuthController = AuthController;
})(Croissant || (Croissant = {}));
var Croissant;
(function (Croissant) {
    Croissant.croissant = angular.module("croissant", []);

    Croissant.croissant.config(function ($routeProvider) {
        $routeProvider.when("/", {
            title: "Croissant",
            template: main.html,
            controller: "Croissant.MainController"
        }).when("/auth", {
            title: "Sign in with Google",
            template: auth.html,
            controller: "Croissant.AuthController"
        }).otherwise({
            redirectTo: "/"
        });
    });

    Croissant.croissant.run(function ($location, $rootScope) {
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $rootScope.title = current.$$route.title;
        });
    });
})(Croissant || (Croissant = {}));
var Croissant;
(function (Croissant) {
    (function (Type) {
        Type[Type["FILE"] = 0] = "FILE";
        Type[Type["DIRECTORY"] = 1] = "DIRECTORY";
    })(Croissant.Type || (Croissant.Type = {}));
    var Type = Croissant.Type;
})(Croissant || (Croissant = {}));
var Croissant;
(function (Croissant) {
    var MainController = (function () {
        function MainController($scope) {
            $scope.text = "Hello Moduled";
        }
        return MainController;
    })();
    Croissant.MainController = MainController;
})(Croissant || (Croissant = {}));
//# sourceMappingURL=app.js.map
