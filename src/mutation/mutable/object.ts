/**
 * Date: 2019-07-09
 * Time: 21:45
 * @license MIT (see project's LICENSE file)
 */

import * as _ from "lodash";

export type RemovableFilter = (value: any, key: string) => boolean;
export type RemovableType = any|RemovableFilter;

/**
 * Deletes the object at the property path in `object`
 */
export function deletePath(object: {[key: string]: any}, path: string): {[key: string]: any} {
	function _delete(_object: {[key: string]: any}, property: string) {
		let index;
		if(_.isArray(_object) && !_.isNaN(index = Number(property))) {
			_object.splice(index, 1);
		} else {
			delete _object[property];
		}
	}

	const index = _.lastIndexOf(path, ".");
	if(index > -1) {
		const property = path.substr(index + 1);
		const parent = _.get(object, path.substr(0, index), {});
		_delete(parent, property);
	} else {
		_delete(object, path);
	}
	return object;
}

/**
 * A variation of lodash's set but only sets if the value is not set:
 * - if object is not set then it defaults to {}
 * - it returns the value at "path"
 * @returns same object passed as <param>object</object>
 */
export function ensure<T>(object: {[key: string]: any}, path: string, value: T): {[key: string]: any} {
	if(!_.has(object, path)) {
		_.set(object, path, value);
	}
	return object;
}

/**
 * Removes properties of objects with <param>removables</param>values. It does not remove <param>removables</param> from arrays
 * but it does recursively process array elements and should they be objects then it will scrub those objects.
 * Note: must be careful to make sure there are no recursive references inside your object.
 * @param object will only process object passing isObject test
 * @param recursive whether to recurse into children properties
 * @param removables object or array of objects that qualify as or test for `remove`
 * @returns same object passed as <param>object</object>
 */
export function scrub(object: {[key: string]: any}|undefined|null, {
	recursive = true,
	removables = [undefined]
}: {
	recursive?: boolean,
	removables?: RemovableType[]
} = {}): {[key: string]: any}|undefined|null {
	if(!_.isArray(removables)) {
		removables = [removables];
	}
	const removableTests = removables.map((item) => (typeof item === "function")
		? item
		: (value: any) => _.isEqual(value, item)) as ((value: any, key: string) => boolean)[];

	function _scrub(object?: any): any {
		if(_.isArray(object)) {
			for(let index = object.length - 1; index > -1; index--) {
				if(recursive) {
					object[index] = _scrub(object[index]);
				}
			}
		} else if(typeof(object) === "object") {
			_.forEach(object, function(value, key, parent) {
				if(recursive) {
					_scrub(value);
				}
				for(let index = removables.length - 1; index > -1; index--) {
					if(removableTests[index](value, key)) {
						delete parent[key];
						break;
					}
				}
			});
		}
		return object;
	}
	return _scrub(object);
}
