import Image from "next/image";

const LOGO = "/brand/logo.png";
const LOGO_W = 693;
const LOGO_H = 744;

/**
 * Official Build With Innocent mark (raster). Parent should set size, e.g. `h-9 w-9`.
 */
export function BrandMark({ className = "", title, priority = true }) {
  const decorative = !title;

  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-md bg-transparent ${className}`}
      role={decorative ? "presentation" : undefined}
      aria-hidden={decorative ? true : undefined}
    >
      <Image
        src={LOGO}
        alt={title ?? ""}
        width={LOGO_W}
        height={LOGO_H}
        className="h-full w-full object-contain object-center"
        sizes="40px"
        priority={priority}
      />
    </span>
  );
}
