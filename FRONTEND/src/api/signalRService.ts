// src/api/signalRService.ts
import * as signalR from '@microsoft/signalr'
import { useMessageBoxStore } from '../stores/messageBoxStore'
import { normalizeRealtimePayload, useRealtimeStore } from '../stores/realtimeStore'

// Đọc URL Hub SignalR từ biến môi trường để dễ đổi port backend.
const HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL || 'http://localhost:5000/hubs/notifications'

// Giới hạn số lần thử reconnect để app không lặp vô hạn khi backend tắt lâu.
const MAX_RECONNECT_ATTEMPTS = 8

// Giới hạn thời gian chờ giữa các lần reconnect để tránh chờ quá lâu.
const MAX_RECONNECT_DELAY_MS = 30000

// Tạo dãy delay tăng theo cấp số nhân: 1s, 2s, 4s, 8s...
const RECONNECT_DELAYS = Array.from(
  { length: MAX_RECONNECT_ATTEMPTS },
  (_, index) => Math.min(MAX_RECONNECT_DELAY_MS, 1000 * Math.pow(2, index)),
)

// Biến lưu connection SignalR hiện tại.
let connection: signalR.HubConnection | null = null

// Biến đánh dấu connect đang chạy để tránh gọi start nhiều lần cùng lúc.
let isConnecting = false

// Biến đánh dấu app còn muốn tự động reconnect hay không.
let shouldAutoReconnect = true

// Lấy thông báo lỗi dễ đọc từ object Error hoặc giá trị bất kỳ.
function getErrorMessage(error: unknown, fallbackMessage: string): string {
  // Nếu lỗi là Error thì lấy message rõ ràng.
  if (error instanceof Error) {
    return error.message
  }

  // Nếu lỗi là chuỗi thì dùng trực tiếp chuỗi đó.
  if (typeof error === 'string') {
    return error
  }

  // Nếu không biết dạng lỗi thì dùng fallbackMessage để UI luôn có nội dung hiển thị.
  return fallbackMessage
}

// Hiển thị lỗi realtime ra Zustand store và MessageBox toàn cục.
function showRealtimeError(message: string, error?: unknown): void {
  // Cập nhật trạng thái store để UI biết SignalR đang lỗi.
  useRealtimeStore.getState().setConnectionStatus('error', message)

  // Hiển thị MessageBox toàn cục để user biết lỗi mà không cần prop.
  useMessageBoxStore.getState().showMessage('error', message)

  // In lỗi ra console để developer kiểm tra nguyên nhân.
  console.error(message, error)
}

// Xây dựng HubConnection mới với token, reconnect và logging.
function buildConnection(): signalR.HubConnection {
  // Lấy token hiện tại từ localStorage vì backend cần xác thực người dùng.
  const token = localStorage.getItem('token')

  // Tạo connection mới theo cấu hình SignalR của Microsoft.
  const newConnection = new signalR.HubConnectionBuilder()
    // Gắn URL Hub và token để backend nhận đúng user đang đăng nhập.
    .withUrl(HUB_URL, {
      accessTokenFactory: () => token ?? '',
    })
    // Bật auto-reconnect với delay tăng dần theo cấp số nhân.
    .withAutomaticReconnect(RECONNECT_DELAYS)
    // Ghi log ở mức Warning để không quá nhiều log nhưng vẫn thấy lỗi quan trọng.
    .configureLogging(signalR.LogLevel.Warning)
    // Build object connection hoàn chỉnh.
    .build()

  // Đăng ký các handler nhận dữ liệu realtime từ backend.
  registerEventHandlers(newConnection)

  // Đăng ký các handler theo dõi trạng thái kết nối.
  registerConnectionHandlers(newConnection)

  // Trả về connection đã cấu hình đầy đủ.
  return newConnection
}

// Dừng connection cũ nếu nó đang tồn tại và chưa bị ngắt.
async function stopExistingConnection(): Promise<void> {
  // Nếu chưa có connection thì không cần dừng.
  if (!connection) {
    return
  }

  // Nếu connection đã ở trạng thái Disconnected thì không cần gọi stop.
  if (connection.state === signalR.HubConnectionState.Disconnected) {
    connection = null
    return
  }

  // Dừng connection cũ trong try-catch để lỗi mạng không làm crash app.
  try {
    await connection.stop()
  } catch (error) {
    // Ghi lỗi dừng connection ra console để debug.
    console.error('Không thể dừng SignalR connection cũ:', error)
  } finally {
    // Đặt connection về null để lần connect sau tạo connection mới sạch sẽ.
    connection = null
  }
}

