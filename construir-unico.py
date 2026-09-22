import os, re, json

base = r'D:\Users\jcruz97\Desktop\Nueva carpeta'
with open(os.path.join(base, 'index.html'), encoding='utf-8') as f:
    html = f.read()

# 1) CSS inline
with open(os.path.join(base, 'css', 'styles.css'), encoding='utf-8') as f:
    css = f.read()
html = re.sub(r'<link rel="stylesheet" href="css/styles\.css[^"]*">',
              '<style>\n' + css + '\n</style>', html, count=1)

# 2) JS propios inline (en el orden del index)
js_files = ['store', 'catalogo', 'scanner', 'solicitudes', 'kardex',
            'puente', 'excel-export', 'validacion', 'etiquetas', 'app']
for name in js_files:
    with open(os.path.join(base, 'js', name + '.js'), encoding='utf-8') as f:
        code = f.read()
    assert '</script' not in code.lower(), 'cierre script en ' + name
    pat = r'<script src="js/' + name + r'\.js[^"]*"></script>'
    assert re.search(pat, html), 'no se hallo tag ' + name
    inj = '<script>\n/* ===== ' + name + '.js (incrustado) ===== */\n' + code + '\n</script>'
    html = re.sub(pat, lambda m: inj, html, count=1)

# 3) Datos incrustados (evitan fetch y permiten abrir con doble clic)
datos = {}
for var, rel in [('KARDEX_LOTES_DATA', 'data/kardex_lotes.json'),
                 ('CONSUMOS_DATA', 'data/consumos.json'),
                 ('CATALOGO_PLANO_DATA', 'data/catalogo_plano.json'),
                 ('CATALOGO_FULL_DATA', 'data/catalogo.json')]:
    with open(os.path.join(base, rel), encoding='utf-8') as f:
        datos[var] = json.load(f)
bloque = '<script>\n/* ===== datos incrustados ===== */\n'
for var, val in datos.items():
    bloque += 'window.' + var + ' = ' + json.dumps(val, ensure_ascii=False) + ';\n'
bloque += '</script>'
m = re.search(r'<script>\n/\* ===== store\.js', html)
assert m, 'punto de inyeccion no hallado'
html = html[:m.start()] + bloque + '\n' + html[m.start():]

# 4) Tablero en srcdoc (sin conflictos de CSS/JS con la app)
with open(os.path.join(base, 'tablero.html'), encoding='utf-8') as f:
    tab = f.read()
with open(os.path.join(base, 'js', 'puente-tablero.js'), encoding='utf-8') as f:
    bridge = f.read()
tab = re.sub(r'<script src="js/puente-tablero\.js[^"]*"></script>',
             lambda m: '<script>\n' + bridge + '\n</script>', tab, count=1)
assert 'src="js/puente-tablero.js' not in tab, 'bridge no incrustado'
srcdoc = tab.replace('&', '&amp;').replace('"', '&quot;')
pat_if = r'<iframe id="tableroFrame" src="tablero\.html[^"]*" title="Tablero de alistamiento" style="width:100%;height:82vh;border:0"></iframe>'
assert re.search(pat_if, html), 'iframe no hallado'
inj_if = '<iframe id="tableroFrame" title="Tablero de alistamiento" style="width:100%;height:82vh;border:0" srcdoc="' + srcdoc + '"></iframe>'
html = re.sub(pat_if, lambda m: inj_if, html, count=1)

dest = os.path.join(base, 'sistema-completo.html')
with open(dest, 'w', encoding='utf-8') as f:
    f.write(html)
print('OK:', dest)
print('bytes:', os.path.getsize(dest))
