/**
 * Date: 5/24/20
 * Time: 1:33 PM
 * @license MIT (see project's LICENSE file)
 */

import {findInsertLocation, searchCriteriaToIndex} from "../../../src/mutation/utils";
import {FailurePolicy} from "../../../src/types";

describe("mutation.utils", function() {
	describe("findInsertLocation", function() {
		it("should throw exception if no criteria is specified", function() {
			expect(findInsertLocation.bind(null, [], {}))
				.toThrowError("essential insert criteria is missing");
		});

		it("should accurately find index after", function() {
			expect(findInsertLocation(["exists"], {
				after: "exists"
			})).toEqual(1);
		});

		it("should throw exception if after is not found", function() {
			expect(findInsertLocation.bind(null, ["exists"], {
				after: "DNE"
			})).toThrowError('could not find "after" element in array');
		});

		it("should accurately find index before", function() {
			expect(findInsertLocation(["exists"], {
				before: "exists"
			})).toEqual(0);
		});

		it("should throw exception if before is not found", function() {
			expect(findInsertLocation.bind(null, ["exists"], {
				before: "DNE"
			})).toThrowError('could not find "before" element in array');
		});

		it("should accurately find index by predicate", function() {
			expect(findInsertLocation(["exists"], {
				predicate: element => element === "exists"
			})).toEqual(0);
		});

		it("should throw exception if predicate fails", function() {
			expect(findInsertLocation.bind(null, ["exists"], {
				predicate: () => false
			})).toThrowError("could not find index by predicate");
		});

	});

	describe("searchCriteriaToIndex", function() {
		it("should throw exception if no criteria is specified", function() {
			expect(searchCriteriaToIndex.bind(null, [], {}))
				.toThrowError("essential search criteria is missing");
		});

		it("should return proper index if search by element succeeds", function() {
			expect(searchCriteriaToIndex(["exists"], {
				element: "exists"
			})).toEqual(0);
		});

		it("should return -1 by default if search by element not found", function() {
			expect(searchCriteriaToIndex(["exists"], {
				element: "DNE"
			})).toEqual(-1);
		});

		it("should throw exception if search by element not found and failure policy is throw", function() {
			expect(searchCriteriaToIndex.bind(null, ["exists"], {
				element: "DNE"
			}, FailurePolicy.Throw)).toThrowError("could not find specified element in array");
		});

		it("should return proper index if search by predicate succeeds", function() {
			expect(searchCriteriaToIndex(["exists"], {
				predicate: element => element === "exists"
			})).toEqual(0);
		});

		it("should return -1 by default if search by predicate failse", function() {
			expect(searchCriteriaToIndex(["exists"], {
				predicate: () => false
			})).toEqual(-1);
		});

		it("should throw exception if search by predicate failse and failure policy is throw", function() {
			expect(searchCriteriaToIndex.bind(null, ["exists"], {
				predicate: () => false
			}, FailurePolicy.Throw)).toThrowError("could not find element by predicate");
		});
	});
});
