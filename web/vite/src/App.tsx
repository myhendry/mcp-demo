"use client";

import { useChat } from "@ai-sdk/react";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/model-toggle";

function App() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "http://localhost:3000/message",
    streamProtocol: "text",
  });
  console.log("messages", messages);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <>
        <div className="p-5">
          <ModeToggle />
        </div>
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
          {messages.map((message) => (
            <div key={message.id} className="whitespace-pre-wrap">
              {message.role === "user" ? "User: " : "AI: "}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return <div key={`${message.id}-${i}`}>{part.text}</div>;
                }
              })}
            </div>
          ))}

          <form onSubmit={handleSubmit}>
            <input
              className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
            />
          </form>
        </div>
        {/* <div className="flex flex-col items-center justify-center min-h-svh">
          
          <h1>Hello World</h1>
        </div> */}
      </>
    </ThemeProvider>
  );
}

export default App;