// Xử lý payload ReceiveNotification từ backend.
function handleReceiveNotification(payload: unknown): void {
  try {
    // Chuẩn hóa payload để chắc chắn UI luôn nhận object Notification hợp lệ.
    const notification = normalizeRealtimePayload.notification(payload)

    // Thêm thông báo mới vào Zustand store để trang Notifications cập nhật realtime.
    useRealtimeStore.getState().addNotification(notification)

    // Hiển thị MessageBox nhỏ để user thấy thông báo mới ngay lập tức.
    useMessageBoxStore.getState().showMessage('info', notification.message)
  } catch (error) {
    // Nếu xử lý thông báo lỗi, app vẫn không crash mà chỉ hiện lỗi rõ ràng.
    showRealtimeError('Không thể xử lý thông báo realtime.', error)
  }
}

// Xử lý payload TrackAdded từ backend.
function handleTrackAdded(payload: unknown): void {
  try {
    // Chuẩn hóa payload để lấy MediaItem đúng kiểu.
    const mediaItem = normalizeRealtimePayload.mediaItem(payload)

    // Nếu payload hợp lệ thì cập nhật store realtime.
    if (mediaItem) {
      // Thêm hoặc cập nhật media trong danh sách realtime.
      useRealtimeStore.getState().upsertMediaItem(mediaItem)

      // Hiển thị MessageBox thành công để user biết media mới đã về.
      useMessageBoxStore.getState().showMessage('success', `Bài hát/video "${mediaItem.title}" đã được thêm.`)
    }
  } catch (error) {
    // Nếu xử lý TrackAdded lỗi, app vẫn không crash.
    showRealtimeError('Không thể xử lý sự kiện TrackAdded.', error)
  }
}

// Xử lý payload PlaylistUpdated từ backend.
function handlePlaylistUpdated(payload: unknown): void {
  try {
    // Chuẩn hóa payload để lấy Playlist đúng kiểu.
    const playlist = normalizeRealtimePayload.playlist(payload)

    // Nếu payload hợp lệ thì cập nhật store realtime.
    if (playlist) {
      // Thêm hoặc cập nhật playlist trong danh sách realtime.
      useRealtimeStore.getState().upsertPlaylist(playlist)

      // Hiển thị MessageBox thông tin để user biết playlist đã thay đổi.
      useMessageBoxStore.getState().showMessage('info', `Playlist "${playlist.name}" đã được cập nhật.`)
    }
  } catch (error) {
    // Nếu xử lý PlaylistUpdated lỗi, app vẫn không crash.
    showRealtimeError('Không thể xử lý sự kiện PlaylistUpdated.', error)
  }
}

// Đăng ký các handler nhận event realtime từ backend.
function registerEventHandlers(hubConnection: signalR.HubConnection): void {
  // Lắng nghe thông báo mới từ backend.
  hubConnection.on('ReceiveNotification', handleReceiveNotification)

  // Lắng nghe sự kiện có bài hát/video mới được thêm.
  hubConnection.on('TrackAdded', handleTrackAdded)

  // Lắng nghe sự kiện playlist được thêm hoặc cập nhật.
  hubConnection.on('PlaylistUpdated', handlePlaylistUpdated)
}

// Đăng ký các handler theo dõi trạng thái connection SignalR.
function registerConnectionHandlers(hubConnection: signalR.HubConnection): void {
  // Khi bắt đầu reconnect, cập nhật trạng thái để UI biết đang khôi phục kết nối.
  hubConnection.onreconnecting(error => {
    // Tạo message rõ ràng cho user khi mạng hoặc backend tạm thời mất kết nối.
    const message = error
      ? 'Mất kết nối SignalR. Đang kết nối lại...'
      : 'Mất kết nối SignalR. Đang kết nối lại...'

    // Cập nhật store realtime để các component biết trạng thái reconnecting.
    useRealtimeStore.getState().setConnectionStatus('reconnecting', message)
  })

  // Khi reconnect thành công, cập nhật trạng thái connected.
  hubConnection.onreconnected(connectionId => {
    // Tạo message thông báo connection đã khôi phục.
    const message = `SignalR đã kết nối lại. ConnectionId: ${connectionId}`

    // Cập nhật store realtime để UI biết kết nối đã ổn định.
    useRealtimeStore.getState().setConnectionStatus('connected', message)

    // Hiển thị MessageBox thành công để user biết realtime đã hoạt động lại.
    useMessageBoxStore.getState().showMessage('success', message)
  })

  // Khi connection đóng hoàn toàn, cập nhật trạng thái disconnected.
  hubConnection.onclose(error => {
    // Nếu app vẫn muốn reconnect mà backend tự ngắt, lưu lỗi để debug.
    if (shouldAutoReconnect && error) {
      useRealtimeStore.getState().setConnectionStatus('disconnected', error.message)
    }

    // Nếu app không còn muốn reconnect, đặt trạng thái disconnected rõ ràng.
    if (!shouldAutoReconnect) {
      useRealtimeStore.getState().setConnectionStatus('disconnected', 'SignalR đã ngắt kết nối.')
    }
  })
}

