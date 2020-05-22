/**
 * Date: 2019-07-09
 * Time: 21:45
 * @license MIT (see project's LICENSE file)
 */

import * as _ from "lodash";
import * as mutable from "../mutable/object";


/**
 * Clones an object or object path
 * @param object
 * @param path - It minimized the amount of data that needs to be cloned
 * @param {boolean} deep
 * @returns {Object}
 */
export function clone(object: {[key: string]: any}, {
	deep = false,
	path
}: {
	deep?: boolean
	path?: string,
} = {}): {[key: string]: any} {
	if(path == null || path.length === 0) {
		return (deep)
			? _.cloneDeep(object)
			: Object.assign({}, object);
	} else {
		const parts = path.split(".");
		object = _.clone(object);
		object[parts[0]] = clone(object[parts[0]], {
			deep,
			path: parts.slice(1).join()
		});
		return object;
	}
}

/**
 * Deletes the object at the property path in <code>object</code>
 * @param {Object|Array|null} object
 * @param {string} path
 * @returns {Object|Array}
 */
export function deletePath(object: {[key: string]: any}, path: string): {[key: string]: any} {
	return mutable.deletePath(_.cloneDeep(object), path);
}

/**
 * A variation of lodash's set but only sets if the value is not set:
 * - if object is not set then it defaults to {}
 * - it returns the value at "path"
 */
export function ensure<T>(object: {[key: string]: any}, path: string, value: T): {[key: string]: any} {
	return mutable.ensure(_.cloneDeep(object), path, value);
}

/**
 * Removes properties of objects with <param>removables</param>values. It does not remove <param>removables</param> from arrays
 * but it does recursively process array elements and should they be objects then it will scrub those objects.
 * Note: must be careful to make sure there are no recursive references inside your object.
 * @param object will only process object passing isObject test
 * @param recursive whether to recurse into children properties
 * @param removables object or array of objects that qualify as or test for `remove`
 */
export function scrub(object: {[key: string]: any}|null|undefined, {
	recursive = true,
	removables = [undefined]
}: {
	recursive?: boolean,
	removables?: mutable.RemovableType[],
} = {}): {[key: string]: any}|null|undefined {
	return mutable.scrub(_.cloneDeep(object), {
		recursive,
		removables
	});
}

/**
 * Recursively sorts object's properties
 */
export function sort(object: any): any {
	if(object != null) {
		if(_.isPlainObject(object)) {
			return Object.keys(object)
				.sort()
				.reduce((result: {[key: string]: any}, key) => {
					result[key] = sort(object[key]);
					return result;
				}, {});
		} else if(_.isArray(object)) {
			return object.map(sort);
		}
	}
	return object;
}
