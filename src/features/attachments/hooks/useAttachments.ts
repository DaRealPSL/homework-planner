import { useState, useCallback } from 'react';
import { supabase } from '@/core/lib/supabase';
import { getCurrentUser } from '@/core/lib/supabase';

interface UploadOptions {
  homeworkId: string;
  file: File;
}

export function useAttachments() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadAttachment = useCallback(async ({ homeworkId, file }: UploadOptions) => {
    try {
      setUploading(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only images (JPEG, PNG, WebP) and PDFs are allowed.');
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 10MB.');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop() || '';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${homeworkId}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Create attachment record in database
      const { error: dbError } = await supabase
        .from('homework_attachments')
        .insert({
          homework_id: homeworkId,
          storage_path: filePath,
          filename: file.name,
          mime_type: file.type,
          uploaded_by: user.id,
        });

      if (dbError) throw dbError;

      return { success: true };
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const deleteAttachment = useCallback(async (attachmentId: string, storagePath: string) => {
    try {
      setUploading(true);
      setError(null);

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('attachments')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('homework_attachments')
        .delete()
        .eq('id', attachmentId);

      if (dbError) throw dbError;

      return { success: true };
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const getAttachmentUrl = useCallback(async (storagePath: string) => {
    try {
      const { data } = await supabase.storage
        .from('attachments')
        .createSignedUrl(storagePath, 3600); // 1 hour expiry

      return data?.signedUrl || null;
    } catch (err) {
      console.error('Error getting attachment URL:', err);
      return null;
    }
  }, []);

  return {
    uploading,
    error,
    uploadAttachment,
    deleteAttachment,
    getAttachmentUrl,
  };
}