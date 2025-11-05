import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listSites, createSite, deleteSite, toSlug } from '../hooks/useSites';

export default function Sites() {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const slugPreview = useMemo(() => toSlug(name || ''), [name]);

  async function refresh() {
    setLoading(true);
    setError(null);
    const res = await listSites();
    if (!res.ok) setError(res.error || new Error('Error listando sitios'));
    setSites(res.sites || []);
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  async function onCreate(e) {
    e.preventDefault();
    const nm = (name || '').trim();
    if (!nm) return;
    const res = await createSite(nm);
    if (!res.ok) {
      alert('No se pudo crear el sitio');
    } else {
      setName('');
      await refresh();
    }
  }

  async function onDelete(id) {
    if (!confirm('¿Eliminar este sitio? Se eliminarán también sus secciones.')) return;
    const res = await deleteSite(id);
    if (!res.ok) {
      alert('No se pudo eliminar el sitio');
    } else {
      await refresh();
    }
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <div className="bg-white border-bottom d-flex justify-content-between align-items-center px-4 py-3">
        <h1 className="mb-0 fw-bold fs-2 text-dark">Sitios</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>Volver</button>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3">Crear sitio</h5>
                <form onSubmit={onCreate} className="d-grid gap-3">
                  <div>
                    <label className="form-label">Nombre</label>
                    <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Mi web" />
                  </div>
                  <div className="form-text">Slug automático: <code>{slugPreview || 'mi-web'}</code></div>
                  <div>
                    <button type="submit" className="btn btn-a50104 w-100">Crear</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title fw-bold mb-0">Listado de sitios</h5>
                  <button className="btn btn-outline-secondary btn-sm" onClick={refresh} disabled={loading}>Actualizar</button>
                </div>

                {loading ? (
                  <div className="text-muted">Cargando…</div>
                ) : error ? (
                  <div className="alert alert-danger">No se pudieron cargar los sitios.</div>
                ) : sites.length === 0 ? (
                  <div className="text-muted">Aún no hay sitios creados.</div>
                ) : (
                  <div className="list-group">
                    {sites.map(s => (
                      <div key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-semibold">{s.name}</div>
                          <div className="text-muted small">/{s.slug}</div>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-a50104" onClick={() => navigate(`/editor?site=${encodeURIComponent(s.slug)}`)}>Abrir editor</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(s.id)}>Eliminar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
