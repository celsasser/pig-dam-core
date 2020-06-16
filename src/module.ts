/**
 * Date: 5/23/20
 * Time: 1:03 AM
 * @license MIT (see project's LICENSE file)
 */

import {existsSync, readFileSync, statSync} from "fs";
import {join as joinPath, parse as parsePath} from "path";

/**
 * Get's this module's application package.json contents
 * @throws {Error}
 */
export function getModulesApplicationPackage(): {[key:string]: any}|undefined {
	function getPackage(directory: string): {[key:string]: any}|undefined {
		const path = joinPath(directory, "package.json");
		if(existsSync(path)) {
			return JSON.parse(readFileSync(path, "utf-8"));
		} else if(directory.length > 1) {
			return getPackage(parsePath(directory).dir);
		} else {
			throw new Error("could not find module's application package");
		}
	}
	return getPackage(getModulesApplicationRoot());
}

/**
 * Get's this module's application root directory. Actually it gets the directory of wherever the script
 * that started up the application in which this is.
 * @throws {Error}
 */
export function getModulesApplicationRoot(): string {
	if(require.main) {
		return parsePath(require.main.filename).dir;
	} else {
		throw new Error("could not find module's application root");
	}
}

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
