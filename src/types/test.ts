/**
 * Date: 5/22/20
 * Time: 8:59 PM
 * @license MIT (see project's LICENSE file)
 */

/**
 * A description of test data. We are creating an interface so that we can
 * maintain consistency and so that we may build functional support around them
 */
export interface TestDescription {
	/**
	 * Disable this test
	 */
	disabled?: boolean;
	/**
	 * Expected results
	 */
	expected: any;
	/**
	 * Run this test alone
	 */
	exclusive?: boolean;
	/**
	 * Title of the text to be used as test title
	 */
	title: string;
}

