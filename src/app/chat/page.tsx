"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Sidebar from "./aicomponents/sidebar";
import axios from "axios";
import {
  Sparkles,
  MessageCircle,
  ArrowLeftCircle,
  SendHorizonal,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
  };

  const handleSelectChat = (id: string) => setCurrentSessionId(id);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", {
        message,
        sessionId: currentSessionId,
      });

      if (res.status === 200) {
        const { reply, sessionId } = res.data;

        // Update session ID (new chat)
        if (!currentSessionId && sessionId) setCurrentSessionId(sessionId);

        const botMsg: Message = { role: "assistant", content: reply };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "⚠️ Unexpected server response." },
        ]);
      }
    } catch (error: any) {
      console.error("Chat error:", error.response?.data || error.message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Failed to get AI response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 hover:text-blue-800 transition"
          >
            <ArrowLeftCircle className="w-7 h-7" />
          </button>
          <h1 className="text-2xl md:text-3xl font-black text-blue-700 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            SkillzUp AI Chatbot
          </h1>
        </div>
        <p className="text-sm font-semibold text-blue-500 hidden md:block">
          Powered by Gemini — AI Learning Assistant ✨
        </p>
      </header>

      {/* Layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden md:flex bg-white border-r border-blue-200 shadow-md w-72 flex-col"
        >
          <Sidebar
            currentSessionId={currentSessionId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
          />
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-between p-4 md:p-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-4xl h-[75vh] bg-white rounded-3xl shadow-2xl border-4 border-blue-200 overflow-hidden relative flex flex-col"
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 via-blue-200 to-purple-300 opacity-20 blur-3xl pointer-events-none animate-pulse" />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 z-10 space-y-4">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 italic mt-10">
                  Start a conversation — SkillzUp AI is ready to assist 💡
                </p>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-md max-w-[75%] text-sm md:text-base ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-2xl shadow-sm text-gray-600 text-sm">
                    <Loader2 className="animate-spin w-4 h-4" />
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input Box */}
            <div className="relative z-20 border-t border-blue-200 bg-white/90 backdrop-blur-md px-4 py-3">
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 shadow-inner">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || loading}
                  className={`p-2 rounded-full transition ${
                    message.trim() && !loading
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <SendHorizonal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNewChat}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center z-50"
        aria-label="New Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
