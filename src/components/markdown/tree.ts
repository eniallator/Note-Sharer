import { checkExhausted, raise } from "@/utils/core.ts";
import { Node as MarkdownNode, Parser } from "commonmark";
import { isString } from "deep-guards";
import {
  headingLevels,
  type BranchNode,
  type Environment,
  type Item,
  type LeafNode,
  type Tree,
} from "./types.ts";

const parser = new Parser();

const CONTEXT_VAR_REGEX = /{{(?<var>[^}]+)}}/;

const eatWhitespace = (raw: string): string =>
  raw.trim().replaceAll(/(\s)\s+/, "$1");

const applyEnvironment = (rawString: string, { getAs }: Environment): string =>
  rawString.replaceAll(
    CONTEXT_VAR_REGEX,
    (_original, contextVar: string) =>
      getAs(eatWhitespace(contextVar), isString) ?? ""
  );

export const markdownTree = (
  template: string,
  environment?: Environment
): Tree => {
  const tree: Tree = { type: "Tree", childNodes: [] };
  const cursorStack: (Item | BranchNode | Tree)[] = [tree];

  const lastCursor = (): Item | BranchNode | Tree =>
    cursorStack.at(-1) ?? raise(new Error("No Cursor found!"));

  const enterBranch = (node: BranchNode | Item) => {
    const cursor = lastCursor();
    if (cursor.type === "List" && node.type === "Item") {
      cursor.items.push(node);
      cursorStack.push(node);
    } else if (cursor.type !== "List" && node.type !== "Item") {
      cursor.childNodes.push(node);
      cursorStack.push(node);
    } else {
      raise(
        new Error(`Unexpected child type ${node.type} from ${cursor.type}`)
      );
    }
  };
  const exitBranch = () => {
    cursorStack.pop();
  };
  const addLeaf = (node: LeafNode) => {
    const cursor = lastCursor();
    if (cursor.type !== "List") {
      const lastChild = cursor.childNodes.at(-1);
      if (node.type === "Text" && lastChild?.type === "Text") {
        lastChild.text += node.text;
      } else {
        cursor.childNodes.push(node);
      }
    } else {
      raise(
        new Error(`Unexpected child type ${node.type} from ${cursor.type}`)
      );
    }
  };

  const walker = parser
    .parse(
      environment != null ? applyEnvironment(template, environment) : template
    )
    .walker();
  let event;

  while ((event = walker.next()) != null) {
    const { entering, node } = event;

    const getOrThrow = <K extends keyof MarkdownNode>(
      attr: K
    ): Exclude<MarkdownNode[K], undefined | null> => {
      if (node[attr] != null) {
        return node[attr] as Exclude<MarkdownNode[K], undefined | null>;
      } else {
        throw new Error(`Node ${node.type} has unexpected null: ${attr}`);
      }
    };

    if (entering) {
      switch (node.type) {
        case "block_quote":
          enterBranch({ type: "BlockQuote", childNodes: [] });
          break;

        case "code":
          addLeaf({ type: "Code", code: getOrThrow("literal") });
          break;

        case "code_block":
          addLeaf({
            type: "CodeBlock",
            info: node.info,
            code: getOrThrow("literal"),
          });
          break;

        case "custom_block":
          addLeaf({ type: "CustomBlock", text: getOrThrow("literal") });
          break;

        case "custom_inline":
          addLeaf({ type: "CustomInline", text: getOrThrow("literal") });
          break;

        case "document":
          enterBranch({ type: "Document", childNodes: [] });
          break;

        case "emph":
          enterBranch({ type: "TextStyle", variant: "Emph", childNodes: [] });
          break;

        case "heading":
          enterBranch({
            type: "Heading",
            level:
              headingLevels[Math.max(1, Math.min(6, node.level)) - 1] ??
              raise(new Error("No heading level found!")),
            childNodes: [],
          });
          break;

        case "html_block":
          addLeaf({ type: "HTMLBlock", html: getOrThrow("literal") });
          break;

        case "html_inline":
          addLeaf({ type: "HTMLInline", html: getOrThrow("literal") });
          break;

        case "image":
          enterBranch({
            type: "Image",
            src: getOrThrow("destination"),
            title: node.title,
            childNodes: [],
          });
          break;

        case "item":
          enterBranch({ type: "Item", childNodes: [] });
          break;

        case "linebreak":
          addLeaf({ type: "Break", variant: "Line" });
          break;

        case "link":
          enterBranch({
            type: "Link",
            href: getOrThrow("destination"),
            title: node.title,
            childNodes: [],
          });
          break;

        case "list":
          enterBranch({
            type: "List",
            variant: getOrThrow("listType"),
            tight: getOrThrow("listTight"),
            start: node.listStart,
            delimiter: node.listDelimiter,
            items: [],
          });
          break;

        case "paragraph":
          enterBranch({ type: "Paragraph", childNodes: [] });
          break;

        case "softbreak":
          addLeaf({ type: "Break", variant: "Soft" });
          break;

        case "strong":
          enterBranch({ type: "TextStyle", variant: "Strong", childNodes: [] });
          break;

        case "text":
          addLeaf({ type: "Text", text: getOrThrow("literal") });
          break;

        case "thematic_break":
          addLeaf({ type: "ThematicBreak" });
          break;

        default:
          return checkExhausted(node.type);
      }
    } else {
      switch (node.type) {
        case "block_quote":
        case "document":
        case "emph":
        case "heading":
        case "image":
        case "item":
        case "link":
        case "list":
        case "paragraph":
        case "strong":
          exitBranch();
          break;

        default:
          throw new Error(`Unexpected close for ${node.type}`);
      }
    }
  }

  return tree;
};
