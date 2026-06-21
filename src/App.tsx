import "@/App.css";
import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router";
import Markdown from "./ui/components/markdown/Markdown";
import type { Environment } from "./ui/components/markdown/types";

const environment: Environment = {
  use: function (
    _name: string,
    _args: Record<string, string | null> | null,
  ): ReactNode {
    return null;
  },
};

export default function App() {
  const [text, setText] = useState("");

  const params = useParams();

  useEffect(() => {
    void fetch("test.md")
      .then((res) => res.text())
      .then(setText);
  }, []);

  return <Markdown template={text} environment={environment} />;
}
