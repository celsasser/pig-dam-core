/**
 * Date: 5/24/20
 * Time: 9:29 PM
 * @license MIT (see project's LICENSE file)
 */


import {PigError} from "./pig";

/**
 * How do you translate a single error into a "throw sequence". Generally we cannot.
 * BUT if they are PigErrors and they were created with "child" errors then we can
 * recreate the scene of the crime.
 * Builds the sequence in the order of time - from the inside out.
 */
export function getErrorThrowSequence(error: Error): Error[] {
	if(error instanceof PigError && error.error!==undefined) {
		return getErrorThrowSequence(error.error)
			.concat(error);
	}
	return [error];
}

/**
 * reverses `getErrorThrowSequence`
 */
export function getReverseErrorThrowSequence(error: Error): Error[] {
	return getErrorThrowSequence(error).reverse();
}
