import {supabase} from '../../SupabaseCredentials'

export async function useGetSectionData(sectionName) {
  const { data, error} = await supabase
    .from('Secciones')
    .select('json')
    .eq('nameSeccion', sectionName)
    .single();

  if (error) {
    console.error('Error fetching section data:', error);
  }

  console.log('Fetched section data:', data);
  return data ? data.json : null;
}
