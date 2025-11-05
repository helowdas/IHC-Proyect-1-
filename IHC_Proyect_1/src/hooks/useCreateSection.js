import { supabase } from '../../SupabaseCredentials';

/**
 * Crea una nueva sección en la tabla `Secciones` si no existe.
 * Retorna un objeto con el resultado: { ok, error?, code? }
 * - code: 'exists' cuando ya existía.
 */
export async function createSection(nameSeccion, initialJson = {}, siteId = null) {
  const sectionName = (nameSeccion || '').trim();
  if (!sectionName) {
    return { ok: false, error: new Error('El nombre de la sección es requerido') };
  }

  try {
    // Verificar existencia previa (evita duplicados si no hay índice único)
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
      return { ok: false, code: 'exists' };
    }

    // Insertar nueva sección
    const { error: insertError } = await supabase
      .from('Secciones')
      .insert({ nameSeccion: sectionName, json: initialJson, site_id: siteId });

    if (insertError) {
      // Si tienes índice único y se produjo conflicto
      if (insertError.code === '23505') {
        return { ok: false, code: 'exists' };
      }
      return { ok: false, error: insertError };
    }

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e };
  }
}
