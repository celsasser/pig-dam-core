/**
 * Date: 6/4/18
 * Time: 10:56 AM
 * @license MIT (see project's LICENSE file)
 */

import {template} from "../../src";

describe("template", function() {
	it("should properly substitute variables in properly marked up template string", function() {
		const _template="This is a {{noun}} of the {{adjective}} broadcast system";
		expect(template.render(_template, {
			adjective: "emergency",
			noun: "test"
		})).toEqual("This is a test of the emergency broadcast system");
		expect(template.render(_template, {
			adjective: "fuzzy",
			noun: "cat"
		})).toEqual("This is a cat of the fuzzy broadcast system");
	});

	it("should properly substitute side by side variables", function() {
		const _template="{{a}}{{b}}";
		expect(template.render(_template, {
			a: "one",
			b: "two"
		})).toEqual("onetwo");
	});
});
