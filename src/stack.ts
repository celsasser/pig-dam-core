/**
 * Date: 3/5/2018
 * Time: 9:10 PM
 * @license MIT (see project's LICENSE file)
 *
 */

import * as _ from "lodash";
import {PigError} from "./error";

/**
 * Gets the current execution stack as a string.
 * Note: it strips the message off of the stack
 */
export function getStack({
	popCount = 0,
	maxLines = 10
} = {}): string {
	return groomStack(new Error(), {
		maxLines,
		// pop ourselves
		popCount: popCount+1
	});
}

/**
 * Gets the stack, parses it via `parseStack` and refines it as requested
 * @param errorOrStack - either is the stack or is an error from which we will pull the stack
 * @param popCount - number of lines to pop off the top
 * @param maxLines - max number of stack lines to include (stacks can get very long and noisey
 * And returns him back to you so you can hug and kiss him and call him?
 */
export function groomStack(errorOrStack: Error|string, {
	popCount = 0,
	maxLines = 10
} = {}): string {
	const {lines} = parseStack(errorOrStack);
	if(popCount > 0) {
		lines.splice(0, popCount);
	}
	if(maxLines < lines.length) {
		lines.splice(maxLines);
	}
	return lines.join("\n");
}

/**
 * Splits this fellow up into the message and the call history. It removes all formatting (leading
 * and trailing white space).
 */
export function parseStack(errorOrStack: Error|string): {
	lines: string[],
	message: string
} {
	/**
	 * Sample stack
	 * "Error Message\n" +
	 * "    at repl:1:7\n" +
	 * "    at Script.runInThisContext (vm.js:120:20)\n" +
	 * "    at REPLServer.defaultEval (repl.js:431:29)\n" +
	 * "    ...";
	 */
	const stack: string = (errorOrStack instanceof Error)
		? errorOrStack.stack as string
		: errorOrStack;
	const split = stack.split(/\s*\n\s*/)
		.filter(_.negate(_.isEmpty));
	return {
		lines: split.slice(1),
		message: split[0]
	}
}

/**
 * Parses a line of call history in a stack (not the message).
 * @throws {Error} if unable to parse
 */
export function parseStackLine(line: string): {
	column: number
	context?: string,
	line: number,
	module: string,
	method?: string
} {
	let match;
	/**
	 * There appear to be two different varieties:
	 * 1. without method: "at repl:1:7"
	 * 2. with method: "at Script.runInThisContext (vm.js:120:20)"
	 */
	const regexWithMethod = /^\s*at\s*(([^\s.]+)(\.(\S+))?)\s*\((.+):(\d+):(\d+)\)\s*$/;
	const regexWithoutMethod = /^\s*at\s*(.+):(\d+):(\d+)\s*$/;

	match = line.match(regexWithMethod);
	if(match) {
		// @ts-ignore
		return _.omitBy({
			column: Number(match[7]),
			// if we could not isolate a method then there is no context
			context: (match[4]) ? match[2] : undefined,
			line: Number(match[6]),
			module: match[5],
			// if there is no context then we take thw whole thing
			method: (match[4]) ? match[4] : match[1]
		}, _.isUndefined);
	}
	match = line.match(regexWithoutMethod);
	if(match) {
		return {
			column: Number(match[3]),
			line: Number(match[2]),
			module: match[1]
		}
	}
	throw new PigError({
		message: `unable to parse "${line}"`
	});
}
