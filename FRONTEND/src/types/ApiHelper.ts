// ====================================================================
// FILE: apiHelper.ts
// MỤC ĐÍCH: Hàm dùng CHUNG để "dịch" mọi lỗi gọi API thành 1 chuỗi
// thông báo dễ hiểu, để hiển thị cho người dùng (ở Bước 4 sẽ dùng chuỗi
// này để hiện thông báo/MessageBox).
//
// TẠI SAO CẦN FILE NÀY: lỗi gọi API có thể đến từ NHIỀU nguyên nhân khác
// nhau (backend báo lỗi có cấu trúc, mất mạng, backend sập...). Nếu mỗi
// service tự viết logic đọc lỗi riêng, code sẽ lặp lại 28 lần và dễ
// hiển thị thông báo không nhất quán. Tập trung vào 1 hàm giúp toàn app
// luôn hiển thị lỗi theo cùng 1 kiểu.
// ====================================================================

import axios from "axios";
import type { ApiResponse } from "./ApiResponse.ts";

export function getErrorMessage(error: unknown): string {
  // axios.isAxiosError(...) giúp kiểm tra CHẮC CHẮN đây là lỗi do axios
  // tạo ra (lỗi mạng/lỗi HTTP), để tránh nhầm với lỗi JavaScript thông thường.
  if (axios.isAxiosError(error)) {
    // TRƯỜNG HỢP 1: Backend CÓ phản hồi, nhưng phản hồi đó là lỗi
    // (ví dụ: status 400 - sai dữ liệu, 401 - chưa đăng nhập, 404 - không tìm thấy,
    // 500 - lỗi server).
    if (error.response) {
      // Cố gắng đọc field "message" mà backend đã trả về trong ApiResponse,
      // vì đây là thông báo CỤ THỂ NHẤT (ví dụ: "Email đã được sử dụng").
      const rawData = error.response.data

      // TRƯỜNG HỢP 1b: Backend trả về KHÔNG PHẢI JSON (ví dụ HTML error page, plain text)
      // Tại sao cần? Vì khi backend .NET bị lỗi chưa catch, nó có thể trả về
      // trang HTML mặc định thay vì ApiResponse JSON. typeof kiểm tra nhanh chóng.
      if (typeof rawData === 'string') return rawData // Trả về nguyên văn để người dùng thấy nội dung lỗi

      const data = rawData as ApiResponse<unknown> | undefined;

      if (data?.message) return data.message;

      // Nếu backend không trả message rõ ràng, dùng thông báo chung kèm mã lỗi,
      // để người dùng (hoặc bạn lúc debug) biết hướng tìm lỗi.
      return `Lỗi từ server (mã ${error.response.status}). Vui lòng thử lại sau.`;
    }

    // TRƯỜNG HỢP 2: Request đã được GỬI ĐI nhưng KHÔNG nhận được phản hồi nào.
    // Đây chính là tình huống "Backend sập hoặc mất mạng" mà bạn lo lắng ban đầu.
    if (error.request) {
      return "Không thể kết nối tới server. Vui lòng kiểm tra mạng hoặc thử lại sau.";
    }
  }

  // TRƯỜNG HỢP 3: Lỗi không liên quan tới việc gọi API (hiếm gặp, ví dụ lỗi
  // logic JavaScript khác). Vẫn trả về 1 thông báo an toàn, không để app crash.
  return "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
}

// Thêm vào CUỐI file ApiHelper.ts:
export function unwrapApiResponse<T>(
  response: { data: ApiResponse<T> },
  defaultMessage: string
): T {
  const apiResponse = response.data
  if (!apiResponse.success || !apiResponse.data) {
    throw new Error(apiResponse.message || defaultMessage)
  }
  return apiResponse.data as T
}