import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://desakadurama.id");

  // Rute statis utama
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/transparansi/apbdes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/profil/sejarah-visi-misi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profil/pemerintahan`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profil/demografi`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/layanan`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/layanan/surat`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dusun`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dusun/pahing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/dusun/wage`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/dusun/manis`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/berita`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/agenda`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pengumuman`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/peta`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Rute dinamis artikel warta dari Supabase
  let dynamicNewsRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: news } = await supabase
      .from("news_articles")
      .select("slug, updated_at, created_at")
      .eq("is_deleted", false)
      .limit(100);

    if (news && news.length > 0) {
      dynamicNewsRoutes = news.map((item) => ({
        url: `${baseUrl}/berita/${item.slug}`,
        lastModified: new Date(item.updated_at || item.created_at || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Jika koneksi database offline saat static build, gunakan rute statis
  }

  return [...staticRoutes, ...dynamicNewsRoutes];
}
