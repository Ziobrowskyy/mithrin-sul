"use client";
import Image from "next/image";
import { RefObject, useEffect, useRef, useState } from "react";

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

function useClickOutside(ref: RefObject<HTMLElement>, handler: (event: MouseEvent) => any) {
  useEffect(() => {
    const eventListener = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    };
    document.addEventListener("mousedown", eventListener);
    return () => document.removeEventListener("mousedown", eventListener);
  }, [ref, handler]);
}

export function ImageCarousel(
  {
    images,
    className,
    focused
  }: {
    images: { url: string, caption?: string }[],
    className?: string,
    focused?: boolean
  }) {
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
      className={`group grid grid-cols-carousel grid-rows-carousel relative h-80 ${className ?? ""}`}
      ref={rootRef}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={() => setIsFocused(true)}
    >
      <Image
        className={"col-span-full row-span-full object-contain"}
        fill
        src={image.url}
        alt={image.caption ?? ""}
      />
      {images.length > 1 && (
        <>
          <div className={"z-10 col-start-1 row-span-full flex items-center"}>
            <button
              className={"mix-blend-exclusion text-gray-600 text-sm opacity-50 group-hover:opacity-100 transition-opacity duration-200"}
              onClick={prevImage}
            >
              Prev image
            </button>
          </div>
          <div className={"z-10 col-start-3 row-span-full flex items-center"}>
            <button
              className={"mix-blend-exclusion text-gray-600 text-sm opacity-50 group-hover:opacity-100 transition-opacity duration-200"}
              onClick={nextImage}
            >
              Next image
            </button>
          </div>

          <div
            className={"group/indicators z-10 col-start-2 row-start-2 flex justify-center items-center"}>
            <div className={"flex justify-center items-center gap-1 px-3 "}>
              {images.map((_, index) => (
                <button
                  data-selected={index === currentImage ? "true" : null}
                  key={index}
                  className={"h-3 w-3 rounded-full border-2 border-gray-300 hover:border-pink-300 bg-transparent data-[selected]:bg-pink-300"}
                  onClick={() => setCurrentImage(index)}
                ></button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
