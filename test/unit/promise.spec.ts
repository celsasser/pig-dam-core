/**
 * Date: 2019-03-29
 * Time: 21:50
 * @license MIT (see project's LICENSE file)
 */

import {promise} from "../../src";

describe("promise", function() {
	describe("rejectNextTick", function() {
		it("should reject on next tick", async function() {
			const error = new Error("failed");
			return expect(promise.rejectNextTick(error))
				.rejects.toStrictEqual(error);
		});
	});

	describe("resolveNextTick", function() {
		it("should resolve on next tick", async function() {
			return expect(promise.resolveNextTick("input"))
				.resolves.toEqual("input");
		});
	});

	describe("series", function() {
		it("should properly create and return a promise chain", async function() {
			const accumulator: number[] = [];
			return promise.series([
				() => new Promise((resolve) => {
					accumulator.push(1);
					resolve();
				}),
				() => new Promise((resolve) => {
					accumulator.push(2);
					resolve();
				}),
				() => new Promise((resolve) => {
					accumulator.push(3);
					resolve();
				})
			])
				.then(() => {
					expect(accumulator).toEqual([1, 2, 3]);
				});
		});
	});
});
