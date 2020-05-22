/**
 * Date: 05/27/18
 * Time: 7:15 PM
 */

import {compareAny, compareString} from "../../src";

describe("compare", function() {
	describe("any", function() {
		it("should return 0 if objects are the same", function() {
			expect(compareAny(null, null)).toEqual(0);
			expect(compareAny(1, 1)).toEqual(0);
			expect(compareAny("1", "1")).toEqual(0);
		});

		it("should return proper values when one param is null and the other is not", function() {
			expect(compareAny(1, undefined)).toEqual(-1);
			expect(compareAny(1, null)).toEqual(-1);
			expect(compareAny(undefined, 1)).toEqual(1);
			expect(compareAny(null, 1)).toEqual(1);
		});

		it("should do date compare if dates", function() {
			const date1 = new Date("2000-01-01");
			const date2 = new Date("2001-01-01");
			expect(compareAny(date1, date2)).toEqual(-1);
			expect(compareAny(date2, date1)).toEqual(1);
		});

		it("should do string compare if string", function() {
			expect(compareAny("a", "a")).toEqual(0);
			expect(compareAny("a", "b")).toEqual(-1);
			expect(compareAny("b", "a")).toEqual(1);
			expect(compareAny("A", "a")).toEqual(1);
			expect(compareAny("a", "A")).toEqual(-1);
			expect(compareAny("a", "A", {ignoreCase: true})).toEqual(0);
		});

		it("should default to treating as numbers", function() {
			expect(compareAny(0, 0)).toEqual(0);
			expect(compareAny(1, 0)).toEqual(1);
			expect(compareAny(0, 1)).toEqual(-1);
		});
	});

	describe("string", function() {
		it("should return 0 if params are effectively null", function() {
			expect(compareString(undefined, undefined)).toEqual(0);
			expect(compareString(null, null)).toEqual(0);
			expect(compareString(undefined, null)).toEqual(0);
		});

		it("should properly compare params of the same case", function() {
			expect(compareString(null, "a")).toEqual(1);
			expect(compareString("a", null)).toEqual(-1);
			expect(compareString("a", "a")).toEqual(0);
			expect(compareString("a", "b")).toEqual(-1);
			expect(compareString("b", "a")).toEqual(1);
		});

		it("should ignore case by default", function() {
			expect(compareString("a", "A")).toEqual(0);
		});

		it("should not ignore case if told not to", function() {
			expect(compareString("a", "A", {
				ignoreCase: false
			})).toEqual(-1);
			expect(compareString("A", "a", {
				ignoreCase: false
			})).toEqual(1);
		});
	});
});
