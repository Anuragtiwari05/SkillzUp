"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBoxProps {
  messages: Message[];
  loading: boolean;
}

export default function ChatBox({ messages, loading }: ChatBoxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col space-y-4">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-4 py-3 rounded-2xl max-w-[75%] shadow-md text-sm md:text-base
              ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-50 border border-blue-200 text-gray-800"
              }
            `}
          >
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      ))}

      {loading && (
        <p className="text-gray-500 italic animate-pulse">
          Assistant is typing...
        </p>
      )}

      <div ref={ref} />
    </div>
  );
}
