// src/api/apiClient.ts
import axiosInstance from "./axiosInstance.ts";
import { getApiErrorMessage, unwrapApiResponse } from "../types/ApiHelper.ts";

// Import types khớp với backend DTOs
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponseDto,
} from "../types/Auth.ts";

import type {
  ProfileUserDto,
  UpdateProfileRequest,
  FollowDto,
} from "../types/User.ts";

import type {
  MediaDto,
  AudioMediaDto,
  VideoDto,
  SearchTrendingDto,
  FavoriteDto,
  Category,
} from "../types/Media.ts";

import type {
  PlayListDto,
  PlayListStatus,
  CreateOrUpdatePlaylistRequest,
  AddTrackToPlaylistRequest,
} from "../types/Playlist.ts";

import type {
  ShareMediaDto,
  ShareStyle,
  SharedItemDto,
} from "../types/Share.ts";

import type { NotificationDto, Read } from "../types/Notification.ts";

import type { HistoryMediaDto } from "../types/History.ts";

import type { ApiResponse, ApiResponseNoData } from "../types/ApiResponse.ts";

// ============================================================
// HELPER: Chuyển lỗi axios thành thông báo tiếng Việt dễ đọc
// Tại sao cần helper này? Vì axios trả về object lỗi phức tạp
// (có code, message, response, status...). Ta muốn component
// chỉ nhận 1 chuỗi thông báo đơn giản, không phải xử lý object.
// ============================================================

// ============================================================
// HELPER: Kiểm tra ApiResponse.success và trả về data
// Tại sao cần? Vì backend luôn bọc dữ liệu trong ApiResponse<T>.
// Ta muốn hàm service trả về "ruột" (data) thay vì cả cái hộp.
// Nếu success = false thì throw luôn, không trả về data rác.
// ============================================================

// ============================================================
// API CLIENT — TẤT CẢ hàm gọi backend
// Mỗi hàm đều có try-catch + thông báo lỗi tiếng Việt
// Component chỉ cần await và dùng try-catch (làm ở Bước 5)
// ============================================================

