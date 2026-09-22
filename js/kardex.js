/* kardex.js — inventario POR LOTES (kardex_202650b_ACTUALIZADO) + consumos + QR */
let LOTES_BASE = [];      // data/kardex_lotes.json (o cargado por xlsx)
let CONS_BASE = [];       // data/consumos.json (histórico solo lectura)
let LOTES_LOCAL = loadJSON('smk_lotes_local_v1', []);   // ingresos/nuevos lotes {lid,...}
let MOVS_LOCAL = loadJSON('smk_movs_local_v1', []);     // {id,fecha,codigo,nombre,lote,tipo:'ENTRADA'|'SALIDA',cant,detalle,solId,centroCosto}
let KARDEX_SRC = localStorage.getItem('smk_kardex_src') || 'ACTUALIZADO incluido';

async function cargarKardexBase(){
  // 1) si hay un xlsx cargado por el usuario persistido, usarlo
  const saved = loadJSON('smk_kardex_full_v1', null);
  if(saved && saved.lotes){ LOTES_BASE = saved.lotes; CONS_BASE = saved.cons||[]; KARDEX_SRC = saved.src||'archivo cargado'; return; }
  try{
    if(window.KARDEX_LOTES_DATA && window.CONSUMOS_DATA){
      LOTES_BASE = window.KARDEX_LOTES_DATA; CONS_BASE = window.CONSUMOS_DATA;
    } else {
      const r = await fetch('data/kardex_lotes.json'); LOTES_BASE = await r.json();
      const r2 = await fetch('data/consumos.json'); CONS_BASE = await r2.json();
    }
  }catch(e){
    LOTES_BASE = window.KARDEX_LOTES_DATA || []; CONS_BASE = window.CONSUMOS_DATA || [];
  }
}
// ---- modelo ----
function todosLotes(){
  const arr = LOTES_BASE.map((l,i)=>({...l, lid:'B'+i}));
  LOTES_LOCAL.forEach(l=>arr.push(l));
  // aplicar movimientos locales a la cantidad
  const delta = {};
  MOVS_LOCAL.forEach(m=>{ if(!m.lid) return; delta[m.lid] = (delta[m.lid]||0) + (m.tipo==='ENTRADA'? (+m.cant||0) : -(+m.cant||0)); });
  arr.forEach(l=>{ l.stock = (+l.cantidad||0) + (delta[l.lid]||0); });
  return arr;
}
function diasParaVencer(fechaISO){
  if(!fechaISO) return null;
  const d = new Date(fechaISO+'T00:00:00'); if(isNaN(d)) return null;
  return Math.round((d - new Date(new Date().toISOString().slice(0,10)+'T00:00:00'))/86400000);
}
function estadoLote(l){
  if((+l.stock||0) <= 0) return 'AGOTADO';
  const st = (l.status||'').toUpperCase();
  if(st.includes('VENC')) return 'VENCIDO';
  const dv = diasParaVencer(l.vencimiento);
  if(dv!==null && dv < 0) return 'VENCIDO';
  if(st.includes('REUT') || st.includes('FABRIC')) return st.slice(0,12);
  return 'DISPONIBLE';
}
let KARDEX_SORT = {k:'vencimiento', dir:1};
function lotesFiltrados(){
  const q = norm($('#buscKardex').value||'');
  const sede = $('#fltSede').value||'', status = $('#fltStatus').value||'', sub = $('#fltSub').value||'';
  const dDesde = $('#fltVDesde').value||'', dHasta = $('#fltVHasta').value||'';
  const soloDisp = $('#fltSoloDisp').checked;
  let arr = todosLotes();
  arr = arr.filter(l=>{
    if(sede && (l.sede||'')!==sede) return false;
    if(sub && (l.subgrupo||'').toUpperCase()!==(sub||'').toUpperCase()) return false;
    const est = estadoLote(l);
    if(status==='DISPONIBLE' && est!=='DISPONIBLE') return false;
    else if(status==='VENCIDO' && est!=='VENCIDO') return false;
    else if(status==='AGOTADO' && est!=='AGOTADO') return false;
    else if(status==='POR_VENCER_90'){ const dv=diasParaVencer(l.vencimiento); if(dv===null||dv<0||dv>90||est!=='DISPONIBLE') return false; }
    if(soloDisp && (est!=='DISPONIBLE' || (+l.stock||0)<=0)) return false;
    if(dDesde && (l.vencimiento||'') < dDesde) return false;
    if(dHasta && (l.vencimiento||'') > dHasta) return false;
    if(q && !norm((l.codigo||'')+' '+(l.nombre||'')+' '+(l.lote||'')+' '+(l.proveedor||'')).includes(q)) return false;
    return true;
  });
  // orden FEFO por defecto
  const {k,dir} = KARDEX_SORT;
  arr.sort((a,b)=>{
    if(k==='vencimiento'){ const av=a.vencimiento||'9999', bv=b.vencimiento||'9999'; return av<bv?-dir:av>bv?dir:0; }
    if(k==='stock'){ return ((+a.stock||0)-(+b.stock||0))*dir; }
    const av=(a[k]||'').toString(), bv=(b[k]||'').toString(); return av.localeCompare(bv)*dir;
  });
  return arr;
}
function renderKardex(){
  if(!LOTES_BASE.length && !LOTES_LOCAL.length){ $('#kardexBody').innerHTML='<tr><td colspan="12" class="px-4 py-8 text-center text-sm text-slate-400">Cargando Kardex…</td></tr>'; return; }
  const arr = lotesFiltrados();
  const tb = $('#kardexBody'); tb.innerHTML='';
  let uniDisp=0, nVenc=0, nXvencer=0, nAgot=0;
  todosLotes().forEach(l=>{ const e=estadoLote(l); if(e==='DISPONIBLE') uniDisp+=(+l.stock||0); if(e==='VENCIDO') nVenc++; if(e==='AGOTADO') nAgot++;
    const dv=diasParaVencer(l.vencimiento); if(e==='DISPONIBLE'&&dv!==null&&dv>=0&&dv<=90) nXvencer++; });
  const set=(id,v)=>{document.querySelectorAll(id).forEach(el=>{el.textContent=v;});};
  set('#kpiKardexRef', todosLotes().length);
  set('#kpiKardexStock', uniDisp.toLocaleString('es-CO'));
  set('#kpiKardexVenc', nVenc);
  set('#kpiKardexBajo', nXvencer); set('#kpiKardexAgot', nAgot);
  set('#kpiKardexMov', MOVS_LOCAL.length + CONS_BASE.length);
  set('#kpiKardexVinc', MOVS_LOCAL.filter(m=>m.solId).length);
  set('#kardexCount', arr.length + ' registros' + (arr.length>500?' (primeros 500)':''));
  set('#kardexSrc', 'Fuente: ' + KARDEX_SRC + ' · ' + todosLotes().length + ' lotes');
  arr.slice(0,500).forEach(l=>{
    const est = estadoLote(l); const dv = diasParaVencer(l.vencimiento);
    const pill = est==='DISPONIBLE' ? (dv!==null&&dv<=90?'<span class="badge b-ALISTADO">POR VENCER '+dv+'d</span>':'<span class="badge b-ENTREGADO">DISPONIBLE</span>')
      : est==='VENCIDO' ? '<span class="badge b-FALTANTES">VENCIDO</span>'
      : est==='AGOTADO' ? '<span class="badge b-BORRADOR">AGOTADO</span>' : '<span class="badge b-MONTADO">'+est+'</span>';
    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-100 hover:bg-slate-50/60';
    tr.innerHTML = `<td class="px-2 py-1.5 font-mono font-bold">${l.codigo||''}</td>
      <td class="px-2 py-1.5 min-w-[200px]">${l.nombre||''}<span class="block text-[10px] text-slate-400">${l.presentacion||''} · ${l.proveedor||''}</span></td>
      <td class="px-2 py-1.5 font-mono text-xs">${l.lote||'—'}</td>
      <td class="px-2 py-1.5 text-center font-extrabold">${l.stock}</td>
      <td class="px-2 py-1.5 text-xs whitespace-nowrap">${l.vencimiento||'—'}</td>
      <td class="px-2 py-1.5 text-xs">${l.ubicacion||''}<span class="block text-[10px] text-slate-400">Sede ${l.sede||''}</span></td>
      <td class="px-2 py-1.5 text-center">${pill}</td>
      <td class="px-2 py-1.5 text-center whitespace-nowrap">
        <button class="rounded-lg bg-rose-50 px-2 py-1 font-bold" data-c="1" title="Consumir de este lote">−</button>
        <button class="rounded-lg bg-emerald-50 px-2 py-1 font-bold" data-e="1" title="Ingresar a este lote">＋</button>
        <button class="rounded-lg bg-slate-100 px-2 py-1" data-qr="1" title="Etiqueta QR">QR</button>
      </td>`;
    tr.querySelector('[data-c]').onclick=()=>abrirConsumoLote(l.lid);
    tr.querySelector('[data-e]').onclick=()=>abrirIngresoLote(l.lid);
    tr.querySelector('[data-qr]').onclick=()=>generarEtiqueta((l.codigo||'')+'|'+(l.lote||''), (l.nombre||'')+' · Lote '+(l.lote||''));
    tb.appendChild(tr);
  });
  // combos sede/subgrupo (una vez)
  const sedes=[...new Set(todosLotes().map(l=>l.sede||'').filter(Boolean))].sort();
  const subs=[...new Set(todosLotes().map(l=>(l.subgrupo||'').toUpperCase()).filter(Boolean))].sort();
  const fs=$('#fltSede'), fu=$('#fltSub');
  if(fs && fs.options.length<=1) sedes.forEach(s=>{const o=document.createElement('option');o.value=s;o.textContent='Sede '+s;fs.appendChild(o);});
  if(fu && fu.options.length<=1) subs.forEach(s=>{const o=document.createElement('option');o.value=s;o.textContent=s;fu.appendChild(o);});
  renderMovs();
}
function renderMovs(){
  const mb = $('#movsBody'); if(!mb) return; mb.innerHTML='';
  const todos = [...MOVS_LOCAL].sort((a,b)=>(b.fecha||'').localeCompare(a.fecha||''));
  todos.slice(0,100).forEach(m=>{
    const tr=document.createElement('tr'); tr.className='border-b border-slate-50';
    tr.innerHTML=`<td class="px-3 py-1.5 text-xs">${(m.fecha||'').slice(0,16).replace('T',' ')}</td>
      <td class="px-3 py-1.5 font-mono text-xs">${m.codigo||''}</td><td class="px-3 py-1.5">${m.nombre||''}<span class="block text-[10px] text-slate-400">Lote ${m.lote||'—'}</span></td>
      <td class="px-3 py-1.5"><span class="badge ${m.tipo==='ENTRADA'?'b-ENTREGADO':'b-FALTANTES'}">${m.tipo}</span></td>
      <td class="px-3 py-1.5 text-center font-bold">${m.cant}</td><td class="px-3 py-1.5 text-xs text-slate-500">${m.detalle||''}${m.solId?' · vinc. solicitud':''}</td>`;
    mb.appendChild(tr);
  });
  // resumen consumos históricos por centro de costo (top 5)
  const byCC={}; CONS_BASE.forEach(c=>{ byCC[c.centroCosto||'—']=(byCC[c.centroCosto||'—']||0)+(+c.cantidad||0); });
  const top=Object.entries(byCC).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>k+': '+v.toLocaleString('es-CO')).join(' · ');
  const el=$('#consHistInfo'); if(el) el.textContent = CONS_BASE.length.toLocaleString('es-CO')+' consumos históricos · Top centros: '+top;
}
// ---- consumir / ingresar por lote ----
let LOTE_ACTIVO = null;
function findLote(lid){ return todosLotes().find(l=>l.lid===lid); }
function abrirConsumoLote(lid){
  const l = findLote(lid); if(!l) return;
  LOTE_ACTIVO = lid;
  $('#consumeTitle').textContent = 'Consumir del lote';
  $('#consumeItemLabel').textContent = (l.codigo||'')+' · '+(l.nombre||'')+' · Lote '+(l.lote||'—');
  $('#availableStock').textContent = l.stock + ' ' + (l.presentacion||'');
  $('#quantityHelp').textContent = 'Vence: '+(l.vencimiento||'—')+' · '+(l.ubicacion||'')+' · Sede '+(l.sede||'');
  $('#consumeQuantity').value=''; $('#consumeCostCenter').value=''; $('#consumeObservation').value='';
  const m=$('#consumeModal'); m.classList.remove('hidden'); m.classList.add('flex');
}
function abrirIngresoLote(lid){
  const l = findLote(lid); if(!l) return;
  LOTE_ACTIVO = lid;
  $('#entryTitle').textContent = 'Ingresar stock al lote';
  $('#entryItemLabel').textContent = (l.codigo||'')+' · '+(l.nombre||'')+' · Lote '+(l.lote||'—');
  $('#entryCurrentStock').textContent = l.stock;
  $('#entryQuantity').value=''; $('#entryFactura').value=''; $('#entryProveedor').value=l.proveedor||''; $('#entryObservacion').value='';
  const m=$('#entryModal'); m.classList.remove('hidden'); m.classList.add('flex');
}
function confirmarConsumoLote(){
  const l = findLote(LOTE_ACTIVO); if(!l) return toast('Sin lote');
  const cant = +$('#consumeQuantity').value||0;
  const cc = $('#consumeCostCenter').value.trim();
  if(cant<=0) return toast('⚠ Cantidad inválida');
  if(!cc) return toast('⚠ Centro de costo obligatorio');
  if(cant > (+l.stock||0)) return toast('⚠ Stock insuficiente en este lote ('+l.stock+')');
  MOVS_LOCAL.unshift({id:uid(), fecha:new Date().toISOString(), codigo:l.codigo, nombre:l.nombre, lote:l.lote, lid:l.lid, tipo:'SALIDA', cant, centroCosto:cc, detalle:cc+' · '+$('#consumeObservation').value.trim(), solId:null});
  saveJSON('smk_movs_local_v1', MOVS_LOCAL);
  $('#consumeModal').classList.add('hidden'); $('#consumeModal').classList.remove('flex');
  renderKardex(); toast('📉 Consumo registrado: '+cant+' · Lote '+(l.lote||''));
}
function confirmarIngresoLote(){
  const l = findLote(LOTE_ACTIVO); if(!l) return toast('Sin lote');
  const cant = +$('#entryQuantity').value||0;
  if(cant<=0) return toast('⚠ Cantidad inválida');
  MOVS_LOCAL.unshift({id:uid(), fecha:new Date().toISOString(), codigo:l.codigo, nombre:l.nombre, lote:l.lote, lid:l.lid, tipo:'ENTRADA', cant, detalle:(('#entryFactura').value.trim()?'FAC '+$('#entryFactura').value.trim()+' · ':'')+($('#entryProveedor').value.trim()||'')+' '+$('#entryObservacion').value.trim()});
  saveJSON('smk_movs_local_v1', MOVS_LOCAL);
  $('#entryModal').classList.add('hidden'); $('#entryModal').classList.remove('flex');
  renderKardex(); toast('📈 Entrada registrada: +'+cant);
}
// ---- descuento FEFO por solicitud ----
function descontarKardexPorSolicitud(s){
  if(MOVS_LOCAL.some(m=>m.solId===s.id)) return;
  if(!(s.items||[]).some(it=>+it.entregados||+it.solicitados)) return;
  const fecha = new Date().toISOString();
  const cc = (s.datos && (s.datos.centroCosto || s.datos.asignatura)) || '';
  (s.items||[]).forEach(it=>{
    let cant = +it.entregados || +it.solicitados || 0;
    if(!cant) return;
    // candidatos FEFO: mismo código (o nombre), disponibles, ordenados por vencimiento
    const cands = todosLotes().filter(l=>l.stock>0 && estadoLote(l)==='DISPONIBLE' &&
      (it.codigo && l.codigo===it.codigo || (!it.codigo && norm(l.nombre)===norm(it.nombre)) ||
       (!it.codigo && norm(l.nombre).includes(norm(it.nombre)) && it.nombre.length>4))).sort((a,b)=>(a.vencimiento||'9999')<(b.vencimiento||'9999')?-1:1);
    if(it.lote){ const ex = todosLotes().find(l=>l.lote===it.lote && l.stock>0); if(ex) cands.unshift(ex); }
    let resto = cant;
    const usados = [];
    for(const l of cands){
      if(resto<=0) break;
      const toma = Math.min(resto, +l.stock||0);
      if(toma<=0) continue;
      MOVS_LOCAL.unshift({id:uid(), fecha, codigo:l.codigo||it.codigo||'', nombre:l.nombre||it.nombre||'', lote:l.lote, lid:l.lid, tipo:'SALIDA', cant:toma, centroCosto:cc, detalle:'Solicitud '+(s.consecutivo||''), solId:s.id});
      usados.push(l.lote+'(−'+toma+')'); resto-=toma;
    }
    if(resto>0){ MOVS_LOCAL.unshift({id:uid(), fecha, codigo:it.codigo||'', nombre:it.nombre||'', lote:it.lote||'', lid:null, tipo:'SALIDA', cant:resto, centroCosto:cc, detalle:'Solicitud '+(s.consecutivo||'')+' (sin lote / stock insuficiente)', solId:s.id}); }
    it._descuento = usados.join(', ')||'sin stock en Kardex';
  });
  saveJSON('smk_movs_local_v1', MOVS_LOCAL);
  renderKardex();
  toast('📉 Kardex descontado (FEFO) por ' + s.consecutivo);
}
// ---- cargar xlsx Kardex ----
function excelSerialToISO(x){
  if(x==null||x==='') return '';
  if(typeof x==='number' && x>20000 && x<60000){ const b=new Date(1899,11,30); return new Date(b.getTime()+x*86400000).toISOString().slice(0,10); }
  const d=new Date(x); if(!isNaN(d)) return d.toISOString().slice(0,10);
  return String(x).trim();
}
function cargarKardexExcel(file){
  const reader = new FileReader();
  reader.onload = (e)=>{
    try{
      const wb = XLSX.read(e.target.result, {type:'array'});
      const ws = wb.Sheets['KARDEX'] || wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, {header:1, defval:''});
      const lotes = [];
      rows.slice(1).forEach(r=>{
        if(!r[0] && !r[1]) return;
        lotes.push({codigo:String(r[0]).trim(), nombre:String(r[1]).trim(), presentacion:String(r[2]).trim(),
          fechaIngreso:excelSerialToISO(r[3]), cantidad:+r[4]||0, lote:String(r[5]).trim(), vencimiento:excelSerialToISO(r[6]),
          ubicacion:String(r[7]).trim(), sede:String(r[8]).trim(), status:String(r[9]).trim(), proveedor:String(r[10]).trim(),
          subgrupo:String(r[11]).trim(), precio:+r[12]||0, registro:String(r[13]).trim(), riesgo:String(r[14]).trim(),
          centroCosto:String(r[15]).trim(), obs:String(r[16]).trim()});
      });
      let cons=[];
      if(wb.Sheets['CONSUMOS']){
        const rc = XLSX.utils.sheet_to_json(wb.Sheets['CONSUMOS'], {header:1, defval:''});
        rc.slice(1).forEach(r=>{ if(!r[1]&&!r[2]) return;
          cons.push({fecha:excelSerialToISO(r[0]), codigo:String(r[1]).trim(), nombre:String(r[2]).trim(), presentacion:String(r[3]).trim(), lote:String(r[4]).trim(), cantidad:+r[5]||0, centroCosto:String(r[6]).trim(), obs:String(r[7]).trim(), sede:String(r[8]).trim(), proveedor:String(r[9]).trim()}); });
      }
      LOTES_BASE = lotes; CONS_BASE = cons; KARDEX_SRC = file.name;
      saveJSON('smk_kardex_full_v1', {lotes, cons, src:file.name});
      renderKardex(); toast('📦 Kardex cargado: '+lotes.length+' lotes · '+cons.length+' consumos');
    }catch(err){ toast('Error leyendo Kardex: '+err.message); }
  };
  reader.readAsArrayBuffer(file);
}
function exportarKardexExcel(){
  const head=['CODIGO INSUMO','CODIGO','PRESENTACIÓN','FECHA INGRESO','CANTIDAD','LOTE','FECHA DE VENCIMIENTO','UBICACIÓN','SEDE','STATUS','PROVEEDOR','SUBGRUPO','PRECIO','REGISTRO SANITARIO','CLASIFICACIÓN DEL RIESGO','CENTRO DE COSTO','OBSERVACION'];
  const data=[head].concat(todosLotes().map(l=>[l.codigo,l.nombre,l.presentacion,l.fechaIngreso,l.stock,l.lote,l.vencimiento,l.ubicacion,l.sede,estadoLote(l),l.proveedor,l.subgrupo,l.precio,l.registro,l.riesgo,l.centroCosto,l.obs||'']));
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(data), 'KARDEX');
  const ch=['FECHA','CODIGO INSUMO','CODIGO','PRESENTACIÓN','LOTE','CANTIDAD CONSUMIDA','CENTRO DE COSTO DE CONSUMO','OBSERVACION','SEDE','PROVEEDOR'];
  const dc=[ch].concat(CONS_BASE.map(c=>[c.fecha,c.codigo,c.nombre,c.presentacion,c.lote,c.cantidad,c.centroCosto,c.obs,c.sede,c.proveedor]))
    .concat(MOVS_LOCAL.filter(m=>m.tipo==='SALIDA').map(m=>[m.fecha.slice(0,10),m.codigo,m.nombre,'',m.lote,m.cant,m.centroCosto||'',m.detalle||'','','']));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dc), 'CONSUMOS');
  XLSX.writeFile(wb,'kardex_ACTUALIZADO_'+hoyISO()+'.xlsx');
}
// ---- escáner hacia kardex ----
function escanearHaciaKardex(){
  abrirScanner((hit, code)=>{
    // hit puede ser {codigo,lote} o catálogo; buscar lote exacto primero
    const todos = todosLotes();
    let found = todos.filter(l=>l.lote===code || l.codigo===code);
    if(!found.length && hit && hit.codigo) found = todos.filter(l=>l.codigo===hit.codigo);
    if(found.length===1){ renderKardex(); abrirConsumoLote(found[0].lid); }
    else if(found.length>1){ $('#buscKardex').value = code; renderKardex(); toast(found.length+' lotes coinciden con “'+code+'”'); switchTab('kardex'); }
    else if(hit){ $('#buscKardex').value = hit.codigo||code; renderKardex(); switchTab('kardex'); }
  }, 'Escanear insumo del Kardex (código o lote)');
}
function resolverLoteOCodigo(code){
  if(typeof todosLotes!=='function') return null;
  const todos = todosLotes();
  let l = todos.find(x=>x.lote===code) || todos.find(x=>x.codigo===code);
  if(l) return {nombre:l.nombre+' · Lote '+(l.lote||''), nombreBase:l.nombre, codigo:l.codigo, categoria:'Kardex', lote:l.lote, lid:l.lid, presentacion:l.presentacion};
  return null;
}
function initKardex(){
  $('#buscKardex').addEventListener('input', renderKardex);
  ['fltSede','fltStatus','fltSub','fltVDesde','fltVHasta'].forEach(id=>{const el=document.getElementById(id); if(el) el.addEventListener('change', renderKardex);});
  const sd=$('#fltSoloDisp'); if(sd) sd.addEventListener('change', renderKardex);
  const cc=$('#clearKardexF'); if(cc) cc.onclick=()=>{ $('#buscKardex').value='';$('#fltSede').value='';$('#fltStatus').value='';$('#fltSub').value='';$('#fltVDesde').value='';$('#fltVHasta').value='';$('#fltSoloDisp').checked=false; renderKardex(); };
  $('#btnScanKardex').onclick=escanearHaciaKardex;
  $('#btnExportKardex').onclick=exportarKardexExcel;
  $('#kardexFile').addEventListener('change', e=>{ if(e.target.files[0]) cargarKardexExcel(e.target.files[0]); });
  const rst=$('#btnResetKardex'); if(rst) rst.onclick=()=>{ localStorage.removeItem('smk_kardex_full_v1'); KARDEX_SRC='ACTUALIZADO incluido'; cargarKardexBase().then(renderKardex); toast('Kardex restablecido al ACTUALIZADO'); };
  // modales consumir/ingresar
  $('#confirmConsume').onclick=confirmarConsumoLote;
  $('#cancelConsume').onclick=()=>{ $('#consumeModal').classList.add('hidden'); $('#consumeModal').classList.remove('flex'); };
  $('#closeModal').onclick=()=>{ $('#consumeModal').classList.add('hidden'); $('#consumeModal').classList.remove('flex'); };
  $('#confirmEntry').onclick=confirmarIngresoLote;
  $('#cancelEntry').onclick=()=>{ $('#entryModal').classList.add('hidden'); $('#entryModal').classList.remove('flex'); };
  $('#closeEntryModal').onclick=()=>{ $('#entryModal').classList.add('hidden'); $('#entryModal').classList.remove('flex'); };
  // movimiento rápido
  const be=$('#btnEntrada'), bs=$('#btnSalida');
  if(be) be.onclick=()=>{
    const code=$('#movCodigo').value.trim(), cant=+$('#movCant').value||0;
    if(!code||cant<=0) return toast('Código y cantidad requeridos');
    const l=todosLotes().find(x=>x.lote===code)||todosLotes().find(x=>x.codigo===code);
    if(!l) return toast('Lote/código no encontrado');
    abrirIngresoLote(l.lid); $('#entryQuantity').value=cant;
  };
  if(bs) bs.onclick=()=>{
    const code=$('#movCodigo').value.trim(), cant=+$('#movCant').value||0;
    if(!code||cant<=0) return toast('Código y cantidad requeridos');
    const l=todosLotes().find(x=>x.lote===code)||todosLotes().find(x=>x.codigo===code);
    if(!l) return toast('Lote/código no encontrado');
    abrirConsumoLote(l.lid); $('#consumeQuantity').value=cant;
  };
}
// compatibilidad con versión anterior
function baseProductos(){ const m=new Map(); todosLotes().forEach(l=>{ if(l.codigo&&!m.has(l.codigo)) m.set(l.codigo,{codigo:l.codigo,nombre:l.nombre,categoria:l.subgrupo||'Insumo'}); }); return [...m.values()]; }
function recalcularStock(){}
