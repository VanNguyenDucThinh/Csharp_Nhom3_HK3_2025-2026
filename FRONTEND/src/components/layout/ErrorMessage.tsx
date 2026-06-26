// ====================================================================
// FILE: ErrorMessage.tsx
// MỤC ĐÍCH: Hiển thị thông báo lỗi cho người dùng.
//
// LƯU Ý CHO NGƯỜI MỚI: Trong ứng dụng Desktop (C# WinForms/WPF), ta hay
// dùng MessageBox.Show("..."). Trong web (React), KHÔNG dùng alert()
// vì nó chặn toàn bộ trang và trông cũ kỹ. Thay vào đó, ta tạo 1
// "ô thông báo" (banner) ngay trong giao diện — đây chính là cách làm
// tương đương với MessageBox, nhưng đúng chuẩn web.
// ====================================================================

// "Props" là dữ liệu mà component cha truyền vào cho component con này.
interface ErrorMessageProps {
  // message: nội dung lỗi cần hiển thị (lấy từ Error.message mà service throw ra).
  message: string;

  // onRetry: hàm sẽ được gọi khi người dùng bấm nút "Thử lại".
  // Đánh dấu "?" vì không phải lúc nào cũng cần nút thử lại
  // (ví dụ: lỗi validate form thì không cần "thử lại", chỉ cần sửa input).
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    // Dùng class Tailwind: nền đỏ nhạt, viền đỏ, chữ đỏ đậm -> người dùng
    // nhận biết ngay đây là thông báo LỖI (không cần đọc nội dung mới hiểu).
    <div className="flex items-center justify-between gap-4 rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-300">
      <span>{message}</span>

      {/* Chỉ hiển thị nút "Thử lại" nếu component cha có truyền hàm onRetry vào. */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-md bg-red-500/20 px-3 py-1 font-medium text-red-200 hover:bg-red-500/30"
        >
          Thử lại
        </button>
      )}
    </div>
  );
}