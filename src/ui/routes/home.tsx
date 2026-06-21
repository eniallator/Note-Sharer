import { urlParams } from "../../routes/urlParam.js";
import { useQueryParams } from "../hooks/useQueryParams.ts";

import type { RouteProps } from "@/routes/route.ts";
import type { ReactElement } from "react";

const pathParams = {
  noteId: urlParams.noteId,
};

const queryParams = {
  num: urlParams.num,
};

export default function Home(
  props: RouteProps<typeof pathParams>,
): ReactElement {
  const [query, setQuery] = useQueryParams(queryParams);

  return <></>;
}

export const route = {};
