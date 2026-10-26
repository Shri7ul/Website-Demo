import Image from "next/image";
import type { ReactNode } from "react";

type PlateBaseProps = {
  caption: ReactNode;
  /** Optional second caption line, e.g. a source note. */
  note?: ReactNode;
  className?: string;
};

/**
 * Plate — the site's core media device (DESIGN.md §6).
 * A bounded rectangle with a caption strip beneath. Four variants:
 * photo / figure / table / absent. `absent` is a designed state, not an error.
 */

export function PhotoPlate({
  src,
  alt,
  width,
  height,
  caption,
  note,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  contain = false,
}: PlateBaseProps & {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  sizes?: string;
  contain?: boolean;
}) {
  return (
    <figure className={`plate ${className}`}>
      <div className="plate-media">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className={`h-auto w-full ${contain ? "object-contain" : "object-cover"}`}
        />
      </div>
      <figcaption className="plate-caption">
        {caption}
        {note ? <span className="plate-note">{note}</span> : null}
      </figcaption>
    </figure>
  );
}

export function FigurePlate({
  children,
  caption,
  note,
  className = "",
  aspect = "aspect-[16/10]",
}: PlateBaseProps & { children: ReactNode; aspect?: string }) {
  return (
    <figure className={`plate ${className}`}>
      <div className={`plate-media ${aspect}`}>{children}</div>
      <figcaption className="plate-caption">
        {caption}
        {note ? <span className="plate-note">{note}</span> : null}
      </figcaption>
    </figure>
  );
}

export function TablePlate({
  children,
  caption,
  note,
  className = "",
}: PlateBaseProps & { children: ReactNode }) {
  return (
    <figure className={`plate ${className}`}>
      <div className="plate-media overflow-x-auto">{children}</div>
      <figcaption className="plate-caption">
        {caption}
        {note ? <span className="plate-note">{note}</span> : null}
      </figcaption>
    </figure>
  );
}

/**
 * The absent state: states what is missing and who can supply it.
 * Dashed frame, paper-sunk fill, two-line statement.
 */
export function AbsentPlate({
  title,
  body,
  caption,
  note,
  className = "",
  aspect = "aspect-[16/10]",
}: PlateBaseProps & { title: string; body: string; aspect?: string }) {
  return (
    <figure className={`plate plate-absent ${className}`}>
      <div className={`${aspect} flex flex-col justify-center p-5 md:p-7`}>
        <p className="meta uppercase tracking-[0.08em] text-steel-deep">
          Not available
        </p>
        <p className="title mt-2 text-ink">{title}</p>
        <p className="body mt-2 max-w-prose text-steel-deep">{body}</p>
      </div>
      <figcaption className="plate-caption">
        {caption}
        {note ? <span className="plate-note">{note}</span> : null}
      </figcaption>
    </figure>
  );
}
