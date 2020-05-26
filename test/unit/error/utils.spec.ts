/**
 * Date: 5/24/20
 * Time: 9:37 PM
 * @license MIT (see project's LICENSE file)
 */

import {getErrorThrowSequence, PigError} from "../../../src/error";

describe("error.utils", function() {
	describe("getErrorThrowSequence", function() {
		it("should return single error if error is not of type PigError", function() {
			const error = new Error();
			expect(getErrorThrowSequence(error))
				.toEqual([error]);
		});

		it("should return single error if PigError does not have child error", function() {
			const error = new PigError({
				message: "message"
			});
			expect(getErrorThrowSequence(error))
				.toEqual([error]);
		});

		it("should return a sequence from the inside out", function() {
			const inside = new PigError({
				message: "inside"
			});
			const outside = new PigError({
				error: inside,
				message: "outside"
			});
			expect(getErrorThrowSequence(outside))
				.toEqual([
					inside,
					outside
				]);
		});
	});
});
