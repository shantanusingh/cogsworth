# Cogsworth Academy — MVP

A browser-based multiplayer text adventure CTF game built with React, Vite, xterm.js, Pyodide, and Supabase.

## Quick Start

### Local Development

1. **Set up Supabase** (if you haven't already):
   - Create a new Supabase project at https://supabase.com
   - Run the schema from `supabase/schema.sql` in the SQL editor
   - Copy your project URL and anon key

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   - Copy `.env.example` to `.env`
   - Replace `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with your Supabase credentials

4. **Start development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

### Testing Multiplayer Locally

- Open the app in two browser tabs
- Tab 1: Create a room (get 6-digit code)
- Tab 2: Join with the code
- Host clicks "Start Game"
- Both tabs load Level 1

## Deployment to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial Cogsworth Academy MVP"
   git remote add origin https://github.com/YOUR_USERNAME/cogsworth-academy.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Add environment variables:
     - `VITE_SUPABASE_URL` = your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
   - Deploy

3. **Vercel will automatically**:
   - Run `npm install`
   - Run `npm run build`
   - Deploy the `dist/` folder as your static site

## Project Structure

```
src/
  ├── engine/
  │   ├── levels.js           # Level definitions
  │   ├── filesystem.js       # Virtual filesystem
  │   ├── commands.js         # Terminal commands
  │   └── pythonRunner.js     # Pyodide integration
  ├── lib/
  │   └── supabase.js         # Supabase client
  ├── components/
  │   ├── Terminal.jsx        # xterm.js wrapper
  │   ├── ChatPanel.jsx       # Real-time chat
  │   ├── StoryPanel.jsx      # Level briefing
  │   ├── FlagSubmit.jsx      # Flag input & submission
  │   └── NanoEditor.jsx      # Text editor
  ├── screens/
  │   ├── Landing.jsx         # Title screen
  │   ├── Setup.jsx           # Create/join room
  │   ├── Lobby.jsx           # Waiting room
  │   └── Game.jsx            # Main gameplay
  ├── App.jsx                 # Screen state machine
  └── main.jsx                # React entry point
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Terminal | xterm.js 5 |
| Python | Pyodide (WebAssembly) |
| Real-time | Supabase Realtime |
| Database | Supabase PostgreSQL |
| Hosting | Vercel |
| Styling | Tailwind CSS + plain CSS |
| Fonts | Google Fonts (Cinzel, Special Elite, Share Tech Mono) |

## Level 1: The Boiler Room

Players must:
1. Run `ls` to see available files
2. Run `cat scroll.py` to read the Python script
3. Run `python3 scroll.py` to execute it
4. Get output: `Runic Fragment: steam_and_sparks`
5. Submit flag: `steam_and_sparks`

Available commands: `ls`, `cat`, `python3`, `help`, `clear`, `echo`

## Features (MVP)

✅ Level 1 fully implemented
✅ Real Pyodide Python execution
✅ Virtual filesystem with nano editor
✅ Real-time multiplayer chat
✅ Room creation & joining
✅ Flag submission with lockout
✅ Build & deploy ready

## Known Limitations

- Level 1 only (levels 2–8 deferred)
- No cutscenes or audio (deferred)
- No timed mode (deferred)
- Minimum desktop resolution: 1024px

## Next Steps

To add more levels:
1. Add level definitions to `src/engine/levels.js`
2. Create filesystem & clues for each level
3. Deploy to Vercel (auto-deploys on push)

## Troubleshooting

**Blank page on load?**
- Check browser console for errors (F12)
- Verify `.env` has correct Supabase credentials
- Clear browser cache

**Supabase connection failing?**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check Supabase project is online
- Ensure schema was run successfully

**Python script not running?**
- Check the script syntax
- Look for error messages in terminal
- Verify filename is correct (e.g., `scroll.py`)

## Support

See PROJECT.md for full game specifications and level content.
