import { create } from 'zustand'
import type { MessageBoxState, MessageBoxType } from '../hooks/useMessageBox'

// Store toàn cục dùng để SignalRService có thể hiển thị MessageBox mà không cần truyền prop.
type MessageBoxStore = {
  // Thông báo đang hiển thị trên màn hình.
  messageBox: MessageBoxState

  // Hiển thị một thông báo mới.
  showMessage: (type: MessageBoxType, message: string) => void

  // Ẩn thông báo hiện tại.
  hideMessage: () => void

  // Xóa thông báo hiện tại.
  clearMessage: () => void
}

// Tạo Zustand store cho MessageBox toàn cục.
export const useMessageBoxStore = create<MessageBoxStore>((set) => ({
  // Ban đầu không có thông báo nào được hiển thị.
  messageBox: null,

  // Hiển thị thông báo bằng cách gán type và message vào store.
  showMessage: (type, message) => {
    // Set state mới để component MessageBox toàn cục render.
    set({ messageBox: { type, message } })
  },

  // Ẩn thông báo bằng cách trả messageBox về null.
  hideMessage: () => {
    // Set null để MessageBox không còn hiển thị.
    set({ messageBox: null })
  },

  // Xóa thông báo tương tự hideMessage để tên gọi rõ nghĩa hơn ở service.
  clearMessage: () => {
    // Set null để gỡ thông báo khỏi UI.
    set({ messageBox: null })
  },
}))
