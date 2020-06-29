/**
 * Date: 6/7/20
 * Time: 11:56 PM
 * @license MIT (see project's LICENSE file)
 */

/**
 * Model we use for formatting errors and share with you our valued customers.
 */
export interface FormatErrorModel {
	/**
	 * Details that further describe the message
	 */
	details?: string;
	/**
	 * Location at which the error was thrown: module:context:method
	 */
	location?: string;
	message: string;
	/**
	 * Information about nested error
	 */
	nested?: FormatErrorModel;
	/**
	 * Parsed stack lines
	 */
	stack: string[];
}
