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
import {httpStatusCodeToText} from "../types";

/**
 * Custom Error type that has some brains and functionality to:
 *  - figure out where errors happened: context, function, module
 *  - track inner errors so that we can ascend and descend our russian doll errors
 *  - tracking error statuses in the form of HTTP statuses (sort of a common language)
 */
export class PigError extends Error {
	public readonly context?: string;
	public readonly details?: string;
	public readonly error?: Error;
	public readonly metadata?: object;
	public readonly method?: string;
	public readonly module?: string;
	public readonly statusCode?: number;

	/**
	 * General purpose pig error that hold all of our secrets. He is designed to stash information related to the
	 * error so that we capture and report essential info. You may specify a number of predefined params and include
	 * additional ones. You must supply something that constitutes a "message". Be reasonable and we will find something.
	 *
	 * NOTE: we attempt to find `context`, `method` and `module`. You don't need to include them unless you want to
	 * override the defaults or feel more comfortable doing it.
	 *
	 * @param context - instance of object in which the error occurred. We attempt to automatically find this information.
	 * @param details - details in addition to the principle error or message.
	 * @param error - error that will be promoted to "message" or "details" if they are not specified.
	 * @param message - error text
	 * @param metadata - optional companion data to help define the error.
	 * @param method - calling method. We attempt to automatically find this information.
	 * @param module - the module from which the error was thrown. We will pull it from the stack if not included.
	 *    If included then most likely you will want to assign it from `__filename` or `__dirname`
	 * @param statusCode - http code to associate with error.
	 */
	constructor({context, details, error, message, metadata, method, module, statusCode}: {
		context?: string|object,
		details?: string,
		error?: PigError|Error|string,
		message?: string,
		metadata?: object,
		method?: string|Function,
		module?: string,
		statusCode?: number
	}) {
		const leftovers = Object.assign({}, arguments[0]);

		/**
		 * Attempts to get the preferred property but if not available then returns the next best choice
		 */
		function getOptimalInformation(preferredProperty: string): string {
			let result;
			if(leftovers[preferredProperty]) {
				result = leftovers[preferredProperty];
				delete leftovers[preferredProperty];
			} else if(leftovers.statusCode) {
				result = `${httpStatusCodeToText(leftovers.statusCode)} (${leftovers.statusCode})`;
				delete leftovers.statusCode;
			}
			return result;
		}

		if(context && typeof context !== "string") {
			context = getTypeName(context);
		}
		if(typeof method === "function") {
			method = method.name;
		}
		if(error) {
			if(typeof error === "string") {
				error = new Error(error);
			} else {
				// statusCode will percolate up and be relevant right up to the tippy top
				if("statusCode" in error) {
					statusCode = error.statusCode;
				}
			}
		}

		super(getOptimalInformation("message") || _.get(error, "message"));

		// setup the instance
		Object.assign(this,
			this.stackToDefaults(),
			_.omitBy({
				context,
				details: getOptimalInformation("details"),
				error,
				metadata,
				method,
				module,
				statusCode
			}, _.isUndefined)
		);
	}

	/********************
	 * Private Interface
	 ********************/
	/**
	 * Examines the stack and pulls out whatever useful information we can get out of him.
	 */
	private stackToDefaults(): {
		context?: string
		method?: string,
		module?: string
	} {
		/**
		 * There are some context's that make sense from a stack standpoint but don't from
		 * an error message standpoint. They are not helpful. So let's not include the mystery.
		 */
		function filterContext(context?: string): string|undefined {
			const exlude = [
				"Function",
				"Module",
				"Object"
			];
			return _.includes(exlude, context)
				? undefined
				: context;
		}

		try {
			const {lines} = parseStack(this);
			const result = parseStackLine(lines[0]);
			return _.omitBy({
				context: filterContext(result.context),
				method: result.method,
				module: getModulesRelativePath(result.module)
			}, _.isUndefined);
		} catch(error) {
			return {};
		}
	}
}
