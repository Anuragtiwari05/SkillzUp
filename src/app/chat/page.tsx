"use client";

import { useState } from "react";
import Sidebar from "./aicomponents/sidebar";
import ChatBox from "./aicomponents/chatbox";
import { Sparkles, MessageCircle, ArrowLeftCircle, SendHorizonal } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleNewChat = () => setCurrentSessionId(null);
  const handleSelectChat = (id: string) => setCurrentSessionId(id);

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("User message:", message); // integrate with ChatBox later
    setMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900">
      {/* 🧭 Header */}
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

      {/* 🧩 Main Chat Layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* 🧭 Sidebar */}
        <motion.aside
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="hidden md:flex bg-white border-r border-blue-200 shadow-md w-72 flex-col"
        >
          <Sidebar
            currentSessionId={currentSessionId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
          />
        </motion.aside>

        {/* 💬 Chat Area */}
        <section className="flex-1 flex flex-col items-center justify-between p-4 md:p-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-4xl h-[75vh] bg-white rounded-3xl shadow-2xl border-4 border-blue-200 overflow-hidden flex flex-col relative"
          >
            {/* Glowing Overlay */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 via-blue-200 to-purple-300 opacity-20 blur-3xl pointer-events-none animate-pulse" />

            {/* Chat messages area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 z-10">
              <ChatBox sessionId={currentSessionId} />
            </div>

            {/* 📝 ChatGPT-style Input Bar */}
            <div className="relative z-20 border-t border-blue-200 bg-white/95 backdrop-blur-md px-4 py-3">
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 shadow-inner">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Send a message..."
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className={`p-2 rounded-full transition ${
                    message.trim()
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <SendHorizonal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Floating New Chat Button */}
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
