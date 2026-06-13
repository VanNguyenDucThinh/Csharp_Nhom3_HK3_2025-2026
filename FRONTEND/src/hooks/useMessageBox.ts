import { useState } from 'react'

// Khai báo các loại thông báo mà app có thể hiển thị.
export type MessageBoxType = 'error' | 'success' | 'info'

// Khai báo cấu trúc dữ liệu của một thông báo.
export type MessageBoxState = {
  // Loại thông báo: lỗi, thành công hoặc thông tin.
  type: MessageBoxType

  // Nội dung thông báo hiển thị cho user.
  message: string
} | null

export function useMessageBox() {
  // State này lưu thông báo đang hiển thị.
  // Nếu bằng null nghĩa là không có thông báo nào đang hiển thị.
  const [messageBox, setMessageBox] = useState<MessageBoxState>(null)

  // Hàm dùng để hiển thị thông báo.
  const showMessage = (type: MessageBoxType, message: string) => {
    // Gán thông báo mới vào state để MessageBox có dữ liệu hiển thị.
    setMessageBox({ type, message })
  }

  // Hàm dùng để đóng thông báo.
  const hideMessage = () => {
    // Gán null để gỡ MessageBox khỏi màn hình.
    setMessageBox(null)
  }

  // Trả về state và các hàm điều khiển thông báo.
  return {
    messageBox,
    showMessage,
    hideMessage,
  }
}