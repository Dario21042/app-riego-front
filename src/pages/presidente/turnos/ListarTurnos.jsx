import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaTint } from 'react-icons/fa';

const ListarTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerTurnos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://appriegoyaku-production.up.railway.app/api/turnos/listar`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setTurnos(data);
      } catch (error) {
        console.error('Error al listar turnos:', error);
      }
    };
    obtenerTurnos();
  }, []);

  const eliminarTurno = async (id_turno) => {
    if (!window.confirm('¿Estás seguro de eliminar este turno?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://appriegoyaku-production.up.railway.app/api/turnos/${id_turno}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setTurnos(turnos.filter(t => t.id_turno !== id_turno));
      } else {
        alert('No se pudo eliminar el turno');
      }
    } catch (error) {
      console.error('Error al eliminar turno:', error);
    }
  };

  // Formatea fecha a DD/MM/YYYY soportando formato ISO
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';
    // Soporta formato 'YYYY-MM-DD' o 'YYYY-MM-DDTHH:mm:ss.sssZ'
    const date = new Date(fechaStr);
    if (isNaN(date)) return fechaStr;
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="container-fluid pt-5 px-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3 className="mb-1">💧 Lista de Turnos</h3>
          <p className="text-muted mb-0">Administra los turnos de riego registrados en el sistema.</p>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          <button className={`btn btn-outline-primary`} onClick={() => navigate('/admin/crear-turno')}>
            Registrar Turno
          </button>
          <button className={`btn btn-primary`} disabled>
            Listar Turnos
          </button>
          <button className={`btn btn-outline-primary`} onClick={() => navigate('/admin/cronograma-turnos')}>
            Cronograma
          </button>
        </div>
      </div>

      <div className="table-responsive shadow-sm rounded bg-white p-3">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Fecha</th>
              <th>Bloque</th>
              <th>Canal</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Observaciones</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">No hay turnos registrados.</td>
              </tr>
            ) : (
              turnos.map(turno => (
                <tr key={turno.id_turno}>
                  <td>{formatearFecha(turno.fecha_turno)}</td>
                  <td>{turno.bloque_horario || '—'}</td>
                  <td>{turno.canal}</td>
                  <td>{turno.nombres} {turno.apellidos}</td>
                  <td>{turno.estado_turno ? 'Activo' : 'Inactivo'}</td>
                  <td>{turno.observaciones || '—'}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => navigate(`/admin/editar-turno/${turno.id_turno}`)}
                    >
                      <FaEdit className="me-1" /> Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarTurno(turno.id_turno)}
                    >
                      <FaTrashAlt className="me-1" /> Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListarTurnos;
