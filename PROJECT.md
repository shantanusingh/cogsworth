# Cogsworth Academy — Claude Code Build Prompt

## Project Overview

Build a full-stack, browser-based, multiplayer text adventure CTF game called **Cogsworth Academy of Arcane Engineering** — a steampunk Harry Potter themed hacking game for kids aged 10–12. Players solve programming and cryptography challenges inside a browser terminal to progress through 8 story-driven chambers.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS (or plain CSS modules) |
| Terminal emulation | xterm.js |
| Python in browser | Pyodide (WebAssembly) |
| Real-time chat + rooms | Supabase Realtime |
| Flag submission / progress | Supabase (Postgres + Realtime) |
| Auth | Supabase anonymous sessions (no login needed) |
| Hosting | Vercel (frontend) + Supabase (backend) |
| Audio | Web Audio API (no external library) |
| Fonts | Google Fonts: Cinzel, Special Elite, Share Tech Mono |

---

## Project Structure

```
cogsworth-academy/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── screens/
│   │   ├── Landing.jsx
│   │   ├── Setup.jsx
│   │   ├── Lobby.jsx
│   │   ├── Cutscene.jsx
│   │   ├── Game.jsx
│   │   └── Victory.jsx
│   ├── components/
│   │   ├── Terminal.jsx         # xterm.js wrapper
│   │   ├── ChatPanel.jsx        # real-time team chat
│   │   ├── StoryPanel.jsx       # chamber briefing
│   │   ├── FlagSubmit.jsx       # flag input + lockout
│   │   ├── CluePanel.jsx        # 3 clues per level
│   │   ├── CutsceneRenderer.jsx # typewriter effect
│   │   ├── AudioManager.jsx     # Web Audio API wrapper
│   │   ├── TimerDisplay.jsx     # countdown for timed mode
│   │   └── NanoEditor.jsx       # simple in-browser file editor
│   ├── engine/
│   │   ├── commands.js          # terminal command handlers
│   │   ├── pythonRunner.js      # Pyodide integration
│   │   ├── filesystem.js        # per-level virtual filesystem
│   │   └── levels.js            # all 8 level definitions
│   ├── lib/
│   │   ├── supabase.js          # Supabase client
│   │   └── audio.js             # ambient music + SFX
│   └── hooks/
│       ├── useRoom.js           # room creation / joining
│       ├── useChat.js           # real-time chat subscription
│       └── useTimer.js          # countdown logic
├── supabase/
│   └── schema.sql               # DB schema
├── public/
│   └── index.html
├── .env.example
├── vite.config.js
└── package.json
```

---

## Design & Visual Style

- **Background:** Near-black (`#0a0a0f`) with dark navy panels
- **Accent colour:** Amber/gold (`#d4a843`, `#f0c060`) — all headings, terminal prompts, flags
- **Terminal text:** Green (`#4aff91`) for commands, white for output, red for errors, amber for flag reveals
- **Fonts:**
  - Headings/titles: `Cinzel` (serif, regal)
  - Story text: `Special Elite` (typewriter feel)
  - Terminal + UI: `Share Tech Mono` (monospace)
- **Decorative elements:** Rotating CSS gear animations on the landing page
- **Terminal:** Dark `#050508` background, green cursor, authentic bash-like prompt: `harriet@cogsworth:~$`
- **No rounded corners** on terminal elements — everything sharp and industrial

---

## Screen Flow

```
Landing
  ├── Create Room → Setup (create flow) → Lobby → Cutscene (intro) → Game Loop → Victory
  └── Join Room  → Setup (join flow)  → Lobby → (wait for host to start)
```

---

## Screen Specifications

### 1. Landing Screen
- Animated rotating CSS gears in background corners
- Title: "COGSWORTH ACADEMY" in Cinzel font with amber glow text-shadow
- Subtitle: "of Arcane Engineering"
- Tagline: short flavour text about Professor Nullbyte
- Two buttons: "⚙ Create Room" and "↯ Join Room"
- Play ambient landing music on first click (Web Audio API — see Audio section)

