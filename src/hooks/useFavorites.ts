'use client';
import { useState, useEffect } from 'react';

const KEY = 'isra-favorites';

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setIds(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
    } catch {
      setIds([]);
    }
  }, []);

  const toggle = (id: string) => {
    setIds(prev => {
      const next = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  return {
    isFav: (id: string) => mounted && ids.includes(id),
    toggle,
    count: mounted ? ids.length : 0,
  };
}
