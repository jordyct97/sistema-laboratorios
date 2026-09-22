/* puente.js — Tablero (prácticas) <-> Solicitudes/Montaje <-> Kardex.
   El tablero MANDA en estados; la solicitud aporta el detalle de ítems;
   al ENTREGAR se descuenta Kardex por FEFO (una sola vez por solicitud). */
const TAB2SOL = { pendiente: 'BORRADOR', alistado: 'ALISTADO', montado: 'MONTADO', entregado: 'ENTREGADO', recibido: 'RECIBIDO', descuento: 'ENTREGADO' };
const SOL2TAB = { BORRADOR: 'pendiente', ALISTADO: 'alistado', MONTADO: 'montado', ENTREGADO: 'entregado', RECIBIDO: 'recibido' };

function getPracticas() { try { return JSON.parse(localStorage.getItem('practicas') || '[]'); } catch (e) { return []; } }
function setPracticas(p) { try { localStorage.setItem('practicas', JSON.stringify(p)); } catch (e) { toast('No se pudo guardar prácticas'); } try{ if(typeof Nube!=='undefined') Nube.subir('practicas'); }catch(e){} }
function sendSync(msg) { try { localStorage.setItem('smk_sync', JSON.stringify({ ...msg, nonce: Date.now() + Math.random() })); } catch (e) {} }
function practicaLabel(p) { return `${(p.fecha || '').slice(0, 10)} · ${p.docente || '—'} · ${(p.laboratorio || '').slice(0, 34)}`; }

/* "2 GUANTES ..." → {solicitados, nombre} */
function parseLineaInsumo(line) {
  const t = (line || '').trim(); if (!t) return null;
  const m = t.match(/^(\d+(?:[.,]\d+)?)\s+(.*)$/);
  if (m) return { solicitados: parseFloat(m[1].replace(',', '.')), nombre: m[2].trim() };
  return { solicitados: 1, nombre: t };
}
function codigoParaNombre(nombre) {
  try {
    const r = buscarCatalogo(nombre, 1)[0];
    if (r && r.codigo) return r.codigo;
    const l = todosLotes().find(x => norm(x.nombre) === norm(nombre));
    if (l) return l.codigo;
  } catch (e) {}
  return '';
}
function itemsDesdePractica(p) {
  return (p.insumos || '').split('\n').map(parseLineaInsumo).filter(Boolean)
    .filter(it => it.nombre).map(it => ({ codigo: codigoParaNombre(it.nombre), lote: '', nombre: it.nombre, solicitados: it.solicitados || 1, entregados: 0, recibidos: 0 }));
}
function textoDesdeItems(items) {
  return (items || []).map(it => `${+it.solicitados || 1} ${it.nombre || ''}`.trim()).join('\n');
}

/* Sincroniza estados tablero→solicitud + dispara FEFO. Se llama al iniciar y cuando cambia 'practicas'. */
function syncPracticasConSolicitudes() {
  if (!window.SOLS && typeof SOLS === 'undefined') return;
  const practicas = getPracticas();
  let changed = false;
  SOLS.forEach(s => {
    if (!s.practicaId) return;
    const p = practicas.find(x => x.id === s.practicaId);
    if (!p) return;
    const t = TAB2SOL[p.estado];
    if (t && t !== s.estado) { s.estado = t; s.actualizado = new Date().toISOString(); changed = true; }
    if ((p.estado === 'entregado' || p.estado === 'descuento') && (s.items || []).length) {
      try { descontarKardexPorSolicitud(s); } catch (e) { console.warn(e); }
    }
  });
  if (changed) {
    saveJSON(LS_KEYS.SOL, SOLS);
    try { renderListaSols(); } catch (e) {}
    try { const s = SOLS.find(x => x.id === SOL_ACTIVA); if (s) renderFlujo(s); } catch (e) {}
  }
}

