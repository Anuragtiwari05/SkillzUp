"use client";

import { MessageSquare, Trash2, ChevronRight } from "lucide-react";
import Card from "@/component/ui/Card";
import { formatFriendlyDate } from "@/lib/dateGroups";

export default function ConversationRow({
  title,
  date,
  messageCount,
  onOpen,
  onDelete,
}: {
  title: string;
  date: string | Date;
  messageCount: number;
  onOpen: () => void;
  onDelete?: () => void;
}) {
  return (
    <Card hover={false} className="p-4 sm:p-5 flex items-center gap-4 cursor-pointer" onClick={onOpen}>
      <div className="bg-primary-50 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
        <MessageSquare className="w-4.5 h-4.5 text-primary-600" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-neutral-900 truncate">{title}</h3>
        <p className="text-xs text-neutral-600 mt-0.5">
          {messageCount} {messageCount === 1 ? "message" : "messages"} · {formatFriendlyDate(date)}
        </p>
      </div>

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete conversation"
          className="flex-shrink-0 text-neutral-400 hover:text-red-500 transition-colors p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <ChevronRight className="w-4 h-4 text-neutral-300 flex-shrink-0" />
    </Card>
  );
}