### 2. Setup Screen

**Create Room flow:**
- Team name input
- Game mode selector — two cards side by side:
  - **Normal Mode:** No timer. Take your time.
  - **Timed Mode:** Each chamber has a countdown (see timer values per level below)
- Username picker — grid of 16 pre-set steampunk names (see names list below)
- "Generate Room Code" button → shows a large 6-digit code the host shares with teammates

**Join Room flow:**
- Large centred input for 6-digit room code
- Same username picker grid
- "Join the Academy" button

### 3. Lobby Screen
- Shows team name, room code, game mode
- 4 player slots in a 2×2 grid — filled slots show the player name in green, empty slots say "[ waiting... ]"
- For this build, simulate multiple players by storing up to 4 names in Supabase room record
- "Start Game" button (only host sees it, or just show it for all in MVP)
- Clicking Start → plays intro cutscene for all players in room simultaneously via Supabase Realtime broadcast

### 4. Cutscene Screen
- Full black background
- ASCII art header (level-specific, see content below)
- Speaker label in Cinzel amber caps (e.g. "HEADMISTRESS IRONCLAD")
- Typewriter effect for story text (28ms per character)
- "[ PRESS ENTER OR CLICK TO CONTINUE ]" blinking prompt after text finishes
- Auto-advance after 15 seconds if no input
- Each cutscene triggers the next level to load for all players via Supabase Realtime

### 5. Game Screen (main layout)

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER: Title | Chamber name | Audio controls | Timer | Dots │
├───────────────────────────────────┬──────────────────────────┤
│  STORY PANEL (scrollable, 140px)  │                          │
├───────────────────────────────────│   CHAT PANEL             │
│                                   │   (Supabase Realtime)    │
│  TERMINAL (xterm.js, flex 1)      │   - messages             │
│                                   │   - system events        │
│                                   │   - share snippet btn    │
│                                   │   - chat input           │
├───────────────────────────────────┴──────────────────────────┤
│  FOOTER: Clue buttons | Flag input (COGSWORTH{___}) | Submit  │
└──────────────────────────────────────────────────────────────┘
```

**Header:**
- Game title + current chamber name
- Level progress dots (8 dots, completed=green, current=amber, future=dark)
- Timer display (only in Timed mode) — turns red and blinks under 2 minutes
- Audio controls: music toggle + volume slider

**Story Panel:**
- Label: "📜 Chamber Briefing"
- Chamber story text in Special Elite font

**Terminal Panel (xterm.js):**
- Header bar: "BRASS TERMINAL v2.4 — [username]" + green "● CONNECTED" dot
- xterm.js instance mounted here
- Input row at bottom with coloured prompt

**Chat Panel (260px wide, right side):**
- Header: "⚡ team comms"
- Scrolling message feed — player messages, system events, snippet shares
- "📎 share last 5 lines with team" button (sends last 5 terminal lines as a code block to chat)
- Chat input + send button
- System messages (styled differently — italic, steam blue colour):
  - `⚙ [player] entered the chamber`
  - `⚠ [player] submitted an incorrect flag`
  - `✅ [player] solved [chamber]!`
  - `💡 The team revealed Clue 2`
  - `⏱ 5 minutes remaining`

**Footer:**
- Clue buttons (3 per level): "💡 Clue 1", "💡 Clue 2", "🔑 Spoiler"
  - Once clicked: disabled, clue text printed to terminal, broadcast to all players via chat
- Flag submission: `COGSWORTH{` [input field] `}` [SUBMIT button]
  - Correct → success sting, broadcast to team, advance to cutscene
  - Wrong → 10-second per-player lockout (other players can still submit), error printed to terminal

### 6. Victory Screen
- Dark background with golden radial glow
- "ACADEMY RESTORED" title with amber text-shadow
- Flavour text about defeating Nullbyte
- "Play Again" button → back to landing

---

## Terminal Implementation

Use **xterm.js** for the terminal UI. For Python execution, use **Pyodide** loaded via CDN.

### Commands available (unlocked progressively per level)

| Command | Behaviour |
|---|---|
| `help` | Lists available commands with descriptions |
| `ls` | Lists non-hidden files |
| `ls -la` | Lists ALL files including dotfiles |
| `cat <file>` | Prints file contents |
| `python3 <script.py> [args]` | Runs script via Pyodide |
| `env` | Shows environment variables |
| `export KEY=value` | Sets an env variable |
| `echo $VAR` | Prints env variable value |
| `grep "pattern" file` | Searches file for matching lines |
| `grep -i "pattern" file` | Case-insensitive grep |
| `nano <file>` | Opens in-browser file editor (editable files only) |
| `clear` | Clears terminal output |

**Terminal behaviour:**
- Arrow Up/Down: command history
- Ctrl+C: interrupt (prints `^C`, clears input)
- Prompt format: `username@cogsworth:~$` in green
- Command text: green
- Output: white/light grey
- Errors: red
- System messages: steel blue
- Flag reveals: amber bold

### Nano editor
When `nano <file>` is called on an editable file, open a full-screen overlay with:
- Dark green-tinted background (#050f05)
- Textarea with monospace font, pre-filled with current file content
- Header: "GNU nano — [filename]" with Ctrl+X and Ctrl+S hints
- Save button (Ctrl+S): updates the in-memory filesystem, closes overlay
- Close button (Ctrl+X): closes without saving

### Virtual Filesystem
Each level gets its own filesystem object. Store as a React ref or Zustand store. When `nano` saves, mutate the ref. When `python3` runs, Pyodide reads from this virtual FS (write files to Pyodide's FS before running).

---

## Pyodide Integration

```javascript
// Load Pyodide once on app start
const pyodide = await loadPyodide();

