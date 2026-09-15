"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CivicNavbar from "@/components/CivicNavbar";
import CivicFooter from "@/components/CivicFooter";
import { Info, ArrowRight, Building2, Clock } from "lucide-react";

export default function SuratRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/layanan");
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      <CivicNavbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 max-w-lg text-center shadow-xs space-y-5">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-[#eda50c]">
            <Building2 className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Pelayanan Langsung di Balai Desa
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Saat ini permohonan surat belum dilayani secara daring (online). Warga dipersilakan membawa berkas persyaratan fisik langsung ke loket pelayanan Kantor Balai Desa Kadurama.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-[#009388]" />
            <span>Jam Operasional: Senin - Jumat (08.00 - 15.00 WIB)</span>
          </div>

          <div className="pt-2">
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-xs transition"
            >
              <span>Buka Informasi Persyaratan Berkas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <CivicFooter />
    </div>
  );
}
