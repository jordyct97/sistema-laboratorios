/* solicitudes.js — CRUD + montaje + flujo de estados */
let SOLS = loadJSON(LS_KEYS.SOL, []);
let SOL_ACTIVA = null; // id
let ITEM_BORRADOR = []; // items en edición

function guardarSols(){ saveJSON(LS_KEYS.SOL, SOLS); renderListaSols(); try{ if(typeof Nube!=='undefined') Nube.subir(LS_KEYS.SOL); }catch(e){} }
function nuevaSolicitud(){
  SOL_ACTIVA = null; ITEM_BORRADOR = [];
  $('#formSol').reset();
  $('#solId').value = '';
  $('#fechaSolicitud').value = hoyISO();
  $('#fechaUtilizacion').value = hoyISO();
  renderItemsBorrador();
  $('#editorTitle').textContent = 'Nueva solicitud de insumos';
  switchTab('editor');
}
function editarSolicitud(id){
  const s = SOLS.find(x=>x.id===id); if(!s) return;
  SOL_ACTIVA = id; ITEM_BORRADOR = JSON.parse(JSON.stringify(s.items||[]));
  const f = $('#formSol');
  Object.entries(s.datos||{}).forEach(([k,v])=>{ const el=f.querySelector(`[name="${k}"]`); if(el) el.value=v; });
  $('#solId').value = s.id;
  $('#editorTitle').textContent = 'Editar solicitud ' + (s.consecutivo||'');
  renderItemsBorrador(); renderFlujo(s);
  switchTab('editor');
}
function leerForm(){
  const f = $('#formSol'); const d = {};
  ['nombre','documento','tipoUsuario','programa','asignatura','tema','semestre','grupo','jornada','numEstudiantes','numGrupos','fechaSolicitud','fechaUtilizacion','horario','laboratorio','sede','obsEntrega','alistadoPor','montadoPor','recibidoPor','obsRecibido'].forEach(k=>{ const el=f.querySelector(`[name="${k}"]`); d[k]=el?el.value.trim():''; });
  return d;
}
function validarMin(d){
  if(!d.nombre) return 'Falta NOMBRE Y APELLIDO del solicitante';
  if(!d.asignatura) return 'Falta ASIGNATURA';
  if(!d.fechaUtilizacion) return 'Falta FECHA DE UTILIZACIÓN';
  if(!ITEM_BORRADOR.length) return 'Agrega al menos 1 material/equipo';
  return null;
}
function guardarBorrador(){
  const datos = leerForm();
  const err = validarMin(datos); if(err) return toast('⚠ '+err);
  if(SOL_ACTIVA){
    const s = SOLS.find(x=>x.id===SOL_ACTIVA);
    s.datos = datos; s.items = ITEM_BORRADOR; s.actualizado = new Date().toISOString();
  } else {
    const consec = 'SOL-' + new Date().getFullYear() + '-' + String(SOLS.length+1).padStart(3,'0');
    SOLS.unshift({id:uid(), consecutivo:consec, estado:'BORRADOR', creado:new Date().toISOString(), actualizado:new Date().toISOString(), datos, items:ITEM_BORRADOR});
    SOL_ACTIVA = SOLS[0].id; $('#solId').value = SOL_ACTIVA;
  }
  guardarSols(); renderFlujo(SOLS.find(x=>x.id===SOL_ACTIVA));
  toast('✅ Solicitud guardada (borrador)');
}
function cambiarEstado(nuevo){
  const s = SOLS.find(x=>x.id===SOL_ACTIVA);
  if(!s){ guardarBorrador(); return cambiarEstado(nuevo); }
  guardarBorradorSilent();
  const orden = {BORRADOR:0,ALISTADO:1,MONTADO:2,ENTREGADO:3,RECIBIDO:4};
  s.estado = nuevo; s.actualizado = new Date().toISOString();
  s.historial = s.historial||[];
  s.historial.push({estado:nuevo, fecha:new Date().toISOString(), por:($('#formSol [name="'+firmaCampo(nuevo)+'"]')||{}).value||''});
  if(nuevo==='ENTREGADO'){ try{ descontarKardexPorSolicitud(s); }catch(e){} }
  guardarSols(); renderFlujo(s);
  if(s.practicaId){
    try{
      const practicas = getPracticas();
      const p = practicas.find(x=>x.id===s.practicaId);
      if(p){ const t = SOL2TAB[nuevo]; if(t && t!==p.estado){ p.estado = t; setPracticas(practicas); sendSync({type:'reload'}); } }
    }catch(e){}
  }
  toast('Estado → ' + nuevo);
}
function firmaCampo(est){ return est==='ALISTADO'?'alistadoPor':est==='MONTADO'?'montadoPor':est==='ENTREGADO'?'recibidoPor':'recibidoPor'; }
function guardarBorradorSilent(){
  const s = SOLS.find(x=>x.id===SOL_ACTIVA); if(!s) return;
  s.datos = leerForm(); s.items = ITEM_BORRADOR; s.actualizado = new Date().toISOString();
  saveJSON(LS_KEYS.SOL, SOLS);
}
// ---- items ----
function agregarItemVacio(){ ITEM_BORRADOR.push({codigo:'',lote:'',nombre:'',solicitados:1,entregados:0,recibidos:0}); renderItemsBorrador(); }
function agregarItemCatalogo(it, loteScan){
  ITEM_BORRADOR.push({codigo:it.codigo||'', lote:loteScan||'', nombre:it.nombre||'', solicitados:1, entregados:0, recibidos:0, presentacion:it.presentacion||''});
  renderItemsBorrador();
  toast('➕ ' + (it.nombre||'').slice(0,40));
}
function renderItemsBorrador(){
  const tb = $('#itemsBody'); tb.innerHTML='';
  ITEM_BORRADOR.forEach((it, i)=>{
    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-100 hover:bg-slate-50/60';
    tr.innerHTML = `
      <td class="px-2 py-1.5 text-center font-bold text-slate-400">${i+1}</td>
      <td class="px-2 py-1.5"><input data-k="codigo" data-i="${i}" data-scan value="${it.codigo||''}" placeholder="Código / QR" class="w-28 rounded-lg border border-slate-200 px-2 py-1.5 text-xs"></td>
      <td class="px-2 py-1.5"><input data-k="lote" data-i="${i}" value="${it.lote||''}" placeholder="Lote" class="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-xs"></td>
      <td class="px-2 py-1.5 relative"><input data-k="nombre" data-i="${i}" value="${(it.nombre||'').replace(/"/g,'&quot;')}" placeholder="Nombre del material / equipo" class="w-full min-w-[220px] rounded-lg border border-slate-200 px-2 py-1.5 text-xs" autocomplete="off"><div class="autocomplete hidden"></div></td>
      <td class="px-2 py-1.5"><input data-k="solicitados" data-i="${i}" type="number" min="0" step="any" value="${it.solicitados??''}" class="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-xs"></td>
      <td class="px-2 py-1.5"><input data-k="entregados" data-i="${i}" type="number" min="0" step="any" value="${it.entregados??''}" class="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-xs"></td>
      <td class="px-2 py-1.5"><input data-k="recibidos" data-i="${i}" type="number" min="0" step="any" value="${it.recibidos??''}" class="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-xs"></td>
      <td class="px-2 py-1.5 text-center font-extrabold ${faltantes(it)>0?'text-rose-600':'text-emerald-600'}">${faltantes(it)}</td>
      <td class="px-2 py-1.5 text-center whitespace-nowrap">
        <button data-scan-row="${i}" class="rounded-lg bg-green-50 px-2 py-1 text-sm" title="Escanear código para esta fila">📷</button>
        <button data-del="${i}" class="rounded-lg bg-rose-50 px-2 py-1 text-sm" title="Quitar">🗑</button>
      </td>`;
    tb.appendChild(tr);
  });
  $('#itemsCount').textContent = ITEM_BORRADOR.length + ' ítems';
  try { renderPasosMontaje(); } catch (e) {}
  // listeners
  $$('#itemsBody input').forEach(inp=>{
    inp.addEventListener('input', ()=>{
      const i=+inp.dataset.i, k=inp.dataset.k;
      ITEM_BORRADOR[i][k] = (k==='nombre'||k==='codigo'||k==='lote')? inp.value : (inp.value===''?'':+inp.value);
      if(k==='nombre') autocomplete(inp);
      if(['solicitados','entregados','recibidos'].includes(k)) renderFaltantes();
    });
    inp.addEventListener('focus', ()=>{ if(inp.dataset.k==='nombre') autocomplete(inp); });
    // lector USB wedge: si el input tiene data-scan y llega código rápido, resolver
  });
  $$('#itemsBody [data-del]').forEach(b=>b.onclick=()=>{ ITEM_BORRADOR.splice(+b.dataset.del,1); renderItemsBorrador(); });
  $$('#itemsBody [data-scan-row]').forEach(b=>b.onclick=()=>{
    const i=+b.dataset.scanRow;
    abrirScanner((hit, code)=>{
      ITEM_BORRADOR[i].codigo = hit.codigo||code;
      ITEM_BORRADOR[i].nombre = hit.nombreBase||hit.nombre||ITEM_BORRADOR[i].nombre;
      if(hit.lote) ITEM_BORRADOR[i].lote = hit.lote;
      else if(!hit.codigo) ITEM_BORRADOR[i].lote = code;
      renderItemsBorrador();
    }, 'Escanear insumo para la fila '+(i+1));
  });
}
function renderFaltantes(){
  $$('#itemsBody tr').forEach((tr, i)=>{
    const it = ITEM_BORRADOR[i]; const f = faltantes(it);
    const cell = tr.children[7]; cell.textContent = f;
    cell.className = 'px-2 py-1.5 text-center font-extrabold ' + (f>0?'text-rose-600':'text-emerald-600');
  });
}
function autocomplete(inp){
  const box = inp.parentElement.querySelector('.autocomplete');
  const q = inp.value.trim(); if(q.length<2){ box.classList.add('hidden'); return; }
  const res = buscarCatalogo(q, 8);
  if(!res.length){ box.classList.add('hidden'); return; }
  box.innerHTML = res.map((r,i)=>`<button type="button" data-i="${i}"><b>${r.nombre}</b><br><span class="text-slate-400">${r.codigo||'sin código'} · ${r.categoria||''}</span></button>`).join('');
  box.classList.remove('hidden');
  [...box.children].forEach(b=>b.onclick=()=>{
    const it = res[+b.dataset.i]; const i=+inp.dataset.i;
    ITEM_BORRADOR[i].nombre = it.nombre; ITEM_BORRADOR[i].codigo = it.codigo||ITEM_BORRADOR[i].codigo;
    renderItemsBorrador(); box.classList.add('hidden');
  });
  inp.onblur = ()=>setTimeout(()=>box.classList.add('hidden'),200);
}
function renderPasosMontaje() {
  const box = $('#pasosMontaje'); if (!box) return;
  let d = {};
  try { d = leerForm(); } catch (e) {}
  const okDatos = !!(d.nombre && d.asignatura && d.fechaUtilizacion);
  const n = ITEM_BORRADOR.length;
  const okFirmas = !!(d.alistadoPor || d.montadoPor);
  const paso = (ok, label) => `<span class="inline-flex items-center gap-1 rounded-full px-3 py-1 font-bold ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}">${ok ? '✓' : '○'} ${label}</span>`;
  box.innerHTML = paso(okDatos, '1 · Datos') + '<span class="text-slate-300">→</span>' + paso(n > 0, `2 · Materiales (${n})`) + '<span class="text-slate-300">→</span>' + paso(okFirmas, '3 · Firmas y estado');
}
// ---- lista ----
function renderListaSols(){
  const q = norm($('#buscSol').value||''); const fe = $('#filtroEstado').value||'';
  const box = $('#listaSols'); box.innerHTML='';
  const arr = SOLS.filter(s=>{
    if(fe && s.estado!==fe) return false;
    if(!q) return true;
    return norm(s.consecutivo+' '+(s.datos?.nombre||'')+' '+(s.datos?.asignatura||'')+' '+(s.datos?.laboratorio||'')+' '+(s.items||[]).map(i=>i.nombre).join(' ')).includes(q);
  });
  $('#solCount').textContent = arr.length + ' solicitudes';
  if(!arr.length){ box.innerHTML='<p class="text-sm text-slate-400 text-center py-8">Sin solicitudes. Crea la primera con “＋ Nueva solicitud”.</p>'; return; }
const ESTADO_TXT = { BORRADOR: 'Borrador', ALISTADO: 'Alistado', MONTADO: 'Montado', ENTREGADO: 'Entregado', RECIBIDO: 'Recibido' };
const PASOS = ['BORRADOR', 'ALISTADO', 'MONTADO', 'ENTREGADO', 'RECIBIDO'];
const PASO_CORTO = { BORRADOR: 'Borrador', ALISTADO: 'Alistado', MONTADO: 'Montado', ENTREGADO: 'Entregado', RECIBIDO: 'Recibido' };
const SIGUIENTE = { BORRADOR: ['📦 Alistar', 'ALISTADO'], ALISTADO: ['🛠 Montar', 'MONTADO'], MONTADO: ['🤝 Entregar', 'ENTREGADO'], ENTREGADO: ['✔ Recibir', 'RECIBIDO'] };
function avanzarEstado(id, nuevo) {
  const s = SOLS.find(x => x.id === id); if (!s) return;
  s.estado = nuevo; s.actualizado = new Date().toISOString();
  s.historial = s.historial || [];
  s.historial.push({ estado: nuevo, fecha: new Date().toISOString(), por: '' });
  if (nuevo === 'ENTREGADO') { try { descontarKardexPorSolicitud(s); } catch (e) {} }
  if (s.practicaId) {
    try {
      const practicas = getPracticas();
      const p = practicas.find(x => x.id === s.practicaId);
      if (p) { const t = SOL2TAB[nuevo]; if (t && t !== p.estado) { p.estado = t; setPracticas(practicas); sendSync({ type: 'reload' }); } }
    } catch (e) {}
  }
  guardarSols();
  toast('✓ ' + (s.consecutivo || '') + ' → ' + (ESTADO_TXT[nuevo] || nuevo));
}
function stepperHTML(estado) {
  const idx = PASOS.indexOf(estado);
  return `<div class="mt-2 flex items-center gap-1" aria-label="Progreso">${PASOS.map((p, i) => `
    <div class="flex flex-1 items-center gap-1 ${i > 0 ? '' : ''}">
      ${i > 0 ? `<div class="h-1 flex-1 rounded ${i <= idx ? 'bg-[#6F9F35]' : 'bg-slate-200'}"></div>` : ''}
      <div class="flex flex-col items-center" title="${PASO_CORTO[p]}">
        <div class="grid h-5 w-5 place-items-center rounded-full text-[10px] font-black ${i < idx ? 'bg-[#6F9F35] text-white' : i === idx ? 'bg-[#0f172a] text-white' : 'bg-slate-200 text-slate-400'}">${i < idx ? '✓' : (i + 1)}</div>
        <span class="text-[9px] font-bold ${i === idx ? 'text-slate-800' : 'text-slate-400'}">${PASO_CORTO[p]}</span>
      </div>
    </div>`).join('')}</div>`;
}
  arr.forEach(s=>{
    const nFalt = (s.items||[]).reduce((a,i)=>a+faltantes(i),0);
    const sig = SIGUIENTE[s.estado];
    const vinc = s.practicaId ? ' · 🔗 tablero' : '';
    const vBadge = (s.version || s.datos?.formatoVersion) === 'ANTIGUO' ? ' · <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">formato antiguo</span>' : '';
    const d = document.createElement('div');
    d.className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition';
    d.innerHTML=`<div class="flex items-start justify-between gap-2">
      <div class="min-w-0"><p class="text-xs font-bold text-slate-400">${escapeHtml(s.consecutivo||'')} · Uso: ${escapeHtml(s.datos?.fechaUtilizacion||'—')}${vBadge}${vinc}</p>
      <p class="truncate font-extrabold text-slate-900">${escapeHtml(s.datos?.asignatura||'Sin asignatura')} <span class="font-normal text-slate-500">— ${escapeHtml(s.datos?.nombre||'')}</span></p>
      <p class="text-xs text-slate-500">${escapeHtml(s.datos?.laboratorio||'Sin laboratorio')} · ${(s.items||[]).length} materiales ${nFalt?`· <span class="text-rose-600 font-bold">${nFalt} pendientes</span>`:'· <span class="text-emerald-600 font-bold">sin pendientes</span>'}</p></div>
      <span class="badge b-${s.estado} shrink-0">${ESTADO_TXT[s.estado]||s.estado}</span></div>
      ${stepperHTML(s.estado)}
      <div class="mt-3 flex flex-wrap gap-2 no-print">
        ${sig ? `<button class="btn btn-brand" data-act="next">${sig[0]} →</button>` : `<span class="btn btn-ghost" style="cursor:default">✓ Cerrada</span>`}
        <button class="btn btn-ghost" data-act="edit">Abrir detalle</button>
        <button class="btn btn-ghost" data-act="xls">⬇ Excel</button>
        <button class="btn btn-ghost" data-act="dup" title="Duplicar">⧉</button>
        <button class="btn btn-danger" data-act="del" title="Eliminar">🗑</button>
      </div>`;
    if(sig) d.querySelector('[data-act="next"]').onclick=()=>avanzarEstado(s.id, sig[1]);
    d.querySelector('[data-act="edit"]').onclick=()=>editarSolicitud(s.id);
    d.querySelector('[data-act="xls"]').onclick=()=>exportarSolicitudExcel(s.id);
    d.querySelector('[data-act="dup"]').onclick=()=>{ const c=JSON.parse(JSON.stringify(s)); c.id=uid(); c.consecutivo=s.consecutivo+'-C'; c.estado='BORRADOR'; c.creado=new Date().toISOString(); SOLS.unshift(c); guardarSols(); toast('Duplicada'); };
    d.querySelector('[data-act="del"]').onclick=()=>{ if(confirm('¿Eliminar '+s.consecutivo+'?')){ SOLS=SOLS.filter(x=>x.id!==s.id); guardarSols(); } };
    box.appendChild(d);
  });
}
function renderFlujo(s){
  const box = $('#flujoBox'); if(!box) return;
  if(!s){ box.innerHTML='<p class="text-xs text-slate-400">Guarda el borrador para activar el flujo de montaje.</p>'; return; }
  const steps = [['ALISTADO','📦 Alistar'],['MONTADO','🛠 Montar'],['ENTREGADO','🤝 Entregar'],['RECIBIDO','✔ Recibir/Cerrar']];
  box.innerHTML = `<div class="flex flex-wrap items-center gap-2"><span class="badge b-${s.estado}">${s.estado}</span>` +
    steps.map(([e,l])=>`<button class="btn ${s.estado===e?'btn-dark':'btn-ghost'}" data-e="${e}">${l}</button>`).join('') +
    `</div><p class="mt-2 text-xs text-slate-400">Al ENTREGAR se descuenta automáticamente del Kardex. Historial: ${(s.historial||[]).map(h=>h.estado+' '+new Date(h.fecha).toLocaleString('es-CO')).join(' → ')||'—'}</p>`;
  $$('button',box).forEach(b=>b.onclick=()=>cambiarEstado(b.dataset.e));
}
function initSolicitudes(){
  const nb = $('#newSolBtn') || $('#goNew'); if(nb) nb.onclick = nuevaSolicitud;
  $('#addItemBtn').onclick = agregarItemVacio;
  $('#scanAddBtn').onclick = ()=>abrirScanner((hit,code)=>{
    const lote = hit.lote || (/^[A-Za-z0-9\-\/\.]+$/.test(code)&&!hit.codigo?code:'');
    agregarItemCatalogo({...hit, nombre:hit.nombreBase||hit.nombre}, hit.lote||lote);
  }, 'Escanear insumo para agregar');
  $('#saveDraftBtn').onclick = guardarBorrador;
  $('#exportXlsBtn').onclick = ()=>{ if(!SOL_ACTIVA) guardarBorrador(); if(SOL_ACTIVA) exportarSolicitudExcel(SOL_ACTIVA); };
  $('#printBtn').onclick = ()=>window.print();
  $('#buscSol').addEventListener('input', renderListaSols);
  $('#filtroEstado').addEventListener('change', renderListaSols);
  const fsol = $('#formSol'); if (fsol) fsol.addEventListener('input', renderPasosMontaje);
  const imp = $('#importFormatoInput'); if(imp) imp.addEventListener('change', e=>{ if(e.target.files[0]) importarFormatoExcel(e.target.files[0]); imp.value=''; });
  $('#catalogoAdd').addEventListener('input', (e)=>{
    const q=e.target.value.trim(); const box=$('#catalogoSug');
    if(q.length<2){box.classList.add('hidden');return;}
    const res=buscarCatalogo(q,8);
    box.innerHTML=res.map((r,i)=>`<button type="button" data-i="${i}"><b>${r.nombre}</b><br><span class="text-slate-400">${r.codigo||''} · ${r.categoria||''}</span></button>`).join('');
    box.classList.remove('hidden');
    [...box.children].forEach(b=>b.onclick=()=>{agregarItemCatalogo(res[+b.dataset.i]); e.target.value=''; box.classList.add('hidden');});
  });
}
/* ---- importar Formato solicitud .xls/.xlsx con vista previa ----
   Parser posicional Tipo A (filas exactas del formato) + heurístico de respaldo.
   Limpieza: seriales Excel→fecha, 1022325460.0→1022325460, omite boilerplate y filas vacías. */
