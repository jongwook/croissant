
module Croissant {
	export function toString(object: any):string {
		if (object === null) return "(null)";
		switch (typeof object) {
			case "undefined":
				return "(undefined)";
			case "string":
				return object;
			default:
				return object.toString();
		}
	}
}