import type { MessageBoxType } from '../hooks/useMessageBox'

// Kiểm tra value có phải object hợp lệ hay không.
function isRecord(value: unknown): value is Record<string, unknown> {
  // Chỉ nhận object không null để tránh lỗi khi đọc property.
  return typeof value === 'object' && value !== null
}

// Trả về thông báo lỗi dễ đọc từ nhiều dạng lỗi khác nhau.
function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  // Nếu lỗi là object Error thì kiểm tra thêm response của axios.
  if (error instanceof Error) {
    // AxiosError có thể chứa response.data.message từ backend C#.
    const axiosError = error as Error & { response?: { data?: unknown } }

    // Nếu backend trả object message thì ưu tiên hiển thị message đó.
    if (isRecord(axiosError.response?.data)) {
      const data = axiosError.response.data

      // Ưu tiên trường message vì backend thường trả { message: "..." }.
      if (typeof data.message === 'string') {
        return data.message
      }

      // Một số API trả title thay cho message.
      if (typeof data.title === 'string') {
        return data.title
      }
    }

    // Nếu không có message từ backend thì dùng message của Error.
    return error.message
  }

  // Nếu backend hoặc axios trả về chuỗi thì dùng trực tiếp chuỗi đó.
  if (typeof error === 'string') {
    return error
  }

  // Nếu không có message cụ thể thì dùng fallbackMessage để UI luôn có nội dung.
  return fallbackMessage
}

export async function safeApiCall<T>(
  // Hàm gọi API thật, ví dụ: () => apiClient.media.search(query).
  apiCall: () => Promise<T>,

  // Thông báo mặc định nếu không lấy được lỗi chi tiết.
  fallbackMessage: string,

  // Hàm hiển thị lỗi ra MessageBox toàn cục.
  showMessage: (type: MessageBoxType, message: string) => void,
): Promise<T | null> {
  try {
    // Gọi API trong try để backend sập hoặc mất mạng không làm crash app.
    const result = await apiCall()

    // Trả về dữ liệu API nếu gọi thành công.
    return result
  } catch (error) {
    // Lấy thông báo lỗi rõ ràng để hiển thị cho user.
    const finalMessage = getApiErrorMessage(error, fallbackMessage)

    // Hiển thị lỗi cho user bằng MessageBox toàn cục.
    showMessage('error', finalMessage)

    // In lỗi ra console để developer kiểm tra nguyên nhân.
    console.error(fallbackMessage, error)

    // Trả về null để page biết API thất bại và vẫn render giao diện an toàn.
    return null
  }
}
