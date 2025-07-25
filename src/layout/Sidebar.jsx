import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/LogoV4.png';
import {
  FaUsers, FaPlus, FaList, FaChartBar, FaBullhorn, FaCalendarCheck,
  FaMoneyBillAlt, FaTint, FaSignOutAlt, FaChevronDown, FaChevronUp
} from 'react-icons/fa';

export default function Sidebar() {
  const { logout, usuario } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [usuariosOpen, setUsuariosOpen] = useState(false);
  const [convocatoriasOpen, setConvocatoriasOpen] = useState(false);
  const [asistenciasOpen, setAsistenciasOpen] = useState(false);
  const [pagosOpen, setPagosOpen] = useState(false);
  const [turnosOpen, setTurnosOpen] = useState(false); // 👈 nuevo estado

  const toggleUsuarios = () => setUsuariosOpen(!usuariosOpen);
  const toggleConvocatorias = () => setConvocatoriasOpen(!convocatoriasOpen);
  const toggleAsistencias = () => setAsistenciasOpen(!asistenciasOpen);
  const togglePagos = () => setPagosOpen(!pagosOpen);
  const toggleTurnos = () => setTurnosOpen(!turnosOpen); // 👈 nuevo toggle

  const salir = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: '250px' }}>
      <img
        src={logo}
        alt="Logo"
        style={{ width: '220px', height: '220px', borderRadius: '50%', display: 'block', margin: '0 auto' }}
        className="mb-2"
      />
      <h4 className="mb-4 border-bottom pb-2 text-center">💧 Panel Riego</h4>

      <ul className="nav flex-column">
        {/* Dashboard */}
        <li className="nav-item">
          <Link
            to="/admin"
            className={`nav-link text-white ${location.pathname === '/admin' ? 'fw-bold bg-secondary' : ''}`}
          >
            <FaChartBar className="me-2" />Dashboard
          </Link>
        </li>

        {/* GESTIONAR USUARIOS */}
        <li className="nav-item">
          <div
            className={`nav-link text-white d-flex justify-content-between align-items-center${usuario?.rol !== 1 ? ' disabled-link' : ''}`}
            style={{ cursor: usuario?.rol === 1 ? 'pointer' : 'not-allowed', opacity: usuario?.rol === 1 ? 1 : 0.5 }}
            onClick={usuario?.rol === 1 ? toggleUsuarios : undefined}
          >
            <span><FaUsers className="me-2" />Gestionar Usuarios</span>
            {usuariosOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </li>
        {usuariosOpen && (
          <div className="ms-3 mb-2">
            <li className="nav-item">
              <Link
                to="/admin/crear-usuario"
                className={`nav-link text-white ${location.pathname === '/admin/crear-usuario' ? 'fw-bold bg-secondary' : ''}`}
              >
                <FaPlus className="me-2" />Crear Usuario
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin/usuarios"
                className={`nav-link text-white ${location.pathname === '/admin/usuarios' ? 'fw-bold bg-secondary' : ''}`}
              >
                <FaList className="me-2" />Listar Usuarios
              </Link>
            </li>
          </div>
        )}

        {/* GESTIONAR CONVOCATORIAS */}
        <li className="nav-item">
          <div
            className={`nav-link text-white d-flex justify-content-between align-items-center${usuario?.rol !== 2 ? ' disabled-link' : ''}`}
            style={{ cursor: usuario?.rol === 2 ? 'pointer' : 'not-allowed', opacity: usuario?.rol === 2 ? 1 : 0.5 }}
            onClick={usuario?.rol === 2 ? toggleConvocatorias : undefined}
          >
            <span><FaBullhorn className="me-2" />Gestionar Convocatorias</span>
            {convocatoriasOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </li>
        {convocatoriasOpen && (
          <div className="ms-3 mb-2">
            <li className="nav-item">
              <Link
                to="/admin/crear-convocatoria"
                className={`nav-link text-white ${location.pathname === '/admin/crear-convocatoria' ? 'fw-bold bg-secondary' : ''}`}
              >
                <FaPlus className="me-2" />Crear Convocatoria
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin/listar-convocatorias"
                className={`nav-link text-white ${location.pathname === '/admin/listar-convocatorias' ? 'fw-bold bg-secondary' : ''}`}
              >
                <FaList className="me-2" />Listar Convocatorias
              </Link>
            </li>
          </div>
        )}

        {/* GESTIONAR TURNOS */}
        <li className="nav-item">
          <div
            className={`nav-link text-white d-flex justify-content-between align-items-center${usuario?.rol !== 2 ? ' disabled-link' : ''}`}
            style={{ cursor: usuario?.rol === 2 ? 'pointer' : 'not-allowed', opacity: usuario?.rol === 2 ? 1 : 0.5 }}
            onClick={usuario?.rol === 2 ? toggleTurnos : undefined}
          >
            <span><FaTint className="me-2" />Gestionar Turnos</span>
            {turnosOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </li>
        {turnosOpen && (
          <div className="ms-3 mb-2">
            <li className="nav-item">
              <Link
                to="/admin/crear-turno"
                className={`nav-link text-white ${location.pathname === '/admin/crear-turno' ? 'fw-bold bg-secondary' : ''}`}
              >
                <FaPlus className="me-2" />Registrar Turno
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin/turnos"
                className={`nav-link text-white ${location.pathname === '/admin/turnos' ? 'fw-bold bg-secondary' : ''}`}
              >
                <FaList className="me-2" />Listar Turnos
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin/cronograma-turnos"
                className={`nav-link text-white ${location.pathname === '/admin/cronograma-turnos' ? 'fw-bold bg-secondary' : ''}`}
              >
                <FaList className="me-2" />Cronograma
              </Link>
            </li>

          </div>
        )}

        {/* GESTIONAR ASISTENCIAS */}
        <li className="nav-item">
          <div
            className={`nav-link text-white d-flex justify-content-between align-items-center${usuario?.rol !== 3 ? ' disabled-link' : ''}`}
            style={{ cursor: usuario?.rol === 3 ? 'pointer' : 'not-allowed', opacity: usuario?.rol === 3 ? 1 : 0.5 }}
            onClick={usuario?.rol === 3 ? toggleAsistencias : undefined}
          >
            <span><FaCalendarCheck className="me-2" />Gestionar Asistencias</span>
            {asistenciasOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </li>

        {asistenciasOpen && (
          <div className="ms-3 mb-2">
            <li className="nav-item">
              <Link
                to="/admin/registrar-asistencia"
                className={`nav-link text-white ${location.pathname === '/admin/registrar-asistencia' ? 'fw-bold bg-secondary' : ''}`}
              >
                <FaEdit className="me-2" />Registrar Asistencia
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin/listar-asistencias"
                className={`nav-link text-white ${location.pathname === '/admin/listar-asistencias' ? 'fw-bold bg-secondary' : ''}`}
              >
                <FaList className="me-2" />Listar Asistencias
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin/reporte-asistencia"
                className={`nav-link text-white ${location.pathname === '/admin/reporte-asistencia' ? 'fw-bold bg-secondary' : ''}`}
              >
                <FaChartBar className="me-2" />Reporte de Asistencia
              </Link>
            </li>
          </div>
        )}


        {/* GESTIONAR PAGOS */}
        <li className="nav-item">
          <div
            className={`nav-link text-white d-flex justify-content-between align-items-center${usuario?.rol !== 4 ? ' disabled-link' : ''}`}
            style={{ cursor: usuario?.rol === 4 ? 'pointer' : 'not-allowed', opacity: usuario?.rol === 4 ? 1 : 0.5 }}
            onClick={usuario?.rol === 4 ? togglePagos : undefined}
          >
            <span><FaMoneyBillAlt className="me-2" />Gestionar Pagos</span>
            {pagosOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </li>
        {pagosOpen && (
          <div className="ms-3 mb-2">
            <li className="nav-item">
              <Link
                to="/admin/registrar-pago"
                className={`nav-link text-white ${location.pathname === '/admin/registrar-pago' ? 'fw-bold bg-secondary' : ''}`}
              >
                <FaPlus className="me-2" />Registrar Pago
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin/listar-pagos"
                className={`nav-link text-white ${location.pathname === '/admin/listar-pagos' ? 'fw-bold bg-secondary' : ''}`}
              >
                <FaList className="me-2" />Listar Pagos
              </Link>
            </li>
          </div>
        )}

        {/* Cerrar Sesión */}
        <li className="nav-item mt-4">
          <button className="btn btn-outline-light w-100" onClick={salir}>
            <FaSignOutAlt className="me-2" />Cerrar Sesión
          </button>
        </li>
      </ul>
    </div>
  );
}
