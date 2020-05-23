/**
 * Date: 10/18/18
 * Time: 10:08 PM
 * @license MIT (see project's LICENSE file)
 *
 */


import {PigError} from "./error";
import {getStack, groomStack} from "./stack";
import * as type from "./type";

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
			text = `${text}${type.name(error.instance)}.${error.method}(): ${error.message}`;
		} else if("instance" in error) {
			text = `${text}${type.name(error.instance)}: ${error.message}`;
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
			text = `${text}\n${groomStack(error.stack, {popCount: 1})}`;
		}
	}
	return text;
}

/**
 * This guy serves up text but text that adheres to a lazy convention we use for assertions and other functionality
 * for which we want lazy processing. The message may be the various things we know of that can be converted to text.
 * @param message
 * @param dfault - if message is null or undefined
 * @param stack - whether to include stack or not if <param>message</param> is an Error
 */
export function messageToString(message?: string|Error|(() => string), {
	dfault = "",
	stack = false
} = {}): string {
	if(message instanceof Error) {
		return errorToString(message, {stack});
	} else {
		let text;
		if(typeof (message) === "function") {
			text = message();
		} else {
			text = (message)
				? message.toString()
				: dfault;
		}
		if(stack) {
			text += `\n${getStack({popCount: 1})}`;
		}
		return text;
	}
}
