export interface Student {
  id: string;
  name: string;
  gender: 'Nam' | 'Nữ';
  team: 'Tổ 1' | 'Tổ 2' | 'Tổ 3' | 'Tổ 4';
  role: 'Lớp trưởng' | 'Lớp phó' | 'Tổ trưởng' | 'Thành viên';
  initialScore: number;
  currentScore: number;
  violations: number;
  commendations: number;
  streak: 'up' | 'down' | 'same';
}

export interface Criteria {
  id: string;
  type: 'CONG_DIEM' | 'TRU_DIEM';
  category: string;
  name: string;
  score: number;
  icon: string;
}

export interface ScoreHistoryItem {
  id: string;
  timestamp: string;
  week: string;
  studentId: string;
  studentName: string;
  team: string;
  criteriaName: string;
  scoreChange: number;
  scorer: string;
  note: string;
}

export const INITIAL_STUDENTS: Student[] = [
  // Tổ 1
  { id: 'HS01', name: 'Nguyễn Văn An', gender: 'Nam', team: 'Tổ 1', role: 'Tổ trưởng', initialScore: 100, currentScore: 105, violations: 0, commendations: 2, streak: 'up' },
  { id: 'HS02', name: 'Lê Thị Mai Anh', gender: 'Nữ', team: 'Tổ 1', role: 'Thành viên', initialScore: 100, currentScore: 102, violations: 0, commendations: 1, streak: 'up' },
  { id: 'HS03', name: 'Trần Đình Bảo', gender: 'Nam', team: 'Tổ 1', role: 'Thành viên', initialScore: 100, currentScore: 98, violations: 1, commendations: 0, streak: 'down' },
  { id: 'HS04', name: 'Phạm Quỳnh Chi', gender: 'Nữ', team: 'Tổ 1', role: 'Thành viên', initialScore: 100, currentScore: 108, violations: 0, commendations: 3, streak: 'up' },
  { id: 'HS05', name: 'Hoàng Minh Dũng', gender: 'Nam', team: 'Tổ 1', role: 'Thành viên', initialScore: 100, currentScore: 100, violations: 0, commendations: 0, streak: 'same' },
  { id: 'HS06', name: 'Vũ Thùy Dương', gender: 'Nữ', team: 'Tổ 1', role: 'Thành viên', initialScore: 100, currentScore: 95, violations: 1, commendations: 0, streak: 'down' },
  { id: 'HS07', name: 'Đặng Đức Giang', gender: 'Nam', team: 'Tổ 1', role: 'Thành viên', initialScore: 100, currentScore: 104, violations: 0, commendations: 1, streak: 'up' },
  { id: 'HS08', name: 'Bùi Thu Hà', gender: 'Nữ', team: 'Tổ 1', role: 'Thành viên', initialScore: 100, currentScore: 100, violations: 0, commendations: 0, streak: 'same' },
  { id: 'HS09', name: 'Ngô Việt Hùng', gender: 'Nam', team: 'Tổ 1', role: 'Thành viên', initialScore: 100, currentScore: 92, violations: 2, commendations: 0, streak: 'down' },
  { id: 'HS10', name: 'Đỗ Ngọc Hương', gender: 'Nữ', team: 'Tổ 1', role: 'Thành viên', initialScore: 100, currentScore: 106, violations: 0, commendations: 2, streak: 'up' },
  { id: 'HS11', name: 'Trịnh Gia Huy', gender: 'Nam', team: 'Tổ 1', role: 'Thành viên', initialScore: 100, currentScore: 100, violations: 0, commendations: 0, streak: 'same' },

  // Tổ 2
  { id: 'HS12', name: 'Trần Thị Bích', gender: 'Nữ', team: 'Tổ 2', role: 'Lớp trưởng', initialScore: 100, currentScore: 115, violations: 0, commendations: 4, streak: 'up' },
  { id: 'HS13', name: 'Lê Hoàng Nam', gender: 'Nam', team: 'Tổ 2', role: 'Tổ trưởng', initialScore: 100, currentScore: 108, violations: 0, commendations: 2, streak: 'up' },
  { id: 'HS14', name: 'Nguyễn Diệu Linh', gender: 'Nữ', team: 'Tổ 2', role: 'Thành viên', initialScore: 100, currentScore: 110, violations: 0, commendations: 3, streak: 'up' },
  { id: 'HS15', name: 'Phan Tuấn Kiệt', gender: 'Nam', team: 'Tổ 2', role: 'Thành viên', initialScore: 100, currentScore: 97, violations: 1, commendations: 0, streak: 'down' },
  { id: 'HS16', name: 'Vũ Phương Linh', gender: 'Nữ', team: 'Tổ 2', role: 'Thành viên', initialScore: 100, currentScore: 105, violations: 0, commendations: 1, streak: 'up' },
  { id: 'HS17', name: 'Đinh Quốc Long', gender: 'Nam', team: 'Tổ 2', role: 'Thành viên', initialScore: 100, currentScore: 100, violations: 0, commendations: 0, streak: 'same' },
  { id: 'HS18', name: 'Mai Tuyết Nga', gender: 'Nữ', team: 'Tổ 2', role: 'Thành viên', initialScore: 100, currentScore: 103, violations: 0, commendations: 1, streak: 'up' },
  { id: 'HS19', name: 'Lý Trọng Nghĩa', gender: 'Nam', team: 'Tổ 2', role: 'Thành viên', initialScore: 100, currentScore: 94, violations: 1, commendations: 0, streak: 'down' },
  { id: 'HS20', name: 'Nguyễn Yến Nhi', gender: 'Nữ', team: 'Tổ 2', role: 'Thành viên', initialScore: 100, currentScore: 105, violations: 0, commendations: 1, streak: 'up' },
  { id: 'HS21', name: 'Dương Thành Phát', gender: 'Nam', team: 'Tổ 2', role: 'Thành viên', initialScore: 100, currentScore: 100, violations: 0, commendations: 0, streak: 'same' },
  { id: 'HS22', name: 'Võ Minh Quân', gender: 'Nam', team: 'Tổ 2', role: 'Thành viên', initialScore: 100, currentScore: 98, violations: 1, commendations: 0, streak: 'down' },

  // Tổ 3
  { id: 'HS23', name: 'Phạm Đức Thịnh', gender: 'Nam', team: 'Tổ 3', role: 'Tổ trưởng', initialScore: 100, currentScore: 112, violations: 0, commendations: 3, streak: 'up' },
  { id: 'HS24', name: 'Nguyễn Thảo My', gender: 'Nữ', team: 'Tổ 3', role: 'Lớp phó', initialScore: 100, currentScore: 114, violations: 0, commendations: 4, streak: 'up' },
  { id: 'HS25', name: 'Chu Bảo Sơn', gender: 'Nam', team: 'Tổ 3', role: 'Thành viên', initialScore: 100, currentScore: 104, violations: 0, commendations: 1, streak: 'up' },
  { id: 'HS26', name: 'Tạ Minh Tâm', gender: 'Nam', team: 'Tổ 3', role: 'Thành viên', initialScore: 100, currentScore: 102, violations: 0, commendations: 1, streak: 'up' },
  { id: 'HS27', name: 'Bùi Kim Ngân', gender: 'Nữ', team: 'Tổ 3', role: 'Thành viên', initialScore: 100, currentScore: 109, violations: 0, commendations: 2, streak: 'up' },
  { id: 'HS28', name: 'Đoàn Hữu Phước', gender: 'Nam', team: 'Tổ 3', role: 'Thành viên', initialScore: 100, currentScore: 100, violations: 0, commendations: 0, streak: 'same' },
  { id: 'HS29', name: 'Lê Thanh Thảo', gender: 'Nữ', team: 'Tổ 3', role: 'Thành viên', initialScore: 100, currentScore: 107, violations: 0, commendations: 2, streak: 'up' },
  { id: 'HS30', name: 'Nguyễn Tấn Tài', gender: 'Nam', team: 'Tổ 3', role: 'Thành viên', initialScore: 100, currentScore: 95, violations: 1, commendations: 0, streak: 'down' },
  { id: 'HS31', name: 'Cao Thu Trang', gender: 'Nữ', team: 'Tổ 3', role: 'Thành viên', initialScore: 100, currentScore: 106, violations: 0, commendations: 2, streak: 'up' },
  { id: 'HS32', name: 'Trần Quốc Trung', gender: 'Nam', team: 'Tổ 3', role: 'Thành viên', initialScore: 100, currentScore: 99, violations: 1, commendations: 0, streak: 'down' },
  { id: 'HS33', name: 'Lâm Hải Yến', gender: 'Nữ', team: 'Tổ 3', role: 'Thành viên', initialScore: 100, currentScore: 104, violations: 0, commendations: 1, streak: 'up' },

  // Tổ 4
  { id: 'HS34', name: 'Hoàng Vũ Khoa', gender: 'Nam', team: 'Tổ 4', role: 'Tổ trưởng', initialScore: 100, currentScore: 106, violations: 0, commendations: 2, streak: 'up' },
  { id: 'HS35', name: 'Nguyễn Bảo Ngọc', gender: 'Nữ', team: 'Tổ 4', role: 'Thành viên', initialScore: 100, currentScore: 105, violations: 0, commendations: 1, streak: 'up' },
  { id: 'HS36', name: 'Phan Văn Phong', gender: 'Nam', team: 'Tổ 4', role: 'Thành viên', initialScore: 100, currentScore: 93, violations: 2, commendations: 0, streak: 'down' },
  { id: 'HS37', name: 'Vũ Như Quỳnh', gender: 'Nữ', team: 'Tổ 4', role: 'Thành viên', initialScore: 100, currentScore: 108, violations: 0, commendations: 2, streak: 'up' },
  { id: 'HS38', name: 'Tô Nhật Quang', gender: 'Nam', team: 'Tổ 4', role: 'Thành viên', initialScore: 100, currentScore: 98, violations: 1, commendations: 0, streak: 'down' },
  { id: 'HS39', name: 'Lê Cẩm Tú', gender: 'Nữ', team: 'Tổ 4', role: 'Thành viên', initialScore: 100, currentScore: 102, violations: 0, commendations: 1, streak: 'up' },
  { id: 'HS40', name: 'Đặng Tuấn Tú', gender: 'Nam', team: 'Tổ 4', role: 'Thành viên', initialScore: 100, currentScore: 96, violations: 1, commendations: 0, streak: 'down' },
  { id: 'HS41', name: 'Hà Kiều Vân', gender: 'Nữ', team: 'Tổ 4', role: 'Thành viên', initialScore: 100, currentScore: 103, violations: 0, commendations: 1, streak: 'up' },
  { id: 'HS42', name: 'Lương Triều Vĩ', gender: 'Nam', team: 'Tổ 4', role: 'Thành viên', initialScore: 100, currentScore: 99, violations: 1, commendations: 0, streak: 'down' },
  { id: 'HS43', name: 'Mai Hồng Xuân', gender: 'Nữ', team: 'Tổ 4', role: 'Thành viên', initialScore: 100, currentScore: 101, violations: 0, commendations: 1, streak: 'up' },
  { id: 'HS44', name: 'Bùi Thái An', gender: 'Nam', team: 'Tổ 4', role: 'Thành viên', initialScore: 100, currentScore: 94, violations: 1, commendations: 0, streak: 'down' },
  { id: 'HS45', name: 'Đoàn Kim Oanh', gender: 'Nữ', team: 'Tổ 4', role: 'Thành viên', initialScore: 100, currentScore: 105, violations: 0, commendations: 1, streak: 'up' },
];

