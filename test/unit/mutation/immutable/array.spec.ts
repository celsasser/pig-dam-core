/**
 * Date: 3/9/18
 * Time: 9:49 PM
 * @license MIT (see project's LICENSE file)
 */

import {immutable} from "../../../../src/mutation";


describe("mutation.immutable.array", function() {
	describe("add", function() {
		it("should create an array if param is null", function() {
			const result = immutable.array.add(null as unknown as number[], 1);
			expect(result).toEqual([1]);
		});

		it("should append an element to array and return new result", function() {
			const original = Object.freeze([1]);
			const result = immutable.array.add(original as number[], 2);
			expect(result).toEqual([1, 2]);
		});

		it("should insert an element to an existing array", function() {
			const original = Object.freeze([1, 3]);
			const result = immutable.array.add(original as number[], 2, 1);
			expect(result).toEqual([1, 2, 3]);
		});
	});

	describe("concat", function() {
		it("should return original if param is null", function() {
			const result = immutable.array.concat(null as unknown as number[], [1]);
			expect(result).toEqual([1]);
		});

		it("should append an element to an existing array", function() {
			const original = Object.freeze([1]);
			const result = immutable.array.concat(original as number[], [2, 3]);
			expect(result).toEqual([1, 2, 3]);
		});

		it("should insert elements into an existing array", function() {
			const original = Object.freeze([1, 4]);
			const result = immutable.array.concat(original as number[], [2, 3], 1);
			expect(result).toEqual([1, 2, 3, 4]);
		});
	});

	describe("omit", function() {
		it("should return [] if array is null", function() {
			const result = immutable.array.omit(null as unknown as object[], "path");
			expect(result).toEqual([]);
		});

		it("should return source array with omitted property", function() {
			const source = [
				{a: "a1", b: "b1"},
				{a: "a2", b: "b2"}
			];
			const result = immutable.array.omit(source, "b");
			expect(source).toEqual([
				{a: "a1", b: "b1"},
				{a: "a2", b: "b2"}
			]);
			expect(result).toEqual([
				{a: "a1"},
				{a: "a2"}
			]);
		});
	});

	describe("pick", function() {
		it("should return [] if array is null", function() {
			expect(immutable.array.pick(null as unknown as object[], "path")).toEqual([]);
		});

		it("should return source array with picked property", function() {
			const source = [
				{a: "a1", b: "b1"},
				{a: "a2", b: "b2"}
			];
			const result = immutable.array.pick(source, "b");
			expect(source).toEqual([
				{a: "a1", b: "b1"},
				{a: "a2", b: "b2"}
			]);
			expect(result).toEqual([
				{b: "b1"},
				{b: "b2"}
			]);
		});
	});

	describe("remove", function() {
		it("should remove an element by reference", function() {
			const original = Object.freeze(["good", "bad"]);
			const result = immutable.array.remove(original as string[], {element: "bad"});
			expect(result).toEqual(["good"]);
		});

		it("should remove an element by index", function() {
			const original = Object.freeze(["good", "bad"]);
			const result = immutable.array.remove(original as string[], {index: 0});
			expect(result).toEqual(["bad"]);
		});
	});

	describe("replace", function() {
		it("should replace an element by reference", function() {
			const original = Object.freeze(["good", "bad"]);
			const result = immutable.array.replace(original as string[], "new", {element: "bad"});
			expect(result).toEqual(["good", "new"]);
		});

		it("should replace an element by index", function() {
			const original = Object.freeze(["good", "bad"]);
			const result = immutable.array.replace(original as string[], "new", {index: 1});
			expect(result).toEqual(["good", "new"]);
		});
	});
});
