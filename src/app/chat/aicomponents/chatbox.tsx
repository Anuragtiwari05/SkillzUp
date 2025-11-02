"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Load last session from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem("chatSessionId");
    if (savedSession) setSessionId(savedSession);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId }),
      });

      const data = await res.json();

      if (data.success) {
        const aiMessage: Message = { role: "assistant", content: data.reply };
        setMessages((prev) => [...prev, aiMessage]);
        if (!sessionId && data.sessionId) {
          setSessionId(data.sessionId);
          localStorage.setItem("chatSessionId", data.sessionId);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "⚠️ Error: " + (data.error || "Something went wrong.") },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-[90vh] max-w-3xl mx-auto p-4 bg-gray-50 border rounded-2xl shadow-md">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[80%] text-white ${
                msg.role === "user" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-500 italic animate-pulse">Assistant is typing...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-3 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask me anything about your courses or learning path..."
          className="flex-1 px-4 py-2 border rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-r-full hover:bg-blue-700 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
}
