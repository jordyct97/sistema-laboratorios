/* nube.js — sincronización opcional con Firebase Firestore.
   - Sin config (o sin internet): todo sigue local, sin errores.
   - Con config: espeja estas claves en la colección 'estado' (un doc por clave)
     y escucha cambios en tiempo real. Gana la última escritura (updatedAt).
   Funciona en la app principal y dentro del tablero (iframe): mismo origen. */
window.NUBE_CTX = window.NUBE_CTX || 'app';
const Nube = {
  db: null, listo: false, stamps: {}, timers: {}, aplicando: false, ultima: null,
  KEYS: ['practicas', 'smk_solicitudes_v1', 'smk_movs_local_v1', 'smk_lotes_local_v1'],

  cfg() {
    try {
      const raw = localStorage.getItem('smk_firebase_config');
      if (raw) { const o = JSON.parse(raw); if (o && o.apiKey && !/^PEGA/i.test(o.apiKey)) return o; }
    } catch (e) {}
    const w = window.FIREBASE_CONFIG;
    if (w && w.apiKey && !/^PEGA/i.test(w.apiKey)) return w;
    return null;
  },

  async init(ctx) {
    if (ctx) window.NUBE_CTX = ctx;
    try { this.stamps = JSON.parse(localStorage.getItem('smk_nube_stamps') || '{}'); } catch (e) { this.stamps = {}; }
    const cfg = this.cfg();
    this.pintar(cfg ? 'conectando' : 'local');
    if (!cfg || typeof firebase === 'undefined') return;
    try {
      if (!firebase.apps.length) firebase.initializeApp(cfg);
      this.db = firebase.firestore();
      try { await this.db.enablePersistence({ synchronizeTabs: true }); } catch (e) {}
      this.listo = true;
      for (const k of this.KEYS) await this.vincular(k);
      this.instalarHook();
      this.pintar('conectado');
    } catch (e) { console.warn('Nube:', e); this.pintar('error'); }
  },

  ref(k) { return this.db.collection('estado').doc(k); },

  async vincular(k) {
    let snap = null;
    try { snap = await this.ref(k).get(); }
    catch (e) { this.pintar('error'); return; }
    const local = localStorage.getItem(k);
    const rem = snap.exists ? snap.data() : null;
    const remT = rem && rem.updatedAt && rem.updatedAt.toMillis ? rem.updatedAt.toMillis() : 0;
    const locT = this.stamps[k] || 0;
    if (rem && rem.json !== undefined && remT > locT && rem.json !== local) {
      this.aplicar(k, rem.json, remT);
    } else if (local !== null && (!rem || locT >= remT)) {
      this.subir(k);
    }
    this.ref(k).onSnapshot(s => {
      if (!s.exists) return;
      const d = s.data();
      const t = d.updatedAt && d.updatedAt.toMillis ? d.updatedAt.toMillis() : 0;
      if (t > (this.stamps[k] || 0) && d.json !== localStorage.getItem(k)) this.aplicar(k, d.json, t);
    }, () => this.pintar('error'));
  },

  aplicar(k, json, t) {
    if (json === null || json === undefined) return;
    this.aplicando = true;
    try {
      localStorage.setItem(k, json);
      this.stamps[k] = t;
      try { localStorage.setItem('smk_nube_stamps', JSON.stringify(this.stamps)); } catch (e) {}
      this.refrescar(k);
    } finally { this.aplicando = false; }
    this.ultima = new Date();
    this.pintar('conectado');
  },

  refrescar(k) {
    try {
      if (window.NUBE_CTX === 'tablero') {
        if (k === 'practicas' && typeof loadData === 'function') loadData();
        return;
      }
      if (k === 'practicas') {
        if (typeof syncEstadosYRefrescar === 'function') syncEstadosYRefrescar();
        if (typeof renderListaSols === 'function') renderListaSols();
      } else if (k === 'smk_solicitudes_v1') {
        if (typeof renderListaSols === 'function') renderListaSols();
        if (typeof renderLinkBox === 'function') renderLinkBox();
      } else if (k === 'smk_movs_local_v1' || k === 'smk_lotes_local_v1') {
        if (typeof renderKardex === 'function') renderKardex();
        if (typeof renderValidacion === 'function') renderValidacion();
      }
    } catch (e) { console.warn(e); }
  },

  instalarHook() {
    if (Storage.prototype.__nubeHook) return;
    Storage.prototype.__nubeHook = true;
    const orig = Storage.prototype.setItem;
    const self = this;
    Storage.prototype.setItem = function (k, v) {
      orig.call(this, k, v);
      if (self.listo && !self.aplicando && self.KEYS.includes(k)) self.programar(k);
    };
  },

  programar(k) {
    clearTimeout(this.timers[k]);
    this.pintar('subiendo');
    this.timers[k] = setTimeout(() => this.subir(k), 500);
  },

  async subir(k) {
    if (!this.listo) return;
    const v = localStorage.getItem(k);
    if (v === null) return;
    try {
      await this.ref(k).set({
        json: v,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        por: window.NUBE_CTX + '@' + new Date().toISOString()
      });
      this.stamps[k] = Date.now();
      try { localStorage.setItem('smk_nube_stamps', JSON.stringify(this.stamps)); } catch (e) {}
      this.ultima = new Date();
      this.pintar('conectado');
    } catch (e) { this.pintar('error'); }
  },

  async subirTodo() {
    for (const k of this.KEYS) {
      if (localStorage.getItem(k) !== null) await this.subir(k);
    }
    toast('☁️ Todo subido a la nube');
  },

  pintar(modo) {
    const el = document.getElementById('nubeEstado');
    if (!el) return;
    const hora = this.ultima ? this.ultima.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : '';
    if (modo === 'conectado') {
      el.textContent = '☁️ Nube OK' + (hora ? ' · ' + hora : '');
      el.className = 'rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700';
      el.title = 'Sincronizado con Firebase';
    } else if (modo === 'conectando') {
      el.textContent = '☁️ Conectando…';
      el.className = 'rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500';
    } else if (modo === 'subiendo') {
      el.textContent = '⬆ Subiendo…';
      el.className = 'rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700';
    } else if (modo === 'error') {
      el.textContent = '⚠️ Nube sin conexión';
      el.className = 'rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700';
      el.title = 'Trabajando local; reintentando';
    } else {
      el.textContent = '☁️ Solo en este equipo';
      el.className = 'rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500';
      el.title = 'Configura Firebase con el botón ☁️ para sincronizar entre equipos';
    }
  },

  abrirAjustes() {
    const m = document.getElementById('nubeModal');
    if (!m) return toast('Modal no disponible');
    const ta = document.getElementById('nubeCfgText');
    let actual = '';
    try { actual = localStorage.getItem('smk_firebase_config') || ''; } catch (e) {}
    if (!actual) actual = JSON.stringify(window.FIREBASE_CONFIG || {}, null, 1);
    ta.value = actual;
    m.classList.remove('hidden'); m.classList.add('flex');
  },

  cerrarAjustes() {
    const m = document.getElementById('nubeModal');
    if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
  },

  guardarAjustes() {
    const ta = document.getElementById('nubeCfgText');
    try {
      const o = JSON.parse(ta.value);
      if (!o.apiKey || !o.projectId) return toast('⚠ Faltan apiKey o projectId');
      localStorage.setItem('smk_firebase_config', JSON.stringify(o));
      toast('☁️ Config guardada, reconectando…');
      setTimeout(() => location.reload(), 800);
    } catch (e) { toast('⚠ JSON inválido: ' + e.message); }
  },

  quitarAjustes() {
    try { localStorage.removeItem('smk_firebase_config'); } catch (e) {}
    toast('☁️ Config quitada, modo local');
    setTimeout(() => location.reload(), 800);
  }
};
