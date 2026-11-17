/* Tinitus · UI logic (hash-routed SPA, data stored on the device, multi-language). */
(function () {
  'use strict';
  const engine = new window.AudioEngine();
  const KEY = 'tinitus-v1';
  const DEF = {
    lang: window.DEFAULT_LANG, accepted: false, legalVersion: null, acceptedAt: null,
    profileId: null, secondaryId: null, freq: null, ear: 'both',
    volume: 0.35, notch: true, timer: 30, lastMode: null, startDate: null,
    sessions: [], diary: [], ri: null, redflags: []
  };

  // ---------- State ----------
  let S = load();
  function load() {
    try { return Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch (e) { return Object.assign({}, DEF); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  // ---------- i18n ----------
  let L, P, MODES;
  function setLang(lang) {
    if (!window.I18N[lang]) lang = window.DEFAULT_LANG;
    S.lang = lang; L = window.I18N[lang];
    P = window.PROFILE_META.map(m => Object.assign({}, m, L.profiles[m.id]));
    MODES = {};
    Object.entries(window.MODE_META).forEach(([k, m]) => MODES[k] = Object.assign({}, m, L.modes[k]));
    document.documentElement.lang = lang;
    document.title = L.ui.title;
    document.querySelectorAll('[data-t]').forEach(el => el.textContent = t(el.dataset.t));
    const sel = document.getElementById('langSel'); if (sel) sel.value = lang;
  }
  function t(key, vars) {
    let s = L.ui[key] ?? window.I18N.en.ui[key] ?? key;
    if (vars && typeof s === 'string') Object.entries(vars).forEach(([k, v]) => s = s.split('{' + k + '}').join(v));
    return s;
  }

  // ---------- Utils ----------
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const dateStr = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => dateStr(new Date());
  const fmtDate = (s, short) => {
    const [y, m, d] = s.split('-').map(Number);
    const opts = short ? { day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(y, m - 1, d).toLocaleDateString(L.locale, opts);
  };
  const fmtHz = f => f >= 1000 ? (f / 1000).toFixed(f >= 10000 ? 1 : 2).replace(/\.?0+$/, '') + ' kHz' : Math.round(f) + ' Hz';
  const prof = id => P.find(p => p.id === id);
  const panOf = ear => ear === 'left' ? -1 : ear === 'right' ? 1 : 0;
  const daysSince = s => s ? Math.floor((Date.now() - new Date(s + 'T00:00:00').getTime()) / 86400000) : 0;
  const list = (arr, tag = 'ul') => `<${tag} class="list">${arr.map(x => `<li>${x}</li>`).join('')}</${tag}>`;
  const earSeg = () => `<div class="seg">${['left', 'both', 'right'].map(k =>
    `<button class="${S.ear === k ? 'sel' : ''}" data-action="ear" data-ear="${k}">${t(k)}</button>`).join('')}</div>`;
  function toast(msg) {
    const el = $('#toast'); el.textContent = msg; el.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(() => el.hidden = true, 2600);
  }
  function weekMinutes() {
    const lim = new Date(); lim.setDate(lim.getDate() - 6);
    const from = dateStr(lim);
    return S.sessions.filter(s => s.date >= from).reduce((a, s) => a + s.min, 0);
  }
  function programVolume() {
    const w = Math.floor(daysSince(S.startDate) / 7);
    return { week: w + 1, vol: Math.min(0.12 + 0.04 * w, 0.5) };
  }

  // ---------- Player ----------
  const player = { startedAt: 0, int: null, endAt: 0 };

  function startTherapy(mode) {
    if (MODES[mode]?.needsFreq && !S.freq) { toast(t('need_tune')); location.hash = '#tone'; return; }
    engine.volume = S.volume; engine.setPan(panOf(S.ear)); engine.freq = S.freq || 4000;
    engine.start(mode, { notch: S.notch && !!S.freq });
    S.lastMode = mode; save();
    player.startedAt = Date.now();
    player.endAt = S.timer ? Date.now() + S.timer * 60000 : 0;
    clearInterval(player.int);
    player.int = setInterval(tick, 1000);
    tick(); updateMini();
  }

  function stopTherapy(fade = 1) {
    if (!engine.playing || engine.mode === 'tone') { engine.stop(0.2); return; }
    engine.stop(fade);
    clearInterval(player.int); player.int = null;
    const min = Math.round((Date.now() - player.startedAt) / 60000);
    if (min >= 1) { S.sessions.push({ date: today(), min, mode: engine.mode }); save(); }
    updateMini();
    if (['therapy', 'home'].includes(currentRoute())) render();
  }

  function tick() {
    if (!engine.playing || !player.int) return;
    const el = Date.now() - player.startedAt;
    let txt = `${Math.floor(el / 60000)}:${pad(Math.floor(el / 1000) % 60)}`;
    if (player.endAt) {
      const r = player.endAt - Date.now();
      if (r <= 0) { stopTherapy(10); toast(t('session_done')); return; }
      txt += t('remaining', { m: Math.ceil(r / 60000) });
    }
    const e = $('#elapsed'); if (e) e.textContent = txt;
    const m = $('#miniTime'); if (m) m.textContent = txt;
  }

  function updateMini() {
    const mp = $('#miniplayer');
    const show = engine.playing && engine.mode !== 'tone' && currentRoute() !== 'therapy';
    mp.hidden = !show;
    if (show) $('#miniName').textContent = `${MODES[engine.mode]?.icon || '🎧'} ${MODES[engine.mode]?.n || ''}`;
  }

  // ---------- Views ----------
  const views = {};

  const langPicker = () => `<label class="lang-pick">🌐 <select data-input="lang" aria-label="${t('language')}">
    ${window.LANGS.map(([k, n]) => `<option value="${k}" ${S.lang === k ? 'selected' : ''}>${n}</option>`).join('')}</select></label>`;

  views.welcome = () => `
    <section class="card hero">
      <div class="row between"><img src="icons/icon.svg" class="hero-icon" alt="">${langPicker()}</div>
      <h1>${t('welcome_title')}</h1>
      <p class="lead">${t('welcome_lead')}</p>
    </section>
    <section class="card"><h2>${t('before_title')}</h2>${list(t('before_items'))}</section>
    <section class="card">
      <h2>${t('terms_title')}</h2>
      <p class="muted small">${t('terms_read')}</p>
      <div class="legal-box" tabindex="0">${L.legal}${legalFooter()}</div>
      <label class="opt accept-row"><input type="checkbox" id="legalChk" data-input="legalChk"><span>${t('accept_terms')}</span></label>
      <label class="opt accept-row"><input type="checkbox" id="ageChk" data-input="legalChk"><span>${t('accept_age')}</span></label>
      <button class="btn primary block" data-action="accept" id="acceptBtn" disabled>${t('accept_btn')}</button>
    </section>`;

  const legalFooter = () => `<p class="muted small">v${window.LEGAL_VERSION} · ${fmtDate(window.LEGAL_DATE)}</p>`;

  views.terms = () => `
    <section class="card"><h1>${t('terms_full_title')}</h1>
      ${S.accepted ? `<p class="muted small">${t('terms_accepted_on', { date: esc(S.acceptedAt ? new Date(S.acceptedAt).toLocaleString(L.locale) : '—'), v: esc(S.legalVersion || '—') })}</p>` : ''}
      <div class="legal-full">${L.legal}${legalFooter()}</div>
      <a class="btn block" href="#settings">${t('back')}</a></section>`;

  views.home = () => {
    const p = prof(S.profileId);
    const todayDone = S.diary.some(d => d.date === today());
    const mode = p ? p.mode : 'pink';
    return `
    <section class="card hero"><h1>${t('hello')}</h1><p class="lead">${p ? t('plan_ready') : t('start_discover')}</p></section>
    ${p ? `
    <section class="card profile-card" style="--pc:${p.color}">
      <div class="row"><span class="big-icon">${p.icon}</span><div><small class="muted">${t('your_profile')}</small><h2>${p.name}</h2></div></div>
      <p>${p.summary}</p>
      ${p.alert ? `<div class="alert">⚠️ ${p.alert}</div>` : ''}
      <div class="row wrap gap">
        <button class="btn primary" data-action="play" data-mode="${mode}">▶ ${MODES[mode].n} · ${p.minutes} min</button>
        <a class="btn" href="#profile/${p.id}">${t('see_plan')}</a>
      </div>
      ${p.needsFreq && !S.freq ? `<div class="alert info">${t('tune_for_notch')} <a href="#tone">${t('tune_now')}</a></div>` : ''}
    </section>` : `
    <section class="card">
      <h2>${t('which_type')}</h2>
      <p>${t('which_type_desc', { n: P.length })}</p>
      <a class="btn primary block" href="#test">${t('take_test')}</a>
      <a class="btn ghost block" href="#profiles">${t('choose_manual')}</a>
    </section>`}
    <section class="grid2">
      <a class="card stat" href="#diary"><small class="muted">${t('today_log')}</small><b>${todayDone ? t('done') : t('pending')}</b></a>
      <a class="card stat" href="#diary"><small class="muted">${t('therapy_week')}</small><b>${weekMinutes()} min</b></a>
      <a class="card stat" href="#tone"><small class="muted">${t('your_freq')}</small><b>${S.freq ? fmtHz(S.freq) : '—'}</b></a>
      <a class="card stat" href="#relax"><small class="muted">${t('nav_relax_long')}</small><b>${t('relax_breathe')}</b></a>
    </section>
    ${p ? `<section class="card"><h3>${t('tip')}</h3><p>${p.tips[new Date().getDate() % p.tips.length]}</p></section>` : ''}`;
  };

  views.test = () => `
    <section class="card"><h1>${t('test_title')}</h1><p class="muted">${t('test_desc')}</p></section>
    <form id="testForm">
      ${window.TEST_META.map((q, qi) => `
        <fieldset class="card"><legend>${qi + 1}. ${L.test[qi].q}</legend>
        ${L.test[qi].o.map((o, oi) => `<label class="opt"><input type="radio" name="${q.id}" value="${oi}" required> <span>${o}</span></label>`).join('')}
        </fieldset>`).join('')}
      <fieldset class="card"><legend>${window.TEST_META.length + 1}. ${t('redflags_q')}</legend>
        ${L.redflags.map((f, i) => `<label class="opt"><input type="checkbox" name="rf" value="${i}"> <span>${f}</span></label>`).join('')}
      </fieldset>
      <button class="btn primary block" type="submit">${t('see_profile')}</button>
    </form>`;

  views.result = () => {
    const r = S._lastResult; if (!r) return views.test();
    const p1 = prof(r.top[0]), p2 = r.top[1] ? prof(r.top[1]) : null;
    return `
    ${r.flags.length ? `<section class="card alert danger"><h2>${t('see_doctor')}</h2>
      <p>${t('flags_marked')}</p>${list(r.flags.map(i => L.redflags[i]))}<p>${t('flags_advice')}</p></section>` : ''}
    <section class="card profile-card" style="--pc:${p1.color}">
      <small class="muted">${t('main_profile')}</small>
      <div class="row"><span class="big-icon">${p1.icon}</span><h2>${p1.name}</h2></div>
      <p>${p1.summary}</p>
      <a class="btn ghost" href="#profile/${p1.id}">${t('see_detail')}</a>
    </section>
    ${p2 ? `<section class="card"><small class="muted">${t('also_fits')}</small>
      <div class="row"><span class="big-icon">${p2.icon}</span><h3>${p2.name}</h3></div>
      <p class="muted">${t('combine')}</p><a class="btn ghost" href="#profile/${p2.id}">${t('see_detail')}</a></section>` : ''}
    <button class="btn primary block" data-action="useProfile" data-id="${p1.id}" data-sec="${p2 ? p2.id : ''}">${t('start_profile')}</button>`;
  };

  views.profiles = () => `
    <section class="card"><h1>${t('profiles_title')}</h1><p class="muted">${t('profiles_desc')}</p></section>
    <div class="profiles">
    ${P.map(p => `<a class="card profile-card mini ${S.profileId === p.id ? 'active' : ''}" style="--pc:${p.color}" href="#profile/${p.id}">
      <span class="big-icon">${p.icon}</span><div><h3>${p.name}${S.profileId === p.id ? ` <span class="tag">${t('your_profile')}</span>` : ''}</h3><p class="muted">${p.summary}</p></div></a>`).join('')}
    </div>`;

  views.profile = id => {
    const p = prof(id); if (!p) return views.profiles();
    const m = MODES[p.mode];
    const mine = S.profileId === p.id;
    let prog = '';
    if (p.program) { const pv = programVolume(); prog = `<div class="alert info">${t('progressive', { w: mine ? pv.week : 1, v: Math.round((mine ? pv.vol : 0.12) * 100) })}</div>`; }
    const links = p.links || [];
    return `
    <section class="card profile-card" style="--pc:${p.color}">
      <div class="row"><span class="big-icon">${p.icon}</span><h1>${p.name}</h1></div>
      <p class="lead">${p.summary}</p>
      ${p.alert ? `<div class="alert">⚠️ ${p.alert}</div>` : ''}
    </section>
    <section class="card"><h2>${t('how_recognize')}</h2>${list(p.symptoms)}</section>
    <section class="card"><h2>${t('approach')}</h2><p>${p.approach}</p>
      <div class="therapy-pill">${m.icon} <b>${m.n}</b> · ${t('per_session', { m: p.minutes })}</div>
      <p class="muted"><b>${t('volume_lbl')}</b> ${p.volume}</p>${prog}</section>
    <section class="card"><h2>${t('your_plan')}</h2>${list(p.plan, 'ol')}</section>
    <section class="card"><h2>${t('tips')}</h2>${list(p.tips)}</section>
    <div class="row wrap gap">
      ${!mine ? `<button class="btn primary" data-action="useProfile" data-id="${p.id}">${t('use_profile')}</button>` : ''}
      <button class="btn ${mine ? 'primary' : ''}" data-action="play" data-mode="${p.mode}" data-go="1">${t('start_therapy')}</button>
      ${links.includes('exercises') ? `<a class="btn" href="#exercises">${t('see_exercises')}</a>` : ''}
      ${links.includes('relax') ? `<a class="btn" href="#relax">${t('nav_relax_long')}</a>` : ''}
      ${p.needsFreq ? `<a class="btn" href="#tone">${t('tune_pitch')}</a>` : ''}
    </div>`;
  };

  views.therapy = () => {
    const p = prof(S.profileId);
    const rec = p ? p.mode : 'pink';
    const on = engine.playing && engine.mode !== 'tone';
    const cur = on ? engine.mode : (S.lastMode || rec);
    const pv = p && p.program ? programVolume() : null;
    return `
    <section class="card player">
      <h1>${t('therapy_title')}</h1>
      <div class="modes">
        ${Object.entries(MODES).map(([k, m]) => `<button class="mode ${cur === k ? 'sel' : ''}" data-action="pickMode" data-mode="${k}">
          <span class="mi">${m.icon}</span><span>${m.n}</span>${k === rec ? `<span class="tag">${t('recommended')}</span>` : ''}</button>`).join('')}
      </div>
      <p class="muted center">${MODES[cur].d}</p>
      <button class="playbtn ${on ? 'on' : ''}" data-action="toggle" data-mode="${cur}" aria-label="${t('play_aria')}">${on ? '■' : '▶'}</button>
      <div class="center" id="elapsed">${on ? '' : t('press_start')}</div>
    </section>
    <section class="card">
      <label class="field"><span>🔈 ${t('volume')} <b id="volLbl">${Math.round(S.volume * 100)} %</b></span>
        <input type="range" min="0" max="1" step="0.01" value="${S.volume}" data-input="volume"></label>
      ${pv ? `<div class="alert info">${t('prog_hyper', { w: pv.week, v: Math.round(pv.vol * 100) })}
        <button class="btn small" data-action="progVol">${t('apply')}</button></div>` : ''}
      <p class="muted small">${t('mixing_rule')}</p>
      <div class="field"><span>👂 ${t('ear')}</span>${earSeg()}</div>
      <div class="field"><span>⏱️ ${t('timer')}</span>
        <div class="seg">${[15, 30, 45, 60, 90, 0].map(k =>
          `<button class="${S.timer === k ? 'sel' : ''}" data-action="timer" data-t="${k}">${k ? k + "'" : '∞'}</button>`).join('')}</div></div>
      <label class="opt switch"><input type="checkbox" data-input="notch" ${S.notch ? 'checked' : ''} ${S.freq ? '' : 'disabled'}>
        <span>${t('notch_apply')} ${S.freq ? `(${fmtHz(S.freq)})` : `— <a href="#tone">${t('notch_need')}</a>`}</span></label>
    </section>
    <p class="muted small center">${t('therapy_hint')}</p>`;
  };

  views.tone = () => {
    const f = tmpFreq || S.freq || 4000;
    const v = Math.round(1000 * Math.log(f / 125) / Math.log(14000 / 125));
    const toneOn = engine.playing && engine.mode === 'tone';
    return `
    <section class="card">
      <h1>${t('tone_title')}</h1>
      <p class="muted">${t('tone_desc')}</p>
      <div class="freq-display" id="freqLbl">${fmtHz(f)}</div>
      <input type="range" min="0" max="1000" step="1" value="${v}" data-input="freq" class="freq-slider" aria-label="${t('freq_aria')}">
      <div class="row wrap gap center-row">
        <button class="btn" data-action="fstep" data-k="-1">${t('semitone_down')}</button>
        <button class="btn primary" data-action="toneToggle" id="toneBtn">${toneOn ? t('stop') : t('listen')}</button>
        <button class="btn" data-action="fstep" data-k="1">${t('semitone_up')}</button>
      </div>
      <label class="field"><span>🔈 ${t('tone_volume')}</span>
        <input type="range" min="0" max="1" step="0.01" value="${S.volume}" data-input="volume"></label>
      <div class="field"><span>👂 ${t('ear')}</span>${earSeg()}</div>
    </section>
    <section class="card">
      <h2>${t('octave_title')}</h2>
      <p class="muted">${t('octave_desc')}</p>
      <div class="row wrap gap center-row">
        ${[[0.5, 'lower'], [1, 'current'], [2, 'higher']].map(([m, k]) =>
          `<button class="btn" data-action="octave" data-m="${m}">${t(k)}<br><small>${fmtHz(Math.min(14000, Math.max(125, f * m)))}</small></button>`).join('')}
      </div>
    </section>
    <button class="btn primary block" data-action="saveFreq">${t('save_freq')}</button>
    ${S.freq ? `<section class="card">
      <h2>${t('ri_title')}</h2>
      <p class="muted">${t('ri_desc', { f: fmtHz(S.freq) })}</p>
      <div id="riBox">${S.ri ? `<p>${t('ri_last', { d: fmtDate(S.ri.date) })} <b>${t('ri_opts')[S.ri.result] ?? ''}</b></p>` : ''}
      <button class="btn block" data-action="riStart">${t('ri_start')}</button></div>
    </section>` : ''}`;
  };

  views.relax = () => `
    <section class="card center">
      <h1>${t('breath_title')}</h1>
      <div class="seg">${Object.keys(window.BREATH_META).map(k => `<button data-action="breath" data-k="${k}" class="${breath.k === k ? 'sel' : ''}">${L.breath.names[k]}</button>`).join('')}</div>
      <div class="breath-wrap"><div class="breath" id="breathCircle"><span id="breathLbl">${t('breath_choose')}</span></div></div>
      <div class="row gap center-row wrap"><button class="btn" data-action="breathStop">${t('stop')}</button>
      <button class="btn" data-action="play" data-mode="ocean">${t('add_waves')}</button></div>
    </section>
    <section class="card"><h2>${t('pmr_title')}</h2><p class="muted">${t('pmr_desc')}</p>${list(L.pmr, 'ol')}</section>
    <section class="card"><h2>${t('cbt_title')}</h2><p class="muted">${t('cbt_desc')}</p>
      <div class="cbt">${L.cbt.map(c => `<details class="cbt-card"><summary>${c.p}</summary><p>➜ ${c.r}</p></details>`).join('')}</div></section>
    <section class="card"><h2>${t('mind_title')}</h2><p>${t('mind_text')}</p></section>`;

  views.exercises = () => `
    <section class="card"><h1>${t('ex_title')}</h1><p class="muted">${t('ex_desc')}</p></section>
    ${L.somatic.map((e, i) => `<section class="card exercise">
      <div class="row between"><h3>${i + 1}. ${e.t}</h3><span class="tag">${e.z}</span></div>
      ${list(e.s, 'ol')}<p class="muted small">🔁 ${e.r}</p></section>`).join('')}`;

  views.diary = () => {
    const d = S.diary.find(x => x.date === today()) || {};
    const sliders = [['loud', d.loud], ['annoy', d.annoy], ['sleep', d.sleep], ['stress', d.stress]];
    return `
    <section class="card"><h1>${t('diary_title')}</h1><p class="muted">${t('diary_desc')}</p>
      <form id="diaryForm">
        ${sliders.map(([k, v = 5]) => `<label class="field"><span>${t('d_' + k)} <b id="lbl_${k}">${v}</b></span>
          <input type="range" min="0" max="10" step="1" name="${k}" value="${v}" data-input="diaryLbl"></label>`).join('')}
        <label class="field"><span>${t('d_notes')}</span><textarea name="notes" rows="2">${esc(d.notes || '')}</textarea></label>
        <button class="btn primary block" type="submit">${d.date ? t('d_update') : t('d_save')}</button>
      </form></section>
    <section class="card"><h2>${t('evolution')}</h2>${chart()}</section>
    ${stats()}
    <section class="card"><h2>${t('history')}</h2>
      ${S.diary.length ? `<div class="hist">${[...S.diary].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 60).map(x => `
        <div class="hist-row"><b>${fmtDate(x.date)}</b><span>🔊 ${x.loud} · 😣 ${x.annoy} · 😴 ${x.sleep} · ⚡ ${x.stress}</span>
        ${x.notes ? `<small class="muted">${esc(x.notes)}</small>` : ''}<button class="link" data-action="delDiary" data-date="${x.date}">${t('delete')}</button></div>`).join('')}</div>`
        : `<p class="muted">${t('no_entries')}</p>`}</section>`;
  };

  function stats() {
    const sorted = [...S.diary].sort((a, b) => a.date.localeCompare(b.date));
    const avg = arr => arr.length ? arr.reduce((a, x) => a + x.annoy, 0) / arr.length : null;
    const a1 = avg(sorted.slice(-7)), a0 = avg(sorted.slice(-14, -7));
    const total = S.sessions.reduce((a, s) => a + s.min, 0);
    let trend = '—';
    if (a1 !== null && a0 !== null) {
      const diff = a1 - a0;
      trend = diff < -0.3 ? t('less', { n: Math.abs(diff).toFixed(1) }) : diff > 0.3 ? t('more', { n: diff.toFixed(1) }) : t('stable');
    }
    return `<section class="grid2">
      <div class="card stat"><small class="muted">${t('avg_annoy')}</small><b>${a1 !== null ? a1.toFixed(1) : '—'}</b></div>
      <div class="card stat"><small class="muted">${t('vs_prev')}</small><b>${trend}</b></div>
      <div class="card stat"><small class="muted">${t('therapy_7')}</small><b>${weekMinutes()} min</b></div>
      <div class="card stat"><small class="muted">${t('therapy_total')}</small><b>${Math.round(total / 6) / 10} h</b></div></section>`;
  }

  function chart() {
    const data = [...S.diary].sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
    if (data.length < 2) return `<p class="muted">${t('need2')}</p>`;
    const W = 600, H = 200, pl = 28, pr = 10, pt = 10, pb = 24;
    const x = i => pl + i * (W - pl - pr) / (data.length - 1);
    const y = v => pt + (10 - v) * (H - pt - pb) / 10;
    const line = k => data.map((d, i) => `${x(i).toFixed(1)},${y(d[k]).toFixed(1)}`).join(' ');
    const grid = [0, 5, 10].map(v => `<line x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}" class="gridl"/><text x="4" y="${y(v) + 4}" class="axis">${v}</text>`).join('');
    const lbls = [0, data.length - 1].map(i => `<text x="${x(i)}" y="${H - 6}" class="axis" text-anchor="${i ? 'end' : 'start'}">${fmtDate(data[i].date, true)}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="${t('evolution')}">${grid}${lbls}
      <polyline points="${line('loud')}" class="l1"/><polyline points="${line('annoy')}" class="l2"/><polyline points="${line('sleep')}" class="l3"/></svg>
      <div class="legend"><span class="k1">● ${t('lg_loud')}</span><span class="k2">● ${t('lg_annoy')}</span><span class="k3">● ${t('lg_sleep')}</span></div>`;
  }

  views.more = () => `
    <section class="card"><h1>${t('more_title')}</h1>
      <nav class="menu">
        <a href="#profiles">${t('m_profiles')}</a>
        <a href="#test">${t('m_test')}</a>
        <a href="#tone">${t('m_tone')}</a>
        <a href="#exercises">${t('m_ex')}</a>
        <a href="#settings">${t('m_settings')}</a>
        <a href="#info">${t('m_info')}</a>
        <a href="#terms">${t('m_terms')}</a>
      </nav></section>`;

  views.info = () => {
    const items = t('info_items');
    return `<section class="card"><h1>${t('info_title')}</h1>
      ${list(items)}${list(L.redflags)}
      <a class="btn block" href="#terms">${t('see_terms')}</a></section>`;
  };

  views.settings = () => `
    <section class="card"><h1>${t('settings_title')}</h1>
      <div class="field"><span>🌐 ${t('language')}</span>
        <div class="seg">${window.LANGS.map(([k, n]) => `<button class="${S.lang === k ? 'sel' : ''}" data-action="lang" data-lang="${k}">${n}</button>`).join('')}</div></div>
      <p>${t('current_profile')} <b>${prof(S.profileId)?.name || t('none')}</b> · <a href="#profiles">${t('change')}</a></p>
      <p>${t('saved_freq')} <b>${S.freq ? fmtHz(S.freq) : '—'}</b> · <a href="#tone">${t('adjust')}</a></p>
      <p>${t('program_start')} <b>${S.startDate ? fmtDate(S.startDate) : '—'}</b></p>
      <p>${t('terms_acc')} <b>${S.acceptedAt ? new Date(S.acceptedAt).toLocaleString(L.locale) : '—'}</b> · <a href="#terms">${t('see_terms_l')}</a></p></section>
    <section class="card"><h2>${t('install_title')}</h2>
      ${installPrompt ? `<button class="btn primary block" data-action="install">${t('install_btn')}</button>` : ''}
      <ul class="list small">${t('install_items').map(x => `<li>${x}</li>`).join('')}</ul></section>
    <section class="card"><h2>${t('data_title')}</h2><p class="muted">${t('data_desc')}</p>
      <div class="row wrap gap"><button class="btn" data-action="export">${t('export')}</button>
      <label class="btn">${t('import')}<input type="file" accept="application/json" id="importFile" hidden></label>
      <button class="btn danger" data-action="reset">${t('reset')}</button></div></section>`;

  // ---------- Breathing ----------
  const breath = { k: null, t: null, c: null };
  function breathStart(k) {
    breathStop();
    breath.k = k;
    const phases = window.BREATH_META[k]; let i = 0;
    const step = () => {
      const c = $('#breathCircle'), l = $('#breathLbl');
      if (!c) return breathStop();
      const [kind, secs] = phases[i % phases.length];
      const name = L.breath[kind];
      c.style.transitionDuration = secs + 's';
      if (kind === 'in') c.classList.add('grow'); else if (kind === 'out') c.classList.remove('grow');
      let left = secs; l.textContent = `${name} ${left}`;
      clearInterval(breath.c); breath.c = setInterval(() => { left--; if (left > 0) l.textContent = `${name} ${left}`; }, 1000);
      i++; breath.t = setTimeout(step, secs * 1000);
    };
    step();
  }
  function breathStop() {
    clearTimeout(breath.t); clearInterval(breath.c); breath.k = null;
    const c = $('#breathCircle'); if (c) { c.classList.remove('grow'); $('#breathLbl').textContent = t('breath_choose'); }
  }

  // ---------- Actions ----------
  const freqFromSlider = v => 125 * Math.pow(14000 / 125, v / 1000);
  let tmpFreq = null, riTimer = null;

  const actions = {
    accept() {
      if (!$('#legalChk')?.checked || !$('#ageChk')?.checked) { toast(t('must_accept')); return; }
      S.accepted = true; S.legalVersion = window.LEGAL_VERSION; S.acceptedAt = new Date().toISOString();
      save(); location.hash = '#home';
    },
    lang(el) { setLang(el.dataset.lang); save(); render(); },
    play(el) {
      startTherapy(el.dataset.mode);
      if (el.dataset.go || currentRoute() === 'home') location.hash = '#therapy';
      render();
    },
    toggle(el) { engine.playing && engine.mode !== 'tone' ? stopTherapy() : startTherapy(el.dataset.mode); render(); },
    pickMode(el) {
      const m = el.dataset.mode;
      if (engine.playing && engine.mode !== 'tone') startTherapy(m); else { S.lastMode = m; save(); }
      render();
    },
    ear(el) { S.ear = el.dataset.ear; engine.setPan(panOf(S.ear)); save(); render(); },
    timer(el) {
      S.timer = +el.dataset.t; save();
      if (engine.playing) player.endAt = S.timer ? player.startedAt + S.timer * 60000 : 0;
      render();
    },
    progVol() { S.volume = programVolume().vol; engine.setVolume(S.volume); save(); render(); },
    useProfile(el) {
      S.profileId = el.dataset.id; S.secondaryId = el.dataset.sec || null;
      if (!S.startDate) S.startDate = today();
      const p = prof(S.profileId);
      if (p.program) S.volume = programVolume().vol;
      S.lastMode = p.mode;
      save(); toast(t('profile_saved')); location.hash = '#home';
    },
    toneToggle() {
      if (engine.playing && engine.mode === 'tone') engine.stop(0.2);
      else {
        if (engine.playing) stopTherapy(0.2);
        engine.volume = S.volume; engine.setPan(panOf(S.ear)); engine.freq = tmpFreq || S.freq || 4000;
        engine.start('tone', { fadeIn: 0.3 });
      }
      const b = $('#toneBtn'); if (b) b.textContent = engine.playing ? t('stop') : t('listen');
    },
    fstep(el) { setTmpFreq((tmpFreq || S.freq || 4000) * Math.pow(2, +el.dataset.k / 12)); },
    octave(el) {
      setTmpFreq((tmpFreq || S.freq || 4000) * +el.dataset.m);
      if (!(engine.playing && engine.mode === 'tone')) actions.toneToggle();
      render();
    },
    saveFreq() {
      S.freq = Math.round(tmpFreq || S.freq || 4000); save();
      if (engine.mode === 'tone') engine.stop(0.2);
      tmpFreq = null;
      toast(t('freq_saved', { f: fmtHz(S.freq) })); render();
    },
    riStart() {
      if (engine.playing) stopTherapy(0.2);
      engine.volume = Math.max(S.volume, 0.4); engine.freq = S.freq; engine.setPan(panOf(S.ear));
      engine.start('narrowband');
      let left = 60;
      $('#riBox').innerHTML = `<div class="freq-display" id="riCount">60</div><p class="center muted">${t('ri_listen')}</p>`;
      clearInterval(riTimer);
      riTimer = setInterval(() => {
        left--; const c = $('#riCount'); if (c) c.textContent = left;
        if (left <= 0) {
          clearInterval(riTimer); engine.stop(0.5); engine.volume = S.volume;
          const b = $('#riBox'); if (b) b.innerHTML = `<p>${t('ri_now')}</p>
            <div class="row wrap gap">${t('ri_opts').map((r, i) => `<button class="btn" data-action="riRes" data-r="${i}">${r}</button>`).join('')}</div>`;
        }
      }, 1000);
    },
    riRes(el) {
      const r = +el.dataset.r;
      S.ri = { date: today(), result: r }; save();
      toast(r <= 1 ? t('ri_good') : t('ri_saved'));
      render();
    },
    breath(el) { breathStart(el.dataset.k); document.querySelectorAll('[data-action=breath]').forEach(b => b.classList.toggle('sel', b === el)); },
    breathStop() { breathStop(); document.querySelectorAll('[data-action=breath]').forEach(b => b.classList.remove('sel')); },
    delDiary(el) { if (confirm(t('del_confirm'))) { S.diary = S.diary.filter(d => d.date !== el.dataset.date); save(); render(); } },
    export() {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `tinitus-${today()}.json`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    },
    reset() {
      if (!confirm(t('reset_confirm'))) return;
      stopTherapy(0.1); const lang = S.lang;
      try { localStorage.removeItem(KEY); } catch (e) {}
      S = load(); S.lang = lang; location.hash = '#welcome'; render();
    },
    async install() { if (installPrompt) { installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; render(); } },
    stopMini() { stopTherapy(); }
  };

  function setTmpFreq(f) {
    tmpFreq = Math.min(14000, Math.max(125, f));
    engine.setFreq(tmpFreq);
    const l = $('#freqLbl'); if (l) l.textContent = fmtHz(tmpFreq);
    const s = $('[data-input=freq]'); if (s) s.value = Math.round(1000 * Math.log(tmpFreq / 125) / Math.log(14000 / 125));
  }

  const inputs = {
    volume(el) { S.volume = +el.value; engine.setVolume(S.volume); const l = $('#volLbl'); if (l) l.textContent = Math.round(S.volume * 100) + ' %'; save(); },
    notch(el) { S.notch = el.checked; save(); if (engine.playing && engine.mode !== 'tone') startTherapy(engine.mode); },
    freq(el) { setTmpFreq(freqFromSlider(+el.value)); },
    lang(el) {
      // keep the acceptance ticks when switching language on the welcome screen
      const ticks = [$('#legalChk')?.checked, $('#ageChk')?.checked];
      setLang(el.value); save(); render();
      if ($('#legalChk')) { $('#legalChk').checked = !!ticks[0]; $('#ageChk').checked = !!ticks[1]; inputs.legalChk(); }
    },
    legalChk() { const b = $('#acceptBtn'); if (b) b.disabled = !($('#legalChk').checked && $('#ageChk').checked); },
    diaryLbl(el) { const l = $('#lbl_' + el.name); if (l) l.textContent = el.value; }
  };

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (el && actions[el.dataset.action]) { e.preventDefault(); actions[el.dataset.action](el); }
  });
  document.addEventListener('input', e => {
    const el = e.target.closest('[data-input]');
    if (el && inputs[el.dataset.input]) inputs[el.dataset.input](el);
  });
  document.addEventListener('change', e => {
    if (e.target.id !== 'importFile' || !e.target.files[0]) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        if (typeof d !== 'object' || !Array.isArray(d.diary)) throw 0;
        S = Object.assign({}, DEF, d); setLang(S.lang); save(); toast(t('imported')); render();
      } catch (err) { toast(t('invalid')); }
    };
    r.readAsText(e.target.files[0]);
  });
  document.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    if (f.id === 'testForm') {
      const score = {}; P.forEach(p => score[p.id] = 0);
      window.TEST_META.forEach(q => {
        const v = f.elements[q.id].value; if (v === '') return;
        Object.entries(q.scores[+v]).forEach(([k, n]) => score[k] += n);
      });
      const top = Object.entries(score).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).map(([k]) => k);
      const flags = [...f.querySelectorAll('[name=rf]:checked')].map(x => +x.value);
      S._lastResult = { top: top.length ? top.slice(0, 2) : ['hiss'], flags };
      S.redflags = flags; save();
      location.hash = '#result';
    } else if (f.id === 'diaryForm') {
      const entry = { date: today(), loud: +f.loud.value, annoy: +f.annoy.value, sleep: +f.sleep.value, stress: +f.stress.value, notes: f.notes.value.trim().slice(0, 500) };
      S.diary = S.diary.filter(d => d.date !== entry.date).concat(entry); save();
      toast(t('d_saved')); render();
    }
  });

  // ---------- Router ----------
  const MORE_GROUP = ['more', 'profiles', 'profile', 'test', 'result', 'tone', 'exercises', 'settings', 'info', 'terms'];
  function currentRoute() { return location.hash.slice(1).split('/')[0] || 'home'; }
  function render() {
    const [name, arg] = location.hash.slice(1).split('/');
    const legalOk = S.accepted && S.legalVersion === window.LEGAL_VERSION;
    if (!legalOk) { stopTherapy(0.1); if (name !== 'welcome') { location.hash = '#welcome'; return; } }
    const route = views[name] ? name : 'home';
    if (route !== 'relax') breathStop();
    if (route !== 'tone') {
      tmpFreq = null; clearInterval(riTimer);
      if (engine.mode === 'tone' || (engine.mode === 'narrowband' && !player.int)) engine.stop(0.2);
    }
    $('#view').innerHTML = views[route](arg);
    document.querySelectorAll('[data-nav]').forEach(a => {
      const n = a.dataset.nav;
      a.classList.toggle('active', n === route || (n === 'more' && MORE_GROUP.includes(route)));
    });
    document.body.classList.toggle('onboarding', route === 'welcome');
    updateMini(); tick();
  }
  let lastRoute = null;
  window.addEventListener('hashchange', () => { const r = currentRoute(); if (r !== lastRoute) window.scrollTo(0, 0); lastRoute = r; render(); });

  // ---------- PWA ----------
  let installPrompt = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  setLang(S.lang);
  lastRoute = currentRoute();
  render();
})();
