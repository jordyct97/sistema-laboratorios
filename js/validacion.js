/* validacion.js — Consumos y validación semestral (como el Kardex publicado).
   Fuente: CONS_BASE (histórico del ACTUALIZADO) + MOVS_LOCAL (salidas de la app). */
let CH = {};
function consUnificados() {
  const arr = (CONS_BASE || []).map(c => ({
    fecha: (c.fecha || '').slice(0, 10), codigo: c.codigo || '', nombre: c.nombre || '',
    presentacion: c.presentacion || '', lote: c.lote || '', cantidad: +c.cantidad || 0,
    centroCosto: c.centroCosto || '', obs: c.obs || '', sede: c.sede || '', fuente: 'kardex'
  }));
  (MOVS_LOCAL || []).filter(m => m.tipo === 'SALIDA').forEach(m => arr.push({
    fecha: (m.fecha || '').slice(0, 10), codigo: m.codigo || '', nombre: m.nombre || '', presentacion: '',
    lote: m.lote || '', cantidad: +m.cant || 0, centroCosto: m.centroCosto || '',
    obs: m.detalle || '', sede: '', fuente: 'app', solId: m.solId || null
  }));
  return arr;
}
function periodoActual() {
  const s = ($('#semesterSelect') || {}).value || '2026-2';
  if (s === 'custom') return { desde: $('#consFrom').value || '2000-01-01', hasta: $('#consTo').value || '2100-12-31', label: 'Personalizado' };
  if (s === '2026-1') return { desde: '2026-01-01', hasta: '2026-06-30', label: '2026-1 (Ene–Jun)' };
  if (s === '2026') return { desde: '2026-01-01', hasta: '2026-12-31', label: '2026 completo' };
  if (s === 'all') return { desde: '2000-01-01', hasta: '2100-12-31', label: 'Todo el histórico' };
  return { desde: '2026-07-01', hasta: '2026-12-31', label: '2026-2 (Jul–Dic)' };
}
function validarConsumo(c, acumulado) {
  const alerts = [];
  if (!c.fecha || isNaN(new Date(c.fecha))) alerts.push(['error', `Fecha inválida (${c.fecha || 'vacía'}) · ${c.nombre}`]);
  if (!(+c.cantidad > 0)) alerts.push(['error', `Cantidad inválida (${c.cantidad}) · ${c.nombre} · ${c.fecha}`]);
  if (!c.centroCosto) alerts.push(['aviso', `Sin centro de costo · ${c.nombre} · ${c.fecha}`]);
  if (c.lote) {
    const existe = (LOTES_BASE || []).some(l => l.lote === c.lote && (!c.codigo || l.codigo === c.codigo));
    if (!existe) alerts.push(['aviso', `Lote ${c.lote} no existe en KARDEX · ${c.nombre}`]);
  } else {
    alerts.push(['aviso', `Sin lote · ${c.codigo} ${c.nombre} · ${c.fecha}`]);
  }
  if (acumulado != null && acumulado.excede) alerts.push(['error', `Acumulado (${acumulado.total}) supera stock base (${acumulado.base}) · ${c.nombre}${c.lote ? ' · Lote ' + c.lote : ''}`]);
  return alerts;
}
function renderValidacion() {
  if (!$('#consTableBody')) return;
  const per = periodoActual();
  const todos = consUnificados().filter(c => c.fecha >= per.desde && c.fecha <= per.hasta && (+c.cantidad > 0 || true));
  // acumulado por codigo|lote vs base
  const basePorClave = {};
  (LOTES_BASE || []).forEach(l => {
    const k = (l.codigo || '') + '|' + (l.lote || '');
    basePorClave[k] = (basePorClave[k] || 0) + (+l.cantidad || 0);
  });
  const acum = {};
  const validados = todos.map(c => {
    const k = (c.codigo || '') + '|' + (c.lote || '');
    acum[k] = (acum[k] || 0) + (+c.cantidad || 0);
    const base = basePorClave[k];
    const excede = base != null && acum[k] > base;
    return { c, alerts: validarConsumo(c, base != null ? { total: acum[k], base, excede } : null) };
  });
  const nAlert = validados.reduce((a, v) => a + v.alerts.length, 0);
  const set = (id, v) => { const el = document.querySelector(id); if (el) el.textContent = v; };
  set('#consKpiRecords', validados.length.toLocaleString('es-CO'));
  set('#consKpiUnits', validados.reduce((a, v) => a + (+v.c.cantidad || 0), 0).toLocaleString('es-CO'));
  set('#consKpiItems', new Set(validados.map(v => v.c.codigo + '|' + v.c.nombre)).size);
  set('#consKpiAlerts', nAlert);
  const badge = $('#validationBadge');
  if (badge) {
    badge.textContent = !validados.length ? 'Sin datos' : nAlert ? nAlert + ' alertas' : 'Validado OK';
    badge.className = 'status-pill ' + (!validados.length ? 'bg-slate-100 text-slate-500' : nAlert ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200');
  }
  const vl = $('#validationList');
  if (vl) {
    const flat = validados.flatMap(v => v.alerts.map(a => ({ ...v, nivel: a[0], texto: a[1] }))).slice(0, 60);
    vl.innerHTML = flat.map(a => `<li class="rounded-xl px-3 py-2 text-xs font-semibold ${a.nivel === 'error' ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'}">${a.nivel === 'error' ? '⛔' : '⚠'} ${a.texto}</li>`).join('');
    $('#validationOkMessage').classList.toggle('hidden', !(validados.length && !nAlert));
  }
  // resumen por insumo
  const agg = {};
  validados.forEach(({ c }) => {
    const k = c.codigo + '|' + c.nombre;
    agg[k] = agg[k] || { codigo: c.codigo, nombre: c.nombre, presentacion: c.presentacion, consumido: 0, registros: 0 };
    agg[k].consumido += +c.cantidad || 0; agg[k].registros++;
  });
  const stockPorCod = {};
  todosLotes().forEach(l => {
    stockPorCod[l.codigo] = stockPorCod[l.codigo] || { inicial: 0, actual: 0 };
    stockPorCod[l.codigo].inicial += +l.cantidad || 0; stockPorCod[l.codigo].actual += +l.stock || 0;
  });
  const rows = Object.values(agg).sort((a, b) => b.consumido - a.consumido);
  const ab = $('#aggTableBody');
  if (ab) {
    ab.innerHTML = rows.map(r => {
      const st = stockPorCod[r.codigo] || { inicial: 0, actual: 0 };
      const pct = st.inicial ? Math.round(r.consumido / st.inicial * 100) : 0;
      return `<tr class="border-b border-slate-100"><td class="px-3 py-1.5">${r.nombre}<span class="block text-[10px] text-slate-400">${r.presentacion || ''}</span></td>
        <td class="px-3 py-1.5 font-mono">${r.codigo}</td><td class="px-3 py-1.5 text-center font-bold">${r.consumido}</td>
        <td class="px-3 py-1.5 text-center">${r.registros}</td><td class="px-3 py-1.5 text-center">${st.inicial}</td>
        <td class="px-3 py-1.5 text-center font-extrabold">${st.actual}</td><td class="px-3 py-1.5 text-center">${pct}%</td></tr>`;
    }).join('');
    $('#aggEmptyState').classList.toggle('hidden', rows.length > 0);
  }
  // detalle
  const det = validados.slice().sort((a, b) => (b.c.fecha || '').localeCompare(a.c.fecha || '')).slice(0, 300);
  const cb = $('#consTableBody');
  if (cb) {
    cb.innerHTML = det.map(({ c, alerts }) => `<tr class="border-b border-slate-50"><td class="px-3 py-1.5 whitespace-nowrap">${c.fecha}</td>
      <td class="px-3 py-1.5">${c.nombre}</td><td class="px-3 py-1.5 font-mono text-xs">${c.codigo}</td>
      <td class="px-3 py-1.5 font-mono text-xs">${c.lote || '—'}</td><td class="px-3 py-1.5 text-center font-bold">${c.cantidad}</td>
      <td class="px-3 py-1.5 text-xs">${c.centroCosto || '<span class="text-amber-600">—</span>'}</td>
      <td class="px-3 py-1.5 text-xs text-slate-500">${c.obs || ''}${c.fuente === 'app' ? ' <span class="badge b-MONTADO">app</span>' : ''}</td>
      <td class="px-3 py-1.5">${alerts.length ? `<span class="badge b-FALTANTES">${alerts.length} alerta(s)</span>` : '<span class="badge b-ENTREGADO">OK</span>'}</td></tr>`).join('');
    $('#consEmptyState').classList.toggle('hidden', det.length > 0);
  }
  renderCharts(validados.map(v => v.c), per);
  const eb = $('#exportReportButton'); if (eb) eb.disabled = !validados.length;
}
function renderCharts(items, per) {
  if (typeof Chart === 'undefined') {
    document.querySelectorAll('.chart-fallback').forEach(e => e.classList.remove('hidden'));
    return;
  }
  Object.values(CH).forEach(ch => { try { ch.destroy(); } catch (e) {} }); CH = {};
  // mensual
  const byM = {};
  items.forEach(c => { const m = (c.fecha || '').slice(0, 7); if (m) byM[m] = (byM[m] || 0) + (+c.cantidad || 0); });
  const meses = Object.keys(byM).sort();
  CH.m = new Chart($('#chartMonthly'), { type: 'bar', data: { labels: meses, datasets: [{ data: meses.map(m => byM[m]), backgroundColor: '#6F9F35' }] }, options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } } });
  // top 10
  const byI = {};
  items.forEach(c => { const k = c.nombre || c.codigo; byI[k] = (byI[k] || 0) + (+c.cantidad || 0); });
  const top = Object.entries(byI).sort((a, b) => b[1] - a[1]).slice(0, 10);
  CH.t = new Chart($('#chartTopItems'), { type: 'bar', data: { labels: top.map(t => t[0].slice(0, 28)), datasets: [{ data: top.map(t => t[1]), backgroundColor: '#0f3d5e' }] }, options: { indexAxis: 'y', plugins: { legend: { display: false } } } });
  // centros
  const byC = {};
  items.forEach(c => { const k = c.centroCosto || 'Sin centro'; byC[k] = (byC[k] || 0) + (+c.cantidad || 0); });
  const cc = Object.entries(byC).sort((a, b) => b[1] - a[1]).slice(0, 8);
  CH.c = new Chart($('#chartCostCenters'), { type: 'doughnut', data: { labels: cc.map(x => x[0].slice(0, 30)), datasets: [{ data: cc.map(x => x[1]), backgroundColor: ['#6F9F35', '#0f3d5e', '#E69324', '#2F6FED', '#C20064', '#0E7490', '#92400e', '#64748b'] }] }, options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } } } });
}
function exportarReportePeriodo() {
  const per = periodoActual();
  const todos = consUnificados().filter(c => c.fecha >= per.desde && c.fecha <= per.hasta);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(
    [['Periodo', per.label, per.desde, per.hasta], [],
     ['FECHA', 'CODIGO', 'INSUMO', 'PRESENTACIÓN', 'LOTE', 'CANTIDAD', 'CENTRO DE COSTO', 'OBSERVACIÓN', 'SEDE', 'FUENTE']]
      .concat(todos.map(c => [c.fecha, c.codigo, c.nombre, c.presentacion, c.lote, c.cantidad, c.centroCosto, c.obs, c.sede, c.fuente]))
  ), 'Detalle');
  XLSX.writeFile(wb, `Reporte_consumos_${per.desde}_${per.hasta}.xlsx`);
  toast('⬇ Reporte del periodo generado');
}
function initValidacion() {
  const ss = $('#semesterSelect');
  if (ss) {
    ss.innerHTML = `<option value="2026-2">2026-2 (Jul–Dic)</option><option value="2026-1">2026-1 (Ene–Jun)</option><option value="2026">2026 completo</option><option value="all">Todo el histórico</option><option value="custom">Personalizado…</option>`;
    ss.onchange = () => { $('#customRangeWrap').classList.toggle('hidden', ss.value !== 'custom'); $('#customRangeWrap').classList.toggle('sm:flex', ss.value === 'custom'); renderValidacion(); };
  }
  ['consFrom', 'consTo'].forEach(id => { const el = document.getElementById(id); if (el) el.onchange = renderValidacion; });
  const eb = $('#exportReportButton'); if (eb) eb.onclick = exportarReportePeriodo;
  const ti = $('#tabInv'), tc = $('#tabCons');
  if (ti) ti.onclick = () => { $('#invPanel').classList.remove('hidden'); $('#consPanel').classList.add('hidden'); ti.classList.add('tab-btn-active'); tc.classList.remove('tab-btn-active'); };
  if (tc) tc.onclick = () => { $('#consPanel').classList.remove('hidden'); $('#invPanel').classList.add('hidden'); tc.classList.add('tab-btn-active'); ti.classList.remove('tab-btn-active'); renderValidacion(); };
}
