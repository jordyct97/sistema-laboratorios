/* scanner.js — modal reutilizable: cámara ZXing + manual + lector USB (wedge) */
let __zxingReader = null, __zxingActive = false, __scanCallback = null, __lastUsb = {t:0, buf:''};

function abrirScanner(callback, titulo){
  __scanCallback = callback;
  $('#scannerTitle').textContent = titulo || 'Escanear código de barras / QR';
  $('#scannerMatches').innerHTML = '';
  $('#scannerManualInput').value = '';
  $('#scannerStatus').textContent = 'Apunta al código con la cámara o digita el lote/código.';
  $('#scannerStatus').classList.remove('hidden');
  const m = $('#scannerModal'); m.classList.remove('hidden'); m.classList.add('flex');
  iniciarCamara();
}
function cerrarScanner(){
  const m = $('#scannerModal'); m.classList.add('hidden'); m.classList.remove('flex');
  detenerCamara();
  __scanCallback = null;
}
async function iniciarCamara(){
  const video = $('#scannerVideo');
  $('#scannerStatus').textContent = 'Iniciando cámara… (permite el acceso)';
  try{
    // 1) BarcodeDetector nativo (rápido, sin librería)
    if('BarcodeDetector' in window){
      const det = new BarcodeDetector({formats:['qr_code','code_128','code_39','ean_13','ean_8','upc_a','itf','codabar']});
      const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
      video.srcObject = stream; await video.play();
      __zxingActive = true;
      $('#scannerStatus').textContent = 'Cámara activa — acerca el código.';
      const loop = async ()=>{
        if(!document.body.contains(video) || $('#scannerModal').classList.contains('hidden')) return;
        try{
          const codes = await det.detect(video);
          if(codes && codes.length){ onCodigoDetectado(codes[0].rawValue, 'cámara'); return; }
        }catch(e){}
        if(__zxingActive) requestAnimationFrame(()=>setTimeout(loop, 250));
      };
      loop();
      video.dataset.streamMode = 'native';
      return;
    }
    // 2) ZXing fallback
    if(typeof ZXingBrowser !== 'undefined'){
      __zxingReader = new ZXingBrowser.BrowserMultiFormatReader();
      const devices = await ZXingBrowser.BrowserCodeReader.listVideoInputDevices();
      const id = devices.length ? devices[devices.length-1].deviceId : undefined;
      __zxingActive = true;
      $('#scannerStatus').textContent = 'Cámara activa — acerca el código.';
      await __zxingReader.decodeFromVideoDevice(id, video, (res, err)=>{
        if(res && __zxingActive){ onCodigoDetectado(res.getText(), 'cámara'); }
      });
      return;
    }
    $('#scannerStatus').textContent = 'Sin cámara disponible: usa búsqueda manual o lector USB.';
  }catch(e){
    $('#scannerStatus').textContent = 'No se pudo abrir la cámara ('+e.message+'). Usa búsqueda manual o lector USB.';
  }
}
function detenerCamara(){
  __zxingActive = false;
  try{ if(__zxingReader){ __zxingReader.reset(); __zxingReader=null; } }catch(e){}
  const video = $('#scannerVideo');
  try{ if(video.srcObject){ video.srcObject.getTracks().forEach(t=>t.stop()); video.srcObject=null; } }catch(e){}
}
// Lector USB tipo wedge: escribe rápido + Enter. Escucha global.
document.addEventListener('keydown', (e)=>{
  const modalOpen = !$('#scannerModal').classList.contains('hidden');
  // buffer USB siempre (funciona aunque el modal esté cerrado si hay un input con data-scan)
  const now = performance.now();
  if(now - __lastUsb.t > 60) __lastUsb.buf = '';
  __lastUsb.t = now;
  if(e.key === 'Enter' && __lastUsb.buf.length >= 3){
    const code = __lastUsb.buf; __lastUsb.buf='';
    if(modalOpen){ e.preventDefault(); onCodigoDetectado(code, 'lector USB'); }
    else {
      const active = document.activeElement;
      if(active && active.dataset && active.dataset.scan !== undefined){ onCodigoDetectado(code, 'lector USB'); }
    }
    return;
  }
  if(e.key && e.key.length===1 && !e.ctrlKey && !e.metaKey){ __lastUsb.buf += e.key; }
});
function onCodigoDetectado(code, fuente){
  code = (code||'').trim(); if(!code) return;
  $('#scannerStatus').textContent = 'Detectado ('+fuente+'): ' + code;
  const lotHit = (typeof resolverLoteOCodigo==='function') ? resolverLoteOCodigo(code) : null;
  const hit = lotHit || resolverPorCodigo(code);
  const box = $('#scannerMatches');
  if(hit){
    box.innerHTML = `<li class="rounded-xl border border-green-200 bg-green-50 p-3 text-sm">
      <p class="font-extrabold">${hit.nombre}</p>
      <p class="text-xs text-slate-500">Código: <b>${hit.codigo||'—'}</b> · ${hit.categoria||''} ${hit.presentacion?'· '+hit.presentacion:''}</p>
      <button class="btn btn-brand mt-2" id="usarScanBtn">Usar este insumo</button></li>`;
    $('#usarScanBtn').onclick = ()=>{ const cb=__scanCallback; cerrarScanner(); if(cb) cb(hit, code); };
    // si viene de lector USB fuera del modal, usar directo
    if(fuente==='lector USB' && $('#scannerModal').classList.contains('hidden')){
      if(__scanCallback) __scanCallback(hit, code);
      else toast('Escaneado: ' + hit.nombre);
    }
  } else {
    // búsqueda aproximada por texto
    const sug = buscarCatalogo(code, 5);
    box.innerHTML = `<li class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
      <p class="font-bold">Código “${code}” no exacto (${fuente}). Coincidencias:</p>
      ${sug.length? sug.map((s,i)=>`<button data-i="${i}" class="sugBtn mt-1 block w-full rounded-lg bg-white px-2 py-1.5 text-left text-xs font-semibold hover:bg-green-50">${s.nombre} <span class="text-slate-400">${s.codigo||''}</span></button>`).join('') : '<p class="text-xs">Sin coincidencias. Puedes crearlo manual.</p>'}
      <div class="mt-2 flex gap-2"><button id="usarLibreBtn" class="btn btn-dark">Usar código libre “${code}”</button></div></li>`;
    $$('.sugBtn', box).forEach(b=>b.onclick=()=>{ const cb=__scanCallback; const it=sug[+b.dataset.i]; cerrarScanner(); if(cb) cb(it, code); });
    const libre = $('#usarLibreBtn'); if(libre) libre.onclick=()=>{ const cb=__scanCallback; cerrarScanner(); if(cb) cb({nombre:code, codigo:code, categoria:'Libre'}, code); };
  }
}
function initScannerUI(){
  $('#closeScannerModal').onclick = cerrarScanner;
  $('#scannerManualGo').onclick = ()=>{
    const v = $('#scannerManualInput').value.trim();
    if(!v) return toast('Escribe un código o nombre');
    onCodigoDetectado(v, 'manual');
    // si no hubo match exacto, mostrar sugerencias por nombre
    if(!resolverPorCodigo(v)){
      const sug = buscarCatalogo(v, 6);
      const box = $('#scannerMatches');
      if(sug.length && !box.innerHTML){
        box.innerHTML = sug.map((s,i)=>`<li><button data-i="${i}" class="sugBtn block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm hover:border-green-400">${s.nombre}<span class="block text-xs text-slate-400">${s.codigo||''} · ${s.categoria||''}</span></button></li>`).join('');
        $$('.sugBtn',box).forEach(b=>b.onclick=()=>{const cb=__scanCallback;const it=sug[+b.dataset.i];cerrarScanner();if(cb)cb(it,v);});
      }
    }
  };
  $('#scannerManualInput').addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); $('#scannerManualGo').click(); } });
}
