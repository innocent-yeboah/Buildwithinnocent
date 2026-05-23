import Image from "next/image";

import { LOGO, TAGLINE } from "@/lib/brand";

type BrandLogoProps = {
  variant?: "icon" | "full";
  className?: string;
  showTagline?: boolean;
  priority?: boolean;
};

const SIZES = {
  icon: { w: 120, h: 120, path: LOGO.icon, imgClass: "h-10 w-10 sm:h-11 sm:w-11" },
  full: { w: 400, h: 520, path: LOGO.full, imgClass: "h-14 w-auto sm:h-16" },
} as const;

/** Official logo mark for header, footer, and favicon sources. */
export function BrandLogo({
  variant = "icon",
  className = "",
  showTagline = false,
  priority = false,
}: BrandLogoProps) {
  const cfg = SIZES[variant];

  return (
    <span className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <span className="relative inline-flex shrink-0 overflow-hidden rounded-md bg-white">
        <Image
          src={cfg.path}
          alt=""
          width={cfg.w}
          height={cfg.h}
          className={`${cfg.imgClass} object-contain object-left`}
          sizes={variant === "icon" ? "44px" : "180px"}
          priority={priority}
        />
      </span>
      {showTagline ? (
        <span className="hidden min-w-0 flex-col text-left sm:flex">
          <span className="text-sm font-bold leading-tight text-brand-navy">Build With Innocent</span>
          <span className="text-[11px] font-medium leading-snug text-brand-green">{TAGLINE}</span>
        </span>
      ) : null}
    </span>
  );
}
