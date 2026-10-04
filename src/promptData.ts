export interface SectionItem {
  id: string;
  roman: string;
  title: string;
  content: string;
}

export const MASTER_PROMPT_TITLE = "CÂU LỆNH TẠO WEB APP SIÊU CHI TIẾT (MASTER PROMPT): SỔ TAY THI ĐUA LỚP 6B3 - TRƯỜNG THCS CHÂU THÀNH (GVCN: NGUYỄN THỊ HỒNG LOAN)";

export const MASTER_PROMPT_SECTIONS: SectionItem[] = [
  {
    id: "sec-1",
    roman: "I",
    title: "TỔNG QUAN DỰ ÁN & BỐI CẢNH PHÁT TRIỂN",
    content: `Bạn là một Kỹ sư Phần mềm Full-Stack Senior kiêm Kiến trúc sư Hệ thống phần mềm giáo dục.
Nhiệm vụ của bạn là lập trình hoàn thiện một Web Application thực tế có tên:
"SỔ TAY THI ĐUA LỚP 6B3 (Smart Emulation Handbook)" dành cho Trường THCS Châu Thành, do Giáo viên Chủ nhiệm (GVCN) Cô NGUYỄN THỊ HỒNG LOAN phụ trách (Niên khóa 2026 - 2027).

Ứng dụng được thiết kế nhằm số hóa toàn diện công tác quản lý nề nếp kỷ luật, chấm điểm cờ đỏ, theo dõi vi phạm nội quy, ghi nhận việc tốt và tính điểm phong trào thi đua hàng ngày - hàng tuần giữa 4 Tổ và 45 học sinh của lớp 6B3.

Hệ thống phải thay thế hoàn toàn sổ tay giấy truyền thống vốn dễ thất lạc, khó tổng hợp số liệu và thiếu tính minh bạch. Mọi dữ liệu phải trực quan, sinh động, truyền cảm hứng thi đua sôi nổi cho lứa tuổi học sinh lớp 6 THCS.`
  },
  {
    id: "sec-2",
    roman: "II",
    title: "MỤC TIÊU CỐT LÕI & TRIẾT LÝ SẢN PHẨM",
    content: `1. ĐƠN GIẢN HÓA THAO TÁC: Ban cán sự (Lớp trưởng, 4 Tổ trưởng) và GVCN Nguyễn Thị Hồng Loan có thể ghi nhận 1 lỗi vi phạm hoặc 1 điểm tốt chỉ trong tối đa 3 lần chạm (dưới 5 giây) ngay trên smartphone cá nhân.
2. MINH BẠCH & THỜI GIAN THỰC (REALTIME): Mọi điểm cộng/trừ phải cập nhật ngay vào bảng tổng sắp và lưu trữ dấu vết lịch sử rõ ràng (ai chấm, lúc mấy giờ, lý do gì, minh chứng nếu có).
3. GAMIFICATION & TẠO ĐỘNG LỰC: Biến hoạt động thi đua nề nếp khô khan thành một "đấu trường thi đua lành mạnh" với bảng xếp hạng dạng Esports/Game (Podium Top 1-2-3, thanh đo phong độ, huy hiệu Danh dự, danh hiệu Tuần).
4. GIẢM TẢI 90% CÔNG VIỆC CHO GIÁO VIÊN: Tự động tổng hợp điểm tuần, xếp hạng 4 Tổ, lập danh sách học sinh xuất sắc và học sinh cần chấn chỉnh để GVCN Nguyễn Thị Hồng Loan chỉ việc mở màn hình báo cáo trong tiết Sinh hoạt lớp thứ Bảy.
5. KẾT NỐI MỞ & BỀN VỮNG: Tận dụng Google Sheets làm hệ cơ sở dữ liệu miễn phí, thân thiện, cho phép xuất file Excel và sao lưu độc lập bất cứ lúc nào.`
  },
  {
    id: "sec-3",
    roman: "III",
    title: "ĐỐI TƯỢNG NGƯỜI DÙNG & PHÂN QUYỀN TRUY CẬP (RBAC)",
    content: `Hệ thống chia làm 4 nhóm vai trò (Role-Based Access Control) với cơ chế xác thực mã PIN bảo mật:

1. GIÁO VIÊN CHỦ NHIỆM (Master Admin - Cô Nguyễn Thị Hồng Loan - PIN: 6868):
   - Toàn quyền cấu hình hệ thống: Thêm/Sửa/Xóa học sinh, chuyển tổ, phân công cán sự.
   - Quản lý danh mục thi đua: Thay đổi mức điểm cộng/trừ, thêm tiêu chí mới.
   - Phê duyệt / Hủy bỏ / Điều chỉnh các lượt chấm điểm của Cán sự.
   - Khóa sổ tuần và phát hành Báo cáo Tổng kết sinh hoạt lớp.
   - Xuất dữ liệu báo cáo ra file Excel (.xlsx) / In ấn với chữ ký GVCN Nguyễn Thị Hồng Loan.

2. LỚP TRƯỞNG & ĐỘI CỜ ĐỎ LỚP (Supervisor / Moderator - PIN: 1234):
   - Chấm điểm vi phạm hoặc tuyên dương học sinh toàn lớp (cả 4 Tổ).
   - Theo dõi tổng thể lịch sử chấm điểm trong ngày/tuần.
   - Báo cáo sự vụ trực tiếp lên GVCN Nguyễn Thị Hồng Loan.

3. TỔ TRƯỞNG (Tổ 1: 1111 | Tổ 2: 2222 | Tổ 3: 3333 | Tổ 4: 4444):
   - Chấm điểm thành viên trong Tổ của mình và các thành viên được giao chéo.
   - Xem bảng xếp hạng và danh sách điểm của tổ mình.
   - Báo cáo chuyên cần, tác phong đầu giờ của các bạn trong tổ.

4. HỌC SINH & PHỤ HUYNH (Viewer / Public Mode):
   - Chế độ chỉ xem (Read-only): Xem Bảng xếp hạng thi đua cá nhân, Bảng xếp hạng 4 Tổ, Báo cáo vinh danh tuần, Thông báo và lời dặn của GVCN Nguyễn Thị Hồng Loan.`
  },
  {
    id: "sec-4",
    roman: "IV",
    title: "NGUYÊN TẮC THIẾT KẾ UI/UX & TỐI ƯU MOBILE-FIRST",
    content: `1. MOBILE-FIRST 100%: 95% thao tác của Cô Nguyễn Thị Hồng Loan và Cán sự lớp diễn ra trên điện thoại di động (iOS / Android). Giao diện phải vừa vặn hoàn hảo trong khung hình dọc 375px - 430px, không bị trượt ngang (no horizontal overflow).
2. THAO TÁC MỘT TAY (ONE-THUMB REACH): Các nút bấm hành động cốt lõi ("+ Chấm điểm", "Lọc", "Tìm kiếm") phải đặt ở nửa dưới màn hình hoặc Bottom Navigation Bar để ngón tay cái dễ bấm.
3. PHẢN HỒI XÚC GIÁC & HÌNH ẢNH (Haptic & Visual Feedback): Khi cộng/trừ điểm thành công phải có hiệu ứng hoạt họa (Pop-up số điểm bay lên: +10 xanh lá rực rỡ hoặc -5 đỏ tươi), rung nhẹ (vibration API nếu hỗ trợ) và âm thanh ăn mừng ngắn gọn.
4. TỐC ĐỘ TỐI ĐA: Mở app tải ngay trong dưới 1.5 giây. Chấm điểm không cần chờ đợi mạng quay tròn (Optimistic UI update).`
  },
  {
    id: "sec-5",
    roman: "V",
    title: "HỆ THỐNG MÀU SẮC, TYPOGRAPHY & GAMIFICATION THEME",
    content: `Hệ màu chủ đạo mang không khí tuổi trẻ học đường THCS Châu Thành và ngọn lửa thi đua sôi nổi:

1. BẢNG MÀU THIẾT KẾ (Color Palette):
   - Màu Đỏ Tươi Nhiệt Huyết (Primary Crimson/Red): #DC2626 & #EF4444 (Đại diện cho màu cờ đỏ, khăn quàng đỏ Đội Thiếu niên Tiền phong, năng lượng thi đua).
   - Màu Xanh Dương Năng Động (Secondary Electric Blue): #2563EB & #3B82F6 (Đại diện cho học đường hiện đại, sự tin cậy, nề nếp).
   - Màu Vàng Kim Quán Quân (Gold/Trophy): #F59E0B & #FCD34D (Dành cho Top 1 Bảng xếp hạng, cúp cờ luân lưu).
   - Màu Bạc Á Quân (Silver): #94A3B8 & #E2E8F0.
   - Màu Đồng Hạng Ba (Bronze): #D97706 & #FDE68A.
   - Màu Xanh Lá Thưởng (Success Green): #10B981 & #059669 (Dành cho điểm cộng, biểu dương việc tốt).
   - Màu Đỏ Cảnh Báo (Danger Red): #DC2626 (Dành cho trừ điểm, vi phạm nội quy).
   - Nền (Background): Trắng ngà sang trọng #F8FAFC phối hợp hiệu ứng Gradient nhẹ nhàng mang phong cách Gaming UI cao cấp.

2. TYPOGRAPHY & BIỂU TƯỢNG:
   - Font chữ Sans-serif hiện đại (Inter, Plus Jakarta Sans hoặc Be Vietnam Pro hỗ trợ tiếng Việt có dấu chuẩn đẹp).
   - Số điểm sử dụng font Monospace hoặc Bold Impact kích thước lớn để tạo cảm giác game điểm số.
   - Sử dụng icon vector sinh động từ Lucide-react (Cúp vàng, Cờ đỏ, Huy chương, Ngôi sao, Tia chớp, Khiên bảo vệ).`
  },
  {
    id: "sec-6",
    roman: "VI",
    title: "KIẾN TRÚC KỸ THUẬT TỔNG THỂ (TECH STACK & ARCHITECTURE)",
    content: `1. FRONTEND:
   - Framework: React 18+ với TypeScript (chặt chẽ type-safety).
   - Bundler: Vite (nhẹ, build nhanh, tối ưu PWA).
   - Styling: Tailwind CSS v4 kết hợp hiệu ứng CSS Animations cho Bảng xếp hạng.
   - Icons: Lucide-react.
   - Charts: Chart.js hoặc SVG/Canvas biểu đồ cột và radar tiến độ thi đua.
   - Xử lý bảng tính: SheetJS (xlsx) để xuất và phân tích file Excel trực tiếp tại client.

2. BACKEND & DATABASE:
   - Database trung tâm: GOOGLE SHEETS (miễn phí, GVCN Nguyễn Thị Hồng Loan xem và sửa trực tiếp trên điện thoại không cần phần mềm quản trị CSDL).
   - API Middleware: GOOGLE APPS SCRIPT (GAS) triển khai dưới dạng Web App API (doGet, doPost tiếp nhận JSON và trả về JSON).
   - Cache tầng Client: LocalStorage / IndexedDB lưu dữ liệu học sinh và danh mục để app chạy mượt kể cả khi mạng 3G/4G chập chờn.`
  },
  {
    id: "sec-7",
    roman: "VII",
    title: "KIẾN TRÚC DỮ LIỆU GOOGLE SHEETS LÀM DATABASE TRUNG TÂM",
    content: `Bạn BẮT BUỘC phải hướng dẫn và thiết lập 1 Google Spreadsheet đóng vai trò Database chính mang tên:
"DB_SO_TAY_THI_DUA_6B3_CHAU_THANH".

Google Sheet này gồm 5 bảng (Worksheets) với cấu trúc các cột chuẩn hóa từ A đến Z, không được đặt sai tên:
1. Sheet 1: DANH_SACH_HOC_SINH
2. Sheet 2: DANH_MUC_THI_DUA
3. Sheet 3: LICH_SU_CHAM_DIEM
4. Sheet 4: TONG_HOP_TUAN_THANG
5. Sheet 5: CAU_HINH_HE_THONG`
  },
  {
    id: "sec-8",
    roman: "VIII",
    title: "ĐẶC TẢ CHI TIẾT SHEET 1: DANH_SACH_HOC_SINH",
    content: `Cấu trúc các cột của sheet 'DANH_SACH_HOC_SINH':
- Cot_A: Ma_Hoc_Sinh (ID duy nhất, định dạng HS01, HS02... HS45)
- Cot_B: Ho_Va_Ten (Họ và tên đầy đủ tiếng Việt có dấu, VD: Nguyễn Văn An)
- Cot_C: Gioi_Tinh (Nam / Nữ)
- Cot_D: To_Thi_Dua (Giá trị: Tổ 1, Tổ 2, Tổ 3, Tổ 4)
- Cot_E: Chuc_Vu (Giá trị: Lớp trưởng, Lớp phó, Tổ trưởng, Thành viên)
- Cot_F: Diem_Khoi_Diem (Mặc định 100 điểm đầu mỗi tuần)
- Cot_G: Tong_Diem_Hien_Tai (Công thức hoặc giá trị cập nhật sau cộng trừ)
- Cot_H: So_Lan_Vi_Pham (Đếm tổng số lần bị trừ điểm)
- Cot_I: So_Lan_Khen_Thuong (Đếm tổng số lần được cộng điểm)
- Cot_J: Danh_Hieu_Hien_Tai (Sao sáng 6B3 / Học sinh Tích cực / Cần cố gắng)
- Cot_K: Avatar_Url (Link ảnh đại diện hoặc avatar hoạt họa theo mã HS)`
  },
  {
    id: "sec-9",
    roman: "IX",
    title: "ĐẶC TẢ CHI TIẾT SHEET 2: DANH_MUC_THI_DUA (TIÊU CHÍ & ĐIỂM)",
    content: `Cấu trúc các cột của sheet 'DANH_MUC_THI_DUA':
- Cot_A: Ma_Tieu_Chi (ID: TC_CONG_01, TC_TRU_01...)
- Cot_B: Loai_Tieu_Chi (Giá trị: CONG_DIEM hoặc TRU_DIEM)
- Cot_C: Nhom_Noi_Dung (Học tập / Nề nếp tác phong / Chuyên cần / Vệ sinh - Lao động / Hoạt động Đội)
- Cot_D: Ten_Hanh_Vi (Mô tả hành vi, VD: Phát biểu hay trong giờ học, Quên khăn quàng, Đi học muộn, Không thuộc bài, Giúp bạn tiến bộ...)
- Cot_E: Muc_Diem (Số nguyên: +2, +5, +10 hoặc -2, -5, -10...)
- Cot_F: Icon_Code (Mã icon đại diện: book, star, alert-triangle, clock, trash...)
- Cot_G: Trang_Thai_Kich_Hoat (TRUE / FALSE - cho phép tắt bật tiêu chí mà không xóa lịch sử)`
  },
  {
    id: "sec-10",
    roman: "X",
    title: "ĐẶC TẢ CHI TIẾT SHEET 3: LICH_SU_CHAM_DIEM",
    content: `Cấu trúc các cột của sheet 'LICH_SU_CHAM_DIEM' (Mỗi lần bấm chấm điểm là 1 dòng mới):
- Cot_A: Ma_Giao_Dich (Timestamp ngẫu nhiên, VD: GD_20260927_083015_001)
- Cot_B: Thoi_Gian (Định dạng YYYY-MM-DD HH:mm:ss)
- Cot_C: Tuan_Thu (Tuần học số mấy: Tuần 1, Tuần 2... Tuần 35)
- Cot_D: Ma_Hoc_Sinh (Khóa ngoại trỏ về sheet DANH_SACH_HOC_SINH)
- Cot_E: Ten_Hoc_Sinh (Lưu trực tiếp để đối soát nhanh)
- Cot_F: To_Thi_Dua (Tổ 1 / 2 / 3 / 4)
- Cot_G: Ma_Tieu_Chi (Khóa ngoại trỏ về DANH_MUC_THI_DUA)
- Cot_H: Ten_Tieu_Chi (Mô tả cụ thể)
- Cot_I: So_Diem_Bien_Dong (Số âm hoặc số dương: +5, -2...)
- Cot_J: Nguoi_Cham (Mã cán sự chấm: GVCN Nguyễn Thị Hồng Loan, Lớp trưởng, Tổ trưởng Tổ 1...)
- Cot_K: Ghi_Chu_Minh_Chung (Chi tiết thêm: Tiết 2 môn Toán, Quên mang vở bài tập...)
- Cot_L: Trang_Thai_Duyet (DA_DUYET / DANG_CHO / DA_HUY)`
  },
  {
    id: "sec-11",
    roman: "XI",
    title: "ĐẶC TẢ CHI TIẾT SHEET 4: TONG_HOP_TUAN_THANG",
    content: `Cấu trúc các cột của sheet 'TONG_HOP_TUAN_THANG':
- Cot_A: Ma_Ky_Tong_Ket (VD: T01_2026, T02_2026...)
- Cot_B: Loai_Ky (TUAN hoặc THANG)
- Cot_C: So_Thu_Tu_Ky (Tuần 1, Tuần 2... Tháng 9, Tháng 10...)
- Cot_D: Diem_To_1 (Tổng điểm thi đua của Tổ 1 trong kỳ)
- Cot_E: Diem_To_2 (Tổng điểm thi đua của Tổ 2 trong kỳ)
- Cot_F: Diem_To_3 (Tổng điểm thi đua của Tổ 3 trong kỳ)
- Cot_G: Diem_To_4 (Tổng điểm thi đua của Tổ 4 trong kỳ)
- Cot_H: To_Xuat_Sac_Nhat (Tổ vô địch tuần - Nhận cờ luân lưu 6B3)
- Cot_I: Top_1_Hoc_Sinh (Họ tên học sinh điểm cao nhất tuần)
- Cot_J: So_Luot_Vi_Pham_Toan_Lop (Tổng số lỗi trong tuần)
- Cot_K: Nhan_Xet_Cua_GVCN (Lời dặn dò, đánh giá nề nếp của GVCN Nguyễn Thị Hồng Loan)`
  },
  {
    id: "sec-12",
    roman: "XII",
    title: "ĐẶC TẢ CHI TIẾT SHEET 5: CAU_HINH_HE_THONG & PHÂN QUYỀN",
    content: `Cấu trúc các cột của sheet 'CAU_HINH_HE_THONG':
- Cot_A: Khoa_Cau_Hinh (Config Key: TEN_TRUONG, TEN_LOP, TEN_GVCN, NIEN_KHOA, TUAN_HIEN_TAI, DIEM_MAC_DINH_DAU_TUAN, PIN_GVCN, PIN_LOP_TRUONG, PIN_TO_1, PIN_TO_2, PIN_TO_3, PIN_TO_4)
- Cot_B: Gia_Tri (Trường THCS Châu Thành, Lớp 6B3, Nguyễn Thị Hồng Loan, 2026-2027, Tuần 4, 100, 6868, 1234, 1111, 2222, 3333, 4444)
- Cot_C: Mo_Ta (Giải thích công dụng của khóa cấu hình)`
  },
  {
    id: "sec-13",
    roman: "XIII",
    title: "XÂY DỰNG GOOGLE APPS SCRIPT (GAS) WEB APP API & ENDPOINTS",
    content: `Bạn phải viết mã nguồn Google Apps Script (Code.gs) chuẩn mực, sẵn sàng copy-paste vào Script Editor của Google Sheets.
Script này xử lý:
1. doPost(e): Tiếp nhận body JSON với các action:
   - 'action': 'ADD_TRANSACTION' -> Thêm 1 bản ghi vào LICH_SU_CHAM_DIEM, tự động tính lại điểm hiện tại của học sinh và tổ.
   - 'action': 'UPDATE_CONFIG' -> Thay đổi cấu hình tuần, điểm mặc định, thông tin GVCN.
   - 'action': 'MANAGE_CRITERIA' -> Thêm/sửa tiêu chí thi đua.
   - 'action': 'DELETE_TRANSACTION' -> Hoàn tác 1 lượt chấm điểm (chỉ GVCN Nguyễn Thị Hồng Loan có quyền).
2. doGet(e): Tiếp nhận query params:
   - '?action=GET_ALL_DATA' -> Trả về JSON chứa toàn bộ dữ liệu 5 sheet để client render tức thì.
   - '?action=GET_LEADERBOARD' -> Trả về bảng xếp hạng 4 Tổ và Top học sinh.
3. Cơ chế CORS: Đảm bảo thiết lập ContentService.MimeType.JSON với đầy đủ header Access-Control-Allow-Origin: * để web app gọi không bị lỗi bảo mật trình duyệt.`
  },
  {
    id: "sec-14",
    roman: "XIV",
    title: "QUY TẮC ĐỒNG BỘ DỮ LIỆU REALTIME & XỬ LÝ OFFLINE/CACHE",
    content: `1. REALTIME OPTIMISTIC UPDATE:
   Khi cán sự hoặc cô Loan nhấn nút Trừ điểm / Cộng điểm, màn hình Web App PHẢI cập nhật điểm số và vị trí xếp hạng NGAY LẬP TỨC trên giao diện (trong 50 miligiây), không đợi API phản hồi.
2. HÀNG ĐỢI OFFLINE (Offline Sync Queue):
   Nếu mạng trường học yếu hoặc mất kết nối 4G, lượt chấm điểm phải được ghi tạm vào localStorage dưới danh sách 'pending_sync'. Khi có mạng trở lại, hệ thống tự động đẩy dữ liệu lên Google Sheets và hiển thị thông báo "Đã đồng bộ thành công X lượt chấm điểm".
3. POLLING THÔNG MINH:
   Cứ mỗi 30 giây (khi ở tab Leaderboard), app tự động gọi API lấy điểm mới nhất để cập nhật nếu có tổ trưởng khác vừa chấm.`
  },
  {
    id: "sec-15",
    roman: "XV",
    title: "RÀNG BUỘC KỸ THUẬT BẮT BUỘC: TUYỆT ĐỐI KHÔNG HARD-CODE & KHÔNG MOCKUP",
    content: `CÁC MỆNH LỆNH BẮT BUỘC BẰNG CHỮ IN HOA:
1. TUYỆT ĐỐI KHÔNG ĐƯỢC HARD-CODE DANH SÁCH HỌC SINH HOẶC DANH MỤC LỖI TRONG MÃ NGUỒN CỐ ĐỊNH! Mọi dữ liệu phải load từ cấu trúc dữ liệu Google Sheets hoặc biến state có khả năng đồng bộ 2 chiều với API.
2. TUYỆT ĐỐI KHÔNG LÀM GIAO DIỆN MOCKUP TĨNH CHỈ ĐỂ NHÌN! Mọi nút bấm '+', '-', 'Chấm điểm', 'Lọc tổ', 'Đổi tuần', 'Xuất Excel', 'Đổi mã PIN' phải có logic code hoạt động thực tế 100%.
3. MỌI THAO TÁC CỘNG TRỪ ĐIỂM BẮT BUỘC PHẢI SINH RA BẢN GHI LỊCH SỬ CÓ TIMESTAMP VÀ NGƯỜI CHẤM RÕ RÀNG.
4. NẾU CHƯA CÓ LINK GOOGLE APPS SCRIPT THẬT KHI KHỞI CHẠY LẦN ĐẦU, BẠN PHẢI CUNG CẤP CƠ CHẾ 'KHO DỮ LIỆU MẪU ĐẦY ĐỦ 45 HỌC SINH VÀ 20 TIÊU CHÍ' LƯU TRONG LOCALSTORAGE, ĐỒNG THỜI CÓ Ô NHẬP 'GOOGLE APPS SCRIPT WEB APP URL' ĐỂ KẾT NỐI SHEETS THẬT CHỈ VỚI 1 CLICK!`
  },
  {
    id: "sec-16",
    roman: "XVI",
    title: "MODULE 1: GIAO DIỆN TỔNG QUAN (DASHBOARD CỜ ĐỎ & TỔ DẪN ĐẦU)",
    content: `Thành phần hiển thị trên đầu trang Dashboard:
1. BANNER THÔNG TIN LỚP 6B3:
   - Huy hiệu Trường THCS Châu Thành, niên khóa 2026-2027.
   - Giáo viên Chủ nhiệm: Cô Nguyễn Thị Hồng Loan.
   - Nhãn tuần hiện tại: "TUẦN 4 - THI ĐUA CHÀO MỪNG 20/11" (có thể đổi tuần).
   - Đồng hồ thời gian thực và đếm ngược tới tiết Sinh hoạt lớp cuối tuần.
2. WIDGET 'CỜ ĐỎ DẪN ĐẦU' (Leading Squad):
   - Card vinh danh lớn với hiệu ứng hào quang vàng rực rỡ dành cho Tổ đang giữ Hạng 1.
   - Hiển thị: Tên tổ (VD: "TỔ 3 - ĐỘI QUÁN QUÂN"), Điểm trung bình tổ, Chênh lệch điểm so với tổ xếp thứ 2 (+8 điểm).
   - Biểu tượng Cờ Luân Lưu 6B3 động bay phấp phới.
3. THẺ TÓM TẮT CHỈ SỐ NHANH (Quick KPI Cards):
   - Tổng điểm thưởng trong tuần (+245đ).
   - Tổng số lỗi vi phạm cần chấn chỉnh (12 lỗi).
   - Tỷ lệ chuyên cần nề nếp đạt 98.4%.`
  },
  {
    id: "sec-17",
    roman: "XVII",
    title: "MODULE 2: BẢNG XẾP HẠNG (LEADERBOARD) PHONG CÁCH ESPORTS / GAME THI ĐẤU",
    content: `Phải thiết kế Bảng xếp hạng như một game thi đấu kịch tính để học sinh hào hứng:

1. CHẾ ĐỘ XEM 1: BẢNG XẾP HẠNG 4 TỔ (Podium Đấu Trường):
   - Thiết kế Bục nhận giải 3D trực quan:
     * Vị trí giữa cao nhất: Bục Vàng TOP 1 (Cúp Vàng, vương miện, pháo hoa hạt lấp lánh).
     * Vị trí bên trái: Bục Bạc TOP 2.
     * Vị trí bên phải: Bục Đồng TOP 3.
     * Bên dưới: TOP 4 với thanh tiến độ điểm phấn đấu vượt hạng.
   - Thẻ mỗi tổ hiển thị: Tên tổ, Tổ trưởng, Tổng số thành viên (11-12 bạn), Tổng điểm hiện tại, Huy hiệu phong độ (Streak: 🔥 Đang tăng hạng / ⚠️ Cần bứt phá).

2. CHẾ ĐỘ XEM 2: BẢNG XẾP HẠNG CÁ NHÂN TOÀN LỚP (45 Học sinh):
   - Tab chuyển đổi nhanh: Toàn lớp | Tổ 1 | Tổ 2 | Tổ 3 | Tổ 4.
   - Danh sách dạng thẻ game (Player Card):
     * Cột 1: Thứ hạng (#1, #2, #3 viền kim loại đặc biệt; các hạng sau viền thường).
     * Cột 2: Mũi tên biến động (▲ Tăng 2 bậc / ▼ Giảm 1 bậc / — Giữ nguyên).
     * Cột 3: Avatar + Họ tên + Phù hiệu chức vụ (LT, TT) + Tên tổ.
     * Cột 4: Điểm số hiện tại (Font số to, nổi bật).
     * Cột 5: Nút chạm nhanh "Chi tiết" để xem lịch sử điểm của học sinh đó.`
  },
  {
    id: "sec-18",
    roman: "XVIII",
    title: "MODULE 3: BỘ LỌC VÀ TRỰC QUAN HÓA DỮ LIỆU (CHARTS & BIỂU ĐỒ)",
    content: `Tích hợp biểu đồ trực quan hóa dữ liệu thi đua:
1. BIỂU ĐỒ CỘT SO SÁNH 4 TỔ (Bar Chart):
   - 4 cột màu sắc tươi sáng đại diện cho 4 Tổ với mốc chuẩn 100 điểm.
   - Cột nào trên 100 điểm biểu thị màu xanh lá - xanh dương, cột nào dưới 100 điểm đổi cảnh báo cam - đỏ.
2. BIỂU ĐỒ PHÂN BỐ LỖI VI PHẠM (Donut / Pie Chart):
   - Thống kê tỷ lệ các nhóm lỗi trong tuần: Học tập (30%), Tác phong đồng phục (25%), Vệ sinh trực nhật (20%), Đi học muộn (15%), Khác (10%).
   - Giúp GVCN Nguyễn Thị Hồng Loan nhận biết ngay điểm yếu chung của lớp để dặn dò.
3. BỘ LỌC ĐA NĂNG:
   - Lọc theo Tuần (Tuần 1 -> Tuần 35).
   - Lọc theo Tổ (Tổ 1, 2, 3, 4).
   - Lọc theo loại điểm (Chỉ xem việc tốt / Chỉ xem lỗi vi phạm).
   - Thanh tìm kiếm thông minh: Gõ tên hoặc mã học sinh ra kết quả tức thì (Instant Search).`
  },
  {
    id: "sec-19",
    roman: "XIX",
    title: "MODULE 4: TÍNH NĂNG CHẤM ĐIỂM NHANH TRÊN DI ĐỘNG (QUICK SCORING)",
    content: `Đây là tính năng quan trọng nhất cho Cán sự lớp và GVCN khi kiểm tra thực tế:

1. QUY TRÌNH CHẤM ĐIỂM 3 BƯỚC CỰC NHANH:
   - BƯỚC 1: Chọn Học sinh (có thể chọn 1 bạn hoặc chọn NHIỀU BẠN CÙNG LÚC để phạt/thưởng tập thể).
   - BƯỚC 2: Chọn Tiêu chí từ danh mục (Tab Việc Tốt màu xanh / Tab Lỗi Vi Phạm màu đỏ, các nút to dễ bấm).
   - BƯỚC 3: Bấm nút xác nhận "LƯU ĐIỂM" -> Hệ thống phát âm thanh tút nhẹ, điểm cập nhật ngay, form tự động reset để sẵn sàng chấm bạn tiếp theo.

2. CÁC TÙY CHỌN BỔ SUNG TRONG FORM CHẤM:
   - Ô nhập nhanh "Ghi chú cụ thể" (VD: Tiết 3 môn Tiếng Anh cô khen, hoặc Không sơ vin trong giờ chào cờ).
   - Toggle "Chấm cho cả tổ" (Dành cho việc trực nhật tổ xuất sắc hoặc cả tổ bị trừ điểm vì ồn ào).
   - Nút hoàn tác (Undo) xuất hiện 5 giây sau khi chấm để sửa nhanh nếu bấm nhầm.`
  },
  {
    id: "sec-20",
    roman: "XX",
    title: "MODULE 5: QUẢN LÝ DANH MỤC THI ĐUA (TIÊU CHÍ CỘNG/TRỪ ĐIỂM)",
    content: `Giao diện cho phép GVCN tùy biến toàn bộ nội quy của trường và lớp:
1. DANH SÁCH TIÊU CHÍ MẶC ĐỊNH SẴN CÓ:
   * TIÊU CHÍ CỘNG ĐIỂM (+):
     - Phát biểu tốt trong giờ học: +2đ
     - Đạt điểm 9 hoặc 10 bài kiểm tra miệng/15p: +5đ
     - Đạt điểm 10 bài thi giữa kỳ/học kỳ: +10đ
     - Làm việc tốt (nhặt được của rơi, giúp bạn học yếu): +5đ
     - Tham gia tích cực phong trào văn nghệ/thể thao trường: +5đ
     - Trực nhật lớp sạch sẽ, đúng giờ: +5đ
   * TIÊU CHÍ TRỪ ĐIỂM (-):
     - Đi học muộn (sau 7h00): -2đ
     - Không mặc đúng đồng phục / Không đeo khăn quàng: -3đ
     - Không thuộc bài / Chưa làm bài tập về nhà: -5đ
     - Mất trật tự, nói chuyện riêng trong lớp: -2đ
     - Sử dụng điện thoại / Ăn quà vặt trong giờ học: -5đ
     - Trực nhật bẩn hoặc bỏ trực nhật: -10đ
     - Nói tục, cãi lại cán bộ lớp: -10đ

2. FORM THÊM TIÊU CHÍ MỚI:
   - Tên tiêu chí, Nhóm nội dung, Loại (Cộng/Trừ), Mức điểm, Biểu tượng icon.
   - Nút bật/tắt (Toggle Switch) trạng thái kích hoạt.`
  },
  {
    id: "sec-21",
    roman: "XXI",
    title: "MODULE 6: QUẢN LÝ HỒ SƠ HỌC SINH VÀ ĐỘI HÌNH 4 TỔ",
    content: `1. DANH SÁCH 45 HỌC SINH LỚP 6B3:
   - Chia đều 4 Tổ (mỗi tổ 11-12 học sinh).
   - Hiển thị rõ danh tính Tổ trưởng từng tổ.
2. TÍNH NĂNG QUẢN LÝ CỦA GVCN NGUYỄN THỊ HỒNG LOAN:
   - Thêm học sinh mới hoặc chỉnh sửa thông tin (Họ tên, ngày sinh, chức vụ, chuyển tổ).
   - Reset điểm đầu tuần: Nút "Khởi tạo tuần mới" đặt tất cả học sinh về 100 điểm mốc.
   - Xem chi tiết hồ sơ cá nhân (Student Profile): Biểu đồ phong độ cá nhân qua từng tuần, danh sách các lỗi đã từng vi phạm và thành tích đạt được.`
  },
  {
    id: "sec-22",
    roman: "XXII",
    title: "MODULE 7: LỊCH SỬ CHẤM ĐIỂM, PHÊ DUYỆT & NHẬT KÝ KHIẾU NẠI",
    content: `1. TIMELINE LỊCH SỬ CHI TIẾT:
   - Hiển thị danh sách các lượt chấm điểm sắp xếp mới nhất lên đầu.
   - Mỗi bản ghi gồm: Thời gian (giờ, phút, ngày), Người chấm, Học sinh bị chấm, Tên lỗi/thưởng, Điểm biến động (+/-), Ghi chú.
2. CƠ CHẾ KIỂM SOÁT CỦA GVCN:
   - Nút "Sửa điểm" và nút "Xóa lượt chấm này" (kèm popup xác nhận).
   - Khi GVCN xóa, điểm của học sinh và tổ sẽ được tự động hoàn lại (Rollback calculation) và đồng bộ ngược lên Google Sheets.
3. NHẬT KÝ KHIẾU NẠI:
   - Nếu học sinh phản ánh bị chấm nhầm, Cán sự hoặc GVCN Nguyễn Thị Hồng Loan có thể đánh dấu trạng thái "Đang xem xét" hoặc "Đã giải quyết".`
  },
  {
    id: "sec-23",
    roman: "XXIII",
    title: "MODULE 8: BÁO CÁO TỔNG KẾT TIẾT SINH HOẠT LỚP TỰ ĐỘNG",
    content: `Đây là "Vũ khí bí mật" của Giáo viên Chủ nhiệm Nguyễn Thị Hồng Loan vào tiết Sinh hoạt chiều thứ Bảy:
1. CHẾ ĐỘ TRÌNH CHIẾU / XEM BÁO CÁO NHANH:
   - Tự động sinh ra 1 trang báo cáo đồ họa đẹp mắt, chuẩn bị sẵn nội dung để GVCN chỉ việc bật máy chiếu hoặc cầm điện thoại đọc:
   - PHẦN 1: BẢNG TỔNG KẾT 4 TỔ: Tổ Quán quân tuần (nhận cờ thi đua), Tổ Nhì, Tổ Ba, Tổ Cần cố gắng.
   - PHẦN 2: BẢNG VÀNG DANH DỰ (TOP 5 HỌC SINH XUẤT SẮC NHẤT TUẦN): Kèm hiệu ứng huy chương lấp lánh để tuyên dương trước lớp.
   - PHẦN 3: DANH SÁCH HỌC SINH CẦN CHẤN CHỈNH: Liệt kê các bạn có điểm dưới 90 hoặc vi phạm nhiều hơn 2 lỗi trong tuần để GVCN nhắc nhở.
   - PHẦN 4: THỐNG KÊ TỔNG THỂ: Lớp tuần này có bao nhiêu điểm cộng, bao nhiêu điểm trừ, lỗi nào phổ biến nhất.
   - PHẦN 5: GHI CHÚ NHẮN NHỦ CỦA GVCN NGUYỄN THỊ HỒNG LOAN: Lời dặn dò, khen ngợi và định hướng của cô giáo chủ nhiệm cho tuần thi đua tiếp theo.`
  },
  {
    id: "sec-24",
    roman: "XXIV",
    title: "MODULE 9: XUẤT BÁO CÁO FILE EXCEL / PDF KHEN THƯỞNG - KỶ LUẬT",
    content: `Cung cấp tính năng xuất báo cáo chuyên nghiệp để lưu trữ hồ sơ nhà trường:
1. XUẤT FILE EXCEL (.XLSX):
   - Nút bấm 1-click "TẢI FILE EXCEL BÁO CÁO TUẦN".
   - Sử dụng thư viện SheetJS tạo file Excel có định dạng tiêu chuẩn Việt Nam:
     * Tiêu đề: TRƯỜNG THCS CHÂU THÀNH - BÁO CÁO THI ĐUA NỀ NẾP LỚP 6B3 - TUẦN X
     * Giáo viên Chủ nhiệm: NGUYỄN THỊ HỒNG LOAN
     * Bảng 1: Điểm tổng hợp và xếp hạng 4 Tổ.
     * Bảng 2: Danh sách chi tiết 45 học sinh (Họ tên, Tổ, Điểm khởi điểm, Điểm cộng, Điểm trừ, Điểm tổng kết, Xếp loại, Ghi chú).
     * Bảng 3: Chi tiết nhật ký các lỗi vi phạm trong tuần.
     * Phần chân trang: Ngày tháng năm, Lớp trưởng Trần Thị Bích ký tên, Giáo viên Chủ nhiệm Nguyễn Thị Hồng Loan duyệt và ký tên đóng dấu lớp.
2. TÍNH NĂNG IN ẤN TRỰC TIẾP (Print Friendly):
   - CSS @media print được tối ưu để khi bấm Ctrl+P sẽ ra bản in A4 vừa khít, không bị mất lề.`
  },
  {
    id: "sec-25",
    roman: "XXV",
    title: "MODULE 10: HỆ THỐNG TRÒ CHƠI GỌI TÊN HỌC SINH (ĐUA VỊT, SĂN KHO BÁU, VÒNG QUAY) & HUY HIỆU DANH DỰ",
    content: `Tăng tính gắn kết, tạo không khí học tập sôi nổi, kịch tính và công bằng tuyệt đối trong giờ học của lớp 6B3:
1. ĐA DẠNG 4 CHẾ ĐỘ TRÒ CHƠI GỌI TÊN HỌC SINH NGẪU NHIÊN (CLASSROOM MINI-GAMES):
   - Công cụ tương tác trực tiếp đỉnh cao cho Cô Nguyễn Thị Hồng Loan và Cán sự lớp trong các tiết học, giờ truy bài đầu giờ, kiểm tra bài cũ và sinh hoạt lớp:
   a. TRÒ CHƠI ĐUA VỊT GỌI TÊN (DUCK RACE 10 VỊT):
      * 10 chú vịt sắc màu phong cách đa dạng (Vịt Hoàng Gia 👑, Năng Động 🧢, Dễ Thương 🎀, Quý Tộc 🎩, Ngôi Sao ⭐, Cực Ngầu 🕶️, Trạng Nguyên 🎓, Tốc Độ 🚀, May Mắn 🌈, Quán Quân 🥇) mang tên và tổ đại diện cho các học sinh bơi đua trên 10 làn sóng nước kịch tính.
      * Tùy chọn linh hoạt số lượng vịt: 10 Vịt (Mặc định chuẩn thi đua), 8 Vịt, 6 Vịt, 4 Vịt.
      * Tốc độ bơi ngẫu nhiên, tăng tốc bứt phá bất ngờ (speed burst) kèm hiệu ứng âm thanh quạc quạc vui nhộn.
      * Chú vịt đầu tiên chạm vạch đích 100% (cờ đỏ) sẽ mang tên học sinh được vinh danh lên bảng trả lời!
   b. TRÒ CHƠI SĂN TÌM KHO BÁU (TREASURE HUNT):
      * Bản đồ kho báu cổ xưa với 8 chiếc Rương Thần Kỳ (Rương Hoàng Gia, Pha Lê Đại Dương, Ngôi Sao May Mắn,...).
      * Học sinh hoặc giáo viên bấm mở khóa chiếc rương; hiệu ứng ánh sáng phát ra kèm âm thanh leng keng mở ra học sinh may mắn nhận câu hỏi hoặc điểm thưởng.
   c. VÒNG QUAY MAY MẮN TRUYỀN THỐNG (LUCKY WHEEL):
      * Bánh xe quay sắc màu phân chia theo danh sách học sinh với kim chỉ nhấp nháy, giảm tốc mượt mà.
   d. HỘP QUAY SỐ SIÊU TỐC (SLOT MACHINE):
      * Đảo tên học sinh liên tục với tốc độ 75ms/lần, dừng đột ngột để gọi tên chớp nhoáng trong 2 giây.

2. BỘ LỌC PHẠM VI & LOẠI TRỪ HỌC SINH THÔNG MINH:
   - Quay toàn bộ 45 học sinh lớp 6B3 hoặc chỉ định riêng từng Tổ (Tổ 1, 2, 3, 4) để các tổ thi đấu đối kháng công bằng.
   - Tùy chọn "Loại trừ học sinh đã được gọi hôm nay" (đảm bảo không bao giờ bị gọi trùng lặp, mọi học sinh đều có cơ hội).

3. CHẤM ĐIỂM 1-CHẠM TRỰC TIẾP TỨC THÌ (INSTANT SCORING):
   - Nút [+5đ]: Trả lời bài xuất sắc / Đạt điểm 10 miệng.
   - Nút [+2đ]: Phát biểu tốt / Đạt yêu cầu.
   - Nút [-2đ]: Chưa chuẩn bị bài chu đáo.
   - Nút [-5đ]: Không thuộc bài cũ.
   - Bảng nhật ký gọi tên tự động ghi nhận thời gian, tên trò chơi (Đua vịt / Kho báu) và điểm số đồng bộ tức thì vào bảng điểm tuần.

4. HỆ THỐNG HUY HIỆU TỰ ĐỘNG CẤP:
   - Huy hiệu "Ong Chăm Chỉ": Dành cho bạn có từ 3 lần phát biểu tốt/tuần.
   - Huy hiệu "Hiệp Sĩ Nề Nếp": Dành cho bạn đạt 100/100 điểm tuyệt đối suốt cả tuần không phạm lỗi.
   - Huy hiệu "Chiến Thần Tiến Bộ": Dành cho bạn có điểm tuần này tăng vọt so với tuần trước.
   - Huy hiệu "Tổ Đội Bất Khả Chiến Bại": Dành cho các thành viên của Tổ đạt Quán quân 2 tuần liên tiếp.

5. HỆ THỐNG NHẠC NỀN LỚP HỌC & TẢI FILE NHẠC TÙY BIẾN (CLASSROOM BGM SYSTEM):
   - 4 bản hòa tấu âm thanh sống động tích hợp sẵn:
     * Giai Điệu Vui Tươi Rộn Ràng 6B3 (Acoustic / Ukulele / Vỗ tay vui nhộn 124 BPM).
     * Bứt Tốc Đua Vịt 10 Làn (Arcade Racing Beat dồn dập 138 BPM).
     * Khám Phá Rương Báu Kỳ Bí (Magical Chimes phiêu lưu 108 BPM).
     * Giai Điệu Êm Dịu Tập Trung (Lofi Piano dịu êm 88 BPM).
   - TÍNH NĂNG TẢI FILE NHẠC TÙY Ý: Cho phép GVCN Cô Hồng Loan tải trực tiếp file nhạc riêng của lớp (MP3, WAV, M4A) từ máy tính để phát liên tục trong giờ học.
   - Thanh điều khiển Mini Music Bar nổi ở góc màn hình: Play/Pause, chỉnh âm lượng 0-100%, tắt tiếng nhanh, Equalizer nhảy theo điệu nhạc và tự động hòa âm khi bắt đầu cuộc Đua Vịt 10 Làn!

6. TÍNH NĂNG NHÚNG & PHÁT VIDEO YOUTUBE (YOUTUBE EMBED MODAL):
   - Biểu tượng YouTube icon nhỏ gọn đặt cạnh các nút điều khiển âm thanh (loa/nhạc) ở góc trên bên phải của form đăng nhập màu đỏ.
   - Hộp thoại Modal Popup (nền overlay tối mờ) gồm:
     * Tiêu đề: "Cài đặt Video YouTube"
     * Ô nhập link hỗ trợ tất cả các định dạng: youtube.com/watch?v=, youtu.be/, shorts/, embed/...
     * Tự động trích xuất Video ID 11 ký tự và chuyển đổi thành URL nhúng chuẩn https://www.youtube.com/embed/[ID]?autoplay=1&rel=0
     * Khung hình phát video tỷ lệ chuẩn 16:9 sắc nét, hỗ trợ toàn màn hình (fullscreen).
     * Nút "Lưu & Hiển thị", nút "Gỡ video", và nút đóng "X".
     * Lưu trữ vĩnh viễn trong localStorage của trình duyệt, đảm bảo khi F5 tải lại trang video vẫn giữ nguyên.`
  },
  {
    id: "sec-26",
    roman: "XXVI",
    title: "THIẾT KẾ ĐẶC BIỆT CHO GIÁO VIÊN CHỦ NHIỆM NGUYỄN THỊ HỒNG LOAN (MASTER ADMIN MODE)",
    content: `Khi nhập mã PIN của GVCN Nguyễn Thị Hồng Loan (Mặc định: 6868), giao diện sẽ mở khóa:
1. THANH CÔNG CỤ QUẢN TRỊ ĐẶC QUYỀN (Floating Admin Bar):
   - Nút "Khóa sổ tuần" (ngăn cán sự chấm thêm khi tuần đã kết thúc).
   - Nút "Mở tuần mới" (tự động lưu snapshot điểm tuần cũ vào Sheet TONG_HOP và cộng lại 100 điểm mới).
   - Nút "Đổi cấu hình mã PIN" của các tổ trưởng.
   - Nút "Kết nối Google Sheets" (nhập URL Web App của Apps Script và kiểm tra kết nối ping/pong).`
  },
  {
    id: "sec-27",
    roman: "XXVII",
    title: "THIẾT KẾ GIAO DIỆN CHO BAN CÁN SỰ (LỚP TRƯỞNG & 4 TỔ TRƯỞNG)",
    content: `Tối ưu riêng cho từng cán sự khi làm nhiệm vụ trong lớp:
1. CHUYỂN ĐỔI TÀI KHOẢN NHANH QUA MÃ PIN:
   - Lớp trưởng: PIN 1234
   - Tổ trưởng Tổ 1: PIN 1111
   - Tổ trưởng Tổ 2: PIN 2222
   - Tổ trưởng Tổ 3: PIN 3333
   - Tổ trưởng Tổ 4: PIN 4444
2. GIỚI HẠN QUYỀN THÔNG MINH:
   - Tổ trưởng nào chỉ thấy danh sách học sinh của tổ đó khi mở form chấm nhanh (hoặc tab chấm chéo nếu được cấu hình).
   - Không được quyền xóa lịch sử điểm cũ của ngày hôm trước (chỉ GVCN Nguyễn Thị Hồng Loan mới được xóa).`
  },
  {
    id: "sec-28",
    roman: "XXVIII",
    title: "CƠ CHẾ BẢO MẬT, MÃ PIN TRUY CẬP VÀ XÁC THỰC",
    content: `1. BẢO VỆ DỮ LIỆU:
   - Không yêu cầu học sinh lớp 6 phải tạo tài khoản email rườm rà.
   - Xác thực hoàn toàn bằng Mã PIN 4 chữ số hoặc 6 chữ số tiện lợi trên điện thoại.
   - Mã PIN lưu trữ mã hóa trong Google Sheets và session cache trình duyệt.
2. TỰ ĐỘNG KHÓA PHIÊN:
   - Sau 15 phút không thao tác, phiên đăng nhập Cán sự/GVCN tự động khóa lại về màn hình công khai (Viewer Mode) để tránh học sinh khác mượn máy bấm nghịch chỉnh điểm.`
  },
  {
    id: "sec-29",
    roman: "XXIX",
    title: "TỐI ƯU TRẢI NGHIỆM TRÊN MÀN HÌNH DỌC SMARTPHONE (MOBILE-FIRST POLISH)",
    content: `1. THIẾT KẾ NÚT BẤM (Touch Target Size):
   - Mọi nút bấm (Button) phải có chiều cao tối thiểu 44px, khoảng cách giữa các nút tối thiểu 8px để tránh bấm nhầm trên màn hình cảm ứng.
2. SCROLL VÀ MODAL TỐI ƯU:
   - Modal hiển thị dạng Bottom Sheet (trượt từ dưới đáy màn hình lên), vuốt nhẹ xuống để đóng.
   - Thanh cuộn ẩn gọn gàng, hiệu ứng cuộn mượt mà (smooth scrolling).
3. ĐÈN BÁO TRẠNG THÁI KẾT NỐI:
   - Biểu tượng chấm tròn nhỏ trên thanh Header:
     * Xanh lá: Đang đồng bộ trực tiếp với Google Sheets.
     * Vàng cam: Đang lưu tạm offline (sẽ đồng bộ khi có mạng).
     * Đỏ: Lỗi kết nối API.`
  },
  {
    id: "sec-30",
    roman: "XXX",
    title: "XỬ LÝ LỖI, KẾT NỐI MẠNG YẾU VÀ TRẢI NGHIỆM NGƯỜI DÙNG (EDGE CASES)",
    content: `Hệ thống phải xử lý trơn tru các tình huống ngoại lệ sau:
1. Trường hợp 2 tổ trưởng cùng chấm điểm cùng một lúc: Google Apps Script phải xử lý tuần tự (LockService) tránh ghi đè làm mất dữ liệu.
2. Học sinh có điểm tụt xuống dưới 0: Hệ thống vẫn hiển thị điểm thực tế và cảnh báo đặc biệt, không làm treo ứng dụng.
3. Nhập sai mã PIN quá 5 lần: Khóa tạm thời 1 phút và thông báo liên hệ GVCN Nguyễn Thị Hồng Loan.
4. Mất mạng đột ngột khi đang gửi dữ liệu: Hiển thị Toast thông báo dịu nhẹ "Đã lưu vào bộ nhớ máy, sẽ tự động gửi khi có mạng".`
  },
  {
    id: "sec-31",
    roman: "XXXI",
    title: "LỘ TRÌNH TRIỂN KHAI PHIÊN BẢN V1.0 (CORE MVP SCOPE)",
    content: `YÊU CẦU AI LẬP TRÌNH PHẢI HOÀN THIỆN NGAY TRONG BẢN V1.0 CÁC TÍNH NĂNG SAU:
1. Giao diện đầy đủ chuẩn Mobile-first với Theme Đỏ tươi & Xanh dương của Trường THCS Châu Thành, Lớp 6B3 (GVCN Nguyễn Thị Hồng Loan).
2. Bảng xếp hạng 4 Tổ dạng Bục nhận giải (Podium 1-2-3) và Bảng xếp hạng 45 học sinh có tìm kiếm, lọc theo tổ.
3. Module Chấm điểm nhanh 3 bước trên điện thoại (cộng việc tốt, trừ lỗi vi phạm) hoạt động mượt mà.
4. Cơ chế đồng bộ dữ liệu 2 chiều với Google Sheets qua Google Apps Script API + Kho dữ liệu mẫu đầy đủ trong LocalStorage.
5. Trang Báo cáo Tổng kết Sinh hoạt lớp tự động và nút Xuất file Excel (.xlsx) tải về máy.
6. Hệ thống phân quyền mã PIN (GVCN, Lớp trưởng, 4 Tổ trưởng) và Bộ cấu hình tiêu chí thi đua.
7. Trò chơi gọi tên học sinh ngẫu nhiên (Vòng quay may mắn / Lucky Wheel) có âm thanh, lọc theo Tổ, loại trừ bạn đã gọi và chấm điểm trực tiếp 1-chạm.`
  },
  {
    id: "sec-32",
    roman: "XXXII",
    title: "LỘ TRÌNH MỞ RỘNG CHO PHIÊN BẢN V2.0 TIẾP THEO",
    content: `Định hướng kiến trúc sẵn sàng để nâng cấp phiên bản V2.0:
1. Gửi thông báo tự động về điểm thi đua tuần qua Zalo / Tin nhắn cho Phụ huynh học sinh.
2. Chụp ảnh minh chứng vi phạm (ảnh đồng phục, ảnh bàn ghế bẩn) tải trực tiếp lên Google Drive qua Apps Script.
3. Tính năng Vòng quay may mắn (Lucky Wheel) bốc thăm khen thưởng cuối tuần cho các bạn học sinh đạt danh hiệu Xuất sắc.`
  },
  {
    id: "sec-33",
    roman: "XXXIII",
    title: "KỊCH BẢN KIỂM THỬ CHI TIẾT ĐỦ 15 BƯỚC (E2E TEST SCENARIO)",
    content: `AI lập trình BẮT BUỘC phải tự kiểm tra mã nguồn theo đúng kịch bản 15 bước tuần tự sau:

- Bước 1: Mở ứng dụng, kiểm tra giao diện hiển thị đúng tiêu đề "SỔ TAY THI ĐUA LỚP 6B3 - THCS CHÂU THÀNH", GVCN Cô Nguyễn Thị Hồng Loan, tuần học và danh sách 4 Tổ.
- Bước 2: Đăng nhập quyền GVCN (Cô Nguyễn Thị Hồng Loan) bằng mã PIN (6868), vào mục Quản lý Danh mục tiêu chí.
- Bước 3: Thêm một tiêu chí vi phạm mới: "Không mặc đúng đồng phục ngày thứ Hai" - mức phạt trừ 5 điểm.
- Bước 4: Kiểm tra danh mục xem tiêu chí mới đã hiển thị trong danh sách lựa chọn chưa (và trên Google Sheets nếu đã nối API).
- Bước 5: Chuyển sang tài khoản Tổ trưởng Tổ 1 (mã PIN 1111).
- Bước 6: Mở form Chấm điểm nhanh: Chọn học sinh Nguyễn Văn An (Tổ 1), chọn tiêu chí vừa tạo (-5đ), nhập ghi chú "Quên áo khoác đồng phục", bấm Lưu điểm.
- Bước 7: Quan sát hiệu ứng thông báo thành công và kiểm tra điểm của Nguyễn Văn An giảm từ 100 xuống 95 điểm ngay tức thì.
- Bước 8: Mở Trò chơi gọi tên học sinh ngẫu nhiên (Vòng quay may mắn): Chọn quay học sinh Tổ 2, bấm nút "Quay tên", quan sát vòng quay hoạt động kèm âm thanh hồi hộp; khi kim dừng vào học sinh Trần Thị Bích (Tổ 2), bấm ngay nút thưởng [+5đ: Phát biểu xuất sắc] trực tiếp trên bảng kết quả.
- Bước 9: Mở Bảng xếp hạng Cá nhân: Kiểm tra xem Trần Thị Bích (105đ) có vượt lên trên bảng xếp hạng và Nguyễn Văn An (95đ) có tụt hạng không.
- Bước 10: Mở Bảng xếp hạng 4 Tổ: Kiểm tra xem điểm tổng hoặc điểm trung bình của Tổ 2 có tăng lên và thứ hạng các bục Podium có thay đổi vị trí tương ứng không.
- Bước 11: Mở trang Lịch sử chấm điểm: Xác nhận cả 2 giao dịch trên đều được ghi nhận đầy đủ (thời gian, người chấm, nội dung, số điểm).
- Bước 12: Dùng quyền GVCN Nguyễn Thị Hồng Loan bấm nút "Hoàn tác/Xóa" giao dịch trừ điểm của Nguyễn Văn An, kiểm tra điểm của An có được khôi phục về lại 100 điểm ban đầu không.
- Bước 13: Mở trang "Báo cáo Sinh hoạt lớp": Kiểm tra các bảng Top 5 Khen thưởng, Danh sách cần lưu ý, Thống kê lỗi có tổng hợp chính xác theo các số liệu vừa chấm không.
- Bước 14: Nhấn nút "Xuất file Excel báo cáo tuần" -> Kiểm tra file .xlsx được tải về thiết bị và mở ra có đầy đủ các cột số liệu, tên trường THCS Châu Thành, Lớp 6B3, GVCN Nguyễn Thị Hồng Loan.
- Bước 15: Kiểm tra toàn bộ ứng dụng trên khung hình di động (375px - 414px chiều ngang), đảm bảo không bị tràn viền, bàn phím số bấm nhạy, các thao tác mượt mà không có lỗi console.`
  },
  {
    id: "sec-34",
    roman: "XXXIV",
    title: "TIÊU CHÍ NGHIỆM THU DỰ ÁN (ACCEPTANCE CRITERIA)",
    content: `Dự án chỉ được coi là đạt yêu cầu khi thỏa mãn 100% các tiêu chí sau:
1. KHÔNG CÓ BẤT KỲ LỖI LẬP TRÌNH (Zero Console Errors, Zero Build Failures).
2. Tốc độ tương tác phản hồi tức thời dưới 100ms trên điện thoại di động.
3. Dữ liệu nhất quán: Điểm số hiển thị trên Dashboard, Bảng xếp hạng, Báo cáo và File Excel xuất ra phải hoàn toàn trùng khớp từng điểm số.
4. Giao diện trực quan, tươi sáng, mang đúng tinh thần thi đua sôi nổi của học sinh THCS với tông màu Đỏ & Xanh dương.
5. Cung cấp đầy đủ hướng dẫn thiết lập Google Sheets và toàn bộ mã nguồn Google Apps Script trong tài liệu kèm theo.`
  },
  {
    id: "sec-35",
    roman: "XXXV",
    title: "LỜI KẾT & MỆNH LỆNH THI CÔNG CUỐI CÙNG CHO AI LẬP TRÌNH",
    content: `BÂY GIỜ LÀ MỆNH LỆNH HÀNH ĐỘNG DÀNH CHO BẠN:
Hãy đóng vai trò một Kỹ sư phần mềm bậc thầy, tiến hành viết toàn bộ mã nguồn của Web App "SỔ TAY THI ĐUA LỚP 6B3 - TRƯỜNG THCS CHÂU THÀNH (GVCN: NGUYỄN THỊ HỒNG LOAN)" theo đúng tất cả 34 phần đặc tả chi tiết ở trên. 

Hãy triển khai ngay phiên bản V1.0 hoàn chỉnh nhất, viết mã nguồn sạch sẽ, chú thích rõ ràng bằng tiếng Việt, thiết kế giao diện lộng lẫy và đảm bảo hệ thống chạy mượt mà ngay trên mọi thiết bị di động!`
  }
];