// Before running a script, write all virtual FS files to Pyodide FS
Object.entries(virtualFS).forEach(([name, content]) => {
  pyodide.FS.writeFile(name, content);
});

// Set environment variables
Object.entries(envVars).forEach(([k,v]) => {
  if(v) pyodide.runPython(`import os; os.environ['${k}'] = '${v}'`);
});

// Inject sys.argv
pyodide.runPython(`import sys; sys.argv = ${JSON.stringify([scriptName, ...args])}`);

// Capture stdout
pyodide.runPython(`
import sys
from io import StringIO
_stdout = StringIO()
sys.stdout = _stdout
`);

// Run the script
try {
  pyodide.runPython(scriptContent);
  const output = pyodide.runPython('_stdout.getvalue()');
  // split by \n and print to terminal
} catch(e) {
  // print error to terminal in red
} finally {
  pyodide.runPython('sys.stdout = sys.__stdout__');
}
```

This gives kids **real Python execution** — their edits in nano actually run.

---

## Supabase Schema

```sql
-- Room table
create table rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  team_name text not null,
  mode text not null default 'normal', -- 'normal' | 'timed'
  current_level int not null default 0,
  status text not null default 'lobby', -- 'lobby' | 'playing' | 'complete'
  created_at timestamptz default now()
);

-- Players table
create table players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  username text not null,
  is_host boolean default false,
  joined_at timestamptz default now()
);

-- Chat messages table
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  player_name text,
  message text not null,
  type text default 'player', -- 'player' | 'system' | 'success' | 'snippet'
  created_at timestamptz default now()
);

