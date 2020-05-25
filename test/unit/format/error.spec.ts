/**
 * Date: 2/8/18
 * Time: 9:48 PM
 * @license MIT (see project's LICENSE file)
 */

import {errorToString, PigError} from "../../../src";


describe("format.error", function() {
	describe("errorToString", function() {
		it("should convert an error to a string by default without a stack", function() {
			const error = new Error("failed");
			expect(errorToString(error)).toEqual("failed");
		});

		it("should convert an error to a string by with a stack if requested", function() {
			const error = new Error("failed");
			error.stack = "message\nline1\nline2";
			expect(errorToString(error, {
				stack: true
			})).toEqual("failed\nline1\nline2");
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
});
