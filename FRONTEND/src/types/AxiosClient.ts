// ====================================================================
// FILE: axiosClient.ts
// MỤC ĐÍCH: Tạo 1 "client" axios DUY NHẤT, dùng chung cho TOÀN BỘ app.
// Lý do dùng 1 client chung: mọi request đều cần baseURL giống nhau và
// cần tự động gắn token đăng nhập — viết 1 lần ở đây, khỏi lặp lại
// ở từng file service phía sau.
// ====================================================================

import axios from "axios";

// BASE_URL: địa chỉ gốc của backend (ví dụ: "https://localhost:5001").
//
// Tại sao lấy từ biến môi trường (import.meta.env) thay vì viết thẳng chuỗi
// vào code? Vì khi đưa app lên server thật (production), địa chỉ backend
// sẽ khác với lúc chạy ở máy bạn (local). Đặt trong file ".env" giúp ta
// đổi địa chỉ mà KHÔNG cần sửa code, KHÔNG cần build lại logic.
//
// LƯU Ý: Dòng dưới đây dùng cú pháp của Vite (import.meta.env.VITE_...).
// Nếu project bạn dùng Create React App, hãy đổi thành:
//   const BASE_URL = process.env.REACT_APP_API_BASE_URL ?? "https://localhost:5001";
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://localhost:5124";

// Tạo 1 instance axios riêng (không dùng axios mặc định toàn cục),
// để cấu hình (baseURL, timeout, interceptor...) chỉ ảnh hưởng tới
// các request đi qua "axiosClient" này, không ảnh hưởng tới nơi khác.
export const axiosClient = axios.create({
  baseURL: BASE_URL,

  // timeout: nếu sau 10 giây backend không trả lời, axios sẽ tự huỷ request
  // và báo lỗi (rơi vào nhánh "error.request" ở apiHelper.ts).
  // Tại sao cần timeout: tránh user phải chờ vô thời hạn khi mạng/backend có vấn đề.
  timeout: 10000,
});

// "Interceptor" nghĩa là đoạn code sẽ tự động chạy TRƯỚC khi request được gửi đi.
// Ở đây ta dùng nó để tự gắn header "Authorization" (kèm token đăng nhập)
// vào MỌI request, để các file service phía sau không cần tự viết lại
// đoạn lấy token này 28 lần (1 lần cho mỗi API).
axiosClient.interceptors.request.use((config) => {
  // Lấy token đã lưu lúc đăng nhập thành công (xem lại AuthResponseDto.token).
  const token = localStorage.getItem("accessToken");

  // Chỉ gắn header Authorization nếu CÓ token.
  // Với các API không cần đăng nhập (Auth = No trong bảng hợp đồng API),
  // có gắn thêm header này cũng không gây lỗi, backend sẽ tự bỏ qua.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});