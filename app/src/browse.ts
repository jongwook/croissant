
module Croissant {
	export class BrowseController {
		path = ['path','to','folder'];
		children = ['Adele_21', 'Adele_22', 'Adele_23'];
		tracks = ['01 Rolling in the Deep','02 Rumor has it','03 Tuming Tables','04 Dont You Remember','05 Set Fire to the Rain','06 He Wont Go','07 Take It All','08 Ill Be Waiting','09 One and Only','10 Lovesong','11 Someone Like You'];
		root: Folder;

		constructor(private $scope, private $location, private safeApply) {
			$scope.vm = this;
			//this.root = Drive.getRoot();

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
			Drive.loadAllFiles();
		}
	}
}