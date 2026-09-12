'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { checkAuthNow } from '@/hooks/useAuth';

export default function FloatingChatButton() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  const handleClick = async () => {
    setChecking(true);
    try {
      const isLoggedIn = await checkAuthNow();
      if (!isLoggedIn) {
        router.push(`/auth/login?redirect=${encodeURIComponent('/chat')}`);
        return;
      }
      router.push('/chat');
    } finally {
      setChecking(false);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={checking}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="
        fixed bottom-4 sm:bottom-6 right-4 sm:right-6
        bg-primary-600 text-white
        p-3 sm:p-5 rounded-full
        shadow-[0_10px_30px_-8px_rgba(5,150,105,0.6)] flex items-center justify-center
        hover:bg-primary-700
        transition-colors duration-300 z-50 disabled:opacity-70
      "
      aria-label="Chat with AI"
    >
      {checking ? (
        <Loader2 className="w-5 sm:w-6 h-5 sm:h-6 animate-spin" />
      ) : (
        <MessageCircle className="w-5 sm:w-6 h-5 sm:h-6" />
      )}
    </motion.button>
  );
}
