// src/pages/FavoriteSongs.tsx
import { useEffect, useState } from "react";
import apiClient from "../api/apiClient.ts";
import type { MediaDto } from "../types/Media.ts";
import { ErrorMessage } from "../components/layout/ErrorMessage.tsx";
import { LoadingSpinner } from "../components/layout/Loadingspinner.tsx";

/**
 * Component này hiển thị danh sách bài hát yêu thích của người dùng.
 *
 * 3 trạng thái cần có:
 * 1) Loading: đang tải dữ liệu từ backend.
 * 2) Success: dữ liệu load xong và hiển thị danh sách.
 * 3) Error: có lỗi backend/mạng, hiển thị thông báo thân thiện + nút thử lại.
 */
export default function FavoriteSongs() {
  const [favoriteTracks, setFavoriteTracks] = useState<MediaDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hàm tải danh sách yêu thích.
  const loadFavorites = async () => {
    // Trước khi gọi API, reset lại trạng thái lỗi và bật loading.
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Gọi service layer để lấy dữ liệu yêu thích.
      const favorites = await apiClient.media.getFavorites();
      setFavoriteTracks(favorites);
    } catch (error) {
      // Trường hợp lỗi: backend sập, mạng mất hoặc phản hồi không hợp lệ.
      // Dùng Error.message từ apiHelper đã chuẩn hoá.
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
      }
    } finally {
      // Bật/tắt loading ở cuối, dù thành công hay lỗi.
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Tự động gọi API khi component mount lần đầu.
    loadFavorites();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 text-white sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-white">
          Danh sách bài hát yêu thích
        </h1>
      </header>

      {/* 1) Loading */}
      {isLoading && <LoadingSpinner />}

      {/* 2) Error */}
      {!isLoading && errorMessage && (
        <ErrorMessage message={errorMessage} onRetry={loadFavorites} />
      )}

      {/* 3) Success */}
      {!isLoading && !errorMessage && (
        <div className="space-y-4">
          {favoriteTracks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/60 p-8 text-center text-zinc-300">
              <p className="text-lg font-medium text-white">
                Bạn chưa có bài hát yêu thích nào.
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Hãy yêu thích một bài để nó xuất hiện tại đây.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteTracks.map((track) => (
                <article
                  key={track.id}
                  className="rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-4 shadow-sm shadow-black/20 transition hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-zinc-900"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-2xl text-emerald-400">
                      🎵
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-lg font-semibold text-white">
                        {track.title}
                      </h2>
                      <p className="mt-1 truncate text-sm text-zinc-400">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-zinc-300">
                    <div className="flex items-center justify-between rounded-2xl bg-zinc-900/80 px-3 py-2">
                      <span>Category</span>
                      <span>{track.category}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-zinc-900/80 px-3 py-2">
                      <span>Người upload</span>
                      <span className="truncate text-right text-zinc-400">
                        {track.owner}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
