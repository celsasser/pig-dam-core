/**
 * Date: 2/8/18
 * Time: 9:48 PM
 * @license MIT (see project's LICENSE file)
 */

import {messageToString} from "../../../src";


describe("format.message", function() {
	describe("messageToString", function() {
		it("should convert an error to a string by default without a stack", function() {
			const error = new Error("failed");
			expect(messageToString(error))
				.toEqual("failed");
		});

		it("should convert an error to a string by with a stack if requested", function() {
			const error = new Error("failed");
			expect(messageToString(error, {stack: true}))
				.not.toStrictEqual("failed");
		});

		it("should convert a function to a string by without a stack", function() {
			expect(messageToString(() => "message")).toEqual("message");
		});

		it("should convert a function to a string by with a stack if requested", function() {
			expect(messageToString(() => "message", {stack: true}))
				.not.toStrictEqual("message");
		});
	});
});
