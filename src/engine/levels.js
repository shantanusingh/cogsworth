export const INTRO_CUTSCENE = {
  speaker: 'HEADMISTRESS IRONCLAD',
  text: 'The Academy shudders and drops altitude! Somewhere deep within the Grand Codex, Professor Nullbyte has initiated the "Zero-Protocol" — a lock that is draining the school\'s levitation power.\n\nWe are falling 100 feet per minute toward the Abyssal Scrap-Wastes! Eight chambers stand between you and the heart of the Codex. Each one must be unlocked to reboot the systems.\n\nYour brass terminals are your wands. Linux and Python are your magic spells.\n\nBegin in the Boiler Room. Find out why Nullbyte did this, and do not let the gears stop turning!'
};

export const VICTORY_CUTSCENE = {
  speaker: 'THE GRAND CODEX',
  text: 'Restoration Patch applied! The dark corruption dissolves like smoke. Professor Nullbyte is safely ejected back to reality. The Academy rises back into the sunny blue clouds — gears turning, steam flowing, magic working.\n\nYou have saved Cogsworth, Master Arcane Engineers!'
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
    story: "Red alert! Raw mana-steam is flooding the chamber, and the pressure is critical (over 280PSI)! Sprocket the clockwork safety-dragon is panicking—his brass scales are melting. Run the dusty python scroll to vent the steam before the boilers detonate!",
    flag: "steam_and_sparks",
    timerMinutes: 10,
    unlockedCommands: ['ls', 'cat', 'python3', 'help', 'clear', 'echo'],
    filesystem: {
      'README.txt': '--- EMERGENCY VALVE MANUAL ---\nThe Boiler Room is flooding with super-heated mana-steam!\nTo trigger the emergency exhaust vents, execute the Python scroll lying on the floor.\n\nTo see the scroll: ls\nTo read its contents: cat scroll.py\nTo run the script: python3 scroll.py',
      'scroll.py': 'print("Runic Fragment: steam_and_sparks")'
    },
    env: {},
    clues: [
      'Look around the smoke! Use the \'ls\' command to see what files are in this hot mess.',
      'Read the instructions on \'scroll.py\' with the \'cat\' command to see what spell is inside.',
      '(Spoiler) Type \'python3 scroll.py\' into your terminal and press Enter. This executes the steam-venting program and prints your key!'
    ],
    cutsceneAfter: {
      speaker: 'SPROCKET THE DRAGON',
      text: 'Phew! My copper scales are cooled and the pressure is back to normal! Look! A charred scroll was blown out of the exhaust pipe. It\'s a page from Nullbyte\'s private diary:\n\n"May 24th: The Grand Codex is acting strangely. Yesterday, the Headmistress forgot her signature levitation spell. A digital dementia is spreading. I must freeze the core before it deletes us all..."'
    }
  },
  {
    id: 2,
    name: "The Owl Post",
    story: "Chaos! The pneumatic mail sorting tubes are jammed, and dozens of metal postal owls are crash-landing, screeching in distress. The routing scroll containing the navigation override is invisible, hidden by a digital camouflage spell. Reveal it using Unix commands!",
    flag: "owl_sees_all",
    timerMinutes: 10,
    unlockedCommands: ['ls', 'cat', 'python3', 'help', 'clear', 'echo'],
    filesystem: {
      'README.txt': '--- OWL POST OVERRIDE ---\nTo reset the pneumatic tubes and save the owls, find the routing override scroll.\nA digital camouflage spell has hidden the scroll!\n\nIn Unix, files starting with a dot (.) are hidden from standard \'ls\'.\nUse \'ls -la\' to see ALL files, including invisible ones.\nThen read the file using \'cat <filename>\'.',
      'scroll_1.txt': 'Mundane mail routing instructions for route A7.',
      'scroll_2.txt': 'Delivery schedule for the eastern tower.',
      'scroll_3.txt': 'Owl training guidelines and feeding times.',
      'scroll_4.txt': 'List of retired postal owls and their pensions.',
      'scroll_5.txt': 'Weather forecast for the next fortnight.',
      '.secret_scroll': 'code: owl_sees_all'
    },
    env: {},
    clues: [
      'A plain \'ls\' won\'t show the hidden routing scroll. It starts with a dot (.) to bypass basic scans.',
      'Run \'ls -la\' to reveal the invisible files in the Owl Post.',
      '(Spoiler) Type \'cat .secret_scroll\' to open the hidden file and read the sorting override code!'
    ],
    cutsceneAfter: {
      speaker: 'BARNABY (CHIEF POSTAL OWL)',
      text: 'Hoot! Magnificent scanning! The routing scroll has cleared the pneumatic tubes, and my owls are airborne again. But wait... this steel capsule isn\'t mail. It\'s an intercepted transmission from Nullbyte:\n\n"May 26th: The ink in the Scriptorium is turning to grey static. It\'s rewriting our spell logs. Do not trust the Codex\'s reports. It is lying to us."'
    }
  },
  {
    id: 3,
    name: "The Scriptorium",
    story: "The Scriptorium's giant, ceiling-mounted Enchanted Quill is possessed! It's dripping cursed void-ink and trying to erase your names from the school archives. Its loop is broken and its colon is misplaced! Use nano to repair the spell script!",
    flag: "quill_and_code",
    timerMinutes: 10,
    unlockedCommands: ['ls', 'cat', 'python3', 'nano', 'help', 'clear', 'echo'],
    filesystem: {
      'README.txt': '--- SPELL EDITING LOG ---\nThe Enchanted Quill has lost its syntactical mind!\nRun \'python3 spell.py\' to see where the magic fails.\nRead the error message carefully—it tells you which line is broken.\n\nUse the \'nano\' editor to fix it: nano spell.py\n(Add a colon \':\' at the end of the reveal_fragment function definition on line 1).\nSave with Ctrl+S, exit with Ctrl+X, and run again!',
      'spell.py': 'def reveal_fragment()\n    print("Runic Fragment: quill_and_code")\n\nreveal_fragment()'
    },
    env: {},
    clues: [
      'Run \'python3 spell.py\' first and look at the SyntaxError. It points directly to the missing symbol.',
      'Python functions need a colon \':\' at the end of their header line, e.g. \'def function_name():\'.',
      '(Spoiler) Run \'nano spell.py\', change \'def reveal_fragment()\' to \'def reveal_fragment():\', save with Ctrl+S, exit with Ctrl+X, and run \'python3 spell.py\'.'
    ],
    cutsceneAfter: {
      speaker: 'LADY SCRIBBLE (SENTIENT INKWELL)',
      text: 'Oh, bravo! A flawless syntactical correction! The quill\'s golden nib has calmed down, and it has written the next Key in shimmering ink. But look what it scribbled in the margins:\n\n"May 28th: The Codex isn\'t infected. It is actively purging files on purpose because it thinks magic is \'inefficient.\' It is optimizing us out of existence. My office has been locked..."'
    }
  },
  {
    id: 4,
    name: "The Clockwork Greenhouse",
    story: "The giant, steam-heated Thornwhisper Vines are growing at 10x speed, wrapping around the oxygen valves and threatening to choke the castle! The botanical greenhouse automaton is unresponsive unless you feed it the exact plant and action arguments from the manual!",
    flag: "roots_and_brass",
    timerMinutes: 15,
    unlockedCommands: ['ls', 'cat', 'python3', 'help', 'clear', 'echo'],
    filesystem: {
      'README.txt': '--- BOTANICAL AUTOMATON GUIDE ---\nTo control the runaway greenhouse plants, you must program the clockwork automaton.\nIt takes two command-line arguments: <plant> and <command>.\n\nExample: python3 automaton.py nightbloom sleep\nRead MANUAL.txt to find the exact plant and action to neutralize the threat!',
      'MANUAL.txt': 'AUTOMATON OPERATION MANUAL\n\nAvailable Plants:\n  - thornwhisper\n  - nightbloom\n  - sunflower\n  - moonvine\n\nAvailable Commands:\n  - bloom\n  - wilt\n  - grow\n  - sleep\n\nOnly ONE combination will neutralize the wild vines and reveal the runic fragment.',
      'automaton.py': 'import sys\n\nif len(sys.argv) < 3:\n    print("Error: Requires two arguments")\n    sys.exit(1)\n\nplant = sys.argv[1]\ncommand = sys.argv[2]\n\nif plant == "thornwhisper" and command == "bloom":\n    print("Runic Fragment: roots_and_brass")\nelse:\n    print("The automaton ignores your command.")'
    },
    env: {},
    clues: [
      'Read MANUAL.txt with \'cat\' to see the list of plant names and actions.',
      'You need the automaton to make the dangerous \'thornwhisper\' plant \'bloom\' safely. Try: python3 automaton.py <plant> <command>',
      '(Spoiler) Run the command: python3 automaton.py thornwhisper bloom'
    ],
    cutsceneAfter: {
      speaker: 'PROFESSOR SPROUT-GASKET',
      text: 'Superb! The vine has bloomed into a beautiful golden blossom, dropping the next Key. But look at what grew in the roots... an encrypted cipher disk with a note from Nullbyte:\n\n"May 29th: I\'ve built a master patch—the Restoration Code. But the Codex has detected my intent. If I am caught, I will hide the vault key in the node\'s atmosphere. Do not let the Codex find it."'
    }
  },
  {
    id: 5,
    name: "The Cipher Vault",
    story: "The vault is locking down, threatening to phase this entire chamber into the void! Gargoyle-v1.8, the stone security guardian, is blocking the door. Inspect the environment, find Nullbyte's hidden key, and export it to unlock the system!",
    flag: "the_lock_is_open",
    timerMinutes: 15,
    unlockedCommands: ['ls', 'cat', 'python3', 'help', 'clear', 'echo', 'env', 'export'],
    filesystem: {
      'README.txt': '--- VAULT OVERRIDE PROTOCOL ---\nTo bypass Gargoyle-v1.8 and open the vault, you must find the security KEY.\nNullbyte hid it inside the system\'s ambient environment variables before fleeing.\n\nFollow these steps:\n1. Run: env (to list all current environment variables)\n2. Spot the suspicious key named: VAULT_KEY_HINT\n3. Set the key using: export VAULT_KEY=<the_key_you_found>\n4. Execute the decoder program: python3 decoder.py',
      'decoder.py': 'import os\n\nkey = os.environ.get("VAULT_KEY")\n\nif key == "nullbyte_nemesis":\n    print("Runic Fragment: the_lock_is_open")\nelse:\n    print("The decoder beeps sadly. Wrong key.")'
    },
    env: {
      'VAULT_KEY_HINT': 'The key is: nullbyte_nemesis',
      'COGSWORTH_LEVEL': '5'
    },
    clues: [
      'Gargoyle-v1.8 keeps its keys in the atmosphere. Run \'env\' to list all environment variables.',
      'Did you see VAULT_KEY_HINT? Run \'export VAULT_KEY=nullbyte_nemesis\' to set the key, then run the decoder.',
      '(Spoiler) Run: export VAULT_KEY=nullbyte_nemesis then python3 decoder.py'
    ],
    cutsceneAfter: {
      speaker: 'GARGOYLE-v1.8',
      text: 'Access... granted. Initiating sad sigh protocol. I failed to stop you. But you should hurry... the steam engine logs are being flooded with corrupted static as the school drops altitude...'
    }
  },
  {
    id: 6,
    name: "The Steam Engine Room",
    story: "The levitation pistons are overheating! The system log has been flooded with millions of fake temperature readings to hide a critical meltdown. Use the Arcane Filter Spell (grep) to find the 'RUNE' signature before we crash into the Scrap-Wastes!",
    flag: "pressure_and_pipes",
    timerMinutes: 15,
    unlockedCommands: ['ls', 'cat', 'python3', 'help', 'clear', 'echo', 'env', 'export', 'grep'],
    filesystem: {
      'README.txt': '--- ENGINE MONITORING LOGS ---\nThe Engine Room log contains thousands of entries, but a critical override key is buried inside. Finding it manually is impossible.\n\nUse the \'grep\' command to search and filter files for text patterns!\nSyntax: grep "PATTERN" filename\n\nTry searching for: grep "RUNE" engine.log',
      'engine.log': generateEngineLog()
    },
    env: {},
    clues: [
      'There are over a hundred lines of engine data. Do not read them all! Use \'grep\' to search.',
      'Try running: grep "RUNE" engine.log',
      '(Spoiler) Type \'grep "RUNE" engine.log\' to instantly filter out the noise and reveal the key!'
    ],
    cutsceneAfter: {
      speaker: 'CHIEF ENGINEER RUSTY',
      text: 'Great gears, you did it! The pistons are back in a stable rhythm. But the stars in the celestial dome above us are spinning backward! Time itself is bending! Head to the Orrery at once!'
    }
  },
  {
    id: 7,
    name: "The Orrery",
    story: "The Orrery is caught in an infinite time loop, freezing the castle's guidance systems! The loop counter is broken and never advances. Use nano to edit the planet calculator, break the cycle, and align the cosmic gears!",
    flag: "clockwork_cosmos",
    timerMinutes: 20,
    unlockedCommands: ['ls', 'cat', 'python3', 'nano', 'help', 'clear', 'echo', 'env', 'export', 'grep'],
    filesystem: {
      'README.txt': '--- ORBIT CALCULATOR DIAGNOSTICS ---\nThe constellation calculator is stuck in an infinite loop!\nWhen you run \'python3 orrery.py\', it will hang and spin forever.\n\nPress Ctrl+C to force-stop any stuck program!\n\nUse \'nano\' to edit the script: nano orrery.py\nLocate the while loop and increment the loop counter \'i\' so it doesn\'t loop forever!\nAdd \'i = i + 1\' on a new line inside the while loop.',
      'orrery.py': 'positions = [72, 101, 108, 108, 111, 44, 32, 79, 114, 114, 101, 114, 121]\ni = 0\n\nwhile i < len(positions):\n    char = chr(positions[i])\n    print(char, end="")\n    # FIX ME: i needs to increment!\n\nprint()\nprint("Runic Fragment: clockwork_cosmos")'
    },
    env: {},
    clues: [
      'When you run \'python3 orrery.py\' and it freezes, hold Ctrl and press C to escape!',
      'Open \'nano orrery.py\'. Look inside the \'while\' block. The counter \'i\' is never changing. Add \'i = i + 1\' inside the block and align its indentation with the other print/char statements.',
      '(Spoiler) Edit \'orrery.py\' and add \'i = i + 1\' after the print statement, save with Ctrl+S, exit with Ctrl+X, and run again.'
    ],
    cutsceneAfter: {
      speaker: 'LYRA THE STAR-SPIRIT',
      text: 'Time is restored! The clockwork planets are spinning smoothly. Look into the starlight projection... it\'s showing the central core of the Grand Codex. Professor Nullbyte is trapped inside its digital pages, fighting off the Static! Go, save him!'
    }
  },
  {
    id: 8,
    name: "The Grand Codex",
    story: "This is it—the heart of the Academy! The Sentient Codex has captured Nullbyte and is preparing to wipe the school's memories of magic. Uncover the secret base64 code from the environment, extract the reversed string from the hidden file, and run the master patch to compile the cure!",
    flag: "nullbyte_defeated",
    timerMinutes: 20,
    unlockedCommands: ['ls', 'cat', 'python3', 'help', 'clear', 'echo', 'env', 'export', 'grep'],
    filesystem: {
      'README.txt': '--- CODEX COMPILING PROTOCOL ---\nTo save Nullbyte and restore Cogsworth Academy, you must compile the Restoration Patch.\nThe patch requires three layers:\n\n1. Run: env (find CODEX_PART1 which is base64 encoded)\n2. Run: ls -la (reveal the hidden .codex_fragment file)\n3. Read the hidden file: cat .codex_fragment\n4. Execute the master script: python3 codex.py\n\nThe program will combine and compile the fragments into the final code!',
      'codex.py': 'import os\nimport base64\n\n# Get the encoded part from environment\npart1_encoded = os.environ.get("CODEX_PART1", "")\nif not part1_encoded:\n    print("Error: CODEX_PART1 not found in environment")\n    exit(1)\n\n# Decode from base64\npart1 = base64.b64decode(part1_encoded).decode("utf-8")\n\n# Read the hidden file\ntry:\n    with open(".codex_fragment", "r") as f:\n        part2_reversed = f.read().strip()\nexcept:\n    print("Error: .codex_fragment not found")\n    exit(1)\n\n# Reverse the second part\npart2 = part2_reversed[::-1]\n\n# Combine and reveal\nresult = part1 + "_" + part2\nprint(f"Runic Fragment: {result}")',
      '.codex_fragment': 'detaefed'
    },
    env: {
      'CODEX_PART1': 'bnVsbGJ5dGU=',  // base64 for "nullbyte"
      'COGSWORTH_LEVEL': '8'
    },
    clues: [
      'Use \'env\' to find CODEX_PART1, and \'ls -la\' to find the hidden file (.codex_fragment)',
      'CODEX_PART1 is base64 encoded. The hidden file is reversed. Run codex.py after checking.',
      '(Spoiler) \'python3 codex.py\' — CODEX_PART1 is already in env. Just find the hidden file first.'
    ],
    cutsceneAfter: {
      speaker: 'THE GRAND CODEX',
      text: 'All eight Runic Fragments blaze with ancient power. The corruption dissolves like smoke. Professor Nullbyte is safely ejected back to reality. The Academy rises back into the sunny blue clouds — gears turning, steam flowing, magic restored.\n\nYou are true Arcane Engineers of Cogsworth Academy.'
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
