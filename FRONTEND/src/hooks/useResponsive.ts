import { useEffect, useState } from 'react'

export type ResponsiveSize = 'mobile' | 'tablet' | 'desktop'

export function useResponsive(): ResponsiveSize {
  // Lưu kích thước màn hình hiện tại vào state.
  const [size, setSize] = useState<ResponsiveSize>('desktop')

  useEffect(() => {
    // Hàm này kiểm tra chiều rộng cửa sổ và phân loại thiết bị.
    const updateSize = () => {
      if (window.innerWidth < 640) {
        setSize('mobile')
      } else if (window.innerWidth < 1024) {
        setSize('tablet')
      } else {
        setSize('desktop')
      }
    }

    // Chạy ngay lần đầu để có giá trị đúng.
    updateSize()

    // Lắng nghe sự kiện resize để cập nhật lại kích thước.
    window.addEventListener('resize', updateSize)

    // Dọn listener khi component bị hủy.
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return size
}