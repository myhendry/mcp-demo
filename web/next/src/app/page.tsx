"use client";

import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { RecommendedGuitar } from "../components/recommended-guitar";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    // todo
    // api: "/api/chat", // set mcp-server-js mcp setup
    api: "http://127.0.0.1:8000/api/v1/chat", // set pydantic-fastapi api setup
    maxSteps: 20,
    onError: (error) => {
      console.error("Chat error:", error);
    },
    onResponse: (response) => {
      console.log("Chat response:", response);
    },
    onToolCall: (call) => {
      console.log("Tool call:", call);
      if (call.toolCall.toolName === "recommendGuitar") {
        return "Handled by the UI";
      }
      if (call.toolCall.toolName === "crawlWeb") {
        return "Processing web crawl...";
      }
    },
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>
          {messages.map((message) =>
            message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return <p key={i}>{part.text}</p>;
                case "source":
                  return <p key={i}>{part.source.url}</p>;
                case "reasoning":
                  return <div key={i}>{part.reasoning}</div>;
                case "tool-invocation":
                  return <div key={i}>{part.toolInvocation.toolName}</div>;
                case "file":
                  return (
                    <img
                      key={i}
                      src={`data:${part.mimeType};base64,${part.data}`}
                    />
                  );
              }
            })
          )}
          {/* {messages.map(({ id, role, content, parts }) => {
            console.log("MESSAGES", id, role, content, parts);
            return (
              <div
                key={id}
                className={`py-3 ${
                  role === "assistant"
                    ? "bg-gradient-to-r from-orange-500/5 to-red-600/5"
                    : "bg-transparent"
                }`}
              >
                {content.length > 0 && (
                  <div>
                    {role === "assistant" ? <div>AI</div> : <div>You</div>}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="prose dark:prose-invert max-w-none prose-sm">
                    <ReactMarkdown
                      rehypePlugins={[
                        rehypeRaw,
                        rehypeSanitize,
                        rehypeHighlight,
                        remarkGfm,
                      ]}
                      components={{
                        img: ({ node, ...props }) => (
                          <img
                            {...props}
                            className="w-[150px] h-[150px] mx-auto object-contain"
                          />
                        ),
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                </div>
                {parts
                  .filter((part) => part.type === "tool-invocation")
                  .filter(
                    (part) => part.toolInvocation.toolName === "recommendGuitar"
                  )
                  .map((toolCall) => (
                    <div key={toolCall.toolInvocation.toolName}>
                      <RecommendedGuitar
                        guitarId={toolCall.toolInvocation.args.guitarId}
                      />
                    </div>
                  ))}
              </div>
            );
          })} */}
        </div>
        <form onSubmit={handleSubmit} className="w-full flex justify-center">
          <input
            className="fixed bottom-0 w-[80%] dark:bg-zinc-900 p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </form>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
