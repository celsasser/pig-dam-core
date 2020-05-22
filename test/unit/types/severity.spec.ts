/**
 * Date: 12/8/17
 * Time: 8:05 PM
 * @license MIT (see project's LICENSE file)
 */

import {
	Severity,
	testSeverity
} from "../../../src/types";

describe("severity", function() {
	describe("Severity", function() {
		it("should encode values to be lowercase version of keyword", function() {
			expect(Severity.DEBUG).toEqual("debug");
			expect(Severity.INFO).toEqual("info");
			expect(Severity.WARN).toEqual("warn");
			expect(Severity.ERROR).toEqual("error");
			expect(Severity.FATAL).toEqual("fatal");
		});
	});

	describe("testSeverity", function() {
		it("should properly evaluate values", function() {
			expect(testSeverity(Severity.DEBUG, Severity.WARN)).toEqual(false);
			expect(testSeverity(Severity.INFO, Severity.WARN)).toEqual(false);
			expect(testSeverity(Severity.WARN, Severity.WARN)).toEqual(true);
			expect(testSeverity(Severity.ERROR, Severity.WARN)).toEqual(true);
			expect(testSeverity(Severity.FATAL, Severity.WARN)).toEqual(true);
		});
	});
});
