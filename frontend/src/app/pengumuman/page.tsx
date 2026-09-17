"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CivicNavbar from "@/components/CivicNavbar";
import CivicFooter from "@/components/CivicFooter";
import { createClient } from "@/lib/supabase/client";
import { ANNOUNCEMENTS_LIST } from "@/data/newsData";
import {
  Bell,
  Calendar,
  Clock,
  Download,
  FileText,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Search,
} from "lucide-react";

interface AnnouncementItem {
  id: string;
  title: string;
  number: string;
  date: string;
  validUntil?: string;
  summary: string;
  content?: string;
  category: string;
  isUrgent?: boolean;
  issuer?: string;
  fileUrl?: string;
  fileSize?: string;
}

export default function PengumumanPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(ANNOUNCEMENTS_LIST);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .eq("is_deleted", false)
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          const mapped: AnnouncementItem[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            number: item.number,
            date: item.date,
            validUntil: item.valid_until || item.date,
            summary: item.summary,
            content: item.content || item.summary,
            category: item.category,
            isUrgent: !!item.is_urgent,
            issuer: item.issuer || "Pemerintah Desa Kadurama",
            fileUrl: item.file_url,
            fileSize: item.file_size || "PDF",
          }));
          setAnnouncements(mapped);
        } else {
          setAnnouncements(ANNOUNCEMENTS_LIST);
        }
      } catch (err) {
        console.warn("Gagal memuat pengumuman dari Supabase:", err);
        setAnnouncements(ANNOUNCEMENTS_LIST);
      } finally {
        setLoading(false);
      }
    }

    loadAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      <CivicNavbar />

      <main className="flex-1 pb-24">
        {/* Banner Section */}
        <section className="bg-gradient-to-b from-[#003733] to-[#002825] text-white pt-12 pb-16 border-b border-[#005851] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#009388_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center gap-2 text-xs text-emerald-200/80 mb-4 font-mono">
              <Link href="/" className="hover:text-white transition">Beranda</Link>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white font-semibold">Pengumuman Resmi</span>
            </div>

            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
                <Bell className="w-3.5 h-3.5" />
                Pemberitahuan & Edaran Resmi
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Pengumuman Pemerintah Desa
              </h1>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Surat edaran Kuwu, jadwal pelayanan kependudukan, batas pelunasan pajak daerah PBB-P2, serta informasi seleksi dan bantuan sosial.
              </p>
            </div>

            {/* Search Input */}
            <div className="mt-8 max-w-md">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nomor edaran atau judul pengumuman..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#009388] shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-3 border-[#009388] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500 font-medium">Memuat pengumuman resmi desa...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto my-8 shadow-xs">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-extrabold text-slate-800 text-lg">Belum Ada Pengumuman Resmi</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Saat ini belum ada surat edaran, pemberitahuan pajak, ataupun pengumuman resmi yang diterbitkan oleh Pemerintah Desa Kadurama.
              </p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto my-8 shadow-xs">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-extrabold text-slate-800 text-lg">Tidak Ada Pengumuman Cocok</h3>
              <p className="text-xs text-slate-500 mt-1">
                Silakan ubah kata kunci pencarian nomor surat atau judul edaran.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 rounded-xl bg-[#009388] text-white text-xs font-bold hover:bg-[#007b71] transition"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAnnouncements.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.isUrgent
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-[#e6f7f5] text-[#003733] border border-[#009388]/30"
                          }`}
                        >
                          {item.category}
                        </span>
                        <span className="text-xs font-mono font-semibold text-slate-500">
                          No. {item.number}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-[#009388]" />
                        <span>Diterbitkan: {item.date}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-amber-700 font-semibold">Berlaku s.d: {item.validUntil}</span>
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      {item.content}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-[#009388]" />
                      <span>Dikeluarkan oleh: <strong className="text-slate-800">{item.issuer}</strong></span>
                    </div>

                    <button
                      onClick={() => alert(`Mengunduh dokumen surat edaran No: ${item.number}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#003733] hover:bg-[#002825] text-white font-bold text-xs shadow-sm transition"
                    >
                      <Download className="w-3.5 h-3.5 text-[#eda50c]" />
                      <span>Unduh Dokumen Salinan {item.fileSize && `(${item.fileSize})`}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <CivicFooter />
    </div>
  );
}
