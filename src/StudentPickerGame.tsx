import React, { useState, useEffect, useRef } from 'react';
import { Student } from './mockData';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle2,
  Trophy,
  Plus,
  Minus,
  Award,
  Users,
  Clock,
  Compass,
  Key,
  Flame,
  ChevronRight,
  Music,
  Youtube,
} from 'lucide-react';
import { classroomAudio } from './utils/classroomAudioEngine';
import { YouTubeModal } from './YouTubeModal';

export type MiniGameType = 'duck_race' | 'treasure_hunt' | 'wheel' | 'slot';

interface StudentPickerGameProps {
  students: Student[];
  currentRole: string;
  onQuickScore: (student: Student, delta: number, note: string) => void;
  onOpenScoringModal: (student: Student) => void;
}

interface CalledRecord {
  id: string;
  student: Student;
  gameType: MiniGameType;
  timestamp: string;
  scoreGiven?: number;
  note?: string;
}

// 4 Duck Colors for the Duck Race
interface DuckRacer {
  student: Student;
  distance: number; // 0 to 100%
  speed: number;
  quackOffset: number;
  color: string;
  avatarChar: string;
  lane: number;
}

// Treasure Chest for Treasure Hunt
interface TreasureChest {
  id: number;
  student: Student;
  opened: boolean;
  isSpecial: boolean;
  giftTitle: string;
}

const WHEEL_COLORS = [
  '#DC2626', '#2563EB', '#F59E0B', '#10B981',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
  '#4F46E5', '#84CC16',
];

const DUCK_LANE_COLORS = [
  { bg: 'bg-amber-50/90 border-amber-300 hover:border-amber-400', badge: 'bg-amber-500 text-white', text: 'text-amber-800', water: 'bg-amber-200/50', duck: '🐥', hat: '👑', label: 'Vịt Hoàng Gia' },
  { bg: 'bg-blue-50/90 border-blue-300 hover:border-blue-400', badge: 'bg-blue-500 text-white', text: 'text-blue-800', water: 'bg-blue-200/50', duck: '🦆', hat: '🧢', label: 'Vịt Năng Động' },
  { bg: 'bg-emerald-50/90 border-emerald-300 hover:border-emerald-400', badge: 'bg-emerald-500 text-white', text: 'text-emerald-800', water: 'bg-emerald-200/50', duck: '🐥', hat: '🎀', label: 'Vịt Dễ Thương' },
  { bg: 'bg-rose-50/90 border-rose-300 hover:border-rose-400', badge: 'bg-rose-500 text-white', text: 'text-rose-800', water: 'bg-rose-200/50', duck: '🦆', hat: '🎩', label: 'Vịt Quý Tộc' },
  { bg: 'bg-purple-50/90 border-purple-300 hover:border-purple-400', badge: 'bg-purple-500 text-white', text: 'text-purple-800', water: 'bg-purple-200/50', duck: '🐥', hat: '⭐', label: 'Vịt Ngôi Sao' },
  { bg: 'bg-cyan-50/90 border-cyan-300 hover:border-cyan-400', badge: 'bg-cyan-500 text-white', text: 'text-cyan-800', water: 'bg-cyan-200/50', duck: '🦆', hat: '🕶️', label: 'Vịt Cực Ngầu' },
  { bg: 'bg-orange-50/90 border-orange-300 hover:border-orange-400', badge: 'bg-orange-500 text-white', text: 'text-orange-800', water: 'bg-orange-200/50', duck: '🐥', hat: '🎓', label: 'Vịt Trạng Nguyên' },
  { bg: 'bg-fuchsia-50/90 border-fuchsia-300 hover:border-fuchsia-400', badge: 'bg-fuchsia-500 text-white', text: 'text-fuchsia-800', water: 'bg-fuchsia-200/50', duck: '🦆', hat: '🚀', label: 'Vịt Tốc Độ' },
  { bg: 'bg-lime-50/90 border-lime-300 hover:border-lime-400', badge: 'bg-lime-500 text-white', text: 'text-lime-800', water: 'bg-lime-200/50', duck: '🐥', hat: '🌈', label: 'Vịt May Mắn' },
  { bg: 'bg-indigo-50/90 border-indigo-300 hover:border-indigo-400', badge: 'bg-indigo-500 text-white', text: 'text-indigo-800', water: 'bg-indigo-200/50', duck: '🦆', hat: '🥇', label: 'Vịt Quán Quân' },
];

