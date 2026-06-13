export default function CompactPlayer() {
  return (
    <div className="h-16 border-t border-gray-800 bg-[#181818] px-3">
      <div className="flex h-full items-center justify-between gap-3">
        {/* Thông tin bài hát rút gọn cho màn hình nhỏ. */}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-white">
            SoundHelix Song 1
          </div>

          <div className="truncate text-xs text-gray-400">
            Bản Nhạc Thử Nghiệm
          </div>
        </div>

        {/* Nút play/pause rút gọn. */}
        <button className="rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-black">
          ▶
        </button>
      </div>
    </div>
  )
}