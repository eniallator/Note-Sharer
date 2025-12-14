import { tuple } from "@/utils/tuple.ts";
import {
  Marked,
  type Links,
  type MarkedToken,
  type Token,
  type TokenizerAndRendererExtension,
} from "marked";
import type { ReactElement } from "react";
import type { Environment } from "./types.ts";

export interface Directive {
  type: "directive";
  name: string;
  args: Record<string, string | null> | null;
  element: ReactElement | null;
  raw: string;
}

export type MarkdownToken = MarkedToken | Directive;
export const unsafeMarkdownToken = (token: Token) => token as MarkdownToken;

const directiveRegex =
  /^:(?<name>[^:\s?=]+)(?<args>\?[^:\s?=&]+=?[^:\s?=&]*(&[^:\s?=&]+=?[^:\s?=&]*)*)?:/;

const directiveExtension = (
  environment: Environment
): TokenizerAndRendererExtension => ({
  name: "directive",
  level: "inline",
  tokenizer(raw, _tokens): Directive | undefined {
    const match = directiveRegex.exec(raw);
    if (match?.groups?.name != null) {
      const args =
        match.groups.args != null
          ? Object.fromEntries(
              match.groups.args
                .slice(1)
                .split("&")
                .map((s) => {
                  const [key, value] = s.split("=");
                  return tuple(key as string, value ?? null);
                })
            )
          : null;

      return {
        type: "directive",
        name: match.groups.name,
        element: environment.use(match.groups.name, args),
        args,
        raw,
      };
    } else {
      return undefined;
    }
  },
});

export const tokenizeMarkdown = (
  template: string,
  environment: Environment
) => {
  const marked = new Marked({
    extensions: [directiveExtension(environment)],
  });
  return marked.lexer(template) as MarkdownToken[] & {
    links: Links;
  };
};
