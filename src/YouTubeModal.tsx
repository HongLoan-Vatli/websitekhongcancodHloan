import React, { useState, useEffect } from 'react';
import {
  Youtube,
  X,
  Link as LinkIcon,
  Save,
  Play,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (url: string) => void;
}

/**
 * Extracts standard 11-char YouTube Video ID from various link formats:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 * - https://m.youtube.com/watch?v=dQw4w9WgXcQ
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // If directly an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex matching all common YouTube URL formats
  const regex =
    /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = trimmed.match(regex);
  return match && match[1] ? match[1] : null;
}

const STORAGE_KEY_RAW = 'classroom_6b3_youtube_raw_url';
const STORAGE_KEY_EMBED = 'classroom_6b3_youtube_embed_id';

// Suggested default classroom video samples for teachers
const SAMPLE_VIDEOS = [
  {
    title: 'Hành Khúc Đội TNTP Hồ Chí Minh (Đội Ca)',
    url: 'https://www.youtube.com/watch?v=VqU6V_l59g8',
    category: 'Truyền thống Đội',
  },
  {
    title: 'Bài Ca Người Giáo Viên Nhân Dân (Tri Ân Thầy Cô)',
    url: 'https://www.youtube.com/watch?v=kYyY84k3s14',
    category: 'Ca khúc Thầy Cô',
  },
  {
    title: 'Nhạc Nền Hoạt Náo Học Đường Vui Tươi 6B3',
    url: 'https://www.youtube.com/watch?v=7wtfhZwyrcc',
    category: 'Sôi nổi lớp học',
  },
];

export const YouTubeModal: React.FC<YouTubeModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [inputUrl, setInputUrl] = useState<string>('');
  const [embedVideoId, setEmbedVideoId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Load saved link from localStorage on initial render
  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem(STORAGE_KEY_RAW);
      const savedId = localStorage.getItem(STORAGE_KEY_EMBED);

      if (savedRaw) {
        setInputUrl(savedRaw);
      }
      if (savedId) {
        setEmbedVideoId(savedId);
      } else if (savedRaw) {
        const extracted = extractYouTubeId(savedRaw);
        if (extracted) setEmbedVideoId(extracted);
      }
    } catch {
      // Storage unavailable fallback
    }
  }, []);

  if (!isOpen) return null;

  const handleSaveAndEmbed = (urlToUse?: string) => {
    const targetUrl = urlToUse ?? inputUrl;
    setErrorMessage('');
    setSuccessMessage('');

    if (!targetUrl.trim()) {
      setErrorMessage('Vui lòng dán đường link YouTube vào ô nhập liệu!');
      return;
    }

    const videoId = extractYouTubeId(targetUrl);
    if (!videoId) {
      setErrorMessage(
        'Đường link không đúng định dạng YouTube! Hỗ trợ dạng: https://www.youtube.com/watch?v=... hoặc https://youtu.be/...'
      );
      return;
    }

    // Valid ID: Save to localStorage and state
    setEmbedVideoId(videoId);
    setInputUrl(targetUrl);
    setSuccessMessage('Đã lưu và nhúng video thành công! Video sẵn sàng phát bên dưới.');

    try {
      localStorage.setItem(STORAGE_KEY_RAW, targetUrl.trim());
      localStorage.setItem(STORAGE_KEY_EMBED, videoId);
    } catch {
      // Ignore storage errors
    }

    if (onSaved) {
      onSaved(targetUrl.trim());
    }
  };

  const handleClear = () => {
    setInputUrl('');
    setEmbedVideoId(null);
    setErrorMessage('');
    setSuccessMessage('Đã xóa video.');
    try {
      localStorage.removeItem(STORAGE_KEY_RAW);
      localStorage.removeItem(STORAGE_KEY_EMBED);
    } catch {
      // Ignore
    }
  };

  const embedUrl = embedVideoId
    ? `https://www.youtube.com/embed/${embedVideoId}?autoplay=1&rel=0`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-indigo-700 p-4 md:p-5 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-red-600 flex items-center justify-center text-xl shadow-lg shrink-0">
              <Youtube className="w-6 h-6 fill-red-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-300 text-red-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Đa Phương Tiện 6B3
                </span>
                <span className="text-xs text-red-100 font-semibold">GVCN Cô Nguyễn Thị Hồng Loan</span>
              </div>
              <h3 className="text-lg md:text-xl font-black mt-0.5">Cài đặt Video YouTube</h3>
            </div>
          </div>

          {/* Close button X */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            title="Đóng hộp thoại"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-4 text-slate-800">
          {/* Instructions */}
          <p className="text-xs md:text-sm text-slate-600">
            Dán đường link video YouTube (ví dụ: ca khúc truyền thống, video giới thiệu lớp 6B3, bài giảng mẫu) để nhúng trực tiếp lên bảng điều khiển:
          </p>

          {/* Input & Action Buttons */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    setErrorMessage('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveAndEmbed();
                    }
                  }}
                  placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                  className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all shadow-inner"
                />
                {inputUrl && (
                  <button
                    onClick={() => setInputUrl('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    title="Xóa nội dung"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Button Lưu / Hiển thị */}
              <button
                onClick={() => handleSaveAndEmbed()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs md:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Lưu & Hiển thị</span>
              </button>

              {embedVideoId && (
                <button
                  onClick={handleClear}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 text-xs font-bold transition-colors flex items-center justify-center gap-1 shrink-0"
                  title="Gỡ bỏ video đã nhúng"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Gỡ</span>
                </button>
              )}
            </div>

            {/* Error / Success Feedback Alerts */}
            {errorMessage && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          {/* Video Player Display Area (Responsive 16:9 iframe) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-red-600" />
                <span>Khung hình phát video (16:9)</span>
              </div>
              {embedVideoId && (
                <a
                  href={`https://www.youtube.com/watch?v=${embedVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-red-600 hover:underline flex items-center gap-1"
                >
                  <span>Mở trên YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-300 relative flex items-center justify-center">
              {embedUrl ? (
                <iframe
                  className="w-full h-full"
                  src={embedUrl}
                  title="YouTube video player 6B3"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div className="text-center p-6 text-slate-400 space-y-2">
                  <div className="w-14 h-14 rounded-full bg-slate-800 text-red-500 flex items-center justify-center mx-auto shadow-inner">
                    <Youtube className="w-8 h-8" />
                  </div>
                  <div className="font-bold text-sm text-slate-300">Chưa có video được nhúng</div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Hãy dán đường link YouTube vào ô bên trên và bấm &quot;Lưu &amp; Hiển thị&quot; hoặc chọn một trong các bài hát mẫu bên dưới.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Preset Samples for Classroom */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Gợi ý video ca khúc lớp học 6B3 (Bấm chọn nhanh):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_VIDEOS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputUrl(sample.url);
                    handleSaveAndEmbed(sample.url);
                  }}
                  className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-red-400 bg-slate-50 hover:bg-red-50/50 transition-all text-xs group"
                >
                  <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-0.5">
                    {sample.category}
                  </div>
                  <div className="font-bold text-slate-800 line-clamp-1 group-hover:text-red-700">
                    {sample.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                    {sample.url}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tự động lưu vào trình duyệt (không bị mất khi tải lại F5)</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
