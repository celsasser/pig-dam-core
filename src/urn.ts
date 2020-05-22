/**
 * Date: 2019-07-13
 * Time: 13:42
 * @license MIT (see project's LICENSE file)
 *
 */

import * as shortid from "shortid";

/**
 * Creates a urn either by <param>path</param> or by <param>parts</param>:
 *  - path: "urn:<path>:<nss>"
 *  - parts: "urn:<path[0]>:<path[2]>...<path[n-1]>:<nss>"
 */
export function create({path,
	nss = shortid.generate()
}: {
	nss?: string,
	path?: string|string[]
}): string {
	return (Array.isArray(path))
		? `urn:${path.join(":")}:${nss}`
		: `urn:${path}:${nss}`;
}

/**
 * Parses a urn and returns bits
 * @param urn - the whole urn
 * @param parts - optionally may specify the names of the parts in which case the
 *    result will be an object of values mapped to these part names.
 * @throws {Error}
 */
export function parse(urn: string, parts?: string[]): {
	parts: string[]|{[index: string]: string},
	nss: string
} {
	const match = urn.match(/^urn:(([\w_-]+):){1,}([\w_-]+)$/);
	if(match === null) {
		throw new Error(`invalid urn "${urn}"`);
	} else {
		const split = urn.split(":");
		if(parts === undefined) {
			return {
				parts: split.slice(1, split.length - 1),
				nss: split[split.length - 1]
			};
		} else {
			if(parts.length !== split.length - 2) {
				throw new Error(`parts=${JSON.stringify(parts)} is mismatched with urn ${urn}`);
			}
			return {
				parts: parts.reduce((result: {[index: string]: string}, part: string, index: number) => {
					result[part] = split[index + 1];
					return result;
				}, {}),
				nss: split[split.length - 1]
			};
		}
	}
}
