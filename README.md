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

## Nube Firebase (proyecto `tablero-de-seguimiento-8fbcb`)
- Firestore creado en modo prueba (vence ~21-oct-2026; luego poner reglas permanentes) + app web `sistema-laboratorios` registrada. Config ya incluida en `js/firebase-config.js`.
- La app sincroniza en tiempo real: `practicas`, `smk_solicitudes_v1`, `smk_movs_local_v1`, `smk_lotes_local_v1` (colección `estado`, un doc por clave, gana la última escritura).
- Botón **☁️ Nube**: estado, pegar otra config, subir ahora. Sin config/internet, todo sigue local.
- Reglas permanentes en `firestore.rules` (solo colección `estado`, 4 docs de `js/nube.js`, con validación de tamaño; resto denegado). Publicarlas en consola Firestore → Reglas antes del 21-oct-2026.

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
