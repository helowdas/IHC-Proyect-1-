import {supabase} from '../../SupabaseCredentials'

// Guarda el JSON de una sección. Si no existe, la crea.
// Retorna un objeto con el resultado: { ok, action?, error? }
export async function saveSectionData(sectionName, data, siteId = null) {
  try {
    // 1) Intentar actualizar y pedir filas afectadas
    let q = supabase
      .from('Secciones')
      .update({ json: data })
      .eq('nameSeccion', sectionName);
    if (siteId) q = q.eq('site_id', siteId);
    const { data: updatedRows, error: updateError } = await q.select('nameSeccion'); // sin select, data viene null

    if (updateError) {
      console.error('Error al actualizar sección:', updateError);
      return { ok: false, error: updateError };
    }

    if (Array.isArray(updatedRows) && updatedRows.length > 0) {
      return { ok: true, action: 'updated' };
    }

    // 2) Ninguna fila actualizada -> insertar
    const { data: insertedRows, error: insertError } = await supabase
      .from('Secciones')
      .insert({ nameSeccion: sectionName, json: data, site_id: siteId })
      .select('nameSeccion');

    if (insertError) {
      console.error('Error al insertar sección:', insertError);
      return { ok: false, error: insertError };
    }

    return { ok: true, action: 'inserted' };
  } catch (e) {
    console.error('Error inesperado guardando sección:', e);
    return { ok: false, error: e };
  }
}