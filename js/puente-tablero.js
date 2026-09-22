/* puente-tablero.js — se carga DENTRO de tablero.html (iframe).
   1) Avisa a la app principal tras cada guardado (ping).
   2) Ejecuta órdenes de la app principal (ir a fecha, recargar, aplicar estado).
   3) Atiende un "ir a fecha" pendiente dejado antes de cargar. */
(function () {
  if (window.__puenteTablero) return;
  window.__puenteTablero = true;

  function ping() {
    try { localStorage.setItem('smk_practicas_ping', String(Date.now())); } catch (e) {}
  }

  if (typeof window.saveData === 'function') {
    const _save = window.saveData;
    window.saveData = async function () {
      const r = await _save.apply(this, arguments);
      ping();
      return r;
    };
  }

  window.addEventListener('storage', (e) => {
    if (e.key !== 'smk_sync' || !e.newValue) return;
    let msg = null;
    try { msg = JSON.parse(e.newValue); } catch (err) { return; }
    try {
      if (msg.type === 'goto-day' && msg.fecha && window.scrollToDay) window.scrollToDay(msg.fecha);
      else if (msg.type === 'reload' && window.loadData) window.loadData();
      else if (msg.type === 'apply-estado' && msg.practicaId && window.applyStatusChange) {
        window.applyStatusChange(msg.practicaId, msg.estado, msg.persona || null);
      }
    } catch (err) { console.warn('puente-tablero', err); }
  });

  try {
    const g = localStorage.getItem('smk_goto_day');
    if (g) {
      localStorage.removeItem('smk_goto_day');
      if (window.scrollToDay) setTimeout(() => window.scrollToDay(g), 900);
    }
  } catch (e) {}
})();
