// google drive connection utils

module Croissant {

	export module Drive {

		var CLIENT_ID = "71188979891.apps.googleusercontent.com";
		var SCOPES = ['https://www.googleapis.com/auth/drive'];

		var QUERY_AUDIO = "mimeType = 'audio/mpeg' and trashed = false";
		var QUERY_FOLDER = "mimeType = 'application/vnd.google-apps.folder' and trashed = false";
		var MAX_RESULTS = 1000;

		var callbacks: {(): void}[] = [];
		var loaded = false;

		var root: Folder = new Folder("root", "My Drive");
		var files: {[id: string]: File} = {};

		var extensions = [/.mp3$/, /.wav$/];
		var types = ["audio/mpeg"];

		window["Croissant.Drive.load"] = function() {
			console.log("api loaded : " + gapi);
			console.log("Callbacks : " + callbacks.length);

			var self = this;
			gapi.client.load('drive', 'v2', () => {
				self.loaded = true;
				angular.forEach(callbacks, function(callback) {
					callback();
				});
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
			gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': immediate}, (result) => {
				if (result && !result.error) {
					success();
				} else if (failed) {
					failed(result ? result.error.toString() : toString(result));
				}
			});
		}

		export function loadAllFiles() {
			var retrieve = request => {
				request.execute(response => {
					if (!response || response.error) {
						console.error(response.error);
						throw new Error("loadAllFiles error");
					}
					var items = response.items.filter(item => extensions.filter(ext => item.title.match(ext)).length);
					angular.forEach(items, item => {
						//console.log(item.mimeType + ": " + item.title);
						files[item.id] = new File(item.id, item.title, item.fileSize);
					})
					if (response.nextPageToken) {
						request = gapi.client.drive.files.list({
							q: QUERY_AUDIO,
							maxResults: MAX_RESULTS,
							'pageToken': response.nextPageToken,
						});
						retrieve(request);
					} else {
						console.log("File loading complete; loading tree");
						loadFileTree("root", "");
					}
				});
			}
			var request = gapi.client.drive.files.list({
				q: QUERY_AUDIO,
				maxResults: MAX_RESULTS,
				trashed: false
			});
			retrieve(request);
		}

		var loading_filetrees = 0;
		var loading_subtrees = 0;

		function loadSubTree(folderId: string, path: string) {
			loading_subtrees++;
			var retrieve = (request, folderId, path) => {
				request.execute((response) => {
					if (!response || response.error) {
						console.error(response.error);
						throw new Error("loadSubTree error");
					}
					angular.forEach(response.items, (item) => {
						//console.log("subfolder found : " + item.id + " in " + path);
						loadFileTree(item.id, path);
					})
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
						}
					}
				});
			};
			gapi.client.drive.files.get({
				'fileId': folderId
			}).execute((item) => {
				var request = gapi.client.drive.children.list({
					folderId: folderId,
					q: QUERY_FOLDER,
					maxResults: MAX_RESULTS
				});
				retrieve(request, folderId, path);
			});
		}

		function loadFileTree(folderId: string, path: string) {
			loading_filetrees++;
			var retrieve = (request, folderId, path) => {
				request.execute((response) => {
					if (!response || response.error) {
						console.error(response.error);
						throw new Error("loadFileTree error");
					}
					angular.forEach(response.items, (item) => {
						if (files[item.id]) {
							var file = files[item.id];
							console.log("Found " + file.name + " at " + (path ? path : "/"));
							root.addFile(path, new File(item.id, file.name, file.size));
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

						//console.log("Loading tree at " + path + " complete; loading subdirectories");
						loadSubTree(folderId, path);
					}
				});
			}

			gapi.client.drive.files.get({
				'fileId': folderId
			}).execute((item) => {
				var request = gapi.client.drive.children.list({
					folderId: folderId,
					q: QUERY_AUDIO,
					maxResults: MAX_RESULTS
				});
				var subpath = (folderId === "root") ? "" : path + "/" + item.title;
				root.addDirectory(subpath, folderId);
				retrieve(request, folderId, subpath);
			});
		}

		export function getRoot(): Folder {
			return root;
		}
	}
}


