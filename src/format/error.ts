/**
 * Date: 10/29/19
 * Time: 9:46 PM
 * @license MIT (see project's LICENSE file)
 */

import * as _ from "lodash";
import {getReverseErrorThrowSequence, PigError} from "../error";
import {groomStack} from "../stack";
import {FormatErrorProperties} from "../types/format";
import {indentText} from "./text";

/**
 * Gets error as both `message` and optionally `stack`. By default includes details and stack.
 */
export function errorToFormatDetails(error: PigError|Error|string, properties: FormatErrorProperties = {
	details: true,
	stack: true
}): {
	message: string,
	stack?: string
} {
	if(typeof (error) === "string") {
		return {
			message: error
		};
	} else {
		let message = "";
		const reverseThrowSequence = getReverseErrorThrowSequence(error);

		if(properties.details === false) {
			message = `${message}${error.message}`;
		} else {
			reverseThrowSequence.forEach((error, index) => {
				const prefix = (index > 0)
					? `\n[${_.times(index + 1, () => "error").join(" -> ")}] `
					: ``;
				message += `${indentText(prefix, index)}${getErrorDetails(error, index)}`;
			});
		}

		if(properties.stack) {
			return {
				message,
				// we are going to report the stack of the first error that was thrown - the origin
				stack: groomStack(_.last(reverseThrowSequence) as Error)
			};
		} else {
			return {
				message
			};
		}
	}
}


/**
 * Gets error as text
 */
export function errorToString(error: PigError|Error|string, properties: FormatErrorProperties = {
	details: true,
	stack: true
}): string {
	const details = errorToFormatDetails(error, properties);
	if(details.stack) {
		return `${details.message}\n${details.stack}`;
	} else {
		return details.message;
	}
}

/**
 * Gets text with `details` and a `stack`
 */
export const errorToDiagnosticString: (error: PigError|Error|string) => string = errorToString;
/**
 * Gets text with error message only
 */
export const errorToFriendlyString: (error: PigError|Error|string) => string = _.partialRight(errorToString, {
	details: false,
	stack: false
});

/********************
 * Private Interface
 ********************/
/**
 * Examines the data in the error and does his best to put together a meaningful line[s] of text
 * @param error - error we are formatting
 * @param depth - how deeply nested this error is
 */
function getErrorDetails(error: Error|PigError, depth: number = 0): string {
	let text = "";
	const message = indentText(error.message, depth, {
		skip: 1
	});
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
	if("details" in error) {
		const details: string = error.details as string;
		if(/\n/.test(details)) {
			text = `${text} - details:\n${indentText(error.details as "string", depth + 1)}`;
		} else {
			text = `${text} - ${error.details}`;
		}
	}
	return text;
}

