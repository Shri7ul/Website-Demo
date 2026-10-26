import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // All media is recovered from the team's own site and served locally.
    // No remote patterns are needed at runtime.
    formats: ["image/avif", "image/webp"],
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
