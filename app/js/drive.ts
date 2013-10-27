// google drive connection utils

module Croissant {

	export module Drive {
		var CLIENT_ID = "71188979891.apps.googleusercontent.com";
		var SCOPES = ['https://www.googleapis.com/auth/drive'];

		var callbacks: {(): void}[] = [];
		var loaded = false;

		window["Croissant.Drive.load"] = function() {
			loaded = true;
			console.log("api loaded : " + gapi);
			console.log("Callbacks : " + callbacks.length);

			angular.forEach(callbacks, function(callback) {
				callback();
			});
		}

		export function onload(callback: () => void) {
			if (loaded) {
				callback();
			} else {
				callbacks.push(callback);
			}
		}

		export function authorize(immediate: boolean, success: () => void, failed?: (error: string) => void) {
			gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': immediate}, (result: GoogleApiOAuth2TokenObject) => {
				if (result && !result.error) {
					success();
				} else if (failed) {
					failed(result ? result.error.toString() : toString(result));
				}
			});
		}
	}
}


