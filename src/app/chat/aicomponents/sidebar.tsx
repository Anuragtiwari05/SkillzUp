"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, MessageSquare, Trash2, Search } from "lucide-react";
import axios from "axios";
import Loader from "@/component/ui/Loader";
import { groupByDate, formatFriendlyDate } from "@/lib/dateGroups";

interface ChatSession {
  sessionId: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

interface SidebarProps {
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
}

export default function Sidebar({ currentSessionId, onNewChat, onSelectChat }: SidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

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
  }, [currentSessionId]);

  const handleDelete = async (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
    try {
      await axios.delete(`/api/chat/${sessionId}`, { withCredentials: true });
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return sessions;
    const q = query.toLowerCase();
    return sessions.filter((s) => (s.title || "").toLowerCase().includes(q));
  }, [sessions, query]);

  const groups = useMemo(
    () => groupByDate(filtered, (s) => s.updatedAt || s.createdAt),
    [filtered]
  );

  return (
    <div className="w-full h-full flex flex-col p-4 bg-surface/90 backdrop-blur-xl">
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="flex items-center justify-center gap-2 py-2 bg-primary hover:bg-primary/85 text-primary-foreground rounded-lg shadow-md transition-colors flex-shrink-0"
      >
        <Plus size={18} /> New Chat
      </button>

      {/* Search */}
      <div className="relative mt-3 flex-shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search chats..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-elevated text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Chat Sessions List */}
      <div className="flex-1 overflow-y-auto mt-3 space-y-4">
        {loading ? (
          <Loader size="sm" label="Loading chats..." />
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground px-1">
            {query ? "No chats match your search" : "No chats yet"}
          </p>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground px-1 mb-1.5">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((s) => {
                  const isActive = currentSessionId === s.sessionId;
                  return (
                    <div
                      key={s.sessionId}
                      onClick={() => onSelectChat(s.sessionId)}
                      className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-lg cursor-pointer transition
                        ${isActive ? "bg-primary text-primary-foreground" : "bg-surface hover:bg-surface-elevated text-foreground"}
                      `}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <MessageSquare
                          size={16}
                          className={isActive ? "text-primary-foreground flex-shrink-0" : "text-muted-foreground flex-shrink-0"}
                        />
                        <div className="min-w-0">
                          <p className="text-sm truncate leading-tight">
                            {s.title || "New conversation"}
                          </p>
                          <p
                            className={`text-[11px] leading-tight ${
                              isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {formatFriendlyDate(s.updatedAt || s.createdAt)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(s.sessionId);
                        }}
                        aria-label="Delete conversation"
                        className={`flex-shrink-0 p-1 rounded transition-opacity opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 ${
                          isActive ? "text-primary-foreground hover:text-danger" : "text-muted-foreground hover:text-danger"
                        }`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
