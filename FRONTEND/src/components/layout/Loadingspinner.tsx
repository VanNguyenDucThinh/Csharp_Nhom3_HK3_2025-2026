// ====================================================================
// FILE: LoadingSpinner.tsx
// MỤC ĐÍCH: Hiển thị vòng xoay khi đang tải dữ liệu.
//
// TẠI SAO CẦN COMPONENT NÀY: nếu không hiện gì trong lúc đợi API trả lời,
// người dùng sẽ thấy màn hình trống, tưởng app bị treo. Hiện vòng xoay
// giúp người dùng biết "app đang làm việc, cứ chờ thêm chút".
// ====================================================================

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-sm text-zinc-400">
      {/* Vòng tròn xoay được tạo bằng class "animate-spin" có sẵn của Tailwind,
          không cần viết animation CSS thủ công. */}
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-emerald-500" />
      <span>Đang tải dữ liệu...</span>
    </div>
  );
}