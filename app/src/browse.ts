
module Croissant {
	export class BrowseController {
		tracks = ['01 Rolling in the Deep','02 Rumor has it','03 Tuming Tables','04 Dont You Remember','05 Set Fire to the Rain','06 He Wont Go','07 Take It All','08 Ill Be Waiting','09 One and Only','10 Lovesong','11 Someone Like You'];
		root: Folder;
		selected: Folder;

		ancestors: Folder[];
		children: Folder[] = [new Folder(null, "loading...")];
		albums: {[album: string]: File[]} = {};

		constructor(private $scope, private $location, private safeApply, private $player) {
			$scope.vm = this;

			this.root = Drive.getRoot();
			this.select(Drive.ROOT);

			var self = this;
			Drive.onload(function() {
				console.log("Checking if logged in...");
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

		loaded = false;
		completed = false;

		init() {
			console.log("loading...");
			var self = this;
			Drive.loadAllFiles((completed) => {
				self.completed = completed;
				if (!self.loaded || (self.children.length === 1 && self.children[0].id === null)) {
					self.select(Drive.ROOT, !completed);
				}

				if (self.selected) {
					this.reloadAlbums(self.selected);
				}

				self.$scope.$apply();
			});
		}

		select(id: string, loading: boolean = false) {
			var folder = Drive.getFolder(id);

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
			angular.forEach(folder.children, (node) => {
				if (node instanceof Folder) {
					c.push(<Folder>node);
				}
			});

			if (!(id === Drive.ROOT && !this.completed && c.length === 0)) {
				this.children = c;
			}

			this.reloadAlbums(folder);
		}

		reloadAlbums(folder: Folder) {
			this.albums = {};
			this.addFiles(folder, this.albums);
			angular.forEach(this.albums, (album) => {
				album.sort((x, y) => x.name > y.name ? 1 : -1);
			});
		}

		addFiles(folder: Folder, albums: {[album: string]: File[]}) {
			var self = this;
			angular.forEach(folder.children, (node) => {
				if (node instanceof File) {
					var name = node.parent.name;
					albums[name] = albums[name] || [];
					albums[name].push(<File>node);
				} else if (node instanceof Folder) {
					self.addFiles(<Folder>node, albums);
				}
			});
		}

		play(file: File) {
			this.$scope.$broadcast("play", file);
		}
	}
}