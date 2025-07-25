import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { usuario, token } = useAuth();
  const [totalConvocatorias, setTotalConvocatorias] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);

  useEffect(() => {
    const fetchConvocatoriasYUsuarios = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        };
        // Convocatorias
        const resConv = await fetch(`${import.meta.env.VITE_API_URL}/convocatorias/listar`, { headers });
        if (resConv.ok) {
          const convocatorias = await resConv.json();
          setTotalConvocatorias(Array.isArray(convocatorias) ? convocatorias.length : 0);
        } else {
          setTotalConvocatorias(0);
        }
        // Usuarios
        const resUsu = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/listar`, { headers });
        if (resUsu.ok) {
          const usuarios = await resUsu.json();
          setTotalUsuarios(Array.isArray(usuarios) ? usuarios.length : 0);
        } else {
          setTotalUsuarios(0);
        }
      } catch (error) {
        setTotalConvocatorias(0);
        setTotalUsuarios(0);
      }
    };
    fetchConvocatoriasYUsuarios();
  }, [token]);

  return (
    <div className="container p-4">
      <h2 className="mb-4">Bienvenido, {usuario?.nombres || 'Administrador'}</h2>
      <div className="row">
        <Card titulo="Reuniones" cantidad={totalConvocatorias} color="primary" />
        <Card titulo="Usuarios del Agua" cantidad={totalUsuarios} color="secondary" />
        <Card titulo="Asistencias" cantidad={0} color="success" />
        <Card titulo="Pagos" cantidad={0} color="warning" />
        <Card titulo="Turnos" cantidad={0} color="info" />
      </div>
    </div>
  );
}

function Card({ titulo, cantidad, color }) {
  return (
    <div className="col-md-3 mb-3">
      <div className={`card border-${color} shadow`}>
        <div className={`card-body text-${color}`}>
          <h5 className="card-title">{titulo}</h5>
          <h2 className="card-text">{cantidad}</h2>
        </div>
      </div>
    </div>
  );
}
