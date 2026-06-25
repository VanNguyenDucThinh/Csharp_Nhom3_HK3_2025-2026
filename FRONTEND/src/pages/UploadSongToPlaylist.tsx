// src/pages/UploadSongToPlaylist.tsx
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import apiClient from "../api/apiClient.ts";
import { type MediaDto, Category } from "../types/Media.ts";

// Định nghĩa kiểu Props truyền vào Component
interface UploadSongProps {
  playlistId: string; // ID của playlist hiện tại để biết cần thêm nhạc vào đâu
  onUploadSuccess: (track: MediaDto) => void; // Callback nhận track mới upload để cập nhật UI
}

export const UploadSongToPlaylist: React.FC<UploadSongProps> = ({ playlistId, onUploadSuccess }) => {
  // --- STATE QUẢN LÝ TRẠNG THÁI UI/UX ---
  
  // State lưu trữ file nhạc được chọn từ máy tính
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // State lưu tên bài hát do người dùng nhập
  const [songTitle, setSongTitle] = useState<string>('');
  
  // State lưu tên nghệ sĩ (mặc định "Unknown" nếu để trống)
  const [songArtist, setSongArtist] = useState<string>('');
  
  // State lưu thể loại nhạc (mặc định Pop)
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.Pop);
  
  // State quản lý trạng thái đang gửi dữ liệu lên server
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // State lưu thông báo lỗi để hiển thị UI
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // State lưu thông báo thành công
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- HÀM XỬ LÝ KHI NGƯỜI DÙNG CHỌN FILE ---
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Kiểm tra xem người dùng có chọn file hợp lệ không
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
      // Kiểm tra đuôi file được chấp nhận (.mp3, .wav, .flac, .aac, .ogg)
      const allowedExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      // Nếu đuôi file không nằm trong danh sách cho phép, báo lỗi và dừng
      if (!allowedExtensions.includes(fileExtension)) {
        setErrorMessage(`Định dạng file không hỗ trợ. Vui lòng chọn file MP3, WAV, FLAC, AAC hoặc OGG.`);
        setSelectedFile(null);
        return;
      }
      
      // Lưu file hợp lệ vào state
      setSelectedFile(file);
      setErrorMessage(null);
      
      // Tự động điền tên bài hát từ tên file (bỏ phần đuôi mở rộng)
      if (!songTitle) {
        setSongTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  // --- HÀM GỬI DỮ LIỆU LÊN BACKEND ---
  const handleFormSubmit = async (event: FormEvent) => {
    // Chặn reload trang khi submit form
    event.preventDefault();

    // Kiểm tra tính hợp lệ dữ liệu đầu vào
    if (!songTitle.trim() || !selectedFile) {
      setErrorMessage('Vui lòng điền đầy đủ tên bài hát và chọn file nhạc hợp lệ.');
      return;
    }

    // Bật trạng thái loading để UI biết cần hiển thị spinner và khóa nút
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // === BƯỚC 1: TẠO FORMDATA VÀ UPLOAD FILE LÊN BACKEND ===
      // Sử dụng FormData vì cần truyền file nhị phân (không dùng được JSON thường)
      const uploadForm = new FormData();
      
      // Gắn các trường backend yêu cầu (theo MediaController.UploadFile)
      uploadForm.append('mediaFile', selectedFile); // File nhạc chính - key "mediaFile"
      uploadForm.append('title', songTitle); // Tên bài hát - key "title"
      uploadForm.append('artist', songArtist || 'Unknown'); // Tên nghệ sĩ - key "artist"
      uploadForm.append('description', ''); // Mô tả (có thể để trống) - key "description"
      uploadForm.append('category', selectedCategory.toString()); // Thể loại - key "category" dạng string số
      
      // Gọi API upload qua apiClient
      const uploadResult = await apiClient.media.upload(uploadForm) as MediaDto;

      // === BƯỚC 2: THÊM MEDIA VÀO PLAYLIST ===
      // Sử dụng id trả về từ API upload để thêm vào playlist
      await apiClient.playlist.addTrack(playlistId, uploadResult.id);

      // Hiển thị thông báo thành công
      setSuccessMessage(`"${songTitle}" đã được thêm vào playlist!`);
      
      // Reset form về trạng thái trống
      setSongTitle('');
      setSongArtist('');
      setSelectedFile(null);
      
      // Callback thông báo cho component cha cập nhật lại danh sách
      // Truyền luôn thông tin track để PlaylistDetail cập nhật state mà không cần gọi API
      onUploadSuccess(uploadResult);

    } catch (error) {
      // === XỬ LÝ LỖI KHI BACKEND SAP/NETWORK LỖI ===
      // Kiểm tra lỗi là instance của Error để lấy message
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        // Lỗi không xác định (hiếm gặp) - hiện thông báo chung
        setErrorMessage('Không thể kết nối tới Server. Vui lòng kiểm tra lại đường truyền hoặc Backend sập.');
      }
    } finally {
      // Kết thúc loading dù thành công hay thất bại
      setIsLoading(false);
    }
  };

  // --- GIAO DIỆN (UI) ---
  return (
    <div className="p-6 bg-[#181818] rounded-lg text-white max-w-md mx-auto mt-6 border border-zinc-800">
      <h3 className="text-xl font-bold mb-4">Tải bài hát lên Playlist</h3>

      {/* Hiển thị lỗi nếu có - dùng div thật không phải alert */}
      {errorMessage && (
        <div className="p-3 mb-4 text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-md">
          {errorMessage}
        </div>
      )}

      {/* Hiển thị thành công */}
      {successMessage && (
        <div className="p-3 mb-4 text-sm text-green-400 bg-green-950/50 border border-green-800 rounded-md">
          ✓ {successMessage}
        </div>
      )}

      {/* FORM NHẬP THÔNG TIN */}
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Trường tên bài hát */}
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-400">Tên bài hát *</label>
          <input
            type="text"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            placeholder="Nhập tên bài hát..."
            className="w-full p-2.5 bg-[#282828] border border-transparent rounded-md focus:outline-none focus:border-green-500 text-sm"
            required
          />
        </div>

        {/* Trường tên nghệ sĩ */}
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-400">Nghệ sĩ (tùy chọn)</label>
          <input
            type="text"
            value={songArtist}
            onChange={(e) => setSongArtist(e.target.value)}
            placeholder="Nhập tên nghệ sĩ..."
            className="w-full p-2.5 bg-[#282828] border border-transparent rounded-md focus:outline-none focus:border-green-500 text-sm"
          />
        </div>

        {/* Trường thể loại */}
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-400">Thể loại</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(Number(e.target.value) as Category)}
            className="w-full p-2.5 bg-[#282828] border border-transparent rounded-md focus:outline-none focus:border-green-500 text-sm"
          >
            <option value={Category.Pop}>Pop</option>
            <option value={Category.Rock}>Rock</option>
            <option value={Category.Jazz}>Jazz</option>
            <option value={Category.Classical}>Classical</option>
            <option value={Category.HipHop}>Hip Hop</option>
            <option value={Category.Remix}>Remix</option>
            <option value={Category.Buon}>Buồn</option>
          </select>
        </div>

        {/* Trường chọn file âm thanh */}
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-400">Chọn file âm thanh</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
          />
        </div>

        {/* NÚT SUBMIT */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2.5 rounded-full font-bold text-black transition text-sm ${
            isLoading ? 'bg-zinc-600 cursor-not-allowed' : 'bg-[#1ed760] hover:scale-105'
          }`}
        >
          {isLoading ? 'Đang tải lên...' : 'Tải lên ngay'}
        </button>
      </form>
    </div>
  );
};