'use client';

import { X } from 'lucide-react';
import FormattedText from './FormattedText';

interface DirectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  name: string;
  subtitle?: string;
  text?: string;
  imageUrl?: string;
}

export default function DirectionModal({
  isOpen,
  onClose,
  title,
  name,
  subtitle,
  text,
  imageUrl,
}: DirectionModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 sm:p-10 text-neutral-900 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-neutral-900 tracking-tight">
            {title}
          </h2>
          <div className="w-16 h-1.5 bg-red-600 mx-auto mt-3 mb-3"></div>
          <p className="text-lg font-bold text-red-600">{name}</p>
          {subtitle && (
            <p className="text-sm text-neutral-500 mt-1 italic font-medium">{subtitle}</p>
          )}
        </div>

        {imageUrl && (
          <div className="relative w-full h-72 sm:h-96 mb-8 rounded-xl overflow-hidden bg-neutral-100 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {text && (
          <div className="w-full bg-neutral-50 p-6 sm:p-8 rounded-xl border border-neutral-200">
            <FormattedText
              content={text}
              className="text-base sm:text-lg text-neutral-800 leading-relaxed text-justify"
            />
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-lg shadow transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
