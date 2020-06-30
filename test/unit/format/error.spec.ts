/**
 * Date: 2/8/18
 * Time: 9:48 PM
 * @license MIT (see project's LICENSE file)
 */


import {PigError} from "../../../src/error";
import {errorToFormatModel} from "../../../src/format";

describe("format.error", function() {
	describe("errorToFormatModel", function() {
		it("should return a proper description of a simple error", function() {
			const error = new Error("failed");
			error.stack = "at error.f1 (module1.js:100:10)";
			const model = errorToFormatModel(error);
			expect(model).toEqual({
				"message": "failed",
				"stack": [
					"at error.f1 (module1.js:100:10)"
				]
			});
		});

		it("should return a proper description of a complext error", function() {
			const inner = new Error("inner\ndetails");
			const outer = new PigError({
				error: inner,
				message: "outer"
			});
			inner.stack = "at Inner.f1 (module1.js:100:10)";
			outer.stack = "at Outer.f1 (module1.js:200:10)";
			const model = errorToFormatModel(outer);
			expect(model).toEqual({
				"location": "./test/unit/format/error.spec.ts::<anonymous>()",
				"message": "outer",
				"nested": {
					"message": "inner\ndetails",
					"stack": [
						"at Inner.f1 (module1.js:100:10)"
					]
				},
				"stack": [
					"at Outer.f1 (module1.js:200:10)"
				]
			});
		});
	});
});
