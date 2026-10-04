import React, { useState, useMemo } from 'react';
import {
  MASTER_PROMPT_TITLE,
  MASTER_PROMPT_SECTIONS,
  GOOGLE_APPS_SCRIPT_TEMPLATE,
} from './promptData';
import {
  INITIAL_STUDENTS,
  INITIAL_CRITERIA,
  INITIAL_HISTORY,
  Student,
  Criteria,
  ScoreHistoryItem,
} from './mockData';
import * as XLSX from 'xlsx';
import { StudentPickerGame } from './StudentPickerGame';
import {
  Trophy,
  Award,
  Flame,
  CheckCircle2,
  Copy,
  Download,
  Search,
  Plus,
  Minus,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Smartphone,
  Shield,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  BookOpen,
  Filter,
  UserCheck,
  ChevronRight,
  Code2,
  Dices,
  Music,
  Youtube,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ClassroomMusicManager } from './ClassroomMusicManager';
import { YouTubeModal } from './YouTubeModal';
import { classroomAudio } from './utils/classroomAudioEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<'prompt' | 'demo' | 'game' | 'sheets'>('prompt');
  const [showYouTubeModal, setShowYouTubeModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('sec-1');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  // App 6B3 Interactive State
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [criteria, setCriteria] = useState<Criteria[]>(INITIAL_CRITERIA);
  const [history, setHistory] = useState<ScoreHistoryItem[]>(INITIAL_HISTORY);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');
  const [studentSearch, setStudentSearch] = useState('');
  const [currentRole, setCurrentRole] = useState<'GVCN' | 'Lớp trưởng' | 'Tổ 1' | 'Tổ 2' | 'Tổ 3' | 'Tổ 4'>('GVCN');
  
  // Quick score modal state
  const [isScoringOpen, setIsScoringOpen] = useState(false);
  const [scoringStudent, setScoringStudent] = useState<Student | null>(null);
  const [selectedCriteria, setSelectedCriteria] = useState<Criteria | null>(null);
  const [scoringNote, setScoringNote] = useState('');
  const [scoringSuccessToast, setScoringSuccessToast] = useState<string | null>(null);

  // Full Master Prompt text generator
  const fullMasterPromptText = useMemo(() => {
    let output = `# ${MASTER_PROMPT_TITLE}\n\n`;
    output += `> HỆ THỐNG ĐẶC TẢ CHI TIẾT 35 PHẦN LA MÃ (I ĐẾN XXXV) XÂY DỰNG WEB APP SỔ TAY THI ĐUA LỚP 6B3 - TRƯỜNG THCS CHÂU THÀNH (GVCN: CÔ NGUYỄN THỊ HỒNG LOAN) KẾT HỢP GOOGLE SHEETS & APPS SCRIPT.\n\n`;
    MASTER_PROMPT_SECTIONS.forEach((sec) => {
      output += `## ${sec.roman}. ${sec.title}\n\n${sec.content}\n\n---\n\n`;
    });
    return output;
  }, []);

  // Filtered sections for search
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return MASTER_PROMPT_SECTIONS;
    const q = searchQuery.toLowerCase();
    return MASTER_PROMPT_SECTIONS.filter(
      (sec) =>
        sec.roman.toLowerCase().includes(q) ||
        sec.title.toLowerCase().includes(q) ||
        sec.content.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Copy full prompt handler
  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(fullMasterPromptText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = fullMasterPromptText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    }
  };

  // Copy individual section handler
  const handleCopySection = async (sec: (typeof MASTER_PROMPT_SECTIONS)[0]) => {
    const text = `### ${sec.roman}. ${sec.title}\n\n${sec.content}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSectionId(sec.id);
      setTimeout(() => setCopiedSectionId(null), 2000);
    } catch {
      setCopiedSectionId(sec.id);
      setTimeout(() => setCopiedSectionId(null), 2000);
    }
  };

  // Download markdown file
  const handleDownloadMarkdown = () => {
    const blob = new Blob([fullMasterPromptText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'MASTER_PROMPT_SO_TAY_THI_DUA_6B3_THCS_CHAU_THANH.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 6B3 App calculations
  const teamStats = useMemo(() => {
    const teams = ['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'] as const;
    return teams.map((teamName) => {
      const teamStudents = students.filter((s) => s.team === teamName);
      const totalScore = teamStudents.reduce((acc, s) => acc + s.currentScore, 0);
      const avgScore = teamStudents.length ? Number((totalScore / teamStudents.length).toFixed(1)) : 0;
      const totalViolations = teamStudents.reduce((acc, s) => acc + s.violations, 0);
      const totalCommendations = teamStudents.reduce((acc, s) => acc + s.commendations, 0);
      return {
        teamName,
        totalScore,
        avgScore,
        memberCount: teamStudents.length,
        totalViolations,
        totalCommendations,
      };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }, [students]);

  // Ranked students
  const rankedStudents = useMemo(() => {
    let list = [...students];
    if (selectedTeamFilter !== 'all') {
      list = list.filter((s) => s.team === selectedTeamFilter);
    }
    if (studentSearch.trim()) {
      const q = studentSearch.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
    }
    return list.sort((a, b) => b.currentScore - a.currentScore);
  }, [students, selectedTeamFilter, studentSearch]);

  // Submit scoring
  const handleSaveScore = () => {
    if (!scoringStudent || !selectedCriteria) return;

    const delta = selectedCriteria.score;
    // Update student
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === scoringStudent.id) {
          const newScore = s.currentScore + delta;
          return {
            ...s,
            currentScore: newScore,
            violations: delta < 0 ? s.violations + 1 : s.violations,
            commendations: delta > 0 ? s.commendations + 1 : s.commendations,
            streak: delta > 0 ? 'up' : 'down',
          };
        }
        return s;
      })
    );

    // Add to history
    const newTx: ScoreHistoryItem = {
      id: `GD_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      week: 'Tuần 4',
      studentId: scoringStudent.id,
      studentName: scoringStudent.name,
      team: scoringStudent.team,
      criteriaName: selectedCriteria.name,
      scoreChange: delta,
      scorer: currentRole,
      note: scoringNote || 'Chấm điểm nề nếp',
    };
    setHistory((prev) => [newTx, ...prev]);

    setScoringSuccessToast(
      `Đã ${delta > 0 ? 'cộng' : 'trừ'} ${Math.abs(delta)} điểm cho ${scoringStudent.name} (${scoringStudent.team})!`
    );
    setTimeout(() => setScoringSuccessToast(null), 3000);

    // Reset modal
    setIsScoringOpen(false);
    setSelectedCriteria(null);
    setScoringNote('');
  };

  // Quick score from the Student Picker Game
  const handleQuickScoreFromGame = (student: Student, delta: number, note: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === student.id) {
          const newScore = s.currentScore + delta;
          return {
            ...s,
            currentScore: newScore,
            violations: delta < 0 ? s.violations + 1 : s.violations,
            commendations: delta > 0 ? s.commendations + 1 : s.commendations,
            streak: delta > 0 ? 'up' : 'down',
          };
        }
        return s;
      })
    );

    const newTx: ScoreHistoryItem = {
      id: `GD_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      week: 'Tuần 4',
      studentId: student.id,
      studentName: student.name,
      team: student.team,
      criteriaName: note,
      scoreChange: delta,
      scorer: currentRole === 'GVCN' ? 'GVCN (Cô Loan)' : currentRole,
      note: `[Trò chơi gọi tên] ${note}`,
    };
    setHistory((prev) => [newTx, ...prev]);

    setScoringSuccessToast(
      `[Vòng quay] Đã ${delta > 0 ? 'cộng' : 'trừ'} ${Math.abs(delta)} điểm cho ${student.name} (${student.team})!`
    );
    setTimeout(() => setScoringSuccessToast(null), 3500);
  };

  // Rollback scoring item
  const handleRollback = (item: ScoreHistoryItem) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === item.studentId) {
          return {
            ...s,
            currentScore: s.currentScore - item.scoreChange,
            violations: item.scoreChange < 0 ? Math.max(0, s.violations - 1) : s.violations,
            commendations: item.scoreChange > 0 ? Math.max(0, s.commendations - 1) : s.commendations,
          };
        }
        return s;
      })
    );
    setHistory((prev) => prev.filter((h) => h.id !== item.id));
    setScoringSuccessToast(`Đã hoàn tác lượt chấm của ${item.studentName}!`);
    setTimeout(() => setScoringSuccessToast(null), 2500);
  };

  // Export to Excel (.xlsx) using SheetJS
  const handleExportExcel = () => {
    // 1. Team Summary Sheet
    const teamData = teamStats.map((t, idx) => ({
      'Xếp Hạng': `Hạng ${idx + 1}`,
      'Tổ Thi Đua': t.teamName,
      'Tổng Điểm': t.totalScore,
      'Điểm Trung Bình': t.avgScore,
      'Số Thành Viên': t.memberCount,
      'Số Lần Khen Thưởng': t.totalCommendations,
      'Số Lần Vi Phạm': t.totalViolations,
      'Danh Hiệu': idx === 0 ? 'CỜ LUÂN LƯU QUÁN QUÂN' : idx === 1 ? 'Á QUÂN' : idx === 2 ? 'HẠNG BA' : 'CẦN BỨT PHÁ',
    }));

    // 2. Student Sheet
    const studentData = students.map((s) => ({
      'Mã HS': s.id,
      'Họ và Tên': s.name,
      'Giới Tính': s.gender,
      'Tổ': s.team,
      'Chức Vụ': s.role,
      'Điểm Đầu Tuần': s.initialScore,
      'Điểm Hiện Tại': s.currentScore,
      'Số Lần Khen': s.commendations,
      'Số Lần Phạt': s.violations,
      'Xếp Loại': s.currentScore >= 110 ? 'Xuất Sắc' : s.currentScore >= 100 ? 'Tốt' : s.currentScore >= 95 ? 'Khá' : 'Cần Cố Gắng',
    }));

    // 3. History Sheet
    const historyData = history.map((h) => ({
      'Mã GD': h.id,
      'Thời Gian': h.timestamp,
      'Tuần': h.week,
      'Mã HS': h.studentId,
      'Họ Tên': h.studentName,
      'Tổ': h.team,
      'Nội Dung': h.criteriaName,
      'Biến Động Điểm': h.scoreChange > 0 ? `+${h.scoreChange}` : h.scoreChange,
      'Người Chấm': h.scorer,
      'Ghi Chú': h.note,
    }));

    const wb = XLSX.utils.book_new();
    
    // Cover / Info Sheet
    const infoData = [
      { 'Thông Tin': 'Trường', 'Nội Dung': 'Trường THCS Châu Thành' },
      { 'Thông Tin': 'Lớp', 'Nội Dung': 'Lớp 6B3' },
      { 'Thông Tin': 'Giáo Viên Chủ Nhiệm (GVCN)', 'Nội Dung': 'Cô Nguyễn Thị Hồng Loan' },
      { 'Thông Tin': 'Niên Khóa', 'Nội Dung': '2026 - 2027' },
      { 'Thông Tin': 'Đợt Thi Đua', 'Nội Dung': 'Tuần 4 - Đợt thi đua chào mừng ngày 20/11' },
      { 'Thông Tin': 'Thời Điểm Xuất', 'Nội Dung': new Date().toLocaleString('vi-VN') },
      { 'Thông Tin': 'Người Lập & Ký Duyệt', 'Nội Dung': 'Lớp trưởng Trần Thị Bích - GVCN Nguyễn Thị Hồng Loan' },
    ];
    const wsInfo = XLSX.utils.json_to_sheet(infoData);
    const wsTeams = XLSX.utils.json_to_sheet(teamData);
    const wsStudents = XLSX.utils.json_to_sheet(studentData);
    const wsHistory = XLSX.utils.json_to_sheet(historyData);

    XLSX.utils.book_append_sheet(wb, wsInfo, 'THONG_TIN_CHUNG');
    XLSX.utils.book_append_sheet(wb, wsTeams, 'BANG_XEP_HANG_TO');
    XLSX.utils.book_append_sheet(wb, wsStudents, 'DANH_SACH_HOC_SINH');
    XLSX.utils.book_append_sheet(wb, wsHistory, 'NHAT_KY_CHAM_DIEM');

    XLSX.writeFile(wb, 'BAO_CAO_THI_DUA_LOP_6B3_THCS_CHAU_THANH_GVCN_NGUYEN_THI_HONG_LOAN.xlsx');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header Banner */}
      <header className="bg-gradient-to-r from-red-600 via-red-500 to-blue-600 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-xl border border-white/30 shadow-inner">
              <span className="text-yellow-300">★</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-extrabold tracking-tight">SỔ TAY THI ĐUA LỚP 6B3</h1>
                <span className="bg-yellow-400 text-red-900 text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  THCS Châu Thành
                </span>
              </div>
              <p className="text-xs text-red-100 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-yellow-200">GVCN: Cô Nguyễn Thị Hồng Loan</span>
                <span className="opacity-75">•</span>
                <span>Master Prompt Kỹ Thuật (35 Phần)</span>
                <span className="opacity-75">•</span>
                <span className="bg-white/20 px-1.5 py-0.2 rounded text-[11px]">Niên khóa 2026-2027</span>
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl backdrop-blur-md">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'prompt'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Master Prompt (35 Phần)</span>
            </button>
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'demo'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Mô Phỏng App 6B3</span>
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                Live
              </span>
            </button>
            <button
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'game'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <Dices className="w-4 h-4 text-purple-400" />
              <span>🎮 Trò Chơi Gọi Tên (Đua Vịt • Kho Báu)</span>
              <span className="bg-yellow-400 text-purple-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                HOT
              </span>
            </button>
            <button
              onClick={() => setActiveTab('sheets')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'sheets'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Google Sheets & GAS</span>
            </button>

            {/* YouTube Embed Modal Trigger */}
            <button
              onClick={() => setShowYouTubeModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs md:text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm ring-1 ring-white/30 transition-all active:scale-95"
              title="Cài đặt Video YouTube"
            >
              <Youtube className="w-4 h-4 fill-white" />
              <span className="hidden sm:inline">YouTube</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-6">
        {/* ============================================================== */}
        {/* TAB 1: MASTER PROMPT CHUẨN 35 PHẦN LA MÃ                       */}
        {/* ============================================================== */}
        {activeTab === 'prompt' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sidebar: Navigation & Quick Jump */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sticky top-20 max-h-[calc(100vh-6.5rem)] flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-red-500" />
                  <span className="font-bold text-sm text-slate-800">Mục lục 35 Phần La Mã</span>
                </div>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                  I → XXXV
                </span>
              </div>

              {/* Search in Master Prompt */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm nội dung (VD: Sheets, Leaderboard, Mã PIN)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 border border-transparent focus:bg-white focus:border-red-400 focus:outline-none transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={handleCopyAll}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  {copiedAll ? <CheckCircle2 className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'Đã sao chép!' : 'Chép toàn bộ'}</span>
                </button>
                <button
                  onClick={handleDownloadMarkdown}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải file .MD</span>
                </button>
              </div>

              {/* Section List */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-1 divide-y divide-slate-100 text-xs">
                {filteredSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setSelectedSectionId(sec.id);
                      const el = document.getElementById(sec.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`w-full text-left py-2 px-2.5 rounded-lg flex items-center justify-between transition-colors ${
                      selectedSectionId === sec.id
                        ? 'bg-red-50 text-red-700 font-bold border-l-4 border-red-500'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-red-600 font-extrabold w-8 shrink-0">{sec.roman}.</span>
                      <span className="truncate">{sec.title}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Pane: Full Detailed Master Prompt Text */}
            <div className="lg:col-span-8 space-y-6">
              {/* Header Card with Copy Banner */}
              <div className="bg-gradient-to-br from-red-600 to-blue-700 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
                  <div>
                    <span className="inline-block bg-yellow-400 text-red-900 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full mb-1 uppercase tracking-wide">
                      Chỉ thị thi công cho Cursor / v0 / Bolt / Claude
                    </span>
                    <h2 className="text-xl md:text-2xl font-black">CÂU LỆNH TẠO WEB APP SIÊU CHI TIẾT (MASTER PROMPT)</h2>
                    <p className="text-xs text-red-100 mt-1 max-w-xl">
                      Bao gồm đầy đủ 35 phần La Mã từ I đến XXXV. Tích hợp Google Sheets, Google Apps Script, Bảng xếp hạng Esports, Chấm điểm nhanh trên mobile và 15 bước kiểm thử thực tế.
                    </p>
                  </div>
                  <button
                    onClick={handleCopyAll}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-red-600 font-black text-xs md:text-sm shadow-lg hover:bg-yellow-300 hover:text-red-900 transition-all active:scale-95 shrink-0"
                  >
                    {copiedAll ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedAll ? 'ĐÃ SAO CHÉP TOÀN BỘ (35 PHẦN)!' : 'SAO CHÉP MASTER PROMPT'}</span>
                  </button>
                </div>
              </div>

              {/* Sections Display */}
              <div className="space-y-4">
                {filteredSections.map((sec) => (
                  <div
                    key={sec.id}
                    id={sec.id}
                    className={`bg-white rounded-2xl border transition-all p-5 shadow-sm scroll-mt-24 ${
                      selectedSectionId === sec.id ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-mono font-black text-sm flex items-center justify-center shadow-sm">
                          {sec.roman}
                        </span>
                        <h3 className="font-extrabold text-base text-slate-800">{sec.title}</h3>
                      </div>
                      <button
                        onClick={() => handleCopySection(sec)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-semibold transition-colors"
                        title="Sao chép riêng phần này"
                      >
                        {copiedSectionId === sec.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600 font-bold">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Chép phần {sec.roman}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                      {sec.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: MÔ PHỎNG GIAO DIỆN WEB APP 6B3 (LIVE PROTOTYPE)         */}
        {/* ============================================================== */}
        {activeTab === 'demo' && (
          <div className="space-y-6">
            {/* Red Form: Role Authentication & Classroom Controls */}
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-indigo-700 text-white rounded-3xl p-4 md:p-5 shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-300 text-red-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Đăng Nhập Phân Quyền 6B3
                      </span>
                      <span className="text-xs text-red-100 font-semibold">
                        {currentRole === 'GVCN' ? 'Master Admin' : 'Cán sự lớp'}
                      </span>
                    </div>
                    <div className="font-black text-white text-base md:text-lg flex items-center gap-2 mt-0.5">
                      <span>{currentRole === 'GVCN' ? 'GVCN: Cô Nguyễn Thị Hồng Loan' : `Quyền: ${currentRole}`}</span>
                      <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-md">
                        {currentRole === 'GVCN' ? 'Mã PIN: 6868' : currentRole === 'Lớp trưởng' ? 'Mã PIN: 1234' : 'Mã PIN: 0001-0004'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sound, Music & YouTube controls in the top right of the red login form */}
                <div className="flex items-center gap-2 bg-black/25 p-1.5 rounded-2xl backdrop-blur-md self-end md:self-auto">
                  <button
                    onClick={() => {
                      if (classroomAudio.getIsPlaying()) {
                        classroomAudio.stop();
                      } else {
                        classroomAudio.playTrack('joyful_classroom');
                      }
                    }}
                    className="p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white"
                    title="Phát / Tắt Nhạc Nền"
                  >
                    <Music className="w-4 h-4 text-amber-300" />
                    <span className="text-xs hidden sm:inline">Nhạc nền</span>
                  </button>

                  <button
                    onClick={() => {
                      const cur = classroomAudio.getVolume();
                      classroomAudio.setVolume(cur > 0 ? 0 : 0.65);
                    }}
                    className="p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white"
                    title="Bật / Tắt Loa"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="text-xs hidden sm:inline">Loa</span>
                  </button>

                  {/* YouTube Icon Button right next to sound/music controls */}
                  <button
                    onClick={() => setShowYouTubeModal(true)}
                    className="p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white shadow-md ring-2 ring-white/30 active:scale-95"
                    title="Cài đặt & Phát Video YouTube"
                  >
                    <Youtube className="w-4 h-4 fill-white" />
                    <span className="text-xs font-black">YouTube</span>
                  </button>
                </div>
              </div>

              {/* Role Select Buttons & Actions */}
              <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-yellow-200 mr-1">Chuyển vai trò:</span>
                  {(['GVCN', 'Lớp trưởng', 'Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setCurrentRole(r)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        currentRole === r
                          ? 'bg-yellow-400 text-red-950 font-black ring-2 ring-white shadow-sm scale-105'
                          : 'bg-white/15 text-white hover:bg-white/25'
                      }`}
                    >
                      {r === 'GVCN' ? 'GVCN (Cô Loan)' : r}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('game')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-red-950 text-xs font-black shadow-md transition-all active:scale-95"
                  >
                    <Dices className="w-4 h-4" />
                    <span>🦆 Đua Vịt 10 Làn</span>
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all active:scale-95"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Xuất Excel</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Toast */}
            {scoringSuccessToast && (
              <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-lg flex items-center justify-between text-xs md:text-sm font-bold animate-bounce">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  <span>{scoringSuccessToast}</span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Realtime Sheet Sync</span>
              </div>
            )}

            {/* Top Leading Squad Banner (Esports Style) */}
            <div className="bg-gradient-to-r from-red-600 via-rose-500 to-blue-600 rounded-3xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4 text-center md:text-left">
                  <div className="w-16 h-16 rounded-2xl bg-yellow-400 text-red-900 flex items-center justify-center text-3xl shadow-lg border-2 border-yellow-200 animate-pulse">
                    🏆
                  </div>
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="bg-yellow-300 text-red-950 font-black text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Cờ Đỏ Luân Lưu Lớp 6B3
                      </span>
                      <span className="text-xs text-red-100 font-semibold">Tuần 4</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black mt-1">
                      {teamStats[0]?.teamName} - ĐỘI QUÁN QUÂN DẪN ĐẦU!
                    </h2>
                    <p className="text-xs md:text-sm text-red-100">
                      Tổng điểm: <span className="font-black text-yellow-300 text-base">{teamStats[0]?.totalScore}đ</span> (Trung bình {teamStats[0]?.avgScore}đ/bạn) • Vượt tổ kế tiếp +{teamStats[0]?.totalScore - (teamStats[1]?.totalScore || 0)}đ
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
                  <div className="text-center px-3 py-1">
                    <div className="text-[11px] text-red-100">Tổng điểm thưởng</div>
                    <div className="text-lg font-black text-yellow-300">+{teamStats.reduce((a, b) => a + b.totalCommendations * 5, 0)}</div>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center px-3 py-1">
                    <div className="text-[11px] text-red-100">Số lỗi vi phạm</div>
                    <div className="text-lg font-black text-white">{teamStats.reduce((a, b) => a + b.totalViolations, 0)}</div>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center px-3 py-1">
                    <div className="text-[11px] text-red-100">Tỷ lệ nề nếp</div>
                    <div className="text-lg font-black text-green-300">98.6%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Podium 3D Esports Arena: 4 Teams */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {teamStats.map((team, idx) => {
                const isTop1 = idx === 0;
                const isTop2 = idx === 1;
                const isTop3 = idx === 2;
                return (
                  <div
                    key={team.teamName}
                    className={`rounded-2xl p-4 transition-all relative border flex flex-col justify-between ${
                      isTop1
                        ? 'bg-gradient-to-b from-yellow-50 to-amber-100/60 border-yellow-400 shadow-md ring-2 ring-yellow-200'
                        : isTop2
                        ? 'bg-slate-50 border-slate-300 shadow-sm'
                        : isTop3
                        ? 'bg-orange-50/50 border-orange-300 shadow-sm'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-full ${
                          isTop1
                            ? 'bg-yellow-400 text-yellow-950'
                            : isTop2
                            ? 'bg-slate-300 text-slate-800'
                            : isTop3
                            ? 'bg-amber-300 text-amber-900'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        HẠNG #{idx + 1}
                      </span>
                      {isTop1 ? (
                        <Trophy className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold">{team.memberCount} bạn</span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-black text-slate-800 text-base">{team.teamName}</h3>
                      <div className="text-2xl font-black text-red-600 mt-0.5">{team.totalScore} <span className="text-xs font-normal text-slate-500">điểm</span></div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                        <span>ĐTB: <b>{team.avgScore}</b></span>
                        <span className="text-green-600 font-bold">+{team.totalCommendations} thưởng</span>
                        <span className="text-red-500 font-bold">-{team.totalViolations} lỗi</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedTeamFilter(team.teamName)}
                      className="mt-3 w-full py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <Filter className="w-3 h-3" />
                      <span>Xem thành viên</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick Scoring Table & Student Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Student Emulation List (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black text-base text-slate-800 flex items-center gap-2">
                      <Award className="w-5 h-5 text-red-500" />
                      <span>Bảng Xếp Hạng 45 Học Sinh 6B3</span>
                    </h3>
                    <p className="text-xs text-slate-500">Chạm vào học sinh để thực hiện Chấm điểm nhanh (Cộng/Trừ)</p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1">
                    {['all', 'Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTeamFilter(t)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                          selectedTeamFilter === t
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {t === 'all' ? 'Tất cả' : t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search in Student List */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên học sinh hoặc mã HS (VD: Trần Thị Bích, HS12)..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-400 focus:outline-none transition-all"
                  />
                </div>

                {/* Student Item Rows */}
                <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                  {rankedStudents.map((st, index) => {
                    const rank = index + 1;
                    return (
                      <div
                        key={st.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-red-200 hover:bg-red-50/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          {/* Rank badge */}
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                              rank === 1
                                ? 'bg-yellow-400 text-yellow-950 shadow-sm'
                                : rank === 2
                                ? 'bg-slate-300 text-slate-800'
                                : rank === 3
                                ? 'bg-amber-300 text-amber-950'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            #{rank}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-slate-800">{st.name}</span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                                {st.team}
                              </span>
                              {st.role !== 'Thành viên' && (
                                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-bold">
                                  {st.role}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2">
                              <span>Mã: {st.id}</span>
                              <span>•</span>
                              <span className="text-green-600 font-semibold">{st.commendations} thưởng</span>
                              <span>•</span>
                              <span className="text-red-500 font-semibold">{st.violations} lỗi</span>
                            </div>
                          </div>
                        </div>

                        {/* Right side: Score & Action Button */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-black text-base text-red-600 flex items-center gap-1 justify-end">
                              <span>{st.currentScore}đ</span>
                              {st.streak === 'up' && <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />}
                              {st.streak === 'down' && <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />}
                            </div>
                            <span className="text-[10px] text-slate-400">gốc 100đ</span>
                          </div>

                          <button
                            onClick={() => {
                              setScoringStudent(st);
                              setIsScoringOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1 shrink-0"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Chấm điểm</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Realtime History & Class Emulation Report (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                {/* Recent scoring history */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>Nhật Ký Chấm Điểm Mới</span>
                    </h3>
                    <span className="text-[11px] text-slate-400">{history.length} lượt</span>
                  </div>

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {history.map((item) => (
                      <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800">{item.studentName}</span>
                          <span
                            className={`font-black text-xs px-1.5 py-0.2 rounded ${
                              item.scoreChange > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {item.scoreChange > 0 ? `+${item.scoreChange}đ` : `${item.scoreChange}đ`}
                          </span>
                        </div>
                        <div className="text-slate-600 text-[11px]">{item.criteriaName}</div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                          <span>Bởi: {item.scorer} • {item.timestamp}</span>
                          {currentRole === 'GVCN' && (
                            <button
                              onClick={() => handleRollback(item)}
                              className="text-red-500 hover:text-red-700 font-bold flex items-center gap-0.5"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Hoàn tác</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Class Meeting Quick Summary Card */}
                <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-4 shadow-md">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-yellow-300 font-bold text-xs uppercase tracking-wider">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span>Báo Cáo Tiết Sinh Hoạt Lớp 6B3</span>
                    </div>
                    <span className="text-[10px] bg-red-600/80 px-2 py-0.5 rounded-full font-bold">
                      Cô Hồng Loan
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 mb-2">
                    GVCN: <span className="font-bold text-white">Cô Nguyễn Thị Hồng Loan</span>
                  </div>
                  <h4 className="font-black text-sm mb-2 text-yellow-200">Top 3 Gương Mặt Xuất Sắc Tuần 4</h4>
                  <div className="space-y-1.5 text-xs">
                    {rankedStudents.slice(0, 3).map((s, idx) => (
                      <div key={s.id} className="flex items-center justify-between bg-white/10 p-1.5 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <span className="text-yellow-400 font-bold">#{idx + 1}</span>
                          <span className="font-semibold">{s.name}</span>
                          <span className="text-[10px] opacity-70">({s.team})</span>
                        </span>
                        <span className="font-black text-yellow-300">{s.currentScore}đ</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-300">Cần nhắc nhở:</span>
                    <span className="text-red-300 font-bold">
                      {students.filter((s) => s.currentScore < 100).length} học sinh &lt; 100đ
                    </span>
                  </div>

                  {/* Note from GVCN */}
                  <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px]">
                    <span className="text-yellow-300 font-bold block mb-1">Lời dặn của GVCN Nguyễn Thị Hồng Loan:</span>
                    <p className="italic text-slate-200 bg-white/5 p-2 rounded-lg border border-white/10">
                      "Tổ 3 duy trì nề nếp rất tốt! Tuần tới cả lớp tập trung giữ trật tự 15 phút đầu giờ, nghiêm túc xếp hàng chào cờ và đeo khăn quàng đỏ đầy đủ."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Scoring Modal (Bottom Sheet / Popup) */}
            {isScoringOpen && scoringStudent && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div>
                      <span className="text-xs text-slate-400 font-semibold">Chấm điểm thi đua</span>
                      <h3 className="font-black text-lg text-slate-800">
                        {scoringStudent.name} <span className="text-sm font-normal text-slate-500">({scoringStudent.team} - {scoringStudent.id})</span>
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsScoringOpen(false)}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Criteria Tabs */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 block">Bước 1: Chọn tiêu chí chấm điểm</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {criteria.map((c) => {
                        const isGood = c.type === 'CONG_DIEM';
                        const isSelected = selectedCriteria?.id === c.id;
                        return (
                          <button
                            key={c.id}
                            onClick={() => setSelectedCriteria(c)}
                            className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2 ${
                              isSelected
                                ? isGood
                                  ? 'bg-green-50 border-green-500 ring-2 ring-green-200'
                                  : 'bg-red-50 border-red-500 ring-2 ring-red-200'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                isGood ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                              }`}
                            >
                              {isGood ? <Plus className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-slate-800 truncate">{c.name}</div>
                              <div className="flex items-center justify-between text-[11px] mt-0.5">
                                <span className="text-slate-400">{c.category}</span>
                                <span className={`font-black ${isGood ? 'text-green-600' : 'text-red-600'}`}>
                                  {isGood ? `+${c.score}đ` : `${c.score}đ`}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Step 2: Note */}
                    <div className="pt-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Bước 2: Ghi chú sự vụ / Minh chứng</label>
                      <input
                        type="text"
                        placeholder="VD: Tiết 2 môn Toán, Quên mang vở bài tập..."
                        value={scoringNote}
                        onChange={(e) => setScoringNote(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-400 focus:outline-none"
                      />
                    </div>

                    {/* Step 3: Save button */}
                    <div className="pt-3 flex items-center gap-2">
                      <button
                        onClick={() => setIsScoringOpen(false)}
                        className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                      >
                        Hủy
                      </button>
                      <button
                        disabled={!selectedCriteria}
                        onClick={handleSaveScore}
                        className={`flex-1 py-2.5 rounded-xl font-black text-xs text-white shadow-md transition-all ${
                          selectedCriteria
                            ? selectedCriteria.type === 'CONG_DIEM'
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-red-600 hover:bg-red-700'
                            : 'bg-slate-300 cursor-not-allowed'
                        }`}
                      >
                        {selectedCriteria
                          ? `XÁC NHẬN LƯU (${selectedCriteria.score > 0 ? `+${selectedCriteria.score}` : selectedCriteria.score} ĐIỂM)`
                          : 'VUI LÒNG CHỌN TIÊU CHÍ'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: TRÒ CHƠI GỌI TÊN HỌC SINH (VÒNG QUAY MAY MẮN)          */}
        {/* ============================================================== */}
        {activeTab === 'game' && (
          <div className="space-y-6">
            <StudentPickerGame
              students={students}
              currentRole={currentRole}
              onQuickScore={handleQuickScoreFromGame}
              onOpenScoringModal={(student) => {
                setScoringStudent(student);
                setIsScoringOpen(true);
                setActiveTab('demo');
              }}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: GOOGLE SHEETS & APPS SCRIPT BACKEND TEMPLATE            */}
        {/* ============================================================== */}
        {activeTab === 'sheets' && (
          <div className="space-y-6">
            {/* Instruction Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-800">
                    Cấu Trúc Google Sheets & Mã Nguồn Google Apps Script (Code.gs)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Hướng dẫn 3 bước để biến 1 Google Sheet thành Database thời gian thực miễn phí 100% cho lớp 6B3
                  </p>
                </div>
              </div>

              {/* 3 Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs my-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-black text-slate-800 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>Tạo Google Spreadsheet</span>
                  </div>
                  <p className="text-slate-600">
                    Tạo bảng tính đặt tên: <b>DB_SO_TAY_THI_DUA_6B3_CHAU_THANH</b> và tạo đúng 5 Sheet theo đặc tả phần VII đến XII.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-black text-slate-800 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
                    <span>Mở Apps Script</span>
                  </div>
                  <p className="text-slate-600">
                    Vào menu <b>Tiện ích mở rộng → Apps Script</b>, xóa code cũ và dán toàn bộ đoạn code bên dưới vào file <b>Code.gs</b>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-black text-slate-800 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                    <span>Triển Khai Web App</span>
                  </div>
                  <p className="text-slate-600">
                    Bấm <b>Triển khai → Tùy chọn triển khai mới → Ứng dụng web</b>. Đặt quyền truy cập: <b>Bất kỳ ai (Anyone)</b>.
                  </p>
                </div>
              </div>

              {/* Copy Script Button */}
              <div className="flex items-center justify-between bg-slate-900 text-white p-3 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <Code2 className="w-4 h-4" />
                  <span>Code.gs (Google Apps Script API Engine)</span>
                </div>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
                    } catch {
                      const ta = document.createElement('textarea');
                      ta.value = GOOGLE_APPS_SCRIPT_TEMPLATE;
                      document.body.appendChild(ta);
                      ta.select();
                      document.execCommand('copy');
                      document.body.removeChild(ta);
                    }
                    setCopiedScript(true);
                    setTimeout(() => setCopiedScript(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all active:scale-95"
                >
                  {copiedScript ? <CheckCircle2 className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Đã sao chép Code.gs!' : 'Sao chép mã Code.gs'}</span>
                </button>
              </div>

              {/* Code display */}
              <pre className="mt-3 p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto max-h-[420px] leading-relaxed border border-slate-800">
                {GOOGLE_APPS_SCRIPT_TEMPLATE}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-red-500 font-bold">LỚP 6B3</span>
            <span>•</span>
            <span className="text-white font-medium">Trường THCS Châu Thành</span>
            <span>•</span>
            <span className="text-yellow-400 font-bold">GVCN: Cô Nguyễn Thị Hồng Loan</span>
            <span>•</span>
            <span>Sổ Tay Thi Đua Thông Minh</span>
          </div>
          <div className="text-slate-500">
            Hệ thống Master Prompt 35 Phần La Mã dành cho AI Lập trình (Cursor / v0 / Bolt)
          </div>
        </div>
      </footer>

      {/* Classroom Music & Sound System */}
      <ClassroomMusicManager onNotify={(msg) => setScoringSuccessToast(msg)} />

      {/* YouTube Video Player Modal */}
      <YouTubeModal
        isOpen={showYouTubeModal}
        onClose={() => setShowYouTubeModal(false)}
      />
    </div>
  );
}
