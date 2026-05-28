export const INTRO_CUTSCENE = {
  speaker: 'HEADMISTRESS IRONCLAD',
  text: 'The Academy shudders. Somewhere deep within the Grand Codex, Professor Nullbyte has planted a corruption — a dark algorithm that rewrites spells, locks chambers, and silences the clockwork familiars.\n\nYou are our last hope, young engineers. Eight chambers stand between you and the heart of the Codex. Each one is sealed with a Runic Fragment.\n\nYour brass terminals are your wands. Code is your magic.\n\nBegin in the Boiler Room. And do not let the gears stop turning.'
};

export const VICTORY_CUTSCENE = {
  speaker: 'THE GRAND CODEX',
  text: 'All eight Runic Fragments restored. The corruption dissolves. Nullbyte retreats into the static. The Academy breathes again — gears turning, steam flowing, spells working.\n\nYou are true Arcane Engineers of Cogsworth Academy.'
};

export const LEVELS = [
  {
    id: 1,
    name: "The Boiler Room",
    story: "The great boiler sputters and hisses. A dusty Python scroll lies on the floor. Run it to hear the incantation.",
    flag: "steam_and_sparks",
    timerMinutes: 10,
    unlockedCommands: ['ls', 'cat', 'python3', 'help', 'clear', 'echo'],
    filesystem: {
      'README.txt': 'Welcome to the Boiler Room!\n\nA Python scroll lies here. Try:\n  ls\n  cat scroll.py\n  python3 scroll.py',
      'scroll.py': 'print("Runic Fragment: steam_and_sparks")'
    },
    env: {},
    clues: [
      'There is a Python scroll in this chamber. Can you see it?',
      'Try: ls then cat scroll.py to read it first',
      '(Spoiler) Run python3 scroll.py — the flag is printed as "Runic Fragment:"'
    ],
    cutsceneAfter: {
      speaker: 'THE SENTIENT BOILER',
      text: 'The boiler trembles and hisses triumphantly. Its valves glow with restored power. The first Fragment is returned to the Codex.\n\nYou feel a pulse of energy ripple through the Academy. Seven chambers remain.'
    }
  },
  {
    id: 2,
    name: "The Owl Post",
    story: "Dozens of scrolls litter the floor. One contains the Runic Fragment, but it's hidden using a dotted name. The postal owls screen at you impatiently.",
    flag: "owl_sees_all",
    timerMinutes: 10,
    unlockedCommands: ['ls', 'cat', 'python3', 'help', 'clear', 'echo'],
    filesystem: {
      'README.txt': 'Welcome to the Owl Post!\n\nMany scrolls lie here, but the important one is hidden.\nTry: ls\nThen try: ls -la\n\nIn Unix, files starting with . are hidden from plain ls.',
      'scroll_1.txt': 'Mundane mail routing instructions for route A7.',
      'scroll_2.txt': 'Delivery schedule for the eastern tower.',
      'scroll_3.txt': 'Owl training guidelines and feeding times.',
      'scroll_4.txt': 'List of retired postal owls and their pensions.',
      'scroll_5.txt': 'Weather forecast for the next fortnight.',
      '.secret_scroll': 'code: owl_sees_all'
    },
    env: {},
    clues: [
      'In Unix, files starting with . are hidden from plain ls',
      'Use ls -la to see ALL files including hidden ones',
      '(Spoiler) cat .secret_scroll — the flag is inside'
    ],
    cutsceneAfter: {
      speaker: 'CAPTAIN FEATHERWICK (Chief Postal Owl)',
      text: 'The head owl ruffles its brass-plated wings and delivers a satisfied screech. The Fragment glows in your hands.\n\nAhead lies the Scriptorium, where the enchanted quills grow restless. Their scratching echoes down the corridor.'
    }
  },
  {
    id: 3,
    name: "The Scriptorium",
    story: "An enchanted quill wrote a spell, but it has a flaw. Fix the code and run it to hear the incantation. The quill hovers impatiently, waiting for your corrections.",
    flag: "quill_and_code",
    timerMinutes: 10,
    unlockedCommands: ['ls', 'cat', 'python3', 'nano', 'help', 'clear', 'echo'],
    filesystem: {
      'README.txt': 'Welcome to the Scriptorium!\n\nAn enchanted quill wrote a spell, but there\'s a syntax error.\nTry: python3 spell.py\n\nRead the error message carefully — it tells you which line is broken.\nUse nano to fix it: nano spell.py',
      'spell.py': 'def reveal_fragment()\n    print("Runic Fragment: quill_and_code")\n\nreveal_fragment()'
    },
    env: {},
    clues: [
      'Run python3 spell.py and read the error message — it tells you the line number',
      'Python functions need a : at the end of their definition line',
      '(Spoiler) Add : after reveal_fragment() on line 1, save with nano, run again'
    ],
    cutsceneAfter: {
      speaker: 'THE ENCHANTED QUILL',
      text: 'The quill falls silent, its tip glowing softly. The Fragment materializes, humming with corrected magic.\n\nThree chambers cleared. The Codex pulses with growing power. But deeper still, in the heart of the Academy, something stirs.'
    }
  }
];

export function getLevelByNumber(num) {
  return LEVELS.find(l => l.id === num);
}

export const USERNAMES = [
  'Harriet Cogswell', 'Ronwick Brassford', 'Hermix Gearhart', 'Nev Steamhollow',
  'Pip Ironwick', 'Cog Ashvane', 'Ember Tinderwick', 'Sable Wrenchmore',
  'Flint Gearsley', 'Vesper Coppermill', 'Hatch Boilerton', 'Cinder Locksworth',
  'Rune Pipewick', 'Soot Hammerby', 'Wren Valvemore', 'Brass Kettlewick'
];
