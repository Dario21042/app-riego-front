import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaTint } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './CronogramaTurnos.css'; // Importamos CSS personalizado
import { useNavigate, useLocation } from 'react-router-dom';

const CronogramaTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [value, setValue] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchTurnos = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/turnos/listar`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setTurnos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al obtener turnos:', err);
        setTurnos([]);
      }
      setLoading(false);
    };
    fetchTurnos();
  }, []);

  const normalizarFecha = (date) => new Date(date).toISOString().split('T')[0];

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const fecha = normalizarFecha(date);
      const turnosDelDia = turnos.filter(t => normalizarFecha(t.fecha_turno) === fecha);
      if (turnosDelDia.length > 0) {
        return (
          <div className="turno-icon">
            <FaTint />
          </div>
        );
      }
    }
    return null;
  };

  const handleDayClick = (date) => {
    const fecha = normalizarFecha(date);
    const turnosDelDia = turnos.filter(t => normalizarFecha(t.fecha_turno) === fecha);
    if (turnosDelDia.length > 0) {
      Swal.fire({
        title: `Turnos para ${fecha}`,
        html: `<ul style='text-align:left'>${turnosDelDia.map(t =>
          `<li>
            <b>${t.nombres} ${t.apellidos}</b><br/>
            <b>Canal:</b> ${t.canal} | <b>Bloque:</b> ${t.bloque_horario || '—'}<br/>
            <b>Hora:</b> ${t.hora_inicio} - ${t.hora_fin}<br/>
            <i>${t.observaciones || ''}</i>
          </li><br/>`
        ).join('')}</ul>`,
        confirmButtonColor: '#007bff'
      });
    }
  };

  return (
    <div className="container-fluid pt-5 px-4 cronograma-container">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3 className="mb-1">📅 Cronograma de Turnos</h3>
          <p className="text-muted mb-0">Visualiza el cronograma mensual de turnos de riego.</p>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          <button className={`btn btn-outline-primary`} onClick={() => navigate('/admin/crear-turno')}>
            Registrar Turno
          </button>
          <button className={`btn btn-outline-primary`} onClick={() => navigate('/admin/turnos')}>
            Listar Turnos
          </button>
          <button className={`btn btn-primary`} disabled>
            Cronograma
          </button>
        </div>
      </div>

      <div className="mb-3 text-center">
        <span className="badge bg-info text-dark" style={{ fontSize: 16 }}>
          <FaTint className="me-1" /> Día con turnos
        </span>
      </div>

      <div className="d-flex justify-content-center">
        <div className="calendar-wrapper">
          <Calendar
            onChange={setValue}
            value={value}
            tileContent={tileContent}
            onClickDay={handleDayClick}
            locale="es-ES"
            minDetail="month"
            next2Label={null}
            prev2Label={null}
          />
        </div>
      </div>

      {loading && <div className="text-center mt-3">Cargando turnos...</div>}

      <div className="mt-4 text-muted small text-center">
        Haz clic en un día con <FaTint style={{ color: '#007bff' }} /> para ver los detalles de los turnos.
      </div>
    </div>
  );
};

export default CronogramaTurnos;