/* Vincular solicitud activa con una práctica existente (trae sus ítems si la solicitud está vacía). */
function vincularPractica(practicaId) {
  const s = SOLS.find(x => x.id === SOL_ACTIVA);
  const p = getPracticas().find(x => x.id === practicaId);
  if (!s || !p) return toast('Selecciona solicitud y práctica');
  s.practicaId = p.id; p.solicitudId = s.id;
  if (!ITEM_BORRADOR.length && (p.insumos || '').trim()) ITEM_BORRADOR = itemsDesdePractica(p);
  const t = TAB2SOL[p.estado];
  if (t) s.estado = t;
  // completar datos desde la práctica si están vacíos
  const d = leerForm();
  if (!d.nombre && p.docente) s.datos = { ...d, nombre: p.docente };
  s.datos = {
    ...leerForm(),
    nombre: leerForm().nombre || p.docente || '', programa: leerForm().programa || p.programa || '',
    fechaUtilizacion: leerForm().fechaUtilizacion || p.fecha || '', horario: leerForm().horario || [p.hora, p.horaFin].filter(Boolean).join(' - '),
    laboratorio: leerForm().laboratorio || p.laboratorio || ''
  };
  guardarBorradorSilent();
  const f = $('#formSol');
  Object.entries(s.datos).forEach(([k, v]) => { const el = f.querySelector(`[name="${k}"]`); if (el) el.value = v || ''; });
  renderItemsBorrador(); renderFlujo(s); renderLinkBox();
  setPracticas(getPracticas().map(x => x.id === p.id ? p : x));
  guardarSols();
  toast('🔗 Vinculada con práctica del ' + (p.fecha || ''));
}

/* Crear práctica en el tablero desde la solicitud activa. */
function crearPracticaDesdeSolicitud() {
  const s = SOLS.find(x => x.id === SOL_ACTIVA);
  if (!s) { guardarBorrador(); return crearPracticaDesdeSolicitud(); }
  guardarBorradorSilent();
  const d = s.datos || {};
  const practicas = getPracticas();
  const p = {
    id: uid(), creado: Date.now(), fecha: d.fechaUtilizacion || hoyISO(),
    hora: (d.horario || '').split('-')[0].trim(), horaFin: (d.horario || '').split('-')[1]?.trim() || '',
    docente: d.nombre || '', programa: d.programa || '', laboratorio: d.laboratorio || '',
    estado: SOL2TAB[s.estado] || 'pendiente',
    insumos: textoDesdeItems(s.items), notas: 'Desde ' + (s.consecutivo || 'solicitud'),
    solicitudId: s.id
  };
  practicas.push(p); setPracticas(practicas);
  s.practicaId = p.id; guardarSols(); renderLinkBox();
  sendSync({ type: 'reload' });
  toast('📋 Práctica creada en el tablero (' + p.fecha + ')');
}

function irATableroPractica() {
  const s = SOLS.find(x => x.id === SOL_ACTIVA);
  const p = s && s.practicaId ? getPracticas().find(x => x.id === s.practicaId) : null;
  if (p && p.fecha) {
    try { localStorage.setItem('smk_goto_day', p.fecha); } catch (e) {}
    sendSync({ type: 'goto-day', fecha: p.fecha });
  }
  switchTab('tablero');
}

