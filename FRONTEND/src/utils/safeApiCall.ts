import type { MessageBoxType } from '../hooks/useMessageBox'

export async function safeApiCall<T>(
  // Hàm gọi API thật, ví dụ: () => apiClient.media.search(query)
  apiCall: () => Promise<T>,

  // Thông báo mặc định nếu không lấy được lỗi chi tiết.
  fallbackMessage: string,

  // Hàm hiển thị lỗi ra MessageBox.
  showMessage: (type: MessageBoxType, message: string) => void,
): Promise<T | null> {
  try {
    // Gọi API trong try để nếu lỗi thì app không bị crash.
    const result = await apiCall()

    // Trả về dữ liệu API nếu gọi thành công.
    return result
  } catch (error) {
    // Lấy thông báo lỗi nếu JavaScript có object Error.
    const errorMessage = error instanceof Error ? error.message : fallbackMessage

    // Nếu lỗi không có message rõ ràng thì dùng fallbackMessage.
    const finalMessage = errorMessage || fallbackMessage

    // Hiển thị lỗi cho user bằng MessageBox.
    showMessage('error', finalMessage)

    // In lỗi ra console để developer debug.
    console.error(fallbackMessage, error)

    // Trả về null để page biết API thất bại.
    return null
  }
}