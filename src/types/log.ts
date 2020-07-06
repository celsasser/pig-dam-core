/**
 * Date: 5/19/20
 * Time: 9:32 PM
 * @license MIT (see project's LICENSE file)
 */

import {Severity} from "./severity";

/**
 * types accepted as a log message
 */
export type LogMessage = string|(() => string)|Error;

/**
 * Signature of a logging method
 */
export type LogMethod = (message: LogMessage, {metadata, moduleId, stack, traceId}: {
	metadata?: {[index: string]: any},
	moduleId: string,
	stack?: StackDescription,
	traceId?: string
}) =>  void;

/**
 * We support both native stacks and parsed stacks
 */
export type StackDescription = string|string[];

export interface ILog {
	readonly applicationId: string;
	readonly environmentId: string;
	readonly threshold: Severity;

	debug: LogMethod;
	error: LogMethod;
	fatal: LogMethod;
	info: LogMethod;
	warn: LogMethod;
}
