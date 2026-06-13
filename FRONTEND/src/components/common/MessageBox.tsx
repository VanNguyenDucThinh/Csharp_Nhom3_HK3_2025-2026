import type { MessageBoxType } from '../../hooks/useMessageBox'

type MessageBoxProps = {
  type: MessageBoxType
  message: string
  onClose: () => void
}

const styleByType = {
  error: {
    borderColor: '#ef4444',
    backgroundColor: '#7f1d1d',
    color: '#ffffff',
  },
  success: {
    borderColor: '#22c55e',
    backgroundColor: '#14532d',
    color: '#ffffff',
  },
  info: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
  },
}

export default function MessageBox({ type, message, onClose }: MessageBoxProps) {
  // Chọn màu hiển thị theo loại thông báo.
  const selectedStyle = styleByType[type]

  return (
    <div
      className="fixed right-4 top-4 z-[60] max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg"
      style={{
        borderColor: selectedStyle.borderColor,
        backgroundColor: selectedStyle.backgroundColor,
        color: selectedStyle.color,
      }}
      role="alert"
    >
      <div className="flex items-start justify-between gap-4">
        <p>{message}</p>

        <button
          className="font-bold"
          onClick={onClose}
          aria-label="Đóng thông báo"
        >
          ×
        </button>
      </div>
    </div>
  )
}