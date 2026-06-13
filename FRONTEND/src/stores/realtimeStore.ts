import { create } from 'zustand'
import type { MediaItem, Notification, Playlist } from '../types/tuneVault'

// Các trạng thái có thể có của kết nối SignalR.
export type SignalRConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error'

// Cấu trúc store dùng để chứa dữ liệu realtime nhận từ backend.
type RealtimeState = {
  // Danh sách thông báo mới nhất hiển thị trên trang Notifications.
  notifications: Notification[]

  // Danh sách media vừa được thêm qua sự kiện TrackAdded.
  recentMediaItems: MediaItem[]

  // Danh sách playlist dùng để cập nhật Library và PlaylistDetail realtime.
  playlists: Playlist[]

  // Trạng thái kết nối SignalR để UI có thể hiển thị badge hoặc thông báo lỗi.
  connectionStatus: SignalRConnectionStatus

  // Số thông báo chưa đọc tính từ danh sách realtime.
  unreadCount: number

  // Thông báo lỗi gần nhất nếu kết nối SignalR gặp sự cố.
  lastError: string | null

  // Cập nhật trạng thái kết nối SignalR.
  setConnectionStatus: (status: SignalRConnectionStatus, message?: string) => void

  // Gán toàn bộ danh sách thông báo từ API hoặc từ store khác.
  setNotifications: (notifications: Notification[]) => void

  // Thêm một thông báo realtime vào đầu danh sách.
  addNotification: (notification: Notification) => void

  // Thêm hoặc cập nhật một media item trong danh sách realtime.
  upsertMediaItem: (mediaItem: MediaItem) => void

  // Gán toàn bộ danh sách playlist từ API hoặc từ store khác.
  setPlaylists: (playlists: Playlist[]) => void

  // Thêm mới hoặc cập nhật một playlist trong danh sách realtime.
  upsertPlaylist: (playlist: Playlist) => void

  // Đánh dấu một thông báo đã đọc.
  markNotificationAsRead: (notificationId: number) => void

  // Đánh dấu tất cả thông báo đã đọc.
  markAllNotificationsAsRead: () => void

  // Xóa thông báo lỗi gần nhất.
  clearLastError: () => void

  // Đặt lại toàn bộ dữ liệu realtime khi logout hoặc phiên làm việc kết thúc.
  resetRealtimeState: () => void
}

// Kiểm tra value có phải object hợp lệ hay không.
function isObject(value: unknown): value is Record<string, unknown> {
  // SignalR payload có thể là object hoặc null, nên cần kiểm tra rõ ràng.
  return typeof value === 'object' && value !== null
}

// Kiểm tra object có đúng hình dạng Notification không.
function isNotification(value: unknown): value is Notification {
  // Notification từ backend phải có id, message và createdAt.
  return isObject(value)
    && typeof value.id === 'number'
    && typeof value.message === 'string'
    && typeof value.createdAt === 'string'
}

// Chuẩn hóa payload ReceiveNotification thành Notification.
function normalizeNotification(payload: unknown): Notification {
  // Nếu backend gửi trực tiếp một chuỗi, ta tạo thông báo fallback để UI vẫn hiển thị.
  if (typeof payload === 'string') {
    return {
      id: Date.now(),
      type: 'info',
      message: payload,
      isRead: false,
      createdAt: new Date().toISOString(),
    }
  }

  // Nếu backend bọc notification trong object, lấy object con trước.
  if (isObject(payload)) {
    const nestedPayload = payload.notification ?? payload.data ?? payload

    // Nếu backend gửi message dạng chuỗi, tạo Notification đầy đủ để UI dùng được.
    if (typeof nestedPayload === 'string') {
      return {
        id: Date.now(),
        type: 'info',
        message: nestedPayload,
        isRead: false,
        createdAt: new Date().toISOString(),
      }
    }

    // Nếu object con đúng dạng Notification, trả về trực tiếp.
    if (isNotification(nestedPayload)) {
      return nestedPayload
    }

    // Nếu backend chỉ gửi message, tạo Notification đầy đủ để UI dùng được.
    if (isObject(nestedPayload) && typeof nestedPayload.message === 'string') {
      return {
        id: Date.now(),
        type: typeof nestedPayload.type === 'string' ? nestedPayload.type : 'info',
        message: nestedPayload.message,
        isRead: false,
        createdAt: typeof nestedPayload.createdAt === 'string' ? nestedPayload.createdAt : new Date().toISOString(),
      }
    }
  }

  // Nếu payload không hợp lệ, vẫn tạo thông báo để app không crash.
  return {
    id: Date.now(),
    type: 'info',
    message: 'Có thông báo mới từ hệ thống.',
    isRead: false,
    createdAt: new Date().toISOString(),
  }
}

