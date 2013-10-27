﻿var auth;
(function (auth) {
    auth.html = '<div id="auth-content">	<div id="auth-logo">		&#67;roissant	</div>	<div id="auth-login">		<a ng-click="vm.auth()">Sign in with Google</a>	</div></div>';
})(auth || (auth = {}));
var main;
(function (main) {
    main.html = '<div id="container">	<div id="header-bar">		<div id="header">			<div id="header-logo">				&#67;roissant			</div>			<div id="header-search">				<input type="text" placeholder="Search by name, artist, etc.">			</div>			<div id="header-tabs">				<button class="header-tab selected">Google Drive</button><button class="header-tab">My Playlist</button>			</div>		</div>	</div>	<div id="main">		<div id="sidebar">		</div>		<div id="content">			<div id="tracklist">				<div id="tracklist-album-detail">					<div id="tracklist-album-art">						<img src="http://www.muumuse.com/wp-content/uploads/2011/01/adele-21.jpeg">					</div>					<div id="tracklist-album-title">						Adele_21					</div>					<div id="tracklist-album-options">						⊕⊕					</div>				</div>				<div id="tracklist-album-data">					<div>Tracks</div>					<ul id="tracklist-tracks">						<li>01 Rolling in the Deep</li>						<li>02 Rumor has it</li>						<li>03 Tuming Tables</li>						<li>04 Don\'t You Remember</li>						<li>05 Set Fire to the Rain</li>						<li>06 He Won\'t Go</li>						<li>07 Take It All</li>						<li>08 I\'ll Be Waiting</li>						<li>09 One and Only</li>						<li>10 Lovesong</li>						<li>11 Someone Like You</li>					</ul>				</div>			</div>		</div>	</div>	<div id="player-bar">		<div id="player">		</div>	</div></div>';
})(main || (main = {}));
var Croissant;
(function (Croissant) {
    var AuthController = (function () {
        function AuthController($scope, $location, safeApply) {
            this.$scope = $scope;
            this.$location = $location;
            this.safeApply = safeApply;
            this.hi = "hello";
            $scope.vm = this;
            Croissant.Drive.onload(function () {
                Croissant.Drive.authorize(true, function () {
                    console.log("Already logged in");
                    safeApply($scope, function () {
                        $location.path("/");
                    });
                });
            });
        }
        AuthController.prototype.auth = function () {
            var self = this;
            Croissant.Drive.authorize(false, function () {
                console.log("auth successful!");
                self.safeApply(self.$scope, function () {
                    self.$location.path("/");
                });
            }, function (error) {
                throw new Error("Could not connect to Google Drive : " + error);
            });
        };
        return AuthController;
    })();
    Croissant.AuthController = AuthController;
})(Croissant || (Croissant = {}));
var Croissant;
(function (Croissant) {
    Croissant.croissant = angular.module("croissant", ["ngRoute"]);

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

    Croissant.croissant.factory('safeApply', [
        function ($rootScope) {
            return function ($scope, fn) {
                var phase = $scope.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
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
            };
        }
    ]);
})(Croissant || (Croissant = {}));
var Croissant;
(function (Croissant) {
    (function (Drive) {
        var CLIENT_ID = "71188979891.apps.googleusercontent.com";
        var SCOPES = ['https://www.googleapis.com/auth/drive'];

        var callbacks = [];
        var loaded = false;

        window["Croissant.Drive.load"] = function () {
            loaded = true;
            console.log("api loaded : " + gapi);
            console.log("Callbacks : " + callbacks.length);

            angular.forEach(callbacks, function (callback) {
                callback();
            });
        };

        function onload(callback) {
            if (loaded) {
                callback();
            } else {
                callbacks.push(callback);
            }
        }
        Drive.onload = onload;

        function authorize(immediate, success, failed) {
            gapi.auth.authorize({ 'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': immediate }, function (result) {
                if (result && !result.error) {
                    success();
                } else if (failed) {
                    failed(result ? result.error.toString() : Croissant.toString(result));
                }
            });
        }
        Drive.authorize = authorize;
    })(Croissant.Drive || (Croissant.Drive = {}));
    var Drive = Croissant.Drive;
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
        function MainController($scope, $location, safeApply) {
            var self = this;
            Croissant.Drive.onload(function () {
                console.log("Checking if logged in...");
                Croissant.Drive.authorize(true, function () {
                    console.log("Successfully authorized");
                    self.init();
                }, function (error) {
                    console.log("Not authorized; moving to /auth");
                    safeApply($scope, function () {
                        $location.path("/auth");
                    });
                });
            });
        }
        MainController.prototype.init = function () {
            console.log("loading...");
        };
        return MainController;
    })();
    Croissant.MainController = MainController;
})(Croissant || (Croissant = {}));
var Croissant;
(function (Croissant) {
    function toString(object) {
        if (object === null)
            return "(null)";
        switch (typeof object) {
            case "undefined":
                return "(undefined)";
            case "string":
                return object;
            default:
                return object.toString();
        }
    }
    Croissant.toString = toString;
})(Croissant || (Croissant = {}));
//# sourceMappingURL=app.js.map
