// src/pages/PlayerContext.tsx
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { AudioMediaDto } from '../types/Media.ts';

interface PlayerContextType {
  currentTrack: AudioMediaDto | null;
  playTrack: (track: AudioMediaDto) => void;
  updateCurrentTrack: (updatedFields: Partial<AudioMediaDto>) => void;
  favIds: Set<string>;
  setFavIds: (ids: Set<string>) => void;
  toggleFavId: (id: string) => void;
  mediaRef: React.RefObject<HTMLMediaElement | null>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioMediaDto | null>(null);
  const mediaRef = useRef<HTMLMediaElement | null>(null);

  // Khởi tạo favIds từ localStorage để không bị mất khi F5
  const [favIds, setFavIdsState] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('favIds');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Tự động lưu vào localStorage mỗi khi favIds thay đổi
  useEffect(() => {
    localStorage.setItem('favIds', JSON.stringify(Array.from(favIds)));
  }, [favIds]);

  const playTrack = (track: AudioMediaDto) => {
    setCurrentTrack(track);
  };

  const updateCurrentTrack = (updatedFields: Partial<AudioMediaDto>) => {
    setCurrentTrack((prev) => prev ? { ...prev, ...updatedFields } : null);
  };

  const setFavIds = (ids: Set<string>) => {
    setFavIdsState(new Set(ids));
  };

  const toggleFavId = (id: string) => {
    setFavIdsState(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <PlayerContext.Provider value={{ 
      currentTrack, 
      playTrack, 
      updateCurrentTrack, 
      favIds, 
      setFavIds, 
      toggleFavId,
      mediaRef 
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer phải được bọc trong PlayerProvider');
  }
  return context;
};