"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CivicNavbar from "@/components/CivicNavbar";
import CivicFooter from "@/components/CivicFooter";
import { NEWS_ARTICLES, NewsArticle } from "@/data/newsData";
import {
  Calendar,
  User,
  Clock,
  ChevronRight,
  ChevronLeft,
  Share2,
  Bookmark,
  Newspaper,
  Tag,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BeritaDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const article = NEWS_ARTICLES.find((item) => item.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
        <CivicNavbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center max-w-md shadow-sm">
            <Newspaper className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900">Berita Tidak Ditemukan</h2>
            <p className="text-xs text-slate-500 mt-2">
              Artikel berita dengan tautan ini tidak tersedia atau telah dipindahkan.
            </p>
            <Link
              href="/berita"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009388] text-white font-bold text-xs hover:bg-[#007b71] transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Kembali ke Indeks Berita</span>
            </Link>
          </div>
        </main>
        <CivicFooter />
      </div>
    );
  }

  // Related articles (same category or recent, excluding current)
  const relatedArticles = NEWS_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Tautan artikel berhasil disalin ke papan klip!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      <CivicNavbar />

      <main className="flex-1 pb-24">
        {/* Breadcrumbs & Title Section */}
        <section className="bg-gradient-to-b from-[#003733] to-[#002825] text-white pt-10 pb-16 border-b border-[#005851]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs text-emerald-200/80 mb-4 font-mono">
              <Link href="/" className="hover:text-white transition">Beranda</Link>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              <Link href="/berita" className="hover:text-white transition">Kabar Desa</Link>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-semibold truncate max-w-[200px] sm:max-w-none">
                {article.category}
              </span>
            </div>

            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-md bg-[#009388] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                {article.category}
              </span>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {article.title}
              </h1>

              {/* Author and Date Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#eda50c]" />
                  <span>Oleh: <strong className="text-white">{article.author}</strong> ({article.authorRole})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-300" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Body Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-10">
            {/* Featured Image */}
            <div className="rounded-2xl overflow-hidden mb-8 max-h-[460px] bg-slate-100">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Summary Highlight Box */}
            <div className="bg-[#e6f7f5] border-l-4 border-[#009388] p-4 sm:p-5 rounded-r-2xl mb-8">
              <div className="text-xs font-bold text-[#003733] uppercase tracking-wider mb-1">
                Ikhtisar Berita
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {article.summary}
              </p>
            </div>

            {/* Content Paragraphs */}
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-5 text-sm sm:text-base font-normal">
              {article.content.map((para, idx) => (
                <p key={idx} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Tags & Share */}
            <div className="pt-8 mt-10 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#e6f7f5] hover:text-[#009388] text-xs font-bold text-slate-700 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Salin Tautan Berita</span>
              </button>
            </div>

            {/* Government Verification Badge */}
            <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
              <CheckCircle2 className="w-5 h-5 text-[#009388] flex-shrink-0" />
              <div>
                <strong className="text-slate-900 block">Warta Resmi Terverifikasi Pemerintah Desa Kadurama</strong>
                <span>Diterbitkan oleh Sekretariat Desa Kadurama sesuai standar keterbukaan informasi publik.</span>
              </div>
            </div>
          </div>

          {/* Related Articles Carousel/Grid */}
          <div className="mt-14">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-slate-900">
                Kabar Terkait Lainnya
              </h3>
              <Link
                href="/berita"
                className="text-xs font-bold text-[#009388] hover:text-[#005851] flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-40 bg-slate-200 relative overflow-hidden">
                      <img
                        src={rel.imageUrl}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="text-[11px] text-slate-400 font-medium">
                        {rel.date}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#009388] transition line-clamp-2 leading-snug">
                        <Link href={`/berita/${rel.slug}`}>
                          {rel.title}
                        </Link>
                      </h4>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <Link
                      href={`/berita/${rel.slug}`}
                      className="text-xs font-bold text-[#009388] inline-flex items-center gap-1 hover:underline"
                    >
                      <span>Baca</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <CivicFooter />
    </div>
  );
}
