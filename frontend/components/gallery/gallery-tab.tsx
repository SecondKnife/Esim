import NextImage from "next/image";
import { Tab } from "@headlessui/react";

import { cn } from "@/lib/utils";
import { R2_BASE_URL } from "@/lib/r2-urls";

interface GalleryTabProps {
  image: string;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ image }) => {
  // Use R2 base URL instead of hardcoded S3 URL
  const getImageUrl = (image: string): string => {
    // If already a full URL, return as-is
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    // If relative path, prepend R2 base URL
    const cleanPath = image.startsWith("/") ? image.slice(1) : image;
    return `${R2_BASE_URL}/${cleanPath}`;
  };

  return (
    <Tab className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-card border border-border">
      {({ selected }) => (
        <div>
          <span className="absolute h-full w-full aspect-square inset-0 overflow-hidden rounded-md">
            <NextImage
              fill
              src={getImageUrl(image)}
              alt=""
              className="object-cover object-center"
              sizes="any"
            />
          </span>
          <span
            className={cn(
              "absolute inset-0 rounded-md ring-2 ring-offset-2 ring-offset-background",
              selected ? "ring-primary" : "ring-transparent"
            )}
          />
        </div>
      )}
    </Tab>
  );
};

export default GalleryTab;
