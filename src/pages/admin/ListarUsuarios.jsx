import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export default function ListarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate(); // <-- Instancia de navegación

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/listar`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('❌ Error al cargar usuarios:', error);
    }
  };

  const eliminarUsuario = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción desactivará al usuario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        Swal.fire('Eliminado', 'El usuario fue desactivado correctamente.', 'success');
        fetchUsuarios();
      } catch (error) {
        console.error('❌ Error al eliminar usuario:', error);
        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
      }
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3 className="mb-1">👤 Lista de Usuarios</h3>
          <p className="text-muted mb-0">Administra los usuarios registrados en el sistema.</p>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          <Link to="/admin/crear-usuario" className="btn btn-outline-primary">
            + Agregar Usuario
          </Link>
          <Link to="/admin/usuarios" className="btn btn-primary">
            Lista de Usuarios
          </Link>
        </div>
      </div>

      <div className="table-responsive shadow-sm rounded bg-white p-3">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Cédula</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Rol</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">No hay usuarios registrados.</td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id_usuario}>
                  <td>{u.cedula}</td>
                  <td>{u.nombres} {u.apellidos}</td>
                  <td>{u.direccion}</td>
                  <td>{u.nombre_rol}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => navigate(`/admin/editar-usuario/${u.id_usuario}`)}
                    >
                      <FaEdit className="me-1" /> Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarUsuario(u.id_usuario)}
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
}
