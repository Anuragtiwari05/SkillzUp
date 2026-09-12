"use client";

import { useEffect, useState } from "react";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!cancelled) setIsLoggedIn(data.success === true);
      } catch {
        if (!cancelled) setIsLoggedIn(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  return { isLoggedIn, loading };
}

export async function checkAuthNow(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}
