"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type ImageType = {
  src: string;
  caption?: string;
}

function useKeypress(key: string, handler: (event: KeyboardEvent) => void) {
  const eventListenerRef = useRef<(...args: any) => any>();
  useEffect(() => {
    eventListenerRef.current = (event: KeyboardEvent) => {
      if (event.key === key) {
        handler(event);
      }
    };
  }, [key, handler]);

  useEffect(() => {
    const eventListener = (event: KeyboardEvent) => eventListenerRef.current?.(event);
    document.addEventListener("keydown", eventListener);
    return () => document.removeEventListener("keydown", eventListener);
  });
}

function useClickOutside(ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent) => void) {
  useEffect(() => {
    const eventListener = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    };
    document.addEventListener("mousedown", eventListener);
    return () => document.removeEventListener("mousedown", eventListener);
  });
}

export function ImageCarousel(
  { images, className, focused }: { images: ImageType[], className?: string, focused ?: boolean }
) {
  const [currentImage, setCurrentImage] = useState(0);
  const image = images[currentImage];

  const prevImage = () => {
    setCurrentImage((currentImage - 1 + images.length) % images.length);
  }

  const nextImage = () => {
    setCurrentImage((currentImage + 1) % images.length);
  }

  const [isFocused, setIsFocused] = useState(focused ?? false);

  useKeypress("ArrowLeft", () => {
    if (isFocused) {
      prevImage();
    }
  });

  useKeypress("ArrowRight", () => {
    if (isFocused) {
      nextImage();
    }
  });

  const rootRef = useRef<HTMLDivElement>(null);

  useClickOutside(rootRef, () => {
    setIsFocused(false);
  });

  return (
    <div
      className={`grid grid-cols-carousel grid-rows-carousel relative h-80 ${className ?? ""}`}
      ref={rootRef}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        setIsFocused(false);
      }
      }
      onClick={() => setIsFocused(true)}
    >
      <Image
        className={"col-span-full row-span-full object-cover"}
        fill
        src={image.src}
        alt={image.caption ?? ""}
      />
      <div className={"z-10 col-start-1 row-span-full flex items-center"}>
        <button
          className={"mix-blend-exclusion text-gray-600 text-sm opacity-50 hover:opacity-100 transition-opacity duration-200"}
          onClick={prevImage}
        >
          Prev image
        </button>
      </div>
      <div className={"z-10 col-start-3 row-span-full flex items-center"}>
        <button
          className={"mix-blend-exclusion text-gray-600 text-sm opacity-50 hover:opacity-100 transition-opacity duration-200"}
          onClick={nextImage}
        >
          Next image
        </button>
      </div>

      <div
        className={"z-10 col-start-2 row-start-2 flex justify-center items-center"}>
        <div className={"flex justify-center items-center gap-1 px-3 "}>
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-3 w-3 rounded-full border-2 border-gray-300 hover:border-pink-300 ${index === currentImage ? "bg-pink-300" : "bg-transparent"}`}
              onClick={() => setCurrentImage(index)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  )
}
