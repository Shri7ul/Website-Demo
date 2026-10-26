import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // All media is recovered from the team's own site and served locally.
    // No remote patterns are needed at runtime.
    //
    // WebP only. AVIF was enabled initially and removed after measurement:
    // a 27-request concurrent burst took 3235ms with AVIF against 902ms with
    // WebP on the same host, and one AVIF variant of
    // /assets/robots/aegis/aegis-obstacle-side.jpg hung indefinitely, leaving
    // a permanently blank image slot in Chrome. WebP is supported by every
    // browser this site targets; the ~20% byte saving does not justify a
    // request that can never complete.
    formats: ["image/webp"],
    // 3840 was the largest generated width and the most expensive to encode.
    // The widest plate on the site is ~800 CSS px, so 1920 covers a 2× display.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    minimumCacheTTL: 2678400,
  },
  async redirects() {
    return [
      // Legacy URLs from the previous site, so shared links keep working.
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/projects.html", destination: "/robots", permanent: true },
      { source: "/member.html", destination: "/people", permanent: true },
      { source: "/Advisors.html", destination: "/people", permanent: true },
      { source: "/gears.html", destination: "/resources", permanent: true },
      { source: "/Assets.html", destination: "/resources", permanent: true },
      { source: "/video.html", destination: "/resources", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/Join.html", destination: "/join", permanent: true },
      { source: "/sponsor.html", destination: "/collaborate", permanent: true },
      { source: "/webmaster.html", destination: "/people", permanent: true },
    ];
  },
};

export default nextConfig;
