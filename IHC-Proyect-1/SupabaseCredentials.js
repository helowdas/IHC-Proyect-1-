import {createClient} from '@supabase/supabase-js';

const supabaseUrl = "https://fcdxcuacwcwqcpyubkie.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZHhjdWFjd2N3cWNweXVia2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjAyMTMsImV4cCI6MjA3NjAzNjIxM30.Xq0CIH48dbRnaPE_HhH39w-DfSN6GfWUuHuA-2AW5YA";

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadImage = async (file, bucket, folder) => {

    try {

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        const {data: publicURLData} = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);
        
        return publicURLData.publicUrl;
    }    
    catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}