-- Enable realtime on all tables
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table chat_messages;
```

### Supabase Realtime usage

- Subscribe to `rooms` row changes → when `current_level` or `status` changes, all players advance together
- Subscribe to `chat_messages` inserts → live chat feed
- When host clicks Start: update `rooms.status = 'playing'`
- When any player solves a level: update `rooms.current_level += 1`
- When any player sends chat / shares snippet / uses a clue: insert to `chat_messages`

---

## All 8 Levels — Full Content

### Level 1 — The Boiler Room
**Story:** The great boiler sputters and hisses. A dusty Python scroll lies on the floor. Run it to hear the incantation.

**Files:**
- `scroll.py` — working Python script that prints "Runic Fragment: steam_and_sparks"
- `README.txt` — instructions to run python3 scroll.py

**Commands unlocked:** `ls`, `cat`, `python3`, `help`, `clear`, `echo`

**Clues:**
1. There is a Python scroll in this chamber. Can you see it?
2. Try: `ls` then `cat scroll.py` to read it first
3. (Spoiler) Run `python3 scroll.py` — the flag is printed as "Runic Fragment:"

**Flag:** `steam_and_sparks`
**Timer (timed mode):** 10 minutes

---

### Level 2 — The Owl Post
**Story:** Dozens of scrolls litter the floor. One contains the Runic Fragment, but it's hidden using a dotted name.

**Files:**
- `scroll_1.txt` through `scroll_5.txt` — decoy files with mundane content
- `.secret_scroll` — hidden dotfile containing "code: owl_sees_all"
- `README.txt` — hint about ls -la

**Commands unlocked:** `ls`, `cat`, `help`, `clear`, `python3`, `echo`

**Clues:**
1. In Unix, files starting with `.` are hidden from plain `ls`
2. Use `ls -la` to see ALL files including hidden ones
3. (Spoiler) `cat .secret_scroll` — the flag is inside

**Flag:** `owl_sees_all`
**Timer:** 10 minutes

---

### Level 3 — The Scriptorium
**Story:** An enchanted quill wrote a spell, but it has a flaw. Fix it so it runs without error.

**Files:**
- `spell.py` — broken Python script (missing colon after function def on line 4)
- `README.txt` — hints about reading error messages and fixing

**The bug:** `def reveal_fragment()` is missing the `:` → should be `def reveal_fragment():`

**When fixed and run:** prints "Runic Fragment: quill_and_code"

**Commands unlocked:** `ls`, `cat`, `python3`, `nano`, `help`, `clear`, `echo`
**Editable files:** `spell.py`

**Clues:**
1. Run `python3 spell.py` and read the error message — it tells you the line number
2. Python functions need a `:` at the end of their definition line
3. (Spoiler) Add `:` after `reveal_fragment()` on line 4, save with nano, run again

**Flag:** `quill_and_code`
**Timer:** 10 minutes

---

### Level 4 — The Clockwork Greenhouse
**Story:** An automaton tends magical plants. It accepts command-line arguments. Find the right combination to make the Thornwhisper Vine bloom.

**Files:**
- `automaton.py` — uses `sys.argv`, checks for plant="thornwhisper" and command="bloom"
- `MANUAL.txt` — lists plant names and growth commands

**Correct invocation:** `python3 automaton.py thornwhisper bloom`

**Clues:**
1. Read MANUAL.txt — the automaton needs two arguments
2. Format: `python3 automaton.py <plant> <command>`. Only one combination blooms.
3. (Spoiler) `python3 automaton.py thornwhisper bloom`

**Flag:** `roots_and_brass`
**Timer:** 15 minutes

---

### Level 5 — The Cipher Vault
**Story:** A decoder script needs a KEY stored as an environment variable. The key is hinted at in the env itself.

**Files:**
- `decoder.py` — reads `os.environ.get("VAULT_KEY")`, if correct key decodes a ROT13 string
- `README.txt` — explains `env` and `export` commands

**Environment pre-set:**
- `VAULT_KEY_HINT=The key is: nullbyte_nemesis`
- `COGSWORTH_LEVEL=5`

**Player must:** run `env` → spot `VAULT_KEY_HINT` → run `export VAULT_KEY=nullbyte_nemesis` → run `python3 decoder.py`

**Clues:**
1. Run `env` to see all environment variables. Look for anything suspicious.
2. Use `export VAULT_KEY=<value>` to set the variable, then run the decoder
3. (Spoiler) `export VAULT_KEY=nullbyte_nemesis` then `python3 decoder.py`

**Flag:** `the_lock_is_open`
**Timer:** 15 minutes

---

### Level 6 — The Steam Engine Room
**Story:** The engine room log has hundreds of entries. A hidden message was recorded during Nullbyte's attack. Search through the noise.

**Files:**
- `engine.log` — 120 lines of fake pressure/temperature readings. Line 68 contains: `*** RUNE DETECTED *** Fragment: pressure_and_pipes — Nullbyte signature found!`
- `README.txt` — introduces grep syntax

**Clues:**
1. There are hundreds of log lines. Use grep to search. Try: `grep "RUNE" engine.log`
2. `grep` searches for patterns. Try different keywords.
3. (Spoiler) `grep "RUNE" engine.log`

**Flag:** `pressure_and_pipes`
**Timer:** 15 minutes

---

### Level 7 — The Orrery
**Story:** The orbit calculator loop is broken — it runs forever. Fix the loop so it completes and decodes the stellar message.

**Files:**
- `orrery.py` — has a `while i < len(positions)` loop where `i` is never incremented (infinite loop). When fixed (add `i = i + 1`), it converts ASCII codes to "Hello, Orrery" and prints the fragment.
- `README.txt` — explains Ctrl+C and how to fix the loop

**Editable files:** `orrery.py`

**The bug:** Inside the while loop, `i = i + 1` is commented out / missing

**Clues:**
1. Run `python3 orrery.py` — it gets stuck! Press Ctrl+C to escape. Then read the code.
2. The while loop needs `i` to increase each iteration. Add `i = i + 1` inside the loop.
3. (Spoiler) Uncomment or add `i = i + 1` after the print inside the while loop, save, run again.

**Flag:** `clockwork_cosmos`
**Timer:** 20 minutes

---

### Level 8 — The Grand Codex
**Story:** Three-layer challenge. An env variable holds base64, a hidden file holds a reversed string, and a script combines them.

**Files:**
- `codex.py` — reads `CODEX_PART1` (base64) from env, reads `.codex_fragment` (reversed string), decodes both, combines them
- `.codex_fragment` — contains `noitarotser` (the word "restoration" reversed)
- `README.txt` — hints about all three layers

**Environment pre-set:**
- `CODEX_PART1=Z3JhbmQ=` (base64 for "grand")
- `COGSWORTH_LEVEL=8`

**Flow:**
1. `env` → find CODEX_PART1
2. `ls -la` → find .codex_fragment
3. `cat .codex_fragment` → see reversed string
4. `python3 codex.py` → script decodes everything automatically if env is set

**Clues:**
1. Use `env` to find CODEX_PART1, and `ls -la` to find the hidden file
2. CODEX_PART1 is base64 encoded. The hidden file is reversed. Run codex.py after checking.
3. (Spoiler) `python3 codex.py` — CODEX_PART1 is already in env. Just find the hidden file first.

**Flag:** `nullbyte_defeated`
**Timer:** 20 minutes

---

## Cutscene Content

### Intro Cutscene
**Speaker:** HEADMISTRESS IRONCLAD
**Text:**
> The Academy shudders. Somewhere deep within the Grand Codex, Professor Nullbyte has planted a corruption — a dark algorithm that rewrites spells, locks chambers, and silences the clockwork familiars.
>
> You are our last hope, young engineers. Eight chambers stand between you and the heart of the Codex. Each one is sealed with a Runic Fragment.
>
> Your brass terminals are your wands. Code is your magic.
>
> Begin in the Boiler Room. And do not let the gears stop turning.

### Between-Level Cutscenes
Write short 3–5 sentence cutscenes for each of the 8 levels that:
- Confirm the previous chamber was cleared
- Tease the next chamber
- Stay in the steampunk-wizarding tone
- Name the speaker (engineer, familiar, portrait on the wall, the room itself)

### Victory Cutscene
**Speaker:** THE GRAND CODEX
**Text:**
> All eight Runic Fragments restored. The corruption dissolves. Nullbyte retreats into the static. The Academy breathes again — gears turning, steam flowing, spells working.
>
> You are true Arcane Engineers of Cogsworth Academy.

---

## Steampunk Usernames (pre-set list, players pick one)

```
Harriet Cogswell, Ronwick Brassford, Hermix Gearhart, Nev Steamhollow,
Pip Ironwick, Cog Ashvane, Ember Tinderwick, Sable Wrenchmore,
Flint Gearsley, Vesper Coppermill, Hatch Boilerton, Cinder Locksworth,
Rune Pipewick, Soot Hammerby, Wren Valvemore, Brass Kettlewick
```

---

## Audio (Web Audio API — no external library)

Generate all audio procedurally using the Web Audio API. No audio files needed.

### Ambient music per scene
Each scene/level gets a unique combination of oscillators creating a looping ambient texture:

| Scene | Frequencies + Wave Types |
|---|---|
| Landing | 110Hz sine, 165Hz triangle, 55Hz sawtooth — slow LFO wobble |
| Lobby | 220Hz triangle, 330Hz sine, 110Hz pulse |
| Cutscene | 130Hz sine, 196Hz triangle — slow, dramatic |
| Boiler Room | 60Hz sawtooth, 90Hz square, 120Hz sine — industrial |
| Owl Post | 220Hz sine, 330Hz triangle, 440Hz sine — whimsical |
| Scriptorium | 80Hz sine, 160Hz triangle — quiet, focused |
| Greenhouse | 174Hz sine, 261Hz triangle, 349Hz sine — organic |
| Cipher Vault | 55Hz sine, 82Hz triangle — dark, mysterious |
| Engine Room | 50Hz sawtooth, 75Hz square — heavy industrial |
| Orrery | 196Hz sine, 294Hz triangle, 392Hz sine — cosmic |
| Grand Codex | 65Hz sawtooth, 98Hz triangle, 130Hz sine — epic |
| Victory | 261Hz sine, 329Hz triangle, 392Hz sine — triumphant |

Add a per-oscillator LFO (0.1–0.2Hz, ~2% frequency deviation) for organic movement.
Master gain: 0.3 × user volume setting.
Fade in/out over 2 seconds on scene transitions using `gain.linearRampToValueAtTime`.

### Sound effects (one-shot stings)
Implement these as short procedural sounds:

| Event | Sound |
|---|---|
| Flag correct | Three ascending triangle tones: 523Hz, 659Hz, 784Hz, 120ms apart |
| Flag wrong | Two descending sawtooth tones: 200Hz, 150Hz |
| Hint revealed | Two soft sine tones: 440Hz, 554Hz |
| Player joins | Short gear-click: 300Hz square, 50ms |
| Chat message | Soft tap: 880Hz sine, 30ms |
| Lockout start | Buzz: 120Hz square, 300ms, fast fade |
| Timer warning | Ticking overlay: 1000Hz sine, 80ms on/920ms off, loop |

### Audio controls (always visible in game header)
- Music toggle button: "♪ ON" / "♪ OFF"
- Volume slider: range 0–1, step 0.1
- SFX toggle

---

## Game Mode Details

### Normal Mode
- No timer displayed
- Players can take as long as needed
- No penalty for slow progress

### Timed Mode
- Timer displayed in header, top right
- Per-level time limits:
  - Levels 1–3: 10 minutes each
  - Levels 4–6: 15 minutes each
  - Levels 7–8: 20 minutes each
- Under 2 minutes: timer turns red, blinks, ticking SFX overlay added
- On expiry: terminal prints warning, team gets a "try again / skip" option
- Timer is shared/synced across all players via Supabase

---

## Flag Submission Logic

```javascript
function submitFlag(inputValue) {
  const normalised = inputValue.trim().toLowerCase().replace(/\s+/g, '_');
  const correct = LEVELS[currentLevel].flag;

  if (normalised === correct) {
    // 1. Play success sting
    // 2. Print green confirmation to terminal
    // 3. Broadcast win to Supabase room (current_level++)
    // 4. All players see success chat message
    // 5. After 1.8s, show next cutscene (triggered via Supabase broadcast)
  } else {
    // 1. Play wrong sting
    // 2. Print red error to terminal
    // 3. Post "tried wrong flag" to chat (for THIS player only)
    // 4. Start 10-second per-player lockout
    //    - Disable submit button + flag input for this player only
    //    - Show countdown: "Locked — 8s remaining"
    //    - Other players in the room are NOT locked out
  }
}
```

---

## Room & Multiplayer Logic

```javascript
// Create room
const room = await supabase.from('rooms').insert({
  code: generateCode(), // random 6-digit
  team_name: teamName,
  mode: selectedMode,
  current_level: 0,
  status: 'lobby'
}).select().single();

