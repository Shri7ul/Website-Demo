import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";
import { robots } from "@/content/robots";
import { experiments } from "@/content/experiments";
import { researchThemes } from "@/content/research";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/robots", priority: 0.9, changeFrequency: "monthly" },
  { path: "/experiments", priority: 0.9, changeFrequency: "monthly" },
  { path: "/research", priority: 0.8, changeFrequency: "monthly" },
  { path: "/engineering", priority: 0.8, changeFrequency: "monthly" },
  { path: "/journey", priority: 0.7, changeFrequency: "monthly" },
  { path: "/people", priority: 0.7, changeFrequency: "monthly" },
  { path: "/resources", priority: 0.6, changeFrequency: "monthly" },
  { path: "/join", priority: 0.8, changeFrequency: "yearly" },
  { path: "/collaborate", priority: 0.8, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const statics = STATIC_ROUTES.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const robotPages = robots.map((r) => ({
    url: `${siteUrl}/robots/${r.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const experimentPages = experiments.map((e) => ({
    url: `${siteUrl}/experiments/${e.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const researchPages = researchThemes.map((t) => ({
    url: `${siteUrl}/research/${t.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // /content-status is deliberately absent: it is a noindex working document.
  return [...statics, ...robotPages, ...experimentPages, ...researchPages];
}
