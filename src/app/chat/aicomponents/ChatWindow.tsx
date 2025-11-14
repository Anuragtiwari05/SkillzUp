"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useEffect, useState } from "react";
import axios from "axios";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatWindowProps {
  sessionId: string | null;
}

export default function ChatWindow({ sessionId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    const load = async () => {
      const res = await axios.get(`/api/chat/${sessionId}`);
      if (res.data.success) setMessages(res.data.messages);
    };

    load();
  }, [sessionId]);

  return (
    <div className="flex flex-col h-full bg-white/90 backdrop-blur-xl rounded-3xl p-4 border border-blue-200">
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[75%] ${
              msg.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-blue-50 text-gray-800 border"
            }`}
          >
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
