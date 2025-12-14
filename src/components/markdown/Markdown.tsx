import { checkExhausted } from "@/utils/core.ts";
import {
  Badge,
  Box,
  chakra,
  Checkbox,
  Code,
  Em,
  For,
  Heading,
  Image,
  Link,
  List,
  Table,
  Text,
} from "@chakra-ui/react";
import { isNumber } from "deep-guards";
import type { Token } from "marked";
import { useMemo, type ReactElement } from "react";
import {
  tokenizeMarkdown,
  unsafeMarkdownToken,
  type MarkdownToken,
} from "./parse.js";
import { headingLevelSize, type Environment } from "./types.js";

interface MarkdownProps {
  template: string;
  environment: Environment;
}

export default function Markdown(props: MarkdownProps): ReactElement {
  const { template, environment } = props;

  const tokenized = useMemo(
    () => tokenizeMarkdown(template, environment),
    [environment, template]
  );

  return <ChildTokenNodes tokens={tokenized} />;
}

interface ChildTokenNodesProps {
  tokens: (Token | MarkdownToken)[];
}
function ChildTokenNodes(props: ChildTokenNodesProps): ReactElement {
  const { tokens } = props;

  return (
    <For each={tokens}>
      {(child, index) => (
        <TokenNode key={index} token={unsafeMarkdownToken(child)} />
      )}
    </For>
  );
}

interface TokenNodeProps {
  token: MarkdownToken;
}

function TokenNode(props: TokenNodeProps): ReactElement {
  const { token } = props;

  switch (token.type) {
    case "blockquote":
      return (
        <Box ms="4" ps="2" borderStartWidth="4px">
          <ChildTokenNodes tokens={token.tokens} />
        </Box>
      );

    case "br":
      return <chakra.br />;

    case "checkbox":
      return (
        <Checkbox.Root checked={token.checked} size="sm">
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      );

    case "code":
      return (
        <Code
          display="block"
          maxW="100%"
          mb="2"
          whiteSpace="pre"
          lang={token.lang}
        >
          {token.text}
        </Code>
      );

    case "codespan":
      return (
        <Code maxW="100%" px="0.2em">
          {token.text}
        </Code>
      );

    case "def":
      return <></>;

    case "del":
      return (
        <chakra.del>
          <ChildTokenNodes tokens={token.tokens} />
        </chakra.del>
      );

    case "em":
      return (
        <Em>
          <ChildTokenNodes tokens={token.tokens} />
        </Em>
      );

    case "escape":
      return <>{token.text}</>;

    case "heading":
      return (
        <Heading size={headingLevelSize[token.depth - 1]} mb="4">
          <ChildTokenNodes tokens={token.tokens} />
        </Heading>
      );

    case "hr":
      return <chakra.hr mb="4" />;

    case "html":
      return token.block ? (
        <chakra.div dangerouslySetInnerHTML={{ __html: token.text }} />
      ) : (
        <chakra.span dangerouslySetInnerHTML={{ __html: token.text }} />
      );

    case "image":
      return (
        <>
          <Image src={token.href} title={token.title ?? undefined} />
          <ChildTokenNodes tokens={token.tokens} />
        </>
      );

    case "link":
      return (
        <Link
          color="blue.500"
          href={token.href}
          title={token.title ?? undefined}
        >
          <ChildTokenNodes tokens={token.tokens} />
        </Link>
      );

    case "list":
      return token.ordered ? (
        <List.Root
          as="ol"
          {...{ start: isNumber(token.start) ? token.start : 1 }}
        >
          <For each={token.items}>
            {(item, index) => (
              <List.Item
                key={index}
                lineHeight={item.loose ? "1.7rem" : "1.1rem"}
              >
                <ChildTokenNodes tokens={item.tokens} />
              </List.Item>
            )}
          </For>
        </List.Root>
      ) : (
        <List.Root>
          <For each={token.items}>
            {(item, index) => (
              <List.Item
                key={index}
                lineHeight={item.loose ? "1.7rem" : "1.1rem"}
              >
                <ChildTokenNodes tokens={item.tokens} />
              </List.Item>
            )}
          </For>
        </List.Root>
      );

    case "list_item":
      return (
        <List.Item lineHeight={token.loose ? "1.7rem" : "1.1rem"}>
          <ChildTokenNodes tokens={token.tokens} />
        </List.Item>
      );

    case "paragraph":
      return token.pre ? (
        <chakra.pre>
          <ChildTokenNodes tokens={token.tokens} />
        </chakra.pre>
      ) : (
        <Text mb="2">
          <ChildTokenNodes tokens={token.tokens} />
        </Text>
      );

    case "space":
      return <chakra.span> </chakra.span>;

    case "strong":
      return (
        <Text fontWeight="bold">
          <ChildTokenNodes tokens={token.tokens} />
        </Text>
      );

    case "table":
      return (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <For each={token.header}>
                {(header, index) => (
                  <Table.ColumnHeader
                    key={index}
                    textAlign={header.align ?? undefined}
                  >
                    <ChildTokenNodes tokens={header.tokens} />
                  </Table.ColumnHeader>
                )}
              </For>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <For each={token.rows}>
              {(row, index) => (
                <Table.Row key={index}>
                  <For each={row}>
                    {(cell, index) => (
                      <Table.Cell
                        key={index}
                        textAlign={cell.align ?? undefined}
                      >
                        <ChildTokenNodes tokens={cell.tokens} />
                      </Table.Cell>
                    )}
                  </For>
                </Table.Row>
              )}
            </For>
          </Table.Body>
        </Table.Root>
      );

    case "text":
      return (
        <Text as="span">
          {token.tokens != null ? (
            <ChildTokenNodes tokens={token.tokens} />
          ) : (
            token.text
          )}
        </Text>
      );
    case "directive":
      return token.element != null ? (
        token.element
      ) : (
        <>
          <Badge variant="solid">{token.name}</Badge>
          {Object.entries(token.args ?? {}).map(([key, value]) => (
            <Badge key={key} ml="2">
              {value != null ? `${key} = ${decodeURIComponent(value)}` : key}
            </Badge>
          ))}
        </>
      );

    default:
      return checkExhausted(token);
  }
}
