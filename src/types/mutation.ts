/**
 * Date: 5/23/20
 * Time: 11:37 PM
 * @license MIT (see project's LICENSE file)
 */

import {ListIterateeCustom} from "lodash";

export interface ArrayInsertLocation<T> {
	/**
	 * Insert in index after this element
	 */
	after?: T;
	/**
	 * Insert in index before this element
	 */
	before?: T;
	/**
	 * Insert at this index
	 */
	index?: number,
	/**
	 * Predicate forwarded to lodash
	 */
	predicate?: ListIterateeCustom<T, boolean>
}


export interface ArraySearchCriteria<T> {
	/**
	 * Element to search for
	 */
	element?: any,
	/**
	 * Odd case where index is known. Lets our API remain versatile
	 */
	index?: number,
	/**
	 * Predicate forwarded to lodash
	 */
	predicate?: ListIterateeCustom<T, boolean>
}
