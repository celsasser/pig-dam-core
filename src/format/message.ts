/**
 * Date: 10/29/19
 * Time: 9:46 PM
 * @license MIT (see project's LICENSE file)
 */

import {getStack} from "../stack";
import {errorToString} from "./error";


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

