/**
 * Date: 2019-07-09
 * Time: 21:54
 * @license MIT (see project's LICENSE file)
 */

import {findIndex} from "lodash";
import {PigError} from "../error";
import {FailurePolicy} from "../types";
import {ArrayInsertLocation, ArraySearchCriteria} from "../types/mutation";

/**
 * Finds the insertion index
 * @throws {Error}
 */
export function findInsertLocation<T>(array: T[], location: ArrayInsertLocation<T>): number {
	if(location.index !== undefined) {
		return location.index;
	} else if(location.after !== undefined) {
		const index = array.indexOf(location.after);
		if(index < 0) {
			throw new PigError({
				message: 'could not find "after" element in array',
				method: findInsertLocation
			});
		}
		return index + 1;
	} else if(location.before !== undefined) {
		const index = array.indexOf(location.before);
		if(index < 0) {
			throw new PigError({
				message: 'could not find "before" element in array',
				method: findInsertLocation
			});
		}
		return index;
	} else if(location.predicate !== undefined) {
		const index = findIndex(array, location.predicate);
		if(index < 0) {
			throw new PigError({
				message: "could not find index by predicate",
				method: findInsertLocation
			});
		}
		return index;
	}
	throw new PigError({
		message: "essential insert criteria is missing",
		method: findInsertLocation
	});
}

/**
 * Find index with given criteria
 * @throws {Error}
 */
export function searchCriteriaToIndex<T>(array: T[], criteria: ArraySearchCriteria<T>, onFail: FailurePolicy = FailurePolicy.Ingore): number {
	if(criteria.element !== undefined) {
		const index = array.indexOf(criteria.element);
		if(index<0 && onFail === FailurePolicy.Throw) {
			throw new PigError({
				message: "could not find specified element in array",
				method: searchCriteriaToIndex
			});
		}
		return index;
	} else if(criteria.predicate !== undefined) {
		const index = findIndex(array, criteria.predicate);
		if(index<0 && onFail === FailurePolicy.Throw) {
			throw new PigError({
				message: "could not find element by predicate",
				method: searchCriteriaToIndex
			});
		}
		return index;
	} else if(criteria.index === undefined) {
		throw new PigError({
			message: "essential search criteria is missing",
			method: searchCriteriaToIndex
		});
	}
	return criteria.index as number;
}
