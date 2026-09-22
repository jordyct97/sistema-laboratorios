# SISTEMA UNIFICADO - Tablero + Montaje + Kardex (codigo completo para Claude)

Carpeta del proyecto: D:/Users/jcruz97/Desktop/Nueva carpeta
Abrir con: python -m http.server en la carpeta, luego http://localhost:8000 (no doble clic por file://).

Orden de carga de scripts en index.html: store - catalogo - scanner - solicitudes - kardex - puente - excel-export - validacion - etiquetas - app.
tablero.html carga: XLSX CDN + su script interno + js/puente-tablero.js al final.

--- ARCHIVO: README.md (5511 caracteres) ---
```markdown
# Sistema Unificado: Tablero + Montaje + Kardex (Área Andina)

App web sin instalación: **tablero de prácticas (manda)** + montaje de formatos + Kardex por lotes con QR.

## Abrir local
Doble clic en **`index.html`**… mejor servido por HTTP (los `fetch` de `data/` fallan con `file://`):
`python -m http.server` en esta carpeta → http://localhost:8000

## Pestañas
- **🗓️ Tablero** (`tablero.html` embebido): agenda de prácticas con estados Impreso→Alistado→Montado→Entregado→Recibido→Descuento, por persona; importa agenda semestral y formatos Tipo A/B. **Manda en estados.**
- **📋 Solicitudes / 📝 Montaje**: detalle de ítems (código/lote/cantidades), QR/cámara/USB, Excel idéntico al formato, vínculo 🔗 con práctica (traer ítems o crear práctica).
- **📦 Kardex**: 824 lotes ACTUALIZADO + filtros FEFO + consumir/ingresar por lote + **Consumos y validación semestral** (gráficas, alertas, resumen, reporte).
- **🏷 Etiquetas QR + Code128**.

## Sincronización
Tablero y app comparten `localStorage`: estados tablero→solicitud automáticos; al ENTREGAR (o Descuento) se descuenta Kardex FEFO una sola vez. `js/puente*.js`.

App web sin instalación para el **proceso de montaje del `Formato solicitud de insumos 2026.xls`**, vinculada al **Kardex** con **lector QR / código de barras** (cámara + lector USB + manual).

## Abrir
Doble clic en **`index.html`**. Funciona con internet la primera vez (Tailwind, SheetJS, ZXing, QRCode, JsBarcode por CDN).

## Módulos
- **📋 Solicitudes**: lista con buscador + filtro por estado. Flujo `BORRADOR → ALISTADO → MONTADO → ENTREGADO → RECIBIDO`.
- **📝 Montaje**: formulario idéntico al formato (datos solicitante, fechas, laboratorio, firmas ALISTADO/MONTADO/RECIBIDO, observaciones) + tabla Nº/CÓDIGO/LOTE/NOMBRE/SOLICITADOS/ENTREGADOS/RECIBIDOS/FALTANTES auto.
  - Agregar por **catálogo (1.666 ítems)**, **fila manual** o **📷 Escanear y agregar** (cámara, lector USB tipo teclado, o manual).
  - Al pasar a **ENTREGADO se descuenta automáticamente del Kardex**.
  - **⬇ Excel formato original**: genera `.xlsx` con el mismo layout del formato + hoja `Detalle`.
- **📦 Kardex + Escáner**: 207 códigos LS + stock inicial 2026 precargado.
  - Buscador + **📷 Escanear QR/barras**, filtro bajo/agotado, entradas/salidas manuales, movimientos recientes.
  - **📂 Cargar Kardex .xlsx** (hoja PRODUCTOS) para sumar productos, **⬇ Exportar Kardex**.
- **🏷 Etiquetas QR**: genera QR + Code128 por código para rotular insumos. Imprimible.

## Datos base incluidos
- `data/kardex_lotes.json` (824 lotes) y `data/consumos.json` (1.635 consumos): extraídos de **`kardex_202650b_ACTUALIZADO.xlsx`** (hojas KARDEX + CONSUMOS).
- `data/catalogo*.json`: catálogos del formato (1.666 ítems).
- Las solicitudes y movimientos se guardan en el navegador (localStorage). Usa **⬇ Excel** como respaldo oficial.

## Kardex por lotes (ACTUALIZADO)
- Columnas reales: código, insumo, presentación, lote, stock, vencimiento, ubicación, sede, estado, proveedor.
- Filtros: sede, status (disponible/vencido/agotado/por vencer ≤90d), subgrupo, rango de vencimiento, solo disponibles. Orden FEFO.
- Acciones por lote: **− Consumir** (pide centro de costo), **＋ Ingresar**, **QR** (etiqueta).
- **📂 Cargar Kardex .xlsx**: acepta el ACTUALIZADO (hojas KARDEX + CONSUMOS) y lo deja como fuente; **↺ Restablecer** vuelve al incluido.
- **⬇ Exportar Kardex actualizado**: mismo layout de 17 columnas + hoja CONSUMOS.

## Importar formatos de solicitud
- **📥 Importar formato .xls/.xlsx**: detecta la versión y muestra vista previa antes de crear el borrador.
- **🔗 Pegar a reserva existente**: si el formato coincide con una reserva del tablero (misma fecha de uso + docente), la previa ofrece pegarle los materiales (**agregar al final** o **reemplazar**) y vincular solicitud ↔ reserva; si no hay coincidencia, se crea solo y se vincula después en Montaje.
- **📎 Adjuntar formato (en cada tarjeta del tablero)**: abre el formato, muestra cuántos materiales trae y permite **Agregar al final** o **Reemplazar**; la app crea automáticamente la solicitud vinculada con esos materiales.
- **🛠 Montaje (en cada tarjeta del tablero)**: abre la solicitud vinculada en el editor de Montaje (o la crea con los datos de la práctica). Vínculo en ambos sentidos.
- **🕙 Día operativo**: el tablero cambia de día después de las 10:00 pm (no a medianoche): de 00:00 a 21:59 rige la fecha calendario; desde las 22:00 rige la del día siguiente. Aplica a Hoy, archivadas, alertas y agenda.
- **Formato 2026 actual** (con columna LOTE, firmas Alistado/Montado/Recibido) y **formato antiguo H2-P07-PR01-F06** (sin LOTE, con CONSECUTIVO, firmas Entregado/Firma/Recibido + Alistamiento por).
- Limpieza automática: seriales→fecha, `1022325460.0`→`1022325460`, omite textos legales y filas vacías, avisa ítems sin cantidad.
- Cada ítem se compara con el Kardex (✓ con stock / parcial / sin stock / no existe) y las cantidades son editables en la previa.
- **⬇ Excel** respeta la versión de origen: el antiguo se exporta sin LOTE y con sus firmas; el actual con bloques 1–21/22–79/80–136.

## Lector QR / barras
1. **Cámara**: botón 📷 → permite cámara → acerca el código.
2. **Lector USB**: enfoca cualquier campo “Código” y pita el lector (se detecta solo por velocidad + Enter).
3. **Manual**: escribe código/lote/nombre en el modal → Buscar.

## Archivos
```
index.html  css/styles.css  data/catalogo*.json
js/store.js js/catalogo.js js/scanner.js js/solicitudes.js js/kardex.js js/excel-export.js js/etiquetas.js js/app.js
```

```

--- ARCHIVO: index.html (32484 caracteres) ---
```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sistema de Montaje de Solicitudes + Kardex | Área Andina</title>
<meta name="description" content="Montaje de Formato Solicitud de Insumos 2026 vinculado al Kardex con lector QR / código de barras.">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js?v=20260921"></script>
<script src="https://unpkg.com/@zxing/browser@0.1.10/dist/zxing-browser.min.js?v=20260921"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js?v=20260921"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js?v=20260921"></script>
<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.8.0/dist/JsBarcode.all.min.js?v=20260921"></script>
<link rel="stylesheet" href="css/styles.css?v=20260921">
</head>
<body class="min-h-screen">
<header class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl no-print">
  <div class="mx-auto flex max-w-[1700px] flex-wrap items-center justify-between gap-3 px-4 py-3">
    <div class="flex items-center gap-3">
      <div class="grid h-11 w-11 place-items-center rounded-2xl bg-[#6F9F35] text-xl font-black text-white">A</div>
      <div><p class="text-base font-extrabold tracking-tight">Montaje de Solicitudes + Kardex</p>
      <p id="catInfo" class="text-xs text-slate-500">Cargando catálogo…</p></div>
    </div>
    <nav class="tabs flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-1.5" role="tablist">
      <button id="tab-tablero" class="tab-btn tab-btn-active">🗓️ Tablero</button>
      <button id="tab-lista" class="tab-btn">📋 Solicitudes</button>
      <button id="tab-editor" class="tab-btn">📝 Montaje</button>
      <button id="tab-kardex" class="tab-btn">📦 Kardex + Escáner</button>
      <button id="tab-etiq" class="tab-btn">🏷 Etiquetas QR</button>
    </nav>
    <div class="flex gap-2">
      <button id="goNew" class="btn btn-brand">＋ Nueva solicitud</button>
    </div>
  </div>
  <div class="institutional-line"></div>
</header>

<main class="mx-auto max-w-[1700px] px-4 py-5">
<!-- ============ PANEL TABLERO ============ -->
<section id="panel-tablero">
  <div class="mb-3 flex flex-wrap items-center justify-between gap-2 no-print">
    <p class="text-xs text-slate-500">Agenda de prácticas (alistamiento). Los cambios de estado se sincronizan con Solicitudes y descuentan Kardex al entregar. <span id="tableroCount"></span></p>
    <div class="flex gap-2">
      <button id="tableroReload" class="btn btn-ghost">⟳ Recargar tablero</button>
      <button id="tableroOpen" class="btn btn-ghost">↗ Abrir solo tablero</button>
    </div>
  </div>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow">
    <iframe id="tableroFrame" src="tablero.html?v=20260921" title="Tablero de alistamiento" style="width:100%;height:82vh;border:0"></iframe>
  </div>
</section>

<!-- ============ PANEL LISTA ============ -->
<section id="panel-lista" class="hidden">
  <div class="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <div class="kpi"><p class="text-[11px] font-bold uppercase text-slate-400">Solicitudes</p><p id="solCount" class="text-2xl font-extrabold">0</p></div>
    <div class="kpi"><p class="text-[11px] font-bold uppercase text-slate-400">Lotes en Kardex</p><p id="kpiKardexRef" class="text-2xl font-extrabold">0</p></div>
    <div class="kpi"><p class="text-[11px] font-bold uppercase text-slate-400">⏳ Por vencer</p><p id="kpiKardexBajo" class="text-2xl font-extrabold text-amber-600">0</p></div>
    <div class="kpi"><p class="text-[11px] font-bold uppercase text-slate-400">Agotados</p><p id="kpiKardexAgot" class="text-2xl font-extrabold text-rose-600">0</p></div>
  </div>
  <div class="glass mb-4 flex flex-wrap items-end gap-3 rounded-2xl border border-white/70 p-4 shadow">
    <div class="min-w-[220px] flex-1"><label class="mb-1 block text-xs font-bold uppercase text-slate-500">Buscar solicitud</label>
      <input id="buscSol" placeholder="Consecutivo, docente, asignatura, insumo…" class="w-full rounded-xl border border-slate-200 px-3 py-2.5"></div>
    <div><label class="mb-1 block text-xs font-bold uppercase text-slate-500">Estado</label>
      <select id="filtroEstado" class="rounded-xl border border-slate-200 px-3 py-2.5"><option value="">Todos</option><option>BORRADOR</option><option>ALISTADO</option><option>MONTADO</option><option>ENTREGADO</option><option>RECIBIDO</option></select></div>
    <div class="flex items-end gap-2">
      <label class="btn btn-brand cursor-pointer">📥 Importar formato .xls/.xlsx<input id="importFormatoInput" type="file" accept=".xls,.xlsx" class="hidden"></label>
    </div>
    <p class="w-full text-xs text-slate-400">Flujo: IMPORTAR formato → BORRADOR → ALISTADO (alista) → MONTADO (monta) → ENTREGADO (descuenta Kardex FEFO) → RECIBIDO (cierre). El lector USB funciona como teclado: enfoca un campo “Código” y pita el lector.</p>
  </div>
  <div id="listaSols" class="grid gap-3 lg:grid-cols-2"></div>
</section>

<!-- ============ PANEL EDITOR / MONTAJE ============ -->
<section id="panel-editor" class="hidden">
  <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
    <div>
      <h2 id="editorTitle" class="text-xl font-extrabold">Nueva solicitud de insumos</h2>
      <div id="pasosMontaje" class="mt-2 flex flex-wrap items-center gap-2 text-xs"></div>
    </div>
    <div class="flex flex-wrap gap-2 no-print">
      <button id="saveDraftBtn" class="btn btn-dark">💾 Guardar</button>
      <button id="exportXlsBtn" class="btn btn-brand">⬇ Excel formato original</button>
      <button id="printBtn" class="btn btn-ghost">🖨 Imprimir</button>
    </div>
  </div>
  <form id="formSol" onsubmit="return false" class="glass rounded-2xl border border-white/70 p-4 shadow">
    <input type="hidden" id="solId">
    <p class="mb-2 text-xs font-black uppercase tracking-widest text-[#6F9F35]">Datos del solicitante responsable</p>
    <div class="grid gap-3 md:grid-cols-3">
      <label class="text-xs font-bold">NOMBRE Y APELLIDO *<input name="nombre" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Docente responsable"></label>
      <label class="text-xs font-bold">DOCUMENTO<input name="documento" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"></label>
      <label class="text-xs font-bold">TIPO DE USUARIO<select name="tipoUsuario" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"><option>Docente</option><option>Estudiante</option><option>Administrativo</option><option>Externo</option></select></label>
      <label class="text-xs font-bold">PROGRAMA<input name="programa" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Ej. Enfermería"></label>
      <label class="text-xs font-bold">ASIGNATURA *<input name="asignatura" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"></label>
      <label class="text-xs font-bold">TEMA<input name="tema" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"></label>
      <label class="text-xs font-bold">SEMESTRE<input name="semestre" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"></label>
      <label class="text-xs font-bold">GRUPO<input name="grupo" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"></label>
      <label class="text-xs font-bold">JORNADA<select name="jornada" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"><option>Diurna</option><option>Nocturna</option><option>Sabatina</option></select></label>
      <label class="text-xs font-bold">Nº ESTUDIANTES<input name="numEstudiantes" type="number" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"></label>
      <label class="text-xs font-bold">Nº GRUPOS<input name="numGrupos" type="number" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"></label>
      <label class="text-xs font-bold">SEDE<input name="sede" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Ej. Bogotá / Pereira"></label>
      <label class="text-xs font-bold">FECHA SOLICITUD<input id="fechaSolicitud" name="fechaSolicitud" type="date" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"></label>
      <label class="text-xs font-bold">FECHA UTILIZACIÓN *<input id="fechaUtilizacion" name="fechaUtilizacion" type="date" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"></label>
      <label class="text-xs font-bold">HORARIO<input name="horario" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="07:00–10:00"></label>
      <label class="text-xs font-bold md:col-span-2">LABORATORIO A UTILIZAR<input name="laboratorio" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Ej. Laboratorio de Simulación"></label>
      <label class="text-xs font-bold">SEDE (lab)<input name="sedeLab" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" style="display:none"></label>
    </div>
    <label class="mt-3 block text-xs font-bold">OBSERVACIONES DE ENTREGA<textarea name="obsEntrega" rows="2" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"></textarea></label>
    <div class="mt-2 grid gap-3 md:grid-cols-3">
      <label class="text-xs font-bold">ALISTADO POR<input name="alistadoPor" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"></label>
      <label class="text-xs font-bold">MONTADO POR<input name="montadoPor" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"></label>
      <label class="text-xs font-bold">RECIBIDO POR (entrega)<input name="recibidoPor" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"></label>
    </div>
    <label class="mt-3 block text-xs font-bold">OBSERVACIONES DE RECIBIDO<textarea name="obsRecibido" rows="2" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"></textarea></label>
  </form>

  <div class="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow">
    <div class="flex flex-wrap items-center justify-between gap-2 border-b bg-slate-50 px-4 py-3">
      <div><h3 class="text-sm font-extrabold">Materiales y/o equipos solicitados — <span id="itemsCount">0 ítems</span></h3>
      <p class="text-xs text-slate-500">Columnas iguales al formato: Nº · CÓDIGO · LOTE · NOMBRE · SOLICITADOS · ENTREGADOS · RECIBIDOS · FALTANTES (auto)</p></div>
      <div class="flex flex-wrap gap-2 no-print">
        <div class="relative"><input id="catalogoAdd" placeholder="🔎 Agregar desde catálogo (1.666)…" class="w-72 rounded-xl border border-slate-200 px-3 py-2 text-sm"><div id="catalogoSug" class="autocomplete hidden"></div></div>
        <button id="scanAddBtn" class="btn btn-brand">📷 Escanear y agregar</button>
        <button id="addItemBtn" class="btn btn-ghost">＋ Fila manual</button>
      </div>
    </div>
    <div class="table-scroll overflow-auto"><table class="grid w-full min-w-[1100px] border-separate border-spacing-0 text-left text-xs">
      <thead><tr class="bg-[#0f3d5e] text-white">
        <th class="px-2 py-2">Nº</th><th class="px-2 py-2">CÓDIGO (QR)</th><th class="px-2 py-2">LOTE</th><th class="px-2 py-2">NOMBRE DEL MATERIAL / EQUIPO</th><th class="px-2 py-2">SOLIC.</th><th class="px-2 py-2">ENTR.</th><th class="px-2 py-2">RECIB.</th><th class="px-2 py-2">FALT.</th><th class="px-2 py-2 no-print">ACC</th>
      </tr></thead><tbody id="itemsBody"></tbody>
    </table></div>
  </div>
  <div id="linkBox" class="glass mt-4 rounded-2xl border border-white/70 p-4 shadow"></div>
  <div id="flujoBox" class="glass mt-4 rounded-2xl border border-white/70 p-4 shadow"></div>
</section>

