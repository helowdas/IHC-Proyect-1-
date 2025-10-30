import {supabase} from '../../SupabaseCredentials'

export async function saveSectionData(sectionName, data) {
  const { error } = await supabase
    .from('Secciones')
    .update({ json: data })
    .eq('nameSeccion', sectionName);

  if (error) {
    console.error('Error saving section data:', error);
    //sino existe la seccion, crear una nueva
    const { error: insertError } = await supabase
      .from('Secciones')
      .insert({ nameSeccion: sectionName, json: data });
  }
}