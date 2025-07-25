import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { FaUser, FaIdCard, FaMapMarkerAlt, FaLock, FaUserTie } from 'react-icons/fa';

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    direccion: '',
    contrasena: '',
    rol_id: ''
  });

  // Cargar datos del usuario al iniciar
  useEffect(() => {
    fetch(`https://appriegoyaku-production.up.railway.app/api/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        setForm({
          cedula: data.cedula,
          nombres: data.nombres,
          apellidos: data.apellidos,
          direccion: data.direccion,
          contrasena: '', // ⚠️ No precargar contraseña
          rol_id: data.rol_id
        });
      });
  }, [id]);

  // Actualizar campos del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Enviar cambios al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosAEnviar = { ...form };

    if (!form.contrasena) {
      delete datosAEnviar.contrasena; // No enviar contraseña vacía
    }

    try {
      const res = await fetch(`https://appriegoyaku-production.up.railway.app/api/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(datosAEnviar)
      });

      if (res.ok) {
        alert('✅ Usuario actualizado correctamente');
        navigate('/admin/usuarios');
      } else {
        const data = await res.json();
        alert('❌ Error: ' + data.mensaje);
      }
    } catch (err) {
      alert('❌ Error de conexión');
    }
  };

  return (
    <div className="container-fluid pt-5 px-4">
      {/* Cabecera con botones */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3 className="mb-1">✏️ Editar Usuario</h3>
          <p className="text-muted mb-0">Modifica la información del usuario seleccionado.</p>
        </div>

        <div className="mt-3 mt-md-0 d-flex gap-2">
          <Link
            to="/admin/crear-usuario"
            className={`btn ${location.pathname === '/admin/crear-usuario' ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            + Agregar Usuario
          </Link>
          <Link
            to="/admin/usuarios"
            className={`btn ${location.pathname === '/admin/usuarios' ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            Lista de Usuarios
          </Link>
        </div>
      </div>

      {/* Formulario */}
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-11 col-md-12">
          <form className="bg-white p-5 shadow rounded-4" onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <InputField icon={<FaIdCard />} name="cedula" value={form.cedula} onChange={handleChange} placeholder="Cédula" />
              </div>
              <div className="col-md-6">
                <InputField icon={<FaUser />} name="nombres" value={form.nombres} onChange={handleChange} placeholder="Nombres" />
              </div>

              <div className="col-md-6">
                <InputField icon={<FaUser />} name="apellidos" value={form.apellidos} onChange={handleChange} placeholder="Apellidos" />
              </div>
              <div className="col-md-6">
                <InputField icon={<FaMapMarkerAlt />} name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" />
              </div>

              <div className="col-md-6">
                <InputField icon={<FaLock />} name="contrasena" type="password" value={form.contrasena} onChange={handleChange} placeholder="Nueva contraseña (opcional)" />
              </div>
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text"><FaUserTie /></span>
                  <select className="form-select" name="rol_id" value={form.rol_id} onChange={handleChange} required>
                    <option value="">Seleccione un rol</option>
                    <option value="1">Administrador</option>
                    <option value="2">Presidente</option>
                    <option value="3">Secretario</option>
                    <option value="4">Tesorero</option>
                    <option value="5">Usuario Final</option>
                  </select>
                </div>
              </div>

              <div className="col-12 text-center">
                <button type="submit" className="btn btn-primary w-50 mt-3">Guardar Cambios</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Componente reutilizable para inputs con iconos
function InputField({ icon, ...props }) {
  return (
    <div className="input-group">
      <span className="input-group-text">{icon}</span>
      <input className="form-control" {...props} required />
    </div>
  );
}