function renderLinkBox() {
  const box = $('#linkBox'); if (!box) return;
  const s = SOLS.find(x => x.id === SOL_ACTIVA);
  const practicas = getPracticas().slice().sort((a, b) => (b.fecha || '').localeCompare(a.fecha || '')).slice(0, 200);
  const linked = s && s.practicaId ? practicas.find(x => x.id === s.practicaId) : null;
  box.innerHTML = `
    <div class="flex flex-wrap items-center gap-2">
      <span class="text-xs font-black uppercase tracking-widest text-[#476B14]">🔗 Vínculo con tablero</span>
      ${linked ? `<span class="badge b-MONTADO">Práctica ${escapeHtml(linked.fecha || '')} · ${escapeHtml(linked.docente || '')}</span>` : '<span class="badge b-BORRADOR">Sin vincular</span>'}
      <select id="linkPracticaSel" class="rounded-xl border border-slate-200 px-2 py-2 text-xs" style="max-width:320px">
        <option value="">— Elegir práctica del tablero —</option>
        ${practicas.map(p => `<option value="${p.id}">${escapeHtml(practicaLabel(p))}</option>`).join('')}
      </select>
      <button id="linkPracticaBtn" class="btn btn-ghost">Vincular y traer ítems</button>
      <button id="crearPracticaBtn" class="btn btn-ghost">Crear práctica desde solicitud</button>
      ${linked ? '<button id="irPracticaBtn" class="btn btn-ghost">Ver en tablero →</button>' : ''}
    </div>`;
  $('#linkPracticaBtn').onclick = () => { const v = $('#linkPracticaSel').value; if (v) vincularPractica(v); else toast('Elige una práctica'); };
  $('#crearPracticaBtn').onclick = crearPracticaDesdeSolicitud;
  const ir = $('#irPracticaBtn'); if (ir) ir.onclick = irATableroPractica;
}
function escapeHtml(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

function initPuente() {
  window.addEventListener('storage', (e) => {
    if (e.key === 'practicas' || e.key === 'smk_practicas_ping') {
      syncEstadosYRefrescar();
    }
    if (e.key === 'smk_adjunto') {
      procesarAdjunto();
    }
    if (e.key === 'smk_open_montaje') {
      procesarAperturaMontaje();
    }
  });
  syncEstadosYRefrescar();
  try { procesarAdjunto(); } catch (e) {}
  try { procesarAperturaMontaje(); } catch (e) {}
}
/* Crea la solicitud vinculada a una práctica (reutilizable). */
function crearSolicitudDesdePractica(p, origen) {
  const items = itemsDesdePractica(p);
  const consec = 'SOL-' + new Date().getFullYear() + '-' + String(SOLS.length + 1).padStart(3, '0');
  const s = {
    id: uid(), consecutivo: consec, estado: TAB2SOL[p.estado] || 'BORRADOR',
    creado: new Date().toISOString(), actualizado: new Date().toISOString(),
    origen: origen || 'tablero', version: 'ACTUAL', practicaId: p.id,
    datos: {
      nombre: p.docente || '', programa: p.programa || '', laboratorio: p.laboratorio || '',
      fechaUtilizacion: p.fecha || '', horario: [p.hora, p.horaFin].filter(Boolean).join(' - '),
      obsEntrega: '', obsRecibido: ''
    },
    items
  };
  SOLS.unshift(s);
  p.solicitudId = s.id;
  setPracticas(getPracticas());
  saveJSON(LS_KEYS.SOL, SOLS);
  return s;
}
/* Abrir Montaje desde el tablero: abre la solicitud vinculada (o la crea) en el editor. */
function procesarAperturaMontaje() {
  let rec = null;
  try { rec = JSON.parse(localStorage.getItem('smk_open_montaje') || 'null'); } catch (e) {}
  if (!rec || !rec.practicaId) return;
  try { localStorage.removeItem('smk_open_montaje'); } catch (e) {}
  const p = getPracticas().find(x => x.id === rec.practicaId);
  if (!p) return toast('La práctica ya no existe');
  let s = (p.solicitudId && SOLS.find(x => x.id === p.solicitudId)) || SOLS.find(x => x.practicaId === p.id);
  if (!s) {
    s = crearSolicitudDesdePractica(p, 'montaje desde tablero');
    try { renderListaSols(); } catch (e) {}
    toast(`📝 Montaje creado para la práctica del ${p.fecha || ''}`);
  }
  SOL_ACTIVA = s.id;
  try { switchTab('editor'); } catch (e) {}
  try { editarSolicitud(s.id); } catch (e) {}
  window.__montajeAbierto = true;
}
/* Formato adjuntado desde el tablero: crear la solicitud vinculada (una sola vez). */
function procesarAdjunto() {
  let rec = null;
  try { rec = JSON.parse(localStorage.getItem('smk_adjunto') || 'null'); } catch (e) {}
  if (!rec || !rec.practicaId) return;
  try { localStorage.removeItem('smk_adjunto'); } catch (e) {}
  const p = getPracticas().find(x => x.id === rec.practicaId);
  if (!p) return;
  if (p.solicitudId && SOLS.some(s => s.id === p.solicitudId)) return; // ya vinculada
  const ya = SOLS.find(s => s.practicaId === p.id);
  if (ya) { p.solicitudId = ya.id; setPracticas(getPracticas()); return; }
  const s = crearSolicitudDesdePractica(p, rec.fileName || 'formato adjunto');
  try { renderListaSols(); } catch (e) {}
  toast(`📥 Solicitud ${s.consecutivo} creada desde formato adjunto (${s.items.length} ítems)`);
}
function syncEstadosYRefrescar() {
  try { syncPracticasConSolicitudes(); } catch (e) { console.warn(e); }
}
/* Coincidencias formato→reservas: mismo docente + fecha de uso (+ laboratorio).
   score: docente 2 + fecha 2 + lab 1. Se sugieren con score>=3. */
function normPersona(s) { return norm(s || '').replace(/\s+/g, ' ').trim(); }
function buscarPracticasCoincidentes(d) {
  const nd = normPersona(d.nombre || '');
  const fu = (d.fechaUtilizacion || '').slice(0, 10);
  const lab = norm(d.laboratorio || '');
  if (!nd && !fu) return [];
  return getPracticas().map(p => {
    let score = 0; const why = [];
    if (nd && normPersona(p.docente) === nd) { score += 2; why.push('docente'); }
    if (fu && (p.fecha || '') === fu) { score += 2; why.push('fecha'); }
    const pl = norm(p.laboratorio || '');
    if (lab && pl && (pl.includes(lab) || (lab.includes(pl) && pl.length > 4))) { score += 1; why.push('lab'); }
    return { p, score, why };
  }).filter(x => x.score >= 3).sort((a, b) => b.score - a.score);
}
