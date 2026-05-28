export function createFilesystem(level) {
  return { ...level.filesystem };
}

export function getEditableFiles(levelId) {
  // Map editable files per level
  const editableByLevel = {
    3: ['spell.py'],
    7: ['orrery.py']
  };
  return editableByLevel[levelId] || [];
}

export function isEditableFile(filename, levelId) {
  return getEditableFiles(levelId).includes(filename);
}

export function listFiles(fs, showHidden = false) {
  return Object.keys(fs).filter(name => {
    if (!showHidden && name.startsWith('.')) return false;
    return true;
  }).sort();
}

export function readFile(fs, filename) {
  if (!(filename in fs)) {
    return null;
  }
  return fs[filename];
}

export function writeFile(fs, filename, content) {
  fs[filename] = content;
}
