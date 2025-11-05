'use client';

import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FloatingChatButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/chat')}
      className="fixed bottom-6 right-6 bg-blue-600 text-white p-5 rounded-full shadow-lg flex items-center justify-center
                 hover:bg-blue-700 hover:scale-110 transition-all duration-300
                 animate-bounce z-50"
      aria-label="Chat with AI"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}
