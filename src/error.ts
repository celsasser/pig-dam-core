/**
 * Date: 2/8/18
 * Time: 9:48 PM
 * @license MIT (see project's LICENSE file)
 *
 */

import * as _ from "lodash";
import {findModuleRoot} from "./module";
import {HttpStatusCode, httpStatusCodeToText} from "./types";

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
	 * General purpose pig error that hold all of our secrets. He is designed to stash information related to the
	 * error so that we capture and report relevant info. You may specify a number of predefined params and include
	 * additional ones. You must supply something that constitutes a "message". Be reasonable and we will find something...
	 * @param details - details in addition to the principle error or message
	 * @param error - error that will be promoted to "message" or "details" if they are not specified.
	 * @param instance - instance of object in which the error occurred
	 * @param message
	 * @param method - calling method
	 * @param statusCode - http code to associate with error.
	 * @param properties - additional properties that you want captured and logged.
	 */
	constructor({details, error, instance, message, method, statusCode, ...properties}: {
		details?: string,
		error?: PigError|Error|string,
		instance?: object|string,
		message?: string,
		method?: string|Function,
		statusCode?: HttpStatusCode|number
	}) {
		const leftovers = Object.assign({}, arguments[0]);
		/**
		 * Attempts to get the preferred property but if not available then returns the next most "important"
		 */
		function getPreferred(preferredProperty: string): string {
			let result;
			if(leftovers[preferredProperty]) {
				result = leftovers[preferredProperty];
				delete leftovers[preferredProperty];
			} else if(leftovers.error) {
				result = leftovers.error.message;
				delete leftovers.error;
			} else if(leftovers.statusCode) {
				result = `${httpStatusCodeToText(leftovers.statusCode)} (${leftovers.statusCode})`;
				delete leftovers.statusCode;
			}
			return result;
		}

		// preprocess the data
		if(error) {
			if(!_.isError(error)) {
				error = new Error(error);
			}
			// steal goodies that we want to inherit
			if((error as PigError).statusCode) {
				statusCode = (error as PigError).statusCode;
			}
		}

		super(getPreferred("message"));

		// post process the data
		if(error) {
			// so that we can trace things to the true origin we steal his stack. There may be times at which we don't want to do this?
			this.stack = (error as Error).stack;
		}

		_.merge(this, _.omitBy({
			details: getPreferred("details"),
			error,
			instance,
			method: (typeof method === "function")
				? method.name
				: method,
			module: this.stackToModule(),
			statusCode,
			...properties
		}, _.isUndefined));
	}

	/********************
	 * Private Interface
	 ********************/
	/**
	 * Examines the stack and tries to figure out the module that raised the error
	 */
	private stackToModule(): string|undefined {
		/**
		 * An error is going to look something like this
		 *
		 * Error: message
		 *	at Object.<anonymous> (/Users/curtis/Develop/projects/node/pig/dam/core/test/unit/format.spec.ts:29:18)
		 *  ...
		 *
		 *  We are going to look for and parse the first call stack item (lines[1])
		 */
		try {
			const lines = (this.stack as string).split("\n");
			const module = (lines[1].match(/\((.+):\d+:\d+\)/) as RegExpMatchArray)[1];
			const root = findModuleRoot(module);
			return `.${module.substr(root.length)}`;
		} catch(error) {
			return undefined;
		}
	}
}
