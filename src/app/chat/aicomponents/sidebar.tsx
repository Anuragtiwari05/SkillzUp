"use client";

import { useEffect, useState } from "react";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import axios from "axios";

interface ChatSession {
  _id: string;
  sessionId: string;
  createdAt: string;
}

interface SidebarProps {
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
}

export default function Sidebar({
  currentSessionId,
  onNewChat,
  onSelectChat,
}: SidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch chat sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get("/api/chat", { withCredentials: true });
        if (res.status === 200) setSessions(res.data);
      } catch (error: any) {
        console.error("Error loading chat sessions:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  // 🗑️ Delete chat
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/chat/${id}`, { withCredentials: true });
      setSessions((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <div className="h-full w-64 bg-gray-900 text-white flex flex-col p-4 space-y-4 border-r border-gray-800">
      <button
        onClick={onNewChat}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
      >
        <Plus size={18} /> New Chat
      </button>

      <div className="flex-1 overflow-y-auto mt-2 space-y-2">
        {loading ? (
          <p className="text-sm text-gray-400 animate-pulse">Loading chats...</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-gray-400">No chats yet</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session._id}
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${
                currentSessionId === session.sessionId
                  ? "bg-blue-700"
                  : "hover:bg-gray-800"
              }`}
              onClick={() => onSelectChat(session.sessionId)}
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span className="text-sm truncate">
                  {new Date(session.createdAt).toLocaleDateString()} Chat
                </span>
              </div>
              <Trash2
                size={14}
                className="hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(session._id);
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
