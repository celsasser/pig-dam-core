/**
 * Date: 2019-07-09
 * Time: 21:45
 * @license MIT (see project's LICENSE file)
 */

import * as _ from "lodash";
import {compareAny} from "../../compare";
import {ArrayInsertLocation} from "../../types/mutation";
import {findInsertLocation, searchCriteriaToIndex} from "../utils";


/**
 * Adds element.
 * @param array - may be null provided that this is an "dateAdd" operation
 * @param element - element to be inserted
 * @param location - optional location information
 * @throws {Error}
 */
export function add<T>(array: T[], element: T, location?: ArrayInsertLocation<T>): T[] {
	if(!array) {
		array = [];
	}
	if(location) {
		const index = findInsertLocation(array, location);
		array.splice(index, 0, element);
	} else {
		array.push(element);
	}
	return array;
}

/**
 * Concatenates <param>array</param> and <param>elements</param>
 * @param array - may be null provided that there is no <param>index</param>
 * @param elements - elements be added or inserted
 * @param location - optional location information
 * @throws {Error}
 */
export function concat<T>(array: T[], elements: T[], location?: ArrayInsertLocation<T>): T[] {
	if(!array) {
		array = [];
	}
	if(location === undefined) {
		_.each(elements, function(element) {
			array.push(element);
		});
	} else {
		const index = findInsertLocation(array, location);
		_.each(elements, function(element, offset) {
			return array.splice(index + offset, 0, element);
		});
	}
	return array;
}

/**
 * Performs omit on each element in the specified array
 */
export function omit(array: object[], path: string): object[] {
	_.forEach(array, (object, index) => {
		array[index] = _.omit(object, path);
	});
	return array;
}

/**
 * Performs pick on each element in the specified array
 */
export function pick(array: object[], path: string): object[] {
	_.forEach(array, (object, index) => {
		array[index] = _.pick(object, path);
	});
	return array;
}

/**
 * @param array - array from which to remove element
 * @param element - optional element to remove
 * @param index - optional case where index is known
 * @param predicate - that will be used by lodash to find our man
 */
export function remove<T>(array: T[], {element, index, predicate}: {
	element?: T,
	index?: number,
	predicate?: _.ListIterateeCustom<T, boolean>
}): T[] {
	index = searchCriteriaToIndex(array, {element, index, predicate});
	if(index > -1) {
		array.splice(index, 1);
	}
	return array;
}

/**
 * @param array - array from which to remove element
 * @param newElement - element to replace found searched for element
 * @param element - optional element to remove
 * @param index - optional case where index is known
 * @param predicate - that will be used by lodash to find our man
 * @throws {Error} if existing element cannot be found
 */
export function replace<T>(array: T[], newElement: T, {element, index, predicate}: {
	element?: T,
	index?: number,
	predicate?: _.ListIterateeCustom<T, boolean>
}): T[] {
	index = searchCriteriaToIndex(array, {element, index, predicate});
	if(index > -1) {
		array[index] = newElement;
	} else {
		throw new Error("mutable.array.replace(): Could not find element to replace");
	}
	return array;
}

/**
 * sorts array of objects by property key
 */
export function sort(array: {[key: string]: any}[], property: string, {
	comparer = compareAny,
	reverse = false
} = {}): {[key: string]: any}[]|undefined {
	if(array) {
		array.sort((o1, o2) => comparer(_.get(o1, property), _.get(o2, property)));
		if(reverse) {
			array.reverse();
		}
	}
	return array;
}
