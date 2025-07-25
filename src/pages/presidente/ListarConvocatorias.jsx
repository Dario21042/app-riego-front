import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export default function ListarConvocatorias() {
  const [convocatorias, setConvocatorias] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      Swal.fire('Sesión expirada', 'Por favor inicia sesión nuevamente.', 'warning');
      navigate('/login');
      return;
    }

    fetchConvocatorias();

    const toast = localStorage.getItem('convocatoria_actualizada');
    if (toast) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Convocatoria actualizada correctamente',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
      });
      localStorage.removeItem('convocatoria_actualizada');
    }
  }, [token]);

  const fetchConvocatorias = async () => {
    try {
      const response = await fetch(`https://appriegoyaku-production.up.railway.app/api/convocatorias/listar`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al obtener convocatorias');

      const data = await response.json();
      setConvocatorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error al cargar convocatorias:', error);
      Swal.fire('Error', 'No se pudieron cargar las convocatorias.', 'error');
    }
  };

  const eliminarConvocatoria = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la convocatoria.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://appriegoyaku-production.up.railway.app/api/convocatorias/eliminar/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Error al eliminar convocatoria');

        Swal.fire('Eliminado', 'La convocatoria fue eliminada correctamente.', 'success');
        fetchConvocatorias();
      } catch (error) {
        console.error('❌ Error al eliminar convocatoria:', error);
        Swal.fire('Error', 'No se pudo eliminar la convocatoria.', 'error');
      }
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3 className="mb-1">📋 Lista de Convocatorias</h3>
          <p className="text-muted mb-0">Administra las convocatorias creadas en el sistema.</p>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          <Link to="/admin/crear-convocatoria" className="btn btn-outline-primary">
            + Agregar Convocatoria
          </Link>
          <Link to="/admin/listar-convocatorias" className="btn btn-primary">
            Lista de Convocatorias
          </Link>
        </div>
      </div>

      <div className="table-responsive shadow-sm rounded bg-white p-3">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Título</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Descripción</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {convocatorias.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">No hay convocatorias registradas.</td>
              </tr>
            ) : (
              convocatorias.map((c) => (
                <tr key={c.id_convocatoria}>
                  <td>{c.titulo}</td>
                  <td>{c.fecha_convocatoria || c.fecha}</td>
                  <td>{c.hora}</td>
                  <td>{c.descripcion}</td>
                  <td className="text-center">
                    <Link to={`/admin/editar-convocatoria/${c.id_convocatoria}`} className="btn btn-sm btn-warning me-2">
                      <FaEdit className="me-1" /> Editar
                    </Link>
                    <button className="btn btn-sm btn-danger" onClick={() => eliminarConvocatoria(c.id_convocatoria)}>
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
}
