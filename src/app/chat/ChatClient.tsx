"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "./aicomponents/sidebar";
import ChatBox from "./aicomponents/chatbox";
import Navbar from "@/component/navbar";
import BackButton from "@/component/ui/BackButton";
import axios from "axios";
import { Sparkles, SendHorizonal, Loader2, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

const MAX_TEXTAREA_HEIGHT = 160;

export default function ChatClient() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const searchParams = useSearchParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reopen a past conversation linked from Chat History (/chat?session=<id>)
  useEffect(() => {
    const sessionFromUrl = searchParams.get("session");
    if (sessionFromUrl) setCurrentSessionId(sessionFromUrl);
  }, [searchParams]);

  // Load the selected session's messages whenever it changes
  useEffect(() => {
    if (!currentSessionId) {
      setCurrentTitle(null);
      return;
    }

    let cancelled = false;
    setHistoryLoading(true);

    fetch(`/api/chat/${currentSessionId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) {
          setMessages(
            data.messages.map((m: any) => ({ role: m.role, content: m.content, timestamp: m.timestamp }))
          );
          setCurrentTitle(data.title || null);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setHistoryLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentSessionId]);

  // Auto-grow the textarea up to a max height, then scroll internally
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [message]);

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setCurrentTitle(null);
    setMessages([]);
  };

  const handleSelectChat = (id: string) => {
    setCurrentSessionId(id);
    setMobileSidebar(false); // Close sidebar on mobile after selecting chat
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", {
        message: text,
        sessionId: currentSessionId,
      });

      if (res.status === 200 && res.data?.success) {
        const { reply, sessionId } = res.data;

        if (!currentSessionId && sessionId) setCurrentSessionId(sessionId);

        const botMsg: Message = { role: "assistant", content: reply, timestamp: new Date().toISOString() };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, that didn't go through — could you try sending it again?",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (error: unknown) {
      const serverMessage =
        axios.isAxiosError(error) && typeof error.response?.data?.error === "string"
          ? error.response.data.error
          : null;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: serverMessage || "Sorry, I'm having trouble responding right now — please try again in a moment.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(message);
    }
    // Shift+Enter falls through to the textarea's default newline behavior.
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* SUB-HEADER */}
      <header className="flex justify-between items-center px-4 sm:px-6 py-4 bg-surface/90 backdrop-blur-xl sticky top-16 z-30 border-b border-surface-border">

        {/* Left Section */}
        <div className="flex items-center space-x-3 min-w-0">
          <BackButton label="" className="flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-accent-500 animate-pulse" />
              SkillzUp AI Assistant
            </h1>
            <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
              {currentTitle ? <span className="truncate">{currentTitle}</span> : "Online"}
            </p>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileSidebar(true)}
          className="md:hidden text-neutral-900 hover:text-primary-600 flex-shrink-0"
        >
          <Menu className="w-7 h-7" />
        </button>
      </header>

      <main className="flex flex-1 overflow-hidden relative">

        {/* MOBILE SIDEBAR */}
        {mobileSidebar && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            className="fixed top-0 left-0 w-64 h-full bg-surface shadow-2xl z-40 md:hidden"
          >
            <div className="p-4 flex justify-end">
              <button
                onClick={() => setMobileSidebar(false)}
                className="text-gray-600 hover:text-black font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <Sidebar
              currentSessionId={currentSessionId}
              onNewChat={handleNewChat}
              onSelectChat={handleSelectChat}
            />
          </motion.div>
        )}

        {/* DESKTOP SIDEBAR */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex w-72 bg-surface/80 backdrop-blur-xl shadow-xl border-r border-surface-border"
        >
          <Sidebar
            currentSessionId={currentSessionId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
          />
        </motion.div>

        {/* CHAT WINDOW */}
        <div className="flex-1 flex flex-col p-2 sm:p-4 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full flex-1 flex flex-col bg-surface rounded-2xl sm:rounded-3xl shadow-2xl border border-surface-border relative overflow-hidden"
          >
            {/* Soft background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100/40 via-surface to-accent-100/30 blur-3xl pointer-events-none" />

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 z-10 flex flex-col">
              {historyLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary-600 mx-auto mt-10" />
              ) : (
                <ChatBox messages={messages} loading={loading} />
              )}
            </div>

            {/* INPUT */}
            <div className="p-3 sm:p-4 bg-surface/90 backdrop-blur-md border-t border-surface-border">
              <div className="flex items-end gap-2 sm:gap-3 bg-primary-50 border border-primary-200 rounded-2xl px-4 py-2">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none text-primary-900 placeholder-primary-400/70 text-sm sm:text-base resize-none py-1.5 max-h-40 overflow-y-auto"
                  placeholder="Ask SkillzUp AI... (Shift+Enter for a new line)"
                />
                <button
                  onClick={() => sendMessage(message)}
                  disabled={!message.trim() || loading}
                  className={`p-2 rounded-full transition flex-shrink-0 ${
                    message.trim() && !loading
                      ? "bg-primary-600 text-white hover:bg-primary-700"
                      : "bg-neutral-200 text-neutral-400"
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
