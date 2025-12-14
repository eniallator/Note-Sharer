import "@/App.css";
import { useEffect, useState, type ReactElement } from "react";
import Markdown from "./components/markdown/Markdown";
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
  const [text, setText] = useState("");

  useEffect(() => {
    void fetch("test.md")
      .then((res) => res.text())
      .then(setText);
  }, []);

  return (
    <div style={{ textAlign: "start" }}>
      <Markdown template={text} environment={environment} />
    </div>
  );
}
