
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

	var INSTANCE = null;

	export class PlayerController {
		text = "hello";
		playlist = "Basic Playlist";
		album = "";
		track = "";
		status = "";

		listener = null;

		constructor(private $scope, private safeApply, private $player) {
			console.log("PlayerController constructed");
			$scope.vm = this;

			var self = this;
			$scope.$on("play", (event, args) => self.play(args));

			self.listener = $("#listener");
		}

		play(file: File) {
			var self = this;

			console.log("Playing " + file.name);

			console.log("loading nacl...");
			console.log("loaded nacl");
			if (file.url) {
				self.album = file.parent ? file.parent.name : file.name;
				self.track = file.name;

				self.status = "loading...";
				var accessToken = gapi.auth.getToken().access_token;
				message("token", accessToken);
				message("load", file.url);


			} else {
				console.warn("Tried to download invalid url : " + file.name);
			}

		}


	}

	export function onload() {
		console.log("NaCl app loaded");
		INSTANCE = document.getElementById('croissant');
	}

	export function onmessage(message) {
		for (var opcode in message.data) {
			if (!message.data.hasOwnProperty(opcode)) continue;

			var handler = {
				"log": function(m) { console.log(m.toString()); },
				"debug": function(m) { console.debug(m.toString()); },
				"info": function(m) { console.info(m.toString()); },
				"warn": function(m) { console.warn(m.toString()); },
				"error": function(m) { console.error(m.toString()); },
				"alert": function(m) { alert(m.toString()); }
			}[opcode];
			if (!handler) {
				console.warn("handler not found for message: " + JSON.stringify(message.data));
			}

			var operand = message.data[opcode];
			handler(operand);
		}
	}

	export function message(opcode:string, operand: any) {
		if (INSTANCE) {
			var message = {};
			message[opcode] = operand;
			INSTANCE.postMessage(message);
		}
	}
}