// Object service cung cấp các hàm kết nối/ngắt kết nối SignalR.
const signalRService = {
  // Kết nối tới Hub SignalR sau khi user đăng nhập thành công.
  connect: async (): Promise<void> => {
    // Lấy token hiện tại từ localStorage.
    const token = localStorage.getItem('token')

    // Nếu chưa có token thì chưa kết nối SignalR vì backend chưa xác thực được user.
    if (!token) {
      useRealtimeStore.getState().setConnectionStatus('disconnected', 'Chưa đăng nhập nên không thể kết nối SignalR.')
      return
    }

    // Nếu đang connect hoặc đã connected thì không gọi start trùng.
    if (
      isConnecting
      || connection?.state === signalR.HubConnectionState.Connected
      || connection?.state === signalR.HubConnectionState.Connecting
      || connection?.state === signalR.HubConnectionState.Reconnecting
    ) {
      return
    }

    // Đánh dấu connect đang chạy để tránh gọi connect đồng thời nhiều lần.
    isConnecting = true

    // Cho phép SignalR tự động reconnect nếu mất kết nối.
    shouldAutoReconnect = true

    // Cập nhật trạng thái connecting để UI biết đang khởi tạo realtime.
    useRealtimeStore.getState().setConnectionStatus('connecting')

    try {
      // Dừng connection cũ nếu có để tránh dùng connection bị lỗi.
      await stopExistingConnection()

      // Tạo connection mới với token và cấu hình reconnect.
      connection = buildConnection()

      // Bắt đầu kết nối tới backend Hub.
      await connection.start()

      // Khi start thành công, cập nhật trạng thái connected.
      useRealtimeStore.getState().setConnectionStatus('connected', 'SignalR đã kết nối.')

      // Xóa lỗi cũ để UI không hiển thị lỗi không còn đúng.
      useRealtimeStore.getState().clearLastError()
    } catch (error) {
      // Nếu backend sập hoặc mạng lỗi, app không crash mà hiển thị MessageBox.
      const message = getErrorMessage(error, 'Không thể kết nối SignalR. Vui lòng kiểm tra backend.')
      showRealtimeError(message, error)
    } finally {
      // Dù thành công hay thất bại, đánh dấu connect đã kết thúc.
      isConnecting = false
    }
  },

  // Ngắt kết nối SignalR khi logout hoặc khi app không còn cần realtime.
  disconnect: async (): Promise<void> => {
    // Không cho phép auto-reconnect nữa vì user đã chủ động ngắt kết nối.
    shouldAutoReconnect = false

    // Nếu không có connection thì không cần làm gì.
    if (!connection) {
      return
    }

    try {
      // Dừng connection trong try-catch để lỗi mạng không làm crash app.
      if (connection.state !== signalR.HubConnectionState.Disconnected) {
        await connection.stop()
      }
    } catch (error) {
      // Nếu stop lỗi, vẫn hiển thị lỗi rõ ràng cho developer/user.
      const message = getErrorMessage(error, 'Không thể ngắt kết nối SignalR.')
      showRealtimeError(message, error)
    } finally {
      // Đặt connection về null để giải phóng tài nguyên.
      connection = null

      // Reset toàn bộ dữ liệu realtime khi ngắt kết nối.
      useRealtimeStore.getState().resetRealtimeState()
    }
  },

  // Kiểm tra connection hiện tại có đang connected không.
  isConnected: (): boolean => {
    // Trả về true chỉ khi connection đang ở trạng thái Connected.
    return connection?.state === signalR.HubConnectionState.Connected
  },

  // Trả về trạng thái kết nối hiện tại để UI có thể hiển thị.
  getConnectionState: (): signalR.HubConnectionState | null => {
    // Nếu chưa có connection thì trả về null.
    return connection?.state ?? null
  },
}

// Export service để MainLayout hoặc các hook có thể gọi.
export default signalRService
