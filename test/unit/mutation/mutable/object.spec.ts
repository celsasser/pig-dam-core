/**
 * Date: 3/9/18
 * Time: 9:49 PM
 * @license MIT (see project's LICENSE file)
 */

import {mutable} from "../../../../src/mutation";


describe("mutation.mutable.object", function() {
	describe("deletePath", function() {
		it("should not do anything if object is empty", function() {
			expect(mutable.object.deletePath({}, "a")).toEqual({});
		});

		it("should not do anything if path does not exist", function() {
			const result=mutable.object.deletePath({
				a: {b: 1}
			}, "a.c");
			expect(result).toEqual({
				a: {b: 1}
			});
		});

		it("should delete root if no depth", function() {
			const result=mutable.object.deletePath({
				a: {b: 1}
			}, "a");
			expect(result).toEqual({});
		});

		it("should nested property properly", function() {
			const result=mutable.object.deletePath({
				a: {
					b: {
						c: 1,
						d: 2
					}
				}
			}, "a.b.c");
			expect(result).toEqual({
				a: {
					b: {d: 2}
				}
			});
		});

		it("should delete array element if target is an array", function() {
			const result=mutable.object.deletePath({
				a: [1, 2]
			}, "a.1");
			expect(result).toEqual({a: [1]});
		});
	});

	describe("ensure", function() {
		it("should set an object and return the value", function() {
			const source={a: 1}
			const result=mutable.object.ensure(source, "b", 2);
			expect(result).toEqual({
				a: 1,
				b: 2
			});
		});

		it("should find an existing value, not update it and return it", function() {
			const source={
					a: {
						b: 1
					}
				};
			const result=mutable.object.ensure(source, "a", {});
			expect(result).toEqual({
				a: {
					b: 1
				}
			});
		});
	});


	describe("scrub", function() {
		it("should return undefined if object param is undefined", function() {
			expect(mutable.object.scrub(undefined)).toEqual(undefined);
		});

		it("should return null if object param is null ", function() {
			expect(mutable.object.scrub(null)).toEqual(null);
		});

		it("should return empty object if object param is a {}", function() {
			expect(mutable.object.scrub({})).toEqual({});
		});

		it("should not recurse if told not to", function() {
			const scrubbed=mutable.object.scrub({
				a: {
					b: undefined
				}
			}, {
				recursive: false
			});
			expect(scrubbed).toEqual({
				a: {
					b: undefined
				}
			});
		});

		it("should recurse if told to", function() {
			const scrubbed=mutable.object.scrub({
				a: {
					b: undefined
				}
			}, {
				recursive: true
			});
			expect(scrubbed).toEqual( {
				a: {}
			});
		});

		it("should remove shallow undefined property", function() {
			const scrubbed=mutable.object.scrub({
				a: "a",
				b: undefined
			});
			expect(scrubbed).toEqual( {a: "a"});
		});

		it("should remove deep undefined property if recursive==true", function() {
			const scrubbed=mutable.object.scrub({
				a: {
					b: undefined
				}
			});
			expect(scrubbed).toEqual({
				a: {}
			});
		});

		it("should remove extended set of objects in removables param", function() {
			const scrubbed=mutable.object.scrub({
				a: {
					b: undefined,
					c: null
				}
			}, {
				recursive: true,
				removables: [undefined, null, {}]
			});
			expect(scrubbed).toEqual( {});
		});

		it("should remove removables from objects in an array", function() {
			const scrubbed=mutable.object.scrub([
				{
					a: "a",
					b: undefined
				}
			]);
			expect(scrubbed).toEqual( [
				{a: "a"}
			]);
		});
	});
});