<!-- ============ PANEL KARDEX ============ -->
<section id="panel-kardex" class="hidden">
  <div class="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
    <div class="kpi"><p class="text-[11px] font-bold uppercase text-slate-400">Lotes en inventario</p><p id="kpiKardexRef" class="text-2xl font-extrabold">0</p></div>
    <div class="kpi"><p class="text-[11px] font-bold uppercase text-slate-400">Unidades disponibles</p><p id="kpiKardexStock" class="text-2xl font-extrabold text-[#6F9F35]">0</p></div>
    <div class="kpi"><p class="text-[11px] font-bold uppercase text-slate-400">⚠ Vencidos (no usar)</p><p id="kpiKardexVenc" class="text-2xl font-extrabold text-rose-600">0</p></div>
    <div class="kpi"><p class="text-[11px] font-bold uppercase text-slate-400">⏳ Se vencen en 90 días</p><p id="kpiKardexBajo" class="text-2xl font-extrabold text-amber-600">0</p></div>
    <div class="kpi"><p class="text-[11px] font-bold uppercase text-slate-400">Agotados (stock 0)</p><p id="kpiKardexAgot" class="text-2xl font-extrabold text-slate-500">0</p></div>
  </div>
  <nav class="mb-4 flex w-fit flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm no-print" role="tablist">
    <button id="tabInv" type="button" class="tab-btn tab-btn-active">Inventario por lotes</button>
    <button id="tabCons" type="button" class="tab-btn">Consumos y validación semestral</button>
  </nav>
  <div id="invPanel">
  <div class="glass mb-4 rounded-2xl border border-white/70 p-4 shadow">
    <div class="grid gap-3 lg:grid-cols-12">
      <div class="lg:col-span-3"><label class="mb-1 block text-xs font-bold uppercase text-slate-500">Buscar (código, insumo, lote, proveedor)</label>
        <input id="buscKardex" data-scan placeholder="Ej. 118, guante, HW50809…" class="w-full rounded-xl border border-slate-200 px-3 py-2.5"></div>
      <div class="lg:col-span-1"><label class="mb-1 block text-xs font-bold uppercase text-slate-500">Sede</label>
        <select id="fltSede" class="w-full rounded-xl border border-slate-200 px-2 py-2.5 text-sm"><option value="">Todas</option></select></div>
      <div class="lg:col-span-2"><label class="mb-1 block text-xs font-bold uppercase text-slate-500">Status</label>
        <select id="fltStatus" class="w-full rounded-xl border border-slate-200 px-2 py-2.5 text-sm"><option value="">Todos</option><option value="DISPONIBLE">Disponible</option><option value="VENCIDO">Vencido</option><option value="AGOTADO">Agotado</option><option value="POR_VENCER_90">Por vencer ≤90d</option></select></div>
      <div class="lg:col-span-2"><label class="mb-1 block text-xs font-bold uppercase text-slate-500">Subgrupo</label>
        <select id="fltSub" class="w-full rounded-xl border border-slate-200 px-2 py-2.5 text-sm"><option value="">Todos</option></select></div>
      <div class="lg:col-span-2 grid grid-cols-2 gap-2">
        <div><label class="mb-1 block text-xs font-bold uppercase text-slate-500">Vence desde</label>
          <input id="fltVDesde" type="date" class="w-full rounded-xl border border-slate-200 px-2 py-2.5 text-sm"></div>
        <div><label class="mb-1 block text-xs font-bold uppercase text-slate-500">Vence hasta</label>
          <input id="fltVHasta" type="date" class="w-full rounded-xl border border-slate-200 px-2 py-2.5 text-sm"></div>
      </div>
      <div class="flex items-end gap-2 lg:col-span-2">
        <label class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold"><input id="fltSoloDisp" type="checkbox" class="h-4 w-4">Solo disponibles</label>
        <button id="clearKardexF" class="btn btn-ghost">Limpiar</button>
      </div>
      <div class="lg:col-span-12 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <button id="btnScanKardex" class="btn btn-brand">📷 Escanear QR / barras (código o lote)</button>
        <label class="btn btn-ghost cursor-pointer">📂 Cargar Kardex .xlsx<input id="kardexFile" type="file" accept=".xlsx,.xls" class="hidden"></label>
        <button id="btnExportKardex" class="btn btn-dark">⬇ Exportar Kardex actualizado</button>
        <button id="btnResetKardex" class="btn btn-ghost" title="Volver al ACTUALIZADO incluido">↺ Restablecer</button>
        <span id="kardexSrc" class="text-xs text-slate-400"></span>
      </div>
    </div>
    <div class="mt-3 grid gap-2 rounded-xl bg-slate-50 p-3 md:grid-cols-5">
      <input id="movCodigo" data-scan placeholder="Lote o código (escanea aquí)" class="rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono">
      <input id="movNombre" placeholder="Nombre (auto)" class="rounded-xl border border-slate-200 px-3 py-2 text-sm md:col-span-2">
      <input id="movCant" type="number" min="0" step="any" placeholder="Cantidad" class="rounded-xl border border-slate-200 px-3 py-2 text-sm">
      <input id="movDetalle" placeholder="Factura / detalle" class="rounded-xl border border-slate-200 px-3 py-2 text-sm">
      <div class="flex gap-2 md:col-span-5">
        <button id="btnEntrada" class="btn btn-brand">＋ Entrada</button>
        <button id="btnSalida" class="btn btn-danger">－ Salida / consumo</button>
        <span class="text-xs text-slate-400 self-center">El lector USB escribe aquí directo + Enter. Las ENTREGAS de solicitudes descuentan solas (FEFO).</span>
      </div>
    </div>
  </div>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow">
    <div class="flex flex-wrap items-center justify-between gap-2 border-b bg-slate-50 px-4 py-2"><span class="text-sm font-extrabold">Inventario por lotes (FEFO: vence primero arriba)</span><span id="kardexCount" class="text-xs text-slate-500"></span></div>
    <div class="table-scroll overflow-auto"><table class="w-full min-w-[1100px] text-left text-xs">
      <thead><tr class="bg-[#0f3d5e] text-white"><th class="px-2 py-2">Código</th><th class="px-2 py-2">Insumo</th><th class="px-2 py-2">Lote</th><th class="px-2 py-2">Stock</th><th class="px-2 py-2">Vence</th><th class="px-2 py-2">Ubicación / Sede</th><th class="px-2 py-2">Estado</th><th class="px-2 py-2 no-print">Acc</th></tr></thead>
      <tbody id="kardexBody"></tbody></table></div>
  </div>
  <div class="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow">
    <div class="border-b bg-slate-50 px-4 py-2 text-sm font-extrabold">Movimientos en la app (descuentos FEFO + consumos/entradas manuales)</div>
    <p id="consHistInfo" class="border-b bg-slate-50/50 px-4 py-1 text-[11px] text-slate-500"></p>
    <div class="table-scroll overflow-auto" style="max-height:32vh"><table class="w-full min-w-[800px] text-left text-xs">
      <thead><tr class="bg-slate-800 text-white"><th class="px-3 py-2">Fecha</th><th class="px-3 py-2">Código</th><th class="px-3 py-2">Nombre / Lote</th><th class="px-3 py-2">Tipo</th><th class="px-3 py-2">Cant</th><th class="px-3 py-2">Detalle</th></tr></thead>
      <tbody id="movsBody"></tbody></table></div>
  </div>
  </div><!-- /invPanel -->

  <!-- ============ SUBPANEL: CONSUMOS Y VALIDACIÓN ============ -->
  <div id="consPanel" class="hidden">
    <section class="glass mb-4 rounded-2xl border border-white/70 p-4 shadow">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div class="flex flex-wrap items-end gap-3">
          <div><label class="mb-1 block text-xs font-bold uppercase text-slate-500">Periodo</label>
            <select id="semesterSelect" class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm lg:w-60"></select></div>
          <div id="customRangeWrap" class="hidden items-end gap-3">
            <div><label class="mb-1 block text-xs font-bold uppercase text-slate-500">Desde</label>
              <input id="consFrom" type="date" class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"></div>
            <div><label class="mb-1 block text-xs font-bold uppercase text-slate-500">Hasta</label>
              <input id="consTo" type="date" class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"></div>
          </div>
        </div>
        <button id="exportReportButton" class="btn btn-dark">⬇ Descargar reporte del periodo</button>
      </div>
      <p class="mt-2 text-xs text-slate-400">Histórico del ACTUALIZADO + salidas de la app. Valida fecha, cantidad, centro de costo, existencia del lote y que el acumulado no supere el stock base.</p>
    </section>
    <section class="mb-4 grid gap-3 xl:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow"><h2 class="text-sm font-extrabold">Consumo mensual</h2><div class="chart-box"><canvas id="chartMonthly"></canvas></div><p class="chart-fallback mt-2 hidden text-xs text-slate-400">Chart.js no disponible sin conexión.</p></div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow"><h2 class="text-sm font-extrabold">Top 10 insumos</h2><div class="chart-box"><canvas id="chartTopItems"></canvas></div><p class="chart-fallback mt-2 hidden text-xs text-slate-400">Chart.js no disponible sin conexión.</p></div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow"><h2 class="text-sm font-extrabold">Por centro de costo</h2><div class="chart-box"><canvas id="chartCostCenters"></canvas></div><p class="chart-fallback mt-2 hidden text-xs text-slate-400">Chart.js no disponible sin conexión.</p></div>
    </section>
    <div class="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <div class="kpi"><p class="text-[11px] font-bold uppercase text-slate-400">Consumos</p><p id="consKpiRecords" class="text-2xl font-extrabold">0</p></div>
      <div class="kpi"><p class="text-[11px] font-bold uppercase text-slate-400">Unidades</p><p id="consKpiUnits" class="text-2xl font-extrabold text-[#6F9F35]">0</p></div>
      <div class="kpi"><p class="text-[11px] font-bold uppercase text-slate-400">Insumos distintos</p><p id="consKpiItems" class="text-2xl font-extrabold">0</p></div>
      <div class="kpi"><p class="text-[11px] font-bold uppercase text-slate-400">Alertas</p><p id="consKpiAlerts" class="text-2xl font-extrabold text-amber-600">0</p></div>
    </div>
    <section class="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow">
      <div class="flex items-center justify-between gap-3"><h2 class="text-sm font-extrabold">Validación del periodo</h2><span id="validationBadge" class="status-pill bg-slate-100 text-slate-500">Sin datos</span></div>
      <ul id="validationList" class="mt-3 space-y-2"></ul>
      <p id="validationOkMessage" class="mt-3 hidden rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">Todos los consumos del periodo pasaron la validación.</p>
    </section>
    <section class="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow">
      <div class="border-b bg-slate-50 px-4 py-2 text-sm font-extrabold">Resumen por insumo</div>
      <div class="table-scroll overflow-auto"><table class="w-full min-w-[900px] text-left text-xs">
        <thead><tr class="bg-[#0f3d5e] text-white"><th class="px-3 py-2">Insumo</th><th class="px-3 py-2">Código</th><th class="px-3 py-2">Consumido</th><th class="px-3 py-2">Registros</th><th class="px-3 py-2">Stock inicial</th><th class="px-3 py-2">Stock actual</th><th class="px-3 py-2">% uso</th></tr></thead>
        <tbody id="aggTableBody"></tbody></table></div>
      <div id="aggEmptyState" class="hidden px-6 py-8 text-center text-xs text-slate-500">No hay consumos en el periodo.</div>
    </section>
    <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow">
      <div class="border-b bg-slate-50 px-4 py-2 text-sm font-extrabold">Detalle de consumos (recientes primero)</div>
      <div class="table-scroll overflow-auto"><table class="w-full min-w-[1000px] text-left text-xs">
        <thead><tr class="bg-[#0f3d5e] text-white"><th class="px-3 py-2">Fecha</th><th class="px-3 py-2">Insumo</th><th class="px-3 py-2">Código</th><th class="px-3 py-2">Lote</th><th class="px-3 py-2">Cant</th><th class="px-3 py-2">Centro de costo</th><th class="px-3 py-2">Observación</th><th class="px-3 py-2">Validación</th></tr></thead>
        <tbody id="consTableBody"></tbody></table></div>
      <div id="consEmptyState" class="hidden px-6 py-8 text-center text-xs text-slate-500">Sin consumos en este periodo.</div>
    </section>
  </div>
</section>

<!-- ============ PANEL ETIQUETAS ============ -->
<section id="panel-etiquetas" class="hidden">
  <div class="glass rounded-2xl border border-white/70 p-4 shadow">
    <h2 class="text-lg font-extrabold">Generador de etiquetas QR + Code128</h2>
    <p class="text-xs text-slate-500">Imprime rótulos y pégalos en cada insumo. El mismo código lo lee el escáner del Montaje y del Kardex.</p>
    <div class="mt-3 grid gap-3 md:grid-cols-4 no-print">
      <label class="text-xs font-bold">CÓDIGO<input id="etiqCodigo" data-scan value="LS10" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"></label>
      <label class="text-xs font-bold md:col-span-2">NOMBRE<input id="etiqNombre" value="Alcohol glicerinado" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"></label>
      <label class="text-xs font-bold">COPIAS<input id="etiqCant" type="number" value="4" min="1" max="24" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"></label>
    </div>
    <div class="mt-3 flex gap-2 no-print">
      <button id="etiqFromScan" class="btn btn-brand">📷 Escanear para etiqueta</button>
      <button id="etiqPrint" class="btn btn-dark">🖨 Imprimir etiquetas</button>
    </div>
    <div id="etiqPreview" class="mt-4 flex flex-wrap gap-3"></div>
  </div>
</section>

<p class="mt-6 text-center text-[11px] text-slate-400">Fundación Universitaria del Área Andina · Montaje de Solicitudes + Kardex · <span id="yearNow"></span></p>
</main>

<!-- Modal: consumo por lote -->
<div id="consumeModal" class="modal-backdrop fixed inset-0 z-50 hidden items-center justify-center p-4">
  <div class="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl">
    <div class="flex items-start justify-between gap-4">
      <div><p class="text-xs font-bold uppercase tracking-widest text-[#6F9F35]">Salida de inventario</p>
        <h3 id="consumeTitle" class="mt-1 text-xl font-extrabold">Consumir</h3>
        <p id="consumeItemLabel" class="mt-1 text-sm text-slate-500"></p></div>
      <button id="closeModal" class="rounded-xl p-2 text-slate-400 hover:bg-slate-100">✕</button>
    </div>
    <div class="mt-4 rounded-2xl bg-slate-50 p-4 flex items-center justify-between">
      <span class="text-xs font-bold uppercase text-slate-500">Stock del lote</span>
      <span id="availableStock" class="text-xl font-extrabold">0</span>
    </div>
    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      <div><label class="mb-1 block text-sm font-bold">Cantidad *<input id="consumeQuantity" type="number" min="0.0001" step="any" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"></label>
        <p id="quantityHelp" class="mt-1 text-xs text-slate-400"></p></div>
      <div><label class="mb-1 block text-sm font-bold">Centro de costo *<input id="consumeCostCenter" placeholder="Ej. ENFERMERIA / IQX" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"></label></div>
      <div class="sm:col-span-2"><label class="mb-1 block text-sm font-bold">Observación<textarea id="consumeObservation" rows="2" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"></textarea></label></div>
    </div>
    <div class="mt-4 flex justify-end gap-2">
      <button id="cancelConsume" class="btn btn-ghost">Cancelar</button>
      <button id="confirmConsume" class="btn btn-brand">Confirmar consumo</button>
    </div>
  </div>
</div>

<!-- Modal: entrada por lote -->
<div id="entryModal" class="modal-backdrop fixed inset-0 z-50 hidden items-center justify-center p-4">
  <div class="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl">
    <div class="flex items-start justify-between gap-4">
      <div><p class="text-xs font-bold uppercase tracking-widest text-[#2F6FED]">Entrada de inventario</p>
        <h3 id="entryTitle" class="mt-1 text-xl font-extrabold">Ingresar stock</h3>
        <p id="entryItemLabel" class="mt-1 text-sm text-slate-500"></p></div>
      <button id="closeEntryModal" class="rounded-xl p-2 text-slate-400 hover:bg-slate-100">✕</button>
    </div>
    <div class="mt-4 rounded-2xl bg-blue-50 p-4 flex items-center justify-between">
      <span class="text-xs font-bold uppercase text-slate-500">Stock actual</span>
      <span id="entryCurrentStock" class="text-xl font-extrabold">0</span>
    </div>
    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      <div><label class="mb-1 block text-sm font-bold">Cantidad *<input id="entryQuantity" type="number" min="0.0001" step="any" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"></label></div>
      <div><label class="mb-1 block text-sm font-bold">Factura / OC<input id="entryFactura" placeholder="Ej. FAC-2026-001" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"></label></div>
      <div><label class="mb-1 block text-sm font-bold">Proveedor<input id="entryProveedor" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"></label></div>
      <div><label class="mb-1 block text-sm font-bold">Observación<input id="entryObservacion" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"></label></div>
    </div>
    <div class="mt-4 flex justify-end gap-2">
      <button id="cancelEntry" class="btn btn-ghost">Cancelar</button>
      <button id="confirmEntry" class="btn btn-dark">Confirmar entrada</button>
    </div>
  </div>
</div>

<!-- Modal: vista previa de importación -->
<div id="importPreviewModal" class="modal-backdrop fixed inset-0 z-[58] hidden items-center justify-center p-4">
  <div class="flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl">
    <div class="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
      <div><p class="text-xs font-bold uppercase tracking-widest text-[#6F9F35]">📥 Importar formato</p>
        <h3 class="mt-1 text-xl font-extrabold">Revisa lo identificado</h3></div>
      <button id="closeImportPreview" class="rounded-xl p-2 text-slate-400 hover:bg-slate-100">✕</button>
    </div>
    <div id="importPreviewBody" class="space-y-2 overflow-y-auto p-5"></div>
    <div class="flex flex-col-reverse gap-2 border-t border-slate-100 p-4 sm:flex-row sm:justify-end">
      <button id="cancelImportPreview" class="btn btn-ghost">Cancelar</button>
      <button id="confirmImportPreview" class="btn btn-brand">✓ Crear borrador con estos datos</button>
    </div>
  </div>
</div>

<!-- Modal escáner -->
<div id="scannerModal" class="modal-backdrop fixed inset-0 z-[55] hidden items-center justify-center p-4">
  <div class="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl">
    <div class="flex items-start justify-between gap-4">
      <div><p class="text-xs font-bold uppercase tracking-widest text-[#6F9F35]">Escáner</p>
      <h3 id="scannerTitle" class="mt-1 text-lg font-extrabold">Escanear código</h3>
      <p id="scannerStatus" class="mt-1 hidden text-xs font-semibold text-slate-500"></p></div>
      <button id="closeScannerModal" class="rounded-xl p-2 text-slate-400 hover:bg-slate-100">✕</button>
    </div>
    <video id="scannerVideo" muted playsinline></video>
    <div class="mt-3 flex gap-2">
      <input id="scannerManualInput" data-scan placeholder="Manual: código, lote o nombre…" class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm">
      <button id="scannerManualGo" class="btn btn-dark shrink-0">Buscar</button>
    </div>
    <ul id="scannerMatches" class="mt-3 space-y-2"></ul>
    <p class="mt-2 text-[11px] text-slate-400">💡 Lector USB: enfoca el campo “Manual” y pita el lector — se detecta solo.</p>
  </div>
</div>

<div id="toastContainer" class="pointer-events-none fixed bottom-5 right-5 z-[60] flex max-w-sm flex-col gap-2"></div>

<script src="js/store.js?v=20260921"></script>
<script src="js/catalogo.js?v=20260921"></script>
<script src="js/scanner.js?v=20260921"></script>
<script src="js/solicitudes.js?v=20260921"></script>
<script src="js/kardex.js?v=20260921"></script>
<script src="js/puente.js?v=20260921"></script>
<script src="js/validacion.js?v=20260921"></script>
<script src="js/excel-export.js?v=20260921"></script>
<script src="js/etiquetas.js?v=20260921"></script>
<script src="js/app.js?v=20260921"></script>
</body>
</html>

