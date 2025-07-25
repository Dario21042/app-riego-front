import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ReporteAsistencia() {
  const { token } = useAuth();
  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState('');
  const [resumen, setResumen] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetch(`https://appriegoyaku-production.up.railway.app/api/convocatorias/listar`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setConvocatorias(data))
      .catch(err => console.error('Error al cargar convocatorias:', err));
  }, [token]);

  useEffect(() => {
    if (convocatoriaSeleccionada) {
      fetch(`https://appriegoyaku-production.up.railway.app/api/asistencias/listar/${convocatoriaSeleccionada}/resumen`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setResumen(data);
          if (data.total_registros === 0) {
            Swal.fire('Sin datos', 'Esta convocatoria aún no tiene asistencias registradas.', 'info');
          }
        })
        .catch(err => {
          console.error('Error al cargar resumen:', err);
          Swal.fire('Error', 'No se pudo cargar el resumen de asistencias', 'error');
        });
    } else {
      setResumen(null);
    }
  }, [convocatoriaSeleccionada, token]);

  const exportarExcel = () => {
    if (!resumen || !Array.isArray(resumen.detalle) || resumen.detalle.length === 0) {
      Swal.fire('Advertencia', 'No hay datos para exportar', 'warning');
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(resumen.detalle);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Resumen');

      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const archivo = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const titulo = convocatorias.find(c => c.id_convocatoria === convocatoriaSeleccionada)?.titulo || 'convocatoria';
      const nombreArchivo = `reporte_asistencia_${titulo.replace(/\s+/g, '_')}.xlsx`;

      saveAs(archivo, nombreArchivo);
    } catch (error) {
      console.error('Error al exportar:', error);
      Swal.fire('Error', 'No se pudo exportar el archivo', 'error');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3 className="mb-1">📊 Reporte de Asistencia por Convocatoria</h3>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          <Link to="/admin/registrar-asistencia" className={`btn ${location.pathname === '/admin/registrar-asistencia' ? 'btn-primary' : 'btn-outline-primary'}`}>Registrar Asistencia</Link>
          <Link to="/admin/listar-asistencias" className={`btn ${location.pathname === '/admin/listar-asistencias' ? 'btn-primary' : 'btn-outline-primary'}`}>Listar Asistencias</Link>
          <Link to="/admin/reporte-asistencia" className={`btn ${location.pathname === '/admin/reporte-asistencia' ? 'btn-primary' : 'btn-outline-primary'}`}>Reporte de Asistencia</Link>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold">Selecciona una convocatoria:</label>
        <select
          className="form-select"
          value={convocatoriaSeleccionada}
          onChange={(e) => setConvocatoriaSeleccionada(e.target.value)}
        >
          <option value="">-- Selecciona --</option>
          {convocatorias.map((c) => (
            <option key={c.id_convocatoria} value={c.id_convocatoria}>
              {c.titulo} - {new Date(c.fecha_convocatoria).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>
      {resumen && resumen.total_registros > 0 && (
        <div className="table-responsive bg-white shadow rounded p-3">
          <h5 className="mb-3">
            Total: {resumen.total_registros} | Presentes: ✅ {resumen.asistentes} | Ausentes: ❌ {resumen.ausentes}
          </h5>
          <button className="btn btn-success mb-3" onClick={exportarExcel}>
            📥 Exportar a Excel
          </button>
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Presente</th>
                <th>Fecha Registro</th>
              </tr>
            </thead>
            <tbody>
              {resumen.detalle.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.nombres} {r.apellidos}</td>
                  <td>{r.presente ? '✅' : '❌'}</td>
                  <td>{new Date(r.fecha_registro).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