export const StudentPickerGame: React.FC<StudentPickerGameProps> = ({
  students,
  currentRole,
  onQuickScore,
  onOpenScoringModal,
}) => {
  // Current game mode: Duck Race (Đua Vịt), Treasure Hunt (Săn Kho Báu), Wheel, Slot
  const [activeGame, setActiveGame] = useState<MiniGameType>('duck_race');

  // Scope filters
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [excludeCalled, setExcludeCalled] = useState<boolean>(true);
  const [calledIds, setCalledIds] = useState<string[]>([]);
  const [callHistory, setCallHistory] = useState<CalledRecord[]>([]);

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [showYouTubeModal, setShowYouTubeModal] = useState<boolean>(false);

  // Common Animation states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [winner, setWinner] = useState<Student | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);
  const [gameVictoryNote, setGameVictoryNote] = useState<string>('');

  // -------------------------------------------------------------
  // DUCK RACE SPECIFIC STATE
  // -------------------------------------------------------------
  const [duckCount, setDuckCount] = useState<number>(10);
  const [duckRacers, setDuckRacers] = useState<DuckRacer[]>([]);
  const duckIntervalRef = useRef<number | null>(null);
  const [raceCountdown, setRaceCountdown] = useState<number | null>(null);

  // -------------------------------------------------------------
  // TREASURE HUNT SPECIFIC STATE
  // -------------------------------------------------------------
  const [chests, setChests] = useState<TreasureChest[]>([]);
  const [activeClue, setActiveClue] = useState<string>('Chọn 1 trong 8 rương báu cổ xưa dưới lòng đại dương 6B3!');
  const [revealedChestId, setRevealedChestId] = useState<number | null>(null);

  // -------------------------------------------------------------
  // WHEEL & SLOT STATE
  // -------------------------------------------------------------
  const [slotDisplayStudent, setSlotDisplayStudent] = useState<Student | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationAngleRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Candidates list
  const candidates = React.useMemo(() => {
    let pool = students;
    if (selectedTeam !== 'all') {
      pool = pool.filter((s) => s.team === selectedTeam);
    }
    if (excludeCalled) {
      pool = pool.filter((s) => !calledIds.includes(s.id));
    }
    return pool;
  }, [students, selectedTeam, excludeCalled, calledIds]);

  // Audio helper
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSoundEffect = (type: 'tick' | 'quack' | 'treasure' | 'fanfare' | 'countdown') => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      if (type === 'tick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(750, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else if (type === 'quack') {
        // Fun cartoon quack sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'treasure') {
        // Magical shimmering sound
        [587, 880, 1174, 1760].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
        });
      } else if (type === 'countdown') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'fanfare') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = ctx.currentTime + idx * 0.12;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.12, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.4);
        });
      }
    } catch {
      // Audio fallback silent
    }
  };

  // Helper to record called student
  const recordWinner = (student: Student, victoryText: string) => {
    setWinner(student);
    setGameVictoryNote(victoryText);
    playSoundEffect('fanfare');
    setShowWinnerModal(true);
    setCalledIds((prev) => (prev.includes(student.id) ? prev : [...prev, student.id]));
    setCallHistory((prev) => [
      {
        id: `CALL_${Date.now()}`,
        student,
        gameType: activeGame,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        note: victoryText,
      },
      ...prev,
    ]);
  };

  // --------------------------------------------------------------------------
  // GAME 1: ĐUA VỊT (DUCK RACE) LOGIC
  // --------------------------------------------------------------------------
  const prepareDuckRacers = (customCount?: number) => {
    const targetCount = customCount ?? duckCount;
    const pool = candidates.length > 0 ? candidates : students;
    // Shuffle and pick targetCount (default 10) random students for racing ducks
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const racersCount = Math.min(targetCount, shuffled.length);
    const selected = shuffled.slice(0, racersCount);

    const initialRacers: DuckRacer[] = selected.map((st, idx) => ({
      student: st,
      distance: 0,
      speed: 1 + Math.random() * 1.5,
      quackOffset: Math.random() * 5,
      color: WHEEL_COLORS[idx % WHEEL_COLORS.length],
      avatarChar: st.name.charAt(st.name.lastIndexOf(' ') + 1) || st.name.charAt(0),
      lane: idx,
    }));

    setDuckRacers(initialRacers);
  };

  useEffect(() => {
    if (activeGame === 'duck_race' && !isPlaying) {
      prepareDuckRacers();
    }
  }, [activeGame, candidates, duckCount]);

  const startDuckRace = () => {
    if (candidates.length === 0) {
      alert('Không còn học sinh nào khả dụng! Vui lòng bấm "Làm mới danh sách" hoặc bỏ chọn bộ lọc.');
      return;
    }
    if (isPlaying) return;

    initAudio();
    setIsPlaying(true);
    setWinner(null);
    setShowWinnerModal(false);

    // Refresh racers with new random candidates (up to duckCount, default 10)
    const pool = candidates.length > 0 ? candidates : students;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const racersCount = Math.min(duckCount, shuffled.length);
    const selected = shuffled.slice(0, racersCount);

    const freshRacers: DuckRacer[] = selected.map((st, idx) => ({
      student: st,
      distance: 0,
      speed: 1.2 + Math.random() * 1.5,
      quackOffset: Math.random() * 5,
      color: WHEEL_COLORS[idx % WHEEL_COLORS.length],
      avatarChar: st.name.charAt(st.name.lastIndexOf(' ') + 1) || st.name.charAt(0),
      lane: idx,
    }));
    setDuckRacers(freshRacers);

    // 3, 2, 1 Countdown
    setRaceCountdown(3);
    playSoundEffect('countdown');

    let count = 3;
    const countTimer = setInterval(() => {
      count--;
      if (count > 0) {
        setRaceCountdown(count);
        playSoundEffect('countdown');
      } else {
        clearInterval(countTimer);
        setRaceCountdown(null);
        if (soundEnabled) {
          classroomAudio.playTrack('duck_sprint');
        }
        runDuckLoop(freshRacers);
      }
    }, 800);
  };

  const runDuckLoop = (initialRacers: DuckRacer[]) => {
    let currentRacers = [...initialRacers];

    duckIntervalRef.current = window.setInterval(() => {
      let raceFinished = false;
      let winningDuck: DuckRacer | null = null;

      // Occasional quack
      if (Math.random() < 0.25) {
        playSoundEffect('quack');
      }

      currentRacers = currentRacers.map((racer) => {
        if (raceFinished) return racer;

        // Dynamic speed bursts (racing drama!)
        const burst = Math.random() < 0.15 ? 1.8 : 0.8;
        const delta = (Math.random() * 2.2 + 0.4) * burst;
        const newDist = Math.min(100, racer.distance + delta);

        if (newDist >= 100 && !raceFinished) {
          raceFinished = true;
          winningDuck = { ...racer, distance: 100 };
        }

        return {
          ...racer,
          distance: newDist,
        };
      });

      setDuckRacers([...currentRacers]);

      if (raceFinished && winningDuck) {
        if (duckIntervalRef.current) clearInterval(duckIntervalRef.current);
        setIsPlaying(false);
        classroomAudio.stop();
        const champion = (winningDuck as DuckRacer).student;
        recordWinner(champion, `Vịt Quán Quân bơi về đích đầu tiên! Gọi tên ${champion.name} (${champion.team}) lên bảng.`);
      }
    }, 90);
  };

  // --------------------------------------------------------------------------
  // GAME 2: SĂN TÌM KHO BÁU (TREASURE HUNT) LOGIC
  // --------------------------------------------------------------------------
  const prepareTreasureChests = () => {
    const pool = candidates.length > 0 ? candidates : students;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selectedStudents = shuffled.slice(0, 8);

    const chestTitles = [
      '👑 Chiếc Rương Hoàng Gia',
      '💎 Rương Pha Lê Đại Dương',
      '🗝️ Rương Bí Kíp 6B3',
      '⭐ Rương Ngôi Sao May Mắn',
      '⚡ Rương Sấm Sét Tri Thức',
      '🏆 Rương Cúp Vàng Vinh Quang',
      '🍀 Rương Cỏ 4 Lá Thần Kỳ',
      '🔥 Rương Phượng Hoàng Lửa',
    ];

    const newChests: TreasureChest[] = selectedStudents.map((st, idx) => ({
      id: idx + 1,
      student: st,
      opened: false,
      isSpecial: idx === 0,
      giftTitle: chestTitles[idx % chestTitles.length],
    }));

    setChests(newChests);
    setRevealedChestId(null);
    setActiveClue('Hãy bấm vào bất kỳ Rương Kho Báu nào bên dưới để khám phá học sinh bí ẩn!');
  };

  useEffect(() => {
    if (activeGame === 'treasure_hunt') {
      prepareTreasureChests();
    }
  }, [activeGame, candidates]);

  const handleOpenChest = (chest: TreasureChest) => {
    if (isPlaying || chest.opened) return;
    initAudio();
    setIsPlaying(true);
    setRevealedChestId(chest.id);
    playSoundEffect('treasure');

    setActiveClue(`🗝️ Đang mở khóa ${chest.giftTitle}... Cánh cửa kho báu đang phát sáng!`);

    setTimeout(() => {
      setChests((prev) => prev.map((c) => (c.id === chest.id ? { ...c, opened: true } : c)));
      setIsPlaying(false);
      recordWinner(
        chest.student,
        `Mở khóa thành công ${chest.giftTitle}! Tên học sinh kho báu là ${chest.student.name} (${chest.student.team}).`
      );
    }, 1200);
  };

  // --------------------------------------------------------------------------
  // GAME 3: VÒNG QUAY MAY MẮN (LUCKY WHEEL) LOGIC
  // --------------------------------------------------------------------------
  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 15;

    ctx.clearRect(0, 0, width, height);

    const itemsToDraw = candidates.length > 0 ? candidates : students;
    const total = itemsToDraw.length;
    if (total === 0) return;

    const sliceAngle = (Math.PI * 2) / total;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    for (let i = 0; i < total; i++) {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = total > 20 ? 'bold 10px sans-serif' : 'bold 12px sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 3;

      const nameParts = itemsToDraw[i].name.split(' ');
      const shortName = nameParts.length > 2 ? `${nameParts[nameParts.length - 2]} ${nameParts[nameParts.length - 1]}` : itemsToDraw[i].name;

      ctx.fillText(shortName, radius - 20, 4);
      ctx.restore();
    }

    ctx.restore();

    // Outer border
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#F59E0B';
    ctx.stroke();

    // Center hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 24, 0, Math.PI * 2);
    ctx.fillStyle = '#DC2626';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', centerX, centerY);
  };

  useEffect(() => {
    if (activeGame === 'wheel') {
      drawWheel(rotationAngleRef.current);
    }
  }, [candidates, activeGame]);

  const startWheelSpin = () => {
    if (candidates.length === 0) {
      alert('Không còn học sinh khả dụng!');
      return;
    }
    if (isPlaying) return;

    initAudio();
    setIsPlaying(true);
    setWinner(null);
    setShowWinnerModal(false);

    const itemsCount = candidates.length;
    const sliceAngle = (Math.PI * 2) / itemsCount;
    const winnerIndex = Math.floor(Math.random() * itemsCount);
    const chosenStudent = candidates[winnerIndex];

    const fullSpins = 5 + Math.floor(Math.random() * 3);
    const targetOffset = (3 * Math.PI) / 2 - (winnerIndex + 0.5) * sliceAngle;
    const totalRotation = fullSpins * Math.PI * 2 + targetOffset;

    const startAngle = rotationAngleRef.current % (Math.PI * 2);
    const duration = 4000;
    const startTime = performance.now();
    let lastTickAngle = startAngle;

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startAngle + (totalRotation - startAngle) * ease;
      rotationAngleRef.current = currentAngle;

      drawWheel(currentAngle);

      if (Math.abs(currentAngle - lastTickAngle) >= sliceAngle * 0.8) {
        playSoundEffect('tick');
        lastTickAngle = currentAngle;
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateSpin);
      } else {
        setIsPlaying(false);
        recordWinner(chosenStudent, `Kim vòng quay dừng lại chính xác tại tên ${chosenStudent.name} (${chosenStudent.team})!`);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateSpin);
  };

  // --------------------------------------------------------------------------
  // GAME 4: HỘP QUAY SỐ SIÊU TỐC (SLOT MACHINE) LOGIC
  // --------------------------------------------------------------------------
  const startSlotSpin = () => {
    if (candidates.length === 0) {
      alert('Không còn học sinh khả dụng!');
      return;
    }
    if (isPlaying) return;

    initAudio();
    setIsPlaying(true);
    setWinner(null);
    setShowWinnerModal(false);

    let counter = 0;
    const totalTicks = 30;
    const interval = setInterval(() => {
      counter++;
      const randomIdx = Math.floor(Math.random() * candidates.length);
      const candidate = candidates[randomIdx];
      setSlotDisplayStudent(candidate);
      playSoundEffect('tick');

      if (counter >= totalTicks) {
        clearInterval(interval);
        setIsPlaying(false);
        recordWinner(candidate, `Hộp quay số khớp trúng học sinh ${candidate.name} (${candidate.team})!`);
      }
    }, 75);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (duckIntervalRef.current) clearInterval(duckIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Quick Score Action
  const handleScoreWinner = (delta: number, note: string) => {
    if (!winner) return;
    onQuickScore(winner, delta, note);
    setCallHistory((prev) =>
      prev.map((item, idx) => (idx === 0 && item.student.id === winner.id ? { ...item, scoreGiven: delta, note } : item))
    );
    setShowWinnerModal(false);
  };

  const handleResetCalled = () => {
    setCalledIds([]);
    alert('Đã làm mới danh sách gọi tên! Tất cả học sinh lớp 6B3 đã sẵn sàng tham gia lượt chơi mới.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Game Selector Tabs */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-indigo-700 rounded-3xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-yellow-400 text-red-950 flex items-center justify-center text-3xl shadow-lg border-2 border-yellow-200 shrink-0">
              {activeGame === 'duck_race' ? '🦆' : activeGame === 'treasure_hunt' ? '🗝️' : activeGame === 'wheel' ? '🎡' : '🎰'}
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="bg-yellow-300 text-red-950 font-black text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Trò Chơi Gọi Tên Học Sinh 6B3
                </span>
                <span className="text-xs text-red-100 font-semibold">GVCN Cô Nguyễn Thị Hồng Loan</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black mt-1">
                {activeGame === 'duck_race' && '🏁 ĐUA 10 VỊT GỌI TÊN: CHÚ VỊT VỀ ĐÍCH ĐẦU TIÊN!'}
                {activeGame === 'treasure_hunt' && '🏴‍☠️ SĂN TÌM KHO BÁU: MỞ RƯƠNG TÌM HỌC SINH MAY MẮN!'}
                {activeGame === 'wheel' && '🎡 VÒNG QUAY MAY MẮN: GỌI TÊN HỌC SINH LÊN BẢNG'}
                {activeGame === 'slot' && '🎰 HỘP QUAY SỐ SIÊU TỐC: CHỌN NGẪU NHIÊN 1 GIÂY'}
              </h2>
              <p className="text-xs md:text-sm text-red-100">
                Tạo không khí học tập sôi nổi, kịch tính, công bằng tuyệt đối trong giờ học, kiểm tra bài cũ và sinh hoạt lớp!
              </p>
            </div>
          </div>

          {/* Sound & Music Toggles & YouTube Embed Button */}
          <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl backdrop-blur-md">
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
              <span className="text-xs">Nhạc nền</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                soundEnabled ? 'bg-yellow-400 text-red-950 shadow-sm' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title={soundEnabled ? 'Đang bật hiệu ứng' : 'Đang tắt hiệu ứng'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-xs">{soundEnabled ? 'Hiệu ứng' : 'Tắt âm'}</span>
            </button>

            {/* YouTube Embed Modal Trigger */}
            <button
              onClick={() => setShowYouTubeModal(true)}
              className="p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white shadow-sm ring-1 ring-white/30 active:scale-95"
              title="Cài đặt & Phát Video YouTube Lớp Học"
            >
              <Youtube className="w-4 h-4 fill-white" />
              <span className="text-xs">YouTube</span>
            </button>
          </div>
        </div>

        {/* Mini Game Selector Switcher Tabs */}
        <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-yellow-200 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chọn trò chơi:</span>
          </span>

          <button
            onClick={() => {
              if (isPlaying) return;
              setActiveGame('duck_race');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm ${
              activeGame === 'duck_race'
                ? 'bg-yellow-400 text-red-950 ring-2 ring-white scale-105'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <span>🦆 Đua 10 Vịt Về Đích</span>
            <span className="bg-red-600 text-white text-[9px] px-1 rounded font-bold">10 VỊT</span>
          </button>

          <button
            onClick={() => {
              if (isPlaying) return;
              setActiveGame('treasure_hunt');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm ${
              activeGame === 'treasure_hunt'
                ? 'bg-yellow-400 text-red-950 ring-2 ring-white scale-105'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <span>🗝️ Săn Tìm Kho Báu</span>
            <span className="bg-amber-600 text-white text-[9px] px-1 rounded font-bold">MỚI</span>
          </button>

          <button
            onClick={() => {
              if (isPlaying) return;
              setActiveGame('wheel');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm ${
              activeGame === 'wheel'
                ? 'bg-yellow-400 text-red-950 ring-2 ring-white scale-105'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <span>🎡 Vòng Quay May Mắn</span>
          </button>

          <button
            onClick={() => {
              if (isPlaying) return;
              setActiveGame('slot');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm ${
              activeGame === 'slot'
                ? 'bg-yellow-400 text-red-950 ring-2 ring-white scale-105'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <span>🎰 Hộp Quay Số</span>
          </button>
        </div>
      </div>

      {/* Main Game Stage Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Arena: 7 Cols */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 md:p-6 shadow-sm flex flex-col items-center justify-center relative min-h-[480px]">
          {/* Controls Bar: Scope & Filter */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>Phạm vi:</span>
              </span>
              {(['all', 'Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'] as const).map((t) => (
                <button
                  key={t}
                  disabled={isPlaying}
                  onClick={() => setSelectedTeam(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedTeam === t
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t === 'all' ? 'Toàn lớp' : t}
                </button>
              ))}
            </div>

            <div className="text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded-full font-bold">
              {candidates.length} bạn sẵn sàng
            </div>
          </div>

          {/* Toggle Exclude Already Called */}
          <div className="w-full flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl mb-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={excludeCalled}
                onChange={(e) => setExcludeCalled(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-400"
              />
              <span>Loại trừ bạn đã được gọi ({calledIds.length} bạn đã gọi)</span>
            </label>
            {calledIds.length > 0 && (
              <button
                onClick={handleResetCalled}
                disabled={isPlaying}
                className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Làm mới danh sách</span>
              </button>
            )}
          </div>

          {/* ============================================================== */}
          {/* ARENA 1: TRÒ CHƠI ĐUA VỊT (DUCK RACE)                           */}
          {/* ============================================================== */}
          {activeGame === 'duck_race' && (
            <div className="w-full space-y-4 my-2">
              {/* Pool Header & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-sky-50 border border-sky-200 p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌊</span>
                  <div>
                    <div className="text-xs font-black text-sky-950 flex items-center gap-2 flex-wrap">
                      <span>ĐƯỜNG ĐUA DƯỚI NƯỚC 10 VỊT LỚP 6B3</span>
                      <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                        {duckRacers.length} Vịt Tranh Tài
                      </span>
                    </div>
                    <div className="text-[11px] text-sky-700">
                      Chú vịt nào bơi chạm lá cờ đỏ 100% trước tiên sẽ quyết định học sinh được gọi lên bảng!
                    </div>
                  </div>
                </div>

                {/* Number of racers selector */}
                <div className="flex items-center gap-1 bg-white/90 p-1 rounded-xl border border-sky-200 shrink-0 self-start sm:self-auto">
                  <span className="text-[10px] font-bold text-sky-900 px-1">Số vịt:</span>
                  {[10, 8, 6, 4].map((num) => (
                    <button
                      key={num}
                      disabled={isPlaying}
                      onClick={() => setDuckCount(num)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-black transition-all ${
                        duckCount === num
                          ? 'bg-amber-500 text-white shadow-sm ring-1 ring-amber-600'
                          : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {raceCountdown !== null && (
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white font-black text-xl flex items-center justify-center animate-ping shrink-0 self-center">
                    {raceCountdown}
                  </div>
                )}
              </div>

              {/* 10 Duck Swimming Lanes */}
              <div className="space-y-2 bg-gradient-to-r from-sky-100 via-blue-50 to-emerald-100 p-3 md:p-4 rounded-3xl border-2 border-sky-300 relative shadow-inner max-h-[560px] overflow-y-auto">
                {/* Finish Line Indicator */}
                <div className="absolute right-5 top-0 bottom-0 w-8 border-r-4 border-dashed border-red-500 z-10 flex flex-col items-center justify-between py-2 pointer-events-none">
                  <span className="text-[9px] font-black bg-red-600 text-white px-1 py-0.5 rounded shadow">ĐÍCH</span>
                  <span className="text-sm">🚩</span>
                  <span className="text-sm">🚩</span>
                  <span className="text-[9px] font-black bg-red-600 text-white px-1 py-0.5 rounded shadow">100%</span>
                </div>

                {duckRacers.map((racer, idx) => {
                  const style = DUCK_LANE_COLORS[idx % DUCK_LANE_COLORS.length];
                  return (
                    <div
                      key={racer.student.id}
                      className={`relative p-1.5 md:p-2 rounded-xl border ${style.bg} transition-all shadow-xs`}
                    >
                      {/* Lane Label & Student Info */}
                      <div className="flex items-center justify-between text-xs mb-1 pr-12">
                        <div className="flex items-center gap-1.5 font-black text-slate-800">
                          <span className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${style.badge} flex items-center justify-center text-[10px] shadow-xs font-black shrink-0`}>
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold truncate max-w-[130px] sm:max-w-[200px]">
                            {racer.student.name}
                          </span>
                          <span className="text-[9px] bg-white px-1.5 py-0.2 rounded font-bold text-slate-500 border border-slate-200 shrink-0">
                            {racer.student.team}
                          </span>
                          <span className="hidden sm:inline-block text-[10px] text-slate-400 font-normal">
                            • {style.label}
                          </span>
                        </div>
                        <div className="font-bold text-[11px] text-slate-600">
                          {Math.round(racer.distance)}%
                        </div>
                      </div>

                      {/* Swimming Track & Duck Avatar */}
                      <div className="h-8 md:h-9 bg-white/80 rounded-lg relative overflow-hidden flex items-center px-1 shadow-inner border border-sky-200">
                        {/* Water Ripple trail */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 ${style.water} rounded-l-lg transition-all`}
                          style={{ width: `${racer.distance}%` }}
                        />

                        {/* Moving Duck */}
                        <div
                          className="absolute transition-all duration-100 flex items-center"
                          style={{
                            left: `calc(${racer.distance * 0.82}% + 2px)`,
                          }}
                        >
                          <div className="relative group cursor-pointer flex items-center">
                            <span className="text-xl md:text-2xl filter drop-shadow animate-bounce inline-block">
                              {style.duck}
                            </span>
                            <span className="absolute -top-2 left-0.5 text-xs">
                              {style.hat}
                            </span>
                            {/* Duck Tag */}
                            <span className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[9px] font-bold px-1 rounded whitespace-nowrap opacity-90 shadow-sm pointer-events-none">
                              {racer.student.name.split(' ').slice(-1)[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Start Duck Race Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={startDuckRace}
                  disabled={isPlaying || candidates.length === 0}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                    isPlaying
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white shadow-amber-200 ring-4 ring-amber-100'
                  }`}
                >
                  <Play className={`w-5 h-5 ${isPlaying ? 'animate-spin' : 'fill-white'}`} />
                  <span>
                    {isPlaying
                      ? `${duckRacers.length} VỊT ĐANG BƠI CUỒNG NHIỆT...`
                      : `BẮT ĐẦU ĐUA ${duckRacers.length} VỊT GỌI TÊN!`}
                  </span>
                </button>

                <button
                  onClick={() => prepareDuckRacers()}
                  disabled={isPlaying}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  title={`Đổi ${duckRacers.length} chú vịt khác`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Đổi {duckRacers.length} bạn đua</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* ARENA 2: TRÒ CHƠI SĂN TÌM KHO BÁU (TREASURE HUNT)              */}
          {/* ============================================================== */}
          {activeGame === 'treasure_hunt' && (
            <div className="w-full space-y-4 my-2">
              {/* Treasure Map Clue */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-100 border-2 border-yellow-300 p-3 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shadow">
                    🗺️
                  </div>
                  <div>
                    <div className="text-xs font-black text-amber-950 uppercase tracking-wide">
                      Bản Đồ Kho Báu Hải Tặc 6B3
                    </div>
                    <div className="text-xs text-amber-800 font-medium">
                      {activeClue}
                    </div>
                  </div>
                </div>
                <button
                  onClick={prepareTreasureChests}
                  disabled={isPlaying}
                  className="p-2 rounded-xl bg-white text-amber-900 border border-amber-300 hover:bg-amber-50 text-xs font-bold shadow-sm"
                  title="Đổi vị trí rương mới"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 8 Mystery Treasure Chests Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 p-4 rounded-3xl border-4 border-amber-400 shadow-2xl">
                {chests.map((chest) => {
                  const isRevealing = revealedChestId === chest.id && isPlaying;
                  return (
                    <button
                      key={chest.id}
                      onClick={() => handleOpenChest(chest)}
                      disabled={isPlaying || chest.opened}
                      className={`relative p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all transform active:scale-95 group border-2 ${
                        chest.opened
                          ? 'bg-amber-400/20 border-yellow-400 shadow-lg'
                          : isRevealing
                          ? 'bg-yellow-500/30 border-yellow-300 animate-pulse scale-105'
                          : 'bg-white/10 hover:bg-white/20 border-yellow-500/40 hover:border-yellow-400'
                      }`}
                    >
                      {/* Chest Icon Animation */}
                      <div className="text-3xl sm:text-4xl my-1 transition-transform group-hover:scale-110">
                        {chest.opened ? '✨💎' : isRevealing ? '🗝️⚡' : '🎁'}
                      </div>

                      <div className="text-[11px] font-black text-yellow-300 mt-1">
                        {chest.opened ? chest.student.name : `Rương Số ${chest.id}`}
                      </div>

                      <div className="text-[9px] text-amber-100/80">
                        {chest.opened ? `${chest.student.team} • Điểm: ${chest.student.currentScore}đ` : 'Bấm để mở'}
                      </div>

                      {/* Sparkle badge */}
                      {chest.opened && (
                        <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-red-950 text-[9px] font-black px-1.5 py-0.2 rounded-full shadow">
                          ĐÃ MỞ
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Hint footer */}
              <div className="text-center text-xs text-slate-500 italic">
                * Cô giáo có thể mời 1 bạn học sinh bất kỳ trong lớp đứng dậy chọn số rương mà bạn yêu thích!
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* ARENA 3: VÒNG QUAY MAY MẮN (WHEEL)                             */}
          {/* ============================================================== */}
          {activeGame === 'wheel' && (
            <div className="w-full flex flex-col items-center">
              <div className="relative my-4 flex items-center justify-center">
                {/* Pointer Needle at Top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[26px] border-t-red-600 filter drop-shadow-md" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full -mt-7 border-2 border-white shadow" />
                </div>

                <canvas
                  ref={canvasRef}
                  width={360}
                  height={360}
                  className="max-w-[320px] max-h-[320px] md:max-w-[360px] md:max-h-[360px] drop-shadow-xl transition-transform"
                />
              </div>

              <button
                onClick={startWheelSpin}
                disabled={isPlaying || candidates.length === 0}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                  isPlaying
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-red-700 text-white shadow-red-200 ring-4 ring-red-100'
                }`}
              >
                <Play className={`w-5 h-5 ${isPlaying ? 'animate-spin' : 'fill-white'}`} />
                <span>{isPlaying ? 'ĐANG QUAY HỒI HỘP...' : 'BẮT ĐẦU QUAY VÒNG!'}</span>
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* ARENA 4: HỘP QUAY SỐ SIÊU TỐC (SLOT)                           */}
          {/* ============================================================== */}
          {activeGame === 'slot' && (
            <div className="w-full flex flex-col items-center">
              <div className="w-full max-w-sm py-12 px-6 my-4 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-3xl border-4 border-yellow-400 text-center shadow-2xl relative overflow-hidden">
                <div className="text-[11px] text-yellow-300 font-bold uppercase tracking-wider mb-2">
                  {isPlaying ? '⚡ Đang đảo tên siêu tốc...' : 'Hộp Quay Số Học Sinh 6B3'}
                </div>
                <div className="h-20 flex items-center justify-center">
                  <div className="text-2xl md:text-3xl font-black text-white transition-all transform animate-pulse">
                    {slotDisplayStudent ? slotDisplayStudent.name : 'BẤM NÚT QUAY TÊN'}
                  </div>
                </div>
                {slotDisplayStudent && (
                  <div className="text-xs text-yellow-200 mt-1 font-semibold">
                    {slotDisplayStudent.team} • {slotDisplayStudent.role} • Điểm: {slotDisplayStudent.currentScore}đ
                  </div>
                )}
              </div>

              <button
                onClick={startSlotSpin}
                disabled={isPlaying || candidates.length === 0}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                  isPlaying
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-700 text-white shadow-blue-200 ring-4 ring-blue-100'
                }`}
              >
                <Play className={`w-5 h-5 ${isPlaying ? 'animate-spin' : 'fill-white'}`} />
                <span>{isPlaying ? 'ĐANG QUAY SỐ...' : 'QUAY HỘP SỐ NGAY!'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Live Session History & Scoring Dashboard: 5 Cols */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Winner Card */}
          {winner && !showWinnerModal && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-yellow-400 rounded-3xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black bg-yellow-400 text-red-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>🏆 VỪA ĐƯỢC CHỌN</span>
                  <span className="text-[10px]">({activeGame === 'duck_race' ? 'Đua Vịt' : activeGame === 'treasure_hunt' ? 'Kho Báu' : 'Vòng Quay'})</span>
                </span>
                <span className="text-xs text-slate-500 font-semibold">{winner.team}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-black text-lg flex items-center justify-center shadow">
                  {winner.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base">{winner.name}</h4>
                  <div className="text-xs text-slate-600">
                    Mã HS: {winner.id} • Điểm hiện tại: <b className="text-red-600">{winner.currentScore}đ</b>
                  </div>
                </div>
              </div>

              {/* 1-Tap Scoring Actions */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-yellow-300/60">
                <button
                  onClick={() => handleScoreWinner(5, 'Trả lời bài xuất sắc (Điểm 10 miệng)')}
                  className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+5đ Xuất sắc</span>
                </button>
                <button
                  onClick={() => handleScoreWinner(2, 'Phát biểu tốt / Đạt yêu cầu')}
                  className="py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+2đ Phát biểu tốt</span>
                </button>
                <button
                  onClick={() => handleScoreWinner(-2, 'Chưa chuẩn bị bài chu đáo')}
                  className="py-1.5 px-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>-2đ Chưa chuẩn bị</span>
                </button>
                <button
                  onClick={() => handleScoreWinner(-5, 'Không thuộc bài cũ')}
                  className="py-1.5 px-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>-5đ Không thuộc bài</span>
                </button>
              </div>
            </div>
          )}

          {/* Session Call Log */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Nhật Ký Gọi Tên Tiết Học</span>
              </h3>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                {callHistory.length} bạn
              </span>
            </div>

            {callHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Chưa có học sinh nào được gọi trong tiết này.
                <br />
                Hãy chọn chế độ <b>Đua Vịt</b> hoặc <b>Kho Báu</b> và bắt đầu chơi!
              </div>
            ) : (
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {callHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span>{item.student.name}</span>
                        <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                          {item.student.team}
                        </span>
                        <span className="text-[10px] text-amber-600">
                          {item.gameType === 'duck_race' ? '🦆' : item.gameType === 'treasure_hunt' ? '🗝️' : '🎡'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.timestamp} • {item.note || 'Được gọi lên bảng'}
                      </div>
                    </div>

                    <div>
                      {item.scoreGiven !== undefined ? (
                        <span
                          className={`font-black text-xs px-2 py-0.5 rounded-lg ${
                            item.scoreGiven > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.scoreGiven > 0 ? `+${item.scoreGiven}đ` : `${item.scoreGiven}đ`}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setWinner(item.student);
                            setShowWinnerModal(true);
                          }}
                          className="text-[11px] bg-red-100 text-red-700 px-2 py-1 rounded-lg font-bold hover:bg-red-200"
                        >
                          Chấm điểm
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Teacher Guidance Card */}
          <div className="p-4 rounded-3xl bg-blue-50 border border-blue-100 text-xs text-blue-900 space-y-1.5">
            <div className="font-bold text-blue-950 flex items-center gap-1.5">
              <span>💡 Mẹo Dành Cho Cô Nguyễn Thị Hồng Loan:</span>
            </div>
            <p className="text-blue-800 leading-relaxed">
              • <b>Đua Vịt:</b> Tác dụng kích thích không khí thi đua đối kháng cực mạnh giữa 4 Tổ khi kiểm tra bài cũ hoặc giải toán nhanh.
              <br />
              • <b>Săn Kho Báu:</b> Tuyệt vời khi cho cả lớp xung phong, học sinh giơ tay được quyền chọn số rương mở ra tên đồng đội hoặc chính mình để trả lời câu hỏi nhận điểm thưởng!
            </p>
          </div>
        </div>
      </div>

      {/* Winner Spotlight Celebration Modal */}
      {showWinnerModal && winner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 border-4 border-yellow-400">
            {/* Top Confetti & Header */}
            <div className="text-4xl mb-2 animate-bounce">
              {activeGame === 'duck_race' ? '🦆🎉' : activeGame === 'treasure_hunt' ? '👑🗝️' : '🎉✨'}
            </div>
            <span className="text-xs font-black uppercase tracking-wider bg-yellow-400 text-red-950 px-3 py-1 rounded-full">
              HỌC SINH ĐƯỢC CHỌN LÊN BẢNG
            </span>

            {/* Victory Note */}
            {gameVictoryNote && (
              <p className="text-xs text-slate-600 font-medium mt-2 px-2">
                {gameVictoryNote}
              </p>
            )}

            {/* Student Info Spotlight */}
            <div className="my-5 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-red-600 to-yellow-500 text-white font-black text-3xl flex items-center justify-center shadow-lg ring-4 ring-yellow-200 mb-3">
                {winner.name.charAt(0)}
              </div>
              <h3 className="text-2xl font-black text-slate-900">{winner.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                  {winner.team}
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                  {winner.role}
                </span>
                <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
                  Mã: {winner.id}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Điểm nề nếp hiện tại: <b className="text-red-600 text-sm">{winner.currentScore}đ</b>
              </div>
            </div>

            {/* Teacher Direct 1-Tap Scoring Actions */}
            <div className="space-y-2 text-left pt-3 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-700 text-center mb-2">
                Đánh giá nhanh kết quả câu trả lời:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleScoreWinner(5, 'Trả lời bài xuất sắc (Điểm 10 miệng)')}
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Trophy className="w-4 h-4" />
                  <span>+5đ Xuất Sắc</span>
                </button>
                <button
                  onClick={() => handleScoreWinner(2, 'Phát biểu tốt / Đạt yêu cầu')}
                  className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>+2đ Phát Biểu Tốt</span>
                </button>
                <button
                  onClick={() => handleScoreWinner(-2, 'Chưa chuẩn bị bài chu đáo')}
                  className="p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Minus className="w-4 h-4" />
                  <span>-2đ Chưa Chuẩn Bị</span>
                </button>
                <button
                  onClick={() => handleScoreWinner(-5, 'Không thuộc bài cũ')}
                  className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Minus className="w-4 h-4" />
                  <span>-5đ Không Thuộc</span>
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowWinnerModal(false);
                    onOpenScoringModal(winner);
                  }}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Tùy chọn khác...
                </button>
                <button
                  onClick={() => {
                    setShowWinnerModal(false);
                    if (activeGame === 'duck_race') {
                      setTimeout(() => startDuckRace(), 300);
                    } else if (activeGame === 'treasure_hunt') {
                      prepareTreasureChests();
                    } else if (activeGame === 'wheel') {
                      setTimeout(() => startWheelSpin(), 300);
                    } else {
                      setTimeout(() => startSlotSpin(), 300);
                    }
                  }}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <span>Chơi tiếp</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowWinnerModal(false)}
              className="mt-3 text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              Đóng lại (Không chấm điểm)
            </button>
          </div>
        </div>
      )}

      {/* YouTube Video Player Modal */}
      <YouTubeModal
        isOpen={showYouTubeModal}
        onClose={() => setShowYouTubeModal(false)}
      />
    </div>
  );
};
