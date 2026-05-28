# Cogsworth Academy — Audio Design

## Philosophy

All audio is generated procedurally using the **Web Audio API** — no external audio files or libraries required. Every sound is synthesised at runtime from oscillators, gain nodes, and LFOs. This keeps the build lightweight, eliminates licensing concerns, and gives the game a distinctly mechanical, clockwork character.

---

## Source & Licensing

All music and sound effects are generated in-browser via the Web Audio API.

For any supplemental tracks sourced externally, use:

- **Free Music Archive (FMA)** — freemusicarchive.org
- **OpenGameArt.org** — opengameart.org
- **Incompetech by Kevin MacLeod** — incompetech.com (CC BY 4.0)
- **Freesound.org** — freesound.org (CC0 / CC BY)

### Recommended External Tracks (if supplementing procedural audio)

| Track | Artist | License | Suggested Use |
|---|---|---|---|
| "Mechanolith" | Kevin MacLeod | CC BY 4.0 | Engine Room, Boiler Room |
| "Bittersweet" | Kevin MacLeod | CC BY 4.0 | Scriptorium, Cipher Vault |
| "Clockwork" | Kevin MacLeod | CC BY 4.0 | Lobby, Cutscenes |
| "Airship Serenades" | Matthew Pablo | CC BY 4.0 | Owl Post, Greenhouse |
| "Dark Mystery" | Kevin MacLeod | CC BY 4.0 | Grand Codex |
| "Heroic Age" | Kevin MacLeod | CC BY 4.0 | Victory cutscene |
| "Intimidating" | Kevin MacLeod | CC BY 4.0 | Timed mode urgency |

### Required Credit Line (CC BY 4.0)

Include in the game's credits / about screen:

> *Music by Kevin MacLeod (incompetech.com) — Licensed under Creative Commons Attribution 4.0. Additional tracks from OpenGameArt.org contributors.*

---

## Ambient Music Map

Each scene and level has a unique ambient texture built from layered oscillators.

| Scene / Level | Mood | Oscillator Configuration |
|---|---|---|
| **Landing Page** | Mysterious, inviting | 110Hz sine, 165Hz triangle, 55Hz sawtooth |
| **Lobby** | Anticipatory, light | 220Hz triangle, 330Hz sine, 110Hz pulse |
| **Cutscenes** | Dramatic, cinematic | 130Hz sine, 196Hz triangle — slow and sparse |
| **Level 1 — Boiler Room** | Industrial, curious | 60Hz sawtooth, 90Hz square, 120Hz sine |
| **Level 2 — Owl Post** | Whimsical, adventurous | 220Hz sine, 330Hz triangle, 440Hz sine |
| **Level 3 — Scriptorium** | Focused, tense | 80Hz sine, 160Hz triangle |
| **Level 4 — Clockwork Greenhouse** | Organic, warm | 174Hz sine, 261Hz triangle, 349Hz sine |
| **Level 5 — Cipher Vault** | Mysterious, dark | 55Hz sine, 82Hz triangle |
| **Level 6 — Steam Engine Room** | Fast, urgent | 50Hz sawtooth, 75Hz square |
| **Level 7 — Orrery** | Cosmic, wonder | 196Hz sine, 294Hz triangle, 392Hz sine |
| **Level 8 — Grand Codex** | Epic, climactic | 65Hz sawtooth, 98Hz triangle, 130Hz sine |
| **Victory** | Triumphant | 261Hz sine, 329Hz triangle, 392Hz sine |

### LFO Wobble (applied to all ambient tracks)

Each oscillator gets a slow LFO for organic movement:

- LFO frequency: **0.10–0.20 Hz** (randomised per oscillator)
- LFO depth: **~2% of the carrier frequency**
- This prevents the ambient from sounding static or electronic

### Master Gain

```
master gain = 0.3 × user volume setting
```

### Scene Transitions

- **Fade out:** `gain.linearRampToValueAtTime(0, currentTime + 2.0)` — 2 second fade
- **Fade in:** `gain.linearRampToValueAtTime(targetGain, currentTime + 2.0)` — 2 second fade
- Transitions are overlapping (start fade-in before fade-out completes) for a smooth crossfade

---

## Sound Effects (One-Shot Stings)

Short procedural sounds triggered by game events. They play on top of ambient music without interrupting it.

