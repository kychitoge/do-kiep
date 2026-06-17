# Độ Kiếp Trận — Universal Decoder Tool

Tool web **một file** (`index.html`): dán chuỗi nghi encode/mã hóa → tự thử giải → xem kết quả khả dĩ trên card. Không cần chọn “Dạng 1/2/3/4” như bản cũ.

Phù hợp: debug payload, gỡ config legacy, CTF nhẹ, người không rà thuật toán.

## Chạy nhanh

Mở `index.html` trong trình duyệt (hoặc serve static). Không cần build.

## Test

```bash
npm install
npm test
```

Golden cases: [`test-cases.md`](test-cases.md)

## Tính năng hiện tại (MVP decode)

- Tự nhận diện Hex / Base64 / Base64URL
- Giải không key: Hex, Base64, URL-decode, ROT (25 shift)
- Giải có key: AES — thử CBC/ECB, PKCS7/ZeroPadding, passphrase/raw key, IV zero/prepended
- Xếp hạng kết quả + UI card, copy từng kết quả

## Định hướng tiếp theo

| # | Hướng | Mô tả ngắn |
|---|--------|------------|
| **0** | Hoàn thiện MVP | ✅ Thông báo lỗi, gợi ý, nút ẩn/hiện mật khẩu |
| **1** | Encode 4 cấp (0–3) | User nhập data + pass, chọn cấp mã hóa — không cần biết AES/Hex |
| **2** | Mở rộng decode | Thêm Gzip, DES/RC4, JWT, cảnh báo hash, giải nhiều lớp |

Chi tiết: [`ho-so-du-an.md`](ho-so-du-an.md) · Ticket: [`backlog.md`](backlog.md)

## Cấu trúc repo

| File | Vai trò |
|------|---------|
| `index.html` | App chính |
| `test.js` | Test tự động (mirror logic app) |
| `test-cases.md` | Golden regression |
| `backlog.md` | Ticket & trạng thái |
| `context.md` | Quy tắc cho agent |
| `ho-so-du-an.md` | Hồ sơ & roadmap |