// Join room
const room = await supabase.from('rooms')
  .select().eq('code', enteredCode).single();

// Add player
await supabase.from('players').insert({
  room_id: room.id,
  username: selectedUsername,
  is_host: isCreator
});

// Subscribe to room changes (level advancement, game start)
supabase.channel('room:' + room.id)
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms' },
    (payload) => {
      if (payload.new.current_level !== payload.old.current_level) {
        // All players advance to new level
        loadLevel(payload.new.current_level);
      }
      if (payload.new.status === 'playing' && payload.old.status === 'lobby') {
        // All players see intro cutscene
        showCutscene('intro');
      }
    })
  .subscribe();

// Subscribe to chat
supabase.channel('chat:' + room.id)
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' },
    (payload) => appendChatMessage(payload.new))
  .subscribe();
```

---

## Environment Variables (.env)

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Package.json Dependencies

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x",
    "@xterm/xterm": "^5.x",
    "@xterm/addon-fit": "^0.10.x",
    "pyodide": "^0.26.x",
    "react": "^18.x",
    "react-dom": "^18.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.x",
    "vite": "^5.x",
    "tailwindcss": "^3.x"
  }
}
```

---

## Implementation Notes for Claude Code

1. **Start with the game engine first** (levels.js, commands.js, filesystem.js) — get the terminal fully working with simulated Python output before wiring Pyodide

