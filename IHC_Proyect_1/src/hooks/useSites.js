import { supabase } from '../../SupabaseCredentials';

// Utilities
export const toSlug = (s) => (s || '')
  .toString()
  .normalize('NFD').replace(/\p{Diacritic}/gu, '')
  .replace(/[^a-zA-Z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')
  .toLowerCase();

// Create a new site with automatic, unique slug. Returns { ok, site, error? }
export async function createSite(name) {
  const nm = (name || '').trim();
  if (!nm) return { ok: false, error: new Error('Nombre requerido') };
  const base = toSlug(nm) || 'site';
  try {
    // Get all slugs that start with base to resolve collisions
    const { data: rows, error: listErr } = await supabase
      .from('Sites')
      .select('slug')
      .ilike('slug', `${base}%`);
    if (listErr) return { ok: false, error: listErr };

    const existing = new Set((rows || []).map(r => (r.slug || '').toLowerCase()));
    let slug = base;
    if (existing.has(base)) {
      // Find next available -2, -3, ...
      let n = 2;
      while (existing.has(`${base}-${n}`)) n++;
      slug = `${base}-${n}`;
    }

    const { data, error } = await supabase
      .from('Sites')
      .insert({ name: nm, slug })
      .select('*')
      .single();
    if (error) return { ok: false, error };
    return { ok: true, site: data };
  } catch (e) {
    return { ok: false, error: e };
  }
}

// Delete site by id
export async function deleteSite(siteId) {
  try {
    const { error } = await supabase.from('Sites').delete().eq('id', siteId);
    if (error) return { ok: false, error };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e };
  }
}

// List sites
export async function listSites() {
  try {
    const { data, error } = await supabase
      .from('Sites')
      .select('id, name, slug, created_at')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return { ok: true, sites: data || [] };
  } catch (e) {
    return { ok: false, error: e, sites: [] };
  }
}

export async function getSiteBySlug(slug) {
  const s = (slug || '').trim().toLowerCase();
  if (!s) return { ok: false, site: null, error: new Error('slug requerido') };
  try {
    const { data, error } = await supabase
      .from('Sites')
      .select('id, name, slug')
      .eq('slug', s)
      .single();
    if (error) return { ok: false, site: null, error };
    return { ok: true, site: data };
  } catch (e) {
    return { ok: false, site: null, error: e };
  }
}

export async function getSiteIdBySlug(slug) {
  const res = await getSiteBySlug(slug);
  if (!res.ok || !res.site) return null;
  return res.site.id;
}
