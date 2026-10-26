import type { Metadata, Viewport } from "next";
import { Archivo, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site, siteUrl } from "@/content/site";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.shortName} — ${site.name}`,
    template: `%s — ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  openGraph: {
    title: `${site.name} (${site.shortName})`,
    description: site.description,
    type: "website",
    locale: "en_GB",
    siteName: site.name,
    url: "/",
    images: [
      {
        url: "/assets/events/team-competition-rover.png",
        width: 1388,
        height: 858,
        alt: "The UIU Rescue Rover Team with a rover at a competition venue.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} (${site.shortName})`,
    description: site.description,
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#101820",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${archivo.variable} ${sourceSerif.variable}`}>
      <body>
        <a href="#main" className="skip-link ui">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
