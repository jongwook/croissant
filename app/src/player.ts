
module Croissant {
	declare var webkitAudioContext: any;

	croissant.factory("$player", function() {
		var context = new webkitAudioContext();
		var audioSource = context.createBufferSource();
		audioSource.connect(context.destination);

		return {
			play: (data: ArrayBuffer, callback: (status:string) => void) => {
				callback("Decoding...");
				context.decodeAudioData(data, function(buffer) {
					callback("Decoding complete!");

					audioSource.buffer = buffer;
					audioSource.noteOn(0);
					audioSource.playbackRate.value = 1;

					setTimeout(() => callback(""), 1000);
				});
			}
		};
	});

	export class PlayerController {
		text = "hello";
		playlist = "Basic Playlist";
		album = "";
		track = "";
		status = "";

		constructor(private $scope, private safeApply, private $player) {
			console.log("PlayerController constructed");
			$scope.vm = this;

			var self = this;
			$scope.$on("play", (event, args) => self.play(args));
		}

		play(file: File) {
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
				xhr.onload = function() {
					self.status = "Buffering complete";
					self.$player.play(xhr.response, (status: string) => self.safeApply(self.$scope, () => self.status = status));
				};
				xhr.onerror = function() {
					console.error("Error while downloading music");
				};
				self.status = "Buffering...";
				xhr.send();
			} else {
				console.warn("Tried to download invalid url : " + file.name);
			}
		}


	}
}