| Event | Sound Description | Implementation |
|---|---|---|
| **Flag correct** | Ascending brass fanfare | Three triangle tones: 523Hz → 659Hz → 784Hz, 120ms apart, 300ms each |
| **Flag wrong** | Descending trombone blat | Two sawtooth tones: 200Hz → 150Hz, 200ms each, fast decay |
| **Hint revealed** | Clockwork chime | Two soft sine tones: 440Hz → 554Hz, 100ms apart |
| **Clue spoiler revealed** | Deeper chime | Two sine tones: 330Hz → 415Hz, slightly slower |
| **Player joins room** | Gear engagement click | 300Hz square wave, 50ms, sharp attack/decay |
| **Chat message received** | Telegraph tap | 880Hz sine, 30ms, very short |
| **Lockout start** | Steam valve hiss + buzz | 120Hz square, 300ms, exponential decay |
| **Lockout tick** | Mechanical click | 600Hz triangle, 20ms per tick, every 1 second |
| **Timer warning (<2 min)** | Ratchet ticking overlay | 1000Hz sine, 80ms on / 920ms off, loops until timer ends or level solved |
| **Level complete** | Full orchestral sting | Stacked triangle tones: 261Hz + 329Hz + 392Hz simultaneously, 500ms, slow decay |
| **Game complete (Victory)** | Extended fanfare | Same as level complete but longer (1200ms) with a follow-up chord |
| **Nano save** | Soft confirmation | 440Hz sine, 80ms, gentle |
| **Nano close (no save)** | Soft cancel | 330Hz sine, 80ms |

---

## Timed Mode — Audio Behaviour

| Timer State | Audio Change |
|---|---|
| Normal play | Standard level ambient only |
| Under 5 minutes | Ambient tempo subjectively increases (raise LFO rate to 0.3Hz) |
| Under 2 minutes | Add ratchet ticking SFX overlay on top of ambient |
| Timer expires | Ambient stops, short descending sting plays, then silence |

The ticking overlay is additive — it plays simultaneously with the ambient music and does not replace it.

---

## Audio Behaviour Rules

```
┌─────────────────────────────────────────────────────────────┐
│  AMBIENT MUSIC                                              │
│  ├── Loops seamlessly (oscillators never stop)             │
│  ├── Fades out over 2s on scene transition                 │
│  ├── Fades in over 2s on new scene                         │
│  └── Continues uninterrupted during wrong flag attempts    │
│                                                             │
│  SOUND EFFECTS                                              │
│  ├── Play on top of ambient (separate gain node)           │
│  ├── One-shot — start and stop automatically               │
│  └── Never interrupt ambient music                         │
│                                                             │
│  TIMED MODE OVERLAY                                         │
│  ├── Additive — layered on top of ambient                  │
│  ├── Starts at 2 minutes remaining                         │
│  └── Stops when flag is submitted (correct or level end)   │
└─────────────────────────────────────────────────────────────┘
```

---

## Volume Controls (always visible in game header)

| Control | Type | Behaviour |
|---|---|---|
| 🎵 Music toggle | Button — "♪ ON" / "♪ OFF" | Stops/resumes ambient oscillators |
| 🔊 Master volume | Slider — 0.0 to 1.0, step 0.1 | Scales master gain node in real time |
| 🔔 SFX toggle | Button (optional) | Enables/disables one-shot stings |

Volume preference should be saved to `localStorage` and restored on next visit.

---

## Web Audio API Implementation Pattern

```javascript
class AudioManager {

  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientNodes = [];
    this.sfxGain = null;
    this.volume = 0.4;
    this.musicEnabled = true;
  }

  // Call on first user gesture
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.volume * 0.3;
    this.masterGain.connect(this.ctx.destination);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = this.volume;
    this.sfxGain.connect(this.ctx.destination);
  }

  // Play ambient texture for a scene
  playAmbient(config) {
    if (!this.musicEnabled) return;
    this.stopAmbient();
    config.forEach(({ freq, amp, wave }) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      osc.type = wave;
      osc.frequency.value = freq;
      gain.gain.value = amp;

      lfo.frequency.value = 0.10 + Math.random() * 0.10;
      lfoGain.gain.value = freq * 0.02;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(gain);
      gain.connect(this.masterGain);

      lfo.start();
      osc.start();

      this.ambientNodes.push(osc, lfo, gain, lfoGain);
    });
  }

  // Crossfade to new ambient
  transitionTo(config) {
    const t = this.ctx.currentTime;
    this.masterGain.gain.linearRampToValueAtTime(0, t + 2);
    setTimeout(() => {
      this.stopAmbient();
      this.masterGain.gain.linearRampToValueAtTime(this.volume * 0.3, this.ctx.currentTime + 2);
      this.playAmbient(config);
    }, 2000);
  }

  stopAmbient() {
    this.ambientNodes.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch(e) {} });
    this.ambientNodes = [];
  }

  // Play a one-shot sting
  playSting(freqs, wave = 'triangle', duration = 0.3, spacing = 0.12) {
    freqs.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = this.ctx.currentTime + i * spacing;

      osc.type = wave;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(this.volume * 0.5, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(start);
      osc.stop(start + duration + 0.05);
    });
  }

  setVolume(v) {
    this.volume = v;
    if (this.masterGain) this.masterGain.gain.value = v * 0.3;
    if (this.sfxGain) this.sfxGain.gain.value = v;
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) this.stopAmbient();
  }
}
```

