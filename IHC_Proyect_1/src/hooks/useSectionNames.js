import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../../SupabaseCredentials';

/**
 * Hook: useSectionNames
 * Obtiene la lista de nombres de secciones desde la tabla `Secciones`.
 * - Retorna: { names, loading, error, refetch }
 */
export function useSectionNames(siteId = null) {
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchSeq = useRef(0);

  const fetchNames = useCallback(async () => {
    const seq = ++fetchSeq.current; // identificar esta petición
    setLoading(true);
    setError(null);
    try {
      let q = supabase
        .from('Secciones')
        .select('nameSeccion')
        .order('nameSeccion', { ascending: true });
      if (siteId) q = q.eq('site_id', siteId);
      const { data, error } = await q;

      if (error) throw error;
      // Evitar condición de carrera: solo aplicar si es la última petición
      if (seq === fetchSeq.current) {
        setNames(Array.isArray(data) ? data.map((r) => r.nameSeccion) : []);
      }
    } catch (e) {
      console.error('Error fetching section names:', e);
      // Solo aplicar error si es la última petición
      if (seq === fetchSeq.current) {
        setError(e);
        setNames([]);
      }
    } finally {
      if (seq === fetchSeq.current) {
        setLoading(false);
      }
    }
  }, [siteId]);

  useEffect(() => {
    // limpiar la lista al cambiar de sitio para evitar parpadeo de datos previos
    setNames([]);
    fetchNames();
  }, [fetchNames]);

  const value = useMemo(
    () => ({ names, loading, error, refetch: fetchNames }),
    [names, loading, error, fetchNames]
  );

  return value;
}
