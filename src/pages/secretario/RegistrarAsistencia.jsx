import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { Link, useLocation } from 'react-router-dom';

export default function RegistrarAsistencia() {
  const { token } = useAuth();
  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoriasConLista, setConvocatoriasConLista] = useState(new Set());
  const [usuarios, setUsuarios] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState('');
  const [registro, setRegistro] = useState({});
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [convRes, asisRes] = await Promise.all([
          fetch(`https://appriegoyaku-production.up.railway.app/api/convocatorias/listar`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`https://appriegoyaku-production.up.railway.app/api/asistencias/listar`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const convocatoriasData = await convRes.json();
        const asistenciasData = await asisRes.json();

        setConvocatorias(Array.isArray(convocatoriasData) ? convocatoriasData : []);
        setConvocatoriasConLista(new Set(asistenciasData.map(a => a.id_convocatoria)));
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (convocatoriaSeleccionada) {
      fetch(`https://appriegoyaku-production.up.railway.app/api/usuarios/listar`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : [])
        .then(data => setUsuarios(Array.isArray(data) ? data : []))
        .catch(() => setUsuarios([]));

      fetch(`https://appriegoyaku-production.up.railway.app/api/asistencias/listarporId/${convocatoriaSeleccionada}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setAsistencias(Array.isArray(data) ? data : []))
        .catch(() => setAsistencias([]));
    } else {
      setUsuarios([]);
      setAsistencias([]);
      setRegistro({});
    }
  }, [convocatoriaSeleccionada, token]);

  const normalizar = c => String(c).trim();

  const usuariosUnicos = [];
  const cedulasVistas = new Set();
  for (const u of usuarios) {
    const cedula = normalizar(u.cedula);
    if (!cedulasVistas.has(cedula)) {
      usuariosUnicos.push(u);
      cedulasVistas.add(cedula);
    }
  }

  const cedulasConAsistencia = asistencias.map(a => normalizar(a.cedula));
  const usuariosParaRegistrar = usuariosUnicos.filter(u => !cedulasConAsistencia.includes(normalizar(u.cedula)));

  useEffect(() => {
    const reg = {};
    usuariosParaRegistrar.forEach(u => { reg[u.id_usuario] = false; });
    setRegistro(reg);
  }, [usuariosParaRegistrar.length]);

  const handleAsistenciaChange = (id_usuario, presente) => {
    setRegistro(prev => ({ ...prev, [id_usuario]: presente }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let errores = 0;
    for (const id_usuario of Object.keys(registro)) {
      try {
        const res = await fetch(`https://appriegoyaku-production.up.railway.app/api/asistencias/registrar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            id_convocatoria: convocatoriaSeleccionada,
            id_usuario,
            presente: registro[id_usuario]
          })
        });
        if (!res.ok) errores++;
      } catch {
        errores++;
      }
    }
    setLoading(false);
    if (errores === 0) {
      Swal.fire('¡Éxito!', 'Asistencias registradas correctamente', 'success');
    } else {
      Swal.fire('Atención', 'Algunas asistencias no se registraron.', 'warning');
    }
  };

  const handleEditarAsistencia = async (id_asistencia, nuevoPresente) => {
    try {
      const res = await fetch(`https://appriegoyaku-production.up.railway.app/api/asistencias/editar/${id_asistencia}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ presente: nuevoPresente })
      });
      if (res.ok) {
        Swal.fire('¡Actualizado!', 'Asistencia editada correctamente', 'success');
        const resAsis = await fetch(`https://appriegoyaku-production.up.railway.app/api/asistencias/listarporId/${convocatoriaSeleccionada}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await resAsis.json();
        setAsistencias(Array.isArray(data) ? data : []);
      } else {
        Swal.fire('Error', 'No se pudo actualizar la asistencia', 'error');
      }
    } catch {
      Swal.fire('Error', 'Error de conexión', 'error');
    }
  };

  const convocatoriasOrdenadas = [...convocatorias].sort((a, b) => {
    const aTieneLista = convocatoriasConLista.has(a.id_convocatoria);
    const bTieneLista = convocatoriasConLista.has(b.id_convocatoria);
    return aTieneLista - bTieneLista; // primero false (sin lista), luego true (con lista)
  });

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3 className="mb-1">📋 Registrar Asistencia</h3>
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
          {convocatoriasOrdenadas.map((c) => (
            <option
              key={c.id_convocatoria}
              value={c.id_convocatoria}
              style={{ backgroundColor: convocatoriasConLista.has(c.id_convocatoria) ? '#d4edda' : '#f8d7da' }}
            >
              {c.titulo} - {new Date(c.fecha_convocatoria).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {asistencias.length > 0 && convocatoriaSeleccionada ? (
        <div className="mb-4">
          <div className="alert alert-info">Ya fue tomada lista, ¿desea editar asistencia?</div>
          <h5>Asistencias registradas (puedes editar):</h5>
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Presente</th>
                <th>Fecha de Registro</th>
              </tr>
            </thead>
            <tbody>
              {asistencias.map((a) => (
                <tr key={a.id_asistencia}>
                  <td>{a.nombres} {a.apellidos}</td>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={!!a.presente}
                      onChange={e => handleEditarAsistencia(a.id_asistencia, e.target.checked)}
                    />
                  </td>
                  <td>{new Date(a.fecha_registro).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        usuariosParaRegistrar.length > 0 && (
          <form onSubmit={handleSubmit} className="bg-white shadow rounded p-3">
            <h5>Registrar asistencia para los siguientes usuarios:</h5>
            <table className="table table-hover table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Cédula</th>
                  <th>Nombre</th>
                  <th>Registrar Asistencia</th>
                </tr>
              </thead>
              <tbody>
                {usuariosParaRegistrar.map((u) => (
                  <tr key={u.id_usuario}>
                    <td>{u.cedula}</td>
                    <td>{u.nombres} {u.apellidos}</td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={registro[u.id_usuario] || false}
                        onChange={e => handleAsistenciaChange(u.id_usuario, e.target.checked)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-center">
              <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrar Asistencia'}
              </button>
            </div>
          </form>
        )
      )}
      {usuariosParaRegistrar.length === 0 && convocatoriaSeleccionada && (
        <div className="alert alert-success">Todos los usuarios ya tienen asistencia registrada para esta convocatoria.</div>
      )}
    </div>
  );
}
