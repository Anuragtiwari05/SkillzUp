"use client";

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

  // 🧠 Load chat history when session changes
  useEffect(() => {
    if (!sessionId) return;
    const fetchChat = async () => {
      try {
        const res = await axios.get(`/api/chat/${sessionId}`, { withCredentials: true });
        if (res.data.success) setMessages(res.data.messages);
      } catch (err) {
        console.error("Error loading chat:", err);
      }
    };
    fetchChat();
  }, [sessionId]);

  // ✉️ Send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsg: Message = { role: "user" as const, content: input, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "/api/chat",
        { message: input, sessionId },
        { withCredentials: true }
      );
      if (res.data.success) {
        const aiMsg: Message = {
          role: "assistant" as const,
          content: res.data.reply,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-950 text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[80%] ${
              msg.role === "user" ? "ml-auto bg-blue-600" : "mr-auto bg-gray-800"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <p className="text-gray-400 text-sm">Thinking...</p>}
      </div>

      <div className="p-3 flex gap-2 border-t border-gray-800">
        <input
          type="text"
          value={input}
          placeholder="Ask something..."
          className="flex-1 bg-gray-800 p-2 rounded-lg outline-none"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
