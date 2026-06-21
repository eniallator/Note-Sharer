import type { FunctionComponent } from "react";
import type { AnyPathParam, PathParam } from "./path.ts";

export type RouteProps<Path extends readonly AnyPathParam[]> = Path extends [
  PathParam<infer Key, infer Value>,
  ...infer Tail,
]
  ? Tail extends AnyPathParam[]
    ? Record<Key, Value> & RouteProps<Tail>
    : never
  : {};

export interface Route<Path extends readonly AnyPathParam[]> {
  component: FunctionComponent<RouteProps<Path>>;
}
