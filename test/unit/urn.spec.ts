/**
 * Date: 2019-07-13
 * Time: 14:11
 * @license MIT (see project's LICENSE file)
 */

import {createUrn, parseUrn} from "../../src";

describe("urn", function() {
	describe("create", function() {
		it("should properly create a urn by path param", function() {
			const result = createUrn({
				path: "cat:george"
			});
			expect(result).toMatch(/^urn:cat:george:[\w_-]+$/);
		});

		it("should properly create a urn by parts param", function() {
			const result = createUrn({
				path: ["cat", "george"]
			});
			expect(result).toMatch(/^urn:cat:george:[\w_-]+$/);
		});

		it("should use id specified as param if included", function() {
			const result = createUrn({
				nss: "id",
				path: ["cat", "george"]
			});
			expect(result).toEqual("urn:cat:george:id");
		});
	});

	describe("parse", function() {
		it("should throw an exception if not a valid urn", function() {
			expect(parseUrn.bind(null, "invalid"))
				.toThrow('invalid urn "invalid"');
		});

		it("should properly parse with with array of parts result by default", function() {
			const {parts, nss} = parseUrn("urn:cat:george:id");
			expect(parts).toEqual(["cat", "george"]);
			expect(nss).toEqual("id");
		});

		it("should properly parse with with object of parts result if parts param is defined", function() {
			const {parts, nss} = parseUrn("urn:cat:george:id", ["species", "name"]);
			expect(parts).toEqual({
				name: "george",
				species: "cat"
			});
			expect(nss).toEqual("id");
		});

		it("should throw an exception if parts length does not match parsed length", function() {
			expect(parseUrn.bind(null, "urn:cat:george:id", ["species"]))
				.toThrow('parts=["species"] is mismatched with urn urn:cat:george:id');
		});
	});
});
