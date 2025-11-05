import { supabase } from '../../SupabaseCredentials';
import { getClipboard, clearClipboard } from './useCopyPasteSection';

/**
 * Pega una sección desde el clipboard
 * Si es un cut, elimina la sección original después de pegar
 */
export async function pasteSection(newSectionName, siteId = null) {
  try {
    const clipboard = getClipboard();
    if (!clipboard) {
      return { ok: false, error: new Error('No hay nada en el portapapeles') };
    }

    const sectionName = (newSectionName || '').trim();
    if (!sectionName) {
      return { ok: false, error: new Error('El nombre de la sección es requerido') };
    }

    // Verificar si ya existe una sección con ese nombre
    let q1 = supabase
      .from('Secciones')
      .select('nameSeccion', { count: 'exact', head: true })
      .eq('nameSeccion', sectionName);
    if (siteId) q1 = q1.eq('site_id', siteId);
    const { count, error: countError } = await q1;

    if (countError) {
      return { ok: false, error: countError };
    }

    if ((count ?? 0) > 0) {
      return { ok: false, code: 'exists', error: new Error('Ya existe una sección con ese nombre') };
    }

    // Parsear los datos de la sección
    let sectionData;
    try {
      // clipboard.sectionData ya viene como string JSON desde copySection
      if (typeof clipboard.sectionData === 'string') {
        sectionData = JSON.parse(clipboard.sectionData);
      } else {
        sectionData = clipboard.sectionData;
      }
      
      // Verificar que sectionData es un objeto válido
      if (!sectionData || typeof sectionData !== 'object') {
        return { ok: false, error: new Error('Los datos de la sección no son válidos') };
      }
    } catch (e) {
      console.error('Error parseando datos de la sección:', e, clipboard);
      return { ok: false, error: new Error('Error parseando datos de la sección: ' + e.message) };
    }

    // Insertar la nueva sección
    // Supabase acepta objetos JSON directamente en campos jsonb
    const { error: insertError } = await supabase
      .from('Secciones')
      .insert({ nameSeccion: sectionName, json: sectionData, site_id: siteId });

    if (insertError) {
      return { ok: false, error: insertError };
    }

    // Si era un cut, eliminar la sección original
    if (clipboard.type === 'cut' && clipboard.sectionName) {
      let q2 = supabase
        .from('Secciones')
        .delete()
        .eq('nameSeccion', clipboard.sectionName);
      if (siteId) q2 = q2.eq('site_id', siteId);
      const { error: deleteError } = await q2;

      if (deleteError) {
        console.warn('No se pudo eliminar la sección original después de cortar:', deleteError);
        // No fallar el paste si no se puede eliminar el original
      } else {
        // Limpiar el clipboard solo si el cut fue exitoso
        clearClipboard();
      }
    }

    return { ok: true, action: clipboard.type };
  } catch (error) {
    console.error('Error pegando sección:', error);
    return { ok: false, error };
  }
}

