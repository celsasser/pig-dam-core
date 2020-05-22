/**
 * Date: 2/8/18
 * Time: 9:48 PM
 * @license MIT (see project's LICENSE file)
 *
 */

import * as _ from "lodash";
import {
	getHttpStatusText,
	HttpStatusCode
} from "./types";


/**
 * Custom Error type that supports some "smart" constructors. And some property annotation support
 */
export class PigError extends Error {
	public readonly details?: string;
	public readonly error?: Error;
	public readonly instance?: {[index: string]: any}|string;
	public readonly method?: string;
	public readonly statusCode?: HttpStatusCode|number;

	/**
	 * General purpose pig error that hold all of our secrets.  He is designed to stash information
	 * related to the error so that we capture and report relevant info.  You may specify a number
	 * of predefined params and include additional ones.  You must supply something that constitutes
	 * a "message".  This can come from "message", "error", "code" or "instance"...though instance
	 * probably does not make for a very good message.
	 * @param details - details in addition to the principle error or message
	 * @param error - error that will be promoted to "message" or "details" if they are not specified.
	 * @param instance - instance of object in which the error occurred
	 * @param message
	 * @param method - calling method
	 * @param statusCode - http code to associate with error. See <link>./enum/http.js</link> for enums
	 * @param properties - additional properties that you want captured and logged.
	 */
	constructor({details, error, instance, message, method, statusCode, ...properties}: {
		details?: string,
		error?: PigError|Error|string,
		instance?: object|string,
		message?: string,
		method?: string,
		statusCode?: HttpStatusCode|number
	}) {
		function getMostImportant(preferredProperty: string): any {
			let result;
			if(leftovers[preferredProperty]) {
				result = leftovers[preferredProperty];
				delete leftovers[preferredProperty];
			} else if(leftovers.error) {
				result = leftovers.error.message;
				delete leftovers.error;
			} else if(leftovers.statusCode) {
				result = `${getHttpStatusText(leftovers.statusCode)} (${leftovers.statusCode})`;
				delete leftovers.statusCode;
			}
			return result;
		}

		const leftovers = Object.assign({}, arguments[0]);
		super(message || getMostImportant("message"));
		if(error) {
			if(!_.isError(error)) {
				error = new Error(error);
			}
			// so that we can trace things to the true origin we steal his stack. There may be times at which we don't want to do this?
			this.stack = error.stack;
			// steal goodies that we want to inherit
			if((error as PigError).statusCode) {
				statusCode = (error as PigError).statusCode;
			}
		}
		_.merge(this, _.omitBy({
			details: getMostImportant("details"),
			error,
			instance,
			method,
			statusCode,
			...properties
		}, _.isUndefined));
	}
}
