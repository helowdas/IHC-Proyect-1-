import React, { useState } from 'react';

// Lista de iconos populares de Bootstrap Icons organizados por categorías
const iconCategories = {
  'Navegación': [
    'house', 'house-fill', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down',
    'chevron-left', 'chevron-right', 'chevron-up', 'chevron-down',
    'chevron-double-left', 'chevron-double-right', 'arrow-return-left', 'arrow-return-right',
    'skip-forward', 'skip-backward', 'caret-left-fill', 'caret-right-fill',
    'caret-up-fill', 'caret-down-fill', 'arrow-counterclockwise', 'arrow-clockwise'
  ],
  'Comunicación': [
    'telephone', 'telephone-fill', 'envelope', 'envelope-fill', 'chat', 'chat-fill',
    'chat-left', 'chat-left-fill', 'chat-right', 'chat-right-fill',
    'chat-dots', 'chat-dots-fill', 'megaphone', 'megaphone-fill',
    'bell', 'bell-fill', 'bell-slash', 'bell-slash-fill'
  ],
  'Medios': [
    'play', 'play-fill', 'pause', 'pause-fill', 'stop', 'stop-fill',
    'music-note', 'music-note-beamed', 'volume-up', 'volume-up-fill',
    'volume-down', 'volume-down-fill', 'volume-mute', 'volume-mute-fill',
    'mic', 'mic-fill', 'mic-mute', 'mic-mute-fill'
  ],
  'Acciones': [
    'search', 'funnel', 'funnel-fill', 'download', 'upload', 'share',
    'share-fill', 'heart', 'heart-fill', 'bookmark', 'bookmark-fill',
    'star', 'star-fill', 'flag', 'flag-fill', 'trash', 'trash-fill',
    'pencil', 'pencil-fill', 'pencil-square', 'check', 'check-circle',
    'x', 'x-circle', 'x-lg', 'plus', 'plus-circle', 'plus-lg'
  ],
  'Tipos de archivos': [
    'file-earmark', 'file-earmark-fill', 'file-earmark-text', 'file-earmark-text-fill',
    'file-earmark-image', 'file-earmark-image-fill', 'file-earmark-pdf',
    'file-earmark-pdf-fill', 'file-earmark-zip', 'file-earmark-zip-fill',
    'file-earmark-code', 'file-earmark-code-fill', 'folder', 'folder-fill',
    'folder-open', 'folder-open-fill'
  ],
  'Usuarios': [
    'person', 'person-fill', 'person-circle', 'people', 'people-fill',
    'person-badge', 'person-badge-fill', 'person-check', 'person-check-fill',
    'person-plus', 'person-plus-fill', 'person-x', 'person-x-fill'
  ],
  'Social': [
    'twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'github',
    'google', 'apple', 'microsoft', 'snapchat', 'telegram', 'whatsapp',
    'discord', 'twitch', 'reddit', 'pinterest', 'tiktok'
  ],
  'Interfaz': [
    'menu-button', 'menu-button-wide', 'menu-button-wide-fill',
    'list', 'list-check', 'list-task', 'grid', 'grid-3x3', 'grid-3x3-gap',
    'layout-three-columns', 'layout-sidebar', 'layout-text-window',
    'columns', 'rows', 'layout-split', 'window', 'window-dock', 'window-sidebar'
  ],
  'Comercio': [
    'cart', 'cart-fill', 'cart-plus', 'cart-plus-fill', 'cart-check',
    'cart-check-fill', 'cart-x', 'cart-x-fill', 'bag', 'bag-fill',
    'shop', 'shop-window', 'credit-card', 'credit-card-fill', 'cash',
    'cash-coin', 'currency-dollar', 'currency-euro', 'currency-pound'
  ],
  'Símbolos': [
    'emoji-smile', 'emoji-smile-fill', 'emoji-heart-eyes', 'emoji-heart-eyes-fill',
    'emoji-laughing', 'emoji-laughing-fill', 'emoji-wink', 'emoji-wink-fill',
    'emoji-dizzy', 'emoji-dizzy-fill', 'emoji-angry', 'emoji-angry-fill',
    'lightning', 'lightning-fill', 'fire', 'trophy', 'trophy-fill',
    'award', 'award-fill', 'medal', 'medal-fill'
  ],
  'Información': [
    'info', 'info-circle', 'info-circle-fill', 'question-circle',
    'question-circle-fill', 'exclamation-circle', 'exclamation-circle-fill',
    'exclamation-triangle', 'exclamation-triangle-fill', 'shield',
    'shield-fill', 'shield-check', 'shield-exclamation', 'lock',
    'lock-fill', 'unlock', 'unlock-fill', 'key', 'key-fill'
  ],
  'Transporte': [
    'car-front', 'car-front-fill', 'truck', 'truck-front', 'bicycle',
    'scooter', 'airplane', 'airplane-fill', 'airplane-engines',
    'airplane-engines-fill', 'suitcase', 'suitcase-fill'
  ],
  'Clima': [
    'cloud', 'cloud-fill', 'cloud-rain', 'cloud-rain-fill',
    'cloud-sun', 'cloud-sun-fill', 'cloud-snow', 'cloud-snow-fill',
    'cloud-lightning', 'cloud-lightning-fill', 'cloud-lightning-rain',
    'cloud-lightning-rain-fill', 'sun', 'sun-fill', 'moon', 'moon-fill',
    'moon-stars', 'moon-stars-fill', 'rainbow'
  ],
  'Tiempo': [
    'clock', 'clock-fill', 'calendar', 'calendar-fill', 'calendar-event',
    'calendar-event-fill', 'calendar-check', 'calendar-check-fill',
    'calendar-week', 'calendar-week-fill', 'calendar-month', 'calendar-month-fill',
    'stopwatch', 'stopwatch-fill', 'hourglass', 'hourglass-split', 'hourglass-bottom'
  ]
};

