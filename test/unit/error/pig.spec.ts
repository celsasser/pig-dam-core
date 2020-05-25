/**
 * Date: 05/27/18
 * Time: 7:15 PM
 */

import * as _ from "lodash";
import {PigError} from "../../../src";

describe("error.pig", function() {
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
					context: "context",
					details: "details",
					error: new Error("error"),
					message: "message",
					method: "method",
					statusCode: 100
				});
				expect(_toPOJO(instance)).toEqual({
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
				expect(_toPOJO(instance)).toEqual({
					context: "Date",
					method: "<anonymous>",
					module: "./test/unit/error/pig.spec.ts",
				});
			});

			it("should properly derive 'message' from 'error' param", function() {
				const error = new Error("message");
				const instance = new PigError({error});
				expect(_toPOJO(instance)).toEqual({
					error,
					message: "message",
					method: "<anonymous>",
					module: "./test/unit/error/pig.spec.ts"
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
					method: "<anonymous>",
					module: "./test/unit/error/pig.spec.ts"
				});

				expect(_toPOJO(new PigError({
					message: "message",
					statusCode: 100
				}))).toEqual({
					details: "Continue (100)",
					message: "message",
					method: "<anonymous>",
					module: "./test/unit/error/pig.spec.ts",
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
					module: "./test/unit/error/pig.spec.ts"
				});
			});

			it("should properly derive class and method if not specified", function() {
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
					expect(_toPOJO(error)).toEqual({
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
