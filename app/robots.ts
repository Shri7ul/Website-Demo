import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The claim ledger is a working document, not a public landing page.
        disallow: ["/content-status"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
