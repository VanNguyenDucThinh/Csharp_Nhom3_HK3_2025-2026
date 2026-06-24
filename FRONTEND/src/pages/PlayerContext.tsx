// src/pages/PlayerContext.tsx
import { createContext, useContext, useState} from 'react';
import type { ReactNode } from 'react';
import type { AudioMediaDto } from '../types/Media.ts';

interface PlayerContextType {
  currentTrack: AudioMediaDto | null;
  playTrack: (track: AudioMediaDto) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioMediaDto | null>(null);

  const playTrack = (track: any) => {
    
    // THÊM TRẠM KIỂM SOÁT SỐ 4 Ở ĐÂY:
    console.log("4. Trạm Context đã nhận được lệnh phát nhạc:", track);
    
    setCurrentTrack(track); // Lệnh này cập nhật State
  };

  return (
    <PlayerContext.Provider value={{ currentTrack, playTrack }}>
      {children}
    </PlayerContext.Provider>
  );
}

// Hook hỗ trợ lấy dữ liệu nhanh
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer phải được bọc trong PlayerProvider');
  }
  return context;
};