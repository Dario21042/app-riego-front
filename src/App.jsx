import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './layout/ProtectedRoute';
import AdminLayout from './layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import CrearUsuario from './pages/admin/CrearUsuario';
import EditarUsuario from './pages/admin/EditarUsuario';
import ListarUsuarios from './pages/admin/ListarUsuarios';
import CrearConvocatoria from './pages/presidente/CrearConvocatoria';
import EditarConvocatoria from './pages/presidente/EditarConvocatoria';
import ListarConvocatorias from './pages/presidente/ListarConvocatorias';
import ListarAsistencias from './pages/secretario/ListarAsistencias';
import ReporteAsistencia from './pages/secretario/ReporteAsistencia';
import RegistrarAsistencia from './pages/secretario/RegistrarAsistencia';
import RegistrarPago from './pages/tesorero/RegistrarPago';
import ListarPagos from './pages/tesorero/ListarPagos';
import ListarTurnos from './pages/presidente/turnos/ListarTurnos';
import RegistrarTurno from './pages/presidente/turnos/RegistrarTurno';
import EditarTurno from './pages/presidente/turnos/EditarTurno';
import CronogramaTurnos from './pages/presidente/turnos/CronogramaTurnos';

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* RUTAS PROTEGIDAS PARA TODOS LOS ROLES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={[1, 2, 3, 4]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* RUTAS PARA ADMIN (rol 1) */}
          <Route path="usuarios" element={<ProtectedRoute roles={[1]}><ListarUsuarios /></ProtectedRoute>} />
          <Route path="crear-usuario" element={<ProtectedRoute roles={[1]}><CrearUsuario /></ProtectedRoute>} />
          <Route path="editar-usuario/:id" element={<ProtectedRoute roles={[1]}><EditarUsuario /></ProtectedRoute>} />

          {/* RUTAS PARA PRESIDENTE (rol 2)  para gestionar convocatorias y turnos de riego*/}
          <Route path="crear-convocatoria" element={<ProtectedRoute roles={[2]}><CrearConvocatoria /></ProtectedRoute>} />
          <Route path="listar-convocatorias" element={<ProtectedRoute roles={[2]}><ListarConvocatorias /></ProtectedRoute>} />
          <Route path="editar-convocatoria/:id" element={<ProtectedRoute roles={[2]}><EditarConvocatoria /></ProtectedRoute>} />

          {/* RUTAS PARA TURNOS DE RIEGO - PRESIDENTE (rol 2) */}
          <Route path="turnos" element={<ProtectedRoute roles={[2]}><ListarTurnos /></ProtectedRoute>} />
          <Route path="crear-turno" element={<ProtectedRoute roles={[2]}><RegistrarTurno /></ProtectedRoute>} />
          <Route path="editar-turno/:id_turno" element={<ProtectedRoute roles={[2]}><EditarTurno /></ProtectedRoute>} />
          <Route path="cronograma-turnos" element={<ProtectedRoute roles={[2]}><CronogramaTurnos /></ProtectedRoute>} />

          {/* RUTAS PARA SECRETARIO (rol 3) */}
          <Route path="listar-asistencias" element={<ProtectedRoute roles={[3]}><ListarAsistencias /></ProtectedRoute>} />
          <Route path="registrar-asistencia" element={<ProtectedRoute roles={[3]}><RegistrarAsistencia /></ProtectedRoute>} />
          <Route path="reporte-asistencia" element={<ProtectedRoute roles={[3]}><ReporteAsistencia /></ProtectedRoute>} />

          {/* RUTAS PARA TESORERO (rol 4) */}
          <Route path="registrar-pago" element={<ProtectedRoute roles={[4]}><RegistrarPago /></ProtectedRoute>} />
          <Route path="listar-pagos" element={<ProtectedRoute roles={[4]}><ListarPagos /></ProtectedRoute>} />


          {/* DASHBOARD (todos los roles) */}
          <Route index element={<ProtectedRoute roles={[1, 2, 3, 4]}><AdminDashboard /></ProtectedRoute>} />
        </Route>

      </Routes>
    </Router>
  );
}
