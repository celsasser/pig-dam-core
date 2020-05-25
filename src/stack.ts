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
	// pop ourselves
	popCount++;
	return groomStack(new Error(), {
		maxLines,
		popCount
	});
}

/**
 * Grooms the textual stack:
 * - uses parseStack to get stack lines (not message)
 * - pops and trims
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
 * Splits this fellow up into his bits and pieces
 */
export function parseStack(errorOrStack: Error|string): {
	lines: string[],
	message: string
} {
	const stack: string = (errorOrStack instanceof Error)
		? errorOrStack.stack as string
		: errorOrStack;
	const split = stack.split(/\s*\n\s*/)
		.filter(_.negate(_.isEmpty));
	return {
		message: split[0],
		lines: split.slice(1)
	}
}

/**
 * Parses a line in a stack (not the message).
 * @throws {Error} if unable to parse
 */
export function parseStackLine(line: string): {
	column: number
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
	const regexWithMethod = /^\s*at\s*(\S+)\s*\((.+):(\d+):(\d+)\)\s*$/;
	const regexWithoutMethod = /^\s*at\s*(.+):(\d+):(\d+)\s*$/;

	match = line.match(regexWithMethod);
	if(match) {
		return {
			column: Number(match[4]),
			line: Number(match[3]),
			module: match[2],
			method: match[1]
		}
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
