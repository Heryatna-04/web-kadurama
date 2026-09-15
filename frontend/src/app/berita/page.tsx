"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import CivicNavbar from "@/components/CivicNavbar";
import CivicFooter from "@/components/CivicFooter";
import { NEWS_ARTICLES } from "@/data/newsData";
import {
  Search,
  Calendar,
  User,
  Clock,
  ArrowRight,
  Filter,
  Newspaper,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function BeritaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const categories = ["Semua", "Pemerintahan", "Bansos", "Kesehatan", "Pembangunan", "Kegiatan", "Ekonomi"];

  const filteredArticles = useMemo(() => {
    return NEWS_ARTICLES.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "Semua" || article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const featuredArticle = filteredArticles[0];
  const remainingArticles = filteredArticles.slice(1);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      <CivicNavbar />

      <main className="flex-1 pb-20">
        {/* Header Banner */}
        <section className="bg-gradient-to-b from-[#003733] to-[#002825] text-white pt-12 pb-16 border-b border-[#005851] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#009388_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-emerald-200/80 mb-4 font-mono">
              <Link href="/" className="hover:text-white transition">Beranda</Link>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white font-semibold">Kabar & Berita Desa</span>
            </div>

            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
                <Newspaper className="w-3.5 h-3.5" />
                Pusat Informasi Publik Desa Kadurama
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Kabar & Warta Kegiatan Desa
              </h1>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Dokumentasi resmi pembangunan, liputan musyawarah perencanaan, keterbukaan penyaluran bantuan sosial, serta kabar kegiatan warga dari 3 dusun.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="mt-8 bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/20 flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-emerald-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul atau topik berita..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#009388] shadow-sm"
                />
              </div>

              {/* Categories Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? "bg-[#eda50c] text-slate-950 shadow-sm"
                        : "bg-white/10 text-emerald-100 hover:bg-white/20"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto my-12">
              <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-extrabold text-slate-800 text-lg">Tidak Ada Berita Ditemukan</h3>
              <p className="text-xs text-slate-500 mt-1">
                Silakan ubah kata kunci pencarian atau pilih kategori lain.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Semua");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#009388] text-white text-xs font-bold hover:bg-[#007b71] transition"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Featured Lead Story */}
              {featuredArticle && (
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition grid grid-cols-1 lg:grid-cols-12 gap-0 group">
                  <div className="lg:col-span-7 h-72 sm:h-96 lg:h-auto relative overflow-hidden bg-slate-200">
                    <img
                      src={featuredArticle.imageUrl}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3.5 py-1.5 rounded-lg bg-[#009388] text-white text-xs font-bold uppercase tracking-wider shadow-md">
                        {featuredArticle.category}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#009388]" />
                          {featuredArticle.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {featuredArticle.readTime}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 group-hover:text-[#009388] transition leading-snug">
                        <Link href={`/berita/${featuredArticle.slug}`}>
                          {featuredArticle.title}
                        </Link>
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {featuredArticle.summary}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {featuredArticle.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <User className="w-3.5 h-3.5 text-[#009388]" />
                        <span>Oleh: <strong className="text-slate-800">{featuredArticle.author}</strong></span>
                      </div>

                      <Link
                        href={`/berita/${featuredArticle.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#003733] hover:bg-[#005851] text-white text-xs font-bold shadow-sm transition group/btn"
                      >
                        <span>Baca Selengkapnya</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid 3 Columns untuk Artikel Lainnya */}
              {remainingArticles.length > 0 && (
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                    <span>Arsip Warta Lainnya</span>
                    <span className="text-xs font-normal text-slate-500">
                      ({remainingArticles.length} artikel)
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {remainingArticles.map((article) => (
                      <article
                        key={article.id}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-[#009388]/50 transition flex flex-col justify-between group"
                      >
                        <div>
                          <div className="h-48 bg-slate-200 relative overflow-hidden">
                            <img
                              src={article.imageUrl}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="px-2.5 py-1 rounded-md bg-[#009388] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                {article.category}
                              </span>
                            </div>
                          </div>

                          <div className="p-5 space-y-2.5">
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <span>{article.date}</span>
                              <span>•</span>
                              <span>{article.readTime}</span>
                            </div>

                            <h4 className="font-extrabold text-slate-900 text-base group-hover:text-[#009388] transition line-clamp-2 leading-snug">
                              <Link href={`/berita/${article.slug}`}>
                                {article.title}
                              </Link>
                            </h4>

                            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                              {article.summary}
                            </p>
                          </div>
                        </div>

                        <div className="p-5 pt-0">
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-500 text-[11px]">
                              {article.authorRole}
                            </span>
                            <Link
                              href={`/berita/${article.slug}`}
                              className="font-bold text-[#009388] hover:text-[#005851] inline-flex items-center gap-1 group-hover:underline"
                            >
                              <span>Baca</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <CivicFooter />
    </div>
  );
}
