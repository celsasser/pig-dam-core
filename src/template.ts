/**
 * Date: 6/3/18
 * Time: 11:39 PM
 * @license MIT (see project's LICENSE file)
 *
 */

import * as _ from "lodash";
import {PigError} from "./error";

const cache: {[key: string]: _.TemplateExecutor} = {};

/**
 * Does substitution of variables in template string. Encoding of variables should be as follows: {{variable}}
 * @param template
 * @param variables - set of key/values
 * @param interpolate - regex pattern for finding substitution variables
 */
export function render(template: string, variables: {[key: string]: any}, {
	interpolate = /{{\s*(\S+?)\s*}}/g
}: {
	interpolate?: RegExp
} = {}): string {
	if(!(template in cache)) {
		cache[template] = _.template(template, {interpolate});
	}
	try {
		return cache[template](variables);
	} catch(error) {
		throw new PigError({
			details: `function=${cache[template].toString()}\nvariables=${JSON.stringify(variables)}`,
			error,
			message: `attempt to render template='${template}' failed`
		});
	}
}
