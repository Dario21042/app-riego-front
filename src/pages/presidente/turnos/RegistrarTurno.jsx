import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaClock, FaTint } from 'react-icons/fa';
import Select from 'react-select';

const InputField = ({ icon, ...props }) => (
  <div className="input-group">
    {icon && <span className="input-group-text">{icon}</span>}
    <input className="form-control" {...props} required />
  </div>
);

const RegistrarTurno = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    id_usuario: '',
    fecha_turno: '',
    hora_inicio: '',
    hora_fin: '',
    canal: '',
    bloque_horario: '',
    observaciones: ''
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch(`https://appriegoyaku-production.up.railway.app/api/usuarios/listar`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setUsuarios(Array.isArray(data) ? data : []))
      .catch(() => setUsuarios([]));
  }, []);

  const opcionesUsuarios = usuarios.map(u => ({
    value: u.id_usuario,
    label: `${u.nombres} ${u.apellidos}`
  }));

  const handleSelectChange = opcion => {
    setForm(prev => ({ ...prev, id_usuario: opcion?.value || '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'bloque_horario' ? value.toLowerCase() : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.id_usuario ||
      !form.fecha_turno.match(/^\d{4}-\d{2}-\d{2}$/) ||
      !form.hora_inicio.match(/^\d{2}:\d{2}$/) ||
      !form.hora_fin.match(/^\d{2}:\d{2}$/) ||
      !form.canal.trim() ||
      !form.bloque_horario.trim()
    ) {
      alert('Todos los campos son obligatorios y deben tener el formato correcto.');
      return;
    }

    const payload = {
      ...form,
      id_usuario: Number(form.id_usuario)
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://appriegoyaku-production.up.railway.app/api/turnos/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Turno creado exitosamente');
        navigate('/admin/turnos');
      } else {
        alert('Hubo un error al crear el turno');
      }
    } catch (error) {
      console.error('Error al crear turno:', error);
      alert('Hubo un error al crear el turno');
    }
  };

  return (
    <div className="container-fluid pt-5 px-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3 className="mb-1">💧 Registrar Turno</h3>
          <p className="text-muted mb-0">Llena el formulario para asignar un nuevo turno de riego.</p>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          <Link to="/admin/crear-turno" className={`btn ${location.pathname === '/admin/crear-turno' ? 'btn-primary' : 'btn-outline-primary'}`}>Registrar Turno</Link>
          <Link to="/admin/turnos" className={`btn ${location.pathname === '/admin/turnos' ? 'btn-primary' : 'btn-outline-primary'}`}>Listar Turnos</Link>
          <Link to="/admin/cronograma-turnos" className={`btn ${location.pathname === '/admin/cronograma-turnos' ? 'btn-primary' : 'btn-outline-primary'}`}>Cronograma</Link>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-11 col-md-12">
          <form className="bg-white p-5 shadow rounded-4" onSubmit={handleSubmit}>
            <div className="row g-4 align-items-end">
              <div className="col-md-6">
                <label className="form-label">Usuario</label>
                <Select
                  options={opcionesUsuarios}
                  onChange={handleSelectChange}
                  value={opcionesUsuarios.find(opt => opt.value === form.id_usuario) || null}
                  placeholder="Buscar y seleccionar usuario..."
                  isClearable
                  styles={{ control: (base) => ({ ...base, minHeight: 40 }) }}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Fecha</label>
                <InputField icon={<FaCalendarAlt />} type="date" name="fecha_turno" value={form.fecha_turno} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Hora Inicio</label>
                <InputField icon={<FaClock />} type="time" name="hora_inicio" value={form.hora_inicio} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Hora Fin</label>
                <InputField icon={<FaClock />} type="time" name="hora_fin" value={form.hora_fin} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Canal</label>
                <InputField icon={<FaTint />} name="canal" placeholder="Canal de riego" value={form.canal} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Bloque Horario</label>
                <select className="form-select" name="bloque_horario" value={form.bloque_horario} onChange={handleChange} required>
                  <option value="">Seleccionar bloque...</option>
                  <option value="mañana">Mañana</option>
                  <option value="noche">Noche</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Observaciones</label>
                <textarea
                  className="form-control"
                  placeholder="Observaciones del turno"
                  name="observaciones"
                  value={form.observaciones}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <div className="col-12 text-center">
                <button type="submit" className="btn btn-primary w-50 mt-3">Registrar Turno</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrarTurno;
