/**
 * Date: 05/27/18
 * Time: 7:15 PM
 */

import * as _ from "lodash";
import {PigError} from "../../src";

describe("error", function() {
	describe("PigError", function() {
		function _toPOJO(error: Error): object {
			return _(error)
				.pick(Object.getOwnPropertyNames(error))
				.omit(["stack"])
				.value();
		}

		describe("constructor", function() {
			it("should populate all supported params properly", function() {
				const instance = new PigError({
					details: "details",
					error: new Error("error"),
					instance: "instance",
					message: "message",
					method: "method",
					statusCode: 100
				});
				expect(_toPOJO(instance)).toEqual({
					details: "details",
					error: new Error("error"),
					instance: "instance",
					message: "message",
					module: "./test/unit/error.spec.ts",
					method: "method",
					statusCode: 100
				});
			});

			it("should properly derive 'message' from 'error' param", function() {
				const error = new Error("message"),
					instance = new PigError({error});
				expect(_toPOJO(instance)).toEqual({
					error,
					message: "message",
					module: "./test/unit/error.spec.ts"
				});
			});

			it("make properly derive 'details' from fallback params", function() {
				expect(_toPOJO(new PigError({
					error: new Error("details"),
					message: "message"
				}))).toEqual({
					details: "details",
					error: new Error("details"),
					message: "message",
					module: "./test/unit/error.spec.ts"
				});

				expect(_toPOJO(new PigError({
					message: "message",
					statusCode: 100
				}))).toEqual({
					details: "Continue (100)",
					message: "message",
					module: "./test/unit/error.spec.ts",
					statusCode: 100
				});
			});

			it("should pull name from a function method", function() {

				const instance = new PigError({
					message: "message",
					method: function dummy() {}
				});
				expect(_toPOJO(instance)).toEqual({
					message: "message",
					method: "dummy",
					module: "./test/unit/error.spec.ts"
				});
			});

			it("should inherit the 'error' param's stack", function() {
				const error = new Error();
				error.stack = "stack";
				const instance = new PigError({error});
				expect(instance.stack).toEqual("stack");
			});
		});
	});
});
