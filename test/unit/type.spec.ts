/**
 * Date: 05/27/18
 * Time: 7:15 PM
 */

import {getTypeName} from "../../src";


describe("type", function() {
	describe("name", function() {
		it("should properly get name of null", function() {
			expect(getTypeName(null)).toEqual("null");
		});

		it("should properly get name of value type", function() {
			expect(getTypeName(undefined)).toEqual("undefined");
		});

		it("should properly get name of number", function() {
			expect(getTypeName(1)).toEqual("Number");
			// tslint:disable-next-line: no-construct
			expect(getTypeName(new Number(1))).toEqual("Number");
		});

		it("should properly get name of string", function() {
			expect(getTypeName("s")).toEqual("String");
			// tslint:disable-next-line: no-construct
			expect(getTypeName(new String("s"))).toEqual("String");
		});

		it("should properly get name of object", function() {
			expect(getTypeName({})).toEqual("Object");
		});

		it("should properly get name of class", function() {
			class Dummy {}

			expect(getTypeName(new Dummy())).toEqual("Dummy");
		});
	});
});
