/**
 * Date: 3/9/18
 * Time: 8:23 PM
 * @license MIT (see project's LICENSE file)
 */

import * as immutableArray from "./immutable/array";
import * as immutableObject from "./immutable/object";
import * as mutableArray from "./mutable/array";
import * as mutableObject from "./mutable/object";

export const immutable = {
	array: immutableArray,
	object: immutableObject
};

export const mutable = {
	array: mutableArray,
	object: mutableObject
};
