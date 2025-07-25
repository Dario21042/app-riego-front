import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { Link, useLocation } from 'react-router-dom';

export default function RegistrarPago() {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    id_usuario: '',
    monto: '',
    tipo_pago: 'mensual',
    metodo_pago: 'efectivo',
    referencia_pago: '',
    comprobante_url: '',
    fecha_pago: ''
  });
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetch(`https://appriegoyaku-production.up.railway.app/api/usuarios/listar`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsuarios(Array.isArray(data) ? data : []))
      .catch(() => setUsuarios([]));
  }, [token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Opciones para react-select
  const opcionesUsuarios = usuarios.map(u => ({
    value: u.id_usuario,
    label: `${u.nombres} ${u.apellidos}`
  }));

  const handleSelectChange = opcion => {
    setForm(prev => ({ ...prev, id_usuario: opcion?.value || '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.id_usuario) {
      Swal.fire('Error', 'Debe seleccionar un usuario', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://appriegoyaku-production.up.railway.app/api/pagos/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire('¡Éxito!', data.mensaje, 'success');
        setForm({
          id_usuario: '', monto: '', tipo_pago: 'mensual', metodo_pago: 'efectivo', referencia_pago: '', comprobante_url: '', fecha_pago: ''
        });
      } else {
        Swal.fire('Error', data.mensaje || 'No se pudo registrar el pago', 'error');
      }
    } catch {
      Swal.fire('Error', 'Error de conexión', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3 className="mb-1">💵 Registrar Pago</h3>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          <Link to="/admin/registrar-pago" className={`btn ${location.pathname === '/admin/registrar-pago' ? 'btn-primary' : 'btn-outline-primary'}`}>Registrar Pago</Link>
          <Link to="/admin/listar-pagos" className={`btn ${location.pathname === '/admin/listar-pagos' ? 'btn-primary' : 'btn-outline-primary'}`}>Listar Pagos</Link>
        </div>
      </div>
      <form className="bg-white shadow rounded p-4" onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-12">
            <label className="form-label fw-bold">Buscar y seleccionar usuario</label>
            <Select
              options={opcionesUsuarios}
              onChange={handleSelectChange}
              value={opcionesUsuarios.find(opt => opt.value === form.id_usuario) || null}
              placeholder="Buscar y seleccionar usuario..."
              isClearable
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Monto</label>
            <input type="number" className="form-control" name="monto" value={form.monto} onChange={handleChange} required min="0" step="0.01" />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Tipo de Pago</label>
            <select className="form-select" name="tipo_pago" value={form.tipo_pago} onChange={handleChange} required>
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
              <option value="aporte">Aporte</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Método de Pago</label>
            <select className="form-select" name="metodo_pago" value={form.metodo_pago} onChange={handleChange} required>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>
          {form.metodo_pago === 'transferencia' && (
            <>
              <div className="col-md-6">
                <label className="form-label fw-bold">Referencia</label>
                <input type="text" className="form-control" name="referencia_pago" value={form.referencia_pago} onChange={handleChange} required={form.metodo_pago === 'transferencia'} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Comprobante (URL o descripción)</label>
                <input type="text" className="form-control" name="comprobante_url" value={form.comprobante_url} onChange={handleChange} />
              </div>
            </>
          )}
          <div className="col-md-6">
            <label className="form-label fw-bold">Fecha de Pago</label>
            <input type="date" className="form-control" name="fecha_pago" value={form.fecha_pago} onChange={handleChange} required />
          </div>
        </div>
        <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary px-5" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar Pago'}
          </button>
        </div>
      </form>
    </div>
  );
}
