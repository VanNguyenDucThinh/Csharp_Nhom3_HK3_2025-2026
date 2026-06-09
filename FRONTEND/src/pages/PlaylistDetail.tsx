// src/pages/PlaylistDetail.tsx
import { useParams } from 'react-router-dom'

// Danh sách bài hát mẫu
const MOCK_SONGS = [
  { id: 1, title: 'Chạy Ngay Đi', artist: 'Sơn Tùng M-TP', duration: '4:05' },
  { id: 2, title: 'Waiting For You', artist: 'MONO', duration: '4:25' },
  { id: 3, title: 'C# & .NET Song', artist: 'Lập Trình Viên Đẹp Trai', duration: '3:50' },
  { id: 4, title: 'Database Connection Beats', artist: 'Dapper Master', duration: '5:12' },
]

export default function PlaylistDetail() {
  const { id } = useParams()

  return (
    <div style={{ padding: '32px', color: '#fff', overflowY: 'auto', height: '100%' }}>
      {/* Header của Playlist */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', marginBottom: '32px' }}>
        <img src={`https://picsum.photos/200?random=${id}`} alt="Cover" style={{ width: 192, height: 192, borderRadius: 8, boxShadow: '0 4px 60px rgba(0,0,0,.5)' }} />
        <div>
          <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Playlist</p>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '8px 0' }}>Tuyển tập số {id}</h1>
          <p style={{ color: '#b3b3b3', fontSize: '14px' }}>Tạo bởi nhóm của bạn • {MOCK_SONGS.length} bài hát</p>
        </div>
      </div>

      {/* Nút Play hành động nhanh */}
      <button style={{ backgroundColor: '#1DB954', color: '#fff', border: 'none', borderRadius: '50%', width: 56, height: 56, fontSize: 24, cursor: 'pointer', marginBottom: 24, fontWeight: 'bold' }}>
        ▶
      </button>

      {/* Danh sách bài hát dạng bảng giống Spotify */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #282828', color: '#b3b3b3', fontSize: '14px' }}>
            <th style={{ padding: '12px', width: '50px' }}>#</th>
            <th style={{ padding: '12px' }}>Tiêu đề</th>
            <th style={{ padding: '12px' }}>Nghệ sĩ</th>
            <th style={{ padding: '12px', width: '80px' }}>⏱</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_SONGS.map((song, index) => (
            <tr key={song.id} style={{ borderBottom: '1px solid transparent', cursor: 'pointer', color: '#e5e5e5' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#282828'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <td style={{ padding: '12px' }}>{index + 1}</td>
              <td style={{ padding: '12px', fontWeight: '500' }}>{song.title}</td>
              <td style={{ padding: '12px', color: '#b3b3b3' }}>{song.artist}</td>
              <td style={{ padding: '12px', color: '#b3b3b3' }}>{song.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}