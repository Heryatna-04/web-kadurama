import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://desakadurama.id");

export const viewport: Viewport = {
  themeColor: "#002b27",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pemerintah Desa Kadurama - Kecamatan Ciawigebang, Kuningan",
    template: "%s | Desa Kadurama Kuningan",
  },
  description:
    "Portal Resmi Informasi Publik, Transparansi APBDes 2026, Profil 3 Dusun, dan Panduan Layanan Administrasi Warga Desa Kadurama, Kec. Ciawigebang, Kab. Kuningan, Jawa Barat.",
  keywords: [
    "Desa Kadurama",
    "Kadurama Ciawigebang",
    "Kuningan",
    "Pemerintah Desa Kadurama",
    "APBDes Kadurama 2026",
    "Layanan Surat Desa Kadurama",
    "Dusun Pahing",
    "Dusun Wage",
    "Dusun Manis",
    "Kuwu Samir Syarifudin",
    "Situs Resmi Desa Kadurama",
  ],
  authors: [{ name: "Pemerintah Desa Kadurama", url: siteUrl }],
  creator: "Pemerintah Desa Kadurama",
  publisher: "Pemerintah Desa Kadurama",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo-kuningan-sm.webp", type: "image/webp" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Pemerintah Desa Kadurama",
    title: "Pemerintah Desa Kadurama - Kecamatan Ciawigebang, Kuningan",
    description:
      "Portal Resmi Informasi Publik, Transparansi APBDes 2026, Profil 3 Dusun, dan Panduan Layanan Administrasi Warga Desa Kadurama, Kec. Ciawigebang, Kab. Kuningan, Jawa Barat.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Portal Resmi Pemerintah Desa Kadurama - Kabupaten Kuningan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pemerintah Desa Kadurama - Kec. Ciawigebang, Kuningan",
    description:
      "Portal Resmi Informasi Publik, Transparansi APBDes 2026, Profil 3 Dusun, dan Panduan Layanan Administrasi Warga Desa Kadurama.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org JSON-LD untuk Institusi Pemerintahan Desa
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: "Pemerintah Desa Kadurama",
    alternateName: ["Pemdes Kadurama", "Desa Kadurama"],
    url: siteUrl,
    logo: `${siteUrl}/logo-kuningan-sm.webp`,
    image: `${siteUrl}/kuningan-gate-wide.webp`,
    description:
      "Pemerintah Desa Kadurama, Kecamatan Ciawigebang, Kabupaten Kuningan, Provinsi Jawa Barat.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Desa Kadurama No. 01",
      addressLocality: "Ciawigebang",
      addressRegion: "Kuningan, Jawa Barat",
      postalCode: "45591",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -6.9687,
      longitude: 108.5661,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:30",
        closes: "15:00",
      },
    ],
  };

  return (
    <html lang="id" className={`${plusJakartaSans.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}
