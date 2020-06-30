/**
 * Date: 6/2/20
 * Time: 10:51 PM
 * @license MIT (see project's LICENSE file)
 */

/**
 * Indents lines with the message. We use it for indenting nested errors
 * @param text - text to indent
 * @param depth - number of multiples of `indent`
 * @param indent - the text to use for each `depth`
 * @param skip - how many lines to skip before we start indenting
 */
export function indentText(text: string, depth: number, {
	indent = "   ",
	skip = 0
}: {
	indent?: string,
	skip?: number,
} = {}): string {
	if(depth === 0) {
		return text;
	}
	return text.split(/\n/)
		.map((line, index) => {
			return (index >= skip && line.trim().length > 0)
				? `${indent.repeat(depth)}${line}`
				: line;
		})
		.join("\n");
}

