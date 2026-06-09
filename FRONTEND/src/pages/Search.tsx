// src/pages/Search.tsx
import { useState } from 'react'

const MOCK_ALL_SONGS = [
  { id: 1, title: 'Chạy Ngay Đi', artist: 'Sơn Tùng M-TP' },
  { id: 2, title: 'Waiting For You', artist: 'MONO' },
  { id: 3, title: 'C# & .NET Song', artist: 'Lập Trình Viên Đẹp Trai' },
  { id: 4, title: 'Database Connection Beats', artist: 'Dapper Master' },
]

export default function Search() {
  const [keyword, setKeyword] = useState('')

  const filteredSongs = MOCK_ALL_SONGS.filter(song => 
    song.title.toLowerCase().includes(keyword.toLowerCase()) ||
    song.artist.toLowerCase().includes(keyword.toLowerCase())
  )

  return (
    <div style={{ padding: '32px', color: '#fff' }}>
      <h1 style={{ marginBottom: 16 }}>Tìm kiếm</h1>
      <input 
        type="text" 
        placeholder="Bạn muốn nghe gì?" 
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ width: '100%', maxWidth: 400, padding: '12px 16px', borderRadius: 24, border: 'none', backgroundColor: '#242424', color: '#fff', fontSize: 16, outline: 'none', marginBottom: 24 }}
      />

      <h3>Kết quả hàng đầu</h3>
      <div style={{ marginTop: 16 }}>
        {filteredSongs.length > 0 ? filteredSongs.map(song => (
          <div key={song.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#181818', borderRadius: 4, marginBottom: 8 }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>{song.title}</div>
              <div style={{ color: '#b3b3b3', fontSize: 14 }}>{song.artist}</div>
            </div>
            <button style={{ background: 'none', border: 'none', color: '#1DB954', cursor: 'pointer', fontSize: 18 }}>▶</button>
          </div>
        )) : <p style={{ color: '#b3b3b3' }}>Không tìm thấy bài hát nào khớp.</p>}
      </div>
    </div>
  )
}