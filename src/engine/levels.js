export const INTRO_CUTSCENE = {
  speaker: 'HEADMISTRESS IRONCLAD',
  text: 'The Academy shudders. Somewhere deep within the Grand Codex, Professor Nullbyte has planted a corruption — a dark algorithm that rewrites spells, locks chambers, and silences the clockwork familiars.\n\nYou are our last hope, young engineers. Eight chambers stand between you and the heart of the Codex. Each one is sealed with a Runic Fragment.\n\nYour brass terminals are your wands. Code is your magic.\n\nBegin in the Boiler Room. And do not let the gears stop turning.'
};

export const VICTORY_CUTSCENE = {
  speaker: 'THE GRAND CODEX',
  text: 'All eight Runic Fragments restored. The corruption dissolves. Nullbyte retreats into the static. The Academy breathes again — gears turning, steam flowing, spells working.\n\nYou are true Arcane Engineers of Cogsworth Academy.'
};

// Generate fake engine log with hidden message
function generateEngineLog() {
  const lines = [];
  for (let i = 1; i <= 120; i++) {
    if (i === 68) {
      lines.push('*** RUNE DETECTED *** Fragment: pressure_and_pipes — Nullbyte signature found!');
    } else {
      const pressure = (80 + Math.random() * 40).toFixed(1);
      const temp = (90 + Math.random() * 60).toFixed(1);
      lines.push(`[${String(i).padStart(3, '0')}] Pressure: ${pressure}PSI | Temp: ${temp}°C | Status: OK`);
    }
  }
  return lines.join('\n');
}

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
  },
  {
    id: 4,
    name: "The Clockwork Greenhouse",
    story: "An automaton tends magical plants, its brass limbs moving with mechanical precision. It will only bloom the Thornwhisper Vine for the correct combination of words. The MANUAL lies nearby.",
    flag: "roots_and_brass",
    timerMinutes: 15,
    unlockedCommands: ['ls', 'cat', 'python3', 'help', 'clear', 'echo'],
    filesystem: {
      'README.txt': 'Welcome to the Clockwork Greenhouse!\n\nAn automaton tends magical plants here.\nIt responds to command-line arguments.\n\nTry: python3 automaton.py <plant> <command>\n\nRead the MANUAL first to learn the right words.',
      'MANUAL.txt': 'AUTOMATON OPERATION MANUAL\n\nAvailable Plants:\n  - thornwhisper\n  - nightbloom\n  - sunflower\n  - moonvine\n\nAvailable Commands:\n  - bloom\n  - wilt\n  - grow\n  - sleep\n\nOnly ONE combination will make the plant bloom.\nFind it.',
      'automaton.py': 'import sys\n\nif len(sys.argv) < 3:\n    print("Error: Requires two arguments")\n    sys.exit(1)\n\nplant = sys.argv[1]\ncommand = sys.argv[2]\n\nif plant == "thornwhisper" and command == "bloom":\n    print("Runic Fragment: roots_and_brass")\nelse:\n    print("The automaton ignores your command.")'
    },
    env: {},
    clues: [
      'Read MANUAL.txt — the automaton needs two arguments',
      'Format: python3 automaton.py <plant> <command>. Only one combination blooms.',
      '(Spoiler) python3 automaton.py thornwhisper bloom'
    ],
    cutsceneAfter: {
      speaker: 'THE AUTOMATON',
      text: 'Brass gears whir and click in triumph. The Thornwhisper Vine blooms with ethereal light, its petals shimmering with the Fragment\'s power.\n\nThe automaton bows mechanically. Four chambers restored. The corruption weakens further.'
    }
  },
  {
    id: 5,
    name: "The Cipher Vault",
    story: "A decoder machine hums behind an ancient door. To unlock it, you must find a KEY hidden as an environment variable. A hint has been left in the air itself.",
    flag: "the_lock_is_open",
    timerMinutes: 15,
    unlockedCommands: ['ls', 'cat', 'python3', 'help', 'clear', 'echo', 'env', 'export'],
    filesystem: {
      'README.txt': 'Welcome to the Cipher Vault!\n\nA decoder machine awaits. It needs a KEY.\n\nTry these steps:\n1. Run: env\n2. Look for a hint about the KEY\n3. Use: export VAULT_KEY=<value>\n4. Run: python3 decoder.py',
      'decoder.py': 'import os\n\nkey = os.environ.get("VAULT_KEY")\n\nif key == "nullbyte_nemesis":\n    print("Runic Fragment: the_lock_is_open")\nelse:\n    print("The decoder beeps sadly. Wrong key.")'
    },
    env: {
      'VAULT_KEY_HINT': 'The key is: nullbyte_nemesis',
      'COGSWORTH_LEVEL': '5'
    },
    clues: [
      'Run env to see all environment variables. Look for anything suspicious.',
      'Use export VAULT_KEY=<value> to set the variable, then run the decoder',
      '(Spoiler) export VAULT_KEY=nullbyte_nemesis then python3 decoder.py'
    ],
    cutsceneAfter: {
      speaker: 'THE CIPHER MACHINE',
      text: 'The decoder clicks in satisfaction, its mechanisms releasing the Fragment with a satisfying chime.\n\nFive chambers conquered. The corruption retreats like shadows before dawn. The Engine Room lies ahead—industrial, vast, and full of secrets.'
    }
  },
  {
    id: 6,
    name: "The Steam Engine Room",
    story: "A massive engine roars in the darkness, its log filled with thousands of pressure readings. Somewhere in the noise, a hidden message from Nullbyte's attack waits to be discovered. Use your search skills.",
    flag: "pressure_and_pipes",
    timerMinutes: 15,
    unlockedCommands: ['ls', 'cat', 'python3', 'help', 'clear', 'echo', 'env', 'export', 'grep'],
    filesystem: {
      'README.txt': 'Welcome to the Steam Engine Room!\n\nThe engine.log contains thousands of readings.\nA hidden message is buried inside.\n\nTry using grep to search:\n  grep "RUNE" engine.log\n\nOr try other search patterns!',
      'engine.log': generateEngineLog()
    },
    env: {},
    clues: [
      'There are hundreds of log lines. Use grep to search. Try: grep "RUNE" engine.log',
      'grep searches for patterns. Try different keywords like "DETECTED" or "Fragment".',
      '(Spoiler) grep "RUNE" engine.log'
    ],
    cutsceneAfter: {
      speaker: 'THE ENGINE ITSELF',
      text: 'The engine trembles as the Fragment materializes, its powerful core resonating with ancient magic.\n\nSix chambers restored. Halfway through your journey. Two more await—but the corruption grows desperate. The final chambers will not yield easily.'
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
