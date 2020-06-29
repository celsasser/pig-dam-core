/**
 * Date: 6/7/20
 * Time: 11:56 PM
 * @license MIT (see project's LICENSE file)
 */

export interface FormatErrorProperties {
	/**
	 * whether to dig the details out of the error or not?
	 */
	details: boolean;
	/**
	 * whether to prefix the message with location where the error was thrown
	 */
	location: boolean;
	/**
	 * recurse into nested errors
	 */
	recurse: boolean;
	/**
	 * whether to include the stack or not
	 */
	stack: boolean;
}

/**
 * Model we use for formatting errors and share with you our valued customers.
 */
export interface FormatErrorModel {
	/**
	 * Details that further describe the message
	 */
	details?: string;
	error: Error;
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
