import "@/App.css";
import reactLogo from "@/assets/react.svg";
import { Card } from "@chakra-ui/react";
import { useState } from "react";
import viteLogo from "/vite.svg";

export default function App() {
  const [count, setCount] = useState(0);

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
