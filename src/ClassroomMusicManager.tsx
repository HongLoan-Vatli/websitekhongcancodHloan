import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  Upload,
  Sparkles,
  Sliders,
  CheckCircle2,
  ListMusic,
  Radio,
  FileAudio,
  Trash2,
  X,
  Headphones,
} from 'lucide-react';
import {
  classroomAudio,
  BUILTIN_TRACKS,
  BuiltinTrackId,
  MusicTrack,
} from './utils/classroomAudioEngine';

interface ClassroomMusicManagerProps {
  onNotify?: (message: string) => void;
}

export const ClassroomMusicManager: React.FC<ClassroomMusicManagerProps> = ({ onNotify }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState<number>(0.65);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState<string>('joyful_classroom');

  // Custom uploaded file state
  const [customFile, setCustomFile] = useState<{
    name: string;
    url: string;
    size: string;
  } | null>(null);

  const customAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync volume
  useEffect(() => {
    const effectiveVol = isMuted ? 0 : volume;
    classroomAudio.setVolume(effectiveVol);
    if (customAudioRef.current) {
      customAudioRef.current.volume = effectiveVol;
    }
  }, [volume, isMuted]);

  // Handle Play / Pause
  const handleTogglePlay = () => {
    if (isPlaying) {
      // Pause all
      classroomAudio.stop();
      if (customAudioRef.current) {
        customAudioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      // Start active track
      startActiveTrack(selectedTrackId);
    }
  };

  const startActiveTrack = (trackId: string) => {
    if (trackId === 'custom' && customFile) {
      classroomAudio.stop();
      if (customAudioRef.current) {
        customAudioRef.current.play().catch(() => {
          // Auto-play policy fallback
        });
      }
      setSelectedTrackId('custom');
      setIsPlaying(true);
      if (onNotify) onNotify(`Đang phát: ${customFile.name}`);
    } else {
      if (customAudioRef.current) {
        customAudioRef.current.pause();
      }
      classroomAudio.playTrack(trackId as BuiltinTrackId);
      setSelectedTrackId(trackId);
      setIsPlaying(true);
      const trackObj = BUILTIN_TRACKS.find((t) => t.id === trackId);
      if (onNotify && trackObj) {
        onNotify(`Đang phát nhạc nền: ${trackObj.name}`);
      }
    }
  };

  // Switch Track
  const handleSelectTrack = (trackId: string) => {
    setSelectedTrackId(trackId);
    if (isPlaying) {
      startActiveTrack(trackId);
    }
  };

  // Upload Custom File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check audio type
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|ogg|aac|flac)$/i)) {
      alert('Vui lòng chọn file âm thanh hợp lệ (.mp3, .wav, .m4a, .ogg)!');
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    setCustomFile({
      name: file.name,
      url: fileUrl,
      size: sizeStr,
    });

    // Auto switch to custom track and play
    setTimeout(() => {
      setSelectedTrackId('custom');
      if (customAudioRef.current) {
        customAudioRef.current.src = fileUrl;
        customAudioRef.current.volume = isMuted ? 0 : volume;
        customAudioRef.current.play().then(() => {
          classroomAudio.stop();
          setIsPlaying(true);
          if (onNotify) onNotify(`Đã tải và đang phát: ${file.name}`);
        }).catch(() => {
          // Autoplay fallback
          setIsPlaying(false);
        });
      }
    }, 150);
  };

  const handleRemoveCustomFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (customAudioRef.current) {
      customAudioRef.current.pause();
    }
    if (customFile?.url) {
      URL.revokeObjectURL(customFile.url);
    }
    setCustomFile(null);
    if (selectedTrackId === 'custom') {
      setSelectedTrackId('joyful_classroom');
      if (isPlaying) {
        classroomAudio.playTrack('joyful_classroom');
      }
    }
  };

  const currentTrackName =
    selectedTrackId === 'custom' && customFile
      ? customFile.name
      : BUILTIN_TRACKS.find((t) => t.id === selectedTrackId)?.name || 'Giai Điệu Vui Tươi 6B3';

  return (
    <>
      {/* Hidden audio element for custom file playback */}
      <audio
        ref={customAudioRef}
        loop
        onEnded={() => {
          if (customAudioRef.current) {
            customAudioRef.current.currentTime = 0;
            customAudioRef.current.play();
          }
        }}
      />

      {/* Floating Mini Music Bar (Fixed at Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-slate-900/95 text-white p-2 md:p-2.5 rounded-2xl shadow-2xl backdrop-blur-md border border-slate-700/80 transition-all hover:scale-102">
        {/* Animated Equalizer or Music Icon */}
        <div
          onClick={() => setIsOpen(true)}
          className="cursor-pointer flex items-center gap-2 pl-1 pr-1.5"
          title="Bấm để mở Studio Âm Nhạc Lớp Học"
        >
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-4 w-4 text-amber-400">
              <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
              <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.1s] h-4" />
              <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.2s] h-2" />
              <span className="w-1 bg-amber-400 rounded-full animate-bounce h-3.5" />
            </div>
          ) : (
            <Music className="w-4 h-4 text-slate-400" />
          )}

          <div className="hidden sm:block text-left max-w-[130px] md:max-w-[170px]">
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <span>{isPlaying ? 'Đang phát' : 'Nhạc Nền'}</span>
              {selectedTrackId === 'custom' && (
                <span className="bg-emerald-500 text-white text-[8px] px-1 rounded">FILE</span>
              )}
            </div>
            <div className="text-xs font-bold truncate text-slate-100">
              {currentTrackName}
            </div>
          </div>
        </div>

        {/* Play / Pause Quick Button */}
        <button
          onClick={handleTogglePlay}
          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all shadow-md active:scale-90 ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-300'
              : 'bg-white hover:bg-slate-100 text-slate-900'
          }`}
          title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc nền'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-900 ml-0.5" />}
        </button>

        {/* Volume / Mute Quick Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            isMuted ? 'text-red-400 bg-red-950/40' : 'text-slate-300 hover:text-white'
          }`}
          title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Open Full Studio Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Cài đặt & Danh sách bài hát"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>

      {/* Full Music Studio Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
                  🎶
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-yellow-300 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      Lớp 6B3 • GVCN Cô Hồng Loan
                    </span>
                  </div>
                  <h3 className="text-lg font-black mt-0.5">TRÌNH PHÁT NHẠC NỀN LỚP HỌC</h3>
                  <p className="text-xs text-rose-100">
                    Khuấy động không khí học tập, giờ thi đua và các trò chơi sôi nổi!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Currently Playing Card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-md ${
                    isPlaying ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isPlaying ? '🎧' : '⏸️'}
                  </div>
                  <div>
                    <div className="text-[11px] text-amber-800 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span>{isPlaying ? 'Đang phát trực tiếp' : 'Tạm dừng'}</span>
                      {isPlaying && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                      )}
                    </div>
                    <div className="text-sm font-black text-slate-900 mt-0.5 max-w-[200px] truncate">
                      {currentTrackName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {selectedTrackId === 'custom'
                        ? 'Nhạc do Thầy/Cô tự tải lên'
                        : BUILTIN_TRACKS.find((t) => t.id === selectedTrackId)?.genre || 'Acoustic Classroom'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleTogglePlay}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 ${
                    isPlaying
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Tạm dừng</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Phát ngay</span>
                    </>
                  )}
                </button>
              </div>

              {/* Volume Slider Bar */}
              <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Headphones className="w-4 h-4 text-amber-600" />
                    <span>Âm lượng nhạc nền</span>
                  </div>
                  <span className="text-slate-900 font-mono font-black">{Math.round(isMuted ? 0 : volume * 100)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-slate-500 hover:text-slate-800"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setIsMuted(false);
                      setVolume(parseFloat(e.target.value));
                    }}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Upload Custom Audio File Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Tải file nhạc của Thầy/Cô (MP3, WAV, M4A)</span>
                  </span>
                  <span className="text-[11px] text-indigo-600 font-bold">Tự do chèn bài yêu thích</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {customFile ? (
                  <div
                    onClick={() => handleSelectTrack('custom')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedTrackId === 'custom'
                        ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <FileAudio className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900 truncate">{customFile.name}</span>
                          <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0">
                            {customFile.size}
                          </span>
                        </div>
                        <div className="text-[11px] text-indigo-700 font-medium">
                          {selectedTrackId === 'custom' && isPlaying ? 'Đang phát bài này • Bấm để dừng' : 'Bấm để phát bài này'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedTrackId === 'custom' && isPlaying) {
                            handleTogglePlay();
                          } else {
                            startActiveTrack('custom');
                          }
                        }}
                        className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 shadow-sm"
                        title="Phát / Dừng"
                      >
                        {selectedTrackId === 'custom' && isPlaying ? (
                          <Pause className="w-4 h-4 fill-white" />
                        ) : (
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        )}
                      </button>
                      <button
                        onClick={handleRemoveCustomFile}
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors"
                        title="Xóa bài hát này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 border-2 border-dashed border-indigo-300 hover:border-indigo-500 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 transition-all cursor-pointer text-center group"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-black text-indigo-950">
                      Bấm để tải file nhạc từ máy tính lên
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Hỗ trợ file MP3, WAV, M4A, OGG. Thầy/Cô có thể tải trực tiếp file nhạc vui tươi vừa gửi!
                    </div>
                  </div>
                )}
              </div>

              {/* Built-in Presets Playlist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <ListMusic className="w-3.5 h-3.5 text-amber-600" />
                    <span>Bộ sưu tập giai điệu tích hợp sẵn</span>
                  </span>
                  <span className="text-[11px] text-slate-500">4 bản hòa tấu sinh động</span>
                </div>

                <div className="space-y-2">
                  {BUILTIN_TRACKS.map((track) => {
                    const isCurrent = selectedTrackId === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => handleSelectTrack(track.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isCurrent
                            ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-200'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isCurrent && isPlaying
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {isCurrent && isPlaying ? (
                              <Radio className="w-4 h-4 animate-pulse" />
                            ) : (
                              <Music className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-900">{track.name}</span>
                              {track.id === 'joyful_classroom' && (
                                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                                  HOT
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {track.genre} • {track.bpm} BPM
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isCurrent && isPlaying ? (
                            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                              <span>Đang phát</span>
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 font-semibold group-hover:text-slate-600">
                              Chọn
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tips for Teacher */}
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 text-xs text-sky-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Mẹo dành cho Cô Nguyễn Thị Hồng Loan:</div>
                  <div className="text-[11px] text-sky-800 mt-0.5">
                    Nhạc nền có thể bật liên tục trong các hoạt động nhóm, giờ truy bài hoặc khi mở trò chơi <strong>Đua Vịt 10 Làn</strong> để cả lớp cùng hào hứng đếm ngược và cổ vũ!
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Đóng lại
              </button>
              <button
                onClick={() => {
                  if (!isPlaying) handleTogglePlay();
                  setIsOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Hoàn tất & Tiếp tục học</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
