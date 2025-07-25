import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function ListarAsistencias() {
  const { token } = useAuth();
  const [convocatorias, setConvocatorias] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState('');
  const location = useLocation();

  // Cargar convocatorias disponibles
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/convocatorias/listar`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setConvocatorias(data))
      .catch(err => console.error('Error al cargar convocatorias:', err));
  }, [token]);

  // Cargar asistencias de la convocatoria seleccionada
  useEffect(() => {
    if (convocatoriaSeleccionada) {
      fetch(`${import.meta.env.VITE_API_URL}/asistencias/listarporId/${convocatoriaSeleccionada}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setAsistencias(data))
        .catch(err => console.error('Error al cargar asistencias:', err));
    } else {
      setAsistencias([]);
    }
  }, [convocatoriaSeleccionada, token]);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3 className="mb-1">📋 Lista de Asistencias</h3>
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
      <div className="table-responsive bg-white shadow rounded p-3">
        <table className="table table-hover table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Usuario</th>
              <th>Presente</th>
              <th>Fecha de Registro</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4">No hay registros de asistencia.</td>
              </tr>
            ) : (
              asistencias.map((a) => (
                <tr key={a.id_asistencia}>
                  <td>{a.nombres} {a.apellidos}</td>
                  <td>{a.presente ? '✅' : '❌'}</td>
                  <td>{new Date(a.fecha_registro).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
