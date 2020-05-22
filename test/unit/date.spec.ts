/**
 * Date: 05/27/18
 * Time: 7:15 PM
 */

import {dateAdd, dateFromString, dateFromValue, datesAreEqual, dateToISOString} from "../../src";


describe("date", function() {
	describe("dateAdd", function() {
		it("should return date if no additions are made", function() {
			const date = new Date();
			const result = dateAdd(date, {});
			expect(date.getTime()).toEqual(result.getTime());
		});

		it("should properly dateAdd positive millis", function() {
			const date = new Date();
			const result = dateAdd(date, {
				millis: 100
			});
			expect(date.getTime()).toEqual(result.getTime() - 100);
		});

		it("should properly dateAdd negative millis", function() {
			const date = new Date();
			const result = dateAdd(date, {
				millis: -100
			});
			expect(date.getTime()).toEqual(result.getTime() + 100);
		});

		it("should properly dateAdd positive seconds", function() {
			const date = new Date();
			const result = dateAdd(date, {
				seconds: 1
			});
			expect(date.getTime()).toEqual(result.getTime() - 1000);
		});

		it("should properly dateAdd negative seconds", function() {
			const date = new Date();
			const result = dateAdd(date, {
				seconds: -1
			});
			expect(date.getTime()).toEqual(result.getTime() + 1000);
		});

		it("should properly dateAdd minutes", function() {
			const date = new Date();
			const result = dateAdd(date, {
				minutes: 1
			});
			expect(date.getTime()).toEqual(result.getTime() - 1000 * 60);
		});

		it("should properly dateAdd hours", function() {
			const date = new Date();
			const result = dateAdd(date, {
				hours: 1
			});
			expect(date.getTime()).toEqual(result.getTime() - 1000 * 60 * 60);
		});

		it("should properly dateAdd days", function() {
			const date = new Date();
			const result = dateAdd(date, {
				days: 1
			});
			expect(date.getTime()).toEqual(result.getTime() - 1000 * 60 * 60 * 24);
		});

		it("should properly dateAdd combination of all params", function() {
			const date = new Date();
			const result = dateAdd(date, {
				days: 1,
				hours: 1,
				millis: 1,
				minutes: 1,
				seconds: 1
			});
			expect(date.getTime()).toEqual(result.getTime()
				- 1
				- 1000
				- 1000 * 60
				- 1000 * 60 * 60
				- 1000 * 60 * 60 * 24
			);
		});
	});

	describe("datesAreEqual", function() {
		it("should return true if dates are the same", function() {
			const date1 = new Date("2000-01-01T12:00:00.000Z");
			const date2 = new Date("2000-01-01T12:00:00.000Z");
			expect(datesAreEqual(date1, date2)).toEqual(true);
		});

		it("should return false if dates are different", function() {
			const date1 = new Date("2000-01-01T12:00:00.000Z");
			const date2 = new Date("2001-01-01T12:00:00.000Z");
			expect(datesAreEqual(date1, date2)).toEqual(false);
		});

		it("should handle null and undefined values", function() {
			expect(datesAreEqual(undefined, undefined)).toEqual(true);
			expect(datesAreEqual(null, null)).toEqual(true);
			expect(datesAreEqual(new Date(), null)).toEqual(false);
			expect(datesAreEqual(null, new Date())).toEqual(false);
		});
	});

	describe("dateFromString", function() {
		it("should return undefined with null", function() {
			expect(dateFromString(null)).toBeUndefined();
		});

		it("should return parsed date for known encoding", function() {
			const date = new Date();
			const decoded = dateFromValue(date.toISOString());
			expect(date).toEqual(decoded);
		});

		it("should throw exception with invalid string", function() {
			expect(dateFromString.bind(null, "invalid")).toThrow("invalid date invalid");
		});
	});

	describe("dateFromValue", function() {
		it("should detect date type and return object itself", function() {
			const date = new Date();
			expect(dateFromValue(date)).toEqual(date);
		});

		it("should detect string and return converted object", function() {
			const date = new Date();
			expect(dateFromValue(date.toISOString())).toEqual(date);
		});

		it("should detect numeric representation and return converted object", function() {
			expect(dateFromValue(0)).toEqual(new Date(0));
		});

		it("should detect null/undefined and return undefined", function() {
			expect(dateFromValue(null)).toBeUndefined();
		});

		it("should throw exception if it can't make sense of the input", function() {
			// @ts-ignore
			expect(dateFromValue.bind(null, {}))
				.toThrow("unknown date value [object Object]");
		});
	});


	describe("toISOString", function() {
		it("dateToISOString not should strip millis with no milli param", function() {
			const date = new Date("2020-01-01T12:00:00.000Z");
			const encoded = dateToISOString(date);
			expect(encoded).toEqual("2020-01-01T12:00:00.000Z");
		});

		it("dateToISOString should strip millis with false param", function() {
			const date = new Date("2020-01-01T12:00:00.000Z");
			const encoded = dateToISOString(date, false);
			expect(encoded).toEqual("2020-01-01T12:00:00Z");
		});

		it("dateToISOString should leave millis with true milli param", function() {
			const date = new Date("2020-01-01T12:00:00.000Z");
			const encoded = dateToISOString(date, true);
			expect(encoded).toEqual("2020-01-01T12:00:00.000Z");
		});
	});
});
