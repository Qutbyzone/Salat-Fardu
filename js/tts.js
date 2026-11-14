/**
 * js/tts.js
 * Modul Suara Anak-Anak Berbahasa Indonesia (Fasih & Jelas)
 * Menggunakan Web Speech API dengan tuning Suara Cilik Indonesia + Web Audio SFX
 */

const AudioMaster = {
  isMuted: false,
  audioCtx: null,
  cachedIndoVoice: null,
  currentAudioObj: null,
  musicTimer: null,
  musicStep: 0,
  musicGain: null,
  backgroundAudio: null,

  init() {
    this.backgroundAudio = document.getElementById('background-music');
    if (this.backgroundAudio) { this.backgroundAudio.volume = 0.18; this.backgroundAudio.loop = true; }
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.musicGain = this.audioCtx.createGain();
      this.musicGain.gain.value = 0.045;
      this.musicGain.connect(this.audioCtx.destination);
    } catch (e) {
      console.warn('Web Audio API tidak didukung pada peramban ini.');
    }

  },

  loadIndonesianVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prioritaskan voice Bahasa Indonesia resmi (Google, Microsoft Gadis, dsb)
    this.cachedIndoVoice = voices.find(v => 
      v.lang === 'id-ID' || 
      v.lang.toLowerCase().includes('id') || 
      v.name.toLowerCase().includes('indonesia')
    ) || null;
  },

  ensureCtx() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  },

  startBackgroundMusic() {
    if (this.isMuted) return;
    if (this.backgroundAudio) {
      this.backgroundAudio.play().catch(() => this.startSynthMusic());
      return;
    }
    this.startSynthMusic();
  },

  startSynthMusic() {
    if (this.isMuted || !this.audioCtx || this.musicTimer) return;
    this.ensureCtx();
    // Melodi orisinal ceria bernuansa marimba; dibuat dengan Web Audio sehingga tanpa file musik eksternal.
    const notes = [523.25,659.25,783.99,659.25,587.33,698.46,880,698.46,523.25,659.25,783.99,1046.5,880,783.99,659.25,587.33];
    const playNote = () => {
      if (this.isMuted || !this.audioCtx || this.audioCtx.state !== 'running') return;
      const freq = notes[this.musicStep % notes.length];
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const env = this.audioCtx.createGain();
      osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, now);
      env.gain.setValueAtTime(0.0001, now);
      env.gain.exponentialRampToValueAtTime(0.22, now + 0.025);
      env.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
      osc.connect(env); env.connect(this.musicGain);
      osc.start(now); osc.stop(now + 0.26);
      // Bass ringan pada setiap ketukan keempat.
      if (this.musicStep % 4 === 0) {
        const bass=this.audioCtx.createOscillator(), bg=this.audioCtx.createGain();
        bass.type='sine'; bass.frequency.value=freq/2;
        bg.gain.setValueAtTime(0.0001,now); bg.gain.exponentialRampToValueAtTime(0.11,now+0.02); bg.gain.exponentialRampToValueAtTime(0.0001,now+0.28);
        bass.connect(bg); bg.connect(this.musicGain); bass.start(now); bass.stop(now+0.3);
      }
      this.musicStep++;
    };
    playNote(); this.musicTimer = window.setInterval(playNote, 270);
  },

  stopBackgroundMusic() {
    if (this.musicTimer) window.clearInterval(this.musicTimer);
    this.musicTimer = null;
    if (this.backgroundAudio) { this.backgroundAudio.pause(); this.backgroundAudio.currentTime = 0; }
  },

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) { this.stopAllAudio(); this.stopBackgroundMusic(); } else { this.startBackgroundMusic(); }
    return this.isMuted;
  },

  stopAllAudio() {
    if (this.currentAudioObj) {
      this.currentAudioObj.pause();
      this.currentAudioObj.currentTime = 0;
      this.currentAudioObj = null;
    }
  },

  // VOICE OVER: seluruh narasi diputar dari file WAV eksternal.
  // Ganti file assets/audio/voiceovers/<key>.wav untuk mengubah suara tanpa mengubah logika aplikasi.
  playVO(audioFilename, onEndCallback = null) {
    if (this.isMuted || !audioFilename) return;
    this.ensureCtx();
    this.stopAllAudio();

    const safeName = String(audioFilename).replace(/[^a-zA-Z0-9_-]/g, '');
    const audio = new Audio(`assets/audio/voiceovers/${safeName}.wav`);
    audio.preload = 'auto';
    audio.volume = 1;
    this.currentAudioObj = audio;

    const finish = () => {
      if (this.currentAudioObj === audio) this.currentAudioObj = null;
      if (typeof onEndCallback === 'function') onEndCallback();
    };
    audio.addEventListener('ended', finish, { once: true });
    audio.addEventListener('error', () => {
      console.warn(`Voice-over WAV tidak ditemukan atau gagal diputar: ${safeName}.wav`);
      if (this.currentAudioObj === audio) this.currentAudioObj = null;
    }, { once: true });

    audio.play().catch(err => {
      console.warn(`Voice-over ${safeName}.wav belum dapat diputar. Pastikan ada interaksi pengguna dan file WAV tersedia.`, err);
    });
  },

  // Kompatibilitas untuk pemanggilan lama; narasi baru harus menggunakan playVO(key).
  speakKid(text) {
    console.warn('speakKid() tidak lagi digunakan. Gunakan playVO() dengan nama file WAV.');
  },

  // SFX: Suara Pop Lucu untuk Tombol
  playPop() {
    if (this.isMuted) return;
    this.ensureCtx();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const now = this.audioCtx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  },

  // SFX: Lonceng Bintang Emas (Jawaban Benar)
  playChime() {
    if (this.isMuted) return;
    this.ensureCtx();
    if (!this.audioCtx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    });
  },

  // SFX: Boing Lembut (Coba Lagi)
  playGentleBoing() {
    if (this.isMuted) return;
    this.ensureCtx();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const now = this.audioCtx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(270, now);
    osc.frequency.linearRampToValueAtTime(170, now + 0.18);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  },

  // SFX: Fanfare Perayaan
  playFanfare() {
    if (this.isMuted) return;
    this.ensureCtx();
    if (!this.audioCtx) return;

    const chords = [
      { f: 523.25, t: 0.0 },
      { f: 659.25, t: 0.12 },
      { f: 783.99, t: 0.24 },
      { f: 1046.5, t: 0.38 },
      { f: 1046.5, t: 0.6 }
    ];

    chords.forEach(c => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime + c.t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(c.f, now);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    });
  }
};

window.addEventListener('DOMContentLoaded', () => {
  AudioMaster.init();
});
