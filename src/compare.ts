/**
 * Date: 7/9/2019
 * Time: 9:10 PM
 * @license MIT (see project's LICENSE file)
 *
 */

import * as _ from "lodash";
import {CompareResultType} from "./types";

/**
 * Compares compareAny object types with handling for undefined objects.
 */
export function compareAny(value1: any, value2: any, {
	ignoreCase = false
} = {}): CompareResultType {
	if(value1 === value2) {
		return 0;
	} else if(value1 == null) {
		return 1;
	} else if(value2 == null) {
		return -1;
	} else if(_.isString(value1) && _.isString(value2)) {
		return compareString(value1, value2, {ignoreCase});
	}
	return _.clamp(value1 - value2, -1, 1) as CompareResultType;
}

/**
 * Compares two strings
 */
export function compareString(s1: string|null|undefined, s2: string|null|undefined, {
	ignoreCase = true
} = {}): CompareResultType {
	if(s1 == null) {
		return (s2 == null)
			? 0
			: 1;
	} else if(s2 == null) {
		return -1;
	} else {
		if(ignoreCase) {
			s1 = s1.toLowerCase();
			s2 = s2.toLowerCase();
		}
		return _.clamp(s1.localeCompare(s2), -1, 1) as CompareResultType;
	}
}