2. **Pyodide is large (~10MB)** — load it lazily in the background after the landing page renders. Show a "Preparing arcane engine..." status in the lobby.

3. **xterm.js needs the FitAddon** — use it to make the terminal resize with its container. Call `fitAddon.fit()` on window resize.

4. **For Supabase MVP**, if you want to test locally without Supabase, implement a `useLocalRoom` hook that simulates the same interface with localStorage — swap in Supabase later.

5. **Virtual filesystem is a ref, not state** — use `useRef` for the filesystem object so mutations (nano saves) don't cause re-renders. The terminal manages its own output.

6. **Pyodide stdout capture** — use `sys.stdout = StringIO()` before each script run and restore after. Split output by newline, print each line to xterm.

7. **The nano editor** should be a fixed-position overlay (or if inside an iframe, a full-div overlay) with a real `<textarea>` — not a simulated terminal. Real text editing UX is important for kids.

8. **Test each level** end-to-end before moving to the next. The flag for each level should be unreachable unless the correct commands are run in the correct order.

9. **Audio context must be created on user gesture** — create `AudioContext` on the first click/keypress anywhere on the page.

10. **Mobile is not a priority** — design for desktop browsers, minimum 1024px wide.

---

## Acceptance Criteria

- [ ] All 8 levels are completable from start to finish
- [ ] Python scripts run via real Pyodide execution (not simulated)
- [ ] nano editor saves changes that affect subsequent python3 runs
- [ ] Real-time chat works across two browser tabs in the same room
- [ ] Level advancement syncs across all players in a room
- [ ] Timed mode countdown is visible and triggers warning at 2 minutes
- [ ] Wrong flag triggers 10-second lockout on that player only
- [ ] All ambient music plays and transitions smoothly between scenes
- [ ] Game is completable on Chrome and Firefox desktop
