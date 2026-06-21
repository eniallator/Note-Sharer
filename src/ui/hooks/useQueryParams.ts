import type { AnyUrlParam, UrlParam } from "../../routes/urlParam";
import { isFunction } from "deep-guards";
import { Option, pipe, Record } from "effect";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

type QueryFromParams<Params extends Record<string, UrlParam<unknown>>> = {
  [K in keyof Params]?: Params[K] extends UrlParam<infer T> ? T : never;
};

function searchToQuery<Params extends Record<string, UrlParam<unknown>>>(
  params: Params,
  searchParams: URLSearchParams,
): QueryFromParams<Params> {
  return Record.map(params, (param, key) =>
    pipe(
      Option.fromNullable(searchParams.get(key)),
      Option.map(param.parse),
      Option.getOrUndefined,
    ),
  ) as QueryFromParams<Params>;
}

function queryToSearch<Params extends Record<string, UrlParam<unknown>>>(
  params: Params,
  value: Partial<QueryFromParams<Params>>,
): Record<string, string> {
  return Record.filterMap(params, (param, key) =>
    pipe(Option.fromNullable(value[key]), Option.map(param.format)),
  );
}

type QueryParamsSetter<Params extends Record<string, UrlParam<unknown>>> = (
  value:
    | QueryFromParams<Params>
    | ((prev: QueryFromParams<Params>) => QueryFromParams<Params>),
) => void;

export function useQueryParams<Params extends Record<string, AnyUrlParam>>(
  params: Params,
): [QueryFromParams<Params>, QueryParamsSetter<Params>] {
  const [searchParams, setSearchParams] = useSearchParams();

  const setQueryParams = useCallback<QueryParamsSetter<Params>>(
    (value) =>
      setSearchParams((prev) =>
        queryToSearch(
          params,
          isFunction(value) ? value(searchToQuery(params, prev)) : value,
        ),
      ),
    [setSearchParams],
  );

  return useMemo(
    () => [searchToQuery(params, searchParams), setQueryParams],
    [params, searchParams, setQueryParams],
  );
}
