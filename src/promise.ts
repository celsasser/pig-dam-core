/**
 * Date: 3/5/2018
 * Time: 9:10 PM
 * @license MIT (see project's LICENSE file)
 *
 */

/**
 * Creates a promise that resolves upon process.nextTick
 */
export function rejectNextTick<T = any>(...args: any[]): Promise<T> {
	return new Promise((resolve, reject) => {
		process.nextTick(reject, ...args);
	});
}

/**
 * Creates a promise that rejects upon process.nextTick
 */
export function resolveNextTick<T = any>(...args: any[]): Promise<T> {
	return new Promise((resolve) => {
		process.nextTick(resolve, ...args);
	});
}

export const parallel = Promise.all;

/**
 * Creates a process chain out of an array of promise factories.  Why can't they be promises? Because promises execute immediately.
 * We want to defer execution until the prior promise has resolved.
 * @param series - series of functions that return promises
 * @param initialParameter - initial parameter into <code>series[0]()</code>
 */
export function series<T = any>(series: (() => Promise<T>)[], initialParameter?: T): Promise<T> {
	return series.reduce(
		(current: Promise<T>, next: () => Promise<T>) => current.then(next),
		Promise.resolve(initialParameter as T)
	);
}
