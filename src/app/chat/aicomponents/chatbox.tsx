"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Sparkles, User, Copy, Check } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface ChatBoxProps {
  messages: Message[];
  loading: boolean;
}

const MARKDOWN_CLASSES =
  "max-w-none " +
  "[&_p]:m-0 [&_p+p]:mt-2 " +
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5 " +
  "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5 " +
  "[&_li]:my-0.5 " +
  "[&_h1]:text-base [&_h1]:font-bold [&_h1]:mt-3 [&_h1]:mb-1 " +
  "[&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1 " +
  "[&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1 " +
  "[&_a]:underline [&_a]:font-semibold [&_strong]:font-bold " +
  "[&_blockquote]:border-l-2 [&_blockquote]:border-current/30 [&_blockquote]:pl-3 [&_blockquote]:italic " +
  "[&_code]:bg-black/10 [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.9em] " +
  "[&_pre]:bg-black/10 [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0";

function formatTime(timestamp?: string) {
  if (!timestamp) return "";
  try {
    return new Date(timestamp).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — fail silently, not critical
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
      aria-label="Copy response"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function ChatBox({ messages, loading }: ChatBoxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col space-y-5">
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                isUser ? "bg-primary-600 text-white" : "bg-primary-50 text-primary-600 border border-primary-200"
              }`}
            >
              {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            <div className={`flex flex-col max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
              <span className="text-[11px] font-semibold text-neutral-500 mb-1 px-1">
                {isUser ? "You" : "SkillzUp AI"}
              </span>

              <div
                className={`px-4 py-3 rounded-2xl shadow-md text-sm md:text-base ${
                  isUser
                    ? "bg-primary-600 text-white rounded-br-sm"
                    : "bg-primary-50 border border-primary-200 text-primary-900 rounded-bl-sm"
                }`}
              >
                <div className={MARKDOWN_CLASSES}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1 px-1">
                {msg.timestamp && (
                  <span className="text-[11px] text-neutral-400">{formatTime(msg.timestamp)}</span>
                )}
                {!isUser && <CopyButton content={msg.content} />}
              </div>
            </div>
          </motion.div>
        );
      })}

      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end gap-2"
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-primary-50 text-primary-600 border border-primary-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-primary-50 border border-primary-200 shadow-md">
            <span className="flex gap-1">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-primary-500"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
              />
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-primary-500"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }}
              />
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-primary-500"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }}
              />
            </span>
          </div>
        </motion.div>
      )}

      <div ref={ref} />
    </div>
  );
}
