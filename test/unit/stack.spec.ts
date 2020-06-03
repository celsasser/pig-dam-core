/**
 * Date: 5/24/20
 * Time: 10:01 PM
 * @license MIT (see project's LICENSE file)
 */


import {getStack, groomStack, parseStack, parseStackLine} from "../../src/stack";

describe("stack", function() {
	/********************
	 * Test Data
	 ********************/
	/**
	 * Examples take from https://nodejs.org/api/errors.html#errors_error_stack
	 */
	const testStack: string = "Message line 1\n"
		+ "    Message line 2\n"
		+ "    at speedy (/home/gbusey/file.js:6:11)\n"
		+ "    at makeFaster (/home/gbusey/file.js:5:3)\n"
		+ "    at Object.<anonymous> (/home/gbusey/file.js:10:1)\n"
		+ "    at Module._compile (module.js:456:26)\n"
		+ "    at Object.Module._extensions..js (module.js:474:10)\n"
		+ "    at Module.load (module.js:356:32)\n"
		+ "    at Function.Module._load (module.js:312:12)\n"
		+ "    at Function.Module.runMain (module.js:497:10)\n"
		+ "    at startup (node.js:119:16)\n"
		+ "    at node.js:906:3\n";

	/**
	 * Stack up yonder parsed as we expect it to be
	 */
	const testStackParsed = {
		lines: [
			"at speedy (/home/gbusey/file.js:6:11)",
			"at makeFaster (/home/gbusey/file.js:5:3)",
			"at Object.<anonymous> (/home/gbusey/file.js:10:1)",
			"at Module._compile (module.js:456:26)",
			"at Object.Module._extensions..js (module.js:474:10)",
			"at Module.load (module.js:356:32)",
			"at Function.Module._load (module.js:312:12)",
			"at Function.Module.runMain (module.js:497:10)",
			"at startup (node.js:119:16)",
			"at node.js:906:3"
		],
		message: "Message line 1\n" +
			"    Message line 2"
	};

	/**
	 * Error with same stack assigned to its stack property
	 */
	const testError = new Error("Error");
	testError.stack = testStack;


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
		it("should properly parse a line without a method", function() {
			const result = parseStackLine("at node.js:906:3");
			expect(result).toEqual({
				"column": 3,
				"line": 906,
				"module": "node.js"
			});
		});

		it("should properly parse a line with no context", function() {
			const result = parseStackLine("at speedy (/home/gbusey/file.js:6:11)");
			expect(result).toEqual({
				"column": 11,
				"line": 6,
				"method": "speedy",
				"module": "/home/gbusey/file.js"
			});
		});

		it("should properly parse a line with a context and method", function() {
			const result = parseStackLine("at Module.load (module.js:356:32)");
			expect(result).toEqual({
				"column": 32,
				"context": "Module",
				"line": 356,
				"method": "load",
				"module": "module.js"
			});
		});

		it("should properly parse a line with multiple contexts and method", function() {
			const result = parseStackLine("at Object.Module._extensions..js (module.js:474:10)");
			expect(result).toEqual({
				"column": 10,
				"context": "Object",
				"line": 474,
				"method": "Module._extensions..js",
				"module": "module.js"
			});
		});

		it("should throw an exception if line cannot be parsed", function() {
			expect(parseStackLine.bind(null, "gobble gobble"))
				.toThrowError(`unable to parse "gobble gobble"`);
		});
	});
});
