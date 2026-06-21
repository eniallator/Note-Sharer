import { isFunction } from "deep-guards";
import { raise } from "niall-utils";

import type { UrlParam } from "./urlParam.js";

export interface PathParam<
  Key extends string = string,
  Value = unknown,
> extends UrlParam<Value> {
  key: Key;
}

export type AnyPathParam = PathParam<string, any>;

export function createPathParam<const Key extends string, Value>(
  key: Key,
  parse: (param: string) => Value,
  format: (value: Value) => string,
): PathParam<Key, Value>;
export function createPathParam<const Key extends string, Value>(
  key: Key,
  urlParam: UrlParam<Value>,
): PathParam<Key, Value>;
export function createPathParam<const Key extends string, Value>(
  key: Key,
  parseOrUrlParam: ((param: string) => Value) | UrlParam<Value>,
  format?: (value: Value) => string,
): PathParam<Key, Value> {
  return isFunction(parseOrUrlParam)
    ? {
        key,
        parse: parseOrUrlParam,
        format:
          format ??
          raise(new Error(`No format fn found for ${key} path parameter`)),
      }
    : { key, ...parseOrUrlParam };
}

export type PathParamsToValueRecord<Params extends AnyPathParam[]> =
  Params extends [PathParam<infer Key, infer Value>, ...infer Tail]
    ? Tail extends AnyPathParam[]
      ? Record<Key, Value> & PathParamsToValueRecord<Tail>
      : never
    : unknown;
