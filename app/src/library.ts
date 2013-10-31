// abstract music library interface

module Croissant {
	export class Node {
		constructor(public id: string, public name: string, public parent: Folder = null) {

		}
	}

	export class File extends Node {
		constructor(id: string, name: string, public size: number, public url: string = null, public parent: Folder = null) {
			super(id, name);
		}
	}

	export class Folder extends Node {
		constructor(id: string, name: string, public children: {[name: string]: Node} = {}, public parent: Folder = null) {
			super(id, name);
		}

		addFolder(path: string, id: string = null): Folder {
			var components = path.split("/").filter(s => s.length > 0);

			if (components.length > 0) {
				var name = components.shift();

				if (!this.children[name]) {
					this.children[name] = new Folder(null, name);
					this.children[name].parent = this;
				}

				if (components.length === 0) {
					if (this.children[name] instanceof Folder) {
						this.children[name].id = id;
						return <Folder>this.children[name];
					} else {
						console.warn(name + " already exists and not a directory");
					}
				} else if (this.children[name] instanceof Folder) {
					var child = <Folder>this.children[name];
					return child.addFolder(components.join("/"), id);
				} else {
					console.warn(name + " already exists and not a directory");
					return null;
				}
			}
		}

		addFile(path: string, file: File) {
			var components = path.split("/").filter(s => s.length > 0);

			if (components.length === 0) {
				var name = file.name;
				file.parent = this;
				this.children[name] = file;
			} else {
				var name = components.shift();

				if (!this.children[name]) {
					this.children[name] = new Folder(null, name);
					this.children[name].parent = this;
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