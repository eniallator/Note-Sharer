import { checkExhausted } from "@/utils/core.ts";
import {
  Box,
  chakra,
  Code,
  Em,
  For,
  Heading,
  Image,
  Link,
  List,
  Text,
  type HTMLChakraProps,
} from "@chakra-ui/react";
import { useMemo, type ElementType, type ReactElement } from "react";
import { headingLevelSize } from "./helpers.ts";
import markdownTree from "./tree.ts";
import type { Environment, Node as TreeNode } from "./types.ts";

interface MarkdownProps extends HTMLChakraProps<ElementType> {
  template: string;
  environment?: Environment;
}

export default function Markdown(props: MarkdownProps): ReactElement {
  const { template, environment, ...rest } = props;

  const tree = useMemo(
    () => markdownTree(template, environment),
    [environment, template]
  );

  return (
    <Box p="3" className="rendered-markdown">
      <ChildNodes value={tree.childNodes} {...rest} />
    </Box>
  );
}

interface ChildNodesProps extends HTMLChakraProps<ElementType> {
  value: TreeNode[];
}

function ChildNodes(props: ChildNodesProps): ReactElement {
  const { value, ...rest } = props;

  return (
    <For each={value}>
      {(value, i) => <Node key={i} value={value} {...rest} />}
    </For>
  );
}

interface NodeProps extends HTMLChakraProps<ElementType> {
  value: TreeNode;
}

function Node(props: NodeProps): ReactElement {
  const { value, ...rest } = props;

  const content = useMemo(() => {
    switch (value.type) {
      case "BlockQuote":
        return (
          <Box {...rest} ms="4" ps="2" borderStartWidth="4px">
            <ChildNodes value={value.childNodes} {...rest} />
          </Box>
        );

      case "Break":
        return value.variant === "Line" ? <chakra.br /> : <> </>;

      case "Code":
        return (
          <Code maxW="100%" {...rest} px="0.2em">
            {value.code}
          </Code>
        );

      case "CodeBlock":
        return (
          <Code display="block" maxW="100%" {...rest} whiteSpace="pre">
            {value.code}
          </Code>
        );

      case "CustomBlock":
      case "CustomInline":
        return <>{value.text}</>;

      case "Document":
        return <ChildNodes value={value.childNodes} {...rest} />;

      case "HTMLBlock":
        return (
          <chakra.div
            dangerouslySetInnerHTML={{ __html: value.html }}
            {...rest}
          />
        );

      case "HTMLInline":
        return (
          <chakra.span
            dangerouslySetInnerHTML={{ __html: value.html }}
            {...rest}
          />
        );

      case "Heading":
        return (
          <Heading size={headingLevelSize[value.level]} mb="4" {...rest}>
            <ChildNodes value={value.childNodes} {...rest} />
          </Heading>
        );

      case "Image":
        return (
          <chakra.figure>
            <Image src={value.src} title={value.title ?? undefined} {...rest} />
            <chakra.figcaption {...rest}>
              <ChildNodes value={value.childNodes} {...rest} />
            </chakra.figcaption>
          </chakra.figure>
        );

      case "Item":
        return (
          <List.Item {...rest}>
            <ChildNodes value={value.childNodes} {...rest} />
          </List.Item>
        );

      case "Link":
        return (
          <Link
            color="blue.500"
            href={value.href}
            title={value.title ?? undefined}
            {...rest}
          >
            <ChildNodes value={value.childNodes} {...rest} />
          </Link>
        );

      case "List":
        return value.variant === "bullet" ? (
          <List.Root lineHeight={value.tight ? "1.1rem" : "1.7rem"} {...rest}>
            <ChildNodes value={value.childNodes} {...rest} />
          </List.Root>
        ) : (
          <List.Root
            as="ol"
            lineHeight={value.tight ? "1.1rem" : "1.7rem"}
            // TODO: Figure out a way to pass this through!
            data-start={value.start ?? undefined}
            {...rest}
          >
            <ChildNodes value={value.childNodes} {...rest} />
          </List.Root>
        );

      case "Paragraph":
        return (
          <Text mb="2" {...rest}>
            <ChildNodes value={value.childNodes} {...rest} />
          </Text>
        );

      case "Text":
        return <Text {...rest}>{value.text}</Text>;

      case "TextStyle":
        return value.variant === "Strong" ? (
          <Text fontWeight="bold" {...rest}>
            <ChildNodes value={value.childNodes} {...rest} />
          </Text>
        ) : (
          <Em {...rest}>
            <ChildNodes value={value.childNodes} {...rest} />
          </Em>
        );

      case "ThematicBreak":
        return <chakra.hr mb="4" {...rest} />;

      default:
        return checkExhausted(value);
    }
  }, [rest, value]);

  return content;
}
