/* app.js — navegación + arranque */
function switchTab(t){
  ['tablero','lista','editor','kardex','etiquetas'].forEach(k=>{
    $('#panel-'+k).classList.toggle('hidden', k!==t);
  });
  [['tab-tablero','tablero'],['tab-lista','lista'],['tab-editor','editor'],['tab-kardex','kardex'],['tab-etiq','etiquetas']].forEach(([b,k])=>{
    $('#'+b).classList.toggle('tab-btn-active', k===t);
  });
  if(t==='lista') renderListaSols();
  if(t==='kardex'){ renderKardex(); try{ renderValidacion(); }catch(e){} }
  if(t==='editor'){ renderLinkBox(); try{ renderPasosMontaje(); }catch(e){} }
}
async function init(){
  $('#yearNow').textContent = new Date().getFullYear();
  await cargarCatalogo();
  await cargarKardexBase();
  $('#catInfo').textContent = CATALOGO.length + ' ítems en catálogo · ' + todosLotes().length + ' lotes Kardex · ' + CONS_BASE.length + ' consumos históricos';
  initScannerUI(); initSolicitudes(); initKardex(); initEtiquetas(); initPuente();
  try{ initValidacion(); }catch(e){ console.warn(e); }
  try{ initImportPreview(); }catch(e){ console.warn(e); }
  try{ Nube.init('app'); }catch(e){ console.warn(e); }
  const nb = $('#nubeBtn'); if(nb) nb.onclick = () => Nube.abrirAjustes();
  const nc = $('#closeNubeModal'); if(nc) nc.onclick = () => Nube.cerrarAjustes();
  const ng = $('#nubeGuardar'); if(ng) ng.onclick = () => Nube.guardarAjustes();
  const nq = $('#nubeQuitar'); if(nq) nq.onclick = () => Nube.quitarAjustes();
  const ns = $('#nubeSubir'); if(ns) ns.onclick = () => Nube.subirTodo();
  $('#tab-tablero').onclick=()=>switchTab('tablero');
  $('#tab-lista').onclick=()=>switchTab('lista');
  $('#tab-editor').onclick=()=>{ if(!SOL_ACTIVA && !ITEM_BORRADOR.length) nuevaSolicitud(); else switchTab('editor'); };
  $('#tab-kardex').onclick=()=>switchTab('kardex');
  $('#tab-etiq').onclick=()=>switchTab('etiquetas');
  $('#goNew').onclick=()=>nuevaSolicitud();
  renderListaSols(); renderKardex(); renderEtiqueta();
  try{
    const n = getPracticas().length;
    const tc = $('#tableroCount'); if(tc) tc.textContent = n ? `· ${n} prácticas en el tablero` : '';
  }catch(e){}
  const tr = $('#tableroReload'); if(tr) tr.onclick = ()=>{ const f=$('#tableroFrame'); if(f) f.contentWindow.location.reload(); };
  const to = $('#tableroOpen'); if(to) to.onclick = ()=>window.open('tablero.html','_blank');
  switchTab(window.__montajeAbierto ? 'editor' : 'tablero');
  toast('📦 Kardex ACTUALIZADO: ' + todosLotes().length + ' lotes listos');
}
document.addEventListener('DOMContentLoaded', init);
