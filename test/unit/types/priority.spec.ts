/**
 * Date: 12/8/17
 * Time: 8:05 PM
 * @license MIT (see project's LICENSE file)
 */

import {Priority} from "../../../src/types";

describe("priority", function() {
	describe("Priority", function() {
		it("should encode values to be lowercase version of keyword", function() {
			expect(Priority.LOW).toEqual("low");
			expect(Priority.MEDIUM).toEqual("medium");
			expect(Priority.HIGH).toEqual("high");
		});
	});

});
