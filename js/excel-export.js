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
