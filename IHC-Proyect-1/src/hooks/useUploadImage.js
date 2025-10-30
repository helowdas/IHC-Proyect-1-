import { useState } from "react";
import { uploadImage as supabaseUploadImage } from "../../SupabaseCredentials"; // ajusta la ruta si es necesario

export function useUploadImage(bucket = "Assets") {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = async (file) => {
    if (!file) return null;
    try {
      setError(null);
      setIsUploading(true);
      const url = await supabaseUploadImage(file, bucket);
      return url; // devuelve la URL para que el componente la use
    } catch (e) {
      setError(e?.message ?? String(e));
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error };
}