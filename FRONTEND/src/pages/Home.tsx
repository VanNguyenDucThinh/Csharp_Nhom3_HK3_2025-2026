// src/pages/Home.tsx
import { useNavigate } from 'react-router-dom'

// Dữ liệu mẫu theo đúng tinh thần TuneVault của thầy
const MOCK_PLAYLISTS = [
  { id: '1', name: 'Top Hits 2026', desc: 'Những bài hát hot nhất hiện tại', cover: 'https://picsum.photos/200?random=1' },
  { id: '2', name: 'Lofi Chill', desc: 'Nhạc nhẹ nhàng cho ngày làm việc tập trung', cover: 'https://picsum.photos/200?random=2' },
  { id: '3', name: 'Rap Việt Cực Chất', desc: 'Tuyển tập Rap hay nhất', cover: 'https://picsum.photos/200?random=3' },
  { id: '4', name: 'Coding Beats', desc: 'Tăng 200% năng suất viết code C#', cover: 'https://picsum.photos/200?random=4' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '32px', color: '#fff', overflowY: 'auto', height: '100%' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: 'bold' }}>Chào mừng quay trở lại</h1>
      
      <h2 style={{ marginBottom: '16px', fontSize: '20px', color: '#b3b3b3' }}>Dành cho bạn</h2>
      
      <div style={styles.grid}>
        {MOCK_PLAYLISTS.map((playlist) => (
          <div 
            key={playlist.id} 
            style={styles.card}
            onClick={() => navigate(`/playlist/${playlist.id}`)}
          >
            <img src={playlist.cover} alt={playlist.name} style={styles.cover} />
            <h3 style={styles.title}>{playlist.name}</h3>
            <p style={styles.desc}>{playlist.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(18px, 1fr))'.replace('18px', '200px'),
    gap: '24px',
  },
  card: {
    backgroundColor: '#181818',
    padding: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  cover: {
    width: '100%',
    aspectRatio: '1/1',
    borderRadius: '6px',
    marginBottom: '16px',
    objectFit: 'cover',
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  desc: {
    fontSize: '14px',
    color: '#b3b3b3',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }
}