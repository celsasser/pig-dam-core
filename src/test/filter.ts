/**
 * Date: 5/22/20
 * Time: 8:58 PM
 * @license MIT (see project's LICENSE file)
 */


import {TestDescription} from "../types";

/**
 * Filters test descriptions that support the `TestDescription` interface
 */
export function filterTestDescriptions<T extends TestDescription>(suite: T[]): T[] {
	const filtered: {
		enabled: T[],
		exclusive: T[]
	} = {
		enabled: [],
		exclusive: []
	};
	suite.forEach(test => {
		if(!test.disabled) {
			filtered.enabled.push(test);
			if(test.exclusive) {
				filtered.exclusive.push(test);
			}
		}
	});
	return (filtered.exclusive.length > 0)
		? filtered.exclusive
		: filtered.enabled;
}
