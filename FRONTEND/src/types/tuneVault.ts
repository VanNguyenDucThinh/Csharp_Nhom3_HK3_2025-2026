// src/types/tuneVault.ts
// Các kiểu dữ liệu trung tâm của TuneVault, dùng chung giữa API client, hook, store và component.

// MediaType phân biệt media là bài hát hoặc video.
export type MediaType = 'audio' | 'video'

// RepeatMode mô tả chế độ lặp của trình phát.
export type PlaybackRepeatMode = 'off' | 'one' | 'all'

// Artist đại diện cho một nghệ sĩ trong hệ thống.
export interface Artist {
  // id định danh nghệ sĩ, nhận từ backend C#.
  id: string

  // name là tên hiển thị của nghệ sĩ.
  name: string

  // avatarUrl là ảnh đại diện của nghệ sĩ, có thể chưa có.
  avatarUrl?: string

  // bio là mô tả ngắn về nghệ sĩ, có thể chưa có.
  bio?: string
}

// Album đại diện cho một album chứa nhiều track.
export interface Album {
  // id định danh album.
  id: number

  // title là tên album hiển thị trong UI.
  title: string

  // artistId là id nghệ sĩ sở hữu album, dùng khi backend trả dạng chuẩn hóa.
  artistId?: string

  // artist là tên nghệ sĩ, dùng khi backend trả gọn theo DTO hiện tại.
  artist?: string

  // coverUrl là ảnh bìa album, có thể chưa có.
  coverUrl?: string

  // releaseDate là ngày phát hành album, có thể chưa có.
  releaseDate?: string

  // createdAt là thời điểm bản ghi được tạo.
  createdAt: string
}

// Track đại diện cho một bài hát hoặc video trong thư viện.
export interface Track {
  // id định danh track.
  id: number

  // title là tiêu đề bài hát hoặc video.
  title: string

  // artist là tên nghệ sĩ hiển thị nhanh, giữ tương thích với backend hiện tại.
  artist: string

  // artistId là id nghệ sĩ nếu backend trả đầy đủ hơn trong tương lai.
  artistId?: string

  // albumId là id album nếu track thuộc album.
  albumId?: number

  // album là thông tin album nếu backend trả kèm album.
  album?: Album

  // type phân biệt audio hoặc video.
  type: MediaType

  // fileUrl là đường dẫn tải hoặc phát media.
  fileUrl: string

  // thumbnailUrl là ảnh thumbnail, có thể chưa có.
  thumbnailUrl?: string

  // description là mô tả nội dung, có thể chưa có.
  description?: string

  // duration là thời lượng tính bằng giây.
  duration: number

  // ownerId là id người sở hữu media.
  ownerId: string

  // createdAt là thời điểm media được tạo.
  createdAt: string
}

// MediaItem là tên tương thích với backend hiện tại, thực chất là Track.
export type MediaItem = Track

// Playlist đại diện cho danh sách phát do người dùng tạo.
export interface Playlist {
  // id định danh playlist.
  id: number

  // name là tên playlist hiển thị trong UI.
  name: string

  // isPublic cho biết playlist có công khai hay không.
  isPublic: boolean

  // ownerId là id người tạo playlist.
  ownerId: string

  // tracks là danh sách bài hát hoặc video trong playlist.
  tracks: Track[]

  // createdAt là thời điểm playlist được tạo.
  createdAt: string
}

// User đại diện cho người dùng TuneVault.
export interface User {
  // id định danh người dùng.
  id: string

  // username là tên đăng nhập hoặc tên hiển thị.
  username: string

  // email là địa chỉ email của người dùng.
  email: string

  // bio là giới thiệu ngắn của người dùng, có thể chưa có.
  bio?: string

  // avatarUrl là ảnh đại diện, có thể chưa có.
  avatarUrl?: string
}

// PlaybackState mô tả trạng thái hiện tại của trình phát.
export interface PlaybackState {
  // currentTrack là track đang phát, null khi chưa có bài nào được chọn.
  currentTrack: Track | null

  // isPlaying cho biết trình phát đang phát hay tạm dừng.
  isPlaying: boolean

  // positionSeconds là vị trí hiện tại của bài tính bằng giây.
  positionSeconds: number

  // durationSeconds là tổng thời lượng bài tính bằng giây.
  durationSeconds: number

  // volume là âm lượng từ 0 đến 1.
  volume: number

  // isMuted cho biết trình phát đang bị tắt tiếng hay không.
  isMuted: boolean

  // repeatMode là chế độ lặp hiện tại.
  repeatMode: PlaybackRepeatMode

  // isShuffle cho biết trình phát đang phát ngẫu nhiên hay không.
  isShuffle: boolean
}

// QueueItem đại diện cho một mục trong hàng chờ phát nhạc.
export interface QueueItem {
  // id định danh mục trong queue, thường tạo ở frontend.
  id: string

  // track là bài hát hoặc video sẽ được phát.
  track: Track

  // addedBy là id người thêm vào queue, có thể chưa có.
  addedBy?: string

  // addedAt là thời điểm mục được thêm vào queue.
  addedAt: string
}

// Notification đại diện cho thông báo realtime hoặc từ API.
export interface Notification {
  // id định danh thông báo.
  id: number

  // type phân loại thông báo, giữ dạng string để linh hoạt với backend.
  type: string

  // title là tiêu đề thông báo, có thể chưa có.
  title?: string

  // message là nội dung thông báo hiển thị cho user.
  message: string

  // isRead cho biết thông báo đã được đọc hay chưa.
  isRead: boolean

  // createdAt là thời điểm thông báo được tạo.
  createdAt: string

  // source là nguồn phát thông báo, có thể chưa có.
  source?: string

  // metadata là dữ liệu mở rộng nếu backend cần gửi thêm.
  metadata?: Record<string, unknown>
}

// MediaShare đại diện cho một lần chia sẻ media giữa các user.
export interface MediaShare {
  // id định danh bản ghi chia sẻ.
  id: number

  // mediaItem là bài hát hoặc video được chia sẻ.
  mediaItem: MediaItem

  // sender là người gửi media.
  sender: User

  // sharedAt là thời điểm chia sẻ.
  sharedAt: string
}

// LoginRequest là dữ liệu frontend gửi khi đăng nhập.
export interface LoginRequest {
  // username là tên đăng nhập.
  username: string

  // password là mật khẩu.
  password: string
}

// RegisterRequest là dữ liệu frontend gửi khi đăng ký.
export interface RegisterRequest {
  // username là tên đăng nhập mới.
  username: string

  // email là email đăng ký.
  email: string

  // password là mật khẩu mới.
  password: string
}

// AuthResponse là dữ liệu backend trả về sau khi đăng nhập hoặc đăng ký thành công.
export interface AuthResponse {
  // token dùng để gọi API và kết nối SignalR.
  token: string

  // user là thông tin người dùng sau khi xác thực.
  user: User
}
