/**
 * Date: 3/9/18
 * Time: 9:49 PM
 * @license MIT (see project's LICENSE file)
 */

import {immutable, mutable} from "../../../../src/mutation";


describe("mutation.mutable.array", function() {
	describe("add", function() {
		it("should create an array if param is null", function() {
			expect(mutable.array.add(null as unknown as [], 1)).toEqual([1]);
		});

		it("should append an element to an existing array", function() {
			const original=[1];
			mutable.array.add(original, 2);
			expect(original).toEqual([1, 2]);
		});

		it("should insert an element to an existing array by index", function() {
			const original = [1, 3];
			const result = immutable.array.add(original, 2, {
				index: 1
			});
			expect(result).toEqual([1, 2, 3]);
		});

		it("should insert an element after an element", function() {
			const original = [1, 3];
			const result = immutable.array.add(original, 2, {
				after: 1
			});
			expect(result).toEqual([1, 2, 3]);
		});

		it("should insert an element before an element", function() {
			const original = [1, 3];
			const result = immutable.array.add(original, 2, {
				before: 3
			});
			expect(result).toEqual([1, 2, 3]);
		});
	});

	describe("concat", function() {
		it("should return original if param is null", function() {
			expect(mutable.array.concat(null as unknown as [], [1])).toEqual([1]);
		});

		it("should append an element to an existing array", function() {
			const original=[1];
			mutable.array.concat(original, [2, 3]);
			expect(original).toEqual([1, 2, 3]);
		});

		it("should insert elements into an existing array by index", function() {
			const original = [1, 4];
			const result = immutable.array.concat(original, [2, 3], {
				index: 1
			});
			expect(result).toEqual([1, 2, 3, 4]);
		});

		it("should insert elements after an element", function() {
			const original = [1, 4];
			const result = immutable.array.concat(original, [2, 3], {
				after: 1
			});
			expect(result).toEqual([1, 2, 3, 4]);
		});

		it("should insert elements before an element", function() {
			const original = [1, 4];
			const result = immutable.array.concat(original, [2, 3], {
				before: 4
			});
			expect(result).toEqual([1, 2, 3, 4]);
		});
	});

	describe("omit", function() {
		it("should return null if array is null", function() {
			expect(mutable.array.omit(null as unknown as [], "path")).toEqual(null);
		});

		it("should return source array with omitted property", function() {
			const source=[
				{a: "a1", b: "b1"},
				{a: "a2", b: "b2"}
			];
			const result=mutable.array.omit(source, "b");
			expect(result).toEqual(source);
			expect(result).toEqual([
				{a: "a1"},
				{a: "a2"}
			]);
		});
	});

	describe("pick", function() {
		it("should return null if array is null", function() {
			expect(mutable.array.pick(null as unknown as [], "path")).toEqual(null);
		});

		it("should return source array with picked property", function() {
			const source=[
				{a: "a1", b: "b1"},
				{a: "a2", b: "b2"}
			];
			const result=mutable.array.pick(source, "b");
			expect(result).toEqual(source);
			expect(result).toEqual([
				{b: "b1"},
				{b: "b2"}
			]);
		});
	});

	describe("remove", function() {
		it("should remove an element by reference", function() {
			const original=["good", "bad"];
			mutable.array.remove(original, {element: "bad"});
			expect(original).toEqual(["good"]);
		});

		it("should remove an element by index", function() {
			const original=["good", "bad"];
			mutable.array.remove(original, {index: 0});
			expect(original).toEqual(["bad"]);
		});
	});

	describe("replace", function() {
		it("should replace an element by reference", function() {
			const original=["good", "bad"];
			mutable.array.replace(original, "new", {element: "bad"});
			expect(original).toEqual(["good", "new"]);
		});

		it("should replace an element by index", function() {
			const original=["good", "bad"];
			mutable.array.replace(original, "new", {index: 1});
			expect(original).toEqual(["good", "new"]);
		});
	});
});
