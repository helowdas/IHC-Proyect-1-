import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../SupabaseCredentials';

/**
 * Hook: useSectionNames
 * Obtiene la lista de nombres de secciones desde la tabla `Secciones`.
 * - Retorna: { names, loading, error, refetch }
 */
export function useSectionNames() {
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('Secciones')
        .select('nameSeccion')
        .order('nameSeccion', { ascending: true });

      if (error) throw error;
      setNames(Array.isArray(data) ? data.map((r) => r.nameSeccion) : []);
    } catch (e) {
      console.error('Error fetching section names:', e);
      setError(e);
      setNames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNames();
  }, [fetchNames]);

  const value = useMemo(
    () => ({ names, loading, error, refetch: fetchNames }),
    [names, loading, error, fetchNames]
  );

  return value;
}
