/**
 * Date: 2/8/18
 * Time: 9:48 PM
 * @license MIT (see project's LICENSE file)
 */


import {PigError} from "../../../src/error";
import {
	errorToDiagnosticString,
	errorToFormatDetails,
	errorToFriendlyString,
	errorToString
} from "../../../src/format";

describe("format.error", function() {
	describe("errorToDiagnosticString", function() {
		it("should include both details and a stack", function() {
			const error = new PigError({
				details: "details",
				message: "message"
			});
			error.stack = "stack";
			expect(errorToDiagnosticString(error))
				.toEqual("./test/unit/format/error.spec.ts::<anonymous>(): message - details\n"
					+ "stack");
		});
	});

	describe("errorToFriendlyString", function() {
		it("should only include the message", function() {
			const error = new PigError({
				details: "details",
				message: "message"
			});
			expect(errorToFriendlyString(error))
				.toEqual("message");
		});
	});

	describe("errorToFormatDetails", function() {
		/**
		 * A dummy context for testing
		 */
		class DummyClass {
		}


		it("should return message if no details and no stack are requested", function() {
			const error = new Error("failed");
			expect(errorToFormatDetails(error, {
				details: false,
				stack: false
			})).toEqual({
				message: error.message
			});
		});

		it("should include stack if requested", function() {
			const error = new Error("failed");
			error.stack = "at Context1.f1 (module1.js:100:10)\n"
				+ "   at Context2.f2 (module2.js:200:20)";
			expect(errorToFormatDetails(error, {
				details: false,
				stack: true
			})).toEqual({
				"message": "failed",
				"stack": "at Context1.f1 (module1.js:100:10)\nat Context2.f2 (module2.js:200:20)"
			});
		});

		it("should figure out the module and include context if included and requested", function() {
			const error = new PigError({
				context: new DummyClass(),
				message: "message",
				method: "method"
			});
			expect(errorToFormatDetails(error, {
				details: true,
				stack: false
			})).toEqual({
				"message": "./test/unit/format/error.spec.ts::DummyClass.method(): message"
			});
		});

		it("should include method if included and requested", function() {
			const error = new PigError({
				message: "message",
				method: "method"
			});
			expect(errorToFormatDetails(error, {
				details: true,
				stack: false
			})).toEqual({
				message: "./test/unit/format/error.spec.ts::method(): message"
			});
		});

		it("should properly format nested errors", function() {
			const inner = new Error("inner\ndetails");
			const outer = new PigError({
				error: inner,
				message: "outer"
			});
			inner.stack = "at Inner.f1 (module1.js:100:10)";
			outer.stack = "at Outer.f1 (module1.js:200:10)";

			expect(errorToFormatDetails(outer, {
				details: true,
				stack: true
			})).toEqual({
				message: "./test/unit/format/error.spec.ts::<anonymous>(): outer\n"
					+ "   [error -> error] inner\n"
					+ "   details",
				stack: "at Inner.f1 (module1.js:100:10)"
			});

		});
	});

	describe("errorToString", function() {
		it("should convert an error to a string", function() {
			const error = new Error("failed");
			expect(errorToString(error, {
				details: false,
				stack: false
			})).toEqual("failed");
		});

		it("should include stack and details if requested", function() {
			const inner = new Error("inner\ndetails");
			const outer = new PigError({
				error: inner,
				message: "outer"
			});
			inner.stack = "at Inner.f1 (module1.js:100:10)";
			outer.stack = "at Outer.f1 (module1.js:200:10)";

			expect(errorToString(outer, {
				details: true,
				stack: true
			})).toEqual("./test/unit/format/error.spec.ts::<anonymous>(): outer\n"
				+ "   [error -> error] inner\n"
				+ "   details\n"
				+ "at Inner.f1 (module1.js:100:10)");

		});
	});
});
