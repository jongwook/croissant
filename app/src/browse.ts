
module Croissant {
	export class BrowseController {
		tracks = ['01 Rolling in the Deep','02 Rumor has it','03 Tuming Tables','04 Dont You Remember','05 Set Fire to the Rain','06 He Wont Go','07 Take It All','08 Ill Be Waiting','09 One and Only','10 Lovesong','11 Someone Like You'];
		root: Folder;
		selected: Folder;

		ancestors: Folder[];
		children: Folder[] = [new Folder(null, "loading...")];

		constructor(private $scope, private $location, private safeApply) {
			$scope.vm = this;
			this.root = Drive.getRoot();
			this.select(Drive.ROOT);

			Drive.onload(function() {
				console.log("Checking if logged in...");
				Drive.authorize(true, () => {
					console.log("Successfully authorized");
					$scope.vm.init();
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
			var self = this;
			Drive.loadAllFiles(() => {
				self.select(Drive.ROOT);
				self.$scope.$apply();
			});
		}

		select(id: string) {
			var folder = Drive.getFolder(id);

			if (!folder) {
				return;
			}

			this.ancestors = [];
			while (folder.parent != null) {
				this.ancestors.unshift(folder);
				folder = folder.parent;
			}

			var c = this.children = [];
			angular.forEach(folder.children, (node) => {
				if (node instanceof Folder) {
					c.push(<Folder>node);
				}
			});
		}

	}
}