/**
 * Date: 5/23/20
 * Time: 1:03 AM
 * @license MIT (see project's LICENSE file)
 */

import {existsSync, statSync} from "fs";
import {parse as parsePath} from "path";


/**
 * Gets the module's relative path to its own root. For example - "./src/core/module.ts"
 * @throws {Error}
 */
export function getModulesRelativePath(modulePath: string): string {
	// find the root of the project. Such as "/projects/xraymen". We basically want to tear that off
	const root = findModuleRoot(modulePath);
	return `.${modulePath.substr(root.length)}`;
}

/**
 * Finds the root for the module belonging to <param>modulePath</param>. It will not include a trailing "/".
 * @throws {Error}
 */
export function findModuleRoot(modulePath: string): string {
	function ascendPath(path: string): string {
		const result = parsePath(path).dir;
		if(result === path) {
			// our way of detecting the top with nowhere to go.
			// Strangely path.parse("/").dir returns "/"
			throw new Error("could not find module root");
		}
		return result;
	}

	function findRoot(path: string): string {
		return existsSync(`${path}/node_modules`)
			? path
			: findRoot(ascendPath(path));
	}

	const stat = statSync(modulePath);
	return (stat.isDirectory())
		? findRoot(modulePath)
		: findRoot(ascendPath(modulePath));
}
