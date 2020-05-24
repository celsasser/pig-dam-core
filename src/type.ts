/**
 * Date: 3/5/2018
 * Time: 9:10 PM
 *
 */

/**
 * Gets the object name if possible. If not then the type.
 */
export function getTypeName(object?: any): string {
	return (object == null)
		? String(object)
		: object.constructor.name;
}
