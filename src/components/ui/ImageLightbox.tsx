"use client";

import { useState } from "react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  title: string;
  description: string;
}

export function ImageLightbox({ src, alt, title, description }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group block w-full overflow-hidden rounded-lg border border-[var(--color-border)] text-left transition-colors hover:border-[var(--color-accent)]"
      >
        <div className="aspect-[4/3] overflow-hidden bg-neutral-50 dark:bg-neutral-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover object-top transition-transform group-hover:scale-[1.02]"
          />
        </div>
        <div className="p-3">
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            {description}
          </p>
        </div>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-[var(--color-surface)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="sticky top-2 right-2 float-right z-10 mr-2 mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              &times;
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}