export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * =========================================================================
 * GOOGLE APPS SCRIPT CHO WEB APP: SỔ TAY THI ĐUA LỚP 6B3 - THCS CHÂU THÀNH
 * Giáo viên Chủ nhiệm: NGUYỄN THỊ HỒNG LOAN
 * =========================================================================
 * Hướng dẫn: Mở Google Sheet -> Tiện ích mở rộng -> Apps Script -> Dán mã này
 * Sau đó bấm "Triển khai" -> "Tùy chọn triển khai mới" -> Chọn "Ứng dụng web"
 * Quyền truy cập: "Bất kỳ ai" (Anyone) -> Sao chép URL Web App dán vào ứng dụng!
 * =========================================================================
 */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "GET_ALL_DATA";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === "GET_ALL_DATA") {
    var result = {
      status: "success",
      school: "Trường THCS Châu Thành",
      className: "Lớp 6B3",
      homeroomTeacher: "Nguyễn Thị Hồng Loan",
      students: getSheetDataAsJson(ss.getSheetByName("DANH_SACH_HOC_SINH")),
      criteria: getSheetDataAsJson(ss.getSheetByName("DANH_MUC_THI_DUA")),
      history: getSheetDataAsJson(ss.getSheetByName("LICH_SU_CHAM_DIEM")),
      summary: getSheetDataAsJson(ss.getSheetByName("TONG_HOP_TUAN_THANG")),
      config: getSheetDataAsJson(ss.getSheetByName("CAU_HINH_HE_THONG")),
      timestamp: new Date().toISOString()
    };
    return createJsonResponse(result);
  }
  
  return createJsonResponse({ status: "error", message: "Invalid action" });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = data.action;
    
    if (action === "ADD_TRANSACTION") {
      var historySheet = ss.getSheetByName("LICH_SU_CHAM_DIEM");
      var newRow = [
        data.id || "GD_" + new Date().getTime(),
        Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "yyyy-MM-dd HH:mm:ss"),
        data.week || "Tuần 4",
        data.studentId,
        data.studentName,
        data.team,
        data.criteriaId,
        data.criteriaName,
        data.scoreChange,
        data.scorer,
        data.note || "",
        "DA_DUYET"
      ];
      historySheet.appendRow(newRow);
      
      // Cập nhật điểm trong sheet DANH_SACH_HOC_SINH
      updateStudentScore(ss, data.studentId, data.scoreChange);
      
      return createJsonResponse({ status: "success", message: "Đã ghi nhận điểm thành công" });
    }
    
    if (action === "ROLLBACK_TRANSACTION") {
      // Hoàn tác điểm
      var txId = data.id;
      var historySheet = ss.getSheetByName("LICH_SU_CHAM_DIEM");
      var values = historySheet.getDataRange().getValues();
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] == txId) {
          var studentId = values[i][3];
          var scoreChange = Number(values[i][8]);
          // Hoàn tác: trừ lại số điểm đã cộng, hoặc cộng lại số điểm đã trừ
          updateStudentScore(ss, studentId, -scoreChange);
          historySheet.deleteRow(i + 1);
          return createJsonResponse({ status: "success", message: "Đã hoàn tác giao dịch" });
        }
      }
      return createJsonResponse({ status: "error", message: "Không tìm thấy giao dịch" });
    }
    
    return createJsonResponse({ status: "error", message: "Unknown action" });
  } catch (err) {
    return createJsonResponse({ status: "error", error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function updateStudentScore(ss, studentId, scoreDelta) {
  var studentSheet = ss.getSheetByName("DANH_SACH_HOC_SINH");
  var values = studentSheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][0] == studentId) {
      var currentScore = Number(values[i][6]) || 100;
      var newScore = currentScore + Number(scoreDelta);
      studentSheet.getRange(i + 1, 7).setValue(newScore);
      break;
    }
  }
}

function getSheetDataAsJson(sheet) {
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  var headers = rows[0];
  var data = [];
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    data.push(obj);
  }
  return data;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}
`;
