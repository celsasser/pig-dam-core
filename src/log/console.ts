/**
 * Date: 5/20/20
 * Time: 10:56 PM
 * @license MIT (see project's LICENSE file)
 */

import {Severity} from "../types";
import {LogBase} from "./base";

/**
 * Logs to the console
 */
export class LogConsole extends LogBase {
	protected _logEntry(message: string, severity: Severity, metadata: {[p: string]: any}) {
		const method = (severity === Severity.FATAL)
			? Severity.ERROR
			: severity;
		console[method](message, metadata);
	}
}
