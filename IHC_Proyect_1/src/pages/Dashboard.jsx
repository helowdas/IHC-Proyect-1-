import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleCreateDesign = () => {
    // TODO: Implementar creación de diseño desde cero
    alert('Funcionalidad de Crear Diseño próximamente');
  };

  const handleViewDesigns = () => {
    navigate('/editor');
  };

  const handleExportDesigns = () => {
    // TODO: Implementar exportación
    alert('Funcionalidad de Exportar Diseños próximamente');
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Header con título y perfil */}
      <div className="bg-white border-bottom d-flex justify-content-between align-items-center px-4 py-3">
        <button 
          type="button"
          className="btn btn-link text-decoration-none p-0"
          onClick={() => navigate('/')}
          style={{ border: 'none', background: 'none' }}
        >
          <h1 className="mb-0 fw-bold fs-2 text-dark" style={{ cursor: 'pointer' }}>Ágora</h1>
        </button>
        <div className="position-relative">
          <i className="bi bi-person-circle fs-3 text-secondary" style={{ cursor: 'pointer' }}></i>
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span className="visually-hidden">Notificaciones</span>
          </span>
        </div>
      </div>

      {/* Contenido principal centrado */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
        <div className="w-100" style={{ maxWidth: '1200px' }}>
          <div className="row g-4">
            {/* Card 1: Ver Diseños */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column p-4">
                  <div className="mb-3 d-flex justify-content-center">
                    <div 
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                      style={{ width: '64px', height: '64px' }}
                    >
                      <i className="bi bi-grid-3x3-gap text-danger" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                  <h5 className="card-title fw-bold mb-3 text-center">Ver Diseños</h5>
                  <p className="card-text text-muted mb-4 text-center flex-grow-1">
                    Explora y gestiona tus proyectos existentes.
                  </p>
                  <button 
                    className="btn btn-a50104 mt-auto"
                    onClick={handleViewDesigns}
                  >
                    Abrir Galería
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Crear Diseño */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column p-4">
                  <div className="mb-3 d-flex justify-content-center">
                    <div 
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center position-relative"
                      style={{ width: '64px', height: '64px' }}
                    >
                      <i className="bi bi-display text-danger" style={{ fontSize: '2rem' }}></i>
                      <i className="bi bi-plus-circle-fill text-danger position-absolute" style={{ fontSize: '1.5rem', bottom: '0', right: '0', lineHeight: '1' }}></i>
                    </div>
                  </div>
                  <h5 className="card-title fw-bold mb-3 text-center">Crear Diseño</h5>
                  <p className="card-text text-muted mb-4 text-center flex-grow-1">
                    Empieza un nuevo proyecto desde cero o con plantillas.
                  </p>
                  <button 
                    className="btn btn-danger mt-auto"
                    onClick={handleCreateDesign}
                  >
                    Nuevo Diseño
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Exportar Diseños */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column p-4">
                  <div className="mb-3 d-flex justify-content-center">
                    <div 
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                      style={{ width: '64px', height: '64px' }}
                    >
                      <i className="bi bi-cloud-download text-danger" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                  <h5 className="card-title fw-bold mb-3 text-center">Exportar Diseños</h5>
                  <p className="card-text text-muted mb-4 text-center flex-grow-1">
                    Descarga tus creaciones en varios formatos.
                  </p>
                  <button 
                    className="btn btn-a50104 mt-auto"
                    onClick={handleExportDesigns}
                  >
                    Seleccionar para Exportar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

