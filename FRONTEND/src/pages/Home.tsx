// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { showApiError } from "../api/apiClient.ts";
import { usePlayer } from "./PlayerContext.tsx";
import type { MediaDto as MediaItem } from "../types/Media.ts";
import type { PlayListDto as Playlist } from "../types/Playlist.ts";
import type { HistoryMediaDto } from "../types/History.ts";
import { Category } from "../types/Media.ts";
import HScrollSection from "../components/layout/HScrollSection.tsx";

const cardColors = [
  "#1e3264", "#7358ff", "#e8115b", "#148a08",
  "#e91429", "#8400e7", "#1e6432", "#e87c13",
];

// ============================================================
// HÀM GỘP BÀI HÁT TRÙNG TRONG LỊCH SỬ
//
// Tại sao cần gộp? Backend lưu MỖI LẦN nghe là 1 dòng trong PlayHistory.
// Nếu user nghe "Sexy and I know it" 4 lần → backend trả về 4 item giống nhau.
// Frontend phải gộp chúng lại thành 1 card duy nhất, hiện lần nghe gần nhất.
//
// Cách làm: dùng Map với key là idMedia để đảm bảo mỗi bài chỉ có 1 entry.
// Khi gặp idMedia đã tồn tại → so sánh playAt, giữ cái playAt MỚI HƠN.
// ============================================================
interface TrackVoiSoLan extends MediaItem {
  soLanNghe: number;   // Số lần bài này xuất hiện trong lịch sử
  playAt: string;      // Thời điểm nghe gần nhất (ISO string)
}

function gopBaiHatTrung(historyItems: HistoryMediaDto[]): TrackVoiSoLan[] {
  // Map<idMedia, TrackVoiSoLan> — mỗi idMedia chỉ lưu 1 entry
  const bangGop = new Map<string, TrackVoiSoLan>();

  for (const item of historyItems) {
    const entry = bangGop.get(item.idMedia);

    if (!entry) {
      // Lần đầu gặp idMedia này → thêm mới vào map
      bangGop.set(item.idMedia, {
        id:         item.idMedia,
        title:      item.title,
        artist:     item.artist,
        urlImage:   item.urlImage,
        urlMedia:   "",
        category:   Category.Pop,
        owner:      "",
        soLanNghe:  1,
        playAt:     item.playAt,
      });
    } else {
      // Đã có idMedia này → tăng đếm và giữ playAt MỚI HƠN
      // new Date(a) > new Date(b) nghĩa là a xảy ra SAU b (gần đây hơn)
      const playAtMoiHon =
        new Date(item.playAt) > new Date(entry.playAt)
          ? item.playAt
          : entry.playAt;

      bangGop.set(item.idMedia, {
        ...entry,
        soLanNghe: entry.soLanNghe + 1,
        playAt:    playAtMoiHon,
      });
    }
  }

  // Chuyển Map thành mảng, sắp xếp theo playAt mới nhất lên đầu
  return Array.from(bangGop.values()).sort(
    (a, b) => new Date(b.playAt).getTime() - new Date(a.playAt).getTime()
  );
}

