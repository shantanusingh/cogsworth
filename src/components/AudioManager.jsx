const AMBIENT_CONFIGS = {
  landing: [
    { freq: 110, amp: 0.30, wave: 'sine' },
    { freq: 165, amp: 0.20, wave: 'triangle' },
    { freq: 55, amp: 0.15, wave: 'sawtooth' }
  ],
  lobby: [
    { freq: 220, amp: 0.25, wave: 'triangle' },
    { freq: 330, amp: 0.15, wave: 'sine' },
    { freq: 110, amp: 0.10, wave: 'square' }
  ],
  cutscene: [
    { freq: 130, amp: 0.30, wave: 'sine' },
    { freq: 196, amp: 0.15, wave: 'triangle' }
  ],
  boilerRoom: [
    { freq: 60, amp: 0.40, wave: 'sawtooth' },
    { freq: 90, amp: 0.20, wave: 'square' },
    { freq: 120, amp: 0.10, wave: 'sine' }
  ],
  victory: [
    { freq: 261, amp: 0.30, wave: 'sine' },
    { freq: 329, amp: 0.25, wave: 'triangle' },
    { freq: 392, amp: 0.20, wave: 'sine' }
  ]
};

// External track mappings
const TRACK_MAPPING = {
  landing: 'Discovery Hit',
  setup: 'Dark Fog',
  lobby: 'Dark Fog',
  introCutscene: 'Our Story Begins',
  levels: [
    'Shadowlands 5 - Antechamber',
    'Shadowlands 3 - Machine',
    'Division',
    'Shadowlands 5 - Antechamber',
    'Shadowlands 3 - Machine',
    'Division',
    'Shadowlands 5 - Antechamber',
    'Shadowlands 3 - Machine'
  ]
};

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.ambientNodes = [];
    this.currentAudioSource = null;
    this.playingSources = []; // Track ALL playing sources to ensure cleanup
    this.audioCache = {};
    this.musicVolume = localStorage.getItem('musicVolume') ? parseFloat(localStorage.getItem('musicVolume')) : 0.3;
    this.musicEnabled = localStorage.getItem('musicEnabled') !== 'false';
    this.sfxEnabled = localStorage.getItem('sfxEnabled') !== 'false';
  }

  init() {
    if (this.audioContext) return;
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = this.musicVolume * 0.3;
    this.masterGain.connect(this.audioContext.destination);

    this.sfxGain = this.audioContext.createGain();
    this.sfxGain.gain.value = this.musicVolume * 0.4;
    this.sfxGain.connect(this.audioContext.destination);
  }

  setVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('musicVolume', this.musicVolume);

    if (this.masterGain) {
      this.masterGain.gain.value = this.musicVolume * 0.3;
    }
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.musicVolume * 0.4;
    }
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    localStorage.setItem('musicEnabled', this.musicEnabled);
    if (!this.musicEnabled) {
      this.stopAmbient();
    }
  }

  stopAmbient() {
    this.ambientNodes.forEach(node => {
      try {
        if (node.stop) {
          node.stop(this.audioContext.currentTime);
        } else {
          node.disconnect();
        }
      } catch (e) {
        // Already stopped
      }
    });
    this.ambientNodes = [];
  }

  playAmbient(config) {
    this.init();
    if (!this.musicEnabled) return;

    this.stopAmbient();

    if (!config) return;

    config.forEach(({ freq, amp, wave }) => {
      const osc = this.audioContext.createOscillator();
      osc.type = wave;
      osc.frequency.value = freq;

      const gain = this.audioContext.createGain();
      gain.gain.value = amp * 0.3; // Scale amplitude

      const lfo = this.audioContext.createOscillator();
      lfo.frequency.value = 0.10 + Math.random() * 0.10;

      const lfoGain = this.audioContext.createGain();
      lfoGain.gain.value = freq * 0.02;

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      lfo.start();

      this.ambientNodes.push(osc, lfo, gain, lfoGain);
    });
  }

  transitionTo(config, fadeTime = 2) {
    this.init();
    if (!this.musicEnabled) {
      this.playAmbient(config);
      return;
    }

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Fade out current
    this.masterGain.gain.linearRampToValueAtTime(0, now + fadeTime);

    // Stop and start new after fade
    setTimeout(() => {
      this.stopAmbient();
      this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(this.musicVolume * 0.3, ctx.currentTime + fadeTime);
      this.playAmbient(config);
    }, fadeTime * 1000);
  }

  playSfx(type) {
    this.init();
    if (!this.sfxEnabled) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const sfxConfig = {
      success: { freqs: [523, 659, 784], wave: 'triangle', duration: 0.3, spacing: 0.12 },
      error: { freqs: [200, 150], wave: 'sawtooth', duration: 0.2, spacing: 0.15 },
      clue: { freqs: [440, 554], wave: 'sine', duration: 0.25, spacing: 0.1 },
      playerJoin: { freqs: [300], wave: 'square', duration: 0.05, spacing: 0 },
      chat: { freqs: [880], wave: 'sine', duration: 0.03, spacing: 0 },
      lockout: { freqs: [120], wave: 'square', duration: 0.3, spacing: 0 },
      levelComplete: { freqs: [261, 329, 392], wave: 'triangle', duration: 0.5, spacing: 0 },
      victory: { freqs: [261, 329, 392], wave: 'triangle', duration: 1.2, spacing: 0 },
      nanoSave: { freqs: [440], wave: 'sine', duration: 0.08, spacing: 0 }
    };

    const config = sfxConfig[type];
    if (!config) return;

    config.freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = config.wave;
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      const startTime = now + i * config.spacing;

      gain.gain.setValueAtTime(this.musicVolume * 0.5, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + config.duration);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + config.duration + 0.05);
    });
  }

  stop() {
    this.stopAmbient();
    this.stopCurrentTrack();
  }

  async loadAudioBuffer(trackName) {
    if (this.audioCache[trackName]) {
      console.log(`Using cached audio: ${trackName}`);
      return this.audioCache[trackName];
    }

    try {
      const encodedName = encodeURIComponent(trackName);
      const url = `/audio/${encodedName}.mp3`;
      console.log(`Fetching audio from: ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - File not found or server error`);
      }

      const arrayBuffer = await response.arrayBuffer();
      this.init();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.audioCache[trackName] = audioBuffer;
      console.log(`Successfully loaded: ${trackName}`);
      return audioBuffer;
    } catch (error) {
      console.warn(`Failed to load audio track "${trackName}":`, error.message);
      return null;
    }
  }

  stopCurrentTrack() {
    // Stop ALL playing sources to prevent overlapping audio
    this.playingSources.forEach(source => {
      try {
        source.stop(this.audioContext.currentTime);
      } catch (e) {
        // Already stopped
      }
      try {
        source.disconnect();
      } catch (e) {
        // Already disconnected
      }
    });
    this.playingSources = [];
    this.currentAudioSource = null;
  }

  async playExternalTrack(trackName, loop = true) {
    this.init();
    if (!this.musicEnabled) {
      console.log('Music disabled, not playing:', trackName);
      return;
    }

    this.stopAmbient();
    this.stopCurrentTrack(); // Stop ALL previous sources

    const buffer = await this.loadAudioBuffer(trackName);
    if (!buffer) {
      console.warn(`Could not load audio buffer for "${trackName}"`);
      return;
    }

    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.loop = loop;

      // Connect directly to masterGain to avoid multiple disconnected audio chains
      // This ensures all audio (procedural + external) goes through the same volume control
      source.connect(this.masterGain);

      // Use audioContext.currentTime for accurate timing to prevent overlaps
      const startTime = this.audioContext.currentTime + 0.01; // Small delay to ensure clean transition
      source.start(startTime);
      this.currentAudioSource = source;
      this.playingSources = [source]; // Replace with new source, clearing old ones
      console.log(`Now playing: ${trackName}`);
    } catch (error) {
      console.error(`Error playing track "${trackName}":`, error);
    }
  }

  async playTrackForScene(sceneName, levelNumber = null) {
    let trackName = null;

    if (sceneName === 'level' && levelNumber !== null) {
      trackName = TRACK_MAPPING.levels[levelNumber - 1];
    } else {
      trackName = TRACK_MAPPING[sceneName];
    }

    if (trackName) {
      await this.playExternalTrack(trackName, true);
    }
  }
}

export default new AudioManager();
export { AMBIENT_CONFIGS, TRACK_MAPPING };
