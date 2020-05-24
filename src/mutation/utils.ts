/**
 * Date: 2019-07-09
 * Time: 21:54
 * @license MIT (see project's LICENSE file)
 */

import {findIndex, ListIterateeCustom} from "lodash";
import {PigError} from "../error";
import {ArrayInsertLocation} from "../types/mutation";

/**
 * Finds the insertion index
 * @throws {Error}
 */
export function findInsertLocation<T>(array: T[], location: ArrayInsertLocation<T>): number {
	if(location.index !== undefined) {
		return location.index;
	} else if(location.after !== undefined) {
		return array.indexOf(location.after) + 1;
	} else if(location.before !== undefined) {
		return array.indexOf(location.before);
	}
	throw new PigError({
		message: "no insertion information",
		method: findInsertLocation
	});
}

/**
 * Find index with given criteria
 * @param array - array to search within
 * @param element - optional element to search for
 * @param index - odd case where index is known. Lets our API remain versatile
 * @param predicate - that will be used by lodash to find our man
 * @throws {Error}
 */
export function searchCriteriaToIndex<T>(array: T[], {element, index, predicate}: {
	element?: any,
	index?: number,
	predicate?: ListIterateeCustom<T, boolean>
}): number {
	if(element !== undefined) {
		index = array.indexOf(element);
	} else if(predicate !== undefined) {
		index = findIndex(array, predicate);
	} else if(index === undefined) {
		throw new PigError({
			message: "essential search criteria is missing",
			method: searchCriteriaToIndex
		});
	}
	return index;
}
