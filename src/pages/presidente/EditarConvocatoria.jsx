import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaClipboardList, FaEdit } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function EditarConvocatoria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const [tiposEvento, setTiposEvento] = useState([]);
  const [mostrarOtro, setMostrarOtro] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    fecha_convocatoria: '',
    hora: '',
    id_tipo_evento: ''
  });

  // Obtener tipos de evento desde el backend
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/convocatorias/tipos-evento`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTiposEvento(data))
      .catch(err => console.error('Error al cargar tipos de evento:', err));
  }, [token]);

  // Cargar datos de la convocatoria al iniciar
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/convocatorias/seleccionar/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setForm({
          titulo: data.titulo,
          descripcion: data.descripcion,
          fecha_convocatoria: data.fecha_convocatoria.split('T')[0],
          hora: data.hora,
          id_tipo_evento: data.id_tipo_evento
        });
      })
      .catch(err => {
        console.error('Error al cargar convocatoria:', err);
        alert('Error al cargar la convocatoria');
      });
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTipoChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId === 'otro') {
      setMostrarOtro(true);
      setForm({ ...form, id_tipo_evento: '' });
    } else {
      setMostrarOtro(false);
      setForm({ ...form, id_tipo_evento: selectedId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let idTipoFinal = form.id_tipo_evento;

    try {
      if (mostrarOtro && nuevoTipo.trim()) {
        const resTipo = await fetch(`${import.meta.env.VITE_API_URL}/convocatorias/tipoCrear`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ nombre: nuevoTipo })
        });
        const dataTipo = await resTipo.json();
        if (resTipo.ok) {
          idTipoFinal = dataTipo.id_tipo_evento;
        } else {
          alert('❌ Error al crear tipo de evento: ' + dataTipo.mensaje);
          return;
        }
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/convocatorias/editar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          id_tipo_evento: idTipoFinal
        })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('convocatoria_actualizada', 'true');
        navigate('/admin/listar-convocatorias');
      } else {
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
          <h3 className="mb-1">✏️ Editar Convocatoria</h3>
          <p className="text-muted mb-0">Modifica la información de la convocatoria seleccionada.</p>
        </div>

        <div className="mt-3 mt-md-0 d-flex gap-2">
          <Link
            to="/admin/crear-convocatoria"
            className={`btn ${location.pathname === '/admin/crear-convocatoria' ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            + Agregar Convocatoria
          </Link>
          <Link
            to="/admin/listar-convocatorias"
            className={`btn ${location.pathname === '/admin/listar-convocatorias' ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            Lista de Convocatorias
          </Link>
        </div>
      </div>

      {/* Formulario */}
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-11 col-md-12">
          <form className="bg-white p-5 shadow rounded-4" onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <InputField icon={<FaEdit />} placeholder="Título" name="titulo" value={form.titulo} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text"><FaClipboardList /></span>
                  <select
                    className="form-select"
                    name="id_tipo_evento"
                    value={form.id_tipo_evento}
                    onChange={handleTipoChange}
                    required={!mostrarOtro}
                  >
                    <option value="">-- Selecciona un tipo de evento --</option>
                    {tiposEvento.map((tipo) => (
                      <option key={tipo.id_tipo_evento} value={tipo.id_tipo_evento}>
                        {tipo.nombre}
                      </option>
                    ))}
                    <option value="otro">Otro...</option>
                  </select>
                </div>
              </div>

              {mostrarOtro && (
                <div className="col-md-6 offset-md-6">
                  <InputField
                    placeholder="Nuevo tipo de evento"
                    value={nuevoTipo}
                    onChange={(e) => setNuevoTipo(e.target.value)}
                  />
                </div>
              )}

              <div className="col-md-6">
                <InputField icon={<FaCalendarAlt />} type="date" name="fecha_convocatoria" value={form.fecha_convocatoria} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <InputField icon={<FaClock />} type="time" name="hora" value={form.hora} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label htmlFor="descripcion" className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  placeholder="Descripción detallada del evento..."
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows="4"
                  required
                />
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

function InputField({ icon, ...props }) {
  return (
    <div className="input-group">
      {icon && <span className="input-group-text">{icon}</span>}
      <input className="form-control" {...props} required />
    </div>
  );
}
