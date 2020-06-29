/**
 * Date: 10/29/19
 * Time: 9:46 PM
 * @license MIT (see project's LICENSE file)
 */

import * as _ from "lodash";
import {getReverseErrorThrowSequence, PigError} from "../error";
import {groomStack, parseStack} from "../stack";
import {FormatErrorModel, FormatErrorProperties} from "../types/format";
import {indentText} from "./text";


/**
 * Converts the error into our own representation of an error
 */
export function errorToFormatModel(error: Error|PigError): FormatErrorModel {
	const cast: PigError = error as PigError;
	const model: FormatErrorModel = {
		// note: we don't want to format details here. We only want to format them if we
		// are rendering the error as text
		details: (cast.details !== undefined)
			? cast.details.trim()
			: undefined,
		error,
		location: errorToLocation(error),
		message: error.message,
		nested: (cast.error !== undefined)
			? errorToFormatModel(cast.error)
			: undefined,
		stack: parseStack(error).lines
	};
	return model;
}

/**
 * Formats the error with some flexibility supported by `properties`
 */
export function errorModelToString(model: FormatErrorModel, properties: Partial<FormatErrorProperties>): string {
	const indent = "   ";
	function format(model: FormatErrorModel, depth: number = 0): string {
		// todo: how do we want to indent? And then how do we want to accomplish it?
		let text = "";
		if(properties.location && model.location) {
			text = `${text}${model.location}: `;
		}
		text = `${text}${model.message}`;
		if(properties.details && model.details) {
			// do we want to format as such here?
			// const details: string = error.details as string;
			// if(/\n/.test(details)) {
			// 	text = `${text} - details:\n${indentText(error.details as "string", depth + 1)}`;
			// } else {
			// 	text = `${text} - ${error.details}`;
			// }
			text = `${text}\ndetails: ${model.details}`;
		}
		if(properties.recurse && model.nested) {
			text = `${text}\n:error: ${format(model.nested, depth + 1)}`;
		}
		return text;
	}
	const result = format(model);
	// we are agreed that there will only be one stack at the end?
	if(properties.stack && model.stack) {

	}
	return result;
}

/**
 * Breaks the error up into `message` and `stack`. The message you get back depends on the format details you specify.
 * The stack returned is the stack of the first error. That's where the error happened. AND in our world that's where
 * we caught it 'cause nobody else is wrapping errors in errors.
 * @deprecated - get rid of it
 */
export function errorToFormatDetails(error: PigError|Error|string, properties: Partial<FormatErrorProperties>): {
	message: string,
	stack?: string[]
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
export function errorToString(error: PigError|Error, properties: Partial<FormatErrorProperties>): string {
	const model = errorToFormatModel(error);
	return errorModelToString(model, properties);
}

/**
 * Gets error as text with diagnostic information and a stack
 */
export const errorToDiagnosticString: (error: PigError|Error) => string = _.partialRight(errorToString, {
	details: true,
	location: true,
	stack: true
});

/**
 * Gets text with error message only
 */
export const errorToFriendlyString: (error: PigError|Error) => string = _.partialRight(errorToString, {
	details: false,
	location: false,
	stack: false
});

/********************
 * Private Interface
 ********************/
/**
 * We will return as much location information as possible: `module::context.method()`
 */
function errorToLocation(error: Error|PigError): string| undefined {
	if(!(error instanceof PigError)) {
		return undefined;
	} else {
		// we are going to assume that there is more location info if we got the module. Otherwise this guy
		// is going to look a little weird when formatted
		let location = (error.module !== undefined)
			? `${error.module}::`
			: "";
		if(error.context !== undefined && error.method !== undefined) {
			location = `${location}${error.context}.${error.method}()`;
		} else if(error.context) {
			location = `${location}${error.context}`;
		} else if(error.method) {
			location = `${location}${error.method}()`;
		}
		return location;
	}
}

/**
 * Examines the data in the error and does his best to put together a meaningful line[s] of text
 * @param error - error we are formatting
 * @param depth - how deeply nested this error is
 * @deprecated - get rid of it
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

