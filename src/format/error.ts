/**
 * Date: 10/29/19
 * Time: 9:46 PM
 * @license MIT (see project's LICENSE file)
 */

import * as _ from "lodash";
import {PigError} from "../error";
import {parseStack} from "../stack";
import {FormatErrorModel} from "../types/format";

/**
 * What are our error formatting concerns?
 * - logging? We are going to log the whole error. Formatted messages are a mess in logs
 * - console? Yes, we will either log the message or we will log the whole error if in diagnostics mode
 * - responses? Nah, we send back the error or the model.
 * So, we are going to supply some tools for getting format friendly data. But its up to you to put it together.
 */

/**
 * Converts the error into our own representation of an error
 */
export function errorToFormatModel(error: Error|PigError): FormatErrorModel {
	const cast: PigError = error as PigError;
	return _.omitBy<FormatErrorModel>({
		// note: we don't want to format details here. We only want to format them if we
		// are rendering the error as text
		details: (cast.details !== undefined)
			? cast.details.trim()
			: undefined,
		location: errorToLocation(error),
		message: error.message,
		nested: (cast.error !== undefined)
			? errorToFormatModel(cast.error)
			: undefined,
		stack: parseStack(error).lines
	}, _.isUndefined) as FormatErrorModel;
}

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