const IconPicker = ({ onSelect, selectedIcon = '', label = 'Seleccionar icono' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Obtener todos los iconos
  const allIcons = Object.values(iconCategories).flat();
  
  // Filtrar iconos según búsqueda y categoría
  const filteredIcons = allIcons.filter(iconName => {
    const matchesSearch = iconName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || 
      iconCategories[selectedCategory]?.includes(iconName);
    return matchesSearch && matchesCategory;
  });

  const handleIconClick = (iconName) => {
    onSelect(iconName);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Obtener todas las categorías
  const categories = ['Todos', ...Object.keys(iconCategories)];

  return (
    <div style={{ position: 'relative' }}>
      <label className="form-label">{label}</label>
      
      {/* Botón para abrir el selector */}
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="d-flex align-items-center gap-2">
          {selectedIcon ? (
            <>
              <i className={`bi bi-${selectedIcon}`}></i>
              <span>{selectedIcon}</span>
            </>
          ) : (
            <span className="text-muted">Ningún icono seleccionado</span>
          )}
        </span>
        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </button>

      {/* Panel de selección */}
      {isOpen && (
        <div 
          className="bg-white border rounded shadow-sm position-absolute w-100"
          style={{
            marginTop: '4px',
            maxHeight: '400px',
            zIndex: 1000,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Barra de búsqueda */}
          <div className="p-2 border-bottom">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar icono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categorías */}
          <div className="border-bottom p-2" style={{ overflowX: 'auto' }}>
            <div className="d-flex gap-1 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  type="button"
                  className={`btn btn-sm ${
                    selectedCategory === category ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearchQuery('');
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de iconos */}
          <div 
            style={{
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
              gap: '8px',
              padding: '12px'
            }}
          >
            {filteredIcons.length > 0 ? (
              filteredIcons.map(iconName => (
                <button
                  key={iconName}
                  type="button"
                  className={`btn btn-sm d-flex flex-column align-items-center ${
                    selectedIcon === iconName ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  style={{ height: '60px', padding: '8px' }}
                  onClick={() => handleIconClick(iconName)}
                  title={iconName}
                >
                  <i className={`bi bi-${iconName}`} style={{ fontSize: '20px' }}></i>
                  <span style={{ fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                    {iconName.length > 8 ? iconName.substring(0, 8) + '...' : iconName}
                  </span>
                </button>
              ))
            ) : (
              <div className="text-center text-muted p-3" style={{ gridColumn: '1 / -1' }}>
                No se encontraron iconos
              </div>
            )}
          </div>

          {/* Botón para limpiar selección */}
          {selectedIcon && (
            <div className="p-2 border-top">
              <button
                type="button"
                className="btn btn-sm btn-outline-danger w-100"
                onClick={() => {
                  onSelect('');
                  setIsOpen(false);
                }}
              >
                <i className="bi bi-x-circle me-1"></i>
                Limpiar selección
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IconPicker;

