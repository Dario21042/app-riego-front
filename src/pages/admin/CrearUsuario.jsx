import { useState } from 'react';
import { FaIdCard, FaUser, FaMapMarkerAlt, FaLock, FaUserTie } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

export default function CrearUsuario() {
  const location = useLocation();
  const [form, setForm] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    direccion: '',
    contrasena: '',
    rol: '1'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('${import.meta.env.VITE_API_URL}/usuarios/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...form,
          rol_id: parseInt(form.rol)
        })
      });

      const data = await res.json();
      if (res.ok) alert('✅ Usuario creado correctamente');
      else alert('❌ Error: ' + data.mensaje);
    } catch (err) {
      alert('❌ Error de conexión');
    }
  };

  return (
    <div className="container-fluid pt-5 px-4">
      {/* Cabecera con botones */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3 className="mb-1">👤 Crear Usuario</h3>
          <p className="text-muted mb-0">Llena el formulario para registrar un nuevo usuario en el sistema.</p>
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
                <InputField icon={<FaIdCard />} placeholder="Cédula" name="cedula" value={form.cedula} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <InputField icon={<FaUser />} placeholder="Nombres" name="nombres" value={form.nombres} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <InputField icon={<FaUser />} placeholder="Apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <InputField icon={<FaMapMarkerAlt />} placeholder="Dirección" name="direccion" value={form.direccion} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <InputField icon={<FaLock />} placeholder="Contraseña" type="password" name="contrasena" value={form.contrasena} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text"><FaUserTie /></span>
                  <select className="form-select" name="rol" value={form.rol} onChange={handleChange} required>
                    <option value="1">Administrador</option>
                    <option value="2">Presidente</option>
                    <option value="3">Secretario</option>
                    <option value="4">Tesorero</option>
                    <option value="5">Usuario Final</option>
                  </select>
                </div>
              </div>

              <div className="col-12 text-center">
                <button type="submit" className="btn btn-primary w-50 mt-3">Crear Usuario</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function InputField({ icon, ...props }) {
  return (
    <div className="input-group">
      <span className="input-group-text">{icon}</span>
      <input className="form-control" {...props} required />
    </div>
  );
}
