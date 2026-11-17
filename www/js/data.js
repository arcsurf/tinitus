/* Tinitus · Language-independent data. All user-facing text lives in js/i18n/<lang>.js */
window.I18N = {};
window.LANGS = [['en', 'English'], ['es', 'Español'], ['de', 'Deutsch'], ['fr', 'Français'], ['ja', '日本語']];
window.DEFAULT_LANG = 'en';

// Bump to require users to accept the Terms of Use again
window.LEGAL_VERSION = '1.0';
window.LEGAL_DATE = '2026-11-17';

window.MODE_META = {
  notched:    { icon: '🎯', needsFreq: true },
  pink:       { icon: '🌸' },
  white:      { icon: '⚪' },
  brown:      { icon: '🟤' },
  highfreq:   { icon: '📶' },
  narrowband: { icon: '🔦', needsFreq: true },
  ocean:      { icon: '🌊' },
  rain:       { icon: '🌧️' }
};

window.PROFILE_META = [
  { id: 'tonal',       icon: '🎵', color: '#7c9cff', mode: 'notched',  minutes: 60, needsFreq: true },
  { id: 'hiss',        icon: '🌫️', color: '#5ec8c0', mode: 'pink',     minutes: 60 },
  { id: 'low',         icon: '🌀', color: '#b48cff', mode: 'brown',    minutes: 45 },
  { id: 'pulsatile',   icon: '💓', color: '#ff7a8a', mode: 'rain',     minutes: 30 },
  { id: 'somatic',     icon: '🦴', color: '#ffb35c', mode: 'pink',     minutes: 30, links: ['exercises'] },
  { id: 'hyperacusis', icon: '🔊', color: '#ffd166', mode: 'pink',     minutes: 60, program: true },
  { id: 'hearingloss', icon: '👂', color: '#6fd08c', mode: 'highfreq', minutes: 60 },
  { id: 'stress',      icon: '🌙', color: '#8fb3ff', mode: 'rain',     minutes: 45, links: ['relax'] }
];
window.PROFILE_META.find(p => p.id === 'pulsatile').links = ['relax'];

// Classification test: score contributions per answer (same order as the text in each language file)
window.TEST_META = [
  { id: 'sound',   scores: [{ tonal: 3 }, { hiss: 3 }, { low: 3 }, { pulsatile: 5 }, { somatic: 2 }] },
  { id: 'soma',    scores: [{ somatic: 4 }, { somatic: 2 }, {}] },
  { id: 'hyper',   scores: [{ hyperacusis: 4 }, { hyperacusis: 2 }, {}] },
  { id: 'noise',   scores: [{ hearingloss: 4 }, { hearingloss: 2 }, {}] },
  { id: 'vertigo', scores: [{ low: 4 }, { low: 2 }, {}] },
  { id: 'mood',    scores: [{ stress: 3 }, { stress: 1 }, {}] }
];

window.BREATH_META = {
  '478':    [['in', 4], ['hold', 7], ['out', 8]],
  box:      [['in', 4], ['hold', 4], ['out', 4], ['hold', 4]],
  coherent: [['in', 5], ['out', 5]]
};
