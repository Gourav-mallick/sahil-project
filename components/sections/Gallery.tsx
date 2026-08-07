"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { MotionReveal } from "@/components/MotionReveal";
import type { GalleryItem } from "@/types/content";
import { assetPath } from "@/utils/assets";

type GalleryProps = {
  gallery: GalleryItem[];
};

export function Gallery({ gallery }: GalleryProps) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  return (
    <section className="bg-canvas py-20">
      <div className="section-shell">
        <MotionReveal className="max-w-3xl">
          <p className="section-kicker">Gallery</p>
          <h2 className="section-title">A glimpse of classes, notes, and student support</h2>
        </MotionReveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item, index) => {
            const image = assetPath(item.image);
            return (
              <MotionReveal key={`${item.caption}-${index}`} delay={index * 0.04}>
                <button
                  type="button"
                  onClick={() => image && setSelected(item)}
                  className="group h-full w-full overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-soft"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={item.caption}
                      width={520}
                      height={320}
                      className="h-48 w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-gray-100 to-amber-100 font-heading font-bold text-secondary">
                      Diploma Coaching
                    </div>
                  )}
                  <p className="p-4 text-sm font-semibold text-secondary">{item.caption}</p>
                </button>
              </MotionReveal>
            );
          })}
        </div>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-[60] bg-secondary/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-secondary"
            aria-label="Close gallery image"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex h-full items-center justify-center">
            <Image
              src={assetPath(selected.image)}
              alt={selected.caption}
              width={1100}
              height={760}
              className="max-h-[82vh] max-w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
