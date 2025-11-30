import { tuple } from "@/utils/tuple.ts";
import { Node as MarkdownNode } from "commonmark";
import { type Guard } from "deep-guards";

export interface Environment {
  get: (key: string) => unknown;
  getAs: <T>(key: string, guard: Guard<T>) => T | null;
}

export interface Text {
  type: "Text";
  text: string;
}

export interface Break {
  type: "Break";
  variant: "Line" | "Soft";
}

export interface HTMLInline {
  type: "HTMLInline";
  html: string;
}

export interface HTMLBlock {
  type: "HTMLBlock";
  html: string;
}

export interface Code {
  type: "Code";
  code: string;
}

export interface CodeBlock {
  type: "CodeBlock";
  info: string | null;
  code: string;
}

export interface ThematicBreak {
  type: "ThematicBreak";
}

export interface CustomInline {
  type: "CustomInline";
  text: string;
}

export interface CustomBlock {
  type: "CustomBlock";
  text: string;
}

export type LeafNode =
  | Text
  | Break
  | HTMLInline
  | HTMLBlock
  | Code
  | CodeBlock
  | ThematicBreak
  | CustomInline
  | CustomBlock;

export interface Document {
  type: "Document";
  childNodes: Node[];
}

export interface TextStyle {
  type: "TextStyle";
  variant: "Emph" | "Strong";
  childNodes: Node[];
}

export interface Link {
  type: "Link";
  href: string;
  title: string | null;
  childNodes: Node[];
}

export interface Image {
  type: "Image";
  src: string;
  title: string | null;
  childNodes: Node[];
}

export interface Paragraph {
  type: "Paragraph";
  childNodes: Node[];
}

export interface BlockQuote {
  type: "BlockQuote";
  childNodes: Node[];
}

export interface Item {
  type: "Item";
  childNodes: Node[];
}

export interface List {
  type: "List";
  variant: MarkdownNode["listType"];
  tight: boolean;
  start: number | null;
  delimiter: MarkdownNode["listDelimiter"] | null;
  childNodes: Node[];
}

export const headingLevels = tuple(
  "Page",
  "SubPage",
  "Section",
  "SubSection",
  "Block",
  "SubBlock"
);
export type HeadingLevel = (typeof headingLevels)[number];

export interface Heading {
  type: "Heading";
  level: HeadingLevel;
  childNodes: Node[];
}

export type BranchNode =
  | Document
  | TextStyle
  | Link
  | Image
  | Paragraph
  | BlockQuote
  | Item
  | List
  | Heading;

export type Node = BranchNode | LeafNode;

export interface Tree {
  childNodes: Node[];
}
