/**
 * Date: 10/18/18
 * Time: 10:08 PM
 * @license MIT (see project's LICENSE file)
 *
 */

import {PigError} from "../error";
import {groomStack} from "../stack";

/**
 * todo: we want to be able to take advantage of our error nesting. I'm not sure what to do with
 * it right now from a message standpoint. But we want to be able to recreate the bits and
 * pieces of a failure sequence.
 */

/**
 * Gets text suitable for different purposes. Caller may control the results with
 * <param>details</param>, <param>source</param> and <param>stack</param>
 * @param error
 * @param details - whether to dig the details out of the error or not?
 * @param source - whether to include the source of the error if it is in the error
 * @param stack - whether to include stack or not if <param>message</param> is an Error
 */
export function errorToString(error: PigError|Error|string, {
	details = true,
	source = true,
	stack = false
}: {
	details?: boolean,
	source?: boolean,
	stack?: boolean
} = {}): string {
	let text = "";
	if(typeof (error) === "string") {
		text = `${text}${error}`;
	} else {
		// we have the option of including the module but I think that's excessive.
		// if that amount of info is desired then we will asume that they will include the stack.
		if(source === false) {
			text = `${text}${error.message}`;
		} else if("instance" in error && "method" in error) {
			text = `${text}${error.instance}.${error.method}(): ${error.message}`;
		} else if("instance" in error) {
			text = `${text}${error.instance}: ${error.message}`;
		} else if("method" in error) {
			text = `${text}${error.method}(): ${error.message}`;
		} else {
			text = `${text}${error.message}`;
		}
		if(details) {
			if("details" in error) {
				text = `${text}. ${(error as PigError).details}`;
			} else if("error" in error) {
				text = `${text}. ${error.error}`;
			}
		}
		if(stack) {
			text = `${text}\n${groomStack(error)}`;
		}
	}
	return text;
}
