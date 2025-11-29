"use client";

import { useState } from "react";
import Sidebar from "./aicomponents/sidebar";
import ChatBox from "./aicomponents/chatbox";
import axios from "axios";
import { ArrowLeftCircle, Sparkles, SendHorizonal, Loader2 } from "lucide-react";
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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Failed to get AI response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">

      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-4 bg-white/90 backdrop-blur-xl shadow-md sticky top-0 z-20 border-b border-blue-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push("/")}
            className="text-blue-700 hover:text-blue-800 transition"
          >
            <ArrowLeftCircle className="w-7 h-7" />
          </button>
          <h1 className="text-2xl font-black text-blue-700 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            SkillzUp AI Assistant
          </h1>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex w-72 bg-white/80 backdrop-blur-xl shadow-xl border-r border-blue-200"
        >
          <Sidebar
            currentSessionId={currentSessionId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
          />
        </motion.div>

        {/* CHAT WINDOW */}
        <div className="flex-1 flex flex-col justify-between p-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-4xl mx-auto flex flex-col h-[78vh] bg-white rounded-3xl shadow-2xl border border-blue-200 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 via-white to-purple-200/30 blur-3xl pointer-events-none" />

            <div className="flex-1 overflow-y-auto p-6 z-10">
              <ChatBox messages={messages} loading={loading} />
            </div>

            {/* INPUT */}
            <div className="p-4 bg-white/90 backdrop-blur-md border-t border-blue-200">
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-300 rounded-full px-4 py-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-800"
                  placeholder="Ask SkillzUp AI..."
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || loading}
                  className={`p-2 rounded-full transition ${
                    message.trim() && !loading
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <SendHorizonal className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
