# 🚀 Checklist Kết Nối Backend API Thật

## 📋 Danh Sách Công Việc

### 1️⃣ **Cấu Hình Environment**

- [ ] Mở file `.env` và xác nhận backend URL
  ```
  VITE_API_BASE_URL=http://localhost:5124/api
  VITE_SIGNALR_HUB_URL=http://localhost:5124/hubs/notifications
  ```
- [ ] Nếu backend chạy ở port khác, cập nhật số port (hỏi nhóm backend)
- [ ] Lưu file `.env` sau khi chỉnh sửa

### 2️⃣ **Bỏ MOCK Mode - Pages**

#### ✅ `src/pages/Login.tsx`

**Trước:**

```typescript
const USE_MOCK = true;
```

**Sau:**

```typescript
const USE_MOCK = false;
```

**Lý do:** Khi `USE_MOCK = false`, component sẽ gọi `apiClient.auth.login()` thay vì tạo mock token.

---

#### ✅ `src/pages/Library.tsx`

**Trước:**

```typescript
const USE_MOCK = true;
```

**Sau:**

```typescript
const USE_MOCK = false;
```

**Lý do:** Sẽ fetch playlists từ backend `apiClient.playlist.getAll()` và media từ `apiClient.media.trend()`.

---

#### ✅ `src/pages/Upload.tsx`

**Trước:**

```typescript
const USE_MOCK = true;
```

**Sau:**

```typescript
const USE_MOCK = false;
```

**Lý do:** Sẽ upload file thật đến `apiClient.media.uploadMedia()`.

---

#### ℹ️ `src/pages/Home.tsx`

**Hiện tại:** `const USE_MOCK = false` ✅ (đã đúng)

- Không cần thay đổi

---

### 3️⃣ **Kiểm Tra Service Layer**

- [ ] Mở `src/api/apiClient.ts`
- [ ] Xác nhận tất cả endpoint paths khớp với backend:
  ```typescript
  // Ví dụ: Kiểm tra các route chính
  /auth/gilno / // POST
    auth /
    register / // POST
    playlist / // GET
    media /
    ListFavorite / // GET
    media /
    favorite /
    { id }; // POST
  ```
- [ ] Nếu thấy `"Không thể lấy..."` error, kiểm tra url path có đúng không

---

### 4️⃣ **Xác Nhận Components Mock Data**

Các component này dùng mock **nhưng không có `USE_MOCK` flag** (được để demo):

- [ ] **`src/components/layout/Sidebar.tsx`** - Dùng `mockPlaylists` để hiển thị UI
  - ✅ OK để giữ (dùng để demo giao diện)
  - Nếu muốn dynamic: Sau này có thể replace bằng API call

- [ ] **`src/components/layout/FriendActivity.tsx`** - Dùng `mockFriends`
  - ✅ OK để giữ (chưa có backend friend feature)

- [ ] **`src/components/layout/RightPanel.tsx`** - Dùng mock "Currently Playing"
  - ✅ OK để giữ (liên kết với player state)

---

## 🔧 Hướng Dẫn Fix Chi Tiết

### **Bước 1: Sửa Login.tsx**

```bash
# Tìm dòng 7:
const USE_MOCK = true

# Thay thành:
const USE_MOCK = false

# Lưu file
```

### **Bước 2: Sửa Library.tsx**

```bash
# Tìm dòng 9:
const USE_MOCK = true

# Thay thành:
const USE_MOCK = false
```

### **Bước 3: Sửa Upload.tsx**

```bash
# Tìm dòng 7:
const USE_MOCK = true;

# Thay thành:
const USE_MOCK = false;
```

### **Bước 4: Khởi động ứng dụng**

```bash
# Terminal 1 - Backend (C# project)
cd BACKEND/TuneVault
dotnet run

# Terminal 2 - Frontend
cd FRONTEND
npm run dev
```

---

## ✅ Test từng tính năng

### 🔐 **Test Login**

1. Mở `http://localhost:5173/login`
2. Nhập email/username và password (thật từ backend)
3. Nếu đăng nhập thành công → Chuyển tới Home
4. ⚠️ Nếu lỗi: Kiểm tra backend API `/auth/login` có chạy không

### 📚 **Test Library**

1. Đăng nhập thành công
2. Click "Thư viện của bạn" ở Sidebar
3. Kiểm tra:
   - ✅ "Playlist của tôi" hiển thị (từ backend)
   - ✅ "Bài tôi đã tải lên" hiển thị (từ backend)
4. ⚠️ Nếu rỗng: Thêm dữ liệu trong backend database

### ❤️ **Test Favorites (Bước 5)**

1. Đăng nhập thành công
2. Click icon ❤️ ở TopHeader
3. Kiểm tra:
   - ✅ Loading spinner hiện khi fetch
   - ✅ Danh sách yêu thích hiển thị (hoặc cảnh báo "Chưa có")
   - ✅ Nếu lỗi: Hiển thị ErrorMessage + nút "Thử lại"
4. ⚠️ Nếu lỗi CORS: Kiểm tra backend có allow CORS không

### 📤 **Test Upload (nếu frontend ready)**

1. Đăng nhập
2. Click "Tải lên" ở TopHeader
3. Chọn file âm thanh
4. Nhập metadata (tên, ca sĩ, etc.)
5. Click "Tải lên"
6. ⚠️ Nếu lỗi: Kiểm tra `/media/upload` endpoint

---

## 🐛 Troubleshooting

| Lỗi                   | Nguyên Nhân              | Giải Pháp                                  |
| --------------------- | ------------------------ | ------------------------------------------ |
| ❌ `Network Error`    | Backend không chạy       | Kiểm tra `npm run start` hoặc `dotnet run` |
| ❌ `404 Not Found`    | Endpoint path sai        | Kiểm tra backend controller routes         |
| ❌ `CORS Error`       | Backend không allow CORS | Thêm CORS policy trong `Program.cs`        |
| ❌ `401 Unauthorized` | Token hết hạn hoặc sai   | Đăng nhập lại hoặc kiểm tra token time     |
| ❌ `Empty List`       | Dữ liệu chưa có trong DB | Thêm test data vào database                |

---

## 📝 Notes

- Tất cả endpoint path phải **trùng chính xác** với backend controller route
- Nếu backend port khác `5124`, **cập nhật `.env`** ngay
- `Service layer` (`apiClient.ts`) đã wrap error handling, nên mọi lỗi sẽ hiển thị thân thiện
- Đừng quên restart app khi thay đổi `.env`

---

## ✨ Sau khi tất cả pass

- [ ] Commit code: `git add . && git commit -m "Remove mock mode, integrate real API"`
- [ ] Push branch: `git push origin HappyDiddy`
- [ ] Chuẩn bị cho bước 6 (nếu có)