// ============================================================
// SUB-COMPONENT: Card bài hát trong "Nghe gần đây"
// Có badge "Nghe X lần" nếu soLanNghe > 1
// ============================================================
function MediaCard({ item, onClick }: { item: TrackVoiSoLan; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const BACKEND_DOMAIN = "http://localhost:5124";

  // Xây dựng URL ảnh — nếu đã là URL đầy đủ thì dùng thẳng, không thì ghép domain
  const imageUrl = item.urlImage
    ? (item.urlImage.startsWith("http") ? item.urlImage : `${BACKEND_DOMAIN}/${item.urlImage}`)
    : "";

  return (
    <div
      style={{ ...cardStyles.card, backgroundColor: hovered ? "#282828" : "#181818" }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={cardStyles.cover}>
        {imageUrl
          ? <img src={imageUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ fontSize: 40 }}>🎵</span>
        }
        {/* Badge số lần nghe — chỉ hiện khi nghe hơn 1 lần */}
        {item.soLanNghe > 1 && (
          <div style={cardStyles.badge}>
            {item.soLanNghe} lần
          </div>
        )}
        <div style={{ ...cardStyles.playOverlay, opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(4px)" }}>
          <div style={cardStyles.playCircle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="black">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </div>
      </div>
      <div style={cardStyles.title}>{item.title}</div>
      <div style={cardStyles.sub}>{item.artist}</div>
    </div>
  );
}

function PlaylistCard({ pl, index, onClick }: { pl: Playlist; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ ...cardStyles.card, backgroundColor: hovered ? "#282828" : "#181818" }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...cardStyles.cover, background: `linear-gradient(135deg, ${cardColors[index % cardColors.length]}, #121212)` }}>
        <span style={{ fontSize: 36 }}>🎵</span>
        <div style={{ ...cardStyles.playOverlay, opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(4px)" }}>
          <div style={cardStyles.playCircle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="black">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </div>
      </div>
      <div style={cardStyles.title}>{pl.name}</div>
      <div style={cardStyles.sub}>Playlist</div>
    </div>
  );
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Chào buổi sáng";
  else if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
};

export default function Home() {
  const navigate = useNavigate();
  const { playTrack } = usePlayer();

  const [playlists, setPlaylists]       = useState<Playlist[]>([]);
  const [recentTracks, setRecentTracks] = useState<TrackVoiSoLan[]>([]);
  const [loading, setLoading]           = useState(true);
  const [greeting]                      = useState(() => getGreeting());

  useEffect(() => {
    const load = async () => {
      try {
        const [pls, historyItems] = await Promise.all([
          apiClient.playlist.getAll(),
          apiClient.history.getRecent(),
        ]);
        setPlaylists(pls);

        // Gộp bài hát trùng trước khi set state
        // Hàm gopBaiHatTrung trả về mảng đã lọc unique + sắp xếp theo lần nghe gần nhất
        const tracksGop = gopBaiHatTrung(historyItems);
        setRecentTracks(tracksGop);

      } catch (err) {
        showApiError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return <div style={{ padding: 40, color: "#b3b3b3" }}>Đang tải...</div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.greeting}>{greeting}!</h1>

      {/* Quick grid */}
      <div style={styles.quickGrid}>
        {playlists.slice(0, 6).map((pl, i) => (
          <div
            key={pl.id}
            style={{ ...styles.quickCard, backgroundColor: cardColors[i % cardColors.length] }}
            onClick={() => navigate(`/playlist/${pl.id}`)}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <div style={styles.quickIcon}>🎵</div>
            <span style={styles.quickName}>{pl.name}</span>
          </div>
        ))}
      </div>

      {/* Nghe gần đây — đã gộp trùng */}
      {recentTracks.length > 0 && (
        <HScrollSection title="Nghe gần đây" onSeeAll={() => navigate("/library")}>
          {recentTracks.map((track) => (
            <MediaCard
              key={track.id}
              item={track}
              // Khi click card → phát bài hát đó qua PlayerContext
              onClick={() => playTrack(track)}
            />
          ))}
        </HScrollSection>
      )}

      {/* Playlist của bạn */}
      {playlists.length > 0 && (
        <HScrollSection title="Playlist của bạn" onSeeAll={() => navigate("/library")}>
          {playlists.map((pl, i) => (
            <PlaylistCard
              key={pl.id}
              pl={pl}
              index={i}
              onClick={() => navigate(`/playlist/${pl.id}`)}
            />
          ))}
        </HScrollSection>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page:      { padding: "24px 24px 40px", color: "#fff" },
  greeting:  { fontSize: 28, fontWeight: 800, marginBottom: 20 },
  quickGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 40 },
  quickCard: { display: "flex", alignItems: "center", gap: 12, borderRadius: 6, overflow: "hidden", cursor: "pointer", height: 56, paddingRight: 16, transition: "opacity 0.2s" },
  quickIcon: { width: 56, height: 56, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, backgroundColor: "rgba(0,0,0,0.3)" },
  quickName: { fontWeight: 700, fontSize: 13 },
};

const cardStyles: Record<string, React.CSSProperties> = {
  card:        { borderRadius: 8, padding: 16, cursor: "pointer", width: 160, flexShrink: 0, transition: "background-color 0.2s", position: "relative" },
  cover:       { width: "100%", aspectRatio: "1", backgroundColor: "#282828", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, overflow: "hidden", position: "relative" },
  playOverlay: { position: "absolute", bottom: 8, right: 8, transition: "opacity 0.2s, transform 0.2s" },
  playCircle:  { width: 40, height: 40, borderRadius: "50%", backgroundColor: "#1DB954", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" },
  title:       { fontSize: 14, fontWeight: 700, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  sub:         { fontSize: 12, color: "#b3b3b3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  // Badge "Nghe X lần" — góc trên phải của ảnh bìa
  badge:       { position: "absolute", top: 6, right: 6, backgroundColor: "rgba(0,0,0,0.75)", color: "#1DB954", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 10, backdropFilter: "blur(4px)" },
};