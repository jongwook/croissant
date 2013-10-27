
module Croissant {
	declare var webkitAudioContext: any;

	croissant.factory("$player", function() {
		var player = document.createElement("audio");
		var context = new webkitAudioContext();
		var $player = $(player);
		$player.bind({
			play: () => {
				console.log("onplay");
			},
			pause: () => {
				console.log("onpause");
			},
			error: (err) => {
				console.log("onerrror", err);
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
			play: (data: ArrayBuffer) => {
				console.log("decoding : " + typeof data);
				context.decodeAudioData(data, function(buffer) {
					console.log("Decoded to : " + typeof buffer);
					var audioSource = context.createBufferSource();
					audioSource.connect(context.destination);

					audioSource.buffer = buffer;
					audioSource.noteOn(0);
					audioSource.playbackRate.value = 1;
				});
			}
		};
	});

	export class PlayerController {
		text = "hello";
		playlist = "Basic Playlist";
		album = "";
		track = "";

		constructor(private $scope, private $player) {
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
					console.log("Got it : " + typeof(xhr.response));
					self.$player.play(xhr.response);
				};
				xhr.onerror = function() {
					console.error("Error while downloading music");
				};
				console.log("Downloading " + file.url + " ...");
				xhr.send();
			} else {
				console.warn("Tried to download invalid url : " + file.name);
			}
		}


	}
}