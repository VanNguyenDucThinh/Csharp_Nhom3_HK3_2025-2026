// src/api/apiClient.ts
import axiosInstance from './axiosInstance'

// =============================================
// INTERFACES — khớp với DTO từ Backend C#
// =============================================

export interface User {
  id: string
  username: string
  email: string
  bio?: string
  avatarUrl?: string
}

export interface MediaItem {
  id: number
  title: string
  artist: string
  type: 'audio' | 'video'
  fileUrl: string
  thumbnailUrl?: string
  description?: string
  duration: number
  ownerId: string
  createdAt: string
}

export interface Playlist {
  id: number
  name: string
  isPublic: boolean
  ownerId: string
  tracks: MediaItem[]
  createdAt: string
}

export interface MediaShare {
  id: number
  mediaItem: MediaItem
  sender: User
  sharedAt: string
}

export interface Notification {
  id: number
  type: string
  message: string
  isRead: boolean
  createdAt: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Hiển thị lỗi giống MessageBox trong trình duyệt bằng alert.
export function showApiError(message: string, error: unknown): void {
  const detail = error instanceof Error ? error.message : String(error)
  window.alert(`${message}\nChi tiết: ${detail}`)
}

// =============================================
// API CLIENT — tất cả các hàm gọi backend
// =============================================

const apiClient = {

  // --- Auth ---
  auth: {
    login: (data: LoginRequest) =>
      axiosInstance.post<AuthResponse>('/auth/login', data).then(r => r.data),
    register: (data: RegisterRequest) =>
      axiosInstance.post<AuthResponse>('/auth/register', data).then(r => r.data),
    logout: () =>
      axiosInstance.post('/auth/logout').then(r => r.data),
  },

  // --- User Profile ---
  profile: {
    getMe: () =>
      axiosInstance.get<User>('/profile/me').then(r => r.data),
    update: (data: Partial<User>) =>
      axiosInstance.put<User>('/profile/me', data).then(r => r.data),
    getById: (id: string) =>
      axiosInstance.get<User>(`/profile/${id}`).then(r => r.data),
  },

  // --- Media (Audio + Video) ---
  media: {
    getAll: () =>
      axiosInstance.get<MediaItem[]>('/media').then(r => r.data),
    getById: (id: number) =>
      axiosInstance.get<MediaItem>(`/media/${id}`).then(r => r.data),
    upload: (formData: FormData) =>
      axiosInstance.post<MediaItem>('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(r => r.data),
    search: (query: string) =>
      axiosInstance.get<MediaItem[]>(`/media/search?q=${encodeURIComponent(query)}`).then(r => r.data),
    getStreamUrl: (id: number) => `${axiosInstance.defaults.baseURL}/media/${id}/stream`,
    recordPlay: (id: number) =>
      axiosInstance.post(`/media/${id}/play`).then(r => r.data),
    toggleFavorite: (id: number) =>
      axiosInstance.post(`/media/${id}/favorite`).then(r => r.data),
  },

  // --- Playlist ---
  playlists: {
    getAll: () =>
      axiosInstance.get<Playlist[]>('/playlists').then(r => r.data),
    getById: (id: number) =>
      axiosInstance.get<Playlist>(`/playlists/${id}`).then(r => r.data),
    create: (data: { name: string; isPublic: boolean }) =>
      axiosInstance.post<Playlist>('/playlists', data).then(r => r.data),
    addTrack: (playlistId: number, mediaId: number) =>
      axiosInstance.post(`/playlists/${playlistId}/tracks`, { mediaId }).then(r => r.data),
    removeTrack: (playlistId: number, mediaId: number) =>
      axiosInstance.delete(`/playlists/${playlistId}/tracks/${mediaId}`).then(r => r.data),
    delete: (id: number) =>
      axiosInstance.delete(`/playlists/${id}`).then(r => r.data),
  },

  // --- Share Media ---
  share: {
    send: (receiverId: string, mediaId: number) =>
      axiosInstance.post('/share', { receiverId, mediaId }).then(r => r.data),
    getSharedWithMe: () =>
      axiosInstance.get<MediaShare[]>('/share/inbox').then(r => r.data),
    getSharedByMe: () =>
      axiosInstance.get<MediaShare[]>('/share/sent').then(r => r.data),
  },

  // --- Notifications ---
  notifications: {
    getAll: () =>
      axiosInstance.get<Notification[]>('/notifications').then(r => r.data),
    markAsRead: (id: number) =>
      axiosInstance.patch(`/notifications/${id}/read`).then(r => r.data),
    markAllAsRead: () =>
      axiosInstance.patch('/notifications/read-all').then(r => r.data),
  },

  // --- Play History ---
  history: {
    getRecent: () =>
      axiosInstance.get<MediaItem[]>('/history').then(r => r.data),
  },
}

export default apiClient