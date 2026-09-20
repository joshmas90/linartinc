import React, { useEffect, useState } from 'react';
import Img from '@/components/Img';

const ProjectImageGallery = ({ images, size = 'small', priority = false }) => {
  const [galleryImages, setGalleryImages] = useState(images);

  useEffect(() => {
    setGalleryImages(images);
  }, [images]);

  if (!galleryImages?.length) return null;

  const swapWithMain = (index) => {
    if (index <= 0 || index >= galleryImages.length) return;

    setGalleryImages((current) => {
      const next = [...current];
      [next[0], next[index]] = [next[index], next[0]];
      return next;
    });
  };

  const [mainSrc, mainAlt] = galleryImages[0];

  return (
    <div>
      <div className={`project-frame ${size === 'large' ? 'aspect-[4/3]' : 'aspect-[5/4]'}`}>
        <Img
          src={mainSrc}
          alt={mainAlt}
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority={priority}
        />
      </div>

      {galleryImages.length > 1 && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {galleryImages.slice(1).map(([src, alt], offset) => (
            <button
              key={src}
              type="button"
              onClick={() => swapWithMain(offset + 1)}
              className="project-frame group aspect-[4/3] w-full cursor-zoom-in overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9b7b4f]"
              aria-label={`Show enlarged view: ${alt}`}
              title="View larger"
            >
              <Img
                src={src}
                alt={alt}
                sizes="(min-width: 1024px) 16vw, 31vw"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-black/72 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                View larger
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectImageGallery;
