import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditarTurno = () => {
  const { id_turno } = useParams();
  const [form, setForm] = useState({
    fecha_turno: '',
    hora_inicio: '',
    hora_fin: '',
    canal: '',
    bloque_horario: '',
    estado_turno: true,
    observaciones: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerTurno = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://appriegoyaku-production.up.railway.app/api/turnos/listar`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        const turno = data.find(t => t.id_turno === parseInt(id_turno));
        if (turno) {
          // Aseguramos que estado_turno sea booleano
          turno.estado_turno = Boolean(turno.estado_turno);
          setForm(turno);
        }
      } catch (error) {
        console.error('Error al cargar turno:', error);
      }
    };
    obtenerTurno();
  }, [id_turno]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://appriegoyaku-production.up.railway.app/api/turnos/${id_turno}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        alert('Turno actualizado correctamente');
        navigate('/admin/turnos');
      } else {
        alert('No se pudo actualizar el turno');
      }
    } catch (error) {
      console.error('Error al actualizar turno:', error);
      alert('No se pudo actualizar el turno');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Editar Turno</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Fecha del Turno</label>
          <input type="date" name="fecha_turno" className="form-control" value={form.fecha_turno} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Hora Inicio</label>
          <input type="time" name="hora_inicio" className="form-control" value={form.hora_inicio} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Hora Fin</label>
          <input type="time" name="hora_fin" className="form-control" value={form.hora_fin} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Bloque Horario</label>
          <select name="bloque_horario" className="form-control" value={form.bloque_horario} onChange={handleChange} required>
            <option value="">Selecciona un bloque</option>
            <option value="mañana">Mañana (05:00 - 18:00)</option>
            <option value="noche">Noche (18:00 - 05:00)</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Canal</label>
          <input type="text" name="canal" className="form-control" value={form.canal} onChange={handleChange} required />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="estado_turno"
            name="estado_turno"
            checked={form.estado_turno}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="estado_turno">
            Turno activo
          </label>
        </div>
        <div className="mb-3">
          <label>Observaciones</label>
          <textarea name="observaciones" className="form-control" value={form.observaciones || ''} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Actualizar Turno</button>
      </form>
    </div>
  );
};

export default EditarTurno;
