/**
 * Date: 05/27/18
 * Time: 7:15 PM
 */

import * as _ from "lodash";
import {PigError} from "../../../src";

describe("error.pig", function() {
	describe("PigError", function() {
		function errorToPOJO(error: Error): object {
			return _(error)
				.pick(Object.getOwnPropertyNames(error))
				.omit(["stack"])
				.value();
		}

		describe("constructor", function() {
			it("should populate all supported params properly", function() {
				const instance = new PigError({
					context: "context",
					details: "details",
					error: new Error("error"),
					message: "message",
					method: "method",
					statusCode: 100
				});
				expect(errorToPOJO(instance))
					.toEqual({
						context: "context",
						details: "details",
						error: new Error("error"),
						message: "message",
						method: "method",
						module: "./test/unit/error/pig.spec.ts",
						statusCode: 100
					});
			});

			it("should convert a newable context to a string", function() {
				const instance = new PigError({
					context: new Date()
				});
				expect(errorToPOJO(instance))
					.toEqual({
						context: "Date",
						method: "<anonymous>",
						module: "./test/unit/error/pig.spec.ts"
					});
			});

			it("should properly derive 'message' from 'error' param", function() {
				const error = new Error("message");
				const instance = new PigError({error});
				expect(errorToPOJO(instance))
					.toEqual({
						error,
						message: "message",
						method: "<anonymous>",
						module: "./test/unit/error/pig.spec.ts"
					});
			});

			it("make properly derive missing 'details' error", function() {
				const instance = new PigError({
					error: new Error("details"),
					message: "message"
				});
				expect(errorToPOJO(instance))
					.toEqual({
						details: "details",
						error: new Error("details"),
						message: "message",
						method: "<anonymous>",
						module: "./test/unit/error/pig.spec.ts"
					});
			});

			it("make properly derive missing 'details' status", function() {
				const instance = new PigError({
					message: "message",
					statusCode: 100
				});
				expect(errorToPOJO(instance))
					.toEqual({
						details: "Continue (100)",
						message: "message",
						method: "<anonymous>",
						module: "./test/unit/error/pig.spec.ts",
						statusCode: 100
					});
			});

			it("should pull textual name from a function method", function() {
				const instance = new PigError({
					message: "message",
					method: function dummy() {
					}
				});
				expect(errorToPOJO(instance))
					.toEqual({
						message: "message",
						method: "dummy",
						module: "./test/unit/error/pig.spec.ts"
					});
			});

			it("should properly derive 'context', 'method' and 'module' if not specified", function() {
				class DummyClass {
					public throw() {
						throw new PigError({
							message: "message"
						});
					}
				}

				const instance = new DummyClass();
				try {
					instance.throw();
				} catch(error) {
					expect(errorToPOJO(error))
						.toEqual({
							context: "DummyClass",
							message: "message",
							method: "throw",
							module: "./test/unit/error/pig.spec.ts"
						});
				}
			});
		});
	});
});
