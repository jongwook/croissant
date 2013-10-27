var Croissant;
(function (Croissant) {
    Croissant.croissant = angular.module("croissant", ["ngRoute"]);

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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Croissant;
(function (Croissant) {
    var Node = (function () {
        function Node(id, name, parent) {
            if (typeof parent === "undefined") { parent = null; }
            this.id = id;
            this.name = name;
            this.parent = parent;
        }
        return Node;
    })();
    Croissant.Node = Node;

    var File = (function (_super) {
        __extends(File, _super);
        function File(id, name, size, url, parent) {
            if (typeof url === "undefined") { url = null; }
            if (typeof parent === "undefined") { parent = null; }
            _super.call(this, id, name);
            this.size = size;
            this.url = url;
            this.parent = parent;
        }
        return File;
    })(Node);
    Croissant.File = File;

    var Folder = (function (_super) {
        __extends(Folder, _super);
        function Folder(id, name, children, parent) {
            if (typeof children === "undefined") { children = {}; }
            if (typeof parent === "undefined") { parent = null; }
            _super.call(this, id, name);
            this.children = children;
            this.parent = parent;
        }
        Folder.prototype.addFolder = function (path, id) {
            if (typeof id === "undefined") { id = null; }
            var components = path.split("/").filter(function (s) {
                return s.length > 0;
            });

            if (components.length > 0) {
                var name = components.shift();

                if (!this.children[name]) {
                    this.children[name] = new Folder(null, name);
                    this.children[name].parent = this;
                }

                if (components.length === 0) {
                    if (this.children[name] instanceof Folder) {
                        this.children[name].id = id;
                        return this.children[name];
                    } else {
                        console.warn(name + " already exists and not a directory");
                    }
                } else if (this.children[name] instanceof Folder) {
                    var child = this.children[name];
                    return child.addFolder(components.join("/"), id);
                } else {
                    console.warn(name + " already exists and not a directory");
                }
            }
        };

        Folder.prototype.addFile = function (path, file) {
            var components = path.split("/").filter(function (s) {
                return s.length > 0;
            });

            if (components.length === 0) {
                var name = file.name;
                file.parent = this;
                this.children[name] = file;
            } else {
                var name = components.shift();

                if (!this.children[name]) {
                    this.children[name] = new Folder(null, name);
                    this.children[name].parent = this;
                }

                if (this.children[name] instanceof Folder) {
                    var child = this.children[name];
                    child.addFile(components.join("/"), file);
                } else {
                    console.warn(name + " already exists and not a directory");
                }
            }
        };
        return Folder;
    })(Node);
    Croissant.Folder = Folder;
})(Croissant || (Croissant = {}));
var Croissant;
(function (Croissant) {
    (function (Drive) {
        var CLIENT_ID = "71188979891.apps.googleusercontent.com";
        var SCOPES = ['https://www.googleapis.com/auth/drive'];

        var QUERY_AUDIO = "mimeType = 'audio/mpeg' and trashed = false";
        var QUERY_FOLDER = "mimeType = 'application/vnd.google-apps.folder' and trashed = false";
        var MAX_RESULTS = 1000;

        Drive.ROOT = "root";

        var callbacks = [];
        var loaded = false;

        var root;
        var files = {};
        var folders = {};

        var extensions = [/.mp3$/, /.wav$/];
        var types = ["audio/mpeg"];

        window["Croissant.Drive.load"] = function () {
            console.log("gapi loaded");

            root = new Croissant.Folder(Drive.ROOT, "My Drive");
            folders[Drive.ROOT] = root;

            gapi.client.load('drive', 'v2', function () {
                loaded = true;
                angular.forEach(callbacks, function (callback) {
                    callback();
                });
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

        function loadAllFiles(callback) {
            var retrieve = function (request) {
                request.execute(function (response) {
                    if (!response || response.error) {
                        console.error(response.error);
                        throw new Error("loadAllFiles error");
                    }
                    var items = response.items.filter(function (item) {
                        return extensions.filter(function (ext) {
                            return item.title.match(ext);
                        }).length;
                    });
                    angular.forEach(items, function (item) {
                        files[item.id] = new Croissant.File(item.id, item.title, item.fileSize, item.downloadUrl);
                    });
                    if (response.nextPageToken) {
                        request = gapi.client.drive.files.list({
                            q: QUERY_AUDIO,
                            maxResults: MAX_RESULTS,
                            'pageToken': response.nextPageToken
                        });
                        retrieve(request);
                    } else {
                        console.log("File loading complete; loading tree");
                        loadFileTree(Drive.ROOT, "", callback);
                    }
                });
            };
            var request = gapi.client.drive.files.list({
                q: QUERY_AUDIO,
                maxResults: MAX_RESULTS,
                trashed: false
            });
            retrieve(request);
        }
        Drive.loadAllFiles = loadAllFiles;

        var loading_filetrees = 0;
        var loading_subtrees = 0;

        function loadSubTree(folderId, path, callback) {
            loading_subtrees++;
            var retrieve = function (request, folderId, path) {
                request.execute(function (response) {
                    if (!response || response.error) {
                        console.error(response.error);
                        throw new Error("loadSubTree error");
                    }
                    angular.forEach(response.items, function (item) {
                        loadFileTree(item.id, path, callback);
                    });
                    if (response.nextPageToken) {
                        request = gapi.client.drive.children.list({
                            folderId: folderId,
                            'pageToken': response.nextPageToken,
                            q: QUERY_FOLDER,
                            maxResults: MAX_RESULTS
                        });
                        retrieve(request, folderId, path);
                    } else {
                        loading_subtrees--;
                        if (loading_filetrees === 0 && loading_subtrees === 0) {
                            console.log("Loading finished");
                            callback(true);
                        }
                    }
                });
            };
            gapi.client.drive.files.get({
                'fileId': folderId
            }).execute(function (item) {
                var request = gapi.client.drive.children.list({
                    folderId: folderId,
                    q: QUERY_FOLDER,
                    maxResults: MAX_RESULTS
                });
                retrieve(request, folderId, path);
            });
        }

        function loadFileTree(folderId, path, callback) {
            loading_filetrees++;
            var retrieve = function (request, folderId, path) {
                request.execute(function (response) {
                    if (!response || response.error) {
                        console.error(response.error);
                        throw new Error("loadFileTree error");
                    }
                    angular.forEach(response.items, function (item) {
                        if (files[item.id]) {
                            var file = files[item.id];
                            console.log("Found " + file.name + " at " + (path ? path : "/"));
                            callback(false);
                            root.addFile(path, file);
                        }
                    });
                    if (response.nextPageToken) {
                        request = gapi.client.drive.children.list({
                            folderId: folderId,
                            q: QUERY_AUDIO,
                            'pageToken': response.nextPageToken,
                            maxResults: MAX_RESULTS
                        });
                        retrieve(request, folderId, path);
                    } else {
                        loading_filetrees--;

                        loadSubTree(folderId, path, callback);
                    }
                });
            };

            gapi.client.drive.files.get({
                'fileId': folderId
            }).execute(function (item) {
                var request = gapi.client.drive.children.list({
                    folderId: folderId,
                    q: QUERY_AUDIO,
                    maxResults: MAX_RESULTS
                });
                var subpath = (folderId === Drive.ROOT) ? "" : path + "/" + item.title;

                if (folderId !== Drive.ROOT) {
                    var folder = root.addFolder(subpath, folderId);
                    folders[folderId] = folder;
                }

                retrieve(request, folderId, subpath);
            });
        }

        function getRoot() {
            return root;
        }
        Drive.getRoot = getRoot;

        function getFolder(id) {
            return folders[id];
        }
        Drive.getFolder = getFolder;

        function getFile(id) {
            return files[id];
        }
        Drive.getFile = getFile;
    })(Croissant.Drive || (Croissant.Drive = {}));
    var Drive = Croissant.Drive;
})(Croissant || (Croissant = {}));
var Croissant;
(function (Croissant) {
    Croissant.croissant.factory("$player", function () {
        var context = new webkitAudioContext();
        var audioSource = context.createBufferSource();
        audioSource.connect(context.destination);

        return {
            play: function (data, callback) {
                callback("Decoding...");
                context.decodeAudioData(data, function (buffer) {
                    callback("Decoding complete!");

                    audioSource.buffer = buffer;
                    audioSource.noteOn(0);
                    audioSource.playbackRate.value = 1;

                    setTimeout(function () {
                        return callback("");
                    }, 1000);
                });
            }
        };
    });

    var PlayerController = (function () {
        function PlayerController($scope, safeApply, $player) {
            this.$scope = $scope;
            this.safeApply = safeApply;
            this.$player = $player;
            this.text = "hello";
            this.playlist = "Basic Playlist";
            this.album = "";
            this.track = "";
            this.status = "";
            console.log("PlayerController constructed");
            $scope.vm = this;

            var self = this;
            $scope.$on("play", function (event, args) {
                return self.play(args);
            });
        }
        PlayerController.prototype.play = function (file) {
            console.log("Playing " + file.name);

            var self = this;
            if (file.url) {
                self.album = file.parent ? file.parent.name : file.name;
                self.track = file.name;

                var accessToken = gapi.auth.getToken().access_token;
                var xhr = new XMLHttpRequest();
                xhr.open('GET', file.url, true);
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
                xhr.responseType = "arraybuffer";
                xhr.onload = function () {
                    self.status = "Buffering complete";
                    self.$player.play(xhr.response, function (status) {
                        return self.safeApply(self.$scope, function () {
                            return self.status = status;
                        });
                    });
                };
                xhr.onerror = function () {
                    console.error("Error while downloading music");
                };
                self.status = "Buffering...";
                xhr.send();
            } else {
                console.warn("Tried to download invalid url : " + file.name);
            }
        };
        return PlayerController;
    })();
    Croissant.PlayerController = PlayerController;
})(Croissant || (Croissant = {}));
var auth;
(function (auth) {
    auth.html = '<div id="auth-content">	<div id="auth-logo">		&#67;roissant	</div>	<div id="auth-login">		<a ng-click="vm.auth()">Sign in with Google</a>	</div></div>';
})(auth || (auth = {}));
var browse;
(function (browse) {
    browse.html = '<div id="container">	<div id="header-bar">		<div id="header">			<div id="header-logo">				&#67;roissant			</div>			<div id="header-search">				<input type="text" placeholder="Search by name, artist, etc.">			</div>			<div id="header-tabs">				<button class="header-tab selected">Google Drive</button><button class="header-tab">My Playlist</button>			</div>		</div>	</div>	<div id="main">		<div id="sidebar">			<ul id="sidebar-folders">				<li>					<span class="folder"></span><span class="child" style="width: 200px" ng-click="vm.select(\'root\')">My Drive</span>				</li>				<li style="padding-left: {{10 * $index}}px" class="{{$index == 0 ? \'deep\' : \'deeper\'}} {{$index + 1 == vm.ancestors.length ? \'selected\' : \'\'}}" ng-repeat="ancestor in vm.ancestors">					<span class="L"></span><span class="folder"></span><span class="child" style="width: {{200 - 10 * $index}}px" ng-click="vm.select(ancestor.id)">{{ancestor.name}}</span>				</li>				<li style="padding-left: {{10 * vm.ancestors.length}}px" class="{{vm.ancestors.length == 0 ? \'deep\' : \'deeper\'}}" ng-repeat="child in vm.children">					<span class="L"></span><span class="folder"></span><span class="child" style="width: {{180 - 10 * vm.ancestors.length}}px" ng-click="vm.select(child.id)">{{child.name}}</span>				</li>			</ul>		</div>		<div id="content">			<div class="tracklist" ng-repeat="(name, tracks) in vm.albums">				<div class="tracklist-album-detail">					<div class="tracklist-album-art">						<img src="images/album.jpg">					</div>					<div class="tracklist-album-title">						{{name}}					</div>				</div>				<div class="tracklist-album-data">					<div>Tracks</div>					<ul class="tracklist-tracks">						<li ng-repeat="track in tracks" ng-click="vm.play(track)">{{track.name}}</li>					</ul>				</div>				<div class="clear"></div>			</div>		</div>	</div>	<div id="player-bar" ng-controller="Croissant.PlayerController">		<div id="player">			<button id="player-prev"></button>			<button id="player-play"></button>			<button id="player-pause"></button>			<button id="player-ff"></button>			<div id="player-album-art"></div>			<div id="player-data">				<p id="player-playlist">{{vm.playlist}}</p>				<p id="player-album">{{vm.album}}</p>				<p id="player-track">{{vm.track}}</p>				<p id="player-slider">{{vm.status}}</p>			</div>			<button id="player-repeat-off" class="player-repeat"></button>			<button id="player-repeat-one" class="player-repeat"></button>			<button id="player-repeat-all" class="player-repeat"></button>			<button id="player-shuffle-off" class="player-shuffle"></button>			<button id="player-shuffle-on" class="player-shuffle"></button>			<button id="player-mute"></button>			<div id="player-volume-slider"></div>		</div>	</div></div>';
})(browse || (browse = {}));
var main;
(function (main) {
    main.html = '<div style="color: #999; margin: 10px;">Loading...</div>';
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
    var BrowseController = (function () {
        function BrowseController($scope, $location, safeApply, $player) {
            this.$scope = $scope;
            this.$location = $location;
            this.safeApply = safeApply;
            this.$player = $player;
            this.tracks = ['01 Rolling in the Deep', '02 Rumor has it', '03 Tuming Tables', '04 Dont You Remember', '05 Set Fire to the Rain', '06 He Wont Go', '07 Take It All', '08 Ill Be Waiting', '09 One and Only', '10 Lovesong', '11 Someone Like You'];
            this.children = [new Croissant.Folder(null, "loading...")];
            this.albums = {};
            this.loaded = false;
            this.completed = false;
            $scope.vm = this;

            this.root = Croissant.Drive.getRoot();
            this.select(Croissant.Drive.ROOT);

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
        BrowseController.prototype.init = function () {
            var _this = this;
            console.log("loading...");
            var self = this;
            Croissant.Drive.loadAllFiles(function (completed) {
                self.completed = completed;
                if (!self.loaded || (self.children.length === 1 && self.children[0].id === null)) {
                    self.select(Croissant.Drive.ROOT, !completed);
                }

                if (self.selected) {
                    _this.reloadAlbums(self.selected);
                }

                self.$scope.$apply();
            });
        };

        BrowseController.prototype.select = function (id, loading) {
            if (typeof loading === "undefined") { loading = false; }
            var folder = Croissant.Drive.getFolder(id);

            if (!folder) {
                return;
            }

            this.selected = folder;

            this.loaded = true;

            this.ancestors = [];
            for (var f = folder; f.parent != null; f = f.parent) {
                this.ancestors.unshift(f);
            }

            var c = [];
            angular.forEach(folder.children, function (node) {
                if (node instanceof Croissant.Folder) {
                    c.push(node);
                }
            });

            if (!(id === Croissant.Drive.ROOT && !this.completed && c.length === 0)) {
                this.children = c;
            }

            this.reloadAlbums(folder);
        };

        BrowseController.prototype.reloadAlbums = function (folder) {
            this.albums = {};
            this.addFiles(folder, this.albums);
            angular.forEach(this.albums, function (album) {
                album.sort(function (x, y) {
                    return x.name > y.name ? 1 : -1;
                });
            });
        };

        BrowseController.prototype.addFiles = function (folder, albums) {
            var self = this;
            angular.forEach(folder.children, function (node) {
                if (node instanceof Croissant.File) {
                    var name = node.parent.name;
                    albums[name] = albums[name] || [];
                    albums[name].push(node);
                } else if (node instanceof Croissant.Folder) {
                    self.addFiles(node, albums);
                }
            });
        };

        BrowseController.prototype.play = function (file) {
            this.$scope.$broadcast("play", file);
        };
        return BrowseController;
    })();
    Croissant.BrowseController = BrowseController;
})(Croissant || (Croissant = {}));
var Croissant;
(function (Croissant) {
    var MainController = (function () {
        function MainController($scope, $location, safeApply) {
            Croissant.Drive.onload(function () {
                console.log("Checking if logged in...");
                Croissant.Drive.authorize(true, function () {
                    console.log("Successfully authorized");
                    safeApply($scope, function () {
                        $location.path("/browse");
                    });
                }, function (error) {
                    console.log("Not authorized; moving to /auth");
                    safeApply($scope, function () {
                        $location.path("/auth");
                    });
                });
            });
        }
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
var Croissant;
(function (Croissant) {
    Croissant.croissant.config(function ($routeProvider) {
        $routeProvider.when("/", {
            title: "Croissant",
            template: main.html,
            controller: "Croissant.MainController"
        }).when("/browse", {
            title: "Croissant",
            template: browse.html,
            controller: "Croissant.BrowseController"
        }).when("/auth", {
            title: "Sign in with Google",
            template: auth.html,
            controller: "Croissant.AuthController"
        }).otherwise({
            redirectTo: "/"
        });
    });
})(Croissant || (Croissant = {}));
//# sourceMappingURL=app.js.map
