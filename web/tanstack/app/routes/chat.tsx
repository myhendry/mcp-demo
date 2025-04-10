import { useChat } from "@ai-sdk/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { genAIResponse } from "@/lib/server/chats";

export const Route = createFileRoute("/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [],
    fetch: Object.assign(
      async (_url: any, options: any) => {
        const { messages } = JSON.parse(options!.body! as string);
        return genAIResponse({ data: { messages } });
      },
      { preconnect: () => {} } // Add the required preconnect property
    ),
  });

  return (
    <>
      <div className="flex gap-4">
        <Link to="/demo">Demo</Link>
        <Link to="/chat">Chat</Link>
      </div>
      <div className="flex flex-col w-full max-w-lg py-24 mx-auto stretch">
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
            className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-lg p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </>
  );
}
