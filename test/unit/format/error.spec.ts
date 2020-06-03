/**
 * Date: 2/8/18
 * Time: 9:48 PM
 * @license MIT (see project's LICENSE file)
 */


import {PigError} from "../../../src/error";
import {errorToString} from "../../../src/format";

describe("format.error", function() {
	describe("errorToString", function() {
		/**
		 * A dummy context for testing
		 */
		class DummyClass {}


		it("should convert an error to a string by default without a stack", function() {
			const error = new Error("failed");
			expect(errorToString(error)).toEqual("failed");
		});

		it("should convert an error to a string by with a stack if requested", function() {
			const error = new Error("failed");
			error.stack = "at Context1.f1 (module1.js:100:10)\n"
				+ "    at Context2.f2 (module2.js:200:20)";
			expect(errorToString(error, {
				stack: true
			})).toEqual("failed\n"
				+ "at Context1.f1 (module1.js:100:10)\n"
				+ "at Context2.f2 (module2.js:200:20)");
		});

		it("should figure out the module and include context if included and requested", function() {
			const error = new PigError({
				context: new DummyClass(),
				message: "message",
				method: "method"
			});
			expect(errorToString(error, {
				source: true
			})).toEqual("./test/unit/format/error.spec.ts::DummyClass.method(): message");
		});

		it("should include method if included and requested", function() {
			const error = new PigError({
				message: "message",
				method: "method"
			});
			expect(errorToString(error, {
				source: true
			})).toEqual("./test/unit/format/error.spec.ts::method(): message");
		});

		it("should properly format nested errors", function() {
			const inner = new Error("inner\ndetails");
			const outer = new PigError({
				error: inner,
				message: "outer"
			});
			inner.stack = "at Inner.f1 (module1.js:100:10)";
			outer.stack = "at Outer.f1 (module1.js:200:10)";

			expect(errorToString(outer, {
				stack: true
			})).toEqual("./test/unit/format/error.spec.ts::<anonymous>(): outer\n"
				+ "   [error -> error] inner\n"
				+ "   details\n"
				+ "at Inner.f1 (module1.js:100:10)");

		});
	});
});
