/**
 * Date: 3/24/18
 * Time: 3:40 AM
 * @license MIT (see project's LICENSE file)
 *
 */

import * as _ from "lodash";

/**
 * Offsets <param>data</param>
 */
export function dateAdd(date: Date, {
	days = 0,
	hours = 0,
	millis = 0,
	minutes = 0,
	seconds = 0
}: {
	days?: number,
	hours?: number,
	millis?: number,
	minutes?: number,
	seconds?: number
}): Date {
	const offset = millis
		+ seconds * 1000
		+ minutes * 1000 * 60
		+ hours * 1000 * 60 * 60
		+ days * 1000 * 60 * 60 * 24;
	return new Date(date.getTime() + offset);
}

/**
 * Safely compares dates
 */
export function datesAreEqual(date1?: Date|null, date2?: Date|null): boolean {
	if(date1 === date2) {
		return true;
	} else if(date1 && date2) {
		return date1.getTime() === date2.getTime();
	} else {
		return false;
	}
}


/**
 * Does all he can to convert a string into a date object
 * @throws {Error}
 */
export function dateFromString(text?: string|null): Date|undefined {
	let result;
	if(text != undefined) {
		result = Date.parse(text);
		if(isNaN(result) === false) {
			result = new Date(result);
		} else {
			throw new Error(`invalid date ${text}`);
		}
	}
	return result;
}

/**
 * Looks for the various known flavors of a date: Date, String, Number (assumes epoch)
 * @throws {Error}
 */
export function dateFromValue(value?: Date|number|string|null): Date|undefined {
	if(value == null) {
		return undefined;
	} else if(typeof value === "string") {
		return dateFromString(value);
	} else if(typeof value === "number") {
		return new Date(value);
	} else if(_.isDate(value)) {
		return value;
	}
	throw new Error(`unknown date value ${value}`);
}


/**
 * Allows support for older encodings without millis
 */
export function dateToISOString(date: Date, millis: boolean = true): string {
	const result = date.toISOString();
	return (millis)
		? result
		: result.replace(/\.\d+Z$/, "Z");
}