---

## Ambient Config Reference

Copy-paste configs for each scene:

```javascript
const AMBIENT_CONFIGS = {
  landing:     [{ freq:110, amp:0.30, wave:'sine' },     { freq:165, amp:0.20, wave:'triangle' }, { freq:55,  amp:0.15, wave:'sawtooth' }],
  lobby:       [{ freq:220, amp:0.25, wave:'triangle' }, { freq:330, amp:0.15, wave:'sine' },     { freq:110, amp:0.10, wave:'square'   }],
  cutscene:    [{ freq:130, amp:0.30, wave:'sine' },     { freq:196, amp:0.15, wave:'triangle' }],
  boilerRoom:  [{ freq:60,  amp:0.40, wave:'sawtooth' }, { freq:90,  amp:0.20, wave:'square' },   { freq:120, amp:0.10, wave:'sine'     }],
  owlPost:     [{ freq:220, amp:0.25, wave:'sine' },     { freq:330, amp:0.15, wave:'triangle' }, { freq:440, amp:0.10, wave:'sine'     }],
  scriptorium: [{ freq:80,  amp:0.30, wave:'sine' },     { freq:160, amp:0.15, wave:'triangle' }],
  greenhouse:  [{ freq:174, amp:0.25, wave:'sine' },     { freq:261, amp:0.20, wave:'triangle' }, { freq:349, amp:0.15, wave:'sine'     }],
  cipherVault: [{ freq:55,  amp:0.35, wave:'sine' },     { freq:82,  amp:0.20, wave:'triangle' }],
  engineRoom:  [{ freq:50,  amp:0.40, wave:'sawtooth' }, { freq:75,  amp:0.25, wave:'square'   }],
  orrery:      [{ freq:196, amp:0.20, wave:'sine' },     { freq:294, amp:0.15, wave:'triangle' }, { freq:392, amp:0.10, wave:'sine'     }],
  grandCodex:  [{ freq:65,  amp:0.35, wave:'sawtooth' }, { freq:98,  amp:0.25, wave:'triangle' }, { freq:130, amp:0.20, wave:'sine'     }],
  victory:     [{ freq:261, amp:0.30, wave:'sine' },     { freq:329, amp:0.25, wave:'triangle' }, { freq:392, amp:0.20, wave:'sine'     }],
};
```

---

## SFX Reference

```javascript
const SFX = {
  flagCorrect:  { freqs: [523, 659, 784], wave: 'triangle', duration: 0.3,  spacing: 0.12 },
  flagWrong:    { freqs: [200, 150],      wave: 'sawtooth', duration: 0.2,  spacing: 0.15 },
  hintRevealed: { freqs: [440, 554],      wave: 'sine',     duration: 0.25, spacing: 0.10 },
  playerJoins:  { freqs: [300],           wave: 'square',   duration: 0.05, spacing: 0    },
  chatMessage:  { freqs: [880],           wave: 'sine',     duration: 0.03, spacing: 0    },
  lockout:      { freqs: [120],           wave: 'square',   duration: 0.30, spacing: 0    },
  levelComplete:{ freqs: [261, 329, 392], wave: 'triangle', duration: 0.5,  spacing: 0    }, // simultaneous
  victory:      { freqs: [261, 329, 392], wave: 'triangle', duration: 1.2,  spacing: 0    },
};
```

For `levelComplete` and `victory`, all frequencies play simultaneously (spacing: 0) rather than sequentially.
