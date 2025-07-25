import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaBars } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi'; // Ícono más moderno
import { useAuth } from '../context/AuthContext';
import { getRoleName } from '../utils/roles';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { usuario } = useAuth();

  return (
    <div className="d-flex" style={{ height: '100vh', background: '#f0f2f5', overflow: 'hidden', fontFamily: 'Poppins, sans-serif' }}>
      {sidebarOpen && <Sidebar />}

      <div className="flex-grow-1 d-flex flex-column">
        {/* Barra superior */}
        <nav
          className="navbar navbar-expand-lg shadow-sm"
          style={{
            minHeight: 60,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #dee2e6',
            padding: '0.5rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <button
            className="btn btn-outline-secondary me-"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Mostrar/Ocultar menú"
            style={{ borderRadius: '10%' }}
          >
            <FaBars size={18} />
          </button>

          <h5
  className="m-0 fw-bold text-dark mx-auto"
  style={{ letterSpacing: 0.9, fontSize: '1.6rem' }}
>
  Panel Administrativo de Riego
</h5>


          <div className="ms-auto d-flex align-items-center gap-3">
            <div className="d-flex flex-column text-end">
              <span className="text-secondary small fw-semibold">
                {usuario?.nombres || 'Usuario'}
              </span>
              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                {getRoleName(usuario?.rol)}
              </span>
            </div>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#e0e0e0',
              }}
            >
              <FiUser size={20} className="text-dark" />
            </div>
          </div>
        </nav>

        {/* Contenido */}
        <main className="flex-grow-1 p-4" style={{ overflowY: 'auto', background: '#f8fafc' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