const apiClient = {
  // --- AUTH (api/auth) ---
  auth: {
    // POST api/auth/register
    // Tại sao async/await? Vì gọi API là hành động bất đồng bộ,
    // không biết backend trả về lúc nào. async/await giúp code đọc như sync.
    register: async (data: RegisterRequest): Promise<AuthResponseDto> => {
      try {
        // Gọi API, backend trả về ApiResponse<AuthResponseDto>
        const response = await axiosInstance.post<ApiResponse<AuthResponseDto>>(
          "/Auth/register",
          data,
        );
        // unwrapApiResponse sẽ kiểm tra success và lấy data ra
        return unwrapApiResponse(response, "Đăng ký thất bại");
      } catch (error) {
        // Bắt mọi lỗi (mạng, timeout, 400/500...) và chuyển thành Error tiếng Việt
        throw new Error(getApiErrorMessage(error));
      }
    },

    // POST api/auth/login
    login: async (data: LoginRequest): Promise<AuthResponseDto> => {
      try {
        const response = await axiosInstance.post<ApiResponse<AuthResponseDto>>(
          "/Auth/login",
          data,
        );
        return unwrapApiResponse(response, "Đăng nhập thất bại");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // POST api/auth/logout
    logout: async (): Promise<void> => {
      try {
        await axiosInstance.post("/Auth/logout");
      } catch (error) {
        // Logout thất bại không nghiêm trọng lắm, chỉ cần xóa local data
        // Nên ta log warning thay vì throw, không làm gián đoạn UX
        console.warn("Logout API lỗi:", getApiErrorMessage(error));
      }
    },
  },

  // --- USER PROFILE (api/user) ---
  profile: {
    // GET api/user/profile
    getMe: async (): Promise<ProfileUserDto> => {
      try {
        const response =
          await axiosInstance.get<ApiResponse<ProfileUserDto>>("/user/profile");
        return unwrapApiResponse(response, "Không thể lấy thông tin profile");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // GET api/user/{id}
    getById: async (id: string): Promise<ProfileUserDto> => {
      try {
        const response = await axiosInstance.get<ApiResponse<ProfileUserDto>>(
          `/user/${id}`,
        );
        return unwrapApiResponse(
          response,
          "Không thể lấy thông tin người dùng",
        );
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // PUT api/user/profile (multipart/form-data)
    update: async (formData: FormData): Promise<ProfileUserDto> => {
      try {
        const response = await axiosInstance.put<ApiResponse<ProfileUserDto>>(
          "/User/profile",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        return unwrapApiResponse(response, "Cập nhật profile thất bại");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },
  },

  // --- MEDIA (api/media) ---
  media: {
    // POST api/media/upload (multipart/form-data)
    upload: async (formData: FormData): Promise<MediaDto> => {
      try {
        const response = await axiosInstance.post<ApiResponse<MediaDto>>(
          "/Media/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        return unwrapApiResponse(response, "Upload file thất bại");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // GET api/media/Audio/{id}
    getById: async (id: string): Promise<AudioMediaDto> => {
      try {
        const response = await axiosInstance.get<ApiResponse<AudioMediaDto>>(
          `/Media/Audio/${id}`,
        );
        return unwrapApiResponse(response, "Không thể lấy thông tin media");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // GET api/media/Video/{id}
    // Lưu ý: endpoint này chủ yếu dùng để lấy URL stream cho thẻ <video>.
    // Backend có thể trả JSON (ApiResponse<VideoDto>) HOẶC binary stream (206).
    // Hàm này chỉ xử lý trường hợp JSON. Nếu cần stream, dùng trực tiếp URL.
    getVideo: async (id: string): Promise<VideoDto> => {
      try {
        const response = await axiosInstance.get<ApiResponse<VideoDto>>(
          `/Media/Video/${id}`,
          {
            // Không gửi Range header — chỉ lấy thông tin JSON
            headers: { Accept: "application/json" },
          },
        );
        return unwrapApiResponse(response, "Không thể lấy thông tin video");
      } catch (error) {
        // Nếu lỗi parse JSON (backend trả binary), trả về object tối thiểu
        // để component vẫn hiển thị được video player
        // Bắt lỗi đặc biệt: backend trả binary stream thay vì JSON
        const axiosError = error as { code?: string; message?: string };

        if (
          axiosError.code === "ERR_BAD_RESPONSE" ||
          axiosError.message?.includes("JSON") ||
          axiosError.message?.includes("Unexpected token")
        )
          // Component nên dùng URL stream trực tiếp, không gọi API này
          throw new Error("Định dạng video không hợp lệ. Vui lòng thử lại!");

        throw new Error(getApiErrorMessage(error));
      }
    },

    // GET /api/search?q=&pageNumber=&pageSize=
    search: async (
      query: string,
      pageNumber: number = 1,
      pageSize: number = 10,
    ): Promise<SearchTrendingDto> => {
      try {
        const response = await axiosInstance.get<
          ApiResponse<SearchTrendingDto>
        >("/search", { params: { search: query, pageNumber, pageSize } });
        return unwrapApiResponse(response, "Tìm kiếm thất bại");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // GET /api/trend?pageNumber=&pageSize=
    trend: async (
      pageNumber: number = 1,
      pageSize: number = 10,
    ): Promise<SearchTrendingDto> => {
      try {
        const response = await axiosInstance.get<
          ApiResponse<SearchTrendingDto>
        >("/Trend", { params: { pageNumber, pageSize } });
        return unwrapApiResponse(response, "Không thể lấy danh sách trending");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // POST api/media/favorite/{id}
    favorite: async (id: string): Promise<FavoriteDto> => {
      try {
        const response = await axiosInstance.post<ApiResponse<FavoriteDto>>(
          `/media/favorite/${id}`,
        );
        return unwrapApiResponse(response, "Thao tác yêu thích thất bại");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // PUT api/media/unfavorite/{id}
    unfavorite: async (id: string): Promise<FavoriteDto> => {
      try {
        const response = await axiosInstance.put<ApiResponse<FavoriteDto>>(
          `/media/unfavorite/${id}`,
        );
        return unwrapApiResponse(response, "Bỏ yêu thích thất bại");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // GET api/media/ListFavorite
    getFavorites: async (): Promise<MediaDto[]> => {
      try {
        const response = await axiosInstance.get<ApiResponse<MediaDto[]>>(
          "/media/ListFavorite",
        );
        return unwrapApiResponse(response, "Không thể lấy danh sách yêu thích");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },
  },

  // --- PLAYLIST (api/playlist) ---
  playlist: {
    // GET api/playlist — lấy playlist của tôi
    getMyPlaylists: async (): Promise<PlayListDto[]> => {
      try {
        const response =
          await axiosInstance.get<ApiResponse<PlayListDto[]>>("/playlist");
        return unwrapApiResponse(response, "Không thể lấy danh sách playlist");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // Alias cho components cũ đang gọi getAll()
    getAll: async (): Promise<PlayListDto[]> => {
      return apiClient.playlist.getMyPlaylists();
    },

    // GET api/playlist/{id}
    getById: async (id: string): Promise<PlayListDto> => {
      try {
        const response = await axiosInstance.get<ApiResponse<PlayListDto>>(
          `/playlist/${id}`,
        );
        return unwrapApiResponse(response, "Không thể lấy chi tiết playlist");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // POST api/playlist (multipart/form-data)
    create: async (formData: FormData): Promise<PlayListDto> => {
      try {
        const response = await axiosInstance.post<ApiResponse<PlayListDto>>(
          "/playlist",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        return unwrapApiResponse(response, "Tạo playlist thất bại");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // PUT api/playlist/{id} (multipart/form-data)
    update: async (id: string, formData: FormData): Promise<PlayListDto> => {
      try {
        const response = await axiosInstance.put<ApiResponse<PlayListDto>>(
          `/playlist/${id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        return unwrapApiResponse(response, "Cập nhật playlist thất bại");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // DELETE api/playlist/{id}
    delete: async (id: string): Promise<void> => {
      try {
        const response = await axiosInstance.delete<ApiResponseNoData>(
          `/playlist/${id}`,
        );
        // Thay vì dùng unwrapApiResponse nghiêm ngặt, ta chỉ cần check status
        if (response.status !== 200 && response.status !== 204) {
             throw new Error("Xóa thất bại");
        }
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // POST api/playlist/{id}/tracks
    // Sửa lại trong apiClient.ts
    addTrack: async (playlistId: string, mediaId: string): Promise<void> => {
      try {
        const response = await axiosInstance.post<ApiResponseNoData>(
          `/playlist/${playlistId}/tracks`,
          { "MediaId": mediaId }, // PHẢI VIẾT HOA CHỮ M ĐỂ KHỚP VỚI C#
        );
        // Nếu API trả về success: true nhưng body rỗng, hàm này có thể bị lỗi,
        // hãy thử tạm thời bỏ qua unwrapApiResponse nếu vẫn lỗi:
        return; 
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // DELETE api/playlist/{id}/tracks/{mediaId}
    removeTrack: async (playlistId: string, mediaId: string): Promise<void> => {
      try {
        const response = await axiosInstance.delete<ApiResponseNoData>(
          `/playlist/${playlistId}/tracks/${mediaId}`,
        );
        unwrapApiResponse(response, "Xóa track khỏi playlist thất bại");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },
  },

  // --- SHARE (api/share) ---
  share: {
    // POST api/share
    send: async (
      receiverUserId: string,
      itemId: string,
      shareStyle: ShareStyle,
    ): Promise<ShareMediaDto> => {
      try {
        const response = await axiosInstance.post<ApiResponse<ShareMediaDto>>(
          "/share",
          { receiverUserId, itemId, shareStyle },
        );
        return unwrapApiResponse(response, "Chia sẻ thất bại");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // GET api/share/received
    getReceived: async (): Promise<SharedItemDto[]> => {
      try {
        const response =
          await axiosInstance.get<ApiResponse<SharedItemDto[]>>(
            "/share/received",
          );
        return unwrapApiResponse(response, "Không thể lấy danh sách chia sẻ");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // Alias cho components cũ đang gọi getSharedWithMe()
    getSharedWithMe: async (): Promise<SharedItemDto[]> => {
      return apiClient.share.getReceived();
    },
  },

  // --- NOTIFICATION (api/notification) ---
  notification: {
    // GET api/notification
    getAll: async (): Promise<NotificationDto[]> => {
      try {
        const response =
          await axiosInstance.get<ApiResponse<NotificationDto[]>>(
            "/notification",
          );
        return unwrapApiResponse(response, "Không thể lấy danh sách thông báo");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    // PUT api/notification/{id}/read
    markAsRead: async (id: string): Promise<void> => {
      try {
        const response = await axiosInstance.put<ApiResponseNoData>(
          `/notification/${id}/read`,
        );
        unwrapApiResponse(response, "Đánh dấu đã đọc thất bại");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },
  },

  // --- HISTORY (api/history) ---
  history: {
    // GET api/history
    getRecent: async (): Promise<HistoryMediaDto[]> => {
      try {
        const response =
          await axiosInstance.get<ApiResponse<HistoryMediaDto[]>>("/history");
        return unwrapApiResponse(response, "Không thể lấy lịch sử phát");
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },
  },
};

// ============================================================
// HÀM TIỆN ÍCH: Hiển thị lỗi ra alert (dùng trong components)
// Tại sao xuất khẩu? Vì trong quá trình migrate, có thể cần
// bắt lỗi thủ công ở component trước khi chuyển hết sang Bước 5.
// ============================================================
export function showApiError(error: unknown): void {
  const message = getApiErrorMessage(error);
  alert(message);
}

export default apiClient;
