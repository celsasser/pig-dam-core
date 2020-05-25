/**
 * Date: 2/8/18
 * Time: 9:48 PM
 * @license MIT (see project's LICENSE file)
 *
 */

import * as _ from "lodash";
import {getModulesRelativePath} from "../module";
import {parseStack, parseStackLine} from "../stack";
import {getTypeName} from "../type";
import {HttpStatusCode, httpStatusCodeToText} from "../types";

/**
 * Custom Error type that supports some "smart" constructors. And some property annotation support
 */
export class PigError extends Error {
	public readonly details?: string;
	public readonly error?: Error;
	public readonly instance?: string;
	public readonly method?: string;
	public readonly module?: string;
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
	 * @param module - the module from which the error was thrown. We will pull it from the stack if not included.
	 *    If included then most likely you will want to assign it from `__filename` or `__dirname`
	 * @param statusCode - http code to associate with error.
	 * @param properties - additional properties that you want captured and logged.
	 */
	constructor({details, error, instance, message, method, module, statusCode, ...properties}: {
		details?: string,
		error?: PigError|Error|string,
		instance?: string|object,
		message?: string,
		method?: string|Function,
		module?: string,
		statusCode?: HttpStatusCode|number
	}) {
		const leftovers = Object.assign({}, arguments[0]);

		/**
		 * Attempts to get the preferred property but if not available then returns the next most "important"
		 */
		function getAlternateInformation(preferredProperty: string): string {
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
		if(instance && typeof instance !== "string") {
			instance = getTypeName(instance);
		}
		if(error) {
			if(!_.isError(error)) {
				error = new Error(error);
			} else {
				// steal goodies that we want to inherit
				if((error as PigError).statusCode) {
					statusCode = (error as PigError).statusCode;
				}
			}
		}

		super(getAlternateInformation("message"));

		// post process
		_.merge(this, _.omitBy({
			details: getAlternateInformation("details"),
			error,
			instance,
			method: (typeof method === "function")
				? method.name
				: method,
			module: module || this.stackToModule(),
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
		try {
			const {lines} = parseStack(this);
			const {module} = parseStackLine(lines[0]);
			return getModulesRelativePath(module);
		} catch(error) {
			return undefined;
		}
	}
}
