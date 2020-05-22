/**
 * Date: 3/5/2018
 * Time: 9:10 PM
 * @license MIT (see project's LICENSE file)
 */


const order = [
	"debug",
	"info",
	"warn",
	"error",
	"fatal"
];

export enum Severity {
	DEBUG = "debug",
	INFO = "info",
	WARN = "warn",
	ERROR = "error",
	FATAL = "fatal"
}

/**
 * Is the <param>severity</param> param greater than or equal to the <param>threshold</param> param
 */
export function testSeverity(value: Severity, threshold: Severity): boolean {
	return order.indexOf(value) >= order.indexOf(threshold);
}
