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
	protected _logEntry(message: string, severity: Severity, metadata: {[p: string]: any}): void {
		switch(severity) {
			case Severity.INFO: {
				return console.log(message, metadata);
			}
			case Severity.FATAL: {
				return console.error(message, metadata);
			}
			default: {
				return console[severity](message, metadata);
			}
		}
	}
}
