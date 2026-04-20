Trang admin cho dự án.

## Ghi chú cập nhật liên quan Search (learning-app)

- Đã tích hợp tính năng **vẽ Kanji để tìm kiếm** tại trang `learning-app/src/pages/SearchPage.tsx`.
- Thư viện sử dụng: **KanjiCanvas** (client-side), đặt tại:
  - `learning-app/public/vendor/kanjicanvas/kanji-canvas.min.js`
  - `learning-app/public/vendor/kanjicanvas/ref-patterns.js`
- Dialog vẽ Kanji: `learning-app/src/components/search/KanjiDrawDialog.tsx`.
- Người dùng có thể vẽ, nhận diện danh sách ký tự gợi ý, rồi chọn ký tự để điền trực tiếp vào ô tìm kiếm.
