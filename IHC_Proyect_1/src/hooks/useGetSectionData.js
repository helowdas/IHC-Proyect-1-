import {supabase} from '../../SupabaseCredentials'

export async function useGetSectionData(sectionName, siteId = null) {
  let q = supabase
    .from('Secciones')
    .select('json')
    .eq('nameSeccion', sectionName);
  if (siteId) q = q.eq('site_id', siteId);
  const { data, error} = await q.single();

  if (error) {
    console.error('Error fetching section data:', error);
    return null;
  }

  if (!data || !data.json) {
    console.warn('No se encontraron datos para la sección:', sectionName);
    return null;
  }

  // Asegurarse de que devolvemos el JSON correctamente
  // Si es una cadena, parsearla. Si es un objeto, devolverlo tal cual
  let jsonData = data.json;
  if (typeof jsonData === 'string') {
    try {
      jsonData = JSON.parse(jsonData);
    } catch (e) {
      console.error('Error parseando JSON de sección:', e);
      return null;
    }
  }

  console.log('Fetched section data:', sectionName, 'Content:', jsonData);
  return jsonData;
}