export const INITIAL_CRITERIA: Criteria[] = [
  // Việc tốt (Cộng điểm)
  { id: 'TC_C01', type: 'CONG_DIEM', category: 'Học tập', name: 'Phát biểu bài hay / tích cực xây dựng bài', score: 2, icon: 'star' },
  { id: 'TC_C02', type: 'CONG_DIEM', category: 'Học tập', name: 'Đạt điểm 9 hoặc 10 bài kiểm tra', score: 5, icon: 'award' },
  { id: 'TC_C03', type: 'CONG_DIEM', category: 'Học tập', name: 'Đạt điểm 10 bài thi giữa kỳ / học kỳ', score: 10, icon: 'trophy' },
  { id: 'TC_C04', type: 'CONG_DIEM', category: 'Đạo đức', name: 'Làm việc tốt (nhặt của rơi, giúp bạn tiến bộ)', score: 5, icon: 'heart' },
  { id: 'TC_C05', type: 'CONG_DIEM', category: 'Lao động', name: 'Trực nhật lớp sạch sẽ, hoàn thành sớm', score: 5, icon: 'sparkles' },
  { id: 'TC_C06', type: 'CONG_DIEM', category: 'Hoạt động', name: 'Tích cực tham gia văn nghệ, thể thao trường', score: 5, icon: 'zap' },

  // Vi phạm (Trừ điểm)
  { id: 'TC_T01', type: 'TRU_DIEM', category: 'Chuyên cần', name: 'Đi học muộn (sau 7h00)', score: -2, icon: 'clock' },
  { id: 'TC_T02', type: 'TRU_DIEM', category: 'Tác phong', name: 'Không mặc đúng đồng phục / quên khăn quàng', score: -3, icon: 'shirt' },
  { id: 'TC_T03', type: 'TRU_DIEM', category: 'Học tập', name: 'Chưa làm bài tập về nhà / không thuộc bài', score: -5, icon: 'book-open' },
  { id: 'TC_T04', type: 'TRU_DIEM', category: 'Nề nếp', name: 'Mất trật tự, nói chuyện riêng trong giờ học', score: -2, icon: 'volume-2' },
  { id: 'TC_T05', type: 'TRU_DIEM', category: 'Nề nếp', name: 'Sử dụng điện thoại / ăn quà vặt trong lớp', score: -5, icon: 'smartphone' },
  { id: 'TC_T06', type: 'TRU_DIEM', category: 'Lao động', name: 'Trực nhật bẩn hoặc bỏ trực nhật', score: -10, icon: 'trash-2' },
  { id: 'TC_T07', type: 'TRU_DIEM', category: 'Đạo đức', name: 'Nói tục, vô lễ hoặc cãi lại cán bộ lớp', score: -10, icon: 'alert-triangle' },
];