// Kiểm tra object có đúng hình dạng MediaItem không.
function isMediaItem(value: unknown): value is MediaItem {
  // MediaItem cần các trường tối thiểu để card media hiển thị đúng.
  return isObject(value)
    && typeof value.id === 'number'
    && typeof value.title === 'string'
    && typeof value.artist === 'string'
    && (value.type === 'audio' || value.type === 'video')
    && typeof value.duration === 'number'
    && typeof value.ownerId === 'string'
    && typeof value.createdAt === 'string'
}

// Chuẩn hóa payload TrackAdded thành MediaItem.
function normalizeMediaItem(payload: unknown): MediaItem | null {
  // Nếu payload không phải object thì không đủ dữ liệu để cập nhật UI.
  if (!isObject(payload)) {
    return null
  }

  // Backend có thể bọc track trong mediaItem.
  if (isMediaItem(payload.mediaItem)) {
    return payload.mediaItem
  }

  // Một số backend có thể đặt tên trường là track.
  if (isMediaItem(payload.track)) {
    return payload.track
  }

  // Nếu payload là MediaItem trực tiếp thì dùng luôn.
  if (isMediaItem(payload)) {
    return payload
  }

  // Nếu không đúng kiểu, bỏ qua để tránh đưa dữ liệu lỗi vào store.
  return null
}

// Kiểm tra object có đúng hình dạng Playlist không.
function isPlaylist(value: unknown): value is Playlist {
  // Playlist cần id, name và tracks để các trang Library/Detail hiển thị đúng.
  return isObject(value)
    && typeof value.id === 'number'
    && typeof value.name === 'string'
    && typeof value.isPublic === 'boolean'
    && typeof value.ownerId === 'string'
    && Array.isArray(value.tracks)
    && typeof value.createdAt === 'string'
}

// Chuẩn hóa payload PlaylistUpdated thành Playlist.
function normalizePlaylist(payload: unknown): Playlist | null {
  // Nếu payload không phải object thì không đủ dữ liệu để cập nhật UI.
  if (!isObject(payload)) {
    return null
  }

  // Backend có thể bọc playlist trong object con.
  if (isPlaylist(payload.playlist)) {
    return payload.playlist
  }

  // Một số backend có thể đặt tên trường là data.
  if (isPlaylist(payload.data)) {
    return payload.data
  }

  // Nếu payload là Playlist trực tiếp thì dùng luôn.
  if (isPlaylist(payload)) {
    return payload
  }

  // Nếu không đúng kiểu, bỏ qua để tránh đưa dữ liệu lỗi vào store.
  return null
}

