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
    icon: "/logo-kuningan.png",
    apple: "/logo-kuningan.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Pemerintah Desa Kadurama",
    title: "Pemerintah Desa Kadurama - Menuju Desa Mandiri dan Transparan",
    description:
      "Akses data kependudukan riil 3 dusun, transparansi anggaran APBDes 2026, arsip warta kegiatan desa, dan panduan syarat administrasi warga secara terbuka.",
    images: [
      {
        url: "/logo-kuningan.png",
        width: 1107,
        height: 1476,
        alt: "Lambang Resmi Kabupaten Kuningan - Pemerintah Desa Kadurama",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pemerintah Desa Kadurama - Kab. Kuningan",
    description:
      "Portal Resmi Informasi Publik dan Pelayanan Administrasi Warga Desa Kadurama, Ciawigebang, Kuningan.",
    images: ["/logo-kuningan.png"],
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
    logo: `${siteUrl}/logo-kuningan.png`,
    image: `${siteUrl}/kuningan-gate.png`,
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
