/**
 * Date: 05/27/18
 * Time: 7:15 PM
 */

import {type} from "../../src";


describe("type", function() {
	describe("name", function() {
		it("should properly get name of null", function() {
			expect(type.name(null)).toEqual("null");
		});

		it("should properly get name of value type", function() {
			expect(type.name(undefined)).toEqual("undefined");
		});

		it("should properly get name of number", function() {
			expect(type.name(1)).toEqual("Number");
			expect(type.name(new Number(1))).toEqual("Number");
		});

		it("should properly get name of string", function() {
			expect(type.name("s")).toEqual("String");
			expect(type.name(new String("s"))).toEqual("String");
		});

		it("should properly get name of object", function() {
			expect(type.name({})).toEqual("Object");
		});

		it("should properly get name of class", function() {
			class Dummy {}

			expect(type.name(new Dummy())).toEqual("Dummy");
		});
	});
});
