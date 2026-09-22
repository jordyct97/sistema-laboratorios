/* store.js — persistencia local + utilidades */
const LS_KEYS = { SOL: 'smk_solicitudes_v1', KARDEX_MOV: 'smk_kardex_mov_v1', KARDEX_STOCK: 'smk_kardex_stock_v1', KARDEX_EXTRA: 'smk_kardex_extra_v1' };
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const hoyISO = () => new Date().toISOString().slice(0,10);
const ahoraFmt = () => new Date().toLocaleString('es-CO',{dateStyle:'short',timeStyle:'short'});
function toast(msg){ const c=$('#toastContainer'); if(!c) return alert(msg); const d=document.createElement('div'); d.className='toast'; d.textContent=msg; c.appendChild(d); setTimeout(()=>d.remove(),3200); }
function loadJSON(k, fb){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):fb; }catch{ return fb; } }
function saveJSON(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
function norm(s){ return (s||'').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
function faltantes(it){ const s=+it.solicitados||0, e=+it.entregados||0, r=+it.recibidos||0; return Math.max(0, s - e) + Math.max(0, e - r); }
const ESTADOS = ['BORRADOR','ALISTADO','MONTADO','ENTREGADO','RECIBIDO'];
