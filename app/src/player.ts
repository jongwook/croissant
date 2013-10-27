
module Croissant {

	croissant.factory("$player", function() {
		var player = document.createElement("audio");

		$(player).bind({
			play: () => {
				console.log("onplay");
			},
			pause: () => {
				console.log("onpause");
			},
			error: (err) => {
				console.log("onerrror : " + err);
			},
			timeupdate: () => {
				console.log("ontimeupdate");
			},
			progress: () => {
				console.log("onprogress");
			},
			ended: () => {
				console.log("onended");
			}
		});

		document.body.appendChild(player);

		return {
			foo: "bar"
		};
	});

	export class PlayerController {
		text = "hello";

		constructor($scope, $player) {
			console.log("PlayerController constructed");
			$scope.vm = this;
			this.text = $player.foo;
		}


	}
}