// Tạo Zustand store để lưu dữ liệu realtime.
export const useRealtimeStore = create<RealtimeState>((set) => ({
  // Khởi tạo danh sách thông báo rỗng.
  notifications: [],

  // Khởi tạo danh sách media realtime rỗng.
  recentMediaItems: [],

  // Khởi tạo danh sách playlist realtime rỗng.
  playlists: [],

  // Ban đầu chưa có kết nối SignalR.
  connectionStatus: 'idle',

  // Ban đầu chưa có thông báo chưa đọc realtime.
  unreadCount: 0,

  // Ban đầu chưa có lỗi SignalR.
  lastError: null,

  // Cập nhật trạng thái kết nối SignalR.
  setConnectionStatus: (status, message) => {
    // Khi chuyển trạng thái, lưu message để UI có thể hiển thị lỗi rõ ràng.
    set({ connectionStatus: status, lastError: message ?? null })
  },

  // Gán toàn bộ danh sách thông báo từ API.
  setNotifications: (notifications) => {
    // Tính lại unreadCount để badge luôn đúng với dữ liệu mới.
    set({
      notifications,
      unreadCount: notifications.filter(notification => !notification.isRead).length,
    })
  },

  // Thêm thông báo realtime vào đầu danh sách.
  addNotification: (notification) => {
    // Đưa thông báo mới lên đầu và tránh trùng thông báo nếu backend gửi lại cùng id.
    set(state => {
      // Tìm thông báo cũ nếu đã tồn tại trong store.
      const currentNotification = state.notifications.find(item => item.id === notification.id)

      // Nếu đã tồn tại thì cập nhật bản mới, nếu chưa tồn tại thì thêm vào đầu danh sách.
      const nextNotifications = currentNotification
        ? state.notifications.map(item => item.id === notification.id ? notification : item)
        : [notification, ...state.notifications]

      // Tính lại unreadCount theo trạng thái cũ và trạng thái mới của thông báo.
      const wasUnread = Boolean(currentNotification && !currentNotification.isRead)
      const isNowUnread = !notification.isRead
      const nextUnreadCount = wasUnread && isNowUnread
        ? state.unreadCount
        : wasUnread && !isNowUnread
          ? Math.max(0, state.unreadCount - 1)
          : !wasUnread && isNowUnread
            ? state.unreadCount + 1
            : state.unreadCount

      // Giữ tối đa 100 thông báo để UI không bị nặng.
      return {
        notifications: nextNotifications.slice(0, 100),
        unreadCount: nextUnreadCount,
      }
    })
  },

  // Thêm hoặc cập nhật media item trong danh sách realtime.
  upsertMediaItem: (mediaItem) => {
    // Nếu media đã tồn tại thì cập nhật bản mới nhất và đưa lên đầu danh sách.
    set(state => {
      // Lọc bỏ bản cũ nếu có để tránh trùng media.
      const nextMediaItems = state.recentMediaItems.filter(item => item.id !== mediaItem.id)

      // Đưa media mới lên đầu và giữ tối đa 20 mục gần đây.
      return { recentMediaItems: [mediaItem, ...nextMediaItems].slice(0, 20) }
    })
  },

  // Gán toàn bộ danh sách playlist từ API.
  setPlaylists: (playlists) => {
    // Ghi đè danh sách playlist khi tải lại dữ liệu từ backend.
    set({ playlists })
  },

  // Thêm mới hoặc cập nhật playlist realtime.
  upsertPlaylist: (playlist) => {
    // Nếu playlist đã tồn tại thì cập nhật, nếu chưa tồn tại thì thêm vào đầu danh sách.
    set(state => {
      // Tìm vị trí playlist cũ trong danh sách.
      const existingIndex = state.playlists.findIndex(item => item.id === playlist.id)

      // Nếu chưa có playlist thì thêm mới vào đầu danh sách.
      if (existingIndex === -1) {
        return { playlists: [playlist, ...state.playlists] }
      }

      // Nếu đã có playlist thì tạo mảng mới để React/Zustand nhận biết state thay đổi.
      const nextPlaylists = [...state.playlists]
      nextPlaylists[existingIndex] = playlist

      // Trả về danh sách playlist đã được cập nhật.
      return { playlists: nextPlaylists }
    })
  },

  // Đánh dấu một thông báo đã đọc.
  markNotificationAsRead: (notificationId) => {
    // Chỉ cập nhật đúng thông báo được chọn để không làm mất dữ liệu khác.
    set(state => {
      // Tìm thông báo cũ để biết có cần giảm unreadCount hay không.
      const currentNotification = state.notifications.find(item => item.id === notificationId)

      // Trả về danh sách đã cập nhật và unreadCount chính xác.
      return {
        notifications: state.notifications.map(notification => (
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )),
        unreadCount: currentNotification && !currentNotification.isRead
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      }
    })
  },

  // Đánh dấu tất cả thông báo đã đọc.
  markAllNotificationsAsRead: () => {
    // Duyệt toàn bộ thông báo và đặt isRead về true.
    set(state => ({
      notifications: state.notifications.map(notification => ({ ...notification, isRead: true })),
      unreadCount: 0,
    }))
  },

  // Xóa thông báo lỗi gần nhất.
  clearLastError: () => {
    // Đặt lastError về null để UI không còn hiển thị lỗi cũ.
    set({ lastError: null })
  },

  // Đặt lại toàn bộ dữ liệu realtime.
  resetRealtimeState: () => {
    // Xóa dữ liệu realtime để tránh thông tin của user cũ còn tồn tại.
    set({
      notifications: [],
      recentMediaItems: [],
      playlists: [],
      connectionStatus: 'idle',
      unreadCount: 0,
      lastError: null,
    })
  },
}))

// Export hàm chuẩn hóa để SignalRService dùng được mà không cần export kiểu phức tạp.
export const normalizeRealtimePayload = {
  // Chuẩn hóa thông báo realtime.
  notification: normalizeNotification,

  // Chuẩn hóa media realtime.
  mediaItem: normalizeMediaItem,

  // Chuẩn hóa playlist realtime.
  playlist: normalizePlaylist,
}
