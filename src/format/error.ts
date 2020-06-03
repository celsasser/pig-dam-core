/**
 * Date: 10/29/19
 * Time: 9:46 PM
 * @license MIT (see project's LICENSE file)
 */

import * as _ from "lodash";
import {getReverseErrorThrowSequence, PigError} from "../error";
import {groomStack} from "../stack";
import {indentText} from "./text";

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
	if(typeof (error) === "string") {
		return error.toString();
	} else {
		/**
		 * Examines the data in the error and does his best to put together a meaningful line[s] of text
		 * @param error - error we are formatting
		 * @param depth - how deeply nested this error is
		 */
		function getErrorDescription(error: Error|PigError, depth: number = 0): string {
			let text = "";
			const message = indentText(error.message, depth, {
				skip: 1
			});
			if(source === false) {
				text = `${text}${message}`;
			} else {
				if("module" in error) {
					text = `${text}${error.module}::`;
				}
				if("context" in error && "method" in error) {
					text = `${text}${error.context}.${error.method}(): ${message}`;
				} else if("context" in error) {
					text = `${text}${error.context}: ${message}`;
				} else if("method" in error) {
					text = `${text}${error.method}(): ${message}`;
				} else {
					text = `${text}${message}`;
				}
			}
			if(details) {
				if("details" in error) {
					const details: string = error.details as string;
					if(/\n/.test(details)) {
						text = `${text} - details:\n${indentText(error.details as "string", depth + 1)}`;
					} else {
						text = `${text} - ${error.details}`;
					}
				}
			}
			return text;
		}

		let result = "";
		const reverseThrowSequence = getReverseErrorThrowSequence(error);
		if(details) {
			reverseThrowSequence.forEach((error, index) => {
				const prefix = (index > 0)
					? `\n[${_.times(index + 1, () => "error").join(" -> ")}] `
					: ``;
				result += `${indentText(prefix, index)}${getErrorDescription(error, index)}`;
			});
		} else {
			result += getErrorDescription(error);
		}

		if(stack) {
			// we are going to report the stack of the first error that was thrown - the origin
			const firstErrorThrown = _.last(reverseThrowSequence) as Error;
			result = `${result}\n${groomStack(firstErrorThrown)}`;
		}
		return result;
	}
}
