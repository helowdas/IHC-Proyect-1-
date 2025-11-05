import { supabase } from '../../SupabaseCredentials';

/**
 * Elimina una sección por nombre de la tabla `Secciones`.
 * Retorna { ok, deletedCount, error? }
 */
export async function deleteSection(nameSeccion, siteId = null) {
  const name = (nameSeccion || '').trim();
  if (!name) return { ok: false, deletedCount: 0, error: new Error('Nombre inválido') };

  try {
    let q = supabase
      .from('Secciones')
      .delete()
      .eq('nameSeccion', name);
    if (siteId) q = q.eq('site_id', siteId);
    const { data, error } = await q.select('nameSeccion');

    if (error) return { ok: false, deletedCount: 0, error };

    const deletedCount = Array.isArray(data) ? data.length : 0;
    return { ok: deletedCount > 0, deletedCount };
  } catch (e) {
    return { ok: false, deletedCount: 0, error: e };
  }
}
