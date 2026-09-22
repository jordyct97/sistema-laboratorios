/* catalogo.js — carga data/catalogo_plano.json + kardex LS */
let CATALOGO = [];
let LS_MAP = {};
let KARDEX_LS = [];
async function cargarCatalogo(){
  try{
    if(window.CATALOGO_PLANO_DATA){ CATALOGO = window.CATALOGO_PLANO_DATA; }
    else { const r = await fetch('data/catalogo_plano.json'); CATALOGO = await r.json(); }
  }catch(e){ CATALOGO = window.CATALOGO_PLANO_DATA || []; }
  try{
    const full = window.CATALOGO_FULL_DATA || await (await fetch('data/catalogo.json')).json();
    KARDEX_LS = full.kardex_ls||[];
    KARDEX_LS.forEach(x=>{ LS_MAP[norm(x.nombre)] = x.codigo; LS_MAP[(x.codigo||'').toLowerCase()] = x.codigo; });
    window.__STOCK_INICIAL__ = full.kardex_stock_inicial || {};
  }catch(e){}
  // índice por código también
  CATALOGO.forEach(it=>{
    const c=(it.codigo||'').toLowerCase();
    if(c) LS_MAP[c]=it.codigo;
  });
  return CATALOGO;
}
function buscarCatalogo(q, limite=12){
  q = norm(q.trim()); if(!q) return [];
  const scored = [];
  for(const it of CATALOGO){
    const n = norm(it.nombre), c = norm(it.codigo||'');
    let score = -1;
    if(c && c===q) score=100;
    else if(n.startsWith(q)) score=80;
    else if(c && c.startsWith(q)) score=75;
    else if(n.includes(q)) score=50;
    else if(c && c.includes(q)) score=45;
    if(score>0) scored.push([score,it]);
  }
  return scored.sort((a,b)=>b[0]-a[0]).slice(0,limite).map(x=>x[1]);
}
function resolverPorCodigo(codigo){
  if(!codigo) return null;
  const q = norm(codigo.trim());
  // 1. match exacto código
  let hit = CATALOGO.find(it=>norm(it.codigo||'')===q);
  if(hit) return hit;
  // 2. LS map
  if(LS_MAP[q]){ const cod=LS_MAP[q]; hit = CATALOGO.find(it=>(it.codigo||'').toLowerCase()===cod.toLowerCase()); if(hit) return hit; return {nombre:'(Kardex '+cod+')', codigo:cod, categoria:'Kardex'}; }
  // 3. contiene
  hit = CATALOGO.find(it=>norm(it.nombre)===q);
  return hit||null;
}
