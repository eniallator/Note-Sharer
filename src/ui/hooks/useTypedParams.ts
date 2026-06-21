import { Array, Option, pipe, Record } from "effect";
import { tuple } from "niall-utils";
import { useParams } from "react-router";

import type { AnyPathParam, PathParamsToValueRecord } from "@/routes/path.ts";

export function useTypedParams<const Params extends AnyPathParam[]>(
  params: Params,
): PathParamsToValueRecord<Params> {
  const rrParams = useParams();

  return pipe(
    params,
    Array.map((param) =>
      pipe(
        Option.fromNullable(rrParams[param.key]),
        Option.map((value) => tuple(param, value)),
        Option.getOrThrowWith(
          () => new Error(`No path param found for ${param.key}`),
        ),
      ),
    ),
    Record.fromIterableWith(([{ key, parse }, value]) =>
      tuple(key, parse(value)),
    ),
  ) as PathParamsToValueRecord<Params>;
}
