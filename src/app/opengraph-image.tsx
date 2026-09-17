import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Site-wide social share image (og:image / twitter:image), inherited by every
// route unless a route sets its own. Rendered at request/build time.
export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The Flagon mark, baked for a black ground: white glass, teal brew.
const MARK = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='11.3 12.3 41 41' fill='none'><defs><clipPath id='b'><path d='M19.5 23 L34.5 23 L36.5 46 Q36.7 48 34.3 48 L19.7 48 Q17.3 48 17.5 46 Z'/></clipPath><linearGradient id='g' x1='0' y1='0.3' x2='0' y2='1'><stop offset='0' stop-color='#2dd4bf'/><stop offset='1' stop-color='#0f766e'/></linearGradient></defs><g clip-path='url(#b)'><path d='M13 27 q3.75 -0.7 7.5 0 t7.5 0 t7.5 0 t7.5 0 t7.5 0 L51 52 L13 52 Z' fill='url(#g)'/></g><path d='M37 27 L45.5 27 L48.5 30 L48.5 36.5 L45.5 39.5 L38 39.5' fill='none' stroke='#ededed' stroke-width='3.1' stroke-linecap='round' stroke-linejoin='round'/><path d='M17.5 21 L36.5 21 L38.6 47 Q39 50 36 50 L18 50 Q15 50 15.4 47 Z' fill='none' stroke='#ededed' stroke-width='3.1' stroke-linejoin='round'/><path d='M17 21 Q16.3 16.3 20 15.6 L33 15.6 Q37.2 16.2 37 21 Z' fill='none' stroke='#ededed' stroke-width='3' stroke-linejoin='round'/><path d='M36.7 17.1 L39.4 16.1' stroke='#ededed' stroke-width='2.4' stroke-linejoin='round'/><circle cx='40.3' cy='15.8' r='1.4' fill='#ededed'/></svg>`;

export default function OpengraphImage() {
  const markSrc = `data:image/svg+xml;utf8,${encodeURIComponent(MARK)}`;
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          color: "#ededed",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markSrc} width={132} height={132} alt="" />
        <div
          style={{
            marginTop: 36,
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          Flagon
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 32,
            color: "#a7a7b0",
            maxWidth: 820,
            textAlign: "center",
          }}
        >
          {site.tagline}
        </div>
        <div
          style={{
            marginTop: 44,
            fontSize: 22,
            color: "#2dd4bf",
            textTransform: "uppercase",
            letterSpacing: "0.24em",
          }}
        >
          {site.domain}
        </div>
      </div>
    ),
    { ...size },
  );
}