function limpiaNum(v) {
  if (v == null || v === '') return '';
  const t = String(v).trim().replace(',', '.');
  const n = parseFloat(t);
  if (isNaN(n)) return String(v).trim();
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
}
function limpiaFecha(x) { return formatoDateToISO(x); }
function esBoilerplate(t) {
  return /manejo de desechos|normas del laboratorio|entrega de equipos|acepto haber recibido/i.test(t || '');
}
function unirCeldas(fila, a, b) {
  return (fila || []).slice(a, b + 1).map(c => String(c == null ? '' : c).trim()).filter(Boolean).join(' ');
}
function matchItemKardex(it) {
  try {
    if (typeof todosLotes !== 'function') return null;
    const lotes = todosLotes();
    let cands = [];
    if (it.codigo) cands = lotes.filter(l => l.codigo === it.codigo);
    if (!cands.length && it.nombre) {
      const n = norm(it.nombre);
      cands = lotes.filter(l => norm(l.nombre) === n);
      if (!cands.length) cands = lotes.filter(l => n.length > 5 && (norm(l.nombre).includes(n) || n.includes(norm(l.nombre))));
    }
    if (!cands.length) return { estado: 'no-existe', texto: 'No está en Kardex' };
    const disp = cands.filter(l => (+l.stock || 0) > 0 && (l.status || '').toUpperCase().includes('DISPON'));
    const stock = cands.reduce((s, l) => s + (+l.stock || 0), 0);
    const need = +it.solicitados || 0;
    if (!disp.length) return { estado: 'sin-stock', texto: `En Kardex sin stock (${cands.length} lote(s))` };
    if (need && stock < need) return { estado: 'parcial', texto: `Stock ${stock} < pedido ${need} (${disp.length} lote(s))` };
    return { estado: 'ok', texto: `✓ ${disp.length} lote(s) · stock ${stock}` };
  } catch (e) { return null; }
}
function parseTipoAPosicional(A) {
  const txt = (v) => String(v == null ? '' : v).trim();
  const rowHas = (r, ...ks) => (r || []).some(c => ks.some(k => norm(txt(c)).includes(norm(k))));
  const findRow = (...ks) => { for (let i = 0; i < A.length; i++) if (rowHas(A[i], ...ks)) return i; return -1; };
  const d = {}, warnings = [];
  // --- versión del formato: ACTUAL (2026, con LOTE) vs ANTIGUO (H2-P07-PR01-F06, sin LOTE) ---
  const titulo = norm((A[0] || []).join(' ') + ' ' + (A[1] || []).join(' '));
  const todoTxt = norm(A.map(r => (r || []).join(' ')).join(' '));
  const tieneLote = A.some(r => (r || []).some(c => /^lote$/i.test(txt(c))));
  const version = (!tieneLote || /materiales, equipos y consumibles/.test(titulo) || /h2-p07-pr01-f06/.test(todoTxt)) ? 'ANTIGUO' : 'ACTUAL';
  d.formatoVersion = version;
  if (version === 'ANTIGUO') {
    const m = todoTxt.match(/h2-p07-pr01-f06/); d.codigoFormato = m ? 'H2-P07-PR01-F06' : '';
  }
  // --- bloque solicitante: etiquetas y valores con columnas fijas ---
  let i = findRow('NOMBRE Y APELLIDO');
  if (i < 0) i = findRow('NOMBRE'); // antiguo: 'NOMBRE' a secas
  if (i >= 0 && rowHas(A[i], 'DOCUMENTO')) {
    const v = A[i + 1] || [];
    d.nombre = unirCeldas(v, 0, 3); d.documento = limpiaNum(unirCeldas(v, 4, 6)); d.tipoUsuario = unirCeldas(v, 7, 9);
    if (!d.nombre) warnings.push('No se encontró el nombre del solicitante');
  }
  i = findRow('PROGRAMA');
  if (i >= 0 && rowHas(A[i], 'ASIGNATURA')) {
    const v = A[i + 1] || [];
    d.programa = unirCeldas(v, 0, 3); d.asignatura = unirCeldas(v, 4, 6); d.tema = unirCeldas(v, 7, 9);
  }
  i = findRow('SEMESTRE');
  if (i >= 0 && rowHas(A[i], 'GRUPO')) {
    const v = A[i + 1] || [];
    d.semestre = unirCeldas(v, 0, 1); d.grupo = limpiaNum(unirCeldas(v, 2, 3)); d.jornada = unirCeldas(v, 4, 6);
    d.numEstudiantes = limpiaNum(unirCeldas(v, 7, 8)); d.numGrupos = limpiaNum(v[9]);
  }
  i = findRow('FECHA DE SOLICITUD');
  if (i >= 0 && rowHas(A[i], 'FECHA DE UTILIZ')) {
    const v = A[i + 1] || [];
    d.fechaSolicitud = limpiaFecha(v[0] || v[1]); d.fechaUtilizacion = limpiaFecha(v[4] || v[5] || v[3]);
    d.horario = [txt(v[8]), txt(v[9])].filter(Boolean).join(' - ');
    if (!d.fechaUtilizacion) warnings.push('No se identificó la fecha de utilización');
  }
  i = findRow('LABORATORIO A UTILIZAR');
  if (i >= 0) {
    const v = A[i + 1] || [];
    d.laboratorio = unirCeldas(v, 0, 6); d.sede = limpiaNum(unirCeldas(v, 7, 9));
  }
  // consecutivo/hora (formato xlsx nuevo)
  for (const r of A) {
    if (rowHas(r, 'CONSECUTIVO')) {
      d.consecutivo = txt(r[1]) || txt(r[2]) || '';
      const h = r.findIndex(c => /hora/i.test(txt(c)));
      if (h >= 0) d.horaSolicitud = txt(r[h + 1]) || '';
      break;
    }
  }
  // firmas formato actual (ALISTADO POR / MONTADO POR / RECIBIDO POR)
  for (let k = 0; k < A.length; k++) {
    if (rowHas(A[k], 'ALISTADO POR')) {
      const vals = (A[k] || []).map(txt);
      const g = (a, b) => vals.slice(a, b + 1).join(' ').trim();
      const cand = [g(1, 3), g(4, 6), g(7, 9)].filter(t => t && !/^(ALISTADO|MONTADO|RECIBIDO|POR)/i.test(t));
      d.alistadoPor = cand[0] || ''; d.montadoPor = cand[1] || ''; d.recibidoPor = cand[2] || '';
      if (!cand.length) {
        const n = (A[k + 1] || []).map(txt);
        d.alistadoPor = unirCeldas(n, 0, 2); d.montadoPor = unirCeldas(n, 3, 5); d.recibidoPor = unirCeldas(n, 6, 8);
      }
      break;
    }
  }
  // firmas formato antiguo: cabecera ENTREGADO POR / FIRMA... / RECIBIDO POR + filas 'Recibido por:' / 'Alistamiento por:'
  if (!d.alistadoPor && !d.recibidoPor && !d.entregadoPor) {
    for (let k = 0; k < A.length; k++) {
      const row = (A[k] || []).map(txt);
      if (rowHas(A[k], 'ENTREGADO POR') && rowHas(A[k], 'RECIBIDO POR')) {
        const n = (A[k + 1] || []).map(txt);
        d.entregadoPor = unirCeldas(n, 0, 2); d.firmaResponsable = unirCeldas(n, 3, 5); d.recibidoPor = unirCeldas(n, 6, 8);
      }
      if (/^recibido por:?$/i.test(row[0] || '')) d.recibidoPor = d.recibidoPor || unirCeldas(row, 1, 6);
      if (/^alistamiento por:?$/i.test(row[0] || '')) d.alistadoPor = d.alistadoPor || unirCeldas(row, 1, 6);
    }
  }
  // observaciones de recibido (texto real, no boilerplate)
  for (let k = 0; k < A.length; k++) {
    if (rowHas(A[k], 'OBSERVACIONES DE RECIBIDO')) {
      const acc = [];
      for (let j = k + 1; j < Math.min(k + 6, A.length); j++) {
        const t = (A[j] || []).map(txt).filter(Boolean).join(' ');
        if (/MATERIALES|ALISTADO|FIRMA/i.test(t) || /^(Nº|N°)/i.test(t)) break;
        if (t && !esBoilerplate(t)) acc.push(t);
      }
      d.obsRecibido = acc.join(' | ');
      break;
    }
  }
  // --- ítems: cabecera Nº + SOLICITADOS (soporta con/sin LOTE y bloques 2 y 3) ---
  const items = [];
  for (let k = 0; k < A.length; k++) {
    const h = (A[k] || []).map(txt);
    if (!h.some(c => /^(Nº|N°|No\.?)$/i.test(c)) || !h.some(c => /SOLICITAD/i.test(c))) continue;
    const jCod = h.findIndex(c => /CÓDIGO|CODIGO/i.test(c));
    const jLote = h.findIndex(c => /^LOTE$/i.test(c));
    const jNom = h.findIndex(c => /NOMBRE/i.test(c));
    const jSol = h.findIndex(c => /SOLICITAD/i.test(c));
    const jEnt = h.findIndex(c => /ENTREGAD/i.test(c));
    const jRec = h.findIndex(c => /RECIBID/i.test(c));
    for (let j = k + 1; j < A.length; j++) {
      const f = (A[j] || []).map(txt);
      if (!f.some(c => c)) continue;
      if (/ALISTADO|OBSERVACIONES|MATERIALES|FIRMA|RECIBIDO POR/i.test(f.join(' '))) break;
      const tieneNum = /^\d/.test(f[0] || '');
      const nombre = jNom >= 0 ? (jSol > jNom ? unirCeldas(f, jNom, jSol - 1) : (f[jNom] || '')) : unirCeldas(f, 2, 4);
      const codigo = jCod >= 0 ? (f[jCod] || '') : '';
      if (!tieneNum && !nombre && !codigo) continue;
      if (/NOMBRE DEL MATERIAL/i.test(nombre)) continue;
      if (!nombre && !codigo) continue; // fila solo con Nº (plantilla vacía)
      const cant = limpiaNum(jSol >= 0 ? f[jSol] : '');
      if (nombre && cant === '') warnings.push(`“${nombre.slice(0, 40)}” sin cantidad solicitada`);
      items.push({
        codigo, lote: f[jLote] || '',
        nombre, solicitados: cant === '' ? '' : +cant,
        entregados: jEnt >= 0 ? (+limpiaNum(f[jEnt]) || 0) : 0,
        recibidos: jRec >= 0 ? (+limpiaNum(f[jRec]) || 0) : 0
      });
    }
  }
  return { datos: d, items, warnings, version: d.formatoVersion || 'ACTUAL' };
}
let PENDIENTE_IMPORT = null;
function importarFormatoExcel(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const wb = XLSX.read(e.target.result, { type: 'array' });
      const name = wb.SheetNames.find(n => /solicitud/i.test(n)) || wb.SheetNames[0];
      const A = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, defval: '', raw: true });
      const parsed = parseTipoAPosicional(A);
      if (!parsed.items.length && !parsed.datos.nombre) return toast('⚠ No se reconoció el formato en ' + file.name);
      PENDIENTE_IMPORT = { ...parsed, fileName: file.name };
      mostrarVistaPreviaImportacion();
    } catch (err) { toast('Error importando formato: ' + err.message); }
  };
  reader.readAsArrayBuffer(file);
}
function mostrarVistaPreviaImportacion() {
  const P = PENDIENTE_IMPORT; if (!P) return;
  const d = P.datos || {};
  const campo = (label, valor, ok) => `
    <div class="rounded-xl border px-3 py-2 ${ok ? 'border-emerald-200 bg-emerald-50/60' : 'border-amber-200 bg-amber-50/60'}">
      <p class="text-[10px] font-black uppercase tracking-wide text-slate-400">${label}</p>
      <p class="text-sm font-bold text-slate-800">${valor ? escapeHtml(String(valor)) : '<span class="text-amber-600">— no identificado</span>'}</p>
    </div>`;
  const filas = P.items.map((it, idx) => {
    const m = matchItemKardex(it) || {};
    const pill = !m.estado ? '' : m.estado === 'ok'
      ? `<span class="badge b-ENTREGADO">${escapeHtml(m.texto)}</span>`
      : m.estado === 'parcial' ? `<span class="badge b-ALISTADO">${escapeHtml(m.texto)}</span>`
      : `<span class="badge b-FALTANTES">${escapeHtml(m.texto)}</span>`;
    return `<tr class="border-b border-slate-100">
      <td class="px-2 py-1.5 text-center text-slate-400">${idx + 1}</td>
      <td class="px-2 py-1.5 font-mono text-xs">${escapeHtml(it.codigo || '—')}</td>
      <td class="px-2 py-1.5">${escapeHtml(it.nombre || '')}</td>
      <td class="px-2 py-1.5 text-center"><input type="number" min="0" step="any" value="${it.solicitados === '' ? '' : it.solicitados}" data-prev-cant="${idx}" class="w-20 rounded-lg border border-slate-200 px-2 py-1 text-center text-sm font-bold"></td>
      <td class="px-2 py-1.5">${pill}</td></tr>`;
  }).join('');
  $('#importPreviewBody').innerHTML = `
    <p class="text-xs text-slate-500">Archivo: <b>${escapeHtml(P.fileName)}</b>
      <span class="badge ${P.version === 'ANTIGUO' ? 'b-ALISTADO' : 'b-ENTREGADO'} ml-2">${P.version === 'ANTIGUO' ? 'Formato antiguo (H2-P07-PR01-F06, sin LOTE)' : 'Formato 2026 actual (con LOTE)'}</span></p>
    <p class="mt-1 text-xs text-slate-500">Revisa lo identificado antes de crear el borrador. La columna <b>En Kardex</b> compara cada ítem con el inventario.</p>
    ${matchBoxHTML(d)}
    ${P.warnings.length ? `<div class="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">⚠ ${P.warnings.length} aviso(s):<ul class="ml-4 list-disc">${P.warnings.slice(0, 6).map(w => `<li>${escapeHtml(w)}</li>`).join('')}</ul></div>` : ''}
    <p class="mb-2 mt-4 text-xs font-black uppercase tracking-widest text-[#6F9F35]">Quién y para qué</p>
    <div class="grid gap-2 sm:grid-cols-3">
      ${campo('Solicitante', d.nombre, !!d.nombre)}${campo('Documento', d.documento, !!d.documento)}${campo('Tipo usuario', d.tipoUsuario, !!d.tipoUsuario)}
      ${campo('Programa', d.programa, !!d.programa)}${campo('Asignatura', d.asignatura, !!d.asignatura)}${campo('Tema', d.tema, !!d.tema)}
      ${campo('Semestre / Grupo', [d.semestre, d.grupo].filter(Boolean).join(' · '), !!(d.semestre || d.grupo))}${campo('Jornada', d.jornada, !!d.jornada)}${campo('Estudiantes', [d.numEstudiantes, d.numGrupos].filter(Boolean).join(' · '), !!(d.numEstudiantes || d.numGrupos))}
    </div>
    <p class="mb-2 mt-4 text-xs font-black uppercase tracking-widest text-[#6F9F35]">Cuándo y dónde</p>
    <div class="grid gap-2 sm:grid-cols-3">
      ${campo('Fecha solicitud', d.fechaSolicitud, !!d.fechaSolicitud)}${campo('Fecha de uso', d.fechaUtilizacion, !!d.fechaUtilizacion)}${campo('Horario', d.horario, !!d.horario)}
      ${campo('Laboratorio', d.laboratorio, !!d.laboratorio)}${campo('Sede', d.sede, !!d.sede)}${campo('Firmas', [d.alistadoPor, d.montadoPor, d.recibidoPor].filter(Boolean).join(' · '), !!(d.alistadoPor || d.montadoPor || d.recibidoPor))}
    </div>
    <p class="mb-2 mt-4 text-xs font-black uppercase tracking-widest text-[#6F9F35]">Materiales (${P.items.length}) — ajusta cantidades si hace falta</p>
    <div class="table-scroll overflow-auto rounded-xl border border-slate-200" style="max-height:38vh"><table class="w-full min-w-[640px] text-left text-xs">
      <thead><tr class="bg-[#0f3d5e] text-white"><th class="px-2 py-2">#</th><th class="px-2 py-2">Código</th><th class="px-2 py-2">Insumo</th><th class="px-2 py-2">Cant.</th><th class="px-2 py-2">En Kardex</th></tr></thead>
      <tbody>${filas}</tbody></table></div>`;
  $$('#importPreviewBody [data-prev-cant]').forEach(inp => {
    inp.addEventListener('input', () => {
      const v = inp.value === '' ? '' : +inp.value;
      PENDIENTE_IMPORT.items[+inp.dataset.prevCant].solicitados = v;
    });
  });
  const m = $('#importPreviewModal'); m.classList.remove('hidden'); m.classList.add('flex');
}
/* Caja de reserva coincidente en la vista previa: pegar materiales a reserva existente. */
function matchBoxHTML(d) {
  let matches = [];
  try { if (typeof buscarPracticasCoincidentes === 'function') matches = buscarPracticasCoincidentes(d); } catch (e) {}
  if (!matches.length) {
    if (d.nombre || d.fechaUtilizacion) {
      return `<p class="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">Sin reservas coincidentes en el tablero (misma fecha de uso + docente). Se creará la solicitud y podrás vincularla después en Montaje.</p>`;
    }
    return '';
  }
  const opts = matches.map(({ p, why }, ix) => {
    const n = (p.insumos || '').split('\n').filter(x => x.trim()).length;
    return `<option value="${p.id}" ${ix === 0 ? 'selected' : ''}>${escapeHtml((p.fecha || '') + ' · ' + (p.docente || '') + ' · ' + (p.laboratorio || ''))} (coincide: ${why.join('+')} · ${n} mat.)</option>`;
  }).join('');
  return `<div class="mt-3 rounded-2xl border border-[#6F9F35]/40 bg-[#F0F7E8] p-3">
    <p class="text-xs font-black uppercase tracking-widest text-[#476B14]">🔗 Reserva existente encontrada</p>
    <p class="mt-1 text-xs text-slate-600">Este formato coincide con una reserva del tablero. Elige si le pegas los materiales o creas la solicitud por aparte.</p>
    <div class="mt-2 flex flex-col gap-2">
      <select id="prevPracticaSel" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
        <option value="">— Solo crear la solicitud (sin pegar) —</option>${opts}
      </select>
      <div class="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
        <label class="flex items-center gap-1.5"><input type="radio" name="prevModo" value="agregar" checked class="h-4 w-4"> Agregar al final</label>
        <label class="flex items-center gap-1.5"><input type="radio" name="prevModo" value="reemplazar" class="h-4 w-4"> Reemplazar materiales</label>
        <label class="flex items-center gap-1.5"><input id="prevVincular" type="checkbox" checked class="h-4 w-4"> Vincular solicitud ↔ reserva</label>
      </div>
    </div>
  </div>`;
}
function confirmarVistaPrevia() {
  const P = PENDIENTE_IMPORT; if (!P) return;
  const items = P.items.filter(it => it.nombre || it.codigo);
  const consec = P.datos.consecutivo || ('SOL-' + new Date().getFullYear() + '-' + String(SOLS.length + 1).padStart(3, '0'));
  const s = { id: uid(), consecutivo: consec, estado: 'BORRADOR', creado: new Date().toISOString(), actualizado: new Date().toISOString(), origen: P.fileName, version: P.version || 'ACTUAL', datos: P.datos, items };
  let attachMsg = '';
  try {
    const sel = $('#prevPracticaSel');
    if (sel && sel.value && typeof getPracticas === 'function') {
      const practicas = getPracticas();
      const p = practicas.find(x => x.id === sel.value);
      if (p) {
        const modo = ((document.querySelector('input[name="prevModo"]:checked') || {}).value) || 'agregar';
        const nuevas = textoDesdeItems(items).split('\n').map(x => x.trim()).filter(Boolean);
        const actuales = (p.insumos || '').split('\n').map(x => x.trim()).filter(Boolean);
        p.insumos = (modo === 'reemplazar' ? nuevas : actuales.concat(nuevas.filter(n => !actuales.includes(n)))).join('\n');
        p.notas = ((p.notas || '') + ' · Materiales de ' + P.fileName).replace(/^ · /, '');
        const vinc = $('#prevVincular');
        if (!vinc || vinc.checked) {
          p.solicitudId = s.id; s.practicaId = p.id;
          const t = TAB2SOL[p.estado];
          if (t) { s.estado = t; s.actualizado = new Date().toISOString(); }
        }
        setPracticas(practicas);
        try { sendSync({ type: 'reload' }); } catch (e) {}
        attachMsg = ` · materiales ${modo === 'reemplazar' ? 'reemplazados en' : 'agregados a'} la reserva del ${p.fecha || ''}`;
      }
    }
  } catch (e) { console.warn(e); }
  SOLS.unshift(s); guardarSols();
  PENDIENTE_IMPORT = null;
  $('#importPreviewModal').classList.add('hidden'); $('#importPreviewModal').classList.remove('flex');
  editarSolicitud(s.id);
  toast(`📥 Solicitud creada con ${items.length} ítems${attachMsg}`);
}
function initImportPreview() {
  const c = $('#cancelImportPreview'); if (c) c.onclick = () => { PENDIENTE_IMPORT = null; $('#importPreviewModal').classList.add('hidden'); $('#importPreviewModal').classList.remove('flex'); };
  const x = $('#closeImportPreview'); if (x) x.onclick = () => { PENDIENTE_IMPORT = null; $('#importPreviewModal').classList.add('hidden'); $('#importPreviewModal').classList.remove('flex'); };
  const ok = $('#confirmImportPreview'); if (ok) ok.onclick = confirmarVistaPrevia;
}
