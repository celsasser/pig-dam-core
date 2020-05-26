/**
 * Date: 5/23/20
 * Time: 1:16 AM
 * @license MIT (see project's LICENSE file)
 */

import {
	resolve as resolvePath
} from "path";
import {findModuleRoot, getModulesRelativePath} from "../../src";

describe("module", function() {
	describe("getModulesRelativePath", function() {
		it("should properly find the relative path of this module", function() {
			const relative = getModulesRelativePath(__filename);
			expect(relative).toEqual("./test/unit/module.spec.ts");
		});
	});

	describe("findModuleRoot", function() {
		it("should properly find the root of this module's directory", function() {
			const root = findModuleRoot(__filename);
			expect(root).toEqual(resolvePath(__dirname, "../../"));
		});

		it("should properly find the root of this module's file", function() {
			const root = findModuleRoot(__filename);
			expect(root).toEqual(resolvePath(__dirname, "../../"));
		});

		it("should throw an exception if it cannot be found", function() {
			expect(findModuleRoot.bind(null, "/")).toThrow("could not find module root");
		});
	});
});
