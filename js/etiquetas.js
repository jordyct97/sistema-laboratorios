/* etiquetas.js — QR + Code128 para rótulos de insumos */
function generarEtiqueta(codigo, nombre){
  switchTab('etiquetas');
  $('#etiqCodigo').value = codigo||'';
  $('#etiqNombre').value = nombre||'';
  renderEtiqueta();
}
function renderEtiqueta(){
  const cod = $('#etiqCodigo').value.trim()||'SIN-CODIGO';
  const nom = $('#etiqNombre').value.trim()||'Insumo';
  const n = Math.max(1, Math.min(24, +$('#etiqCant').value||1));
  const box = $('#etiqPreview'); box.innerHTML='';
  for(let i=0;i<n;i++){
    const div = document.createElement('div'); div.className='etiqueta';
    div.innerHTML = `<p class="text-[11px] font-extrabold leading-tight">${nom}</p>
      <canvas class="qr"></canvas>
      <svg class="bc"></svg>
      <p class="font-mono text-xs font-bold">${cod}</p>`;
    box.appendChild(div);
    try{ new QRCode(div.querySelector('.qr'), {text:cod, width:110, height:110}); }catch(e){}
    try{ JsBarcode(div.querySelector('.bc'), cod, {format:'CODE128', width:1.4, height:42, fontSize:10, margin:2}); }catch(e){}
  }
}
function initEtiquetas(){
  ['etiqCodigo','etiqNombre','etiqCant'].forEach(id=>$('#'+id).addEventListener('input', renderEtiqueta));
  $('#etiqPrint').onclick=()=>window.print();
  $('#etiqFromScan').onclick=()=>abrirScanner((hit,code)=>{ $('#etiqCodigo').value=hit.codigo||code; $('#etiqNombre').value=hit.nombre||''; renderEtiqueta(); }, 'Escanear para etiqueta');
}
