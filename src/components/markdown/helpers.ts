import { checkExhausted } from "@/utils/core.ts";
import type { BranchNode, HeadingLevel, Node } from "./types.ts";
import type { HeadingProps } from "@chakra-ui/react";

export const isBranch = (node: Node): node is BranchNode => {
  switch (node.type) {
    case "Text":
    case "TextStyle":
    case "Break":
    case "HTMLInline":
    case "HTMLBlock":
    case "Code":
    case "CodeBlock":
    case "ThematicBreak":
    case "CustomInline":
    case "CustomBlock":
      return false;

    case "Document":
    case "Link":
    case "Image":
    case "Paragraph":
    case "BlockQuote":
    case "Item":
    case "List":
    case "Heading":
      return true;

    default:
      return checkExhausted(node);
  }
};

export const headingLevelSize: Record<
  HeadingLevel,
  NonNullable<HeadingProps["size"]>
> = {
  Page: "2xl",
  SubPage: "xl",
  Section: "lg",
  SubSection: "md",
  Block: "sm",
  SubBlock: "xs",
};
