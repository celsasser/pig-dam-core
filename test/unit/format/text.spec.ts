/**
 * Date: 6/2/20
 * Time: 10:56 PM
 * @license MIT (see project's LICENSE file)
 */


import {indentText} from "../../../src/format";

describe("format.text", function() {
	describe("indentText", function() {
		it("should do nothing if depth = 0", function() {
			const input = "1\n2";
			const result = indentText(input, 0);
			expect(result).toEqual(input);
		});

		it("should indent a single line with 3 spaces by default", function() {
			const input = "1";
			const result = indentText(input, 1);
			expect(result).toEqual("   1");
		});

		it("should indent multiple lines with 3 spaces by default", function() {
			const input = "1\n2";
			const result = indentText(input, 1);
			expect(result).toEqual("   1\n"
				+ "   2");
		});

		it("should not indent empty lines", function() {
			const input = "1\n\n2";
			const result = indentText(input, 1);
			expect(result).toEqual("   1\n"
				+ "\n"
				+ "   2");
		});

		it("should properly skip lines", function() {
			const input = "1\n2";
			const result = indentText(input, 1, {
				skip: 1
			});
			expect(result).toEqual("1\n"
				+ "   2");
		});

		it("should properly use specified indent text", function() {
			const input = "1\n2";
			const result = indentText(input, 1, {
				indent: "xxx"
			});
			expect(result).toEqual("xxx1\n"
				+ "xxx2");
		});
	});
});
