// Web Audio API procedural music synthesis engine for Classroom 6B3

export type BuiltinTrackId = 'joyful_classroom' | 'duck_sprint' | 'treasure_magic' | 'gentle_focus';

export interface MusicTrack {
  id: string;
  name: string;
  genre: string;
  bpm: number;
  description: string;
  isCustom?: boolean;
  fileUrl?: string;
}

export const BUILTIN_TRACKS: MusicTrack[] = [
  {
    id: 'joyful_classroom',
    name: 'Giai Điệu Vui Tươi Rộn Ràng 6B3',
    genre: 'Acoustic / Ukulele / Bells',
    bpm: 124,
    description: 'Âm hưởng đàn ukulele tươi sáng, chuông marimba và vỗ tay rộn ràng tạo hứng khởi học tập.',
  },
  {
    id: 'duck_sprint',
    name: 'Bứt Tốc Đua Vịt 10 Làn',
    genre: 'Upbeat Arcade / Racing Beat',
    bpm: 138,
    description: 'Nhịp điệu dồn dập, tiếng trống sôi nổi và hiệu ứng bứt phá kịch tính cho các vòng đua vịt.',
  },
  {
    id: 'treasure_magic',
    name: 'Khám Phá Rương Báu Kỳ Bí',
    genre: 'Adventure / Magical Chimes',
    bpm: 108,
    description: 'Âm hưởng lấp lánh như chuông thần kỳ khơi dậy sự tò mò khi mở các rương kho báu.',
  },
  {
    id: 'gentle_focus',
    name: 'Giai Điệu Êm Dịu Tập Trung',
    genre: 'Lofi / Warm Piano Study',
    bpm: 88,
    description: 'Tiếng đàn piano êm đềm, không gian nhẹ nhàng giúp học sinh tập trung làm bài thi đua.',
  },
];

class ClassroomAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private currentTrackId: BuiltinTrackId = 'joyful_classroom';
  private timerId: number | null = null;
  private currentStep = 0;
  private volume = 0.6;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  // Play a simple synthesized acoustic pluck / chime note
  private playNote(freq: number, startTime: number, duration: number, type: OscillatorType = 'triangle', gainLevel = 0.15) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      // Acoustic envelope: fast attack, gradual decay
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } catch {
      // Audio context error ignore
    }
  }

  // Play playful percussion: clap / snap or kick
  private playDrum(type: 'kick' | 'clap' | 'hihat', startTime: number) {
    if (!this.ctx || !this.masterGain) return;
    try {
      if (type === 'kick') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(140, startTime);
        osc.frequency.exponentialRampToValueAtTime(38, startTime + 0.09);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + 0.12);
      } else if (type === 'clap') {
        // Noise burst for clap
        const bufferSize = this.ctx.sampleRate * 0.08;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.02));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start(startTime);
      } else {
        // Crisp hihat
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(8000, startTime);
        gain.gain.setValueAtTime(0.04, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.03);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + 0.035);
      }
    } catch {
      // Ignore
    }
  }

  // Play loop sequencer tick
  private stepSequence() {
    if (!this.isPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;
    const step = this.currentStep % 16;
    const bar = Math.floor((this.currentStep % 64) / 16); // 4 bars loop

    if (this.currentTrackId === 'joyful_classroom') {
      // 124 BPM -> 16th note = ~121 ms
      // Chord progression: C major -> G major -> A minor -> F major (The classic happy ukulele progression!)
      const chords = [
        // Bar 0: C Major (C4, E4, G4, C5)
        [261.63, 329.63, 392.0, 523.25],
        // Bar 1: G Major (G3, B3, D4, G4)
        [196.0, 246.94, 293.66, 392.0],
        // Bar 2: A Minor (A3, C4, E4, A4)
        [220.0, 261.63, 329.63, 440.0],
        // Bar 3: F Major (F3, A3, C4, F4)
        [174.61, 220.0, 261.63, 349.23],
      ];

      const currentChord = chords[bar];

      // Bass note on beats 1 and 3 (step 0, 8)
      if (step === 0 || step === 8) {
        this.playNote(currentChord[0], now, 0.28, 'sine', 0.18);
        this.playDrum('kick', now);
      }

      // Ukulele rhythmic strum on off-beats (step 4, 12) + playful claps
      if (step === 4 || step === 12) {
        currentChord.forEach((freq, idx) => {
          this.playNote(freq * 1.5, now + idx * 0.012, 0.18, 'triangle', 0.08);
        });
        this.playDrum('clap', now);
      }

      // Marimba/Chime melody top line
      const melodyNotes = [
        523.25, 659.25, 783.99, 659.25, 523.25, 783.99, 880.0, 1046.5,
      ];
      if (step % 2 === 0) {
        const noteIdx = (step / 2 + bar * 2) % melodyNotes.length;
        this.playNote(melodyNotes[noteIdx], now, 0.22, 'sine', 0.12);
        this.playDrum('hihat', now);
      }
    } else if (this.currentTrackId === 'duck_sprint') {
      // 138 BPM energetic arcade rhythm
      const bassFreqs = [130.81, 146.83, 164.81, 174.61];
      const bass = bassFreqs[bar];

      // Driving 4-on-the-floor kick
      if (step % 4 === 0) {
        this.playDrum('kick', now);
        this.playNote(bass, now, 0.15, 'sawtooth', 0.15);
      } else if (step % 4 === 2) {
        this.playDrum('clap', now);
      }

      // Fast arpeggiated synth
      const arpFreqs = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
      const note = arpFreqs[step % arpFreqs.length];
      this.playNote(note, now, 0.08, 'square', 0.06);
      this.playDrum('hihat', now);
    } else if (this.currentTrackId === 'treasure_magic') {
      // 108 BPM magical crystal shimmer
      const crystalNotes = [587.33, 739.99, 880.0, 1174.66, 1479.98, 1760.0];
      if (step % 3 === 0) {
        const note = crystalNotes[(step + bar) % crystalNotes.length];
        this.playNote(note, now, 0.45, 'sine', 0.1);
      }
      if (step === 0 || step === 8) {
        this.playNote(146.83, now, 0.6, 'triangle', 0.15);
      }
    } else {
      // gentle_focus: Warm soft chords
      const softChords = [
        [261.63, 329.63, 392.0],
        [220.0, 261.63, 329.63],
        [174.61, 220.0, 261.63],
        [196.0, 246.94, 293.66],
      ];
      if (step === 0) {
        softChords[bar].forEach((freq, idx) => {
          this.playNote(freq, now + idx * 0.03, 1.2, 'sine', 0.09);
        });
      }
    }

    this.currentStep++;
  }

  public playTrack(trackId: BuiltinTrackId) {
    this.initContext();
    this.currentTrackId = trackId;

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.currentStep = 0;
      const bpm = BUILTIN_TRACKS.find((t) => t.id === trackId)?.bpm || 120;
      const intervalMs = (60 / bpm / 4) * 1000; // 16th note timing

      this.timerId = window.setInterval(() => {
        this.stepSequence();
      }, intervalMs);
    } else {
      // Restart interval with new BPM if needed
      if (this.timerId) clearInterval(this.timerId);
      const bpm = BUILTIN_TRACKS.find((t) => t.id === trackId)?.bpm || 120;
      const intervalMs = (60 / bpm / 4) * 1000;
      this.timerId = window.setInterval(() => {
        this.stepSequence();
      }, intervalMs);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrackId(): BuiltinTrackId {
    return this.currentTrackId;
  }
}

export const classroomAudio = new ClassroomAudioEngine();