export const INITIAL_HISTORY: ScoreHistoryItem[] = [
  { id: 'GD_01', timestamp: '2026-09-26 07:15:00', week: 'Tuần 4', studentId: 'HS12', studentName: 'Trần Thị Bích', team: 'Tổ 2', criteriaName: 'Đạt điểm 10 bài kiểm tra', scoreChange: 5, scorer: 'GVCN (Cô Loan)', note: 'Điểm 10 môn Toán 15p' },
  { id: 'GD_02', timestamp: '2026-09-26 07:30:00', week: 'Tuần 4', studentId: 'HS24', studentName: 'Nguyễn Thảo My', team: 'Tổ 3', criteriaName: 'Phát biểu bài hay / tích cực xây dựng bài', scoreChange: 2, scorer: 'Tổ trưởng Tổ 3', note: 'Tiết Ngữ văn' },
  { id: 'GD_03', timestamp: '2026-09-26 08:45:00', week: 'Tuần 4', studentId: 'HS09', studentName: 'Ngô Việt Hùng', team: 'Tổ 1', criteriaName: 'Chưa làm bài tập về nhà / không thuộc bài', scoreChange: -5, scorer: 'Lớp trưởng', note: 'Thiếu bài tập Tiếng Anh' },
  { id: 'GD_04', timestamp: '2026-09-26 09:10:00', week: 'Tuần 4', studentId: 'HS06', studentName: 'Vũ Thùy Dương', team: 'Tổ 1', criteriaName: 'Không mặc đúng đồng phục / quên khăn quàng', scoreChange: -3, scorer: 'Tổ trưởng Tổ 1', note: 'Quên khăn quàng đỏ' },
  { id: 'GD_05', timestamp: '2026-09-26 10:20:00', week: 'Tuần 4', studentId: 'HS23', studentName: 'Phạm Đức Thịnh', team: 'Tổ 3', criteriaName: 'Trực nhật lớp sạch sẽ, hoàn thành sớm', scoreChange: 5, scorer: 'GVCN (Cô Loan)', note: 'Lau bảng và xếp bàn thẳng tắp' },
];
