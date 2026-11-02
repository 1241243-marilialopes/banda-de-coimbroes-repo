'use client';

import { X } from 'lucide-react';

interface DirectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export default function DirectionModal({
  isOpen,
  onClose,
  title,
  name,
  description,
  imageUrl,
}: DirectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-neutral-900 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 transition"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-neutral-900">
            {title}
          </h2>
          <p className="text-base font-semibold text-amber-600 mt-1">{name}</p>
        </div>

        {imageUrl && (
          <div className="relative w-full h-64 sm:h-80 mb-6 rounded-xl overflow-hidden bg-neutral-100 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="prose max-w-none text-neutral-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
          {description}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-lg shadow transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