```

--- ARCHIVO: tablero.html (109453 caracteres) ---
```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tablero de Alistamiento — Laboratorios de Salud</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

  :root{
    /* Institucional Areandina: verde + naranja + fucsia (logo) */
    --brand-green: #7AB929;
    --brand-green-dark: #557F1B;
    --brand-orange: #F39C00;
    --brand-magenta: #D6006E;
    --brand-gray: #4E4E4E;
    --bg: #F4F4F1;
    --surface: #FFFFFF;
    --surface-alt: #EEF2E6;
    --ink: #2E342F;
    --ink-soft: #5F6B60;
    --line: #E0E5DA;
    --accent: #5F8F1F;
    --accent-dark: #476B14;
    --pendiente: #B96A00;
    --pendiente-bg: #FDEED3;
    --alistado: #1D5FBF;
    --alistado-bg: #E4EDFB;
    --montado: #4E7A15;
    --montado-bg: #E7F0D8;
    --entregado: #C20064;
    --entregado-bg: #FBE0EF;
    --recibido: #0E7490;
    --recibido-bg: #DFF4F7;
    --descuento: #6B7280;
    --descuento-bg: #EEF0F2;
    --danger: #B3261E;
    --radius: 12px;
    --shadow: 0 1px 2px rgba(46,52,47,.06), 0 4px 14px rgba(46,52,47,.06);
    font-family: 'IBM Plex Sans', -apple-system, sans-serif;
  }

  /* Franja tricolor institucional */
  .brand-stripe{ height:6px; background:linear-gradient(90deg, var(--brand-green) 0 42%, var(--brand-orange) 42% 70%, var(--brand-magenta) 70% 100%); }
  .brand-eyebrow{ display:flex; align-items:center; gap:8px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--brand-gray); margin:0 0 6px; }
  .brand-eyebrow .dots{ display:inline-flex; gap:4px; }
  .brand-eyebrow .dots i{ width:9px; height:9px; border-radius:50%; display:inline-block; }
  .brand-eyebrow .dots i:nth-child(1){ background:var(--brand-green); }
  .brand-eyebrow .dots i:nth-child(2){ background:var(--brand-orange); }
  .brand-eyebrow .dots i:nth-child(3){ background:var(--brand-magenta); }

  *{ box-sizing: border-box; }
  html, body{ margin:0; padding:0; background: var(--bg); color: var(--ink); }
  body{ min-height: 100vh; }

  .mono{ font-family:'IBM Plex Mono', monospace; }
  .app{ display:flex; min-height:100vh; }

  /* ---------- Rail lateral ---------- */
  .rail{
    width: 230px; flex-shrink:0; background: var(--surface);
    border-right: 1px solid var(--line); padding: 20px 0;
    position: sticky; top:0; height:100vh; overflow-y:auto;
  }
  .rail-title{ font-size:11px; text-transform:uppercase; letter-spacing:.08em; color: var(--ink-soft); padding: 0 18px 12px; font-weight:600; }
  .rail-item{ display:flex; align-items:center; justify-content:space-between; padding: 9px 18px; cursor:pointer; border-left:3px solid transparent; transition: background .15s, border-color .15s; }
  .rail-item:hover{ background: var(--surface-alt); }
  .rail-item.active{ background: var(--surface-alt); border-left-color: var(--accent); }
  .rail-item.today{ background: #EAF3DA; border-left-color: var(--accent); }
  .rail-date{ font-size:13px; font-weight:500; }
  .rail-date .dow{ display:block; font-size:10px; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.05em; font-weight:600;}
  .rail-count{ font-family:'IBM Plex Mono', monospace; font-size:11px; font-weight:600; background: var(--pendiente-bg); color: var(--pendiente); padding: 2px 7px; border-radius: 20px; min-width: 20px; text-align:center; }
  .rail-count.zero{ background: var(--montado-bg); color: var(--montado); }
  .rail-empty{ padding: 12px 18px; font-size:12px; color: var(--ink-soft); }

  /* Chips móviles (reemplazan rail en pantallas pequeñas) */
  .rail-mobile{ display:none; gap:8px; overflow-x:auto; padding: 4px 2px 12px; margin-bottom: 6px; }
  .rail-mobile .chip{ flex-shrink:0; border:1px solid var(--line); background:var(--surface); border-radius:20px; padding:6px 12px; font-size:12.5px; cursor:pointer; display:flex; gap:6px; align-items:center; }
  .rail-mobile .chip.today{ border-color:var(--accent); background:#EAF3DA; font-weight:700; }
  .rail-mobile .chip .n{ font-family:'IBM Plex Mono',monospace; font-size:11px; background:var(--surface-alt); border-radius:12px; padding:0 6px; }

  /* ---------- Main ---------- */
  .main{ flex:1; padding: 28px 36px 60px; max-width: 1080px; min-width:0; }
  .top{ display:flex; justify-content:space-between; align-items:flex-start; gap:20px; flex-wrap:wrap; margin-bottom: 18px;}
  h1{ font-size: 22px; margin:0 0 4px; letter-spacing:-.01em; }
  .subtitle{ color: var(--ink-soft); font-size: 13.5px; margin:0;}

  /* Stats mejoradas */
  .stats{ display:grid; grid-template-columns: repeat(4, minmax(120px,1fr)); gap:10px; }
  .stat{ background: var(--surface); border:1px solid var(--line); border-radius:10px; padding: 10px 14px; min-width:0; box-shadow: var(--shadow); }
  .stat .row{ display:flex; align-items:center; gap:8px; }
  .stat .ico{ width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }
  .stat .num{ font-family:'IBM Plex Mono', monospace; font-size:20px; font-weight:600; line-height:1; }
  .stat .label{ font-size:10.5px; color: var(--ink-soft); text-transform:uppercase; letter-spacing:.05em; margin-top:6px;}
  .stat .bar{ height:4px; background:#E7ECEA; border-radius:10px; margin-top:8px; overflow:hidden; }
  .stat .bar > div{ height:100%; border-radius:10px; }
  .stat.pend .num{ color: var(--pendiente); } .stat.pend .ico{ background:var(--pendiente-bg); } .stat.pend .bar > div{ background:var(--pendiente); }
  .stat.alist .num{ color: var(--alistado); } .stat.alist .ico{ background:var(--alistado-bg); } .stat.alist .bar > div{ background:var(--alistado); }
  .stat.montado .num{ color: var(--montado); } .stat.montado .ico{ background:var(--montado-bg); } .stat.montado .bar > div{ background:var(--montado); }
  .stat.total .ico{ background:var(--surface-alt); }

  /* ---------- Toolbar compacta ---------- */
  .toolbar{ position:sticky; top:0; z-index:30; background:var(--bg); padding:10px 0; display:flex; gap:10px; align-items:center; margin-bottom: 14px; flex-wrap:wrap; border-bottom:1px solid transparent; }
  .toolbar.stuck{ border-bottom-color: var(--line); }
  input[type=text], input[type=date], input[type=time], select, textarea{ font-family:'IBM Plex Sans', sans-serif; font-size:13.5px; border:1px solid var(--line); border-radius:8px; padding: 9px 12px; background: var(--surface); color: var(--ink); outline:none; }
  input[type=text]:focus, input[type=date]:focus, input[type=time]:focus, select:focus, textarea:focus{ border-color: var(--accent); box-shadow: 0 0 0 3px rgba(30,122,102,.12); }
  .search{ flex:1; min-width: 180px; }
  .btn{ font-family:'IBM Plex Sans', sans-serif; font-size: 13.5px; font-weight:600; border:none; border-radius:8px; padding: 9px 16px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition: transform .1s, background .15s; white-space:nowrap; }
  .btn:disabled{ opacity:.45; cursor:not-allowed; }
  .btn:active{ transform: scale(.97); }
  .btn-primary{ background: var(--accent); color:#fff; }
  .btn-primary:hover{ background: var(--accent-dark); }
  .btn-ghost{ background: var(--surface); border:1px solid var(--line); color: var(--ink); }
  .btn-ghost:hover{ background: var(--surface-alt); }
  .view-toggle{ display:inline-flex; border:1px solid var(--line); border-radius:8px; overflow:hidden; background:var(--surface); }
  .view-toggle .btn{ border-radius:0; border:none; background: transparent; }
  .view-toggle .btn.active{ background: var(--accent); color:#fff; }
  .menu{ position:relative; }
  .menu-panel{ position:absolute; right:0; top:calc(100% + 6px); background:var(--surface); border:1px solid var(--line); border-radius:10px; box-shadow:0 10px 30px rgba(0,0,0,.14); padding:6px; min-width:230px; display:none; z-index:50; }
  .menu.open .menu-panel{ display:block; }
  .menu-panel button{ display:flex; width:100%; text-align:left; background:none; border:none; padding:9px 10px; border-radius:7px; cursor:pointer; font-size:13.5px; color:var(--ink); font-family:inherit; gap:8px; align-items:center; }
  .menu-panel button:hover{ background:var(--surface-alt); }
  .menu-panel button.danger{ color:var(--danger); }

  /* ---------- Panel form ---------- */
  .panel{ background: var(--surface); border:1px solid var(--line); border-radius:14px; padding: 20px; margin-bottom: 22px; display:none; box-shadow:var(--shadow); }
  .panel.open{ display:block; }
  .panel h2{ font-size:15px; margin:0 0 14px; }
  .grid{ display:grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); gap:12px; }
  .field label{ display:block; font-size:11.5px; font-weight:600; color: var(--ink-soft); margin-bottom:5px; text-transform:uppercase; letter-spacing:.03em;}
  .field input, .field select, .field textarea{ width:100%; }
  .field textarea{ resize: vertical; min-height: 60px; }
  .panel-actions{ display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }

  /* ---------- Grupos por fecha ---------- */
  .day-group{ margin-bottom: 26px; scroll-margin-top: 110px; }
  .day-head{ display:flex; align-items:baseline; gap:10px; margin-bottom:10px; padding-bottom:6px; border-bottom: 1px solid var(--line); }
  .day-head .d1{ font-size:16px; font-weight:700; }
  .day-head .d2{ font-size:12px; color: var(--ink-soft); text-transform:capitalize;}
  .badge-today{ font-size:10px; font-weight:700; background: var(--accent); color:#fff; padding:2px 8px; border-radius:20px; text-transform:uppercase; letter-spacing:.04em; }
  .badge-archived{ font-size:10px; font-weight:700; background: var(--surface-alt); color: var(--ink-soft); padding:2px 8px; border-radius:20px; text-transform:uppercase; letter-spacing:.04em; }
  .day-group.archived{ opacity:.75; }
  .archive-note{ text-align:center; padding: 14px; margin-bottom: 18px; font-size:13px; color: var(--ink-soft); background: var(--surface); border:1px dashed var(--line); border-radius:10px; }
  .archive-note button{ background:none; border:none; color: var(--accent); font-weight:600; cursor:pointer; text-decoration: underline; font-size:13px; font-family:inherit; padding:0; }

  .alerts-box{ display:flex; flex-direction:column; gap:10px; margin-bottom:16px; }
  .alerts-head{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
  .alerts-title{ font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--pendiente); display:flex; align-items:center; gap:6px; }
  .alerts-title.urgent{ color:var(--brand-magenta); }
  .alerts-count{ font-family:'IBM Plex Mono',monospace; background:var(--pendiente); color:#fff; border-radius:12px; padding:0 8px; font-size:11px; }
  .alerts-count.urgent{ background:var(--brand-magenta); }
  .alert-item{ display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:12px; background:var(--surface); border:1px solid var(--line); border-left:4px solid var(--brand-orange); font-size:13px; cursor:pointer; box-shadow:var(--shadow); transition:transform .12s, box-shadow .12s; }
  .alert-item:hover{ transform:translateY(-1px); box-shadow:0 6px 18px rgba(46,52,47,.12); }
  .alert-item.urgent{ border-left-color:var(--brand-magenta); background:#FDF0F6; }
  .alert-ico{ width:32px; height:32px; border-radius:50%; background:var(--pendiente-bg); display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }
  .alert-item.urgent .alert-ico{ background:#FBE4E1; }
  .alert-body{ flex:1; min-width:0; }
  .alert-title{ font-weight:700; }
  .alert-sub{ color:var(--ink-soft); font-size:12px; margin-top:1px; }
  .alert-go{ color:var(--ink-soft); font-weight:700; flex-shrink:0; }
  .alert-item:hover .alert-go{ color:var(--accent); }
  .alert-dismiss{ background:none; border:none; cursor:pointer; color:var(--ink-soft); font-size:14px; padding:2px 6px; border-radius:6px; flex-shrink:0; }
  .alert-dismiss:hover{ background:var(--surface-alt); color:var(--danger); }
  .alerts-group{ display:flex; flex-direction:column; gap:8px; }
  .alerts-group-head{ display:flex; align-items:center; gap:8px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--ink-soft); margin-top:4px; }
  .alerts-group-head .g-count{ font-family:'IBM Plex Mono',monospace; background:var(--surface-alt); border:1px solid var(--line); border-radius:12px; padding:0 8px; font-size:11px; }
  .alerts-group-head.urg{ color:var(--brand-magenta); }
  .alerts-group-head.urg .g-count{ background:var(--entregado-bg); border-color:var(--brand-magenta); color:var(--brand-magenta); }
  .alerts-foot{ display:flex; justify-content:flex-end; }
  .alerts-restore{ background:none; border:none; color:var(--accent); font-size:12px; font-weight:600; cursor:pointer; text-decoration:underline; font-family:inherit; padding:2px 4px; }

  /* Modal de estado */
  .status-practice{ background:var(--surface-alt); border:1px solid var(--line); border-radius:10px; padding:10px 12px; margin-bottom:14px; font-size:12.5px; }
  .status-practice b{ font-size:13.5px; }
  .status-practice .row{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .status-field{ margin-bottom:12px; }
  .status-field label{ display:block; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; color:var(--ink-soft); margin-bottom:5px; }
  .status-field select{ width:100%; }
  .status-hint{ font-size:11.5px; color:var(--ink-soft); background:var(--surface-alt); border-radius:8px; padding:8px 10px; margin-bottom:14px; }
  .status-steps{ display:flex; gap:4px; margin-top:10px; }
  .status-steps span{ flex:1; height:5px; border-radius:4px; background:#E2E8E6; }
  .status-steps span.done{ background:var(--accent); }

  /* Pulido general */
  :focus-visible{ outline:2px solid var(--accent); outline-offset:2px; }
  .toolbar.stuck{ box-shadow:0 4px 14px rgba(22,48,43,.08); }
  .card{ border-left:3px solid var(--line); }
  .card:hover{ border-color:#C6D6D0; border-left-color:var(--accent); }
  .badge{ transition:transform .1s, filter .12s; }
  .badge:hover{ filter:brightness(.96); transform:translateY(-1px); }
  .modal-overlay.open .modal-box{ animation:pop .16s ease-out; }
  @keyframes pop{ from{ transform:translateY(6px) scale(.98); opacity:.6; } to{ transform:none; opacity:1; } }
  .btn-primary{ box-shadow:0 2px 8px rgba(122,185,41,.35); }

  .fab{ position: fixed; right: 26px; width: 46px; height: 46px; border-radius: 50%; border:none; cursor:pointer; font-size: 18px; box-shadow: 0 4px 14px rgba(85,127,27,.35); display:flex; align-items:center; justify-content:center; z-index: 40; transition: opacity .18s, transform .18s, background .15s; }
  .fab-primary{ background: var(--accent); color:#fff; }
  .fab-secondary{ background: var(--surface); color: var(--accent); border:1px solid var(--line); }
  .back-to-top{ bottom: 26px; opacity:0; pointer-events:none; transform: translateY(8px); }
  .back-to-top.visible{ opacity:1; pointer-events:auto; transform: translateY(0); }
  .btn-refresh-float{ bottom: 82px; }
  .btn-refresh-float.spinning{ animation: fab-spin .6s linear; }
  @keyframes fab-spin{ to{ transform: rotate(360deg); } }

  /* Cards con timeline */
  .card{ background: var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding: 14px 16px; margin-bottom: 10px; display:flex; gap:14px; align-items:flex-start; box-shadow:var(--shadow); transition: border-color .15s; }
  .card:hover{ border-color: #C6D6D0; }
  .card.focused{ border-color: var(--accent); border-left-color: var(--accent); box-shadow: 0 0 0 2px var(--accent), var(--shadow); }
  .card-main{ flex:1; min-width:0; }
  .card-top{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:5px; }
  .card-time{ font-family:'IBM Plex Mono', monospace; font-size:12.5px; color: var(--ink-soft); background:var(--surface-alt); padding:2px 8px; border-radius:6px; }
  .card-docente{ font-weight:700; font-size:14.5px; }
  .card-meta{ font-size:12.5px; color: var(--ink-soft); }
  .card-insumos{ font-size:12.5px; margin-top:8px; white-space:pre-wrap; background: var(--surface-alt); padding:8px 10px; border-radius:8px; display:none; }
  .card-insumos.open{ display:block; }
  .card-notas{ font-size:12px; color: var(--ink-soft); font-style:italic; margin-top:4px; }
  .timeline{ margin-top:8px; border-left:2px solid var(--line); padding-left:10px; display:flex; flex-direction:column; gap:3px; }
  .timeline div{ font-size:11.5px; color: var(--ink-soft); }
  .timeline b{ color:var(--ink); }

  .modal-overlay{ display:none; position:fixed; inset:0; background:rgba(22,48,43,.45); align-items:center; justify-content:center; z-index:100; padding:20px; }
  .modal-overlay.open{ display:flex; }
  .modal-box{ background:#fff; border-radius:14px; padding:22px 24px; max-width:380px; width:100%; box-shadow:0 12px 40px rgba(0,0,0,.25); }
  .modal-box h3{ margin:0 0 6px; font-size:15px; }
  .modal-box .modal-sub{ font-size:12.5px; color: var(--ink-soft); margin-bottom:14px; }
  .modal-box select, .modal-box input[type=text], .modal-box input[type=password]{ width:100%; margin-bottom:10px; }
  .modal-actions{ display:flex; justify-content:flex-end; gap:8px; }
  .modal-box.wide{ max-width:560px; }
  .modal-box textarea.export-area{ width:100%; height:280px; font-family:'IBM Plex Mono', monospace; font-size:11.5px; border:1px solid var(--line); border-radius:8px; padding:10px; resize:vertical; margin-bottom:14px; background: var(--surface-alt); color: var(--ink); }
  .modal-box.informe-box{ max-width:620px; max-height:85vh; overflow-y:auto; }

  .informe-list{ display:flex; flex-direction:column; gap:12px; margin-bottom:16px; }
  .informe-person{ border:1px solid var(--line); border-radius:10px; padding:12px 14px; background: var(--surface-alt); }
  .informe-person-head{ display:flex; justify-content:space-between; align-items:center; cursor:pointer; gap:10px; flex-wrap:wrap; }
  .informe-person-name{ font-weight:700; font-size:13.5px; }
  .informe-person-counts{ display:flex; gap:6px; flex-wrap:wrap; }
  .pill{ font-size:10.5px; font-weight:700; padding:2px 9px; border-radius:20px; white-space:nowrap; }
  .pill-alistado{ background: var(--alistado-bg); color: var(--alistado); }
  .pill-montado{ background: var(--montado-bg); color: var(--montado); }
  .pill-entregado{ background: var(--entregado-bg); color: var(--entregado); }
  .pill-recibido{ background: var(--recibido-bg); color: var(--recibido); }
  .pill-descuento{ background: var(--descuento-bg); color: var(--descuento); }
  .pill-empty{ background: #E4E9E7; color: var(--ink-soft); }
  .informe-bar-row{ display:flex; align-items:center; gap:8px; margin-top:8px; }
  .informe-bar-label{ font-size:10.5px; color: var(--ink-soft); width:58px; flex-shrink:0; }
  .informe-bar-track{ flex:1; height:7px; background:#E4E9E7; border-radius:20px; overflow:hidden; }
  .informe-bar-fill{ height:100%; border-radius:20px; }
  .informe-detalle{ margin-top:10px; padding-top:10px; border-top:1px dashed var(--line); }
  .informe-detalle-title{ font-size:11px; font-weight:700; color: var(--ink-soft); text-transform:uppercase; letter-spacing:.03em; margin:8px 0 4px; }
  .informe-mini-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:3px; }
  .informe-mini-list li{ font-size:12px; cursor:pointer; padding:3px 6px; border-radius:6px; }
  .informe-mini-list li:hover{ background: var(--surface); text-decoration:underline; }
  .informe-empty{ font-size:12px; color: var(--ink-soft); font-style:italic; }

  .stats-summary{ display:flex; gap:10px; flex-wrap:wrap; margin-bottom:18px; }
  .stat-chip{ background: var(--surface-alt); border-radius:10px; padding:10px 14px; min-width:78px; text-align:center; }
  .stat-chip .num{ font-family:'IBM Plex Mono', monospace; font-size:18px; font-weight:700; }
  .stat-chip .lbl{ font-size:10px; color: var(--ink-soft); text-transform:uppercase; letter-spacing:.04em; margin-top:2px; }
  .stats-section-title{ font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; color: var(--ink-soft); margin:18px 0 10px; }
  .trend-chart{ display:flex; align-items:flex-end; gap:4px; height:90px; }
  .trend-bar-wrap{ flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%; }
  .trend-bar{ width:100%; max-width:16px; background: var(--accent); border-radius:3px 3px 0 0; min-height:2px; }
  .trend-label{ font-size:8.5px; color: var(--ink-soft); margin-top:3px; }
  .stat-bar-row{ display:flex; align-items:center; gap:8px; margin-bottom:7px; }
  .stat-bar-label{ width:150px; flex-shrink:0; font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .stat-bar-track{ flex:1; height:8px; background:#E4E9E7; border-radius:20px; overflow:hidden; }
  .stat-bar-fill{ height:100%; border-radius:20px; }
  .stat-bar-fill.lab{ background: var(--accent); } .stat-bar-fill.prog{ background: var(--alistado); }
  .stat-bar-count{ width:26px; text-align:right; font-size:11px; color: var(--ink-soft); }

  .semana-nav{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
  .semana-rango{ font-weight:600; font-size:13.5px; text-transform:capitalize; }
  .semana-grid{ display:grid; grid-template-columns: repeat(7, 1fr); gap:10px; }
  .semana-dia{ background: var(--surface); border:1px solid var(--line); border-radius:12px; padding:10px; min-height:150px; display:flex; flex-direction:column; gap:8px; }
  .semana-dia.today{ border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
  .semana-dia-head{ display:flex; justify-content:space-between; align-items:baseline; }
  .semana-dow{ font-size:10.5px; text-transform:uppercase; color: var(--ink-soft); font-weight:700; }
  .semana-daynum{ font-size:15px; font-weight:700; }
  .semana-resumen{ display:flex; gap:4px; flex-wrap:wrap; }
  .mini-pill{ font-size:10px; font-weight:700; padding:1px 6px; border-radius:20px; }
  .mini-pill.pendiente{ background: var(--pendiente-bg); color: var(--pendiente); }
  .mini-pill.alistado{ background: var(--alistado-bg); color: var(--alistado); }
  .mini-pill.montado{ background: var(--montado-bg); color: var(--montado); }
  .mini-pill.entregado{ background: var(--entregado-bg); color: var(--entregado); }
  .mini-pill.recibido{ background: var(--recibido-bg); color: var(--recibido); }
  .mini-pill.descuento{ background: var(--descuento-bg); color: var(--descuento); }
  .mini-pill.empty{ background: var(--surface-alt); color: var(--ink-soft); }
  .semana-items{ display:flex; flex-direction:column; gap:4px; overflow-y:auto; max-height:170px; }
  .semana-item{ font-size:11px; padding:4px 6px; border-radius:6px; background: var(--surface-alt); cursor:pointer; display:flex; gap:5px; align-items:center; overflow:hidden; }
  .semana-item:hover{ background: var(--alistado-bg); }

  .badge{ font-size:11px; font-weight:700; padding: 3px 10px; border-radius: 20px; text-transform:uppercase; letter-spacing:.03em; white-space:nowrap; border:none; cursor:pointer; font-family:inherit; display:inline-flex; align-items:center; gap:6px; }
  .badge::before{ content:''; width:7px; height:7px; border-radius:50%; background:currentColor; }
  .badge.pendiente{ background: var(--pendiente-bg); color: var(--pendiente); }
  .badge.alistado{ background: var(--alistado-bg); color: var(--alistado); }
  .badge.montado{ background: var(--montado-bg); color: var(--montado); }
  .badge.entregado{ background: var(--entregado-bg); color: var(--entregado); }
  .badge.recibido{ background: var(--recibido-bg); color: var(--recibido); }
  .badge.descuento{ background: var(--descuento-bg); color: var(--descuento); }
  .badge.fin{ cursor:default; opacity:.85; }
  .status-back-btn{ background: var(--surface-alt); border:1px solid var(--line); color: var(--ink-soft); border-radius:50%; width:22px; height:22px; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; padding:0; }
  .status-back-btn:hover{ background: var(--pendiente-bg); color: var(--pendiente); border-color: var(--pendiente); }
  .card-actions{ display:flex; flex-direction:column; gap:6px; align-items:flex-end; flex-shrink:0; }
  .icon-btn{ background:none; border:none; cursor:pointer; color: var(--ink-soft); font-size:12px; padding:2px 4px; text-decoration: underline; font-family:inherit; }
  .icon-btn:hover{ color: var(--danger); } .icon-btn.danger{ color: var(--danger); font-weight:700; }
  .toggle-insumos{ color: var(--accent) !important; }
  .confirm-delete-text{ font-size:11.5px; color: var(--danger); font-weight:700; }
  .empty-state{ text-align:center; padding: 60px 20px; color: var(--ink-soft); }
  .empty-state .big{ font-size:15px; font-weight:600; color: var(--ink); margin-bottom:6px;}
  .loading{ padding: 40px; text-align:center; color: var(--ink-soft); font-size:13.5px;}

  /* ---------- Agenda semestral ---------- */
  .agenda-summary{ display:flex; gap:8px; flex-wrap:wrap; margin-bottom:14px; }
  .agenda-chip{ background:var(--surface-alt); border:1px solid var(--line); border-radius:10px; padding:8px 12px; font-size:12px; }
  .agenda-chip b{ font-family:'IBM Plex Mono',monospace; font-size:15px; display:block; }
  .agenda-opts{ display:flex; flex-direction:column; gap:8px; margin:12px 0; font-size:13px; }
  .agenda-opts label{ display:flex; gap:8px; align-items:flex-start; cursor:pointer; }
  .agenda-prev{ max-height:220px; overflow-y:auto; border:1px solid var(--line); border-radius:8px; margin-top:10px; }
  .agenda-prev table{ width:100%; border-collapse:collapse; font-size:11.5px; }
  .agenda-prev th{ position:sticky; top:0; background:var(--surface-alt); text-align:left; padding:6px 8px; font-size:10.5px; text-transform:uppercase; letter-spacing:.03em; }
  .agenda-prev td{ padding:6px 8px; border-top:1px solid var(--line); }
  .agenda-tag{ font-size:10px; font-weight:700; padding:1px 7px; border-radius:12px; }
  .agenda-tag.new{ background:var(--montado-bg); color:var(--montado); }
  .agenda-tag.upd{ background:var(--alistado-bg); color:var(--alistado); }
  .agenda-tag.skip{ background:var(--surface-alt); color:var(--ink-soft); }

  @media print{
    .fab, .rail, .toolbar, .panel, .top .btn, .card-actions, .alerts-box, .modal-overlay, .rail-mobile, .menu{ display:none !important; }
    .app{ display:block; } .main{ padding:0; max-width:none; }
    .card{ break-inside: avoid; border:1px solid #999; box-shadow:none; }
    .card-insumos{ display:block !important; background:none; border:1px solid #ccc; }
    body.printing-single .day-group{ display:none; }
    body.printing-single .day-group.print-target-group{ display:block; }
    body.printing-single .card{ display:none; }
    body.printing-single .card.print-target{ display:flex; }
  }
  @media (max-width: 900px){ .semana-grid{ grid-template-columns: repeat(auto-fit, minmax(140px,1fr)); } .stats{ grid-template-columns: repeat(2,1fr);} }
  @media (max-width: 760px){
    .rail{ display:none; } .main{ padding: 16px 16px 60px; } .rail-mobile{ display:flex; }
  }
</style>
</head>
<body>
<div class="brand-stripe"></div>

<div class="app">
  <nav class="rail" id="rail" aria-label="Navegación por fechas">
    <div class="rail-title">Fechas</div>
    <div id="railList"></div>
  </nav>

  <main class="main">
    <div class="top">
      <div>
        <p class="brand-eyebrow"><span class="dots"><i></i><i></i><i></i></span> Areandina · Laboratorios de Salud</p>
        <h1>Alistamiento de Laboratorios</h1>
        <p class="subtitle">Control de solicitudes de insumos por práctica</p>
      </div>
      <div class="stats" id="statsGrid">
        <div class="stat pend"><div class="row"><span class="ico">🖨️</span><span class="num" id="statPend">–</span></div><div class="label">Impresas por alistar</div><div class="bar"><div id="barPend" style="width:0%"></div></div></div>
        <div class="stat alist"><div class="row"><span class="ico">📦</span><span class="num" id="statAlist">–</span></div><div class="label">Alistadas por montar</div><div class="bar"><div id="barAlist" style="width:0%"></div></div></div>
        <div class="stat montado"><div class="row"><span class="ico">🧪</span><span class="num" id="statMontado">–</span></div><div class="label">Montadas activas</div><div class="bar"><div id="barMont" style="width:0%"></div></div></div>
        <div class="stat total"><div class="row"><span class="ico">📋</span><span class="num" id="statTotal">–</span></div><div class="label">Total registradas</div><div class="bar"><div id="barTotal" style="width:100%;background:var(--ink-soft)"></div></div></div>
      </div>
    </div>

    <div class="rail-mobile" id="railMobile"></div>
    <div class="alerts-box" id="alertsBox" style="display:none;"></div>

    <div class="toolbar" id="toolbar">
      <button class="btn btn-primary" id="btnNueva">+ Nueva práctica</button>
      <button class="btn btn-ghost" id="btnCargarAgenda" title="Subir el Reportes.xlsx con toda la agenda del semestre">📥 Agenda semestral</button>
      <input type="file" id="fileAgenda" accept=".xlsx,.xls" style="display:none;">
      <button class="btn btn-ghost" id="btnCargarExcel">📎 Excel</button>
      <input type="file" id="fileExcel" accept=".xlsx,.xls" style="display:none;">
      <input type="file" id="fileFormatoAdjunto" accept=".xlsx,.xls" style="display:none;">
      <div class="view-toggle" role="tablist">
        <button class="btn active" id="btnVistaLista">📋 Lista</button>
        <button class="btn" id="btnVistaSemana">🗓️ Semana</button>
      </div>
      <input type="text" class="search" id="search" placeholder="Buscar por docente, programa o laboratorio...">
      <select class="filter-estado" id="filterEstado">
        <option value="todos">Todos los estados</option>
        <option value="pendiente">Impreso</option>
        <option value="alistado">Alistado</option>
        <option value="montado">Montado</option>
        <option value="entregado">Entregado</option>
        <option value="recibido">Recibido</option>
        <option value="descuento">Descuento</option>
      </select>
      <button class="btn btn-ghost" id="btnMasFiltros">🔍 Filtros</button>
      <div class="menu" id="menuMore">
        <button class="btn btn-ghost" id="btnMenuToggle">··· Más</button>
        <div class="menu-panel">
          <button id="btnEstadisticas">📈 Estadísticas</button>
          <button id="btnInforme">📊 Informe por persona</button>
          <button id="btnArchivo">📦 Ver archivadas</button>
          <button id="btnExportarVista">📋 Exportar vista p/Claude</button>
          <button id="btnPrint">🖨️ Imprimir vista</button>
          <button id="btnImportar">⚙️ Importar datos</button>
          <button id="btnRefrescar">⟳ Actualizar ahora</button>
          <button id="btnReiniciar" class="danger">🗑️ Reiniciar datos</button>
        </div>
      </div>
    </div>

    <div class="panel filtros-panel" id="panelFiltros">
      <div class="grid">
        <div class="field"><label>Laboratorio</label><select id="fFiltroLab"><option value="todos">Todos</option></select></div>
        <div class="field"><label>Programa / carrera</label><select id="fFiltroPrograma"><option value="todos">Todos</option></select></div>
        <div class="field"><label>Persona (cualquier acción)</label><select id="fFiltroPersona"><option value="todos">Todos</option></select></div>
      </div>
      <div class="panel-actions">
        <button class="btn btn-ghost" id="btnLimpiarFiltros">Limpiar filtros</button>
      </div>
    </div>

    <div class="panel" id="panelForm">
      <h2 id="formTitle">Nueva práctica</h2>
      <div class="grid">
        <div class="field"><label>Fecha *</label><input type="date" id="fFecha"></div>
        <div class="field"><label>Hora inicio</label><input type="time" id="fHora"></div>
        <div class="field"><label>Hora finalización</label><input type="time" id="fHoraFin"></div>
        <div class="field"><label>Docente *</label><input type="text" id="fDocente" placeholder="Nombre del docente"></div>
        <div class="field"><label>Programa / carrera</label><input type="text" id="fPrograma" placeholder="Ej: Enfermería"></div>
        <div class="field"><label>Laboratorio</label>
          <select id="fLaboratorio"><option value="">Selecciona un laboratorio…</option></select>
          <input type="text" id="fLaboratorioOtro" placeholder="Escribe el nombre del laboratorio" style="display:none; margin-top:6px;">
        </div>
        <div class="field"><label>Estado</label>
          <select id="fEstado">
            <option value="pendiente">Impreso</option>
            <option value="alistado">Alistado</option>
            <option value="montado">Montado</option>
            <option value="entregado">Entregado</option>
            <option value="recibido">Recibido</option>
            <option value="descuento">Descuento</option>
          </select>
        </div>
      </div>
      <div class="grid" style="margin-top:12px;">
        <div class="field" style="grid-column: 1 / -1;"><label>Insumos solicitados</label><textarea id="fInsumos" placeholder="Uno por línea"></textarea></div>
        <div class="field" style="grid-column: 1 / -1;"><label>Notas</label><input type="text" id="fNotas" placeholder="Observaciones opcionales"></div>
      </div>
      <div class="panel-actions">
        <button class="btn btn-ghost" id="btnCancelar">Cancelar</button>
        <button class="btn btn-primary" id="btnGuardar">Guardar práctica</button>
      </div>
    </div>

    <div id="content"><div class="loading">Cargando prácticas…</div></div>
  </main>
</div>

<button class="fab fab-secondary btn-refresh-float" id="btnRefrescarFloat" title="Actualizar ahora" aria-label="Actualizar">⟳</button>
<button class="fab fab-primary back-to-top" id="btnBackToTop" title="Volver arriba" aria-label="Volver arriba">↑</button>

<div class="modal-overlay" id="statusModalOverlay"></div>
<div class="modal-overlay" id="agendaModalOverlay"></div>
<div class="modal-overlay" id="exportModalOverlay"></div>
<div class="modal-overlay" id="informeModalOverlay"></div>
<div class="modal-overlay" id="importModalOverlay"></div>
<div class="modal-overlay" id="statsModalOverlay"></div>
<div class="modal-overlay" id="resetModalOverlay"></div>

<script>
let practicas = [];
let editingId = null;
let showArchived = false;
let pendingDeleteId = null;
let pendingStatusChange = null;
let filtroLab = 'todos', filtroPrograma = 'todos', filtroPersona = 'todos';
let viewMode = 'lista', weekOffset = 0;
let openInsumos = new Set();
const STORAGE_KEY = 'practicas';
const PERSONAS = ['Brayan Murillo', 'Rocio Tovar', 'Karen Urrego', 'Jordy Cruz', 'Duvan Niño', 'Luis Maldonado'];
const LABORATORIOS = ['LAB PROCEDIMIENTOS BÁSICOS 1','LAB PROCEDIMIENTOS BÁSICOS 2','LAB PROCEDIMIENTOS BÁSICOS 3','LAB PROCEDIMIENTOS BÁSICOS 4','LAB PROCEDIMIENTOS BÁSICOS 5','LAB PROCEDIMIENTOS BÁSICOS 6','LABORATORIO DE RCCP','LAB PROCEDIMIENTOS BÁSICOS 7','LAB PROCEDIMIENTOS BÁSICOS 8','LAB SALA DE CIRUGÍA 1','LAB SALA DE CIRUGÍA 2','LAB SALA DE CIRUGÍA 3','LAB SALA DE CIRUGÍA 4','LABORATORIO MESA SECTRA','LAB SIMULACIÓN ALTA FIDELIDAD','LAB SALA DE PARTO','LAB EVALUACIÓN FISIOLÓGICA Y MOTRIZ','LAB E-SPORT Y REALIDAD VIRTUAL','LAB OPTOMETRÍA 1','LAB OPTOMETRÍA 2','LAB ENTRENAMIENTO MOTOR Y CARDIOPULMONAR','LAB ELECTRÓNICA ANÁLOGA DIGITAL','LAB PROTOTIPADO BIOMÉDICO','LAB TEJIDOS, BIOMATERIALES Y BIOLOGÍA MOLECULAR'];
const ESTADOS_ORDEN = ['pendiente','alistado','montado','entregado','recibido','descuento'];
const ESTADO_LABELS = { pendiente:'Impreso', alistado:'Alistado', montado:'Montado', entregado:'Entregado', recibido:'Recibido', descuento:'Descuento' };
const ACCIONES = [
  { key:'alistado', per:'alistadoPor', fecha:'alistadoFecha', badgeClass:'alistado', pillLabel:'alistadas', barLabel:'Alistó', countLabel:'Alistamientos realizados', listLabel:'Prácticas alistadas', textVerb:'Alistó' },
  { key:'montado', per:'montadoPor', fecha:'montadoFecha', badgeClass:'montado', pillLabel:'montadas', barLabel:'Montó', countLabel:'Montajes realizados', listLabel:'Prácticas montadas', textVerb:'Montó' },
  { key:'entregado', per:'entregadoPor', fecha:'entregadoFecha', badgeClass:'entregado', pillLabel:'entregadas', barLabel:'Entregó', countLabel:'Entregas realizadas', listLabel:'Prácticas entregadas', textVerb:'Entregó' },
  { key:'recibido', per:'recibidoPor', fecha:'recibidoFecha', badgeClass:'recibido', pillLabel:'recibidas', barLabel:'Recibió', countLabel:'Recepciones realizadas', listLabel:'Prácticas recibidas', textVerb:'Recibió' },
  { key:'descuento', per:'descuentoPor', fecha:'descuentoFecha', badgeClass:'descuento', pillLabel:'descontadas', barLabel:'Descontó', countLabel:'Descuentos realizados', listLabel:'Prácticas con descuento', textVerb:'Descontó' },
];

// Día operativo: NO cambia a medianoche; cambia después de las 10:00 pm.
// De 00:00 a 21:59 rige la fecha calendario; desde las 22:00 rige la del día siguiente.
function todayISO(){ const d=new Date(); if(d.getHours()>=22) d.setDate(d.getDate()+1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function uid(){ return 'p_'+Date.now()+'_'+Math.random().toString(36).slice(2,8); }
function escapeHTML(s){ return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function jsStr(s){ return (String(s||'')).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'&quot;').replace(/</g,'\\x3c'); }

async function loadData(){
  try{
    if(window.storage && window.storage.get){
      const res = await window.storage.get(STORAGE_KEY, true);
      practicas = res && res.value ? JSON.parse(res.value) : [];
    } else {
      const raw = localStorage.getItem(STORAGE_KEY);
      practicas = raw ? JSON.parse(raw) : [];
    }
  }catch(e){ practicas = []; }
  render();
}
async function saveData(){
  try{
    if(window.storage && window.storage.set){ await window.storage.set(STORAGE_KEY, JSON.stringify(practicas), true); }
    else { localStorage.setItem(STORAGE_KEY, JSON.stringify(practicas)); }
  }catch(e){ console.error('Error guardando', e); alert('No se pudo guardar. Intenta de nuevo.'); }
}
function formatDateTime(ts){ if(!ts) return ''; const d=new Date(ts); return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; }
const DOW=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const MONTHS=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function fmtDateLong(iso){ const [y,m,d]=iso.split('-').map(Number); const dt=new Date(y,m-1,d); return { dow:DOW[dt.getDay()], label:`${d} de ${MONTHS[m-1]} de ${y}` }; }
function statusLabel(s){ return ESTADO_LABELS[s]||s; }
function nextStatus(s){ const i=ESTADOS_ORDEN.indexOf(s); return i>-1 && i<ESTADOS_ORDEN.length-1 ? ESTADOS_ORDEN[i+1] : null; }
function prevStatus(s){ const i=ESTADOS_ORDEN.indexOf(s); return i>0 ? ESTADOS_ORDEN[i-1] : s; }

window.retrocederStatus = async (id) => {
  const p=practicas.find(x=>x.id===id); if(!p||p.estado==='pendiente') return;
  const acc=ACCIONES.find(a=>a.key===p.estado); if(acc){ delete p[acc.per]; delete p[acc.fecha]; }
  p.estado=prevStatus(p.estado); await saveData(); render();
};

const panel=document.getElementById('panelForm');
document.getElementById('btnNueva').onclick=()=>openForm();
document.getElementById('btnCancelar').onclick=()=>closeForm();
(function poblar(){ const sel=document.getElementById('fLaboratorio'); sel.innerHTML='<option value="">Selecciona un laboratorio…</option>'+LABORATORIOS.map(l=>`<option value="${escapeHTML(l)}">${escapeHTML(l)}</option>`).join('')+'<option value="__otro__">Otro (especificar)…</option>'; })();
document.getElementById('fLaboratorio').addEventListener('change',(e)=>{ const o=document.getElementById('fLaboratorioOtro'); if(e.target.value==='__otro__'){o.style.display='block';o.focus();} else {o.style.display='none';o.value='';} });
function setLaboratorioField(v){ const sel=document.getElementById('fLaboratorio'), o=document.getElementById('fLaboratorioOtro'); if(!v){sel.value='';o.style.display='none';o.value='';} else if(LABORATORIOS.includes(v)){sel.value=v;o.style.display='none';o.value='';} else {sel.value='__otro__';o.style.display='block';o.value=v;} }
function getLaboratorioField(){ const sel=document.getElementById('fLaboratorio'); if(sel.value==='__otro__') return document.getElementById('fLaboratorioOtro').value.trim(); return sel.value; }
function openForm(pr){ editingId=pr?pr.id:null; document.getElementById('formTitle').textContent=pr?'Editar práctica':'Nueva práctica'; document.getElementById('fFecha').value=pr?pr.fecha:todayISO(); document.getElementById('fHora').value=pr?(pr.hora||''):''; document.getElementById('fHoraFin').value=pr?(pr.horaFin||''):''; document.getElementById('fDocente').value=pr?pr.docente:''; document.getElementById('fPrograma').value=pr?pr.programa:''; setLaboratorioField(pr?pr.laboratorio:''); document.getElementById('fEstado').value=pr?pr.estado:'pendiente'; document.getElementById('fInsumos').value=pr?pr.insumos:''; document.getElementById('fNotas').value=pr?pr.notas:''; panel.classList.add('open'); document.getElementById('fDocente').focus(); }
function closeForm(){ panel.classList.remove('open'); editingId=null; }

document.getElementById('btnCargarExcel').onclick=()=>document.getElementById('fileExcel').click();
document.getElementById('fileExcel').addEventListener('change',handleExcelFile);
// ---------- Abrir en Montaje (sistema unificado): la app principal escucha 'smk_open_montaje' ----------
function tableroToast(msg){
  let t = document.getElementById('tableroToast');
  if(!t){ t = document.createElement('div'); t.id = 'tableroToast'; t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#2E342F;color:#fff;padding:10px 18px;border-radius:10px;font-size:13px;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.25)'; document.body.appendChild(t); }
  t.textContent = msg; t.style.display = 'block';
  clearTimeout(t._h); t._h = setTimeout(()=>{ t.style.display = 'none'; }, 3500);
}
window.abrirMontaje = (id) => {
  try{ localStorage.setItem('smk_open_montaje', JSON.stringify({ practicaId:id, at:Date.now() })); }catch(e){}
  if(window.parent === window){
    tableroToast('Abre el sistema unificado (index.html): el Montaje se abrirá allí.');
  } else {
    tableroToast('Abriendo Montaje…');
  }
};
// ---------- Adjuntar formato de insumos a una reserva existente ----------
let adjuntoPracticaId = null;
let pendingAdjunto = null;
window.adjuntarFormato = (id) => { adjuntoPracticaId = id; document.getElementById('fileFormatoAdjunto').click(); };
document.getElementById('fileFormatoAdjunto').addEventListener('change', handleAdjuntoFile);
async function handleAdjuntoFile(e){
  const f = e.target.files[0]; e.target.value = '';
  const p = practicas.find(x => x.id === adjuntoPracticaId); adjuntoPracticaId = null;
  if(!f || !p) return;
  try{
    const data = await f.arrayBuffer();
    const wb = XLSX.read(data, { type:'array', cellDates:true });
    const sn = wb.SheetNames.find(n=>/solicitud|insumo|formato/i.test(n)) || wb.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sn], { header:1, raw:true, defval:null });
    const parsed = parseFormatoInsumos(rows);
    if(!parsed.insumos){ alert('El formato no trae materiales.'); return; }
    pendingAdjunto = { parsed, practicaId: p.id, fileName: f.name };
    openAdjuntoModal();
  }catch(err){ console.error(err); alert('No se pudo leer el formato.'); }
}
function openAdjuntoModal(){
  const { parsed, practicaId, fileName } = pendingAdjunto;
  const p = practicas.find(x => x.id === practicaId);
  if(!p){ pendingAdjunto = null; return; }
  const nuevas = (parsed.insumos||'').split('\n').filter(x=>x.trim());
  const actuales = (p.insumos||'').split('\n').filter(x=>x.trim());
  const o = document.getElementById('agendaModalOverlay');
  o.innerHTML = `
    <div class="modal-box wide" role="dialog" aria-modal="true">
      <h3>📎 Adjuntar formato — ${escapeHTML(fileName)}</h3>
      <div class="modal-sub">Reserva de <b>${escapeHTML(p.docente||'—')}</b> · ${escapeHTML(p.fecha||'')} · ${escapeHTML(p.laboratorio||'sin laboratorio')} (tiene <b>${actuales.length}</b> material(es)). El archivo trae <b>${nuevas.length}</b> material(es).</div>
      <div class="agenda-prev"><table><tbody>
        ${nuevas.slice(0,12).map(l=>`<tr><td><span class="agenda-tag new">nuevo</span></td><td>${escapeHTML(l)}</td></tr>`).join('')}
      </tbody></table></div>
      ${nuevas.length>12?`<div class="modal-sub">Mostrando 12 de ${nuevas.length}…</div>`:''}
      <div class="modal-actions" style="margin-top:14px;flex-wrap:wrap">
        <button class="btn btn-ghost" onclick="closeAdjuntoModal()">Cancelar</button>
        <button class="btn btn-ghost" onclick="aplicarAdjunto('agregar')">Agregar al final</button>
        <button class="btn btn-primary" onclick="aplicarAdjunto('reemplazar')">Reemplazar materiales</button>
      </div>
    </div>`;
  o.classList.add('open');
}
window.closeAdjuntoModal = () => { pendingAdjunto = null; const o=document.getElementById('agendaModalOverlay'); o.classList.remove('open'); o.innerHTML=''; };
window.aplicarAdjunto = async (modo) => {
  if(!pendingAdjunto) return;
  const { parsed, practicaId, fileName } = pendingAdjunto;
  const p = practicas.find(x => x.id === practicaId);
  if(!p){ pendingAdjunto = null; return; }
  const nuevas = (parsed.insumos||'').split('\n').map(x=>x.trim()).filter(Boolean);
  const actuales = (p.insumos||'').split('\n').map(x=>x.trim()).filter(Boolean);
  p.insumos = (modo === 'reemplazar' ? nuevas : actuales.concat(nuevas.filter(n=>!actuales.includes(n)))).join('\n');
  if(parsed.programa && !p.programa) p.programa = parsed.programa;
  if(parsed.laboratorio && !p.laboratorio) p.laboratorio = parsed.laboratorio;
  p.notas = ((p.notas||'') + ' · Formato adjunto (' + fileName + ')').replace(/^ · /, '');
  pendingAdjunto = null;
  await saveData();
  try{ localStorage.setItem('smk_adjunto', JSON.stringify({ practicaId: p.id, fileName, at: Date.now() })); }catch(e){}
  closeAdjuntoModal(); render();
  scrollToDay(p.fecha);
};
async function handleExcelFile(e){
  const f=e.target.files[0]; if(!f) return;
  try{
    const data=await f.arrayBuffer();
    const wb=XLSX.read(data,{type:'array',cellDates:true});
    const sn=wb.SheetNames.find(n=>/solicitud|insumo|formato/i.test(n))||wb.SheetNames[0];
    const rows=XLSX.utils.sheet_to_json(wb.Sheets[sn],{header:1,raw:true,defval:null});
    const parsed=parseFormatoInsumos(rows);
    if(!parsed.docente && !parsed.fecha && !parsed.insumos){ alert('No se reconoció el formato. Usa el formato de solicitud de insumos.'); return; }
    const match=(parsed.fecha && parsed.docente) ? buscarReservaCoincidente(parsed) : null;
    if(match){ openInsumoMatchModal(parsed, match, f.name); }
    else { openForm(); fillFormFromParsed(parsed); }
  }catch(err){ console.error(err); alert('No se pudo leer el Excel.'); }finally{ e.target.value=''; }
}
// Localiza una celda cuyo texto normalizado contiene el objetivo
function findCell(rows, target){
  const t=normalizeText(target);
  for(let r=0;r<rows.length;r++){ const row=rows[r]||[]; for(let c=0;c<row.length;c++){ if(normalizeText(row[c]).includes(t)) return {r,c}; } }
  return null;
}
// Valor debajo de una etiqueta (misma columna, hasta 3 filas abajo, primer no vacío que no sea otra etiqueta)
function valueBelow(rows, r, c){
  const ETIQ=['NOMBRE','PROGRAMA','SEMESTRE','JORNADA','FECHA','LABORATORIO','OBSERVACIONES','CONSECUTIVO','DATOS','CONTROL'];
  for(let i=r+1;i<=Math.min(r+3,rows.length-1);i++){
    const v=(rows[i]||[])[c];
    if(v!==null&&v!==undefined&&String(v).trim()!==''){
      const isLabel=ETIQ.some(e=>normalizeText(v)===e||normalizeText(v).startsWith(e+' '));
      if(!isLabel) return v;
    }
  }
  return null;
}
function excelSerialToISO(v){
  if(typeof v!=='number'||v<20000||v>60000) return '';
  const d=new Date(Math.round((v-25569)*86400*1000));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
}
function fmtCantidad(v){
  if(v===null||v===undefined||v==='') return '';
  const n=Number(String(v).replace(',','.'));
  if(!isNaN(n)&&isFinite(n)) return String(Math.round(n*100)/100);
  return String(v).trim();
}
// Formato Tipo B: "SOLICITUD DE MATERIALES, EQUIPOS Y CONSUMIBLES" (ej. Entorno quirúrgico)
function parseFormatoTipoB(rows){
  const posNombre=findCell(rows,'NOMBRE');
  const posProg=findCell(rows,'PROGRAMA');
  const posSem=findCell(rows,'SEMESTRE');
  const posJor=findCell(rows,'JORNADA');
  const posFec=findCell(rows,'FECHA DE SOLICITUD');
  const posLab=findCell(rows,'LABORATORIO A UTILIZAR');
  const docente=posNombre?cleanName(valueBelow(rows,posNombre.r,posNombre.c)||''):cleanName(findLabelValue(rows,'NOMBRE',0)||'');
  const programa=posProg?cleanName(valueBelow(rows,posProg.r,posProg.c)||''):cellText(findLabelValue(rows,'PROGRAMA',0));
  let semestre='', jornada='';
  if(posSem){
    const v=valueBelow(rows,posSem.r,posSem.c);
    if(v!==null) semestre=cleanName(v);
    // Misma fila, otra columna (ej. SEMESTRE ... JORNADA en la misma fila de etiquetas)
    if(posJor && posJor.r===posSem.r){ const jv=valueBelow(rows,posJor.r,posJor.c); if(jv!==null) jornada=cleanName(jv); }
  }
  if(!jornada&&posJor){ const jv=valueBelow(rows,posJor.r,posJor.c); if(jv!==null) jornada=cleanName(jv); }
  // Fechas: fila siguiente a la etiqueta puede traer [solicitud, utilización, ..., horaIni, ..., horaFin]
  let fecha='', hi='', hf='';
  if(posFec){
    const fr=rows[posFec.r+1]||[];
    const fechas=[], horas=[];
    fr.forEach(v=>{
      let iso=excelDateToISO(v)||excelSerialToISO(v);
      if(iso) fechas.push(iso);
      else { const t=excelTimeToHHMM(v); if(t) horas.push(t); }
    });
    if(fechas.length>=2) fecha=fechas[1];
    else if(fechas.length===1) fecha=fechas[0];
    if(horas.length>=2){ hi=horas[0]; hf=horas[1]; }
    else if(horas.length===1){ hi=horas[0]; }
  }
  let laboratorio='';
  if(posLab){ const lv=valueBelow(rows,posLab.r,posLab.c); if(lv!==null&&String(lv).trim()!=='') laboratorio=normalizarLabAgenda(String(lv)); }
  // Tabla de materiales
  const mats=[];
  let headIdx=-1;
  for(let i=0;i<rows.length;i++){ if(normalizeText((rows[i]||[]).join(' ')).includes('MATERIALES Y/O EQUIPOS')){ headIdx=i; break; } }
  let start=headIdx+2;
  if(headIdx>-1){
    // Saltar sub-encabezado (Nº / CÓDIGO / NOMBRE...)
    for(let i=headIdx+1;i<=Math.min(headIdx+3,rows.length-1);i++){
      if(normalizeText((rows[i]||[]).join(' ')).includes('NOMBRE DEL MATERIAL')){ start=i+1; break; }
    }
    for(let i=start;i<rows.length;i++){
      const row=rows[i]||[];
      const line=normalizeText(row.join(' '));
      if(line.includes('RECIBIDO POR')||line.includes('ALISTAMIENTO POR')||line.includes('OBSERVACIONES DE RECIBIDO')) break;
      const n0=row[0];
      const isNum=n0!==null&&n0!==''&&!isNaN(parseFloat(n0))&&isFinite(n0);
      if(!isNum) { if(mats.length>0 && row.every(v=>v===null||v===undefined||String(v).trim()==='')) break; else continue; }
      // Nombre: texto más largo entre cols 1..7 (ignora puros números de placa)
      let nombre='';
      for(let c=1;c<=7;c++){
        const t=cellText(row[c]);
        if(t && isNaN(Number(t.replace(',','.'))) && t.length>nombre.length) nombre=t;
      }
      if(!nombre){ const cod=cellText(row[1]); if(cod) nombre='Código '+cod; else continue; }
      if(normalizeText(nombre).includes('NOMBRE DEL MATERIAL')) continue;
      // Cantidad: último numérico de la fila distinto del Nº
      let cant='';
      for(let c=row.length-1;c>=1;c--){
        const t=cellText(row[c]);
        if(t && !isNaN(Number(t.replace(',','.')))){ cant=fmtCantidad(t); break; }
      }
      mats.push(cant?`${cant} ${nombre}`:nombre);
    }
  }
  const np=[];
  if(semestre||jornada) np.push(`Sem ${semestre||'-'} · Jornada ${jornada||'-'}`);
  return { docente, programa, laboratorio, fecha, horaInicio:hi, horaFin:hf, insumos:mats.join('\n'), notas:np.join(' · '), formato:'B' };
}
function normDocente(s){ return normalizeText(s).replace(/\s+/g,' ').trim(); }
function buscarReservaCoincidente(parsed){
  const nd=normDocente(parsed.docente);
  const cand=practicas.filter(p=>p.fecha===parsed.fecha && normDocente(p.docente)===nd);
  if(!cand.length) return null;
  if(parsed.laboratorio){
    const nl=normalizeText(parsed.laboratorio);
    const exact=cand.find(p=>normalizeText(p.laboratorio||'').includes(nl)||nl.includes(normalizeText(p.laboratorio||'')));
    if(exact) return exact;
  }
  return cand[0];
}
function openInsumoMatchModal(parsed, match, fileName){
  const o=document.getElementById('agendaModalOverlay');
  const nMats=parsed.insumos?parsed.insumos.split('\n').filter(Boolean).length:0;
  o.innerHTML=`
    <div class="modal-box wide" role="dialog" aria-modal="true">
      <h3>📎 Formato de insumos — ${escapeHTML(fileName)}</h3>
      <div class="modal-sub">Se encontró la reserva de <b>${escapeHTML(match.docente)}</b> el ${escapeHTML(match.fecha)}${match.hora?' · '+escapeHTML(match.hora):''} (${escapeHTML(match.laboratorio||'sin laboratorio')}). El archivo trae <b>${nMats}</b> material(es).</div>
      <div class="agenda-prev"><table><thead><tr><th></th><th>Detalle</th></tr></thead><tbody>
        <tr><td><span class="agenda-tag upd">reserva</span></td><td>${escapeHTML(match.docente)} · ${escapeHTML(match.fecha)} · ${escapeHTML(match.laboratorio||'—')} · Insumos actuales: ${(match.insumos||'').split('\n').filter(Boolean).length}</td></tr>
        <tr><td><span class="agenda-tag new">archivo</span></td><td>${escapeHTML(parsed.docente||'—')} · ${escapeHTML(parsed.fecha||'—')} · ${escapeHTML(parsed.laboratorio||'—')} · Materiales: ${nMats}</td></tr>
      </tbody></table></div>
      ${parsed.insumos?`<div class="agenda-prev" style="margin-top:8px"><table><tbody>${parsed.insumos.split('\n').slice(0,12).map(l=>`<tr><td>${escapeHTML(l)}</td></tr>`).join('')}</tbody></table></div>`:''}
      <div class="modal-actions" style="margin-top:14px;flex-wrap:wrap">
        <button class="btn btn-ghost" onclick="closeAgendaModal()">Cancelar</button>
        <button class="btn btn-ghost" onclick="crearInsumoComoNuevo()">Crear como nueva</button>
        <button class="btn btn-primary" onclick="confirmSobrescribirInsumos('${jsStr(match.id)}')">Sobrescribir materiales</button>
      </div>
    </div>`;
  o.classList.add('open');
  window._pendingParsedInsumo=parsed;
}
window.confirmSobrescribirInsumos=async(id)=>{
  const p=practicas.find(x=>x.id===id); const parsed=window._pendingParsedInsumo;
  if(!p||!parsed) return;
  p.insumos=parsed.insumos;
  if(parsed.programa && !p.programa) p.programa=parsed.programa;
  if(parsed.laboratorio && !p.laboratorio) p.laboratorio=parsed.laboratorio;
  if(parsed.hora && !p.hora) p.hora=parsed.hora;
  if(parsed.horaFin && !p.horaFin) p.horaFin=parsed.horaFin;
  const extra=`Insumos actualizados desde formato (${new Date().toLocaleDateString()})`;
  p.notas=p.notas?`${p.notas} · ${extra}`:extra;
  window._pendingParsedInsumo=null;
  await saveData(); closeAgendaModal(); render();
  scrollToDay(p.fecha);
};
window.crearInsumoComoNuevo=()=>{ const parsed=window._pendingParsedInsumo; window._pendingParsedInsumo=null; closeAgendaModal(); openForm(); if(parsed) fillFormFromParsed(parsed); };
function normalizeText(s){ return (s==null?'':String(s)).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim(); }
function cellText(v){ return v==null?'':String(v).trim(); }
function findLabelValue(rows,label,col){ const t=normalizeText(label); for(let i=0;i<rows.length;i++){ if(normalizeText((rows[i]||[])[col]).includes(t)) return (rows[i+1]||[])[col]; } return null; }
function excelDateToISO(v){ if(v instanceof Date&&!isNaN(v)) return `${v.getFullYear()}-${String(v.getMonth()+1).padStart(2,'0')}-${String(v.getDate()).padStart(2,'0')}`; if(typeof v==='number'&&v>20000&&v<60000) return excelSerialToISO(v); if(typeof v==='string'&&v.trim()){ let m=v.trim().match(/^(\d{4})-(\d{2})-(\d{2})/); if(m) return `${m[1]}-${m[2]}-${m[3]}`; m=v.trim().match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/); if(m){ let y=m[3]; if(y.length===2) y='20'+y; return `${y}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`; } } return ''; }
function excelTimeToHHMM(v){ if(v instanceof Date&&!isNaN(v)) return `${String(v.getHours()).padStart(2,'0')}:${String(v.getMinutes()).padStart(2,'0')}`; if(typeof v==='number'){ const tm=Math.round((v-Math.floor(v))*24*60); return `${String(Math.floor(tm/60)%24).padStart(2,'0')}:${String(tm%60).padStart(2,'0')}`; } if(typeof v==='string'&&v.trim()){ const m=v.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/); if(m){ let h=parseInt(m[1],10); if(m[3]&&m[3].toUpperCase()==='PM'&&h<12) h+=12; if(m[3]&&m[3].toUpperCase()==='AM'&&h===12) h=0; return `${String(h).padStart(2,'0')}:${m[2]}`; } } return ''; }
function parseFormatoTipoA(rows){ const docente=cellText(findLabelValue(rows,'NOMBRE Y APELLIDO',0)); const programa=cellText(findLabelValue(rows,'PROGRAMA',0)); const asignatura=cellText(findLabelValue(rows,'ASIGNATURA',4)); const tema=cellText(findLabelValue(rows,'TEMA',7)); const semestre=cellText(findLabelValue(rows,'SEMESTRE',0)); const grupo=cellText(findLabelValue(rows,'GRUPO',3)); const jornada=cellText(findLabelValue(rows,'JORNADA',4)); const nEst=cellText(findLabelValue(rows,'DE ESTUDIANTES',7)); const lab=cellText(findLabelValue(rows,'LABORATORIO A UTILIZAR',0)); const sede=cellText(findLabelValue(rows,'SEDE',7)); const fecha=excelDateToISO(findLabelValue(rows,'FECHA DE UTILIZACION',4)); let hi='',hf=''; outer: for(let i=0;i<rows.length;i++){ for(let c=0;c<(rows[i]||[]).length;c++){ if(normalizeText(rows[i][c]).includes('HORARIO DE UTILIZACION')){ hi=excelTimeToHHMM((rows[i+1]||[])[c]); hf=excelTimeToHHMM((rows[i+1]||[])[c+1]); if(!hi&&!hf){ hi=excelTimeToHHMM((rows[i+2]||[])[c]); hf=excelTimeToHHMM((rows[i+2]||[])[c+1]); } break outer; } } } const mats=[]; for(let i=0;i<rows.length;i++){ const r=rows[i]||[]; const n=r[0]; const nom=cellText(r[3]); if(n!==null&&n!==''&&!isNaN(parseFloat(n))&&isFinite(n)&&nom&&normalizeText(nom)!=='NOMBRE DEL MATERIAL, EQUIPOS Y/O SIMULADORES'){ const c=cellText(r[5]); mats.push(c?`${c} ${nom}`:nom); } } const np=[]; if(asignatura) np.push(`Asignatura: ${asignatura}`); if(tema) np.push(`Tema: ${tema}`); if(semestre||grupo||jornada) np.push(`Sem ${semestre||'-'} · Grupo ${grupo||'-'} · ${jornada||'-'}`); if(nEst) np.push(`${nEst} estudiantes`); if(sede) np.push(`Sede ${sede}`); return { docente, programa, laboratorio: lab||(sede?`Sede ${sede}`:''), fecha, horaInicio:hi, horaFin:hf, insumos:mats.join('\n'), notas:np.join(' · ') }; }
// Despachador: detecta Tipo B (SOLICITUD DE MATERIALES...) o usa Tipo A clásico
function parseFormatoInsumos(rows){
  const all=normalizeText((rows||[]).map(r=>(r||[]).join(' ')).join(' '));
  if(all.includes('MATERIALES Y/O EQUIPOS SOLICITADOS')||all.includes('DATOS DEL SOLICITANTE')){
    try{ const b=parseFormatoTipoB(rows); if(b&&(b.docente||b.fecha||b.insumos)) return b; }catch(e){ console.warn('Tipo B falló, usando A', e); }
  }
  return parseFormatoTipoA(rows);
}
function fillFormFromParsed(p){ if(p.docente) document.getElementById('fDocente').value=p.docente; if(p.programa) document.getElementById('fPrograma').value=p.programa; if(p.laboratorio) setLaboratorioField(p.laboratorio); if(p.fecha) document.getElementById('fFecha').value=p.fecha; if(p.horaInicio) document.getElementById('fHora').value=p.horaInicio; if(p.horaFin) document.getElementById('fHoraFin').value=p.horaFin; if(p.insumos) document.getElementById('fInsumos').value=p.insumos; if(p.notas) document.getElementById('fNotas').value=p.notas; document.getElementById('formTitle').textContent='📎 Práctica cargada desde Excel — revisa y guarda'; }

// ---------- Agenda semestral (Reportes.xlsx) ----------
// Columnas esperadas (insensible a orden/acentos): Id, Recurso, Fecha, Hora, Hora Fin,
// Nombre Solicitante, Programa, Semestre, Asignatura, Práctica, NRC, Número de Estudiantes,
// Estado, Comentarios, Entregado por, Devuelto por, Archivos Adjuntos.
let pendingAgenda = null;
document.getElementById('btnCargarAgenda').onclick = () => document.getElementById('fileAgenda').click();
document.getElementById('fileAgenda').addEventListener('change', handleAgendaFile);

function normHeader(s){ return (s==null?'':String(s)).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[:\s]+$/,'').trim(); }
function cleanName(s){ return (s==null?'':String(s)).replace(/\s+/g,' ').trim(); }
function titleCase(s){ return cleanName(s).toLowerCase().replace(/(^|\s|\(|\.|-)(\S)/g, (m,p,c)=>p+c.toUpperCase()); }

function normalizarLabAgenda(recurso){
  const base = cleanName(String(recurso||'').split('(')[0]).toUpperCase().replace(/\s+/g,' ').trim();
  if(!base) return '';
  const hit = LABORATORIOS.find(l => base === l || base.startsWith(l) || l.startsWith(base));
  if(hit) return hit;
  return base.charAt(0) + base.slice(1).toLowerCase();
}

function agendaEstadoToTablero(est){
  const t = normalizeText(est);
  if(!t) return 'pendiente';
  if(t.includes('DEVUELTO')) return 'recibido';
  if(t.includes('ENTREGADO')) return 'entregado';
  if(t.includes('NO ASIST')) return 'descuento';
  return 'pendiente';
}

function parseAgendaReport(rows){
  if(!rows || rows.length < 2) throw new Error('empty');
  const head = rows[0].map(normHeader);
  const col = (names) => { for(const n of names){ const i = head.indexOf(normHeader(n)); if(i > -1) return i; } return -1; };
  const cId = col(['ID','NO']);
  const cRec = col(['RECURSO']);
  const cFec = col(['FECHA']);
  const cHor = col(['HORA']);
  const cHorFin = col(['HORA FIN']);
  const cSol = col(['NOMBRE SOLICITANTE','SOLICITANTE']);
  const cProg = col(['PROGRAMA']);
  const cSem = col(['SEMESTRE']);
  const cAsig = col(['ASIGNATURA']);
  const cPrac = col(['PRACTICA']);
  const cNrc = col(['NRC']);
  const cEst = col(['NUMERO DE ESTUDIANTES','NÚMERO DE ESTUDIANTES']);
  const cEstado = col(['ESTADO']);
  const cCom = col(['COMENTARIOS']);
  const cEnt = col(['ENTREGADO POR']);
  const cDev = col(['DEVUELTO POR']);
  const cAdj = col(['ARCHIVOS ADJUNTOS']);
  if(cId < 0 || cFec < 0 || cSol < 0) throw new Error('headers');
  const out = [];
  for(let i = 1; i < rows.length; i++){
    const r = rows[i] || [];
    const agendaId = cleanName(r[cId]);
    const docenteRaw = cleanName(r[cSol]);
    const fecha = excelDateToISO(r[cFec]);
    if(!agendaId || !docenteRaw || !fecha) continue;
    const hora = excelTimeToHHMM(r[cHor]);
    const horaFin = cHorFin > -1 ? excelTimeToHHMM(r[cHorFin]) : '';
    const programa = cProg > -1 ? cleanName(r[cProg]) : '';
    const laboratorio = cRec > -1 ? normalizarLabAgenda(r[cRec]) : '';
    const agendaEstado = cEstado > -1 ? cleanName(r[cEstado]) : '';
    const notasParts = [];
    if(cAsig > -1 && cleanName(r[cAsig])) notasParts.push('Asignatura: ' + cleanName(r[cAsig]));
    if(cPrac > -1 && cleanName(r[cPrac])) notasParts.push('Práctica: ' + cleanName(r[cPrac]));
    if(cSem > -1 && cleanName(r[cSem])) notasParts.push('Semestre: ' + cleanName(r[cSem]));
    if(cNrc > -1 && cleanName(r[cNrc])) notasParts.push('NRC: ' + cleanName(r[cNrc]));
    if(cEst > -1 && cleanName(r[cEst])) notasParts.push(cleanName(r[cEst]) + ' estudiantes');
    if(cCom > -1 && cleanName(r[cCom])) notasParts.push('Obs: ' + cleanName(r[cCom]));
    if(cEnt > -1 && cleanName(r[cEnt])) notasParts.push('Entregó (agenda): ' + cleanName(r[cEnt]));
    if(cDev > -1 && cleanName(r[cDev])) notasParts.push('Devolvió (agenda): ' + cleanName(r[cDev]));
    if(cAdj > -1 && cleanName(r[cAdj])) notasParts.push('Adjunto: ' + cleanName(r[cAdj]).split('/').pop());
    notasParts.push('Agenda ID: ' + agendaId + (agendaEstado ? ' · ' + agendaEstado : ''));
    out.push({
      agendaId, fecha, hora, horaFin,
      docente: titleCase(docenteRaw),
      programa, laboratorio,
      estado: agendaEstadoToTablero(agendaEstado),
      agendaEstado,
      insumos: '',
      notas: notasParts.join(' · ')
    });
  }
  return out;
}

async function handleAgendaFile(e){
  const f = e.target.files[0];
  e.target.value = '';
  if(!f) return;
  try{
    const data = await f.arrayBuffer();
    const wb = XLSX.read(data, { type:'array', cellDates:true });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { header:1, raw:true, defval:null });
    const items = parseAgendaReport(rows);
    if(!items.length){ alert('No se encontraron filas válidas (se requiere Id, Fecha y Solicitante).'); return; }
    const existentes = new Map(practicas.filter(p=>p.agendaId).map(p=>[String(p.agendaId), p]));
    let nuevas = 0, actualizar = 0;
    items.forEach(it => { if(existentes.has(String(it.agendaId))) actualizar++; else nuevas++; });
    pendingAgenda = items;
    openAgendaModal(items, nuevas, actualizar, f.name);
  }catch(err){
    console.error(err);
    alert('No se pudo leer el Reportes.xlsx. Verifica que la primera fila tenga los encabezados (Id, Recurso, Fecha, Hora, Nombre Solicitante, Programa, Estado...).');
  }
}

function openAgendaModal(items, nuevas, actualizar, fileName){
  const porLab = {};
  items.forEach(it => { porLab[it.laboratorio || 'Sin laboratorio'] = (porLab[it.laboratorio || 'Sin laboratorio'] || 0) + 1; });
  const topLabs = Object.entries(porLab).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const o = document.getElementById('agendaModalOverlay');
  o.innerHTML = `
    <div class="modal-box wide" role="dialog" aria-modal="true">
      <h3>📥 Agenda semestral — ${escapeHTML(fileName)}</h3>
      <div class="modal-sub">Se detectaron <b>${items.length}</b> prácticas. Nada se guarda hasta que confirmes. El ID de agenda evita duplicados si vuelves a subir el archivo.</div>
      <div class="agenda-summary">
        <div class="agenda-chip"><b>${nuevas}</b>nuevas</div>
        <div class="agenda-chip"><b>${actualizar}</b>ya existen (se actualizan)</div>
        <div class="agenda-chip"><b>${topLabs.length}</b>laboratorios top</div>
      </div>
      <div class="agenda-opts">
        <label><input type="checkbox" id="agKeep" checked> Conservar mi avance de alistamiento (si ya alisté/monté una práctica, no se sobrescribe su estado)</label>
        <label><input type="checkbox" id="agOnlyFuture"> Solo importar desde hoy hacia adelante (omitir fechas pasadas)</label>
      </div>
      <div class="modal-sub">Top laboratorios: ${topLabs.map(([l,c])=>`${escapeHTML(l)} (${c})`).join(' · ')}</div>
      <div class="agenda-prev"><table><thead><tr><th></th><th>Fecha</th><th>Hora</th><th>Docente</th><th>Laboratorio</th></tr></thead><tbody>
        ${items.slice(0,30).map(it=>`<tr><td><span class="agenda-tag ${practicas.some(p=>String(p.agendaId)===String(it.agendaId))?'upd':'new'}">${practicas.some(p=>String(p.agendaId)===String(it.agendaId))?'existe':'nueva'}</span></td><td>${escapeHTML(it.fecha)}</td><td>${escapeHTML(it.hora||'—')}</td><td>${escapeHTML(it.docente)}</td><td>${escapeHTML(it.laboratorio||'—')}</td></tr>`).join('')}
      </tbody></table></div>
      ${items.length>30?`<div class="modal-sub">Mostrando 30 de ${items.length}…</div>`:''}
      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="closeAgendaModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="confirmAgendaImport()">Importar ${items.length} prácticas</button>
      </div>
    </div>`;
  o.classList.add('open');
}
window.closeAgendaModal = () => { pendingAgenda = null; const o=document.getElementById('agendaModalOverlay'); o.classList.remove('open'); o.innerHTML=''; };
window.confirmAgendaImport = async () => {
  if(!pendingAgenda) return;
  const keep = document.getElementById('agKeep').checked;
  const onlyFuture = document.getElementById('agOnlyFuture').checked;
  const t = todayISO();
  const byId = new Map(practicas.map(p=>[String(p.agendaId||p.id), p]));
  let add=0, upd=0, skip=0;
  pendingAgenda.forEach(it => {
    if(onlyFuture && it.fecha < t){ skip++; return; }
    const key = String(it.agendaId);
    const ex = byId.get(key);
    if(ex){
      if(keep && ex.estado && ex.estado !== 'pendiente'){
        Object.assign(ex, { fecha:it.fecha, hora:it.hora, horaFin:it.horaFin, docente:it.docente, programa:it.programa, laboratorio:it.laboratorio, notas:it.notas });
      } else {
        Object.assign(ex, { fecha:it.fecha, hora:it.hora, horaFin:it.horaFin, docente:it.docente, programa:it.programa, laboratorio:it.laboratorio, estado:it.estado, notas:it.notas });
      }
      upd++;
    } else {
      practicas.push({ id:'agenda_'+key+'_'+Date.now().toString(36), agendaId:it.agendaId, creado:Date.now(), fecha:it.fecha, hora:it.hora, horaFin:it.horaFin, docente:it.docente, programa:it.programa, laboratorio:it.laboratorio, estado:it.estado, agendaEstado:it.agendaEstado, insumos:it.insumos, notas:it.notas });
      add++;
    }
  });
  pendingAgenda = null;
  await saveData();
  closeAgendaModal();
  render();
  alert(`Agenda importada: ${add} nuevas, ${upd} actualizadas${skip?`, ${skip} omitidas (pasadas)`:''}.`);
};

document.getElementById('btnGuardar').onclick=async()=>{ const fecha=document.getElementById('fFecha').value, docente=document.getElementById('fDocente').value.trim(); if(!fecha||!docente){ alert('La fecha y el docente son obligatorios.'); return; } const hora=document.getElementById('fHora').value, horaFin=document.getElementById('fHoraFin').value; if(hora&&horaFin&&horaFin<hora){ alert('La hora de finalización no puede ser anterior al inicio.'); return; } const data={ fecha, hora, horaFin, docente, programa:document.getElementById('fPrograma').value.trim(), laboratorio:getLaboratorioField(), estado:document.getElementById('fEstado').value, insumos:document.getElementById('fInsumos').value, notas:document.getElementById('fNotas').value.trim() }; if(editingId){ const i=practicas.findIndex(p=>p.id===editingId); if(i>-1) practicas[i]={...practicas[i],...data}; } else practicas.push({id:uid(),creado:Date.now(),...data}); await saveData(); closeForm(); render(); };

document.getElementById('search').addEventListener('input',()=>{ alertFocusId=null; render(); });
document.getElementById('filterEstado').addEventListener('change',()=>{ alertFocusId=null; render(); });
document.getElementById('btnPrint').onclick=()=>window.print();
document.getElementById('btnExportarVista').onclick=()=>{ toggleMenu(false); printVista(); };
document.getElementById('btnInforme').onclick=()=>{ toggleMenu(false); openInformeModal(); };
document.getElementById('btnImportar').onclick=()=>{ toggleMenu(false); openImportModal(); };
document.getElementById('btnReiniciar').onclick=()=>{ toggleMenu(false); openResetModal(); };
document.getElementById('btnRefrescar').onclick=()=>{ toggleMenu(false); loadData(); };
document.getElementById('btnArchivo').onclick=()=>{ toggleMenu(false); showArchived=!showArchived; render(); };
function toggleMenu(force){ const m=document.getElementById('menuMore'); if(typeof force==='boolean') m.classList.toggle('open',force); else m.classList.toggle('open'); }
document.getElementById('btnMenuToggle').onclick=(e)=>{ e.stopPropagation(); toggleMenu(); };
document.addEventListener('click',(e)=>{ if(!document.getElementById('menuMore').contains(e.target)) toggleMenu(false); });

function archivedCount(){ const t=todayISO(); return practicas.filter(p=>p.fecha<t).length; }
function updateArchivoBtn(){ const b=document.getElementById('btnArchivo'); const n=archivedCount(); b.textContent=showArchived?'📦 Ocultar archivadas':(n>0?`📦 Ver archivadas (${n})`:'📦 Ver archivadas'); }
document.getElementById('btnVistaLista').onclick=()=>{ viewMode='lista'; render(); };
document.getElementById('btnVistaSemana').onclick=()=>{ viewMode='semana'; render(); };
document.getElementById('btnEstadisticas').onclick=()=>{ toggleMenu(false); openEstadisticasModal(); };
document.getElementById('btnMasFiltros').onclick=()=>{ poblarFiltrosAvanzados(); document.getElementById('panelFiltros').classList.toggle('open'); };
document.getElementById('fFiltroLab').addEventListener('change',(e)=>{ filtroLab=e.target.value; alertFocusId=null; render(); });
document.getElementById('fFiltroPrograma').addEventListener('change',(e)=>{ filtroPrograma=e.target.value; alertFocusId=null; render(); });
document.getElementById('fFiltroPersona').addEventListener('change',(e)=>{ filtroPersona=e.target.value; alertFocusId=null; render(); });
document.getElementById('btnLimpiarFiltros').onclick=()=>{ filtroLab=filtroPrograma=filtroPersona='todos'; poblarFiltrosAvanzados(); render(); };

function allPersonas(){ const s=new Set(PERSONAS); practicas.forEach(p=>ACCIONES.forEach(a=>{ if(p[a.per]) s.add(p[a.per]); })); return [...s].sort(); }
function allLaboratorios(){ const s=new Set(LABORATORIOS); practicas.forEach(p=>{ if(p.laboratorio) s.add(p.laboratorio); }); return [...s].sort(); }
function poblarFiltrosAvanzados(){
  const progs=[...new Set(practicas.map(p=>p.programa).filter(Boolean))].sort();
  document.getElementById('fFiltroLab').innerHTML='<option value="todos">Todos</option>'+allLaboratorios().map(l=>`<option value="${escapeHTML(l)}" ${filtroLab===l?'selected':''}>${escapeHTML(l)}</option>`).join('');
  document.getElementById('fFiltroPrograma').innerHTML='<option value="todos">Todos</option>'+progs.map(pr=>`<option value="${escapeHTML(pr)}" ${filtroPrograma===pr?'selected':''}>${escapeHTML(pr)}</option>`).join('');
  document.getElementById('fFiltroPersona').innerHTML='<option value="todos">Todos</option>'+allPersonas().map(n=>`<option value="${escapeHTML(n)}" ${filtroPersona===n?'selected':''}>${escapeHTML(n)}</option>`).join('');
}
function updateFiltrosBtn(){ const n=[filtroLab,filtroPrograma,filtroPersona].filter(v=>v!=='todos').length; document.getElementById('btnMasFiltros').textContent=n>0?`🔍 Filtros (${n})`:'🔍 Filtros'; }
function matchesFilters(p){ const q=document.getElementById('search').value.trim().toLowerCase(); const est=document.getElementById('filterEstado').value; if(est!=='todos'&&p.estado!==est) return false; if(filtroLab!=='todos'&&p.laboratorio!==filtroLab) return false; if(filtroPrograma!=='todos'&&p.programa!==filtroPrograma) return false; if(filtroPersona!=='todos'&&!ACCIONES.some(a=>p[a.per]===filtroPersona)) return false; if(q&&!`${p.docente} ${p.programa} ${p.laboratorio}`.toLowerCase().includes(q)) return false; return true; }
function getFiltered(){ if(alertFocusId){ const p=practicas.find(x=>x.id===alertFocusId); return p?[p]:[]; } const q=document.getElementById('search').value.trim(); const t=todayISO(); return practicas.filter(p=>{ if(!matchesFilters(p)) return false; if(!q&&!showArchived&&p.fecha<t) return false; return true; }); }

function render(){ updateArchivoBtn(); updateFiltrosBtn(); updateViewToggle(); renderAlerts(); renderStats(); renderRail(); if(viewMode==='semana') renderSemana(); else renderContent(); }
function updateViewToggle(){ document.getElementById('btnVistaLista').classList.toggle('active',viewMode==='lista'); document.getElementById('btnVistaSemana').classList.toggle('active',viewMode==='semana'); }
function daysUntil(f){ const [y1,m1,d1]=todayISO().split('-').map(Number); const [y2,m2,d2]=f.split('-').map(Number); return Math.round((new Date(y2,m2-1,d2)-new Date(y1,m1-1,d1))/86400000); }
function getAlerts(){ const now=new Date(), t=todayISO(), out=[]; practicas.forEach(p=>{ if(!p.fecha) return; if(p.estado==='pendiente'){ const d=daysUntil(p.fecha); if(d>=-1&&d<=1) out.push({kind:'alistar',p,urgency:d<=0?2:1}); } if(p.estado==='alistado'&&p.hora&&p.fecha===t){ const diff=(new Date(`${p.fecha}T${p.hora}`)-now)/60000; if(diff<=30&&diff>-180) out.push({kind:'montar',p,diffMin:diff,urgency:diff<=0?2:1}); } }); return out.sort((a,b)=>(b.urgency-a.urgency)||a.p.fecha.localeCompare(b.p.fecha)||(a.p.hora||'').localeCompare(b.p.hora||'')); }
function alertGroup(a){
  if(a.urgency===2) return 'urg';
  if(a.kind==='montar') return 'hoy';
  const d=daysUntil(a.p.fecha);
  if(d===0) return 'hoy';
  return 'manana';
}
const ALERT_GROUPS=[{k:'urg',t:'🔴 Urgentes — acción inmediata'},{k:'hoy',t:'🟠 Para hoy'},{k:'manana',t:'🟡 Para mañana'}];
function alertText(a){ if(a.kind==='alistar'){ const d=daysUntil(a.p.fecha); const w=d<0?`hace ${Math.abs(d)} día${Math.abs(d)===1?'':'s'}`:(d===0?'hoy':'mañana'); return `Falta alistar — <b>${escapeHTML(a.p.docente)}</b> es ${w} y sigue como Impreso.`; } const m=Math.round(a.diffMin); return `Falta montar — <b>${escapeHTML(a.p.docente)}</b> ${m<=0?`empezó hace ${Math.abs(m)} min`:`empieza en ${m} min`} y sigue como Alistado.`; }
function alertMeta(a){
  if(a.kind==='alistar'){
    const d=daysUntil(a.p.fecha);
    const when=d<0?`Venció hace ${Math.abs(d)} día${Math.abs(d)===1?'':'s'}`:(d===0?'Es hoy':'Es mañana');
    return { icon:'🧾', title:`Falta alistar · ${a.p.docente}`, sub:`${when} · ${a.p.fecha}${a.p.hora?' · '+a.p.hora:''} · sigue como Impreso` };
  }
  const m=Math.round(a.diffMin);
  const when=m<=0?`Empezó hace ${Math.abs(m)} min`:`Empieza en ${m} min`;
  return { icon:'🧪', title:`Falta montar · ${a.p.docente}`, sub:`${when} · ${a.p.hora||''} · sigue como Alistado` };
}
function alertKey(a){ return a.kind+':'+a.p.id; }
let dismissedAlerts=new Set();
window.dismissAlert=(key,fecha)=>{
  dismissedAlerts.add(key);
  const ev=window.event; if(ev) ev.stopPropagation();
  renderAlerts();
};
const BASE_TITLE=document.title;
function renderAlerts(){
  const box=document.getElementById('alertsBox');
  const al=getAlerts().filter(a=>!dismissedAlerts.has(alertKey(a)));
  if(!al.length){ box.style.display='none'; box.innerHTML=''; document.title=BASE_TITLE; return; }
  const urg=al.filter(a=>alertGroup(a)==='urg').length;
  box.style.display='flex';
  let html=`<div class="alerts-head"><span class="alerts-title ${urg?'urgent':''}">⚠️ Requieren atención <span class="alerts-count ${urg?'urgent':''}">${al.length}</span></span>${dismissedAlerts.size?`<button class="alerts-restore" onclick="restoreAlerts()">Mostrar ocultas (${dismissedAlerts.size})</button>`:''}</div>`;
  ALERT_GROUPS.forEach(g=>{
    const items=al.filter(a=>alertGroup(a)===g.k);
    if(!items.length) return;
    html+=`<div class="alerts-group"><div class="alerts-group-head ${g.k==='urg'?'urg':''}">${g.t} <span class="g-count">${items.length}</span></div>`+items.map(a=>{
      const m=alertMeta(a); const k=alertKey(a);
      return `<div class="alert-item ${a.urgency===2?'urgent':''}" onclick="focusPractica('${jsStr(a.p.id)}')" role="button" tabindex="0" title="Mostrar solo esta práctica"><span class="alert-ico">${m.icon}</span><span class="alert-body"><span class="alert-title">${escapeHTML(m.title)}</span><span class="alert-sub" style="display:block">${escapeHTML(m.sub)}${a.p.laboratorio?' · '+escapeHTML(a.p.laboratorio):''}</span></span><span class="alert-go">Ver solo esta →</span><button class="alert-dismiss" title="Ocultar por ahora" onclick="dismissAlert('${jsStr(k)}','${jsStr(a.p.fecha)}')">✕</button></div>`;
    }).join('')+`</div>`;
  });
  box.innerHTML=html;
  document.title=`(${al.length}) ${BASE_TITLE}`;
}
window.restoreAlerts=()=>{ dismissedAlerts.clear(); renderAlerts(); };
function goToAlert(f){ scrollToDay(f); }
// Foco en una sola práctica (al clicar una alerta): solo se muestra esa tarjeta.
let alertFocusId = null;
function focusPractica(id){
  const p=practicas.find(x=>x.id===id); if(!p) return;
  alertFocusId=id;
  if(viewMode!=='lista') viewMode='lista';
  render();
  requestAnimationFrame(()=>{
    let card=null;
    try{ card=document.querySelector(`.card[data-id="${CSS.escape(id)}"]`); }catch(e){}
    if(card) card.scrollIntoView({behavior:'smooth',block:'center'});
  });
}
window.focusPractica=focusPractica;
window.clearFocus=()=>{ alertFocusId=null; render(); };
function renderStats(){ const tot=Math.max(practicas.length,1); const pe=practicas.filter(p=>p.estado==='pendiente').length, al=practicas.filter(p=>p.estado==='alistado').length, mo=practicas.filter(p=>p.estado==='montado').length; document.getElementById('statPend').textContent=pe; document.getElementById('statAlist').textContent=al; document.getElementById('statMontado').textContent=mo; document.getElementById('statTotal').textContent=practicas.length; document.getElementById('barPend').style.width=(pe/tot*100)+'%'; document.getElementById('barAlist').style.width=(al/tot*100)+'%'; document.getElementById('barMont').style.width=(mo/tot*100)+'%'; }
function renderRail(){ const f=getFiltered(); const by={}; f.forEach(p=>{ (by[p.fecha]=by[p.fecha]||{total:0,pend:0}); by[p.fecha].total++; if(['pendiente','alistado'].includes(p.estado)) by[p.fecha].pend++; }); const ds=Object.keys(by).sort(); const t=todayISO(); const html=ds.length?ds.map(d=>{ const info=fmtDateLong(d); const c=by[d]; return `<div class="rail-item ${d===t?'today':''} ${d<t?'archived':''}" data-date="${escapeHTML(d)}" onclick="scrollToDay('${jsStr(d)}')"><span class="rail-date">${d===t?'<b>Hoy</b> · ':''}${d.slice(8,10)} ${MONTHS[parseInt(d.slice(5,7))-1].slice(0,3)}<span class="dow">${info.dow}</span></span><span class="rail-count ${c.pend===0?'zero':''}">${c.pend>0?c.pend:c.total}</span></div>`; }).join(''):'<div class="rail-empty">Sin fechas registradas.</div>'; document.getElementById('railList').innerHTML=html; document.getElementById('railMobile').innerHTML=ds.map(d=>`<button class="chip ${d===t?'today':''}" onclick="scrollToDay('${jsStr(d)}')">${d===t?'Hoy · ':''}${d.slice(8,10)}/${d.slice(5,7)} <span class="n">${by[d].pend||by[d].total}</span></button>`).join(''); }
function scrollToDay(date){ alertFocusId=null; if(viewMode!=='lista'){ viewMode='lista'; } if(date<todayISO()&&!showArchived) showArchived=true; render(); requestAnimationFrame(()=>{ const el=document.getElementById('day-'+date); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); }); }

function renderContent(){
  const content=document.getElementById('content'), filtered=getFiltered(), query=document.getElementById('search').value.trim();
  if(!practicas.length){ content.innerHTML=`<div class="empty-state"><div class="big">Todavía no hay prácticas registradas</div><div>Usa "+ Nueva práctica" para empezar.</div></div>`; return; }
  const nA=archivedCount();
  const focusBanner=alertFocusId?(()=>{ const fp=practicas.find(x=>x.id===alertFocusId); return `<div class="archive-note" style="border-style:solid;border-color:var(--accent)">🔍 Mostrando solo: <b>${escapeHTML(fp?fp.docente:'')}</b> (${escapeHTML(fp?fp.fecha:'')}${fp&&fp.hora?' · '+escapeHTML(fp.hora):''}) <button onclick="clearFocus()">Ver todo</button></div>`; })():'';
  const note=(!showArchived&&!query&&nA>0)?`<div class="archive-note">📦 ${nA} práctica${nA===1?'':'s'} archivada${nA===1?'':'s'}. <button onclick="document.getElementById('btnArchivo').click()">Mostrarlas</button></div>`:'';
  if(!filtered.length){ content.innerHTML=focusBanner+note+`<div class="empty-state"><div class="big">No hay resultados</div><div>Ajusta la búsqueda o filtros.</div></div>`; return; }
  const by={}; filtered.forEach(p=>{ (by[p.fecha]=by[p.fecha]||[]).push(p); });
  const t=todayISO();
  content.innerHTML=focusBanner+note+Object.keys(by).sort().map(date=>{ const info=fmtDateLong(date); const items=by[date].sort((a,b)=>(a.hora||'').localeCompare(b.hora||'')); const arch=date<t; return `<div class="day-group ${arch?'archived':''}" id="day-${escapeHTML(date)}"><div class="day-head"><span class="d1">${info.label}</span><span class="d2">${info.dow}</span>${date===t?'<span class="badge-today">Hoy</span>':''}${arch?'<span class="badge-archived">Archivada</span>':''}</div>${items.map(cardHTML).join('')}</div>`; }).join('');
}

function getMonday(d){ const x=new Date(d); const day=x.getDay(); x.setDate(x.getDate()+(day===0?-6:1-day)); return x; }
function getWeekDates(off){ const t=new Date(); t.setHours(0,0,0,0); const m=getMonday(t); m.setDate(m.getDate()+off*7); const out=[]; for(let i=0;i<7;i++){ const d=new Date(m); d.setDate(m.getDate()+i); out.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`); } return out; }
window.cambiarSemana=(d,r)=>{ weekOffset=r?0:weekOffset+d; renderSemana(); };
function renderSemana(){ const wd=getWeekDates(weekOffset); const matched=practicas.filter(matchesFilters); const by={}; wd.forEach(d=>by[d]=[]); matched.forEach(p=>{ if(by[p.fecha]!==undefined) by[p.fecha].push(p); }); const t=todayISO(); content.innerHTML=`<div class="semana-nav"><button class="btn btn-ghost" onclick="cambiarSemana(-1)">← Anterior</button><span class="semana-rango">${fmtDateLong(wd[0]).label} — ${fmtDateLong(wd[6]).label}</span><span><button class="btn btn-ghost" onclick="cambiarSemana(0,true)">Hoy</button> <button class="btn btn-ghost" onclick="cambiarSemana(1)">Siguiente →</button></span></div><div class="semana-grid">${wd.map(d=>{ const items=by[d].sort((a,b)=>(a.hora||'').localeCompare(b.hora||'')); const info=fmtDateLong(d); return `<div class="semana-dia ${d===t?'today':''}"><div class="semana-dia-head"><span class="semana-dow">${info.dow.slice(0,3)}</span><span class="semana-daynum">${d.slice(8,10)}</span></div><div class="semana-resumen">${ESTADOS_ORDEN.map(s=>{ const c=items.filter(p=>p.estado===s).length; return c?`<span class="mini-pill ${s}">${c}</span>`:''; }).join('')||'<span class="mini-pill empty">–</span>'}</div><div class="semana-items">${items.map(p=>`<div class="semana-item" onclick="scrollToDay('${jsStr(d)}')" title="${escapeHTML(p.docente)}">${p.hora?`<span class="mono" style="color:var(--ink-soft)">${escapeHTML(p.hora)}</span>`:''}<span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHTML(p.docente)}</span></div>`).join('')}</div></div>`; }).join('')}</div>`; }
const content=document.getElementById('content');

function cardHTML(p){
  const insId='ins-'+p.id; const open=openInsumos.has(p.id)?' open':'';
  const tr=p.hora&&p.horaFin?`${escapeHTML(p.hora)} – ${escapeHTML(p.horaFin)}`:(p.hora||p.horaFin?escapeHTML(p.hora||p.horaFin):'');
  const badge=`<button class="badge ${p.estado}" onclick="cycleStatus('${jsStr(p.id)}')" title="Clic para elegir acción y persona"> ${statusLabel(p.estado)}</button>`;
  const back=p.estado!=='pendiente'?`<button class="status-back-btn" onclick="retrocederStatus('${jsStr(p.id)}')" title="Retroceder (corregir)">↩</button>`:'';
  const trail=ACCIONES.filter(a=>p[a.per]).map(a=>`<div>✔ <b>${a.textVerb}:</b> ${escapeHTML(p[a.per])} · ${formatDateTime(p[a.fecha])}</div>`).join('');
  return `<div class="card${p.id===alertFocusId?' focused':''}" data-id="${escapeHTML(p.id)}"><div class="card-main"><div class="card-top">${tr?`<span class="card-time">${tr}</span>`:''}<span class="card-docente">${escapeHTML(p.docente)}</span>${badge}${back}</div><div class="card-meta">${[p.programa,p.laboratorio].filter(Boolean).map(escapeHTML).join(' · ')||'—'}</div>${p.notas?`<div class="card-notas">${escapeHTML(p.notas)}</div>`:''}${trail?`<div class="timeline">${trail}</div>`:''}${p.insumos?`<div><button class="icon-btn toggle-insumos" onclick="toggleInsumos('${jsStr(p.id)}')">${open?'Ocultar insumos':'Ver insumos'}</button></div><div class="card-insumos${open}" id="${escapeHTML(insId)}">${escapeHTML(p.insumos)}</div>`:''}</div><div class="card-actions">${p.id===pendingDeleteId?`<span class="confirm-delete-text">¿Eliminar?</span><button class="icon-btn danger" onclick="confirmDelete('${jsStr(p.id)}')">Sí, eliminar</button><button class="icon-btn" onclick="cancelDelete()">Cancelar</button>`:`<button class="icon-btn" onclick="printPractica('${jsStr(p.id)}')">📋 Exportar</button><button class="icon-btn" onclick="printSingle('${jsStr(p.id)}')">🖨️ Imprimir</button><button class="icon-btn" onclick="adjuntarFormato('${jsStr(p.id)}')">📎 Adjuntar formato</button><button class="icon-btn" onclick="abrirMontaje('${jsStr(p.id)}')">🛠 Montaje</button><button class="icon-btn" onclick="editPractica('${jsStr(p.id)}')">Editar</button><button class="icon-btn" onclick="deletePractica('${jsStr(p.id)}')">Eliminar</button>`}</div></div>`;
}
window.toggleInsumos=(id)=>{ if(openInsumos.has(id)) openInsumos.delete(id); else openInsumos.add(id); const el=document.getElementById('ins-'+CSS.escape(id)); const btn=el?el.previousElementSibling?.querySelector('button'):null; if(el){ el.classList.toggle('open'); if(btn) btn.textContent=el.classList.contains('open')?'Ocultar insumos':'Ver insumos'; } };
window.cycleStatus=(id)=>{ openStatusModal(id); };
async function applyStatusChange(id,nx,per){
  const p=practicas.find(x=>x.id===id); if(!p) return;
  const newIdx=ESTADOS_ORDEN.indexOf(nx); if(newIdx<0) return;
  p.estado=nx;
  if(nx==='pendiente'){ ACCIONES.forEach(a=>{ delete p[a.per]; delete p[a.fecha]; }); }
  else{
    const acc=ACCIONES.find(a=>a.key===nx);
    if(per&&acc){ p[acc.per]=per; p[acc.fecha]=Date.now(); }
    ACCIONES.forEach(a=>{ if(ESTADOS_ORDEN.indexOf(a.key)>newIdx){ delete p[a.per]; delete p[a.fecha]; } });
  }
  await saveData(); closeStatusModal(); render();
}
function openStatusModal(id){
  const p=practicas.find(x=>x.id===(id||(pendingStatusChange&&pendingStatusChange.id)));
  if(!p) return;
  pendingStatusChange={id:p.id};
  const sug=nextStatus(p.estado)||p.estado;
  const stepIdx=ESTADOS_ORDEN.indexOf(p.estado);
  const o=document.getElementById('statusModalOverlay');
  o.innerHTML=`<div class="modal-box" role="dialog" aria-modal="true" aria-label="Cambiar estado">
    <h3>¿Quién realiza?</h3>
    <div class="modal-sub">Clic en el estado para actualizar la práctica. Elige la acción y la persona responsable.</div>
    <div class="status-practice">
      <div class="row"><b>${escapeHTML(p.docente)}</b><span class="badge ${p.estado} fin">${statusLabel(p.estado)}</span></div>
      <div style="margin-top:4px;color:var(--ink-soft)">${escapeHTML(p.fecha||'')} ${p.hora?'· '+escapeHTML(p.hora):''} ${p.laboratorio?'· '+escapeHTML(p.laboratorio):''}</div>
      <div class="status-steps">${ESTADOS_ORDEN.map((s,i)=>`<span class="${i<=stepIdx?'done':''}" title="${statusLabel(s)}"></span>`).join('')}</div>
    </div>
    <div class="status-field"><label for="statusActionSelect">Acción / estado</label>
      <select id="statusActionSelect">${ESTADOS_ORDEN.map(s=>`<option value="${s}" ${s===sug?'selected':''}>${statusLabel(s)}${s===p.estado?' (actual)':''}</option>`).join('')}</select>
    </div>
    <div class="status-field" id="statusPersonWrap"><label for="statusPersonSelect">Persona que realiza</label>
      <select id="statusPersonSelect"><option value="">Selecciona una persona…</option>${allPersonas().map(n=>`<option value="${escapeHTML(n)}">${escapeHTML(n)}</option>`).join('')}</select>
    </div>
    <div class="status-hint" id="statusHint"></div>
    <div class="modal-actions"><button class="btn btn-ghost" onclick="closeStatusModal()">Cancelar</button><button class="btn btn-primary" onclick="confirmStatusChange()">Guardar</button></div>
  </div>`;
  o.classList.add('open');
  const act=o.querySelector('#statusActionSelect');
  const updateHint=()=>{
    const v=act.value; const wrap=o.querySelector('#statusPersonWrap'); const hint=o.querySelector('#statusHint');
    wrap.style.display=v==='pendiente'?'none':'block';
    if(v==='pendiente') hint.textContent='Volverá a Impreso y se borrará el registro de personas (para reabrir el flujo).';
    else if(ESTADOS_ORDEN.indexOf(v)<stepIdx) hint.textContent='Retrocederá el flujo: se conservará hasta la acción elegida y se borrarán los pasos posteriores.';
    else if(v===p.estado) hint.textContent='Actualizará (o corregirá) la persona responsable de este paso.';
    else hint.textContent='Avanzará el flujo hasta la acción elegida y quedará registrada la persona.';
  };
  act.addEventListener('change',updateHint); updateHint();
  setTimeout(()=>act.focus(),50);
}
window.onStatusActionChange=()=>{};
window.confirmStatusChange=()=>{
  if(!pendingStatusChange) return;
  const act=document.getElementById('statusActionSelect'); const per=document.getElementById('statusPersonSelect');
  const nx=act.value;
  if(nx!=='pendiente'){
    const v=per.value;
    if(!v){ per.style.borderColor='var(--danger)'; per.focus(); return; }
    applyStatusChange(pendingStatusChange.id,nx,v);
  } else applyStatusChange(pendingStatusChange.id,nx,null);
};
window.closeStatusModal=()=>{ pendingStatusChange=null; const o=document.getElementById('statusModalOverlay'); o.classList.remove('open'); o.innerHTML=''; };

function openExportModal(t,x){ const o=document.getElementById('exportModalOverlay'); o.innerHTML=`<div class="modal-box wide" role="dialog" aria-modal="true"><h3>${escapeHTML(t)}</h3><div class="modal-sub">Copia con Ctrl+C y pégalo en Claude para generar el PDF.</div><textarea class="export-area" id="exportTextArea" readonly></textarea><div class="modal-actions"><button class="btn btn-primary" onclick="closeExportModal()">Listo</button></div></div>`; o.classList.add('open'); const ta=document.getElementById('exportTextArea'); ta.value=x; ta.focus(); ta.select(); }
window.closeExportModal=()=>{ const o=document.getElementById('exportModalOverlay'); o.classList.remove('open'); o.innerHTML=''; };
function reportStamp(){ return new Date().toLocaleString('es-CO',{dateStyle:'medium',timeStyle:'short'}); }
function reportHeader(title, lines){
  return [`${title}`,`Generado: ${reportStamp()}`,...(lines||[]),`${'='.repeat(60)}`].join('\n');
}
function practicaToText(p, idx){
  const tr=p.hora&&p.horaFin?`${p.hora} – ${p.horaFin}`:(p.hora||p.horaFin||'sin hora');
  const info=fmtDateLong(p.fecha);
  const L=[];
  L.push(`${idx!=null?`[${idx}] `:''}${p.docente} — ${info.label} (${info.dow}) · ${tr} · Estado: ${statusLabel(p.estado)}`);
  const meta=[p.programa,p.laboratorio].filter(Boolean).join(' | ');
  if(meta) L.push(`  ${meta}`);
  const trail=ACCIONES.filter(a=>p[a.per]).map(a=>`${a.textVerb} ${p[a.per]} (${formatDateTime(p[a.fecha])})`).join('  →  ');
  if(trail) L.push(`  Trazabilidad: ${trail}`);
  if(p.notas) L.push(`  Notas: ${p.notas}`);
  if(p.agendaId) L.push(`  Agenda ID: ${p.agendaId}${p.agendaEstado?' · '+p.agendaEstado:''}`);
  if(p.insumos){ const items=p.insumos.split('\n').filter(Boolean); L.push(`  Insumos (${items.length}):`); items.forEach(it=>L.push(`    - ${it}`)); }
  else L.push('  Insumos: (sin registrar)');
  return L.join('\n');
}
window.printPractica=(id)=>{ const p=practicas.find(x=>x.id===id); if(!p) return; openExportModal(`Exportar — ${p.docente}`,`PRÁCTICA — pídele a Claude: "genera un PDF"\n${'='.repeat(50)}\n\n${practicaToText(p)}`); };
window.printSingle=(id)=>{ const p=practicas.find(x=>x.id===id); if(!p) return; document.body.classList.add('printing-single'); render(); requestAnimationFrame(()=>{ document.querySelectorAll('.day-group').forEach(g=>g.classList.remove('print-target-group')); document.querySelectorAll('.card').forEach(c=>c.classList.remove('print-target')); const card=document.querySelector(`.card[data-id="${CSS.escape(p.id)}"]`); if(card){ card.classList.add('print-target'); card.closest('.day-group').classList.add('print-target-group'); } window.print(); setTimeout(()=>document.body.classList.remove('printing-single'),500); }); };
window.printVista=()=>{
  const f=getFiltered();
  if(!f.length){ alert('No hay prácticas para exportar.'); return; }
  const q=document.getElementById('search').value.trim();
  const est=document.getElementById('filterEstado').value;
  const filt=[filtroLab,filtroPrograma,filtroPersona].filter(v=>v!=='todos').length;
  const counts=ESTADOS_ORDEN.map(s=>`${statusLabel(s)}: ${f.filter(p=>p.estado===s).length}`).join(' · ');
  const by={}; f.forEach(p=>{ (by[p.fecha]=by[p.fecha]||[]).push(p); });
  let n=0;
  const b=Object.keys(by).sort().map(d=>{
    const info=fmtDateLong(d);
    const items=by[d].sort((a,b)=>(a.hora||'').localeCompare(b.hora||''));
    const resumen=ESTADOS_ORDEN.map(s=>{ const c=items.filter(p=>p.estado===s).length; return c?`${statusLabel(s)} ${c}`:''; }).filter(Boolean).join(', ');
    return `── ${info.label} (${info.dow}) — ${items.length} práctica${items.length===1?'':'s'}${resumen?' · '+resumen:''} ──\n\n`+items.map(p=>practicaToText(p,++n)).join('\n\n');
  }).join('\n\n');
  const head=reportHeader('ALISTAMIENTO DE LABORATORIOS — Reporte de vista',[
    `Prácticas incluidas: ${f.length} (de ${practicas.length} totales)`,
    `Filtros: búsqueda "${q||'—'}" · estado ${est} · filtros avanzados ${filt}`,
    `${counts}`,
    `Pídele a Claude: "genera un PDF con esta vista"`
  ]);
  openExportModal('Exportar vista completa',`${head}\n\n${b}\n\n${'-'.repeat(60)}\nFirmas:\n\nElaboró: ______________________      Revisó: ______________________\nFecha: __________`);
};

function computeEstadisticas(){ const ec={pendiente:0,alistado:0,montado:0,entregado:0,recibido:0,descuento:0}; const lab={},prog={}; practicas.forEach(p=>{ if(ec[p.estado]!==undefined) ec[p.estado]++; if(p.laboratorio) lab[p.laboratorio]=(lab[p.laboratorio]||0)+1; if(p.programa) prog[p.programa]=(prog[p.programa]||0)+1; }); const t=new Date(); t.setHours(0,0,0,0); const trend=[]; for(let i=13;i>=0;i--){ const d=new Date(t); d.setDate(t.getDate()-i); const iso=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; trend.push({fecha:iso,count:practicas.filter(p=>p.fecha===iso).length}); } return {estadoCounts:ec,labCounts:lab,progCounts:prog,trend,total:practicas.length}; }
window.openEstadisticasModal=()=>{ const {estadoCounts,labCounts,progCounts,trend,total}=computeEstadisticas(); const mx=Math.max(1,...trend.map(t=>t.count)); const o=document.getElementById('statsModalOverlay'); o.innerHTML=`<div class="modal-box informe-box" role="dialog" aria-modal="true"><h3>📈 Estadísticas</h3><div class="modal-sub">Tiempo real · ${total} prácticas</div><div class="stats-summary">${Object.entries(estadoCounts).map(([k,v])=>`<div class="stat-chip"><div class="num">${v}</div><div class="lbl">${statusLabel(k)}</div></div>`).join('')}</div><div class="stats-section-title">Últimos 14 días</div><div class="trend-chart">${trend.map(t=>`<div class="trend-bar-wrap" title="${fmtDateLong(t.fecha).label}: ${t.count}"><div class="trend-bar" style="height:${t.count?Math.max(Math.round(t.count/mx*100),6):2}%"></div><div class="trend-label">${t.fecha.slice(8,10)}</div></div>`).join('')}</div><div class="stats-section-title">Laboratorios top</div>${statBarRows(Object.entries(labCounts).sort((a,b)=>b[1]-a[1]).slice(0,8),'lab')}<div class="stats-section-title">Programas top</div>${statBarRows(Object.entries(progCounts).sort((a,b)=>b[1]-a[1]).slice(0,6),'prog')}<div class="modal-actions" style="justify-content:space-between"><button class="btn btn-ghost" onclick="closeEstadisticasModal()">Cerrar</button><button class="btn btn-primary" onclick="closeEstadisticasModal();verEstadisticas();">📋 Exportar reporte</button></div></div>`; o.classList.add('open'); };
window.verEstadisticas=()=>{
  const {estadoCounts,labCounts,progCounts,trend,total}=computeEstadisticas();
  const av=total?Math.round(((estadoCounts.alistado+estadoCounts.montado+estadoCounts.entregado+estadoCounts.recibido+estadoCounts.descuento)/total)*100):0;
  const topL=Object.entries(labCounts).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([l,c],i)=>`  ${i+1}. ${l} — ${c}`).join('\n')||'  (sin datos)';
  const topP=Object.entries(progCounts).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([l,c],i)=>`  ${i+1}. ${l} — ${c}`).join('\n')||'  (sin datos)';
  const tr=trend.map(t=>`  ${t.fecha}: ${t.count}`).join('\n');
  const head=reportHeader('REPORTE ESTADÍSTICO — Alistamiento de laboratorios',[
    `Total prácticas: ${total} · Avance (fuera de Impreso): ${av}%`,
    ESTADOS_ORDEN.map(s=>`${statusLabel(s)}: ${estadoCounts[s]}`).join(' · '),
    `Pídele a Claude: "genera un PDF con este reporte"`
  ]);
  openExportModal('Exportar estadísticas',`${head}\n\nLABORATORIOS TOP:\n${topL}\n\nPROGRAMAS TOP:\n${topP}\n\nPRÁCTICAS POR DÍA (últimos 14 días):\n${tr}`);
};
function statBarRows(en,cls){ if(!en.length) return '<div class="informe-empty">Sin datos</div>'; const mx=Math.max(1,...en.map(([,c])=>c)); return en.map(([n,c])=>`<div class="stat-bar-row"><div class="stat-bar-label" title="${escapeHTML(n)}">${escapeHTML(n)}</div><div class="stat-bar-track"><div class="stat-bar-fill ${cls}" style="width:${Math.max(Math.round(c/mx*100),4)}%"></div></div><div class="stat-bar-count">${c}</div></div>`).join(''); }
window.closeEstadisticasModal=()=>{ const o=document.getElementById('statsModalOverlay'); o.classList.remove('open'); o.innerHTML=''; };
function computeCounts(){ const c={}; allPersonas().forEach(n=>{ c[n]={}; ACCIONES.forEach(a=>c[n][a.key]=[]); }); practicas.forEach(p=>ACCIONES.forEach(a=>{ const per=p[a.per]; if(per){ if(!c[per]){ c[per]={}; ACCIONES.forEach(x=>c[per][x.key]=[]); } c[per][a.key].push(p); } })); return c; }
window.openInformeModal=()=>{ const c=computeCounts(); const names=Object.keys(c); const mx=Math.max(1,...names.flatMap(n=>ACCIONES.map(a=>c[n][a.key].length))); const totAct=names.reduce((s,n)=>s+ACCIONES.reduce((x,a)=>x+c[n][a.key].length,0),0); const o=document.getElementById('informeModalOverlay'); o.innerHTML=`<div class="modal-box informe-box" role="dialog" aria-modal="true"><h3>📊 Informe por persona</h3><div class="modal-sub">${totAct} acciones registradas · ${names.filter(n=>ACCIONES.some(a=>c[n][a.key].length)).length} personas con actividad · Toca un nombre para ver detalle.</div><div class="informe-list">${names.map((n,i)=>informePersonaHTML(n,c[n],mx,i)).join('')}</div><div class="modal-actions" style="justify-content:space-between"><button class="btn btn-ghost" onclick="closeInformeModal()">Cerrar</button><button class="btn btn-primary" onclick="closeInformeModal();verInforme();">📋 Exportar reporte</button></div></div>`; o.classList.add('open'); };
function informePersonaHTML(name,c,mx,idx){ const det=`inf-${idx}`; const tot=ACCIONES.reduce((s,a)=>s+c[a.key].length,0); return `<div class="informe-person"><div class="informe-person-head" onclick="toggleInformeDetalle('${det}')"><span class="informe-person-name">${escapeHTML(name)}</span><span class="informe-person-counts">${ACCIONES.map(a=>c[a.key].length?`<span class="pill pill-${a.badgeClass}">${c[a.key].length} ${a.pillLabel}</span>`:'').join('')||'<span class="pill pill-empty">Sin registros</span>'}</span></div>${ACCIONES.map(a=>`<div class="informe-bar-row"><div class="informe-bar-label">${a.barLabel}</div><div class="informe-bar-track"><div class="informe-bar-fill ${a.badgeClass}" style="width:${c[a.key].length?Math.max(Math.round(c[a.key].length/mx*100),4):0}%"></div></div></div>`).join('')}${tot?`<div class="informe-detalle" id="${det}" style="display:none">${ACCIONES.map(a=>c[a.key].length?`<div class="informe-detalle-title">${a.listLabel}</div><ul class="informe-mini-list">${c[a.key].slice().sort((x,y)=>x.fecha.localeCompare(y.fecha)).map(x=>`<li onclick="closeInformeModal();goToAlert('${jsStr(x.fecha)}')">${fmtDateLong(x.fecha).label} — ${escapeHTML(x.docente)}</li>`).join('')}</ul>`:'').join('')}</div>`:''}</div>`; }
window.toggleInformeDetalle=(id)=>{ const el=document.getElementById(id); if(el) el.style.display=el.style.display==='none'?'block':'none'; };
window.closeInformeModal=()=>{ const o=document.getElementById('informeModalOverlay'); o.classList.remove('open'); o.innerHTML=''; };
window.verInforme=()=>{
  const c=computeCounts();
  const tot=ACCIONES.map(a=>`${a.countLabel}: ${practicas.filter(p=>p[a.per]).length}`).join(' · ');
  const b=Object.keys(c).sort().map(n=>{
    let s=`● ${n}`;
    ACCIONES.forEach(a=>s+=`\n  ${a.countLabel}: ${c[n][a.key].length}`);
    ACCIONES.forEach(a=>{
      if(c[n][a.key].length) s+=`\n  ${a.listLabel}:\n`+c[n][a.key].slice().sort((x,y)=>(x.fecha+x.hora).localeCompare(y.fecha+y.hora)).map(x=>`    - ${x.fecha}${x.hora?' '+x.hora:''} · ${x.docente}${x.laboratorio?' · '+x.laboratorio:''} · ${statusLabel(x.estado)}`).join('\n');
    });
    return s;
  }).join('\n\n');
  const head=reportHeader('INFORME DE ACTIVIDAD POR PERSONA',[
    `${tot}`,
    `Personas con actividad: ${Object.keys(c).filter(n=>ACCIONES.some(a=>c[n][a.key].length)).length} de ${Object.keys(c).length}`,
    `Pídele a Claude: "genera un PDF con este informe"`
  ]);
  openExportModal('Informe por persona',`${head}\n\n${b}\n\n${'-'.repeat(60)}\nFirmas:\n\nElaboró: ______________________      Revisó: ______________________`);
};
window.openResetModal=()=>{ const o=document.getElementById('resetModalOverlay'); o.innerHTML=`<div class="modal-box" role="dialog" aria-modal="true"><h3>⚠️ Reiniciar todo</h3><div class="modal-sub">Elimina ${practicas.length} prácticas para todos. No se puede deshacer. Escribe <b>REINICIAR</b> y la clave.</div><input type="text" id="resetConfirmInput" placeholder="REINICIAR" autocomplete="off"><input type="password" id="resetPinInput" placeholder="Clave" autocomplete="off" inputmode="numeric"><div class="modal-actions"><button class="btn btn-ghost" onclick="closeResetModal()">Cancelar</button><button class="btn btn-primary" id="btnConfirmReset" style="background:var(--danger)" disabled onclick="confirmReset()">Eliminar todo</button></div></div>`; o.classList.add('open'); const t=document.getElementById('resetConfirmInput'), pi=document.getElementById('resetPinInput'); t.focus(); const chk=()=>{ document.getElementById('btnConfirmReset').disabled=!(t.value.trim()==='REINICIAR'&&pi.value.trim()==='1520'); }; t.addEventListener('input',chk); pi.addEventListener('input',chk); };
window.closeResetModal=()=>{ const o=document.getElementById('resetModalOverlay'); o.classList.remove('open'); o.innerHTML=''; };
window.confirmReset=async()=>{ practicas=[]; openInsumos.clear(); await saveData(); closeResetModal(); render(); };
window.openImportModal=()=>{ const o=document.getElementById('importModalOverlay'); o.innerHTML=`<div class="modal-box wide" role="dialog" aria-modal="true"><h3>⚙️ Importar datos</h3><div class="modal-sub">Pega el JSON. Se validan ID, fecha y estado; lo inválido se omite.</div><textarea class="export-area" id="importTextArea" placeholder='[{"id":"p_..."}]'></textarea><div class="modal-actions"><button class="btn btn-ghost" onclick="closeImportModal()">Cancelar</button><button class="btn btn-primary" onclick="confirmImport()">Importar</button></div></div>`; o.classList.add('open'); document.getElementById('importTextArea').focus(); };
window.closeImportModal=()=>{ const o=document.getElementById('importModalOverlay'); o.classList.remove('open'); o.innerHTML=''; };
function isValidPractica(p){ return p&&typeof p.id==='string'&&typeof p.docente==='string'&&p.docente.trim()&&typeof p.fecha==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(p.fecha)&&ESTADOS_ORDEN.includes(p.estado); }
window.confirmImport=async()=>{ const raw=document.getElementById('importTextArea').value.trim(); if(!raw) return; let imp; try{ imp=JSON.parse(raw); if(!Array.isArray(imp)) throw 0; }catch{ alert('JSON inválido.'); return; } const ids=new Set(practicas.map(p=>p.id)); let add=0, bad=0; imp.forEach(p=>{ if(!isValidPractica(p)){ bad++; return; } if(!ids.has(p.id)){ practicas.push(p); ids.add(p.id); add++; } }); await saveData(); closeImportModal(); render(); alert(`Importadas ${add} nuevas.${bad?` ${bad} inválidas omitidas.`:''}`); };
window.editPractica=(id)=>{ const p=practicas.find(x=>x.id===id); if(p) openForm(p); };
window.deletePractica=(id)=>{ pendingDeleteId=id; render(); };
window.confirmDelete=async(id)=>{ practicas=practicas.filter(p=>p.id!==id); pendingDeleteId=null; openInsumos.delete(id); await saveData(); render(); };
window.cancelDelete=()=>{ pendingDeleteId=null; render(); };
window.scrollToDay=scrollToDay; window.goToAlert=goToAlert;

document.querySelectorAll('.modal-overlay').forEach(o=>o.addEventListener('click',(e)=>{ if(e.target===o){ o.classList.remove('open'); if(o.id==='statusModalOverlay') pendingStatusChange=null; } }));
document.addEventListener('keydown',(e)=>{ if(e.key==='Escape'){ document.querySelectorAll('.modal-overlay.open').forEach(o=>o.classList.remove('open')); pendingStatusChange=null; toggleMenu(false); } });
window.addEventListener('scroll',()=>{ document.getElementById('toolbar').classList.toggle('stuck',window.scrollY>10); document.getElementById('btnBackToTop').classList.toggle('visible',window.scrollY>300); },{passive:true});
document.getElementById('btnBackToTop').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
document.getElementById('btnRefrescarFloat').onclick=async()=>{ const b=document.getElementById('btnRefrescarFloat'); b.classList.add('spinning'); await loadData(); setTimeout(()=>b.classList.remove('spinning'),600); };
loadData(); setInterval(renderAlerts,60000); setInterval(loadData,15000);
</script>
<script src="js/puente-tablero.js?v=20260921"></script>
</body>
</html>
```

--- ARCHIVO: css/styles.css (2986 caracteres) ---
```css
:root{--brand:#6F9F35;--brand2:#82B340;--ink:#0f172a}
*{box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,-apple-system,Roboto,Arial,sans-serif;background:#f4f6f0;color:var(--ink)}
.institutional-line{height:4px;background:linear-gradient(90deg,#0f3d5e 0%,#0f3d5e 25%,#E69324 25%,#E69324 50%,#6F9F35 50%,#6F9F35 75%,#0f3d5e 75%)}
.glass{background:rgba(255,255,255,.9);backdrop-filter:blur(8px)}
.tab-btn{padding:.55rem 1rem;border-radius:.8rem;font-size:.8rem;font-weight:800;color:#64748b;transition:.15s}
.tab-btn-active{background:#0f172a;color:#fff;box-shadow:0 6px 16px rgba(15,23,42,.25)}
.tab-btn:not(.tab-btn-active):hover{background:#f1f5f9;color:#0f172a}
.badge{font-size:10px;font-weight:800;padding:2px 8px;border-radius:999px;letter-spacing:.03em}
.b-BORRADOR{background:#f1f5f9;color:#475569}
.b-ALISTADO{background:#fef3c7;color:#92400e}
.b-MONTADO{background:#dbeafe;color:#1d4ed8}
.b-ENTREGADO{background:#dcfce7;color:#15803d}
.b-RECIBIDO,.b-CERRADO{background:#e2e8f0;color:#334155}
.b-FALTANTES{background:#ffe4e6;color:#be123c}
.table-scroll{max-height:60vh}
table.grid th{position:sticky;top:0;z-index:5}
input,select,textarea{font-size:14px}
.btn{display:inline-flex;align-items:center;gap:.4rem;border-radius:.75rem;padding:.55rem .9rem;font-size:.8rem;font-weight:800;transition:.15s;cursor:pointer}
.btn-brand{background:var(--brand);color:#fff}.btn-brand:hover{background:#557D29}
.btn-dark{background:#0f172a;color:#fff}.btn-dark:hover{background:#1e293b}
.btn-ghost{background:#fff;border:1px solid #e2e8f0;color:#475569}.btn-ghost:hover{background:#f8fafc}
.btn-danger{background:#fff1f2;color:#be123c;border:1px solid #fecdd3}.btn-danger:hover{background:#ffe4e6}
.modal-backdrop{background:rgba(15,23,42,.55);backdrop-filter:blur(3px)}
#scannerVideo{width:100%;border-radius:1rem;background:#000;max-height:320px;object-fit:cover}
.scan-line{position:relative;overflow:hidden}
.autocomplete{position:absolute;z-index:50;background:#fff;border:1px solid #e2e8f0;border-radius:.75rem;box-shadow:0 12px 30px rgba(0,0,0,.12);max-height:240px;overflow:auto;width:100%}
.autocomplete button{display:block;width:100%;text-align:left;padding:.5rem .7rem;font-size:.78rem}
.autocomplete button:hover{background:#F0F7E8}
.etiqueta{width:220px;border:1px dashed #94a3b8;border-radius:.6rem;padding:.5rem;text-align:center;background:#fff}
@media print{
  header,.no-print,nav.tabs,#listaPanel,#kardexPanel,#etiquetasPanel .no-print{display:none!important}
  #printArea{display:block!important}
  body{background:#fff}
}
#toastContainer .toast{background:#0f172a;color:#fff;padding:.6rem .9rem;border-radius:.8rem;font-size:.8rem;box-shadow:0 10px 25px rgba(0,0,0,.25)}
.kpi{border-radius:1rem;border:1px solid #eef2e7;background:#fff;padding:.8rem 1rem;box-shadow:0 6px 18px rgba(0,0,0,.05)}
.status-pill{font-size:11px;font-weight:800;padding:4px 12px;border-radius:999px}
.chart-box{position:relative;height:220px}
.chart-box canvas{max-height:220px}

```

--- ARCHIVO: js/store.js (1268 caracteres) ---
```js
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

```

--- ARCHIVO: js/catalogo.js (1773 caracteres) ---
```js
/* catalogo.js — carga data/catalogo_plano.json + kardex LS */
let CATALOGO = [];
let LS_MAP = {};
let KARDEX_LS = [];
async function cargarCatalogo(){
  try{
    const r = await fetch('data/catalogo_plano.json');
    CATALOGO = await r.json();
  }catch(e){ CATALOGO = []; }
  try{
    const r2 = await fetch('data/catalogo.json');
    const full = await r2.json();
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

```

--- ARCHIVO: js/scanner.js (7097 caracteres) ---
```js
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

```

--- ARCHIVO: js/solicitudes.js (35586 caracteres) ---
```js
/* solicitudes.js — CRUD + montaje + flujo de estados */
let SOLS = loadJSON(LS_KEYS.SOL, []);
let SOL_ACTIVA = null; // id
let ITEM_BORRADOR = []; // items en edición

function guardarSols(){ saveJSON(LS_KEYS.SOL, SOLS); renderListaSols(); }
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

```

--- ARCHIVO: js/kardex.js (20771 caracteres) ---
```js
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
    const r = await fetch('data/kardex_lotes.json'); LOTES_BASE = await r.json();
    const r2 = await fetch('data/consumos.json'); CONS_BASE = await r2.json();
  }catch(e){ LOTES_BASE = []; CONS_BASE = []; }
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

```

--- ARCHIVO: js/puente-tablero.js (1537 caracteres) ---
```js
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

```

--- ARCHIVO: js/puente.js (11523 caracteres) ---
```js
/* puente.js — Tablero (prácticas) <-> Solicitudes/Montaje <-> Kardex.
   El tablero MANDA en estados; la solicitud aporta el detalle de ítems;
   al ENTREGAR se descuenta Kardex por FEFO (una sola vez por solicitud). */
const TAB2SOL = { pendiente: 'BORRADOR', alistado: 'ALISTADO', montado: 'MONTADO', entregado: 'ENTREGADO', recibido: 'RECIBIDO', descuento: 'ENTREGADO' };
const SOL2TAB = { BORRADOR: 'pendiente', ALISTADO: 'alistado', MONTADO: 'montado', ENTREGADO: 'entregado', RECIBIDO: 'recibido' };

function getPracticas() { try { return JSON.parse(localStorage.getItem('practicas') || '[]'); } catch (e) { return []; } }
function setPracticas(p) { try { localStorage.setItem('practicas', JSON.stringify(p)); } catch (e) { toast('No se pudo guardar prácticas'); } }
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

```

--- ARCHIVO: js/excel-export.js (6763 caracteres) ---
```js
/* excel-export.js — genera el Excel según la versión del formato (ACTUAL 2026 / ANTIGUO H2-P07-PR01-F06) */
function exportarSolicitudExcel(id){
  const s = SOLS.find(x=>x.id===id); if(!s) return toast('No encontrada');
  guardarBorradorSilent();
  const d = s.datos||{}; const items = s.items||[];
  const version = s.version || d.formatoVersion || 'ACTUAL';
  const A = [];
  const push = (r)=>A.push(r);
  if(version === 'ANTIGUO'){
    push(['','','','MACROPROCESO Gestión Administrativa y Financiera','FORMATO','','','','Código H2-P07-PR01-F06']);
    push(['','','','PROCESO Gestión de Espacios Físicos','SOLICITUD DE MATERIALES, EQUIPOS Y CONSUMIBLES','','','','Válido desde 01.06.2014']);
    push([]);
    push(['Control de Cambios']);
    push(['Fecha','','Versión','Descripción del cambio']);
    push(['01.06.2014','','1.0','Lanzamiento del documento']);
    push(['16.01.2018','','2.0','Lanzamiento del documento']);
    push([]);
    push(['CONSECUTIVO: '+(d.consecutivo||s.consecutivo||''),'','','','','HORA DE SOLICITUD: '+(d.horaSolicitud||d.horario||'')]);
    push([]);
  } else {
    push(['','','','','MACROPROCESO: Gestión Administrativa y Financiera','FORMATO','','','','Código: ___']);
    push(['','','','','PROCESO: Gestión de Espacios Físicos','SOLICITUD DE INSUMOS Y EQUIPOS PARA PRÁCTICAS DE LABORATORIO','','','','Válido desde: ___']);
    push([]);
    push(['Control de Cambios']);
    push(['Fecha','','','Versión','Descripción del cambio']);
    push(['','','','1.0','Lanzamiento del documento']);
    push([]);
  }
  push(['DATOS DEL SOLICITANTE RESPONSABLE — '+(s.consecutivo||'')+' · Estado: '+s.estado]);
  push(['NOMBRE Y APELLIDO','','','','DOCUMENTO DE IDENTIDAD','','','TIPO DE USUARIO','','']);
  push([d.nombre||'','','','',d.documento||'','','',d.tipoUsuario||'','','']);
  push(['PROGRAMA','','','','ASIGNATURA','','','TEMA','','']);
  push([d.programa||'','','','',d.asignatura||'','','',d.tema||'','','']);
  push([]);
  push(['SEMESTRE','','','GRUPO','JORNADA','','','Nº DE ESTUDIANTES','','Nº GRUPOS']);
  push([d.semestre||'','','',d.grupo||'',d.jornada||'','','',d.numEstudiantes||'','',d.numGrupos||'']);
  push([]);
  push(['FECHA DE SOLICITUD (DD-MM-AA)','','','','FECHA DE UTILIZACIÓN (DD-MM-AA)','','','','HORARIO DE UTILIZACIÓN','']);
  push([d.fechaSolicitud||'','','','',d.fechaUtilizacion||'','','','',d.horario||'','']);
  push([]);
  push(['LABORATORIO A UTILIZAR','','','','','','','SEDE','','']);
  push([d.laboratorio||'','','','','','','',d.sede||'','','']);
  push([]);
  push(['OBSERVACIONES DE ENTREGA']);
  push([d.obsEntrega||'']);
  push([]);
  push(['Manejo de Desechos: caneca ROJA biosanitario · NEGRA no contaminado · BLANCA reciclable · GUARDIÁN cortopunzante.']);
  push(['Normas: uso obligatorio de uniforme y EPP; preservar instalaciones/equipos; prohibido esferos/marcadores/bisturí en laboratorios.']);
  push(['Entrega de Equipos: se entregan en perfecto estado y deben devolverse igual; reportar novedades al personal del laboratorio.']);
  push([]);
  if(version === 'ANTIGUO'){
    push(['ENTREGADO POR: '+(d.entregadoPor||''),'','','FIRMA DEL USUARIO RESPONSABLE: '+(d.firmaResponsable||''),'','','RECIBIDO POR: '+(d.recibidoPor||''),'','','']);
    push(['Fecha y hora: '+ahoraFmt(),'','','Fecha y hora: '+ahoraFmt(),'','','Fecha y hora: '+ahoraFmt(),'','','']);
  } else {
    push(['FIRMA DEL USUARIO QUE ENTREGA','','','','FIRMA DE RECIBIDO DEL USUARIO RESPONSABLE','','','ENTREGA DEL USUARIO RESPONSABLE','','']);
    push(['Fecha y hora: '+ahoraFmt(),'','','','Fecha y hora: '+ahoraFmt(),'','','','Fecha y hora: '+ahoraFmt(),'','']);
  }
  push(['Acepto haber recibido los materiales/equipos relacionados. Me comprometo a entregarlos en las condiciones recibidas.']);
  push([]);
  if(version === 'ANTIGUO'){
    // Sin columna LOTE, un solo bloque, como el formato H2-P07-PR01-F06
    push(['MATERIALES Y/O EQUIPOS SOLICITADOS']);
    push(['Nº','CÓDIGO','NOMBRE DEL MATERIAL, EQUIPOS Y/O SIMULADORES','','SOLICITADOS','','ENTREGADOS','RECIBIDOS','FALTANTES','']);
    items.forEach((it,i)=>{
      push([i+1, it.codigo||'', it.nombre||'', '', it.solicitados??'', '', it.entregados??'', it.recibidos??'', it.nombre?faltantes(it):'', '']);
    });
    push([]);
    push(['Recibido por: '+(d.recibidoPor||'')]);
    push(['Alistamiento por: '+(d.alistadoPor||'')]);
    push([]);
  } else {
    const bloques = [items.slice(0,21), items.slice(21,79), items.slice(79,136)];
    const titulos = ['MATERIALES Y/O EQUIPOS SOLICITADOS (1–21)','MATERIALES Y/O EQUIPOS SOLICITADOS (22–79)','MATERIALES Y/O EQUIPOS SOLICITADOS (80–136)'];
    bloques.forEach((b,bi)=>{
      if(bi>0 && !b.length) return;
      push([titulos[bi]]);
      push(['Nº','CÓDIGO','LOTE','NOMBRE DEL MATERIAL, EQUIPOS Y/O SIMULADORES','','SOLICITADOS','','ENTREGADOS','RECIBIDOS','FALTANTES']);
      const base = bi===0?0:bi===1?21:79;
      const n = bi===0?21:b.length;
      for(let i=0;i<n;i++){
        const it=b[i]||{codigo:'',lote:'',nombre:'',solicitados:'',entregados:'',recibidos:''};
        push([base+i+1, it.codigo||'', it.lote||'', it.nombre||'', '', it.solicitados??'', '', it.entregados??'', it.recibidos??'', it.nombre?faltantes(it):'']);
      }
      push([]);
    });
    push(['ALISTADO POR: '+(d.alistadoPor||'')+'','','','','MONTADO POR: '+(d.montadoPor||'')+'','','','RECIBIDO POR: '+(d.recibidoPor||'')+'','','']);
    push([]);
  }
  push(['OBSERVACIONES DE RECIBIDO']);
  push([d.obsRecibido||'']);
  push([]);
  push(['Historial de estados: '+((s.historial||[]).map(h=>h.estado+' '+h.fecha).join(' | ')||s.estado)]);
  const ws = XLSX.utils.aoa_to_sheet(A);
  ws['!cols'] = [{wch:6},{wch:16},{wch:14},{wch:30},{wch:8},{wch:14},{wch:8},{wch:14},{wch:14},{wch:12}];
  ws['!merges'] = [{s:{r:7,c:0},e:{r:7,c:9}},{s:{r:24,c:0},e:{r:24,c:9}}];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Formato Solicitud Insumos');
  const plano = version==='ANTIGUO'
    ? [['Nº','Código','Nombre','Solicitados','Entregados','Recibidos','Faltantes']]
    : [['Nº','Código','Lote','Nombre','Solicitados','Entregados','Recibidos','Faltantes']];
  items.forEach((it,i)=>plano.push(version==='ANTIGUO'
    ? [i+1,it.codigo||'',it.nombre||'',+it.solicitados||0,+it.entregados||0,+it.recibidos||0,faltantes(it)]
    : [i+1,it.codigo||'',it.lote||'',it.nombre||'',+it.solicitados||0,+it.entregados||0,+it.recibidos||0,faltantes(it)]));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(plano), 'Detalle');
  XLSX.writeFile(wb, (s.consecutivo||'Solicitud')+'_'+(d.asignatura||'').slice(0,20)+(version==='ANTIGUO'?'_antiguo':'')+'.xlsx');
  toast('⬇ Excel generado ('+(version==='ANTIGUO'?'formato antiguo':'formato 2026')+'): ' + (s.consecutivo||''));
}

```

--- ARCHIVO: js/validacion.js (10915 caracteres) ---
```js
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

```

--- ARCHIVO: js/etiquetas.js (1409 caracteres) ---
```js
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

```

--- ARCHIVO: js/app.js (2078 caracteres) ---
```js
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

```

## Datos generados (NO incluidos: pesan ~1.4MB y se regeneran de tus Excel)
- data/kardex_lotes.json (352105 bytes)
- data/consumos.json (419307 bytes)
- data/catalogo.json (356713 bytes)
- data/catalogo_plano.json (294305 bytes)

Regenerar: kardex_lotes.json + consumos.json salen de kardex_202650b_ACTUALIZADO.xlsx (hojas KARDEX y CONSUMOS, seriales Excel a ISO con base 1899-12-30). catalogo.json + catalogo_plano.json salen de Formato solicitud de insumos 2026.xls (hojas de inventario). La app los carga con fetch relativo a data/.