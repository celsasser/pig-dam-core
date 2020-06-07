/**
 * Date: 3/9/18
 * Time: 9:49 PM
 * @license MIT (see project's LICENSE file)
 */

import {immutable} from "../../../../src/mutation";


describe("mutation.immutable.object", function() {
	describe("clone", function() {
		it("should remain immutable", function() {
			const source = Object.freeze({
				body: "data"
			});
			const result = immutable.object.clone(source);
			expect(result).toEqual(source);
			expect(source === result).toBeFalsy();
		});
	});

	describe("deletePath", function() {
		it("should clone the object and call down to mutable", function() {
			const source = {
				a: "value"
			};
			const result = immutable.object.deletePath(source, "a");
			expect(result).not.toStrictEqual(source);
			expect(result).toEqual({});
		});
	});

	describe("ensure", function() {
		it("should clone the object and call down to mutable", function() {
			const source = {};
			const result = immutable.object.ensure(source, "a", "value");
			expect(result).not.toStrictEqual(source);
			expect(result).toEqual({
				a: "value"
			});
		});
	});

	describe("scrub", function() {
		it("should return undefined if object param is undefined", function() {
			expect(immutable.object.scrub(undefined)).toEqual(undefined);
		});

		it("should return null if object param is null ", function() {
			expect(immutable.object.scrub(null)).toEqual(null);
		});

		it("should make a deep copy and call down to mutable.object.scrub", function() {
			const source = Object.freeze({
				defined: "defined",
				undefined
			});
			const result = immutable.object.scrub(source);
			expect(result).toEqual({
				defined: "defined"
			});
		});
	});

	describe("sort", function() {
		it("should return null if passed null", function() {
			expect(immutable.object.sort(null)).toEqual(null);
		});

		it("should sort and return an object's properties", function() {
			// tslint:disable: object-literal-sort-keys
			const source = {
				b1: {
					b2: "b2",
					a2: "a2"
				},
				a1: {
					b2: "b2",
					a2: "a2"
				}
			};
			const result = immutable.object.sort(source);
			expect(source).toEqual({
				b1: {
					b2: "b2",
					a2: "a2"
				},
				a1: {
					b2: "b2",
					a2: "a2"
				}
			});
			expect(result).toEqual({
				a1: {
					a2: "a2",
					b2: "b2"
				},
				"b1": {
					a2: "a2",
					b2: "b2"
				}
			});
		});
	});
});
