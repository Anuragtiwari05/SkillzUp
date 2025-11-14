"use client";

import { useEffect, useState } from "react";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import axios from "axios";

interface ChatSession {
  _id: string;
  createdAt: string;
}

interface SidebarProps {
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
}

export default function Sidebar({ currentSessionId, onNewChat, onSelectChat }: SidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get("/api/chat", { withCredentials: true });
        if (res.status === 200) setSessions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/chat/${id}`, { withCredentials: true });
      setSessions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 bg-white/90 backdrop-blur-xl space-y-4">

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all"
      >
        <Plus size={18} /> New Chat
      </button>

      {/* Chat Sessions List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {loading ? (
          <p className="text-sm text-gray-700 animate-pulse">Loading chats...</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-gray-700">No chats yet</p>
        ) : (
          sessions.map((s) => {
            const isActive = currentSessionId === s._id;
            return (
              <div
                key={s._id}
                onClick={() => onSelectChat(s._id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition 
                  ${isActive ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100 text-gray-900"}
                `}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className={isActive ? "text-white" : "text-gray-700"} />
                  <span className="text-sm truncate">
                    {new Date(s.createdAt).toLocaleDateString()} Chat
                  </span>
                </div>

                <Trash2
                  size={14}
                  className={`cursor-pointer ${isActive ? "text-white hover:text-red-300" : "text-gray-700 hover:text-red-500"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(s._id);
                  }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
