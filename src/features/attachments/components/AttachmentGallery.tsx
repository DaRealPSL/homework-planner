import React, { useState, useEffect } from 'react';
import type { HomeworkAttachment } from '@/core/types/database';
import { useAttachments } from '../hooks/useAttachments';

interface AttachmentGalleryProps {
  attachments: HomeworkAttachment[];
}

export const AttachmentGallery: React.FC<AttachmentGalleryProps> = ({ attachments }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string | null }>({});
  const { getAttachmentUrl } = useAttachments();

  useEffect(() => {
    const loadImageUrls = async () => {
      const urls: { [key: string]: string | null } = {};
      
      for (const attachment of attachments) {
        if (attachment.mime_type.startsWith('image/')) {
          const url = await getAttachmentUrl(attachment.storage_path);
          urls[attachment.id] = url;
        }
      }
      
      setImageUrls(urls);
    };

    loadImageUrls();
  }, [attachments, getAttachmentUrl]);

  const isImage = (mimeType: string) => mimeType.startsWith('image/');
  const isPdf = (mimeType: string) => mimeType === 'application/pdf';

  const getFileIcon = (mimeType: string) => {
    if (isImage(mimeType)) return '🖼️';
    if (isPdf(mimeType)) return '📄';
    return '📎';
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="relative group cursor-pointer"
            onClick={() => {
              if (isImage(attachment.mime_type) && imageUrls[attachment.id]) {
                setSelectedImage(imageUrls[attachment.id]);
              } else if (isPdf(attachment.mime_type)) {
                // Handle PDF download
                window.open(`/api/attachments/${attachment.id}`, '_blank');
              }
            }}
          >
            {isImage(attachment.mime_type) ? (
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {imageUrls[attachment.id] ? (
                  <img
                    src={imageUrls[attachment.id] || ''}
                    alt={attachment.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-1">{getFileIcon(attachment.mime_type)}</div>
                  <p className="text-xs text-gray-600 truncate px-2">
                    {attachment.filename}
                  </p>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
              <p className="truncate">{attachment.filename}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
