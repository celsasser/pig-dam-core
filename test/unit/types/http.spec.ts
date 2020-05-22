/**
 * Date: 12/8/17
 * Time: 8:05 PM
 * @license MIT (see project's LICENSE file)
 */

import {
	HttpMethod,
	HttpStatusCode,
	HttpStatusText
} from "../../../src/types";

describe("http", function() {
	describe("HttpMethod", function() {
		it("should encode values to be the same as the keyword", function() {
			expect(HttpMethod.CONNECT).toEqual("CONNECT");
			expect(HttpMethod.DELETE).toEqual("DELETE");
			expect(HttpMethod.GET).toEqual("GET");
			expect(HttpMethod.HEAD).toEqual("HEAD");
			expect(HttpMethod.OPTIONS).toEqual("OPTIONS");
			expect(HttpMethod.POST).toEqual("POST");
			expect(HttpMethod.PUT).toEqual("PUT");
		});
	});

	describe("HttpStatusCode", function() {
		it("should encode enum values as numbers", function() {
			expect(HttpStatusCode.OK).toEqual(200);
		});
	});

	describe("HttpStatusText", function() {
		it("should encode the proper text for enum values", function() {
			expect(HttpStatusText[HttpStatusCode.OK]).toEqual("OK");
		});
	});
});
