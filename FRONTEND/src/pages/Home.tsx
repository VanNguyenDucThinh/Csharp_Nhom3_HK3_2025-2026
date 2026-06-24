// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { showApiError } from "../api/apiClient.ts";
import type { MediaDto as MediaItem } from "../types/Media.ts";
import type { PlayListDto as Playlist } from "../types/Playlist.ts";
import type { HistoryMediaDto } from "../types/History.ts";
import { Category } from "../types/Media.ts";
import HScrollSection from "../components/layout/HScrollSection.tsx";

const cardColors = ["#1e3264","#7358ff","#e8115b","#148a08","#e91429","#8400e7","#1e6432","#e87c13"];

// ============================================================
// HÀM GỘP BÀI HÁT TRÙNG TRONG LỊCH SỬ NGHE
//
// Vấn đề: Backend trả về mảng PlayHistory theo thứ tự thời gian,
// cùng 1 bài hát có thể xuất hiện nhiều lần nếu nghe đi nghe lại.
// Kết quả: "Sexy and I know it" hiện 4 lần liên tiếp trên UI.
//
// Giải pháp: Dùng Map với key là idMedia để gộp.
// Map tự động đảm bảo mỗi idMedia chỉ tồn tại 1 lần.
// Khi gặp bài đã có trong Map, so sánh playAt để giữ lại
// lần nghe MỚI NHẤT (playAt lớn hơn = nghe sau hơn).
// ============================================================
interface TrackVoiSoLan extends MediaItem {
  soLanNghe: number;    // Badge hiển thị "Nghe X lần"
  lanNgheGanNhat: string; // ISO string của lần nghe mới nhất
}

function gopBaiHatTrung(historyItems: HistoryMediaDto[]): TrackVoiSoLan[] {
  // Map<idMedia, { track data + soLanNghe + playAt mới nhất }>
  const mapGop = new Map<string, TrackVoiSoLan>();

  for (const item of historyItems) {
    const daCoTrongMap = mapGop.get(item.idMedia);

    if (!daCoTrongMap) {
      // Lần đầu gặp bài này → thêm vào Map
      mapGop.set(item.idMedia, {
        id: item.idMedia,
        title: item.title,
        artist: item.artist,
        urlImage: item.urlImage,
        urlMedia: "",
        category: Category.Pop,
        owner: "",
        soLanNghe: 1,
        lanNgheGanNhat: item.playAt,
      });
    } else {
      // Đã có → tăng đếm và cập nhật playAt mới nhất nếu cần
      // So sánh chuỗi ISO 8601: chuỗi lớn hơn = thời gian sau hơn
      const playAtMoiHon = item.playAt > daCoTrongMap.lanNgheGanNhat
        ? item.playAt
        : daCoTrongMap.lanNgheGanNhat;

      mapGop.set(item.idMedia, {
        ...daCoTrongMap,
        soLanNghe: daCoTrongMap.soLanNghe + 1,
        lanNgheGanNhat: playAtMoiHon,
      });
    }
  }

  // Chuyển Map → mảng, sort theo lần nghe gần nhất lên đầu
  return Array.from(mapGop.values()).sort(
    (a, b) => b.lanNgheGanNhat.localeCompare(a.lanNgheGanNhat)
  );
}

// ── Card bài hát — có badge "Nghe X lần" khi nghe > 1 lần ───
function MediaCard({ item }: { item: TrackVoiSoLan }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ ...cardStyles.card, backgroundColor: hovered ? "#282828" : "#181818" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={cardStyles.cover}>
        {item.urlImage ? (
          <img src={item.urlImage} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 40 }}>🎵</span>
        )}
        {/* Badge "Nghe X lần" — chỉ hiện khi nghe nhiều hơn 1 lần */}
        {item.soLanNghe > 1 && (
          <div style={cardStyles.badge}>{item.soLanNghe} lần</div>
        )}
        <div style={{ ...cardStyles.playOverlay, opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(4px)" }}>
          <div style={cardStyles.playCircle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="black"><polygon points="5,3 19,12 5,21" /></svg>
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="black"><polygon points="5,3 19,12 5,21" /></svg>
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
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  // ── Dùng TrackVoiSoLan thay vì MediaItem để có thêm soLanNghe ──
  const [recentTracks, setRecentTracks] = useState<TrackVoiSoLan[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting] = useState(() => getGreeting());

  useEffect(() => {
    const load = async () => {
      try {
        const [pls, historyItems] = await Promise.all([
          apiClient.playlist.getAll(),
          apiClient.history.getRecent(),
        ]);
        setPlaylists(pls);

        // ── Gộp bài hát trùng trước khi set vào state ──────────
        // gopBaiHatTrung() nhận raw array từ backend (có thể trùng nhiều lần)
        // và trả về mảng đã gộp — mỗi bài chỉ xuất hiện 1 lần
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

      <HScrollSection title="Nghe gần đây" onSeeAll={() => navigate("/library")}>
        {recentTracks.map((track) => (
          // Dùng idMedia làm key — đã gộp nên không trùng
          <MediaCard key={track.id} item={track} />
        ))}
      </HScrollSection>

      <HScrollSection title="Playlist của bạn" onSeeAll={() => navigate("/library")}>
        {playlists.map((pl, i) => (
          <PlaylistCard key={pl.id} pl={pl} index={i} onClick={() => navigate(`/playlist/${pl.id}`)} />
        ))}
      </HScrollSection>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "24px 24px 40px", color: "#fff" },
  greeting: { fontSize: 28, fontWeight: 800, marginBottom: 20 },
  quickGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 40 },
  quickCard: { display: "flex", alignItems: "center", gap: 12, borderRadius: 6, overflow: "hidden", cursor: "pointer", height: 56, paddingRight: 16, transition: "opacity 0.2s" },
  quickIcon: { width: 56, height: 56, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, backgroundColor: "rgba(0,0,0,0.3)" },
  quickName: { fontWeight: 700, fontSize: 13 },
};

const cardStyles: Record<string, React.CSSProperties> = {
  card: { borderRadius: 8, padding: 16, cursor: "pointer", width: 160, flexShrink: 0, transition: "background-color 0.2s", position: "relative" },
  cover: { width: "100%", aspectRatio: "1", backgroundColor: "#282828", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, overflow: "hidden", position: "relative" },
  playOverlay: { position: "absolute", bottom: 8, right: 8, transition: "opacity 0.2s, transform 0.2s" },
  playCircle: { width: 40, height: 40, borderRadius: "50%", backgroundColor: "#1DB954", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" },
  title: { fontSize: 14, fontWeight: 700, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  sub: { fontSize: 12, color: "#b3b3b3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  // Badge góc trên phải của ảnh bìa
  badge: { position: "absolute", top: 6, right: 6, backgroundColor: "rgba(0,0,0,0.75)", color: "#1DB954", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 10, lineHeight: 1.5 },
};