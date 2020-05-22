/**
 * Date: 2019-07-09
 * Time: 21:54
 * @license MIT (see project's LICENSE file)
 */

import {
	findIndex,
	ListIterateeCustom
} from "lodash";

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
		throw new Error("essential search criteria is missing");
	}
	return index;
}
