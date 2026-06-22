// src/api/apiClient.ts
import axiosInstance from './axiosInstance'

// Import types đã khớp với backend
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '../types/auth'

import type {
  ProfileUserDto,
  FollowDto,
} from '../types/user'

import type {
  MediaDto,
  AudioMediaDto,
  SearchTrendingDto,
} from '../types/media'

import type {
  PlayListDto,
} from '../types/playlist'

import type {
  ShareMediaDto,
  SharedItemDto,
  ShareStyle,
} from '../types/share'

import type {
  NotificationDto,
  Read,
} from '../types/notification'

import type {
  ApiResponse,
  ApiResponseNoData,
} from '../types/api'

// =============================================
// API CLIENT — tất cả các hàm gọi backend
// Đã điều chỉnh endpoint + interface khớp với Backend C# thật
// =============================================

const apiClient = {

  // --- Auth (api/auth) ---
  auth: {
    // POST api/auth/login
    login: (data: LoginRequest) =>
      axiosInstance.post<ApiResponse<AuthResponse>>('/auth/login', data)
        .then(response => response.data.data),   // Unwrap ApiResponse để lấy AuthResponse thực tế

    // POST api/auth/register
    register: (data: RegisterRequest) =>
      axiosInstance.post<ApiResponse<AuthResponse>>('/auth/register', data)
        .then(response => response.data.data),   // Unwrap ApiResponse

    // POST api/auth/logout
    logout: () =>
      axiosInstance.post<ApiResponseNoData>('/auth/logout')
        .then(response => response.data),
  },

  // --- User Profile (api/user) ---
  profile: {
    // GET api/user/profile
    getMe: (): Promise<ApiResponse<ProfileUserDto>> =>
      axiosInstance.get('/user/profile'),

    // GET api/user/{id}
    getById: (id: string) =>
      axiosInstance.get<ApiResponse<ProfileUserDto>>(`/user/${id}`),

    // PUT api/user/profile
    update: (formData: FormData) =>
      axiosInstance.put<ApiResponse<ProfileUserDto>>('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
  },

  // --- Media (api/media) ---
  media: {
    // POST api/media/upload
    upload: (formData: FormData) =>
      axiosInstance.post<ApiResponse<object>>('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),

    // GET api/media/{id}
    getById: (id: string) =>
      axiosInstance.get<ApiResponse<AudioMediaDto>>(`/media/${id}`),

    // GET api/media/{id}/stream
    getStreamUrl: (id: string) =>
      `${axiosInstance.defaults.baseURL}/media/${id}/stream`,

    // GET api/media/search?q=...&isTrending=...
    search: (query: string, isTrending: boolean = false, pageNumber: number = 1, pageSize: number = 10) =>
      axiosInstance.get<ApiResponse<SearchTrendingDto>>('/media/search', {
        params: { q: query, isTrending, pageNumber, pageSize },
      }),
  },

  // --- Playlist (api/playlist) — CHÚ Ý: không có 's' ở cuối như frontend cũ
  playlist: {
    // GET api/playlist
    getMyPlaylists: () =>
      axiosInstance.get<ApiResponse<PlayListDto[]>>('/playlist'),

    // GET api/playlist/{id}
    getById: (id: string) =>
      axiosInstance.get<ApiResponse<PlayListDto>>(`/playlist/${id}`),

    // POST api/playlist (multipart/form-data)
    create: (formData: FormData) =>
      axiosInstance.post<ApiResponse<PlayListDto>>('/playlist', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),

    // PUT api/playlist/{id}
    update: (id: string, formData: FormData) =>
      axiosInstance.put<ApiResponse<PlayListDto>>(`/playlist/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),

    // DELETE api/playlist/{id}
    delete: (id: string) =>
      axiosInstance.delete<ApiResponseNoData>(`/playlist/${id}`),

    // POST api/playlist/{id}/tracks
    addTrack: (playlistId: string, mediaId: string) =>
      axiosInstance.post<ApiResponseNoData>(
        `/playlist/${playlistId}/tracks`,
        { mediaId }   // Body: { MediaId: Guid }
      ),

    // DELETE api/playlist/{id}/tracks/{mediaId}
    removeTrack: (playlistId: string, mediaId: string) =>
      axiosInstance.delete<ApiResponseNoData>(`/playlist/${playlistId}/tracks/${mediaId}`),
  },

  // --- Share (api/share) ---
  share: {
    // POST api/share
    send: (receiverUserId: string, itemId: string, shareStyle: ShareStyle) =>
      axiosInstance.post<ApiResponse<ShareMediaDto>>('/share', {
        receiverUserId,   // Backend dùng ReceiverUserId (có chữ User)
        itemId,           // Backend dùng ItemId (không phải MediaId)
        shareStyle,
      }),

    // GET api/share/received
    getReceived: () =>
      axiosInstance.get<ApiResponse<SharedItemDto[]>>('/share/received'),
  },

  // --- Notifications (api/notification) — CHÚ Ý: không có 's' ở cuối
  notification: {
    // GET api/notification
    getAll: () =>
      axiosInstance.get<ApiResponse<NotificationDto[]>>('/notification'),

    // PUT api/notification/{id}/read
    markAsRead: (id: string) =>
      axiosInstance.put<ApiResponseNoData>(`/notification/${id}/read`),
  },
}

export default apiClient