"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CivicNavbar from "@/components/CivicNavbar";
import CivicFooter from "@/components/CivicFooter";
import { createClient } from "@/lib/supabase/client";
import {
  APBDES_TOTAL_SUMMARY,
  APBDES_REVENUES,
  APBDES_SECTORS,
  ILPPD_2025_SUMMARY,
  ILPPD_2025_SECTORS,
  APBDesSector,
  APBDesRevenue,
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
  FileText,
  Calendar,
  Building2,
  AlertCircle,
} from "lucide-react";

export default function TransparansiApbdesPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [activeSectorId, setActiveSectorId] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // States APBDes / ILPPD
  const [summary, setSummary] = useState(APBDES_TOTAL_SUMMARY);
  const [sectors, setSectors] = useState<APBDesSector[]>(APBDES_SECTORS);
  const [revenues, setRevenues] = useState<APBDesRevenue[]>(APBDES_REVENUES);

  useEffect(() => {
    document.title = `Transparansi APBDes & Realisasi Anggaran ${selectedYear} | Desa Kadurama Kuningan`;
  }, [selectedYear]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const supabase = createClient();
        const [
          { data: summaryData },
          { data: sectorsData },
          { data: revenuesData },
        ] = await Promise.all([
          supabase
            .from("apbdes_summary")
            .select("*")
            .eq("tahun", selectedYear)
            .maybeSingle(),
          supabase
            .from("apbdes_sectors")
            .select("*")
            .eq("tahun", selectedYear)
            .eq("is_deleted", false)
            .order("id", { ascending: true }),
          supabase
            .from("apbdes_revenues")
            .select("*")
            .eq("tahun", selectedYear)
            .order("id", { ascending: true }),
        ]);

        if (summaryData) {
          setSummary({
            tahun: summaryData.tahun,
            totalPendapatan: Number(summaryData.total_pendapatan),
            totalBelanja: Number(summaryData.total_belanja),
            totalRealisasiBelanja: Number(summaryData.total_realisasi_belanja),
            persenRealisasiBelanja: Number(summaryData.persen_realisasi_belanja),
            surplusDefisit: Number(summaryData.surplus_defisit),
            pembiayaanNetto: 41700000,
            silpaTahunLalu: Number(summaryData.silpa_tahun_lalu),
          });
        } else {
          setSummary(selectedYear === 2026 ? APBDES_TOTAL_SUMMARY : (ILPPD_2025_SUMMARY as any));
        }

        if (sectorsData && sectorsData.length > 0) {
          const mapped: APBDesSector[] = sectorsData.map((s: any) => ({
            id: s.id,
            tahun: s.tahun,
            nama: s.nama,
            persen: Number(s.persen) || 0,
            pagu: Number(s.pagu) || 0,
            realisasi: Number(s.realisasi) || 0,
            keterangan: s.keterangan || "",
            subKegiatan: Array.isArray(s.sub_kegiatan) ? s.sub_kegiatan : [],
          }));
          setSectors(mapped);
          setActiveSectorId(mapped[0]?.id || 1);
        } else {
          setSectors(selectedYear === 2026 ? APBDES_SECTORS : ILPPD_2025_SECTORS);
          setActiveSectorId(1);
        }

        if (revenuesData && revenuesData.length > 0) {
          const mappedRev: APBDesRevenue[] = revenuesData.map((r: any) => ({
            id: `REV-${r.id}`,
            tahun: r.tahun,
            sumber: r.nama,
            kategori: r.kategori,
            target: Number(r.anggaran),
            realisasi: Number(r.realisasi),
            persen: r.anggaran > 0 ? Number(((r.realisasi / r.anggaran) * 100).toFixed(1)) : 0,
            keterangan: r.keterangan,
          }));
          setRevenues(mappedRev);
        } else {
          setRevenues(selectedYear === 2026 ? APBDES_REVENUES : []);
        }
      } catch (err) {
        console.warn("Gagal memuat APBDes dari Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedYear]);

  const formatRupiah = (val?: number | null) => {
    if (val === undefined || val === null) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const selectedSector = sectors.find((s) => s.id === activeSectorId) || sectors[0];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      <CivicNavbar />

      <main className="flex-1 pb-24">
        {/* Banner Section */}
        <section className="bg-gradient-to-b from-[#003733] to-[#002825] text-white pt-12 pb-16 border-b border-[#005851] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#009388_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-emerald-200/80 mb-4 font-mono">
              <Link href="/" className="hover:text-white transition">Beranda</Link>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white font-semibold">Transparansi Anggaran Desa</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-3xl space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
                    <PieChart className="w-3.5 h-3.5" />
                    Keterbukaan Informasi Publik Siskeudes
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Terverifikasi Pemdes Kadurama
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {selectedYear === 2026
                    ? "APBDes Kadurama TA 2026"
                    : "Laporan Realisasi ILPPD TA 2025"}
                </h1>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal max-w-2xl">
                  {selectedYear === 2026
                    ? "Rincian resmi Anggaran Pendapatan dan Belanja Desa (APBDes) Tahun Anggaran 2026 yang telah disahkan Kepala Desa Samir Syarifudin dan BPD Desa Kadurama."
                    : "Informasi Laporan Penyelenggaraan Pemerintahan Desa (ILPPD) Tahun Anggaran 2025 yang memuat realisasi fisik dan pertanggungjawaban anggaran."}
                </p>
              </div>

              {/* Year / Document Switcher Tabs */}
              <div className="p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-1.5 self-start lg:self-auto shrink-0 shadow-lg">
                <button
                  onClick={() => setSelectedYear(2026)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    selectedYear === 2026
                      ? "bg-[#009388] text-white shadow-md ring-1 ring-white/30"
                      : "text-emerald-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#eda50c]" />
                  <span>APBDes Murni 2026</span>
                </button>
                <button
                  onClick={() => setSelectedYear(2025)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    selectedYear === 2025
                      ? "bg-[#009388] text-white shadow-md ring-1 ring-white/30"
                      : "text-emerald-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Laporan ILPPD 2025</span>
                </button>
              </div>
            </div>

            {/* Quick KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
              <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15">
                <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  {selectedYear === 2026 ? "Pagu Pendapatan 2026" : "Realisasi Pendapatan 2025"}
                </div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1 font-mono">
                  {loading ? "..." : formatRupiah(selectedYear === 2026 ? summary.totalPendapatan : 1477820277)}
                </div>
                <div className="text-[11px] text-emerald-200/80 mt-0.5">
                  {selectedYear === 2026 ? "PADes, Dana Desa, ADD & BKP" : "Anggaran: Rp 1.477.514.768"}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15">
                <div className="text-[11px] font-bold text-[#eda50c] uppercase tracking-wider">
                  {selectedYear === 2026 ? "Pagu Belanja 2026" : "Realisasi Belanja 2025"}
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#eda50c] mt-1 font-mono">
                  {loading ? "..." : formatRupiah(selectedYear === 2026 ? summary.totalBelanja : 1291506827)}
                </div>
                <div className="text-[11px] text-amber-200/80 mt-0.5">
                  {selectedYear === 2026 ? "Alokasi 5 Bidang Belanja" : "Anggaran: Rp 1.291.201.368"}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15">
                <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                  Surplus Anggaran
                </div>
                <div className="text-xl sm:text-2xl font-black text-cyan-300 mt-1 font-mono">
                  {loading ? "..." : formatRupiah(selectedYear === 2026 ? 41700000 : 186313400)}
                </div>
                <div className="text-[11px] text-cyan-200/80 mt-0.5">
                  {selectedYear === 2026 ? "Dialokasikan ke Pembiayaan" : "Kondisi Keuangan Sehat"}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15">
                <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  Pengeluaran Pembiayaan
                </div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1 font-mono">
                  {loading ? "..." : formatRupiah(selectedYear === 2026 ? 41700000 : 186313400)}
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  {selectedYear === 2026 ? "BUMDes (35 Jt) & Pilkades (6,7 Jt)" : "BUMDes & Cadangan Pilkades"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Breakdown Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sisi Kiri: Sumber Pendapatan (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#009388] uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4" />
                    <span>Sumber Pendapatan ({selectedYear})</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg mt-0.5">
                    Struktur Penerimaan Dana Desa
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedYear === 2026
                      ? "Pagu target ketetapan pendapatan desa tahun berjalan."
                      : "Laporan realisasi pencairan dana transfer & PADes TA 2025."}
                  </p>
                </div>

                <div className="space-y-3.5">
                  {revenues.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors space-y-2"
                    >
                      <div className="flex justify-between items-start text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{rev.sumber}</div>
                          <div className="text-[11px] text-slate-500">{rev.keterangan || rev.kategori}</div>
                        </div>
                        <span className="font-mono font-bold text-[#009388] text-xs shrink-0 ml-2">
                          {selectedYear === 2026
                            ? `${((rev.target / summary.totalPendapatan) * 100).toFixed(1)}% Porsi`
                            : `${rev.persen}% Serap`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-mono pt-1 border-t border-slate-200/60">
                        <span className="text-slate-400 text-[11px]">
                          {selectedYear === 2026 ? "Pagu Ditetapkan:" : "Realisasi Dana:"}
                        </span>
                        <span className="font-bold text-slate-800">
                          {formatRupiah(selectedYear === 2026 ? rev.target : rev.realisasi || rev.target)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ringkasan Pembiayaan Netto Card */}
                <div className="p-4 rounded-2xl bg-[#003733] text-white space-y-2.5 shadow-sm border border-[#005851]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#eda50c]">
                      Pos Pembiayaan Netto
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-300">
                      {formatRupiah(selectedYear === 2026 ? 41700000 : 186313400)}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-100/90 leading-relaxed">
                    {selectedYear === 2026 ? (
                      <ul className="space-y-1 text-[11px]">
                        <li>• Penyertaan Modal BUMDes: <strong>Rp 35.000.000</strong></li>
                        <li>• Pembentukan Dana Cadangan Pilkades: <strong>Rp 6.700.000</strong></li>
                      </ul>
                    ) : (
                      <ul className="space-y-1 text-[11px]">
                        <li>• Penyertaan Modal BUMDes TA 2025: <strong>Rp 177.113.400</strong></li>
                        <li>• Cadangan Pilkades & Purnabakti: <strong>Rp 9.200.000</strong></li>
                      </ul>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() =>
                      alert(
                        `Mengunduh salinan berkas resmi format PDF TA ${selectedYear} Desa Kadurama...`
                      )
                    }
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#003733] hover:bg-[#002825] text-white text-xs font-bold transition shadow-xs border border-[#005851]"
                  >
                    <Download className="w-4 h-4 text-[#eda50c]" />
                    <span>Unduh Salinan Dokumen TA {selectedYear} (PDF)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Realisasi 5 Bidang Belanja (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#eda50c] uppercase tracking-wider">
                    <Layers className="w-4 h-4" />
                    <span>Rincian 5 Bidang Belanja ({selectedYear})</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg mt-0.5">
                    Alokasi Pembangunan & Penyelenggaraan Desa
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Klik bidang untuk melihat daftar sub-kegiatan dan alokasi anggarannya.
                  </p>
                </div>

                {/* Tabs Bidang */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {sectors.map((sector) => (
                    <button
                      key={sector.id}
                      onClick={() => setActiveSectorId(sector.id)}
                      className={`p-3.5 rounded-2xl text-left border transition-all ${
                        activeSectorId === sector.id
                          ? "bg-[#003733] text-white border-[#003733] shadow-md ring-1 ring-emerald-400/40"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 font-mono">
                          Bidang 0{sector.id}
                        </span>
                        <span
                          className={`text-xs font-mono font-bold ${
                            activeSectorId === sector.id ? "text-[#eda50c]" : "text-[#009388]"
                          }`}
                        >
                          {formatRupiah(sector.pagu)}
                        </span>
                      </div>
                      <div className="font-bold text-xs mt-1 line-clamp-1">{sector.nama}</div>
                    </button>
                  ))}
                </div>

                {/* Detail Bidang Terpilih & Daftar Sub Kegiatan */}
                {selectedSector && (
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#009388] font-mono">
                          Bidang 0{selectedSector.id}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-base">
                          {selectedSector.nama}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {selectedSector.keterangan}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm sm:text-base font-mono font-black text-[#009388]">
                          {formatRupiah(selectedSector.pagu)}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">
                          Total Pagu Bidang
                        </div>
                      </div>
                    </div>

                    {/* Sub-Kegiatan List */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Rincian Item Sub-Kegiatan Resmi:
                      </div>

                      {selectedSector.subKegiatan && selectedSector.subKegiatan.length > 0 ? (
                        <div className="space-y-2">
                          {selectedSector.subKegiatan.map((item, idx) => {
                            const p = Number(item.anggaran) || 0;
                            const r = Number(item.realisasi) || 0;
                            const pct = p > 0 ? Number(((r / p) * 100).toFixed(1)) : 0;

                            return (
                              <div
                                key={item.id || `sub-trans-${idx}`}
                                className="p-3 rounded-xl bg-white border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 sm:gap-3 shadow-2xs"
                              >
                                <div className="flex items-start gap-2 min-w-0 flex-1">
                                  <span className="font-mono text-[11px] font-bold text-slate-400 shrink-0 mt-0.5">
                                    #{idx + 1}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="font-medium text-slate-800 leading-snug">
                                      {item.nama}
                                    </div>
                                    {item.keterangan && (
                                      <p className="text-[11px] text-slate-500 mt-0.5">{item.keterangan}</p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 sm:justify-end shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                  <div className="text-right">
                                    <div className="font-mono font-bold text-slate-900 text-xs">
                                      {formatRupiah(p)}
                                    </div>
                                    {r > 0 && (
                                      <div className="text-[10px] font-mono text-[#009388] font-semibold">
                                        Realisasi: {formatRupiah(r)} ({pct}%)
                                      </div>
                                    )}
                                  </div>
                                  {pct >= 100 ? (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                      Selesai
                                    </span>
                                  ) : pct > 0 ? (
                                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                                      {pct}%
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-500 italic">
                          Alokasi anggaran belanja pada bidang ini adalah Rp 0 untuk Tahun Anggaran {selectedYear}.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <CivicFooter />
    </div>
  );
}
