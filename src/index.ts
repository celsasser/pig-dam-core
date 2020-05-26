/**
 * Date: 10/31/18
 * Time: 2:15 PM
 * @license MIT (see project's LICENSE file)
 */

import * as _promise from "./promise";
import * as _template from "./template";

export * from "./compare";
export * from "./date";
export * from "./error";
export * from "./format";
export * from "./log/base";
export * from "./log/console";
export * from "./module";
/**
 * We want mutable and immutable to be accessible directly
 */
export * from "./mutation";
export * from "./stack";
export * from "./test/filter";
export * from "./type";
export * from "./types";
export * from "./urn";

export const promise = _promise;
export const template = _template;
