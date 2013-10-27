// abstract music library interface

module Croissant {
	export enum Type {
		FILE, DIRECTORY
	}

	export interface File {
		name: string;
		size: number;
	}

	export interface Drive {
		list(path: string): File[];
	}
}