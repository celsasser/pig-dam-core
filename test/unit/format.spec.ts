/**
 * Date: 2/8/18
 * Time: 9:48 PM
 * @license MIT (see project's LICENSE file)
 */

import {errorToString, messageToString, PigError} from "../../src";


describe("format", function() {
	describe("errorToString", function() {
		it("should convert an error to a string by default without a stack", function() {
			const error = new Error("failed");
			expect(errorToString(error)).toEqual("failed");
		});

		it("should convert an error to a string by with a stack if requested", function() {
			const error = new Error("failed");
			error.stack = "one\ntwo\nthree";
			expect(errorToString(error, {
				stack: true
			})).toEqual("failed\ntwo\nthree");
		});

		it("should include instance if included and requested", function() {
			class DummyClass {
			}

			const error = new PigError({
				instance: new DummyClass(),
				message: "message"
			});
			expect(errorToString(error, {
				source: true
			})).toStrictEqual("DummyClass: message");
		});

		it("should include method if included and requested", function() {
			const error = new PigError({
				message: "message",
				method: "method"
			});
			expect(errorToString(error, {
				source: true
			})).toEqual("method(): message");
		});

		it("should include instance and method if included and requested", function() {
			class DummyClass {
			}

			const error = new PigError({
				instance: new DummyClass(),
				message: "message",
				method: "method"
			});
			expect(errorToString(error, {
				source: true
			})).toEqual("DummyClass.method(): message");
		});
	});

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
