import Image from "next/image";

interface EventGalleryProps {
  images: string[];
  eventTitle: string;
}

export function EventGallery({ images, eventTitle }: EventGalleryProps) {
  if (!images || images.length <= 1) {
    return null;
  }

  return (
    <div className="bg-card border border-border/60 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Event Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.slice(1).map((image, index) => (
          <div
            key={index}
            className="relative h-48 rounded-lg overflow-hidden bg-muted border border-border/40"
          >
            <Image
              src={image}
              alt={`${eventTitle} - Image ${index + 2}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-300"
              quality={100}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
