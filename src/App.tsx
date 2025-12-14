import "@/App.css";
import reactLogo from "@/assets/react.svg";
import Markdown from "./components/markdown/Markdown";
import { Card } from "@chakra-ui/react";
import { useEffect, useState, type ReactElement } from "react";
import viteLogo from "/vite.svg";
import type { Environment } from "./components/markdown/types.ts";

const environment: Environment = {
  use: function (
    _name: string,
    _args: Record<string, string | null> | null
  ): ReactElement | null {
    return null;
  },
};

export default function App() {
  const [count, setCount] = useState(0);

  const [text, setText] = useState("");

  useEffect(() => {
    void fetch("test.md")
      .then((res) => res.text())
      .then(setText);
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div style={{ textAlign: "start" }}>
        <Markdown template={text} environment={environment} />
      </div>
      <Card.Root>
        <Card.Header>
          <button
            onClick={() => {
              setCount((count) => count + 1);
            }}
          >
            count is {count}
          </button>
        </Card.Header>
        <Card.Body>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </Card.Body>
        <Card.Footer>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
        </Card.Footer>
      </Card.Root>
    </>
  );
}
