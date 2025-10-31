import { supabase } from '../../SupabaseCredentials';

/**
 * Renombra una sección: oldName -> newName
 * Retorna { ok, error?, code? }
 * - code: 'conflict' si ya existe una sección con el nuevo nombre
 * - code: 'not-found' si no encontró la sección a renombrar
 */
export async function renameSection(oldName, newName) {
  const fromName = (oldName || '').trim();
  const toName = (newName || '').trim();

  if (!fromName || !toName) {
    return { ok: false, error: new Error('Nombres inválidos') };
  }
  if (fromName === toName) {
    return { ok: true };
  }

  try {
    // Comprobar conflicto previo
    const { count: existsCount, error: existsError } = await supabase
      .from('Secciones')
      .select('nameSeccion', { count: 'exact', head: true })
      .eq('nameSeccion', toName);

    if (existsError) return { ok: false, error: existsError };
    if ((existsCount ?? 0) > 0) return { ok: false, code: 'conflict' };

    // Actualizar nombre
    const { data: updated, error: updateError } = await supabase
      .from('Secciones')
      .update({ nameSeccion: toName })
      .eq('nameSeccion', fromName)
      .select('nameSeccion');

    if (updateError) {
      // Conflicto por índice único (si aplica)
      if (updateError.code === '23505') return { ok: false, code: 'conflict' };
      return { ok: false, error: updateError };
    }

    if (!Array.isArray(updated) || updated.length === 0) {
      return { ok: false, code: 'not-found' };
    }

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e };
  }
}
