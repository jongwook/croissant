// abstract music library interface

module Croissant {
	export class Node {
		constructor(public id: string, public name: string, public parent: Folder = null) {

		}
	}

	export class File extends Node {
		constructor(id: string, name: string, public size: number, public parent: Folder = null) {
			super(id, name);
		}
	}

	export class Folder extends Node {
		constructor(id: string, name: string, public children: {[name: string]: Node} = {}, public parent: Folder = null) {
			super(id, name);
		}

		addDirectory(path: string, id: string = null) {
			var components = path.split("/").filter(s => s.length > 0);

			if (components.length > 0) {
				var name = components.shift();

				if (!this.children[name]) {
					this.children[name] = new Folder(null, name);
					this.children[name].parent = this;
				}

				if (components.length === 0) {
					this.children[name].id = id;
				} else if (this.children[name] instanceof Folder) {
					var child = <Folder>this.children[name];
					child.addDirectory(components.join("/"), id);
				} else {
					console.warn(name + " already exists and not a directory");
				}
			}
		}

		addFile(path: string, file: File) {
			var components = path.split("/").filter(s => s.length > 0);

			console.log("Adding " + file.name + " at " + path);

			if (components.length === 0) {
				var name = file.name;
				file.parent = this;
				this.children[name] = file;
			} else {
				var name = components.shift();

				if (!this.children[name]) {
					this.children[name] = new Folder(null, name);
				}

				if (this.children[name] instanceof Folder) {
					var child = <Folder>this.children[name];
					child.addFile(components.join("/"), file);
				} else {
					console.warn(name + " already exists and not a directory");
				}
			}
		}
	}

}