"use client";

import Image from "next/image";

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
}

export function ImageGalleryModal({
  isOpen,
  onClose,
  images,
}: ImageGalleryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-white font-bold uppercase tracking-wider">
          Comunidad
        </span>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white px-3 py-1 rounded-md border border-white/20"
          aria-label="Cerrar"
        >
          Cerrar
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {images.map((src) => (
            <div
              key={src}
              className="relative w-full overflow-hidden rounded-xl"
            >
              <Image
                src={src}
                alt="Community"
                width={600}
                height={600}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
                priority={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
