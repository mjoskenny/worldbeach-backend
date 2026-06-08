import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, FileText } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { apiGet } from '../lib/api';

interface GalleryImage {
  id: number;
  image: string;
  title?: string;
  category: string;
  description?: string;
  date?: string;
}

export const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    apiGet<GalleryImage[]>('/gallery-data')
      .then((data) => setGalleryImages(data))
      .catch((err) => console.error('Failed to fetch gallery images', err));
  }, []);

  const getImageSrc = (imagePath?: string) => {
    if (!imagePath) return '/placeholder.png';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    return `/storage/${imagePath.replace(/^\/+/, '')}`;
  };

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#00B4D8] to-[#0077B6] text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl mb-4">Gallery</h1>
            <p className="text-white/90">
              A visual journey through our culinary creations and beachfront paradise
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-white dark:bg-[#042029]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedImage(index)}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
              >
                <ImageWithFallback
                  src={getImageSrc(image.image)}
                  alt={image.title || 'Gallery image'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="text-xs text-[#F7D9A4] mb-1">{image.category}</p>
                    <h3 className="text-lg">{image.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && galleryImages[selectedImage] && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/95 z-50 backdrop-blur-sm"
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Close */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Prev */}
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next */}
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-5xl w-full"
              >
                <ImageWithFallback
                  src={getImageSrc(galleryImages[selectedImage].image)}
                  alt={galleryImages[selectedImage].title || 'Gallery image'}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />

                <div className="text-center mt-4 text-white">
                  <p className="text-sm text-[#F7D9A4] mb-1">
                    {galleryImages[selectedImage].category}
                  </p>
                  <h3 className="text-xl">{galleryImages[selectedImage].title}</h3>

                  {galleryImages[selectedImage].date && (
                    <div className="flex items-center justify-center mt-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      <p className="text-sm text-white/60">
                        {galleryImages[selectedImage].date}
                      </p>
                    </div>
                  )}

                  {galleryImages[selectedImage].description && (
                    <div className="flex items-center justify-center mt-2">
                      <FileText className="w-4 h-4 mr-2" />
                      <p className="text-sm text-white/60">
                        {galleryImages[selectedImage].description}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
