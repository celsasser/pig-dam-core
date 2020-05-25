/**
 * Date: 5/24/20
 * Time: 10:01 PM
 * @license MIT (see project's LICENSE file)
 */


import {getStack, groomStack, parseStack, parseStackLine} from "../../src";

describe("stack", function() {
	/********************
	 * Test Data
	 ********************/
	/**
	 * Truncated stack that I pulled from the node repl.
	 */
	const testStack: string = "Error\n" +
		"    at repl:1:7\n" +
		"    at Script.runInThisContext (vm.js:120:20)\n" +
		"    at REPLServer.defaultEval (repl.js:431:29)\n" +
		"    at bound (domain.js:426:14)";

	/**
	 * Error with same stack assigned to its stack property
	 */
	const testError = new Error("Error");
	testError.stack = testStack;

	/**
	 * Stack up yonder parsed as we expect it to be
	 */
	const testStackParsed = {
		lines: [
			"at repl:1:7",
			"at Script.runInThisContext (vm.js:120:20)",
			"at REPLServer.defaultEval (repl.js:431:29)",
			"at bound (domain.js:426:14)"
		],
		message: "Error"
	}


	/********************
	 * Action
	 ********************/
	describe("getStack", function() {
		it("should return something that looks like a string stack", function() {
			const stack = getStack();
			expect(stack).toContain(__filename);
		});
	});

	describe("groomStack", function() {
		it("should not pop any lines by default", function() {
			const groomed = groomStack(testError);
			expect(groomed)
				.toEqual(testStackParsed.lines.join("\n"));
		});

		it("should properly pop the first line", function() {
			const groomed = groomStack(testError, {
				popCount: 1
			});
			expect(groomed)
				.toEqual(testStackParsed.lines
					.slice(1)
					.join("\n")
				);
		});
	});

	describe("parseStack", function() {
		it("should parse an Error param's stack", function() {
			const {
				lines,
				message
			} = parseStack(testError);
			expect(message).toEqual(testStackParsed.message);
			expect(lines).toEqual(testStackParsed.lines);
		});

		it("should parse a string param stack", function() {
			const {
				lines,
				message
			} = parseStack(testStack);
			expect(message).toEqual(testStackParsed.message);
			expect(lines).toEqual(testStackParsed.lines);
		});
	});

	describe("parseStackLine", function() {
		it("should properly parse a line with a method", function() {
			const result = parseStackLine("at Script.runInThisContext (vm.js:120:20)");
			expect(result).toEqual({
				column: 20,
				line: 120,
				method: "Script.runInThisContext",
				module: "vm.js"
			});
		});

		it("should properly parse a line without a method", function() {
			const result = parseStackLine("at repl:1:7");
			expect(result).toEqual({
				column: 7,
				line: 1,
				module: "repl"
			})
		});

		it("should throw an exception if line cannot be parsed", function() {
			expect(parseStackLine.bind(null, "gobble gobble"))
				.toThrowError(`unable to parse "gobble gobble"`);
		});
	});
});
