import type { HeadingProps } from "@chakra-ui/react/heading";
import type { ReactElement } from "react";

export interface Environment {
  use: (
    name: string,
    args: Record<string, string | null> | null
  ) => ReactElement | null;
}

export const headingLevelSize: NonNullable<HeadingProps["size"]>[] = [
  "2xl",
  "xl",
  "lg",
  "md",
  "sm",
  "xs",
];
