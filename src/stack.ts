/**
 * Date: 3/5/2018
 * Time: 9:10 PM
 * @license MIT (see project's LICENSE file)
 *
 * NOTE: we do not want to use PigError here 'cause he uses us
 */

import * as _ from "lodash";

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
		popCount: popCount + 1
	});
}

/**
 * Gets the stack, parses it via `parseStack` and refines it as requested
 * @param errorOrStack - either is the stack or is an error from which we will pull the stack
 * @param popCount - number of lines to pop off the top
 * @param maxLines - max number of stack lines to include (stacks can get very long and noisy
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
 *
 * Sample stack
 * "Error Message\n" +
 * "    at repl:1:7\n" +
 * "    at Script.runInThisContext (vm.js:120:20)\n" +
 * "    at REPLServer.defaultEval (repl.js:431:29)\n" +
 * "    ...";
 */
export function parseStack(errorOrStack: Error|string): {
	lines: string[],
	message: string
} {
	// it appears that not all errors create themselves as instances of Error...
	const stack: string = (typeof errorOrStack === "string")
		? errorOrStack
		: errorOrStack.stack as string;
	// the reason we don't remove all whitespace around the newline is so that we can retain
	// message formatting. For example, it may be stringified JSON. We want to keep that whitespace.
	const split = stack.split(/\n/)
		.filter(line => line.trim() !== "");
	// to find the first line in the execution history of the stack we are going to use our
	// `parseStackLine` and wait for it to succeed and we will assume that is the first line
	// in the stacks execution history
	const firstExecutionLine = _.findIndex(split, line => {
		try {
			parseStackLine(line);
			return true;
		} catch(error) {
			return false;
		}
	});
	return {
		lines: split
			.slice(firstExecutionLine)
			.map(_.trim),
		message: split
			.slice(0, firstExecutionLine)
			.join("\n")
	};
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
	 * As documented by nodejs (https://nodejs.org/api/errors.html#errors_error_stack)
	 * the following variations exist:
	 *   at speedy (/home/gbusey/file.js:6:11)
	 *   at makeFaster (/home/gbusey/file.js:5:3)
	 *   at Object.<anonymous> (/home/gbusey/file.js:10:1)
	 *   at Module._compile (module.js:456:26)
	 *   at Object.Module._extensions..js (module.js:474:10)
	 *   at Module.load (module.js:356:32)
	 *   at Function.Module._load (module.js:312:12)
	 *   at Function.Module.runMain (module.js:497:10)
	 *   at startup (node.js:119:16)
	 *   at node.js:906:3
	 */
	const regexWithMethod = /^\s*at\s*(([^\s.]+)(\.(\S+))?)\s*\((.+):(\d+):(\d+)\)\s*$/;
	const regexWithoutMethod = /^\s*at\s*(.+):(\d+):(\d+)\s*$/;

	match = line.match(regexWithMethod);
	if(match) {
		// @ts-ignore
		return _.omitBy({
			column: Number(match[7]),
			// if we could not isolate a method then there is no context
			context: (match[4])
				? match[2]
				: undefined,
			line: Number(match[6]),
			// if there is no context then we take thw whole thing
			method: (match[4])
				? match[4]
				: match[1],
			module: match[5]
		}, _.isUndefined);
	}
	match = line.match(regexWithoutMethod);
	if(match) {
		return {
			column: Number(match[3]),
			line: Number(match[2]),
			module: match[1]
		};
	}
	throw new Error(`unable to parse "${line}"`);
}
