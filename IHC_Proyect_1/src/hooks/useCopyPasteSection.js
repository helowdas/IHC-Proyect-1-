/**
 * Hook para manejar el clipboard (copiar/cortar/pegar) de secciones
 * Usa localStorage como clipboard temporal
 */

const CLIPBOARD_KEY = 'section_clipboard';

export function copySection(sectionName, sectionData) {
  try {
    // Asegurarse de que sectionData sea un objeto JSON válido
    let jsonData = sectionData;
    if (typeof sectionData === 'string') {
      try {
        jsonData = JSON.parse(sectionData);
      } catch (e) {
        console.error('Error parseando JSON al copiar:', e);
        return { ok: false, error: new Error('Los datos de la sección no son válidos') };
      }
    }
    
    // Convertir a string JSON para almacenar en localStorage
    const jsonString = JSON.stringify(jsonData);
    console.log('Copiando sección:', sectionName, 'Datos:', jsonData);
    
    const clipboard = {
      type: 'copy',
      sectionName,
      sectionData: jsonString,
      timestamp: Date.now(),
    };
    localStorage.setItem(CLIPBOARD_KEY, JSON.stringify(clipboard));
    console.log('Sección copiada exitosamente al clipboard');
    return { ok: true };
  } catch (error) {
    console.error('Error copiando sección:', error);
    return { ok: false, error };
  }
}

export function cutSection(sectionName, sectionData) {
  try {
    // Asegurarse de que sectionData sea un objeto JSON válido
    let jsonData = sectionData;
    if (typeof sectionData === 'string') {
      try {
        jsonData = JSON.parse(sectionData);
      } catch (e) {
        console.error('Error parseando JSON al cortar:', e);
        return { ok: false, error: new Error('Los datos de la sección no son válidos') };
      }
    }
    
    // Convertir a string JSON para almacenar en localStorage
    const jsonString = JSON.stringify(jsonData);
    console.log('Cortando sección:', sectionName, 'Datos:', jsonData);
    
    const clipboard = {
      type: 'cut',
      sectionName,
      sectionData: jsonString,
      timestamp: Date.now(),
    };
    localStorage.setItem(CLIPBOARD_KEY, JSON.stringify(clipboard));
    console.log('Sección cortada exitosamente al clipboard');
    return { ok: true };
  } catch (error) {
    console.error('Error cortando sección:', error);
    return { ok: false, error };
  }
}

export function getClipboard() {
  try {
    const data = localStorage.getItem(CLIPBOARD_KEY);
    if (!data) return null;
    
    const clipboard = JSON.parse(data);
    // Verificar que el clipboard no sea muy viejo (1 hora)
    const maxAge = 60 * 60 * 1000;
    if (Date.now() - clipboard.timestamp > maxAge) {
      localStorage.removeItem(CLIPBOARD_KEY);
      return null;
    }
    
    return clipboard;
  } catch (error) {
    console.error('Error leyendo clipboard:', error);
    return null;
  }
}

export function clearClipboard() {
  try {
    localStorage.removeItem(CLIPBOARD_KEY);
    return { ok: true };
  } catch (error) {
    console.error('Error limpiando clipboard:', error);
    return { ok: false, error };
  }
}

export function hasClipboard() {
  return getClipboard() !== null;
}

