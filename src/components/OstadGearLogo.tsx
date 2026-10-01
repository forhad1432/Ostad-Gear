import React from 'react';

interface OstadGearLogoProps {
  className?: string;
  showText?: boolean;
}

/**
 * OSTAD GEAR Official Monogram Logo
 * Pixel-accurate reproduction of the user's uploaded logo image.png
 */
export const OstadGearLogo: React.FC<OstadGearLogoProps> = ({ 
  className = "w-9 h-9", 
  showText = false
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${showText ? '' : 'shrink-0'}`}>
      {/* Monogram Symbol matching image.png */}
      <svg
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} shrink-0 select-none overflow-hidden rounded-xl`}
      >
        {/* Black Solid Square / Rounded Canvas */}
        <rect width="1000" height="1000" fill="#000000" />

        {/* Outer White Stadium Silhouette */}
        <rect x="175" y="260" width="650" height="480" rx="240" fill="#FFFFFF" />

        {/* 
          Black Cutouts inside the Stadium:
          1. Left Window: D-shaped vertical cutout (giving left curve + top/bottom edge)
          2. Middle Slot: Gap between central pillar and right G structure
          3. Right Window: Inner counter of G and horizontal crossbar
          4. Right Inlet: Open mouth of the letter G
        */}
        <g fill="#000000">
          {/* 1. Left D-shaped black inner counter */}
          <path d="
            M 365 326
            C 265 326 237 400 237 500
            C 237 600 265 674 365 674
            L 423 674
            L 423 326
            Z
          " />

          {/* 2. Central vertical black stripe between pillar and right glyph */}
          <rect x="466" y="326" width="68" height="348" />

          {/* 3. Upper right counter of G */}
          <path d="
            M 534 326
            L 630 326
            C 685 326 730 355 748 412
            L 534 412
            Z
          " />

          {/* 4. Open mouth notch of G (opening the top-right wall) */}
          <rect x="735" y="412" width="100" height="66" />

          {/* 5. Lower right counter of G (below the horizontal crossbar) */}
          <path d="
            M 574 478
            L 762 478
            C 752 560 725 674 630 674
            L 574 674
            Z
          " />
        </g>
      </svg>

      {/* Optional Brand Wordmark */}
      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span className="text-base sm:text-lg font-black tracking-[0.14em] text-white font-brand">
            OSTAD <span className="text-amber-400">GEAR</span>
          </span>
          <span className="text-[10px] tracking-[0.18em] text-zinc-400 uppercase font-medium mt-0.5">
            Dhaka Streetwear & Jersey
          </span>
        </div>
      )}
    </div>
  );
};

