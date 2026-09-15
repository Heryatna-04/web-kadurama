"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CivicNavbar from "@/components/CivicNavbar";
import CivicFooter from "@/components/CivicFooter";
import { createClient } from "@/lib/supabase/client";
import {
  APBDES_TOTAL_SUMMARY as DEFAULT_SUMMARY,
  APBDES_REVENUES,
  APBDES_SECTORS as DEFAULT_SECTORS,
  APBDesSector,
} from "@/data/apbdesData";
import {
  PieChart,
  TrendingUp,
  Download,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Layers,
  FileSpreadsheet,
  RefreshCw,
} from "lucide-react";

export default function TransparansiApbdesPage() {
  const [activeSectorId, setActiveSectorId] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [sectors, setSectors] = useState<APBDesSector[]>(DEFAULT_SECTORS);

  useEffect(() => {
    async function loadApbdesData() {
      try {
        const supabase = createClient();
        const [{ data: summaryData }, { data: sectorsData }] = await Promise.all([
          supabase
            .from("apbdes_summary")
            .select("*")
            .eq("tahun", 2026)
            .maybeSingle(),
          supabase
            .from("apbdes_sectors")
            .select("*")
            .eq("is_deleted", false)
            .order("id", { ascending: true }),
        ]);

        if (summaryData) {
          setSummary({
            tahun: summaryData.tahun || 2026,
            totalPendapatan: Number(summaryData.total_pendapatan) || DEFAULT_SUMMARY.totalPendapatan,
            totalBelanja: Number(summaryData.total_belanja) || DEFAULT_SUMMARY.totalBelanja,
            totalRealisasiBelanja: Number(summaryData.total_realisasi_belanja) || DEFAULT_SUMMARY.totalRealisasiBelanja,
            persenRealisasiBelanja: Number(summaryData.persen_realisasi_belanja) || DEFAULT_SUMMARY.persenRealisasiBelanja,
            surplusDefisit: Number(summaryData.surplus_defisit) || DEFAULT_SUMMARY.surplusDefisit,
            silpaTahunLalu: Number(summaryData.silpa_tahun_lalu) || DEFAULT_SUMMARY.silpaTahunLalu,
          });
        }

        if (sectorsData && sectorsData.length > 0) {
          const mappedSectors: APBDesSector[] = sectorsData.map((s: any) => {
            const defaultMatch = DEFAULT_SECTORS.find((ds) => ds.id === s.id);
            return {
              id: s.id,
              nama: s.nama,
              persen: Number(s.persen) || 0,
              pagu: Number(s.pagu) || 0,
              realisasi: Number(s.realisasi) || 0,
              keterangan: s.keterangan || "",
              subKegiatan:
                Array.isArray(s.sub_kegiatan) && s.sub_kegiatan.length > 0
                  ? s.sub_kegiatan
                  : defaultMatch?.subKegiatan || [],
            };
          });
          setSectors(mappedSectors);
        }
      } catch (err) {
        console.warn("Gagal memuat APBDes dari Supabase, gunakan data default:", err);
      } finally {
        setLoading(false);
      }
    }

    loadApbdesData();
  }, []);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const selectedSector = sectors.find((s) => s.id === activeSectorId) || sectors[0] || DEFAULT_SECTORS[0];

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
              <span className="text-white font-semibold">Transparansi Anggaran</span>
            </div>

            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
                  <PieChart className="w-3.5 h-3.5" />
                  Akuntabilitas Publik Siskeudes
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Sinkronisasi Realtime Supabase
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                APBDes Kadurama {summary.tahun}
              </h1>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Keterbukaan informasi keuangan Anggaran Pendapatan dan Belanja Desa (APBDes) Tahun Anggaran {summary.tahun}. Transparan, akuntabel, dan berorientasi pada kemakmuran warga 3 dusun.
              </p>
            </div>

            {/* Quick KPI Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
              <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15">
                <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Total Pendapatan</div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1 font-mono">
                  {formatRupiah(summary.totalPendapatan)}
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">APBN, ADD & PADes</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15">
                <div className="text-[11px] font-bold text-[#eda50c] uppercase tracking-wider">Pagu Belanja</div>
                <div className="text-xl sm:text-2xl font-black text-[#eda50c] mt-1 font-mono">
                  {formatRupiah(summary.totalBelanja)}
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">5 Bidang Penyelenggaraan</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15">
                <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">Realisasi Berjalan</div>
                <div className="text-xl sm:text-2xl font-black text-cyan-300 mt-1 font-mono">
                  {formatRupiah(summary.totalRealisasiBelanja)}
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">Progres {summary.persenRealisasiBelanja}% (Triwulan III)</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15">
                <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Surplus / SiLPA</div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1 font-mono">
                  {formatRupiah(summary.surplusDefisit)}
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">Kondisi Kas Sehat</div>
              </div>
            </div>
          </div>
        </section>

        {/* Breakdown Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sisi Kiri: Sumber Pendapatan (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#009388]" />
                  <span>Struktur Sumber Pendapatan</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Realisasi penerimaan dana transfer pemerintah pusat, kabupaten, dan PADes.
                </p>

                <div className="mt-6 space-y-4">
                  {APBDES_REVENUES.map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex justify-between items-start text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{rev.sumber}</div>
                          <div className="text-[11px] text-slate-500">{rev.kategori}</div>
                        </div>
                        <span className="font-mono font-bold text-[#009388] text-xs">
                          {rev.persen}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-500 text-[11px]">Target: {formatRupiah(rev.target)}</span>
                        <span className="font-bold text-slate-800">{formatRupiah(rev.realisasi)}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#009388] h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(rev.persen, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => alert("Mengunduh Rincian APBDes 2026 Format PDF resmi.")}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#003733] hover:bg-[#005851] text-white text-xs font-bold transition shadow-xs"
                  >
                    <Download className="w-4 h-4 text-[#eda50c]" />
                    <span>Unduh Dokumen APBDes 2026 (PDF)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Realisasi 5 Bidang Belanja (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#eda50c]" />
                      <span>Realisasi Belanja per Bidang</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pilih bidang untuk meninjau rincian kegiatan fisik dan operasional.
                    </p>
                  </div>
                </div>

                {/* Tabs Bidang */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                  {sectors.map((sector) => (
                    <button
                      key={sector.id}
                      onClick={() => setActiveSectorId(sector.id)}
                      className={`p-3 rounded-2xl text-left border transition ${
                        activeSectorId === sector.id
                          ? "bg-[#003733] text-white border-[#003733] shadow-md"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                        Bidang 0{sector.id}
                      </div>
                      <div className="font-bold text-xs mt-0.5 line-clamp-1">{sector.nama}</div>
                      <div className="text-xs font-mono font-bold text-[#eda50c] mt-1">
                        {sector.persen}% Serap
                      </div>
                    </button>
                  ))}
                </div>

                {/* Detail Bidang Terpilih */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#009388]">
                        Bidang 0{selectedSector.id}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-base">
                        {selectedSector.nama}
                      </h4>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-black text-[#009388]">
                        {formatRupiah(selectedSector.realisasi)}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Pagu: {formatRupiah(selectedSector.pagu)}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedSector.keterangan}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      Rincian Sub-Kegiatan:
                    </div>
                    {selectedSector.subKegiatan && selectedSector.subKegiatan.length > 0 ? (
                      selectedSector.subKegiatan.map((sub, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <div className="font-bold text-slate-900">{sub.nama}</div>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {sub.status}
                            </span>
                          </div>
                          <div className="text-right sm:flex-shrink-0 font-mono">
                            <div className="font-bold text-slate-900">{formatRupiah(sub.realisasi)}</div>
                            <div className="text-[10px] text-slate-400">Pagu: {formatRupiah(sub.anggaran)}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">Belum ada rincian sub-kegiatan tercatat.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <CivicFooter />
    </div>
  );
}
