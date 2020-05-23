/**
 * Date: 10/31/18
 * Time: 2:15 PM
 * @license MIT (see project's LICENSE file)
 */

import * as _promise from "./promise";
import * as _template from "./template";
import * as _type from "./type";
import * as _urn from "./urn";

export * from "./compare";
export * from "./date";
export * from "./diagnostics";
export * from "./error";
export * from "./format";
export * from "./log/base";
export * from "./log/console";
/**
 * We want mutable and immutable to be accessible directly
 */
export * from "./mutation";
export * from "./test/filter";
export * from "./types";

export const promise = _promise;
export const template = _template;
export const type = _type;
export const urn = _urn;
