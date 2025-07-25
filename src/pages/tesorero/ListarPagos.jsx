import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Link, useLocation } from 'react-router-dom';

export default function ListarPagos() {
  const { token, usuario } = useAuth();
  const [pagos, setPagos] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [mes, setMes] = useState('');
  const location = useLocation();

  const fetchPagos = async () => {
    setLoading(true);
    let url = `https://appriegoyaku-production.up.railway.app/api/pagos/listar`;
    if (estadoFiltro) url += `?estado=${estadoFiltro}`;
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setPagos(Array.isArray(data) ? data : []);
    } catch {
      setPagos([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPagos(); }, [token, estadoFiltro]);

  // Filtrar pagos por mes seleccionado
  const pagosFiltrados = pagos.filter(p => {
    if (!mes) return true;
    const fecha = new Date(p.fecha_pago);
    const [anio, mesNum] = mes.split('-');
    return fecha.getFullYear() === Number(anio) && (fecha.getMonth() + 1) === Number(mesNum);
  });

  // Resúmenes
  const totalMonto = pagosFiltrados.reduce((sum, p) => sum + Number(p.monto), 0);
  const pendientes = pagosFiltrados.filter(p => p.estado_pago === 'pendiente').length;
  const validados = pagosFiltrados.filter(p => p.estado_pago === 'validado').length;
  const rechazados = pagosFiltrados.filter(p => p.estado_pago === 'rechazado').length;

  // Exportar a Excel
  const exportarExcel = () => {
    if (!pagosFiltrados.length) return;
    const ws = XLSX.utils.json_to_sheet(pagosFiltrados.map(p => ({
      Usuario: p.nombres + ' ' + p.apellidos,
      Monto: p.monto,
      Tipo: p.tipo_pago,
      Método: p.metodo_pago,
      Fecha: p.fecha_pago,
      Estado: p.estado_pago
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pagos');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const archivo = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(archivo, `reporte_pagos_${mes || 'todos'}.xlsx`);
  };

  const handleValidar = async (id_pago, estado_pago) => {
    const motivo = estado_pago === 'rechazado' ? await Swal.fire({
      title: 'Motivo de rechazo',
      input: 'text',
      inputLabel: 'Ingrese el motivo',
      inputPlaceholder: 'Motivo...',
      showCancelButton: true
    }) : { value: '' };
    if (estado_pago === 'rechazado' && (!motivo.value || motivo.dismiss)) return;
    try {
      const res = await fetch(`https://appriegoyaku-production.up.railway.app/api/pagos/validar/${id_pago}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ estado_pago, validado_por: usuario?.id_usuario, observaciones: motivo.value })
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire('¡Éxito!', data.mensaje, 'success');
        fetchPagos();
      } else {
        Swal.fire('Error', data.mensaje || 'No se pudo actualizar el pago', 'error');
      }
    } catch {
      Swal.fire('Error', 'Error de conexión', 'error');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3 className="mb-1">💵 Listar Pagos</h3>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          <Link to="/admin/registrar-pago" className={`btn ${location.pathname === '/admin/registrar-pago' ? 'btn-primary' : 'btn-outline-primary'}`}>Registrar Pago</Link>
          <Link to="/admin/listar-pagos" className={`btn ${location.pathname === '/admin/listar-pagos' ? 'btn-primary' : 'btn-outline-primary'}`}>Listar Pagos</Link>
        </div>
      </div>
      <div className="mb-3 d-flex align-items-center gap-2 flex-wrap">
        <label className="fw-bold">Filtrar por estado:</label>
        <select className="form-select w-auto" value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)}>
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="validado">Validado</option>
          <option value="rechazado">Rechazado</option>
        </select>
        <label className="fw-bold ms-3">Filtrar por mes:</label>
        <input type="month" className="form-control w-auto" value={mes} onChange={e => setMes(e.target.value)} />
        <button className="btn btn-success ms-2" onClick={exportarExcel} disabled={!pagosFiltrados.length}>
          📥 Exportar a Excel
        </button>
      </div>
      <div className="mb-3">
        <h5 className="mb-1">Resumen</h5>
        <div className="d-flex gap-4 flex-wrap">
          <span><b>Monto total:</b> ${totalMonto.toFixed(2)}</span>
          <span><b>Pendientes:</b> {pendientes}</span>
          <span><b>Validados:</b> {validados}</span>
          <span><b>Rechazados:</b> {rechazados}</span>
        </div>
      </div>
      <div className="table-responsive bg-white shadow rounded p-3">
        <table className="table table-hover table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Usuario</th>
              <th>Monto</th>
              <th>Tipo</th>
              <th>Método</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">No hay pagos registrados.</td>
              </tr>
            ) : (
              pagosFiltrados.map((p) => (
                <tr key={p.id_pago}>
                  <td>{p.nombres} {p.apellidos}</td>
                  <td>${p.monto}</td>
                  <td>{p.tipo_pago}</td>
                  <td>{p.metodo_pago}</td>
                  <td>{new Date(p.fecha_pago).toLocaleDateString()}</td>
                  <td>{p.estado_pago}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleValidar(p.id_pago, 'validado')}
                      disabled={p.estado_pago !== 'pendiente'}
                    >
                      Validar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleValidar(p.id_pago, 'rechazado')}
                      disabled={p.estado_pago !== 'pendiente'}
                    >
                      Rechazar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 