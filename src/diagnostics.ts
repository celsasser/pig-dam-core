/**
 * Date: 3/5/2018
 * Time: 9:10 PM
 * @license MIT (see project's LICENSE file)
 *
 */


/**
 * Gets the current execution stack
 */
export function getStack({
	popCount = 0,
	maxLines = 10
} = {}): string {
	// pop ourselves
	popCount++;
	return groomStack(new Error().stack, {
		maxLines,
		popCount
	});
};

/**
 * Grooms the textual stack
 */
export function groomStack(stack?: string, {
	popCount = 0,
	maxLines = 10
} = {}): string {
	const lines = (stack || "").split("\n");
	if(popCount > 0) {
		lines.splice(0, popCount);
	}
	if(maxLines < lines.length) {
		lines.splice(maxLines);
	}
	return lines.join("\n");
};

