import type { HeadingProps } from "@chakra-ui/react/heading";
import type { ReactNode } from "react";

export interface Environment {
  use: (name: string, args: Record<string, string | null> | null) => ReactNode;
}

export const headingLevelSize: NonNullable<HeadingProps["size"]>[] = [
  "2xl",
  "xl",
  "lg",
  "md",
  "sm",
  "xs",
];
