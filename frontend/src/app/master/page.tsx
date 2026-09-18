"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { createClient } from "@/lib/supabase/client";
import { recordAuditLog } from "@/lib/supabase/audit";
import {
  AparaturUser,
  Resident,
  SensusKK,
  AuditLog,
  calculateDesil,
  APARATUR_ACCOUNTS,
} from "@/data/masterData";
import { NEWS_ARTICLES, ANNOUNCEMENTS_LIST, AGENDA_LIST } from "@/data/newsData";
import {
  ClipboardCheck,
  Users,
  UserCheck,
  Network,
  GitFork,
  Heart,
  PieChart,
  Newspaper,
  Bell,
  Calendar,
  Clock,
  MapPin,
  History,
  Lock,
  X,
  ShieldCheck,
  ArrowRight,
  LogOut,
  Search,
  Filter,
  Download,
  Plus,
  Edit3,
  Trash2,
  Check,
  Printer,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Building2,
  FileSpreadsheet,
  AlertTriangle,
  Camera,
  RefreshCw,
  Upload,
  FileText,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  ArrowLeft,
  Key,
  Info,
  Mail,
} from "lucide-react";

// ----------------------------------------------------------------------------
// KOMPONEN KONTROL PAGINASI TABEL MASTER TERPADU
// ----------------------------------------------------------------------------
function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  itemLabel = "data",
}: {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  itemLabel?: string;
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  return (
    <div className="px-4 py-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
      <div className="flex items-center gap-3">
        <span>
          Menampilkan{" "}
          <strong className="text-slate-900 font-semibold">{startItem}</strong> -{" "}
          <strong className="text-slate-900 font-semibold">{endItem}</strong> dari{" "}
          <strong className="text-slate-900 font-semibold">{totalItems.toLocaleString("id-ID")}</strong>{" "}
          {itemLabel}
        </span>

        <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
          <span className="text-slate-400">Baris:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#009388]"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition"
          title="Halaman Pertama"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition"
          title="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((p, idx) =>
            p === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 select-none">
                ...
              </span>
            ) : (
              <button
                key={`page-${p}`}
                onClick={() => onPageChange(Number(p))}
                className={`min-w-[30px] h-[30px] px-2 rounded-lg text-xs font-semibold transition ${
                  currentPage === p
                    ? "bg-[#009388] text-white shadow-xs font-bold"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition"
          title="Halaman Selanjutnya"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition"
          title="Halaman Terakhir"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// HELPER KALKULASI USIA RESMI DARI TTL / NIK
// ----------------------------------------------------------------------------
function getResidentAge(ttl?: string, nik?: string): { age: number | null; label: string } {
  const currentYear = 2026;

  if (ttl) {
    const yearMatch = ttl.match(/\b(19\d{2}|20\d{2})\b/);
    if (yearMatch) {
      const birthYear = parseInt(yearMatch[1], 10);
      if (birthYear > 1900 && birthYear <= currentYear) {
        const age = currentYear - birthYear;
        return { age, label: `${age} Thn` };
      }
    }
  }

  if (nik && nik.length >= 12 && !nik.startsWith("TEMP-")) {
    const rawMonth = parseInt(nik.substring(8, 10), 10);
    const rawYear = parseInt(nik.substring(10, 12), 10);

    if (!isNaN(rawMonth) && !isNaN(rawYear) && rawMonth >= 1 && rawMonth <= 12) {
      const fullBirthYear = rawYear <= 26 ? 2000 + rawYear : 1900 + rawYear;
      const age = currentYear - fullBirthYear;
      if (age >= 0 && age <= 120) {
        return { age, label: `${age} Thn` };
      }
    }
  }

  return { age: null, label: "-" };
}

// Helper Validasi Format 16 Digit NIK & No. KK Standar Nasional Dukcapil
export function validateNikOrKk(val: string, label: "NIK" | "No. KK") {
  const clean = (val || "").trim();
  if (!clean) return { valid: false, message: `${label} wajib diisi!` };
  if (!/^\d+$/.test(clean)) return { valid: false, message: `${label} hanya boleh berisi karakter angka (0-9)!` };
  if (clean.length !== 16) return { valid: false, message: `${label} harus tepat 16 digit angka (saat ini: ${clean.length} digit)!` };
  return { valid: true, message: `${label} 16 digit valid` };
}

// Helper Sensor Privasi NIK (Kepatuhan UU No. 27/2022 tentang Perlindungan Data Pribadi)
export function formatMaskedNik(val: string, masked: boolean) {
  if (!val) return "-";
  if (!masked || val.length < 10) return val;
  return `${val.slice(0, 6)}******${val.slice(-4)}`;
}

export default function MasterPanelPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  // Keamanan & Privasi Data Warga (Kepatuhan UU PDP No. 27/2022)
  const [maskSensitiveData, setMaskSensitiveData] = useState<boolean>(true);

  // --------------------------------------------------------------------------
  // STATE OTORISASI & PENGGUNA AKTIF
  // --------------------------------------------------------------------------
  const [currentUser, setCurrentUser] = useState<AparaturUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Form login jika belum terotentikasi (Fitur Login Sungguhan)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Modal Ubah Kata Sandi Akun
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    error: "",
    isSubmitting: false,
  });

  // --------------------------------------------------------------------------
  // STATE NAVIGASI TAB UTAMA
  // --------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<
    "sensus" | "residents" | "relasi" | "apbdes" | "berita" | "pengumuman" | "agenda" | "audit"
  >("sensus");

  // State Peta Relasi KK & KTP (Civic Knowledge Graph)
  const [relasiSubView, setRelasiSubView] = useState<"tree" | "matrix">("tree");
  const [selectedRelasiKkNo, setSelectedRelasiKkNo] = useState<string>("");
  const [relasiSearch, setRelasiSearch] = useState<string>("");
  const [relasiDusunFilter, setRelasiDusunFilter] = useState<string>("all");
  const [selectedGraphEntity, setSelectedGraphEntity] = useState<{ type: "KTP" | "KK"; data: any } | null>(null);

  // --------------------------------------------------------------------------
  // DATA DARI SUPABASE (DENGAN REFRESH REAL-TIME)
  // --------------------------------------------------------------------------
  const [sensusList, setSensusList] = useState<SensusKK[]>([]);
  const [residentsList, setResidentsList] = useState<Resident[]>([]);
  const [newsList, setNewsList] = useState<any[]>(() =>
    NEWS_ARTICLES.map((n) => ({
      id: n.id,
      slug: n.slug,
      title: n.title,
      category: n.category,
      date: n.date,
      author: n.author,
      author_role: n.authorRole,
      read_time: n.readTime,
      summary: n.summary,
      content: n.content,
      status: n.status,
      image_url: n.imageUrl,
      tags: n.tags,
      is_deleted: false,
    }))
  );
  const [newsSearch, setNewsSearch] = useState("");
  const [newsCategoryFilter, setNewsCategoryFilter] = useState("all");
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<any | null>(null);
  const [newsForm, setNewsForm] = useState({
    id: "",
    title: "",
    category: "Pemerintahan",
    author: "",
    author_role: "",
    read_time: "3 menit baca",
    summary: "",
    content: "",
    status: "Terbit",
    image_url: "",
    tags: "",
  });
  const [isSubmittingNews, setIsSubmittingNews] = useState(false);

  // --------------------------------------------------------------------------
  // STATE PENGUMUMAN RESMI DESA
  // --------------------------------------------------------------------------
  const [announcementList, setAnnouncementList] = useState<any[]>(ANNOUNCEMENTS_LIST);
  const [announcementSearch, setAnnouncementSearch] = useState("");
  const [announcementCategoryFilter, setAnnouncementCategoryFilter] = useState("all");
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null);
  const [isSubmittingAnnouncement, setIsSubmittingAnnouncement] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    id: "",
    number: "",
    title: "",
    category: "Edaran Kuwu",
    date: "",
    time: "08.00 - 15.00 WIB",
    summary: "",
    is_urgent: false,
    file_url: "",
  });

  // --------------------------------------------------------------------------
  // STATE AGENDA KEGIATAN DESA
  // --------------------------------------------------------------------------
  const [agendaList, setAgendaList] = useState<any[]>(AGENDA_LIST);
  const [agendaSearch, setAgendaSearch] = useState("");
  const [agendaDusunFilter, setAgendaDusunFilter] = useState("all");
  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState<any | null>(null);
  const [isSubmittingAgenda, setIsSubmittingAgenda] = useState(false);
  const [agendaForm, setAgendaForm] = useState({
    id: "",
    title: "",
    description: "",
    date: "",
    time: "09.00 - 11.30 WIB",
    location: "Balai Desa Kadurama",
    organizer: "Pemerintah Desa Kadurama",
    dusun: "Semua Dusun",
    status: "Akan Datang",
  });

  // APBDes states
  const [apbdesList, setApbdesList] = useState<any[]>([]);
  const [apbdesSummary, setApbdesSummary] = useState<any>({
    tahun: 2026,
    total_pendapatan: 1488500000,
    total_belanja: 1445000000,
    total_realisasi_belanja: 1148782000,
    persen_realisasi_belanja: 79.5,
    surplus_defisit: 43500000,
    silpa_tahun_lalu: 28400000,
  });
  const [isEditSummaryModalOpen, setIsEditSummaryModalOpen] = useState(false);
  const [summaryForm, setSummaryForm] = useState<any>({
    tahun: 2026,
    total_pendapatan: 1488500000,
    total_belanja: 1445000000,
    total_realisasi_belanja: 1148782000,
    persen_realisasi_belanja: 79.5,
    surplus_defisit: 43500000,
    silpa_tahun_lalu: 28400000,
  });
  const [isEditSectorModalOpen, setIsEditSectorModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<any | null>(null);
  const [sectorForm, setSectorForm] = useState({
    id: 1,
    nama: "",
    pagu: 0,
    realisasi: 0,
    persen: 0,
    keterangan: "",
  });
  const [isSubmittingApbdes, setIsSubmittingApbdes] = useState(false);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Filter & Search
  const [sensusDusunFilter, setSensusDusunFilter] = useState<string>("all");
  const [sensusDesilFilter, setSensusDesilFilter] = useState<string>("all");
  const [sensusSearch, setSensusSearch] = useState("");

  const [residentDusunFilter, setResidentDusunFilter] = useState<string>("all");
  const [residentSearch, setResidentSearch] = useState("");

  // Paginasi Sensus Keluarga & Master Penduduk
  const [sensusPage, setSensusPage] = useState<number>(1);
  const [sensusPageSize, setSensusPageSize] = useState<number>(20);

  const [residentPage, setResidentPage] = useState<number>(1);
  const [residentPageSize, setResidentPageSize] = useState<number>(20);

  // Reset halaman saat filter/pencarian berubah
  useEffect(() => {
    setSensusPage(1);
  }, [sensusDusunFilter, sensusDesilFilter, sensusSearch]);

  useEffect(() => {
    setResidentPage(1);
  }, [residentDusunFilter, residentSearch]);

  // Modals & Override
  const [isSensusModalOpen, setIsSensusModalOpen] = useState(false);
  const [editingSensus, setEditingSensus] = useState<SensusKK | null>(null);
  const [desilMode, setDesilMode] = useState<"auto" | "manual">("auto");
  const [manualDesil, setManualDesil] = useState<number>(1);

  // Modal Soft Delete Berdasar Alasan Resmi (Meninggal / Pindah / Lainnya)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "sensus" | "resident";
    sensusItem: SensusKK | null;
    residentItem: Resident | null;
    reason: string;
    customReason: string;
    isSubmitting: boolean;
  }>({
    isOpen: false,
    type: "resident",
    sensusItem: null,
    residentItem: null,
    reason: "Meninggal Dunia",
    customReason: "",
    isSubmitting: false,
  });

  const [isResidentModalOpen, setIsResidentModalOpen] = useState(false);
  const [isEditingResidentExisting, setIsEditingResidentExisting] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);

  const [selectedSensusForPdf, setSelectedSensusForPdf] = useState<SensusKK | null>(null);

  // Modal Impor Excel (Dukcapil SIAK)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFileName, setImportFileName] = useState("");
  const [importParsedResidents, setImportParsedResidents] = useState<Resident[]>([]);
  const [importParsedSensus, setImportParsedSensus] = useState<any[]>([]);
  const [importDefaultDusun, setImportDefaultDusun] = useState<"Manis" | "Pahing" | "Wage">("Wage");
  const [importDefaultRt, setImportDefaultRt] = useState("01");
  const [importDefaultRw, setImportDefaultRw] = useState("01");
  const [importCreateSensusKK, setImportCreateSensusKK] = useState(true);
  const [isProcessingImport, setIsProcessingImport] = useState(false);
  const [importError, setImportError] = useState("");
  const [importPreviewTab, setImportPreviewTab] = useState<"warga" | "kk">("warga");

  // Toast Notifikasi
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --------------------------------------------------------------------------
  // 1. CEK SESI LOGIN SAAT MOUNT
  // --------------------------------------------------------------------------
  useEffect(() => {
    try {
      // Baca email yang diingat
      const rememberedEmail = localStorage.getItem("kadurama_remembered_email");
      if (rememberedEmail) {
        setLoginEmail(rememberedEmail);
      }

      const savedSession = localStorage.getItem("kadurama_admin_session");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        setCurrentUser(parsed);
      }
    } catch (e) {
      console.error("Error reading session:", e);
    } finally {
      setIsAuthChecking(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      document.title = `Panel Data Center (${currentUser.role.toUpperCase()}) | Pemdes Kadurama`;
      if (currentUser.role === "kadus" && currentUser.dusun && currentUser.dusun !== "all") {
        setSensusDusunFilter(currentUser.dusun);
        setResidentDusunFilter(currentUser.dusun);
        setRelasiDusunFilter(currentUser.dusun);
      }
    } else {
      document.title = "Otorisasi Akses Pamong & Data Center | Pemdes Kadurama";
    }
  }, [currentUser]);

  // --------------------------------------------------------------------------
  // 2. FETCH DATA DARI SUPABASE
  // --------------------------------------------------------------------------
  const fetchAllData = async () => {
    setIsLoadingData(true);
    try {
      // Helper untuk fetch seluruh baris melebihi default limit 1000 PostgREST
      async function fetchAllRows(tableName: string) {
        const allRows: any[] = [];
        const pageSize = 1000;
        let from = 0;
        let hasMore = true;

        while (hasMore) {
          const { data, error } = await supabase
            .from(tableName)
            .select("*")
            .eq("is_deleted", false)
            .range(from, from + pageSize - 1);

          if (error) {
            console.error(`Error fetching ${tableName}:`, error.message);
            break;
          }

          if (data && data.length > 0) {
            allRows.push(...data);
            if (data.length < pageSize) {
              hasMore = false;
            } else {
              from += pageSize;
            }
          } else {
            hasMore = false;
          }
        }
        return allRows;
      }

      // 1. Sensus KK (Active only)
      const sensusData = await fetchAllRows("sensus_kk");

      if (sensusData) {
        setSensusList(
          sensusData.map((s: any) => ({
            id: s.id,
            noKk: s.no_kk,
            nikKepalaKeluarga: s.nik_kepala_keluarga,
            namaKepalaKeluarga: s.nama_kepala_keluarga,
            dusun: s.dusun,
            rt: s.rt,
            rw: s.rw,
            alamat: s.alamat,
            jumlahAnggota: s.jumlah_anggota,
            desil: s.desil,
            statusPbb: s.status_pbb,
            tahunPbb: s.tahun_pbb,
            nominalPbb: Number(s.nominal_pbb),
            kondisiRumah: s.kondisi_rumah,
            statusKepemilikanRumah: s.status_kepemilikan_rumah,
            luasLantai: Number(s.luas_lantai),
            dinding: s.dinding,
            lantai: s.lantai,
            atap: s.atap,
            jambanSanitasi: s.jamban_sanitasi,
            sumberAir: s.sumber_air,
            dayaListrik: s.daya_listrik,
            pekerjaanUtama: s.pekerjaan_utama,
            penghasilanBulanan: s.penghasilan_bulanan,
            kepemilikanLahan: s.kepemilikan_lahan,
            kerentanan: s.kerentanan || {
              adaLansiaTunggal: false,
              adaBalitaStunting: false,
              adaDisabilitas: false,
            },
            bansosAktif: s.bansos_aktif,
            foto_rumah_url: s.foto_rumah_url,
            foto_kk_url: s.foto_kk_url,
            surveyorKadus: s.surveyor_kadus,
            tanggalSensus: s.tanggal_sensus,
            catatanVerifikasi: s.catatan_verifikasi,
          }))
        );
      }

      // 2. Residents (Active only)
      const residentData = await fetchAllRows("residents");

      if (residentData) {
        setResidentsList(
          residentData.map((r: any) => ({
            nik: r.nik,
            noKk: r.no_kk,
            nama: r.nama,
            ttl: r.ttl,
            jenisKelamin: r.jenis_kelamin,
            pekerjaan: r.pekerjaan,
            agama: r.agama,
            statusPerkawinan: r.status_perkawinan,
            hubunganKeluarga: r.hubungan_keluarga,
            dusun: r.dusun,
            rt: r.rt,
            rw: r.rw,
            alamat: r.alamat,
            status: r.status,
            syncStatus: r.sync_status,
          }))
        );
      }

      // 3. APBDes Summary & Sectors
      const [{ data: summaryData }, { data: apbdesData }] = await Promise.all([
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
        setApbdesSummary(summaryData);
        setSummaryForm(summaryData);
      }
      if (apbdesData) setApbdesList(apbdesData);

      // 4. News Articles
      const { data: newsData } = await supabase
        .from("news_articles")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });
      if (newsData && newsData.length > 0) setNewsList(newsData);

      // 5. Announcements
      const { data: annData } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });
      if (annData && annData.length > 0) setAnnouncementList(annData);

      // 6. Village Agenda
      const { data: agdData } = await supabase
        .from("village_agenda")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });
      if (agdData && agdData.length > 0) setAgendaList(agdData);

      // 7. Audit Logs (Ordered by created_at DESC)
      const { data: logData } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(60);
      if (logData) setAuditLogs(logData);
    } catch (err) {
      console.warn("Gagal memuat data dari Supabase:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAllData();
    }
  }, [currentUser]);

  // --------------------------------------------------------------------------
  // 3. HANDLER LOGIN SUNGGUHAN, LOGOUT & GANTI PASSWORD
  // --------------------------------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setLoginError("Silakan masukkan email resmi aparatur desa.");
      return;
    }
    if (!loginPassword) {
      setLoginError("Silakan masukkan kata sandi akun Anda.");
      return;
    }

    setIsSubmittingLogin(true);

    try {
      // 1. Cek langsung ke tabel public.aparatur_users di database Supabase
      const { data: user, error } = await supabase
        .from("aparatur_users")
        .select("*")
        .eq("email", cleanEmail)
        .single();

      if (error || !user) {
        // Catat percobaan login gagal ke tabel audit_logs
        await recordAuditLog({
          actor_email: cleanEmail,
          actor_name: "Tamu / Anonim",
          actor_role: "anon",
          action: "LOGIN",
          entity_type: "aparatur_users",
          entity_id: cleanEmail,
          description: `Gagal login: Email '${cleanEmail}' tidak terdaftar di basis data aparatur desa`,
        });
        setLoginError("Email akun tidak terdaftar di basis data aparatur Pemdes Kadurama.");
        return;
      }

      if (!user.is_active) {
        setLoginError("Akun aparatur ini berstatus non-aktif. Silakan hubungi Administrator Desa.");
        return;
      }

      // 2. Verifikasi kata sandi langsung dari kolom password_hash Supabase
      if (user.password_hash !== loginPassword) {
        await recordAuditLog({
          actor_email: user.email,
          actor_name: user.nama,
          actor_role: user.role,
          action: "LOGIN",
          entity_type: "aparatur_users",
          entity_id: user.email,
          description: `Gagal login: Kata sandi salah untuk akun ${user.nama} (${user.email})`,
        });
        setLoginError("Kata sandi yang Anda masukkan salah. Silakan periksa kembali huruf besar/kecil.");
        return;
      }

      // 3. Login Valid: Bentuk sesi aparatur
      const sessionObj: AparaturUser = {
        id: user.id,
        email: user.email,
        nama: user.nama,
        role: user.role,
        jabatan: user.jabatan,
        dusun: user.dusun,
      };

      localStorage.setItem(
        "kadurama_admin_session",
        JSON.stringify({
          ...sessionObj,
          loginAt: new Date().toISOString(),
        })
      );

      if (rememberMe) {
        localStorage.setItem("kadurama_remembered_email", user.email);
      } else {
        localStorage.removeItem("kadurama_remembered_email");
      }

      setCurrentUser(sessionObj);

      // 4. Catat riwayat login berhasil di tabel audit_logs
      await recordAuditLog({
        actor_email: user.email,
        actor_name: user.nama,
        actor_role: user.role,
        action: "LOGIN",
        entity_type: "aparatur_users",
        entity_id: user.email,
        description: `${user.nama} (${user.jabatan}) berhasil login ke panel data center`,
      });

      showToast(`Selamat datang kembali, ${user.nama}`);
      fetchAllData();
    } catch (err: any) {
      console.error("Login error:", err);
      setLoginError("Terjadi kendala koneksi ke server database.");
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleLogout = async () => {
    if (currentUser) {
      try {
        await recordAuditLog({
          actor_email: currentUser.email,
          actor_name: currentUser.nama,
          actor_role: currentUser.role,
          action: "LOGIN",
          entity_type: "aparatur_users",
          entity_id: currentUser.email,
          description: `${currentUser.nama} (${currentUser.jabatan}) keluar (logout) dari panel data center`,
        });
      } catch (e) {
        console.warn("Logout audit error:", e);
      }
    }
    localStorage.removeItem("kadurama_admin_session");
    setCurrentUser(null);
    router.push("/");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!passwordForm.oldPassword) {
      setPasswordForm((prev) => ({ ...prev, error: "Silakan masukkan kata sandi lama Anda." }));
      return;
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      setPasswordForm((prev) => ({ ...prev, error: "Kata sandi baru minimal 6 karakter." }));
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordForm((prev) => ({ ...prev, error: "Konfirmasi kata sandi baru tidak cocok." }));
      return;
    }

    setPasswordForm((prev) => ({ ...prev, isSubmitting: true, error: "" }));

    try {
      const { data: user, error: fetchErr } = await supabase
        .from("aparatur_users")
        .select("password_hash")
        .eq("id", currentUser.id)
        .single();

      if (fetchErr || !user || user.password_hash !== passwordForm.oldPassword) {
        setPasswordForm((prev) => ({
          ...prev,
          isSubmitting: false,
          error: "Kata sandi lama yang Anda masukkan tidak sesuai.",
        }));
        return;
      }

      const { error: updateErr } = await supabase
        .from("aparatur_users")
        .update({ password_hash: passwordForm.newPassword })
        .eq("id", currentUser.id);

      if (updateErr) throw updateErr;

      await recordAuditLog({
        actor_email: currentUser.email,
        actor_name: currentUser.nama,
        actor_role: currentUser.role,
        action: "UPDATE",
        entity_type: "aparatur_users",
        entity_id: currentUser.email,
        description: `${currentUser.nama} memperbarui kata sandi akun resmi`,
      });

      setIsPasswordModalOpen(false);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        error: "",
        isSubmitting: false,
      });
      showToast("Kata sandi berhasil diperbarui!");
    } catch (err: any) {
      setPasswordForm((prev) => ({
        ...prev,
        isSubmitting: false,
        error: err.message || "Gagal memperbarui kata sandi.",
      }));
    }
  };

  // Helper Izin Ubah (Kadus hanya bisa ubah dusunnya, Master/Sekdes bisa semua)
  const canModify = (dusunTarget: "Manis" | "Pahing" | "Wage") => {
    if (!currentUser) return false;
    if (currentUser.role === "master" || currentUser.role === "sekdes" || currentUser.role === "operator") {
      return true;
    }
    if (currentUser.role === "kadus") {
      return currentUser.dusun === dusunTarget;
    }
    return false;
  };

  // --------------------------------------------------------------------------
  // 4. HANDLERS SENSUS KK (CREATE, UPDATE, SOFT DELETE)
  // --------------------------------------------------------------------------
  const handleOpenCreateSensus = () => {
    const defaultDusun: "Manis" | "Pahing" | "Wage" =
      currentUser?.role === "kadus" && currentUser.dusun && currentUser.dusun !== "all"
        ? (currentUser.dusun as any)
        : "Manis";

    setEditingSensus({
      id: `SN-${String(sensusList.length + 1).padStart(3, "0")}`,
      noKk: "",
      nikKepalaKeluarga: "",
      namaKepalaKeluarga: "",
      dusun: defaultDusun,
      rt: "01",
      rw: "01",
      alamat: `Dusun ${defaultDusun} RT 01 / RW 01, Desa Kadurama`,
      jumlahAnggota: 4,
      desil: 3,
      statusPbb: "Belum Lunas",
      tahunPbb: 2026,
      nominalPbb: 75000,
      kondisiRumah: "Layak Huni",
      statusKepemilikanRumah: "Milik Sendiri",
      luasLantai: 54,
      dinding: "Tembok Permanen",
      lantai: "Keramik / Granit",
      atap: "Genteng Baik",
      jambanSanitasi: "Jamban Sendiri (Septic Tank)",
      sumberAir: "PDAM / Sumur Bor Bersih",
      dayaListrik: "900 VA",
      pekerjaanUtama: "Petani / Wiraswasta",
      penghasilanBulanan: "Rp 1.000.000 - Rp 2.000.000",
      kerentanan: {
        adaLansiaTunggal: false,
        adaBalitaStunting: false,
        adaDisabilitas: false,
      },
      bansosAktif: "Tidak Ada (Non-Bansos)",
      foto_rumah_url: "",
      foto_kk_url: "",
      surveyorKadus: currentUser?.nama || "Petugas Sensus",
      tanggalSensus: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      catatanVerifikasi: "Data terverifikasi melalui survei lapangan aparatur dusun.",
    });
    setDesilMode("auto");
    setManualDesil(3);
    setIsSensusModalOpen(true);
  };

  const handleSaveSensus = async () => {
    if (!editingSensus || !currentUser) return;
    if (!editingSensus.noKk.trim() || !editingSensus.namaKepalaKeluarga.trim()) {
      alert("Nomor KK dan Nama Kepala Keluarga wajib diisi!");
      return;
    }

    const kkCheck = validateNikOrKk(editingSensus.noKk, "No. KK");
    if (!kkCheck.valid) {
      alert(kkCheck.message);
      return;
    }

    if (editingSensus.nikKepalaKeluarga && editingSensus.nikKepalaKeluarga.trim()) {
      const nikCheck = validateNikOrKk(editingSensus.nikKepalaKeluarga, "NIK");
      if (!nikCheck.valid) {
        alert(nikCheck.message);
        return;
      }
    }

    // Auto scoring desil vs penetapan manual aparatur desa
    const autoDesil = calculateDesil(
      editingSensus.dinding,
      editingSensus.lantai,
      editingSensus.penghasilanBulanan,
      editingSensus.luasLantai,
      editingSensus.jumlahAnggota
    );
    const finalDesil = desilMode === "manual" ? manualDesil : autoDesil;

    const isNew = !sensusList.some((s) => s.id === editingSensus.id);
    const payload = {
      id: editingSensus.id,
      no_kk: editingSensus.noKk,
      nik_kepala_keluarga: editingSensus.nikKepalaKeluarga,
      nama_kepala_keluarga: editingSensus.namaKepalaKeluarga,
      dusun: editingSensus.dusun,
      rt: editingSensus.rt,
      rw: editingSensus.rw,
      alamat: editingSensus.alamat,
      jumlah_anggota: editingSensus.jumlahAnggota,
      desil: finalDesil,
      status_pbb: editingSensus.statusPbb,
      tahun_pbb: editingSensus.tahunPbb,
      nominal_pbb: editingSensus.nominalPbb,
      kondisi_rumah: editingSensus.kondisiRumah,
      status_kepemilikan_rumah: editingSensus.statusKepemilikanRumah,
      luas_lantai: editingSensus.luasLantai,
      dinding: editingSensus.dinding,
      lantai: editingSensus.lantai,
      atap: editingSensus.atap,
      jamban_sanitasi: editingSensus.jambanSanitasi,
      sumber_air: editingSensus.sumberAir,
      daya_listrik: editingSensus.dayaListrik,
      pekerjaan_utama: editingSensus.pekerjaanUtama,
      penghasilan_bulanan: editingSensus.penghasilanBulanan,
      kepemilikan_lahan: editingSensus.kepemilikanLahan,
      kerentanan: editingSensus.kerentanan,
      bansos_aktif: editingSensus.bansosAktif,
      foto_rumah_url: editingSensus.foto_rumah_url,
      foto_kk_url: editingSensus.foto_kk_url,
      surveyor_kadus: editingSensus.surveyorKadus,
      tanggal_sensus: editingSensus.tanggalSensus,
      catatan_verifikasi: editingSensus.catatanVerifikasi,
      updated_by: currentUser.email,
    };

    try {
      if (isNew) {
        await supabase.from("sensus_kk").insert([{ ...payload, created_by: currentUser.email }]);
        await recordAuditLog({
          actor_email: currentUser.email,
          actor_name: currentUser.nama,
          actor_role: currentUser.role,
          action: "CREATE",
          entity_type: "sensus_kk",
          entity_id: editingSensus.noKk,
          description: `Input sensus KK ${editingSensus.noKk} (${editingSensus.namaKepalaKeluarga}) - Desil ${finalDesil} (${desilMode === "manual" ? "Penetapan Manual Apdes" : "Kalkulasi Otomatis"}) Dusun ${editingSensus.dusun}`,
          new_data: payload,
        });
      } else {
        const oldItem = sensusList.find((s) => s.id === editingSensus.id);
        await supabase.from("sensus_kk").update(payload).eq("id", editingSensus.id);
        await recordAuditLog({
          actor_email: currentUser.email,
          actor_name: currentUser.nama,
          actor_role: currentUser.role,
          action: "UPDATE",
          entity_type: "sensus_kk",
          entity_id: editingSensus.noKk,
          description: `Update sensus KK ${editingSensus.noKk} (${editingSensus.namaKepalaKeluarga}) - Desil ${finalDesil} (${desilMode === "manual" ? "Penetapan Manual Apdes" : "Kalkulasi Otomatis"}) Dusun ${editingSensus.dusun}`,
          old_data: oldItem,
          new_data: payload,
        });
      }

      setIsSensusModalOpen(false);
      showToast(isNew ? "Data sensus KK berhasil disimpan" : "Pembaruan sensus KK tersimpan");
      fetchAllData();
    } catch (err) {
      alert("Gagal menyimpan ke database Supabase.");
    }
  };

  const openDeleteModal = (type: "sensus" | "resident", item: SensusKK | Resident) => {
    if (!currentUser) return;
    if (!canModify(item.dusun)) {
      alert(`Anda hanya berwenang mengelola data di Dusun ${currentUser.dusun}`);
      return;
    }
    if (type === "sensus") {
      setDeleteModal({
        isOpen: true,
        type: "sensus",
        sensusItem: item as SensusKK,
        residentItem: null,
        reason: "Pindah Domisili / Keluar Desa",
        customReason: "",
        isSubmitting: false,
      });
    } else {
      setDeleteModal({
        isOpen: true,
        type: "resident",
        sensusItem: null,
        residentItem: item as Resident,
        reason: "Meninggal Dunia",
        customReason: "",
        isSubmitting: false,
      });
    }
  };

  const handleSoftDeleteSensus = (item: SensusKK) => {
    openDeleteModal("sensus", item);
  };

  const handleSoftDeleteResident = (res: Resident) => {
    openDeleteModal("resident", res);
  };

  const handleConfirmDelete = async () => {
    if (!currentUser) return;
    setDeleteModal((prev) => ({ ...prev, isSubmitting: true }));

    const finalReason =
      deleteModal.reason === "Lainnya"
        ? (deleteModal.customReason.trim() || "Alasan lainnya")
        : `${deleteModal.reason}${deleteModal.customReason.trim() ? ` - ${deleteModal.customReason.trim()}` : ""}`;

    try {
      if (deleteModal.type === "sensus" && deleteModal.sensusItem) {
        const item = deleteModal.sensusItem;
        await supabase
          .from("sensus_kk")
          .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
            deleted_by: currentUser.email,
          })
          .eq("id", item.id);

        await recordAuditLog({
          actor_email: currentUser.email,
          actor_name: currentUser.nama,
          actor_role: currentUser.role,
          action: "DELETE",
          entity_type: "sensus_kk",
          entity_id: item.noKk,
          description: `Soft-delete sensus KK ${item.noKk} (${item.namaKepalaKeluarga}) Dusun ${item.dusun} - Alasan: ${finalReason}`,
          old_data: item,
        });

        showToast(`Data KK ${item.namaKepalaKeluarga} berhasil diarsipkan (Alasan: ${deleteModal.reason}).`);
      } else if (deleteModal.type === "resident" && deleteModal.residentItem) {
        const res = deleteModal.residentItem;
        const newStatus = deleteModal.reason.includes("Meninggal")
          ? "Meninggal Dunia"
          : deleteModal.reason.includes("Pindah")
          ? "Pindah Keluar"
          : "Nonaktif / Diarsipkan";

        await supabase
          .from("residents")
          .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
            deleted_by: currentUser.email,
            status: newStatus,
          })
          .eq("nik", res.nik);

        await recordAuditLog({
          actor_email: currentUser.email,
          actor_name: currentUser.nama,
          actor_role: currentUser.role,
          action: "DELETE",
          entity_type: "residents",
          entity_id: res.nik,
          description: `Soft-delete warga NIK ${res.nik} (${res.nama}) Dusun ${res.dusun} - Alasan: ${finalReason}`,
          old_data: res,
        });

        showToast(`Data warga ${res.nama} berhasil diarsipkan (Alasan: ${deleteModal.reason}).`);
      }

      setDeleteModal((prev) => ({ ...prev, isOpen: false, isSubmitting: false }));
      fetchAllData();
    } catch (err: any) {
      console.error(err);
      alert(`Gagal mengarsipkan data: ${err.message || "Terjadi kesalahan koneksi"}`);
      setDeleteModal((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  // --------------------------------------------------------------------------
  // 5. HANDLERS DATA PENDUDUK (CREATE, EDIT, SOFT DELETE)
  // --------------------------------------------------------------------------
  const handleOpenCreateResident = () => {
    const defaultDusun: "Manis" | "Pahing" | "Wage" =
      currentUser?.role === "kadus" && currentUser.dusun && currentUser.dusun !== "all"
        ? (currentUser.dusun as any)
        : "Manis";

    setIsEditingResidentExisting(false);
    setEditingResident({
      nik: "",
      noKk: "",
      nama: "",
      ttl: "Kuningan, ",
      jenisKelamin: "Laki-laki",
      pekerjaan: "Wiraswasta",
      agama: "Islam",
      statusPerkawinan: "Kawin",
      hubunganKeluarga: "Kepala Keluarga",
      dusun: defaultDusun,
      rt: "01",
      rw: "01",
      alamat: `Dusun ${defaultDusun} RT 01 / RW 01, Desa Kadurama`,
      status: "Warga Tetap",
      syncStatus: "Tersinkronisasi",
    });
    setIsResidentModalOpen(true);
  };

  const handleSaveResident = async () => {
    if (!editingResident || !currentUser) return;
    if (!editingResident.nik.trim() || !editingResident.nama.trim()) {
      alert("NIK dan Nama Lengkap Warga wajib diisi!");
      return;
    }

    const isNew = !isEditingResidentExisting;
    const cleanNik = editingResident.nik.trim();
    const cleanNoKk = editingResident.noKk.trim();

    const nikCheck = validateNikOrKk(cleanNik, "NIK");
    if (!nikCheck.valid) {
      alert(nikCheck.message);
      return;
    }

    if (cleanNoKk) {
      const kkCheck = validateNikOrKk(cleanNoKk, "No. KK");
      if (!kkCheck.valid) {
        alert(kkCheck.message);
        return;
      }
    }

    if (isNew && residentsList.some((r) => r.nik === cleanNik)) {
      alert(`NIK ${cleanNik} sudah terdaftar atas nama warga lain dalam sistem! Harap periksa kembali.`);
      return;
    }

    const payload = {
      nik: cleanNik,
      no_kk: cleanNoKk || "3208150000000000",
      nama: editingResident.nama.trim(),
      ttl: editingResident.ttl?.trim() || "Kuningan",
      jenis_kelamin: editingResident.jenisKelamin || "Laki-laki",
      pekerjaan: editingResident.pekerjaan?.trim() || "Belum Bekerja",
      agama: editingResident.agama?.trim() || "Islam",
      status_perkawinan: editingResident.statusPerkawinan?.trim() || "Kawin",
      hubungan_keluarga: editingResident.hubunganKeluarga?.trim() || "Kepala Keluarga",
      dusun: editingResident.dusun,
      rt: editingResident.rt?.trim() || "01",
      rw: editingResident.rw?.trim() || "01",
      alamat: editingResident.alamat?.trim() || `Dusun ${editingResident.dusun}, Desa Kadurama`,
      status: editingResident.status?.trim() || "Warga Tetap",
      sync_status: editingResident.syncStatus?.trim() || "Tersinkronisasi",
      updated_by: currentUser.email,
    };

    try {
      if (isNew) {
        const { error } = await supabase.from("residents").insert([{ ...payload, created_by: currentUser.email }]);
        if (error) throw error;
        await recordAuditLog({
          actor_email: currentUser.email,
          actor_name: currentUser.nama,
          actor_role: currentUser.role,
          action: "CREATE",
          entity_type: "residents",
          entity_id: cleanNik,
          description: `Pendaftaran warga baru NIK ${cleanNik} (${payload.nama}) Dusun ${payload.dusun}`,
          new_data: payload,
        });
      } else {
        const oldResident = residentsList.find((r) => r.nik === cleanNik);
        const { error } = await supabase.from("residents").update(payload).eq("nik", cleanNik);
        if (error) throw error;
        await recordAuditLog({
          actor_email: currentUser.email,
          actor_name: currentUser.nama,
          actor_role: currentUser.role,
          action: "UPDATE",
          entity_type: "residents",
          entity_id: cleanNik,
          description: `Memperbarui data warga NIK ${cleanNik} (${payload.nama})`,
          old_data: oldResident,
          new_data: payload,
        });
      }

      setIsResidentModalOpen(false);
      showToast(isNew ? "Warga baru berhasil didaftarkan" : "Data warga berhasil diperbarui");
      fetchAllData();
    } catch (err: any) {
      console.error(err);
      alert(`Gagal menyimpan data kependudukan: ${err.message || "Terjadi kesalahan koneksi"}`);
    }
  };

  // --------------------------------------------------------------------------
  // 3B. HANDLER IMPOR OTOMATIS BERKAS EXCEL DUKCAPIL
  // --------------------------------------------------------------------------
  const parseExcelDate = (serial: any): string => {
    if (typeof serial === "number") {
      const utc_days = Math.floor(serial - 25569);
      const utc_value = utc_days * 86400;
      const date_info = new Date(utc_value * 1000);
      const y = date_info.getUTCFullYear();
      const m = String(date_info.getUTCMonth() + 1).padStart(2, "0");
      const d = String(date_info.getUTCDate()).padStart(2, "0");
      return `${d}-${m}-${y}`;
    }
    return String(serial || "").trim();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError("");
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rawData: any[] = XLSX.utils.sheet_to_json(ws);

        if (!rawData || rawData.length === 0) {
          setImportError("File Excel kosong atau tidak terbaca.");
          return;
        }

        // Hitung anggota keluarga per No KK
        const familyCountMap: Record<string, number> = {};
        rawData.forEach((row) => {
          const noKk = String(row.NO_KK || row.no_kk || "").trim();
          if (noKk) {
            familyCountMap[noKk] = (familyCountMap[noKk] || 0) + 1;
          }
        });

        const targetDusun =
          currentUser?.role === "kadus" && currentUser.dusun && currentUser.dusun !== "all"
            ? (currentUser.dusun as "Manis" | "Pahing" | "Wage")
            : importDefaultDusun;

        // Parse Residents
        const parsedResidents: Resident[] = [];
        const parsedSensusList: any[] = [];
        const processedKkSet = new Set<string>();

        rawData.forEach((row) => {
          const nik = String(row.NIK || row.nik || "").trim();
          const noKk = String(row.NO_KK || row.no_kk || "").trim();
          const nama = String(row.NAMA || row.nama || "").trim().toUpperCase();

          if (!nik || !nama) return;

          // Deteksi JK
          const rawJk = String(row.JK || row.KODE_JK || "").toUpperCase();
          const jenisKelamin: "Laki-laki" | "Perempuan" =
            rawJk === "P" || rawJk === "2" || rawJk.includes("PEREMPUAN")
              ? "Perempuan"
              : "Laki-laki";

          // Deteksi TTL
          const tmptLhr = String(row.TMPT_LHR || row.tempat_lahir || "Kuningan").trim();
          const tglLhr = parseExcelDate(row.TGL_LHR || row.tanggal_lahir);
          const ttl = tmptLhr ? `${tmptLhr}, ${tglLhr}` : tglLhr;

          // Deteksi RT & RW
          const rawRt = String(row.RT || row.rt || "").trim();
          const rawRw = String(row.RW || row.rw || "").trim();
          const rt = rawRt ? rawRt.padStart(2, "0") : importDefaultRt.padStart(2, "0");
          const rw = rawRw ? rawRw.padStart(2, "0") : importDefaultRw.padStart(2, "0");

          // Deteksi Dusun
          let dusunRow: "Manis" | "Pahing" | "Wage" = targetDusun;
          const rtNum = parseInt(rt, 10);
          if (!isNaN(rtNum) && rawRt) {
            if (rtNum >= 1 && rtNum <= 7) dusunRow = "Manis";
            else if (rtNum >= 8 && rtNum <= 14) dusunRow = "Pahing";
            else if (rtNum >= 15 && rtNum <= 21) dusunRow = "Wage";
          }

          const rawAlamat = String(row.ALAMAT || row.alamat || "").trim();
          const alamat =
            rawAlamat && rawAlamat !== "KADURAMA"
              ? `${rawAlamat}, Dusun ${dusunRow}`
              : `Dusun ${dusunRow} RT ${rt} / RW ${rw}, Desa Kadurama`;

          const shdk = String(row.SHDK || row.hubungan_keluarga || "Anggota Keluarga").trim();
          const pekerjaan = String(row.PEKERJAAN || row.pekerjaan || "Lainnya").trim();
          const status = String(row.STATUS || row.status_perkawinan || "Kawin").trim();
          const agama = String(row.AGAMA || row.agama || "Islam").trim();

          const residentItem: Resident = {
            nik,
            noKk: noKk || "3208100000000000",
            nama,
            ttl,
            jenisKelamin,
            pekerjaan,
            agama,
            statusPerkawinan: status,
            hubunganKeluarga: shdk,
            dusun: dusunRow,
            rt,
            rw,
            alamat,
            status: "Warga Tetap",
            syncStatus: "Tersinkronisasi",
          };

          parsedResidents.push(residentItem);

          // Jika Kepala Keluarga dan belum ada di Sensus
          const isKepalaKeluarga =
            shdk.toLowerCase().includes("kepala") ||
            Number(row.KODESHDK) === 1 ||
            String(row.NAMA_KEP_KEL || "").trim().toUpperCase() === nama;

          if (isKepalaKeluarga && noKk && !processedKkSet.has(noKk)) {
            processedKkSet.add(noKk);
            parsedSensusList.push({
              id: `SN-${noKk.slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`,
              no_kk: noKk,
              nik_kepala_keluarga: nik,
              nama_kepala_keluarga: nama,
              dusun: dusunRow,
              rt,
              rw,
              alamat,
              jumlah_anggota: familyCountMap[noKk] || 1,
              desil: 3,
              status_pbb: "Belum Lunas",
              tahun_pbb: 2026,
              nominal_pbb: 45000,
              kondisi_rumah: "Layak Huni",
              status_kepemilikan_rumah: "Milik Sendiri",
              luas_lantai: 48,
              dinding: "Tembok Permanen",
              lantai: "Keramik / Granit",
              atap: "Genteng Baik",
              jamban_sanitasi: "Jamban Sendiri (Septic Tank)",
              sumber_air: "PDAM / Sumur Bor Bersih",
              daya_listrik: "900 VA",
              pekerjaan_utama: pekerjaan,
              penghasilan_bulanan: "Rp 1.000.000 - Rp 2.000.000",
              kepemilikan_lahan: "Pekarangan Rumah",
              kerentanan: {
                adaLansiaTunggal: false,
                adaBalitaStunting: false,
                adaDisabilitas: false,
                adaAnakPutusSekolah: false,
              },
              bansos_aktif: "Tidak Ada (Non-Bansos)",
              surveyor_kadus: currentUser?.nama || "Pamong Desa",
              tanggal_sensus: new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              catatan_verifikasi: `Diimpor otomatis dari berkas ${file.name}`,
              is_deleted: false,
              version: 1,
              created_by: currentUser?.email || "system",
              updated_by: currentUser?.email || "system",
            });
          }
        });

        setImportParsedResidents(parsedResidents);
        setImportParsedSensus(parsedSensusList);
      } catch (err: any) {
        console.error("Gagal membaca file Excel:", err);
        setImportError("Gagal membaca struktur berkas Excel. Pastikan format tabel sesuai.");
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleExecuteImport = async () => {
    if (importParsedResidents.length === 0) {
      setImportError("Tidak ada data warga valid untuk diimpor.");
      return;
    }

    setIsProcessingImport(true);
    setImportError("");

    try {
      // 1. Upsert residents ke database Supabase
      const residentPayload = importParsedResidents.map((r) => ({
        nik: r.nik,
        no_kk: r.noKk,
        nama: r.nama,
        ttl: r.ttl,
        jenis_kelamin: r.jenisKelamin,
        pekerjaan: r.pekerjaan,
        agama: r.agama,
        status_perkawinan: r.statusPerkawinan,
        hubungan_keluarga: r.hubunganKeluarga,
        dusun: r.dusun,
        rt: r.rt,
        rw: r.rw,
        alamat: r.alamat,
        status: "Warga Tetap",
        sync_status: "Tersinkronisasi",
        created_by: currentUser?.email || "system",
        updated_by: currentUser?.email || "system",
        is_deleted: false,
      }));

      const { error: residentErr } = await supabase
        .from("residents")
        .upsert(residentPayload, { onConflict: "nik" });

      if (residentErr) {
        throw new Error(`Gagal menyimpan data kependudukan: ${residentErr.message}`);
      }

      // 2. Jika opsi buat Sensus KK dicentang
      let sensusSuccessCount = 0;
      if (importCreateSensusKK && importParsedSensus.length > 0) {
        const { error: sensusErr } = await supabase
          .from("sensus_kk")
          .upsert(importParsedSensus, { onConflict: "no_kk" });

        if (!sensusErr) {
          sensusSuccessCount = importParsedSensus.length;
        } else {
          console.warn("Gagal membuat data sensus otomatis:", sensusErr);
        }
      }

      // 3. Catat Audit Trail
      await recordAuditLog({
        actor_email: currentUser?.email || "system",
        actor_name: currentUser?.nama || "Pamong Desa",
        actor_role: currentUser?.role || "master",
        action: "IMPORT",
        entity_type: "residents",
        entity_id: importFileName || "excel-upload",
        description: `Impor otomatis kependudukan: ${importParsedResidents.length} data warga & ${sensusSuccessCount} profil sensus keluarga dari berkas ${importFileName}`,
        new_data: {
          totalWarga: importParsedResidents.length,
          totalKk: sensusSuccessCount,
          fileName: importFileName,
        },
      });

      showToast(
        `Sukses! ${importParsedResidents.length} warga & ${sensusSuccessCount} KK berhasil diimpor.`
      );

      // Refresh data
      await fetchAllData();

      // Tutup modal & bersihkan state
      setIsImportModalOpen(false);
      setImportFileName("");
      setImportParsedResidents([]);
      setImportParsedSensus([]);
    } catch (err: any) {
      console.error("Error import:", err);
      setImportError(err.message || "Terjadi kesalahan saat memproses impor data.");
    } finally {
      setIsProcessingImport(false);
    }
  };

  // --------------------------------------------------------------------------
  // OTORISASI AKSES PER ROLE
  // --------------------------------------------------------------------------
  const canManageNews =
    currentUser?.role === "master" ||
    currentUser?.role === "sekdes" ||
    currentUser?.role === "operator";

  const canManagePengumuman = canManageNews;
  const canManageAgenda = canManageNews;

  const canManageApbdes =
    currentUser?.role === "master" ||
    currentUser?.role === "sekdes" ||
    currentUser?.role === "keuangan";

  // --------------------------------------------------------------------------
  // HANDLERS KABAR DESA (NEWS CRUD)
  // --------------------------------------------------------------------------
  const handleOpenCreateNews = () => {
    setEditingNews(null);
    setNewsForm({
      id: `NEWS-${Date.now().toString().slice(-4)}`,
      title: "",
      category: "Pemerintahan",
      author: currentUser?.nama || "Pemerintah Desa",
      author_role: currentUser?.jabatan || "Sekretariat Desa",
      read_time: "3 menit baca",
      summary: "",
      content: "",
      status: "Terbit",
      image_url: "/dusun-manis.jpg",
      tags: "Kadurama, Berita",
    });
    setIsNewsModalOpen(true);
  };

  const handleOpenEditNews = (item: any) => {
    setEditingNews(item);
    setNewsForm({
      id: item.id,
      title: item.title || "",
      category: item.category || "Pemerintahan",
      author: item.author || currentUser?.nama || "Pemerintah Desa",
      author_role: item.author_role || currentUser?.jabatan || "Sekretariat Desa",
      read_time: item.read_time || "3 menit baca",
      summary: item.summary || "",
      content: Array.isArray(item.content) ? item.content.join("\n\n") : (item.content || ""),
      status: item.status || "Terbit",
      image_url: item.image_url || "",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : (item.tags || ""),
    });
    setIsNewsModalOpen(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title.trim() || !newsForm.summary.trim()) {
      alert("Mohon isi judul dan ringkasan berita!");
      return;
    }
    setIsSubmittingNews(true);
    try {
      const slug = newsForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const contentArray = newsForm.content
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean);

      const tagsArray = newsForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        id: newsForm.id,
        slug,
        title: newsForm.title.trim(),
        category: newsForm.category,
        date: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date()),
        author: newsForm.author.trim(),
        author_role: newsForm.author_role.trim(),
        read_time: newsForm.read_time.trim(),
        summary: newsForm.summary.trim(),
        content: contentArray.length > 0 ? contentArray : [newsForm.summary.trim()],
        status: newsForm.status,
        image_url: newsForm.image_url.trim(),
        tags: tagsArray.length > 0 ? tagsArray : ["Kadurama"],
        is_deleted: false,
        updated_at: new Date().toISOString(),
      };

      if (editingNews) {
        const { error } = await supabase
          .from("news_articles")
          .update(payload)
          .eq("id", editingNews.id);

        if (error) throw error;

        await recordAuditLog({
          actor_email: currentUser?.email || "unknown",
          actor_name: currentUser?.nama || "Admin",
          actor_role: currentUser?.role || "master",
          action: "UPDATE",
          entity_type: "news_articles",
          entity_id: editingNews.id,
          description: `Memperbarui artikel warta desa: "${payload.title}" (${payload.status})`,
        });
      } else {
        const { error } = await supabase
          .from("news_articles")
          .insert([payload]);

        if (error) throw error;

        await recordAuditLog({
          actor_email: currentUser?.email || "unknown",
          actor_name: currentUser?.nama || "Admin",
          actor_role: currentUser?.role || "master",
          action: "CREATE",
          entity_type: "news_articles",
          entity_id: payload.id,
          description: `Menerbitkan warta desa baru: "${payload.title}" (${payload.status})`,
        });
      }

      setIsNewsModalOpen(false);
      showToast(`Artikel warta berhasil ${editingNews ? "diperbarui" : "diterbitkan"}!`);
      await fetchAllData();
    } catch (err: any) {
      console.error("Gagal menyimpan warta:", err);
      alert(`Gagal menyimpan artikel: ${err.message || err}`);
    } finally {
      setIsSubmittingNews(false);
    }
  };

  const handleDeleteNews = async (item: any) => {
    if (!confirm(`Hapus artikel warta "${item.title}"?`)) return;
    try {
      const { error } = await supabase
        .from("news_articles")
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
          deleted_by: currentUser?.email,
        })
        .eq("id", item.id);

      if (error) throw error;

      await recordAuditLog({
        actor_email: currentUser?.email || "unknown",
        actor_name: currentUser?.nama || "Admin",
        actor_role: currentUser?.role || "master",
        action: "DELETE",
        entity_type: "news_articles",
        entity_id: item.id,
        description: `Menghapus artikel warta desa: "${item.title}" (soft delete)`,
      });

      showToast("Artikel warta berhasil dihapus.");
      await fetchAllData();
    } catch (err: any) {
      alert(`Gagal menghapus: ${err.message || err}`);
    }
  };

  // --------------------------------------------------------------------------
  // HANDLERS PENGUMUMAN RESMI
  // --------------------------------------------------------------------------
  const handleOpenCreateAnnouncement = () => {
    setEditingAnnouncement(null);
    const today = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
    setAnnouncementForm({
      id: `PENG-${Date.now().toString().slice(-4)}`,
      number: `140/0${Math.floor(Math.random() * 90) + 10}/Pemdes/IX/2026`,
      title: "",
      category: "Edaran Kuwu",
      date: today,
      time: "08.00 - 15.00 WIB",
      summary: "",
      is_urgent: false,
      file_url: "",
    });
    setIsAnnouncementModalOpen(true);
  };

  const handleOpenEditAnnouncement = (item: any) => {
    setEditingAnnouncement(item);
    setAnnouncementForm({
      id: item.id,
      number: item.number || "",
      title: item.title || "",
      category: item.category || "Edaran Kuwu",
      date: item.date || "",
      time: item.time || "08.00 - 15.00 WIB",
      summary: item.summary || "",
      is_urgent: !!item.is_urgent,
      file_url: item.file_url || "",
    });
    setIsAnnouncementModalOpen(true);
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.title.trim() || !announcementForm.summary.trim()) {
      alert("Mohon lengkapi judul dan ringkasan pengumuman!");
      return;
    }
    setIsSubmittingAnnouncement(true);
    try {
      const payload = {
        id: announcementForm.id,
        number: announcementForm.number.trim(),
        title: announcementForm.title.trim(),
        category: announcementForm.category,
        date: announcementForm.date,
        time: announcementForm.time,
        summary: announcementForm.summary.trim(),
        is_urgent: announcementForm.is_urgent,
        file_url: announcementForm.file_url || null,
        is_deleted: false,
        updated_at: new Date().toISOString(),
      };

      if (editingAnnouncement) {
        const { error } = await supabase.from("announcements").update(payload).eq("id", payload.id);
        if (error) throw error;
        await recordAuditLog({
          actor_email: currentUser?.email || "unknown",
          actor_name: currentUser?.nama || "Pamong",
          actor_role: currentUser?.role || "operator",
          action: "UPDATE",
          entity_type: "announcements",
          entity_id: payload.id,
          description: `Memperbarui Pengumuman: "${payload.title}" (${payload.number})`,
        });
        setAnnouncementList((prev) =>
          prev.map((item) => (item.id === payload.id ? { ...item, ...payload } : item))
        );
      } else {
        const { error } = await supabase.from("announcements").insert([payload]);
        if (error) throw error;
        await recordAuditLog({
          actor_email: currentUser?.email || "unknown",
          actor_name: currentUser?.nama || "Pamong",
          actor_role: currentUser?.role || "operator",
          action: "CREATE",
          entity_type: "announcements",
          entity_id: payload.id,
          description: `Menerbitkan Pengumuman Baru: "${payload.title}" (${payload.number})`,
        });
        setAnnouncementList((prev) => [payload, ...prev]);
      }
      setIsAnnouncementModalOpen(false);
      showToast(`Pengumuman berhasil ${editingAnnouncement ? "diperbarui" : "diterbitkan"}!`);
      await fetchAllData();
    } catch (err: any) {
      alert("Gagal menyimpan pengumuman: " + (err.message || err));
    } finally {
      setIsSubmittingAnnouncement(false);
    }
  };

  const handleDeleteAnnouncement = async (item: any) => {
    if (!confirm(`Hapus pengumuman "${item.title}"?`)) return;
    try {
      const { error } = await supabase
        .from("announcements")
        .update({
          is_deleted: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);
      if (error) throw error;

      await recordAuditLog({
        actor_email: currentUser?.email || "unknown",
        actor_name: currentUser?.nama || "Pamong",
        actor_role: currentUser?.role || "operator",
        action: "DELETE",
        entity_type: "announcements",
        entity_id: item.id,
        description: `Menghapus Pengumuman: "${item.title}" (soft delete)`,
      });
      setAnnouncementList((prev) => prev.filter((a) => a.id !== item.id));
      showToast("Pengumuman berhasil dihapus.");
      await fetchAllData();
    } catch (err: any) {
      alert("Gagal menghapus pengumuman: " + (err.message || err));
    }
  };

  // --------------------------------------------------------------------------
  // HANDLERS AGENDA KEGIATAN DESA
  // --------------------------------------------------------------------------
  const handleOpenCreateAgenda = () => {
    setEditingAgenda(null);
    const today = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
    setAgendaForm({
      id: `AGD-${Date.now().toString().slice(-4)}`,
      title: "",
      description: "",
      date: today,
      time: "09.00 - 11.30 WIB",
      location: "Balai Desa Kadurama",
      organizer: "Pemerintah Desa Kadurama",
      dusun: "Semua Dusun",
      status: "Akan Datang",
    });
    setIsAgendaModalOpen(true);
  };

  const handleOpenEditAgenda = (item: any) => {
    setEditingAgenda(item);
    setAgendaForm({
      id: item.id,
      title: item.title || "",
      description: item.description || "",
      date: item.date || "",
      time: item.time || "09.00 - 11.30 WIB",
      location: item.location || "Balai Desa Kadurama",
      organizer: item.organizer || "Pemerintah Desa Kadurama",
      dusun: item.dusun || "Semua Dusun",
      status: item.status || "Akan Datang",
    });
    setIsAgendaModalOpen(true);
  };

  const handleSaveAgenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaForm.title.trim() || !agendaForm.description.trim()) {
      alert("Mohon lengkapi judul dan deskripsi agenda!");
      return;
    }
    setIsSubmittingAgenda(true);
    try {
      const payload = {
        id: agendaForm.id,
        title: agendaForm.title.trim(),
        description: agendaForm.description.trim(),
        date: agendaForm.date,
        time: agendaForm.time,
        location: agendaForm.location.trim(),
        organizer: agendaForm.organizer.trim(),
        dusun: agendaForm.dusun,
        status: agendaForm.status,
        is_deleted: false,
        updated_at: new Date().toISOString(),
      };

      if (editingAgenda) {
        const { error } = await supabase.from("village_agenda").update(payload).eq("id", payload.id);
        if (error) throw error;
        await recordAuditLog({
          actor_email: currentUser?.email || "unknown",
          actor_name: currentUser?.nama || "Pamong",
          actor_role: currentUser?.role || "operator",
          action: "UPDATE",
          entity_type: "village_agenda",
          entity_id: payload.id,
          description: `Memperbarui Agenda: "${payload.title}" (${payload.dusun})`,
        });
        setAgendaList((prev) =>
          prev.map((item) => (item.id === payload.id ? { ...item, ...payload } : item))
        );
      } else {
        const { error } = await supabase.from("village_agenda").insert([payload]);
        if (error) throw error;
        await recordAuditLog({
          actor_email: currentUser?.email || "unknown",
          actor_name: currentUser?.nama || "Pamong",
          actor_role: currentUser?.role || "operator",
          action: "CREATE",
          entity_type: "village_agenda",
          entity_id: payload.id,
          description: `Menambahkan Agenda Baru: "${payload.title}" (${payload.dusun})`,
        });
        setAgendaList((prev) => [payload, ...prev]);
      }
      setIsAgendaModalOpen(false);
      showToast(`Agenda kegiatan berhasil ${editingAgenda ? "diperbarui" : "ditambahkan"}!`);
      await fetchAllData();
    } catch (err: any) {
      alert("Gagal menyimpan agenda: " + (err.message || err));
    } finally {
      setIsSubmittingAgenda(false);
    }
  };

  const handleDeleteAgenda = async (item: any) => {
    if (!confirm(`Hapus agenda kegiatan "${item.title}"?`)) return;
    try {
      const { error } = await supabase
        .from("village_agenda")
        .update({
          is_deleted: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);
      if (error) throw error;

      await recordAuditLog({
        actor_email: currentUser?.email || "unknown",
        actor_name: currentUser?.nama || "Pamong",
        actor_role: currentUser?.role || "operator",
        action: "DELETE",
        entity_type: "village_agenda",
        entity_id: item.id,
        description: `Menghapus Agenda: "${item.title}" (soft delete)`,
      });
      setAgendaList((prev) => prev.filter((a) => a.id !== item.id));
      showToast("Agenda berhasil dihapus.");
      await fetchAllData();
    } catch (err: any) {
      alert("Gagal menghapus agenda: " + (err.message || err));
    }
  };

  // --------------------------------------------------------------------------
  // HANDLERS APBDES 2026
  // --------------------------------------------------------------------------
  const handleOpenEditSummary = () => {
    setSummaryForm({ ...apbdesSummary });
    setIsEditSummaryModalOpen(true);
  };

  const handleSaveApbdesSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingApbdes(true);
    try {
      const pendapatan = Number(summaryForm.total_pendapatan) || 0;
      const belanja = Number(summaryForm.total_belanja) || 0;
      const realisasi = Number(summaryForm.total_realisasi_belanja) || 0;
      const persen = belanja > 0 ? Number(((realisasi / belanja) * 100).toFixed(1)) : 0;
      const surplus = pendapatan - belanja;
      const silpa = Number(summaryForm.silpa_tahun_lalu) || 0;

      const payload = {
        tahun: 2026,
        total_pendapatan: pendapatan,
        total_belanja: belanja,
        total_realisasi_belanja: realisasi,
        persen_realisasi_belanja: persen,
        surplus_defisit: surplus,
        silpa_tahun_lalu: silpa,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("apbdes_summary")
        .upsert([payload], { onConflict: "tahun" });

      if (error) throw error;

      await recordAuditLog({
        actor_email: currentUser?.email || "unknown",
        actor_name: currentUser?.nama || "Admin",
        actor_role: currentUser?.role || "master",
        action: "UPDATE",
        entity_type: "apbdes_sectors",
        entity_id: "apbdes-summary-2026",
        description: `Memperbarui ringkasan fiskal APBDes 2026: Pendapatan Rp ${pendapatan.toLocaleString("id-ID")}, Belanja Rp ${belanja.toLocaleString("id-ID")}, Realisasi ${persen}%`,
      });

      setIsEditSummaryModalOpen(false);
      showToast("Ringkasan APBDes 2026 berhasil diperbarui!");
      await fetchAllData();
    } catch (err: any) {
      alert(`Gagal memperbarui ringkasan APBDes: ${err.message || err}`);
    } finally {
      setIsSubmittingApbdes(false);
    }
  };

  const handleOpenEditSector = (sector: any) => {
    setEditingSector(sector);
    setSectorForm({
      id: sector.id,
      nama: sector.nama,
      pagu: Number(sector.pagu) || 0,
      realisasi: Number(sector.realisasi) || 0,
      persen: Number(sector.persen) || 0,
      keterangan: sector.keterangan || "",
    });
    setIsEditSectorModalOpen(true);
  };

  const handleSaveApbdesSector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSector) return;
    setIsSubmittingApbdes(true);
    try {
      const pagu = Number(sectorForm.pagu) || 0;
      const realisasi = Number(sectorForm.realisasi) || 0;
      const persen = pagu > 0 ? Number(((realisasi / pagu) * 100).toFixed(1)) : 0;

      const payload = {
        nama: sectorForm.nama,
        pagu,
        realisasi,
        persen,
        keterangan: sectorForm.keterangan,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("apbdes_sectors")
        .update(payload)
        .eq("id", editingSector.id);

      if (error) throw error;

      await recordAuditLog({
        actor_email: currentUser?.email || "unknown",
        actor_name: currentUser?.nama || "Admin",
        actor_role: currentUser?.role || "master",
        action: "UPDATE",
        entity_type: "apbdes_sectors",
        entity_id: String(editingSector.id),
        description: `Memperbarui Bidang APBDes 0${editingSector.id} (${sectorForm.nama}): Realisasi Rp ${realisasi.toLocaleString("id-ID")} (${persen}%)`,
      });

      setIsEditSectorModalOpen(false);
      showToast(`Bidang 0${editingSector.id} berhasil diperbarui!`);
      await fetchAllData();
    } catch (err: any) {
      alert(`Gagal memperbarui bidang: ${err.message || err}`);
    } finally {
      setIsSubmittingApbdes(false);
    }
  };

  // --------------------------------------------------------------------------
  // FILTERING LOGIC
  // --------------------------------------------------------------------------
  const filteredNews = newsList.filter((item) => {
    const matchCat = newsCategoryFilter === "all" || item.category === newsCategoryFilter;
    const matchSearch =
      !newsSearch.trim() ||
      item.title?.toLowerCase().includes(newsSearch.toLowerCase()) ||
      item.summary?.toLowerCase().includes(newsSearch.toLowerCase()) ||
      item.author?.toLowerCase().includes(newsSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredAnnouncements = announcementList.filter((item) => {
    const matchCat = announcementCategoryFilter === "all" || item.category === announcementCategoryFilter;
    const matchSearch =
      !announcementSearch.trim() ||
      item.title?.toLowerCase().includes(announcementSearch.toLowerCase()) ||
      item.number?.toLowerCase().includes(announcementSearch.toLowerCase()) ||
      item.summary?.toLowerCase().includes(announcementSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredAgenda = agendaList.filter((item) => {
    const matchDusun = agendaDusunFilter === "all" || item.dusun === agendaDusunFilter;
    const matchSearch =
      !agendaSearch.trim() ||
      item.title?.toLowerCase().includes(agendaSearch.toLowerCase()) ||
      item.description?.toLowerCase().includes(agendaSearch.toLowerCase()) ||
      item.location?.toLowerCase().includes(agendaSearch.toLowerCase()) ||
      item.organizer?.toLowerCase().includes(agendaSearch.toLowerCase());
    return matchDusun && matchSearch;
  });
  const filteredSensus = sensusList.filter((item) => {
    const effectiveDusun =
      currentUser?.role === "kadus" && currentUser.dusun && currentUser.dusun !== "all"
        ? currentUser.dusun
        : sensusDusunFilter;
    const matchDusun = effectiveDusun === "all" || item.dusun === effectiveDusun;
    const matchDesil = sensusDesilFilter === "all" || item.desil.toString() === sensusDesilFilter;
    const matchSearch =
      !sensusSearch.trim() ||
      item.namaKepalaKeluarga.toLowerCase().includes(sensusSearch.toLowerCase()) ||
      item.noKk.includes(sensusSearch) ||
      item.nikKepalaKeluarga.includes(sensusSearch);
    return matchDusun && matchDesil && matchSearch;
  });

  const filteredResidents = residentsList.filter((res) => {
    const effectiveDusun =
      currentUser?.role === "kadus" && currentUser.dusun && currentUser.dusun !== "all"
        ? currentUser.dusun
        : residentDusunFilter;
    const matchDusun = effectiveDusun === "all" || res.dusun === effectiveDusun;
    const matchSearch =
      !residentSearch.trim() ||
      res.nama.toLowerCase().includes(residentSearch.toLowerCase()) ||
      res.nik.includes(residentSearch) ||
      res.noKk.includes(residentSearch);
    return matchDusun && matchSearch;
  });

  // Kalkulasi Halaman & Paginasi
  const totalSensusPages = Math.max(1, Math.ceil(filteredSensus.length / sensusPageSize));
  const currentSensusPage = Math.min(sensusPage, totalSensusPages);
  const paginatedSensus = useMemo(() => {
    const start = (currentSensusPage - 1) * sensusPageSize;
    return filteredSensus.slice(start, start + sensusPageSize);
  }, [filteredSensus, currentSensusPage, sensusPageSize]);

  const totalResidentPages = Math.max(1, Math.ceil(filteredResidents.length / residentPageSize));
  const currentResidentPage = Math.min(residentPage, totalResidentPages);
  const paginatedResidents = useMemo(() => {
    const start = (currentResidentPage - 1) * residentPageSize;
    return filteredResidents.slice(start, start + residentPageSize);
  }, [filteredResidents, currentResidentPage, residentPageSize]);

  // KPI Metrics Sensus
  const totalKk = sensusList.length;
  const desil1Count = sensusList.filter((s) => s.desil === 1).length;
  const pbbLunasCount = sensusList.filter((s) => s.statusPbb === "Lunas").length;
  const rtlhCount = sensusList.filter((s) => s.kondisiRumah === "RTLH").length;

  // --------------------------------------------------------------------------
  // JIKA SEDANG CEK SESI
  // --------------------------------------------------------------------------
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-400 font-mono text-xs">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Memverifikasi Otorisasi Sesi Pemdes...</span>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // JIKA BELUM LOGIN: TAMPILKAN LAYAR LOGIN MINIMALIS EMAIL PREFILLED
  // --------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#009388_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

        <div className="bg-white rounded-3xl max-w-lg w-full p-7 sm:p-9 shadow-2xl border border-slate-200 relative z-10 animate-in fade-in zoom-in-95 duration-200">
          {/* Header Card */}
          <div className="flex items-start justify-between pb-5 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#e6f7f5] text-[#003733] flex items-center justify-center border border-[#009388]/30 shrink-0">
                <Lock className="w-6 h-6 text-[#009388]" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#009388]">
                  Portal Aparatur Pemdes Kadurama
                </div>
                <h2 className="font-extrabold text-lg text-slate-950 leading-tight">
                  Masuk Data Center
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kecamatan Ciawigebang, Kabupaten Kuningan
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("kadurama_admin_session");
                router.push("/");
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0"
              title="Kembali ke Portal Publik"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4 text-xs">
            {loginError && (
              <div className="p-3.5 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{loginError}</span>
              </div>
            )}

            {/* Input Email Resmi */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Resmi Aparatur (@kadurama.com)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setLoginError("");
                  }}
                  placeholder="contoh: kadus.wage@kadurama.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#009388] transition"
                />
              </div>
            </div>

            {/* Input Kata Sandi */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setLoginError("");
                  }}
                  placeholder="Masukkan kata sandi..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#009388] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2 transition"
                  title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Help Note */}
            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#009388] focus:ring-[#009388]"
                />
                <span>Ingat email di perangkat ini</span>
              </label>
            </div>

            {/* Tombol Aksi */}
            <div className="pt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("kadurama_admin_session");
                  router.push("/");
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold text-xs transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Portal Depan</span>
              </button>
              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="flex-1 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                {isSubmittingLogin ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Kredensial...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Panel Data Center</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // LAYOUT UTAMA: SIDEBAR FIXED KIRI (#003733) & KONTEN KANAN
  // --------------------------------------------------------------------------
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans">
      {/* =================================================================== */}
      {/* SIDEBAR BACKPANEL (Fixed Full Height / Zero Outer Scroll)           */}
      {/* =================================================================== */}
      <aside className="w-68 bg-[#003733] text-white flex-shrink-0 h-full flex flex-col justify-between border-r border-[#005851] z-20 select-none">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-[#005851] flex items-center gap-3">
            <Image
              src="/logo-kuningan-sm.webp"
              alt="Logo Kuningan"
              width={34}
              height={34}
              className="object-contain"
            />
            <div>
              <div className="font-bold text-sm leading-tight text-white">Data Center Pemdes</div>
              <div className="text-[11px] text-[#eda50c]">Desa Kadurama • Kuningan</div>
            </div>
          </div>

          {/* Tombol Kembali ke Portal Depan (Logout Sesi) */}
          <div className="p-3 border-b border-[#005851]">
            <button
              onClick={handleLogout}
              title="Kembali ke Portal Publik Warga (Otomatis Logout)"
              className="w-full py-2 px-3 rounded-xl bg-[#002825] hover:bg-[#001f1c] text-emerald-200 hover:text-white text-xs font-semibold flex items-center justify-between border border-[#004741] transition group shadow-2xs"
            >
              <span className="flex items-center gap-2">
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
                <span>Ke Portal Publik</span>
              </span>
              <span className="text-[9px] uppercase font-bold text-amber-400/90 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-700/40">
                Logout
              </span>
            </button>
          </div>

          {/* Menu Navigasi 5 Tab */}
          <div className="p-3 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/70 px-3 py-2">
              Pendataan & Kependudukan
            </div>

            {/* TAB 1: SENSUS KELUARGA (PER KK) */}
            <button
              onClick={() => setActiveTab("sensus")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                activeTab === "sensus"
                  ? "bg-[#009388] text-white shadow-sm"
                  : "text-emerald-100 hover:bg-[#005851]"
              }`}
            >
              <ClipboardCheck className="w-4 h-4 text-[#eda50c]" />
              <span>Sensus Keluarga & Desil</span>
            </button>

            {/* TAB 2: DATA KEPENDUDUKAN (3 DUSUN) */}
            <button
              onClick={() => setActiveTab("residents")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                activeTab === "residents"
                  ? "bg-[#009388] text-white shadow-sm"
                  : "text-emerald-100 hover:bg-[#005851]"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Data Penduduk (3 Dusun)</span>
            </button>

            {/* TAB: PETA RELASI KK & KTP (CIVIC GRAPH) */}
            <button
              onClick={() => setActiveTab("relasi")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                activeTab === "relasi"
                  ? "bg-[#009388] text-white shadow-sm font-bold"
                  : "text-emerald-100 hover:bg-[#005851]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Network className="w-4 h-4 text-emerald-300" />
                <span>Peta Relasi KK & KTP</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#eda50c] text-slate-950 uppercase">
                Baru
              </span>
            </button>

            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/70 px-3 pt-4 pb-2">
              Transparansi & Fiskal
            </div>

            {/* TAB 3: APBDES & ANGGARAN */}
            <button
              onClick={() => setActiveTab("apbdes")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                activeTab === "apbdes"
                  ? "bg-[#009388] text-white shadow-sm"
                  : "text-emerald-100 hover:bg-[#005851]"
              }`}
            >
              <PieChart className="w-4 h-4 text-emerald-300" />
              <span>Transparansi APBDes</span>
            </button>

            {/* TAB 4: BERITA & ARTIKEL DESA */}
            <button
              onClick={() => setActiveTab("berita")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                activeTab === "berita"
                  ? "bg-[#009388] text-white shadow-sm"
                  : "text-emerald-100 hover:bg-[#005851]"
              }`}
            >
              <Newspaper className="w-4 h-4 text-emerald-300" />
              <span>Publikasi Kabar Desa</span>
            </button>

            {/* TAB: PENGUMUMAN RESMI */}
            <button
              onClick={() => setActiveTab("pengumuman")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                activeTab === "pengumuman"
                  ? "bg-[#009388] text-white shadow-sm"
                  : "text-emerald-100 hover:bg-[#005851]"
              }`}
            >
              <Bell className="w-4 h-4 text-emerald-300" />
              <span>Pengumuman Resmi</span>
            </button>

            {/* TAB: AGENDA KEGIATAN */}
            <button
              onClick={() => setActiveTab("agenda")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                activeTab === "agenda"
                  ? "bg-[#009388] text-white shadow-sm"
                  : "text-emerald-100 hover:bg-[#005851]"
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-300" />
              <span>Agenda Kegiatan</span>
            </button>

            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/70 px-3 pt-4 pb-2">
              Keamanan & Riwayat
            </div>

            {/* TAB 5: AUDIT LOGS */}
            <button
              onClick={() => setActiveTab("audit")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                activeTab === "audit"
                  ? "bg-[#009388] text-white shadow-sm"
                  : "text-emerald-100 hover:bg-[#005851]"
              }`}
            >
              <History className="w-4 h-4 text-emerald-300" />
              <span>Log Aktivitas & Audit</span>
            </button>
          </div>
        </div>

        {/* Profil Aparatur Login & Logout */}
        <div className="p-4 border-t border-[#005851] bg-[#002f2b]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#eda50c] text-slate-950 font-bold flex items-center justify-center text-xs">
              {currentUser.role === "master" ? "DEV" : currentUser.nama.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{currentUser.nama}</div>
              <div className="text-[10px] text-emerald-300 truncate">{currentUser.jabatan}</div>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[10px] text-emerald-200/80 font-mono bg-[#003733] px-2.5 py-1 rounded-lg border border-[#005851]">
            <span>Wilayah Tugas:</span>
            <strong className="text-white">
              {currentUser.dusun === "all" ? "Semua Dusun" : `Dusun ${currentUser.dusun}`}
            </strong>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setPasswordForm({
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                  error: "",
                  isSubmitting: false,
                });
                setIsPasswordModalOpen(true);
              }}
              className="py-2 px-2 rounded-xl bg-[#004741] hover:bg-[#005851] text-emerald-100 hover:text-white text-[10px] font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
              title="Ganti Kata Sandi Akun Anda"
            >
              <Key className="w-3 h-3" />
              <span>Ganti Sandi</span>
            </button>
            <button
              onClick={handleLogout}
              className="py-2 px-2 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-200 hover:text-white text-[10px] font-bold transition flex items-center justify-center gap-1.5 border border-red-900/40"
              title="Keluar dari sesi data center & kembali ke portal publik"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* =================================================================== */}
      {/* KONTEN UTAMA (Independently Scrollable)                             */}
      {/* =================================================================== */}
      <main className="flex-1 h-full overflow-y-auto p-6 lg:p-8 relative z-10">
        <div className="max-w-[1400px] mx-auto pb-16">
          {/* ================================================================ */}
          {/* TAB 1: SENSUS KELUARGA & DESIL                                    */}
          {/* ================================================================ */}
          {activeTab === "sensus" && (
            <div className="space-y-6">
              {/* Header Tab */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2.5">
                    <ClipboardCheck className="w-6 h-6 text-[#009388]" />
                    <span>Sensus & Profil Kesejahteraan Keluarga (Per KK)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Basis data mikro 3 Dusun (Manis, Pahing, Wage): estimasi desil, foto kelayakan rumah (RTLH), kepatuhan PBB, dan kerentanan bansos.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={fetchAllData}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
                    title="Segarkan Data"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingData ? "animate-spin text-[#009388]" : ""}`} />
                  </button>
                  <button
                    onClick={() => {
                      setIsImportModalOpen(true);
                      if (currentUser?.role === "kadus" && currentUser.dusun && currentUser.dusun !== "all") {
                        setImportDefaultDusun(currentUser.dusun as "Wage" | "Manis" | "Pahing");
                      }
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Impor Data Excel</span>
                  </button>
                  <button
                    onClick={handleOpenCreateSensus}
                    className="px-4 py-2.5 bg-[#009388] hover:bg-[#007b71] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Input Sensus KK Baru</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Total KK Terdata
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                    {totalKk} KK
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Dusun Manis, Pahing, Wage</div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                    Desil 1 (Sangat Rentan)
                  </div>
                  <div className="text-2xl font-extrabold text-red-700 mt-1 font-mono">
                    {desil1Count} KK
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Prioritas penanganan bansos</div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    PBB-P2 2026 Lunas
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-800 mt-1 font-mono">
                    {pbbLunasCount} KK
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {totalKk > 0 ? `${Math.round((pbbLunasCount / totalKk) * 100)}% Kepatuhan` : "0%"}
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    Indikator RTLH
                  </div>
                  <div className="text-2xl font-extrabold text-amber-800 mt-1 font-mono">
                    {rtlhCount} KK
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Usulan bedah rumah desa</div>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={sensusSearch}
                      onChange={(e) => setSensusSearch(e.target.value)}
                      placeholder="Cari No KK, NIK, atau Nama Kepala Keluarga..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    {currentUser?.role === "kadus" && currentUser.dusun && currentUser.dusun !== "all" ? (
                      <div className="px-3 py-2 text-xs rounded-xl border border-emerald-200 bg-emerald-50 font-bold text-emerald-800 flex items-center gap-1.5 shadow-2xs">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        <span>Dusun {currentUser.dusun} (Terkunci Sesuai Wilayah)</span>
                      </div>
                    ) : (
                      <select
                        value={sensusDusunFilter}
                        onChange={(e) => setSensusDusunFilter(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700"
                      >
                        <option value="all">Semua Dusun</option>
                        <option value="Manis">Dusun Manis</option>
                        <option value="Pahing">Dusun Pahing</option>
                        <option value="Wage">Dusun Wage</option>
                      </select>
                    )}

                    <select
                      value={sensusDesilFilter}
                      onChange={(e) => setSensusDesilFilter(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700"
                    >
                      <option value="all">Semua Desil</option>
                      <option value="1">Desil 1 (Sangat Rentan)</option>
                      <option value="2">Desil 2 (Rentan)</option>
                      <option value="3">Desil 3 (Pra-Sejahtera)</option>
                      <option value="4">Desil 4 (Mandiri)</option>
                    </select>

                    <button
                      onClick={() => {
                        const nextMasked = !maskSensitiveData;
                        setMaskSensitiveData(nextMasked);
                        if (!nextMasked) {
                          recordAuditLog({
                            actor_email: currentUser?.email || "pamong",
                            actor_name: currentUser?.nama || "Pamong",
                            actor_role: currentUser?.role || "kadus",
                            action: "UPDATE",
                            entity_type: "residents",
                            entity_id: "ALL",
                            description: `${currentUser?.nama} membuka sensor NIK warga pada tabel sensus (Kepatuhan UU PDP No. 27/2022)`,
                          });
                        }
                      }}
                      className={`px-3 py-2 text-xs rounded-xl border font-bold flex items-center gap-1.5 transition ${
                        maskSensitiveData
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                      }`}
                      title={maskSensitiveData ? "Sensor NIK Aktif sesuai UU PDP No. 27/2022. Klik untuk membuka." : "Klik untuk mengaktifkan sensor NIK"}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{maskSensitiveData ? "Sensor NIK: Aktif" : "Sensor NIK: Terbuka"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabel Sensus KK */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                {filteredSensus.length === 0 ? (
                  <div className="p-12 text-center">
                    <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800 text-sm">Belum Ada Data Sensus Keluarga</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Tabel di database Supabase siap digunakan. Klik tombol di bawah untuk menginput survei KK pertama.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <button
                        onClick={handleOpenCreateSensus}
                        className="px-4 py-2 bg-[#009388] text-white rounded-xl text-xs font-bold hover:bg-[#007b71] transition flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Input Sensus Pertama</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsImportModalOpen(true);
                          if (currentUser?.role === "kadus" && currentUser.dusun && currentUser.dusun !== "all") {
                            setImportDefaultDusun(currentUser.dusun as "Wage" | "Manis" | "Pahing");
                          }
                        }}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1.5"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Impor File Excel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-3 px-4">No KK / NIK Kepala</th>
                          <th className="py-3 px-4">Kepala Keluarga</th>
                          <th className="py-3 px-4">Wilayah</th>
                          <th className="py-3 px-4">Desil & Status</th>
                          <th className="py-3 px-4">Foto Rumah</th>
                          <th className="py-3 px-4">PBB-P2</th>
                          <th className="py-3 px-4">Bantuan Aktif</th>
                          <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedSensus.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/70 transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                              <div>{formatMaskedNik(item.noKk, maskSensitiveData)}</div>
                              <div className="text-[10px] text-slate-400 font-normal">NIK: {formatMaskedNik(item.nikKepalaKeluarga, maskSensitiveData)}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-800">{item.namaKepalaKeluarga}</div>
                              <div className="text-[11px] text-slate-500">{item.jumlahAnggota} Anggota Keluarga</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-800 block">Dusun {item.dusun}</span>
                              <span className="text-[10px] text-slate-400">RT {item.rt} / RW {item.rw}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                                  item.desil === 1
                                    ? "bg-red-100 text-red-800"
                                    : item.desil === 2
                                    ? "bg-amber-100 text-amber-800"
                                    : item.desil === 3
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                Desil {item.desil}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              {item.foto_rumah_url ? (
                                <a
                                  href={item.foto_rumah_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700"
                                >
                                  <Camera className="w-3 h-3 text-[#009388]" />
                                  <span>Lihat Foto</span>
                                </a>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">Belum Ada</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`font-bold text-[11px] ${
                                  item.statusPbb === "Lunas" ? "text-emerald-700" : "text-red-600"
                                }`}
                              >
                                {item.statusPbb}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-700">
                              {item.bansosAktif}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedRelasiKkNo(item.noKk);
                                    setSelectedGraphEntity({ type: "KK", data: item });
                                    setRelasiSubView("tree");
                                    setActiveTab("relasi");
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                  }}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-[#009388] hover:bg-[#e6f7f5] transition"
                                  title="Lihat Pohon Silsilah & Peta Relasi KK"
                                >
                                  <Eye className="w-4 h-4 text-[#009388]" />
                                </button>
                                {canModify(item.dusun) ? (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditingSensus(item);
                                        setDesilMode("manual");
                                        setManualDesil(item.desil || 1);
                                        setIsSensusModalOpen(true);
                                      }}
                                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                                      title="Edit Sensus"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleSoftDeleteSensus(item)}
                                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                                      title="Hapus / Arsipkan Data"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-[10px] text-slate-400 italic px-1">Read-Only</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {filteredSensus.length > 0 && (
                  <PaginationControls
                    currentPage={currentSensusPage}
                    totalPages={totalSensusPages}
                    pageSize={sensusPageSize}
                    totalItems={filteredSensus.length}
                    onPageChange={setSensusPage}
                    onPageSizeChange={setSensusPageSize}
                    itemLabel="Kepala Keluarga"
                  />
                )}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 2: DATA PENDUDUK (3 DUSUN: MANIS, PAHING, WAGE)              */}
          {/* ================================================================ */}
          {activeTab === "residents" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2.5">
                    <Users className="w-6 h-6 text-[#009388]" />
                    <span>Master Kependudukan 3 Dusun (Manis, Pahing, Wage)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Buku induk data penduduk terpadu berbasis NIK 16 digit dan nomor kartu keluarga.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={fetchAllData}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
                    title="Segarkan Data"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingData ? "animate-spin text-[#009388]" : ""}`} />
                  </button>
                  <button
                    onClick={() => {
                      setIsImportModalOpen(true);
                      if (currentUser?.role === "kadus" && currentUser.dusun && currentUser.dusun !== "all") {
                        setImportDefaultDusun(currentUser.dusun as "Wage" | "Manis" | "Pahing");
                      }
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Impor File Excel (Dukcapil)</span>
                  </button>
                  <button
                    onClick={handleOpenCreateResident}
                    className="px-4 py-2.5 bg-[#009388] hover:bg-[#007b71] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Daftarkan Warga Baru</span>
                  </button>
                </div>
              </div>

              {/* Filter & Search */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={residentSearch}
                    onChange={(e) => setResidentSearch(e.target.value)}
                    placeholder="Cari NIK, No KK, atau Nama Warga..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {currentUser?.role === "kadus" && currentUser.dusun && currentUser.dusun !== "all" ? (
                    <div className="px-3 py-2 text-xs rounded-xl border border-emerald-200 bg-emerald-50 font-bold text-emerald-800 flex items-center gap-1.5 shadow-2xs">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>Dusun {currentUser.dusun} (Terkunci Sesuai Wilayah)</span>
                    </div>
                  ) : (
                    <select
                      value={residentDusunFilter}
                      onChange={(e) => setResidentDusunFilter(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700"
                    >
                      <option value="all">Semua Dusun (Manis, Pahing, Wage)</option>
                      <option value="Manis">Dusun Manis</option>
                      <option value="Pahing">Dusun Pahing</option>
                      <option value="Wage">Dusun Wage</option>
                    </select>
                  )}

                  <button
                    onClick={() => {
                      const nextMasked = !maskSensitiveData;
                      setMaskSensitiveData(nextMasked);
                      if (!nextMasked) {
                        recordAuditLog({
                          actor_email: currentUser?.email || "pamong",
                          actor_name: currentUser?.nama || "Pamong",
                          actor_role: currentUser?.role || "kadus",
                          action: "UPDATE",
                          entity_type: "residents",
                          entity_id: "ALL",
                          description: `${currentUser?.nama} membuka sensor NIK warga pada tabel e-KTP (Kepatuhan UU PDP No. 27/2022)`,
                        });
                      }
                    }}
                    className={`px-3 py-2 text-xs rounded-xl border font-bold flex items-center gap-1.5 transition ${
                      maskSensitiveData
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                        : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                    }`}
                    title={maskSensitiveData ? "Sensor NIK Aktif sesuai UU PDP No. 27/2022. Klik untuk membuka." : "Klik untuk mengaktifkan sensor NIK"}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{maskSensitiveData ? "Sensor NIK: Aktif" : "Sensor NIK: Terbuka"}</span>
                  </button>
                </div>
              </div>

              {/* Tabel Residents */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                {filteredResidents.length === 0 ? (
                  <div className="p-12 text-center">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800 text-sm">Belum Ada Warga yang Didaftarkan</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Tabel master kependudukan bersih di Supabase. Klik tombol di bawah untuk mendaftarkan warga pertama.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <button
                        onClick={handleOpenCreateResident}
                        className="px-4 py-2 bg-[#009388] text-white rounded-xl text-xs font-bold hover:bg-[#007b71] transition flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Daftarkan Warga Pertama</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsImportModalOpen(true);
                          if (currentUser?.role === "kadus" && currentUser.dusun && currentUser.dusun !== "all") {
                            setImportDefaultDusun(currentUser.dusun as "Wage" | "Manis" | "Pahing");
                          }
                        }}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1.5"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Impor File Excel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-3 px-4">NIK / No KK</th>
                          <th className="py-3 px-4">Nama Lengkap & Kelahiran</th>
                          <th className="py-3 px-4">Jenis Kelamin & Agama</th>
                          <th className="py-3 px-4">Dusun / RT / RW</th>
                          <th className="py-3 px-4">Pekerjaan & Keluarga</th>
                          <th className="py-3 px-4">Status Warga</th>
                          <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedResidents.map((res) => (
                          <tr key={res.nik} className="hover:bg-slate-50/70 transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                              <div>{formatMaskedNik(res.nik, maskSensitiveData)}</div>
                              <div className="text-[10px] text-slate-400 font-normal">KK: {formatMaskedNik(res.noKk, maskSensitiveData)}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-800">{res.nama}</div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{res.ttl || "TTL Belum Diisi"}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  res.jenisKelamin === "Perempuan"
                                    ? "bg-pink-50 text-pink-700 border-pink-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                }`}>
                                  {res.jenisKelamin || "Laki-laki"}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 mt-1">
                                {res.agama || "Islam"}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-800 block">Dusun {res.dusun}</span>
                              <span className="text-[10px] text-slate-400">RT {res.rt} / RW {res.rw}</span>
                              {res.alamat && (
                                <div className="text-[10px] text-slate-500 truncate max-w-[140px]" title={res.alamat}>
                                  {res.alamat}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="text-slate-800 font-semibold">{res.pekerjaan || "Belum Bekerja"}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                {res.hubunganKeluarga || "Anggota Keluarga"} • <span className="text-slate-400">{res.statusPerkawinan || "-"}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 space-y-1">
                              <div>
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                                  {res.status || "Warga Tetap"}
                                </span>
                              </div>
                              {(!res.nik || res.nik.startsWith("TEMP-") || !res.noKk || !res.ttl || res.ttl === "Kuningan" || !res.pekerjaan || res.pekerjaan.toLowerCase().includes("tidak tahu") || !res.rt || !res.rw) && (
                                <div>
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-bold text-[9px] border border-amber-200" title="Data kependudukan warga ini belum lengkap (perlu verifikasi NIK/No KK/TTL/RT/RW)">
                                    <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                                    <span>Data Belum Lengkap</span>
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    if (res.noKk) {
                                      setSelectedRelasiKkNo(res.noKk);
                                    }
                                    setSelectedGraphEntity({ type: "KTP", data: res });
                                    setRelasiSubView("tree");
                                    setActiveTab("relasi");
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                  }}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-[#009388] hover:bg-[#e6f7f5] transition"
                                  title="Lihat Pohon Silsilah & Relasi Warga"
                                >
                                  <Eye className="w-4 h-4 text-[#009388]" />
                                </button>
                                {canModify(res.dusun) ? (
                                  <>
                                    <button
                                      onClick={() => {
                                        setIsEditingResidentExisting(true);
                                        setEditingResident({
                                          ...res,
                                          ttl: res.ttl || "Kuningan, ",
                                          jenisKelamin: res.jenisKelamin || "Laki-laki",
                                          pekerjaan: res.pekerjaan || "Wiraswasta",
                                          agama: res.agama || "Islam",
                                          statusPerkawinan: res.statusPerkawinan || "Kawin",
                                          hubunganKeluarga: res.hubunganKeluarga || "Kepala Keluarga",
                                          alamat: res.alamat || `Dusun ${res.dusun} RT ${res.rt} / RW ${res.rw}`,
                                          status: res.status || "Warga Tetap",
                                          syncStatus: res.syncStatus || "Tersinkronisasi",
                                        });
                                        setIsResidentModalOpen(true);
                                      }}
                                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                                      title="Edit Data Warga"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleSoftDeleteResident(res)}
                                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                                      title="Hapus / Arsipkan Warga"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-[10px] text-slate-400 italic">Read-Only</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {filteredResidents.length > 0 && (
                  <PaginationControls
                    currentPage={currentResidentPage}
                    totalPages={totalResidentPages}
                    pageSize={residentPageSize}
                    totalItems={filteredResidents.length}
                    onPageChange={setResidentPage}
                    onPageSizeChange={setResidentPageSize}
                    itemLabel="Warga"
                  />
                )}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 2B: PETA RELASI KK & KTP (CIVIC KNOWLEDGE GRAPH TERPADU)      */}
          {/* ================================================================ */}
          {activeTab === "relasi" && (() => {
            const filteredRelasiKks = sensusList.filter((s) => {
              const matchDusun = relasiDusunFilter === "all" || s.dusun === relasiDusunFilter;
              const matchSearch =
                !relasiSearch.trim() ||
                s.namaKepalaKeluarga.toLowerCase().includes(relasiSearch.toLowerCase()) ||
                s.noKk.includes(relasiSearch);
              return matchDusun && matchSearch;
            });

            const activeKk =
              sensusList.find((s) => s.noKk === selectedRelasiKkNo) ||
              filteredRelasiKks[0] ||
              sensusList[0];

            const currentMembers = activeKk
              ? residentsList.filter((r) => r.noKk === activeKk.noKk)
              : [];

            const kepala = currentMembers.find((r) =>
              r.hubunganKeluarga?.toLowerCase().includes("kepala")
            );
            const istriList = currentMembers.filter((r) =>
              r.hubunganKeluarga?.toLowerCase().includes("istri")
            );
            const anakList = currentMembers.filter((r) =>
              r.hubunganKeluarga?.toLowerCase().includes("anak")
            );
            const tanggunganList = currentMembers.filter(
              (r) =>
                !r.hubunganKeluarga?.toLowerCase().includes("kepala") &&
                !r.hubunganKeluarga?.toLowerCase().includes("istri") &&
                !r.hubunganKeluarga?.toLowerCase().includes("anak")
            );

            // Analisis Demografi & Kerentanan Anggota Keluarga
            const totalJiwa = currentMembers.length;
            const lakiCount = currentMembers.filter((r) => r.jenisKelamin === "Laki-laki").length;
            const perempuanCount = currentMembers.filter((r) => r.jenisKelamin === "Perempuan").length;
            const memberAges = currentMembers.map((r) => getResidentAge(r.ttl, r.nik).age);
            const balitaCount = memberAges.filter((a) => a !== null && a <= 5).length;
            const sekolahCount = memberAges.filter((a) => a !== null && a >= 6 && a <= 17).length;
            const produktifCount = memberAges.filter((a) => a !== null && a >= 18 && a <= 59).length;
            const lansiaCount = memberAges.filter((a) => a !== null && a >= 60).length;

            return (
              <div className="space-y-6">
                {/* Header Tab */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-[#009388] uppercase tracking-wider mb-1">
                      <span>Data Center</span>
                      <span>•</span>
                      <span>Kependudukan SIAK</span>
                      <span>•</span>
                      <span>Modul Relasi Kependudukan</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 flex items-center gap-2.5 tracking-tight">
                      <div className="w-8 h-8 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center">
                        <Network className="w-5 h-5" />
                      </div>
                      <span>Peta Relasi KK & KTP Elektronik</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Visualisasi silsilah keluarga, keterhubungan Nomor Kartu Keluarga (KK) dengan KTP (NIK), garis perkawinan, dan kerentanan sosial di 3 Dusun.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5">
                    {activeKk && (
                      <button
                        onClick={() => setSelectedSensusForPdf(activeKk)}
                        className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-2xs flex items-center gap-2 transition"
                      >
                        <Printer className="w-4 h-4 text-slate-500" />
                        <span>Cetak Profil KK</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenCreateResident()}
                      className="px-4 py-2 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Tambah Anggota</span>
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Total Kartu Keluarga
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                      {sensusList.length} <span className="text-xs font-normal text-slate-400">KK</span>
                    </div>
                    <div className="text-[10px] text-emerald-600 mt-0.5 font-bold">Terverifikasi Dusun</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Total Jiwa Terdata
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                      {residentsList.length} <span className="text-xs font-normal text-slate-400">Jiwa</span>
                    </div>
                    <div className="text-[10px] text-blue-600 mt-0.5 font-bold">
                      {(residentsList.length / Math.max(1, sensusList.length)).toFixed(1)} Jiwa / KK
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Keluarga Desil 1 (Rentan)
                    </div>
                    <div className="text-2xl font-black text-red-600 mt-1">
                      {sensusList.filter((s) => s.desil === 1).length}{" "}
                      <span className="text-xs font-normal text-slate-400">KK</span>
                    </div>
                    <div className="text-[10px] text-red-700 mt-0.5 font-bold">Prioritas BLT-DD & PKH</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Kondisi Rumah RTLH
                    </div>
                    <div className="text-2xl font-black text-amber-600 mt-1">
                      {sensusList.filter((s) => s.kondisiRumah === "RTLH").length}{" "}
                      <span className="text-xs font-normal text-slate-400">KK</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-medium">Perlu Bedah Rumah</div>
                  </div>
                </div>

                {/* MATRIKS KOMPOSISI DEMOGRAFI & KERENTANAN KELUARGA TERPILIH */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                  {/* Baris Atas: Info Keluarga Terpilih & Tombol Ganti Data (CTA) */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center font-bold text-sm shadow-2xs">
                        KK
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900">
                            {activeKk ? `Keluarga Bpk. ${activeKk.namaKepalaKeluarga}` : "Belum Ada Keluarga Terpilih"}
                          </span>
                          {activeKk && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#009388]/10 text-[#009388]">
                              Dusun {activeKk.dusun} RT {activeKk.rt}/RW {activeKk.rw}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {activeKk
                            ? `No. KK: ${formatMaskedNik(activeKk.noKk, maskSensitiveData)} • Desil ${activeKk.desil} • Rumah ${activeKk.kondisiRumah}`
                            : "Silakan pilih keluarga melalui tabel data sensus atau kependudukan"}
                        </p>
                      </div>
                    </div>

                    {/* Tombol CTA Ganti Data & Switcher Mode Visualisasi */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                        <button
                          onClick={() => setActiveTab("sensus")}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-2xs border border-slate-200 flex items-center gap-1.5 transition"
                          title="Buka tabel Sensus KK untuk memilih keluarga lain"
                        >
                          <ClipboardCheck className="w-3.5 h-3.5 text-[#009388]" />
                          <span>Pilih dari Sensus KK</span>
                        </button>
                        <button
                          onClick={() => setActiveTab("residents")}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-2xs border border-slate-200 flex items-center gap-1.5 transition"
                          title="Buka tabel Data Penduduk untuk memilih warga lain"
                        >
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          <span>Pilih dari Data e-KTP</span>
                        </button>
                      </div>

                      {/* View Switcher */}
                      <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                        <button
                          onClick={() => setRelasiSubView("tree")}
                          className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                            relasiSubView === "tree"
                              ? "bg-[#009388] text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900 font-semibold"
                          }`}
                        >
                          <GitFork className="w-3.5 h-3.5" />
                          <span>Pohon Relasi</span>
                        </button>
                        <button
                          onClick={() => setRelasiSubView("matrix")}
                          className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                            relasiSubView === "matrix"
                              ? "bg-[#009388] text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900 font-semibold"
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Matriks Tabel</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 4 Kolom Matriks Demografi & Analisis Kerentanan Keluarga Terpilih */}
                  {activeKk ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      {/* Metrik 1: Komposisi Jiwa & Gender */}
                      <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          1. Komposisi Anggota
                        </span>
                        <div className="text-xl font-black text-slate-900 font-mono">
                          {totalJiwa} <span className="text-xs font-normal text-slate-500">Jiwa Terdaftar</span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 pt-1 border-t border-slate-200/60">
                          <span className="text-blue-700 font-bold">{lakiCount} Laki-laki</span>
                          <span>•</span>
                          <span className="text-pink-700 font-bold">{perempuanCount} Perempuan</span>
                        </div>
                      </div>

                      {/* Metrik 2: Rentang Usia & Kelompok Rentan */}
                      <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          2. Struktur Usia & Rentan
                        </span>
                        <div className="text-xl font-black text-emerald-800 font-mono">
                          {produktifCount} <span className="text-xs font-normal text-slate-500">Usia Produktif</span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 pt-1 border-t border-slate-200/60 truncate">
                          <span>{balitaCount} Balita</span>
                          <span>•</span>
                          <span>{sekolahCount} Pelajar</span>
                          <span>•</span>
                          <span className={lansiaCount > 0 ? "text-purple-700 font-bold" : ""}>{lansiaCount} Lansia</span>
                        </div>
                      </div>

                      {/* Metrik 3: Kesejahteraan & PBB */}
                      <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          3. Hunian & PBB Desa
                        </span>
                        <div className="text-xl font-black text-slate-900 font-mono">
                          Desil {activeKk.desil}{" "}
                          <span className="text-xs font-normal text-slate-500">({activeKk.desil <= 2 ? "Rentan" : "Mandiri"})</span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 pt-1 border-t border-slate-200/60">
                          <span>Kondisi: <strong>{activeKk.kondisiRumah}</strong></span>
                          <span>•</span>
                          <span className={activeKk.statusPbb === "Lunas" ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                            PBB {activeKk.statusPbb}
                          </span>
                        </div>
                      </div>

                      {/* Metrik 4: Program Intervensi Bansos */}
                      <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          4. Status Intervensi Desa
                        </span>
                        <div className="text-sm font-extrabold text-slate-900 truncate">
                          {activeKk.desil === 1 || balitaCount > 0 || lansiaCount > 0
                            ? "Prioritas Bansos & Posyandu"
                            : "Pemberdayaan Reguler"}
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium pt-1 border-t border-slate-200/60 truncate">
                          {activeKk.bansosAktif || "Non-Bansos (Swa-Mandiri)"}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
                      <div className="text-sm font-bold text-slate-700">Belum Ada Keluarga Terpilih</div>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Akses tabel Sensus KK atau Data Penduduk e-KTP di tab navigasi, lalu klik tombol aksi mata untuk melihat struktur hubungan keluarga ini.
                      </p>
                      <div className="flex justify-center gap-2 pt-2">
                        <button
                          onClick={() => setActiveTab("sensus")}
                          className="px-3.5 py-1.5 rounded-xl bg-[#009388] text-white text-xs font-bold shadow-xs hover:bg-[#007b71]"
                        >
                          Buka Tabel Sensus KK
                        </button>
                        <button
                          onClick={() => setActiveTab("residents")}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold shadow-xs hover:bg-slate-700"
                        >
                          Buka Data Penduduk (e-KTP)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ============================================================== */}
                {/* SUB-VIEW 1: BAGAN POHON RELASI KELUARGA (FAMILY TREE CARDS)     */}
                {/* ============================================================== */}
                {relasiSubView === "tree" && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
                    {activeKk ? (
                      <div>
                        {/* Header Keluarga Terpilih */}
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                              Struktur Keluarga:{" "}
                              <strong className="text-[#009388]">
                                Keluarga Bpk. {activeKk.namaKepalaKeluarga} (Dusun {activeKk.dusun})
                              </strong>
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            {currentMembers.length} Jiwa Terhubung • No. KK: {formatMaskedNik(activeKk.noKk, maskSensitiveData)}
                          </div>
                        </div>

                        {/* LEVEL 1: CENTRAL HOUSEHOLD HUB (KARTU KELUARGA) */}
                        <div className="flex justify-center mb-10">
                          <div
                            onClick={() => setSelectedGraphEntity({ type: "KK", data: activeKk })}
                            className="cursor-pointer group relative bg-gradient-to-br from-amber-50 to-orange-50/70 border-2 border-amber-300/80 hover:border-amber-500 rounded-2xl p-5 w-full max-w-md shadow-sm hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs shadow-sm">
                                  KK
                                </div>
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
                                    Pusat Rumah Tangga
                                  </span>
                                  <h3 className="font-extrabold text-slate-900 text-base mt-0.5 group-hover:text-amber-900 transition">
                                    {activeKk.namaKepalaKeluarga}
                                  </h3>
                                </div>
                              </div>
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                                  activeKk.desil === 1
                                    ? "bg-red-100 text-red-700 border-red-200"
                                    : activeKk.desil === 2
                                    ? "bg-amber-100 text-amber-700 border-amber-200"
                                    : "bg-emerald-100 text-emerald-700 border-emerald-200"
                                }`}
                              >
                                Desil {activeKk.desil}
                              </span>
                            </div>

                            <div className="mt-4 pt-3 border-t border-amber-200/60 grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-[10px] text-slate-500 block">Nomor KK</span>
                                <span className="font-mono font-bold text-slate-900 text-[11px]">
                                  {formatMaskedNik(activeKk.noKk, maskSensitiveData)}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block">Wilayah Domisili</span>
                                <span className="font-bold text-slate-800">
                                  Dusun {activeKk.dusun} (RT {activeKk.rt}/{activeKk.rw})
                                </span>
                              </div>
                              <div className="col-span-2 flex items-center justify-between mt-1 text-[11px]">
                                <span className="text-slate-600">
                                  PBB:{" "}
                                  <strong
                                    className={
                                      activeKk.statusPbb === "Lunas"
                                        ? "text-emerald-700"
                                        : "text-amber-700"
                                    }
                                  >
                                    {activeKk.statusPbb}
                                  </strong>{" "}
                                  • Rumah: <strong>{activeKk.kondisiRumah}</strong>
                                </span>
                                <span className="text-amber-800 font-bold underline text-[10px] group-hover:translate-x-1 transition">
                                  Detail KK →
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* LEVEL 2: KEPALA KELUARGA & ISTRI (SPOUSE LEVEL) */}
                        <div className="max-w-4xl mx-auto">
                          {istriList.length > 0 && (
                            <div className="flex items-center justify-center gap-3 mb-4">
                              <div className="h-px bg-slate-200 flex-1"></div>
                              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-[11px] font-bold shadow-2xs">
                                <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                                <span>Pasangan Kepala Keluarga & Istri</span>
                              </span>
                              <div className="h-px bg-slate-200 flex-1"></div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            {/* KEPALA KELUARGA CARD */}
                            {kepala ? (() => {
                              const age = getResidentAge(kepala.ttl, kepala.nik);
                              return (
                                <div
                                  onClick={() => setSelectedGraphEntity({ type: "KTP", data: kepala })}
                                  className="cursor-pointer bg-white rounded-2xl border-2 border-blue-200 hover:border-blue-500 p-5 shadow-sm hover:shadow-lg transition-all group"
                                >
                                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                        L
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                                            Kepala Keluarga
                                          </span>
                                          {age.label !== "-" && (
                                            <span className="px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200">
                                              {age.label}
                                            </span>
                                          )}
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition leading-snug">
                                          {kepala.nama}
                                        </h4>
                                      </div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                                      {kepala.statusPerkawinan || "Kawin"}
                                    </span>
                                  </div>
                                  <div className="mt-3.5 space-y-2 text-xs text-slate-600">
                                    <div className="flex items-center justify-between">
                                      <span className="text-slate-400">NIK:</span>
                                      <span className="font-mono font-bold text-slate-900">{formatMaskedNik(kepala.nik, maskSensitiveData)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-slate-400">Kelahiran:</span>
                                      <span className="text-slate-800 font-medium">{kepala.ttl || "Kuningan"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-slate-400">Pekerjaan:</span>
                                      <span className="font-semibold text-slate-800">{kepala.pekerjaan || "Wiraswasta"}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                                      <span className="text-slate-400">Agama / Status:</span>
                                      <span className="text-slate-700 font-medium">
                                        {kepala.agama || "Islam"} • {kepala.status || "Warga Tetap"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })() : (
                              <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-5 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
                                <span>Data Kepala Keluarga belum terdaftar di NIK</span>
                              </div>
                            )}

                            {/* ISTRI CARD */}
                            {istriList.length > 0 ? (
                              istriList.map((istri) => {
                                const age = getResidentAge(istri.ttl, istri.nik);
                                return (
                                  <div
                                    key={istri.nik}
                                    onClick={() => setSelectedGraphEntity({ type: "KTP", data: istri })}
                                    className="cursor-pointer bg-white rounded-2xl border-2 border-pink-200 hover:border-pink-500 p-5 shadow-sm hover:shadow-lg transition-all group"
                                  >
                                    <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                                      <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                          P
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-extrabold text-pink-600 uppercase tracking-wider">
                                              Istri
                                            </span>
                                            {age.label !== "-" && (
                                              <span className="px-1.5 py-0.2 rounded-md bg-pink-50 text-pink-800 text-[10px] font-bold border border-pink-200">
                                                {age.label}
                                              </span>
                                            )}
                                          </div>
                                          <h4 className="font-bold text-sm text-slate-900 group-hover:text-pink-600 transition leading-snug">
                                            {istri.nama}
                                          </h4>
                                        </div>
                                      </div>
                                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200 shrink-0">
                                        {istri.statusPerkawinan || "Kawin"}
                                      </span>
                                    </div>
                                    <div className="mt-3.5 space-y-2 text-xs text-slate-600">
                                      <div className="flex items-center justify-between">
                                        <span className="text-slate-400">NIK:</span>
                                        <span className="font-mono font-bold text-slate-900">{formatMaskedNik(istri.nik, maskSensitiveData)}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Kelahiran:</span>
                                        <span className="text-slate-800 font-medium">{istri.ttl || "Kuningan"}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Pekerjaan:</span>
                                        <span className="font-semibold text-slate-800">{istri.pekerjaan || "Mengurus Rumah Tangga"}</span>
                                      </div>
                                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                                        <span className="text-slate-400">Agama / Status:</span>
                                        <span className="text-slate-700 font-medium">
                                          {istri.agama || "Islam"} • {istri.status || "Warga Tetap"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-5 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
                                <span>Tidak ada data Istri tercatat di KK ini</span>
                              </div>
                            )}
                          </div>

                          {/* LEVEL 3: ANAK KANDUNG & TANGGUNGAN LAIN */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="h-px flex-1 bg-slate-200"></div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3.5 py-1 rounded-full border border-slate-200">
                                Anak Kandung & Tanggungan ({anakList.length + tanggunganList.length})
                              </span>
                              <div className="h-px flex-1 bg-slate-200"></div>
                            </div>

                            {anakList.length === 0 && tanggunganList.length === 0 ? (
                              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center text-slate-400 text-xs">
                                Tidak ada anak atau tanggungan terdaftar pada Kartu Keluarga ini.
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {anakList.map((anak, idx) => {
                                  const age = getResidentAge(anak.ttl, anak.nik);
                                  return (
                                    <div
                                      key={anak.nik}
                                      onClick={() => setSelectedGraphEntity({ type: "KTP", data: anak })}
                                      className="cursor-pointer bg-white rounded-2xl border-2 border-emerald-200 hover:border-emerald-500 p-4 shadow-2xs hover:shadow-md transition-all group"
                                    >
                                      <div className="flex items-start justify-between pb-2.5 border-b border-slate-100">
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                                            A{idx + 1}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-[9px] font-extrabold text-emerald-700 uppercase tracking-wider block truncate">
                                                Anak ke-{idx + 1}
                                              </span>
                                              {age.label !== "-" && (
                                                <span className="px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-800 text-[9px] font-bold border border-emerald-200">
                                                  {age.label}
                                                </span>
                                              )}
                                            </div>
                                            <h5 className="font-bold text-xs text-slate-900 truncate group-hover:text-emerald-700 transition">
                                              {anak.nama}
                                            </h5>
                                          </div>
                                        </div>
                                        <span
                                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                                            anak.jenisKelamin === "Perempuan"
                                              ? "bg-pink-50 text-pink-700 border-pink-200"
                                              : "bg-blue-50 text-blue-700 border-blue-200"
                                          }`}
                                        >
                                          {anak.jenisKelamin === "Perempuan" ? "P" : "L"}
                                        </span>
                                      </div>

                                      <div className="mt-2.5 space-y-1.5 text-[11px] text-slate-600">
                                        <div className="flex justify-between">
                                          <span className="text-slate-400 font-mono text-[10px]">NIK:</span>
                                          <span className="font-mono font-bold text-slate-800">{formatMaskedNik(anak.nik, maskSensitiveData)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">Pekerjaan:</span>
                                          <span className="font-semibold text-slate-800">{anak.pekerjaan || "Belum Bekerja"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">Kelahiran:</span>
                                          <span className="text-slate-700 truncate max-w-[130px]" title={anak.ttl}>
                                            {anak.ttl || "Kuningan"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between pt-1 border-t border-slate-100 text-[10px]">
                                          <span className="text-slate-400">Status Kawin:</span>
                                          <span className="text-slate-600 font-medium">{anak.statusPerkawinan || "Belum Kawin"}</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}

                                {tanggunganList.map((fam, idx) => {
                                  const age = getResidentAge(fam.ttl, fam.nik);
                                  return (
                                    <div
                                      key={fam.nik}
                                      onClick={() => setSelectedGraphEntity({ type: "KTP", data: fam })}
                                      className="cursor-pointer bg-white rounded-2xl border-2 border-purple-200 hover:border-purple-500 p-4 shadow-2xs hover:shadow-md transition-all group"
                                    >
                                      <div className="flex items-start justify-between pb-2.5 border-b border-slate-100">
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                                            T{idx + 1}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-[9px] font-extrabold text-purple-700 uppercase tracking-wider block truncate">
                                                {fam.hubunganKeluarga || "Famili Lain"}
                                              </span>
                                              {age.label !== "-" && (
                                                <span className="px-1.5 py-0.2 rounded-md bg-purple-50 text-purple-800 text-[9px] font-bold border border-purple-200">
                                                  {age.label}
                                                </span>
                                              )}
                                            </div>
                                            <h5 className="font-bold text-xs text-slate-900 truncate group-hover:text-purple-700 transition">
                                              {fam.nama}
                                            </h5>
                                          </div>
                                        </div>
                                        <span
                                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                                            fam.jenisKelamin === "Perempuan"
                                              ? "bg-pink-50 text-pink-700 border-pink-200"
                                              : "bg-blue-50 text-blue-700 border-blue-200"
                                          }`}
                                        >
                                          {fam.jenisKelamin === "Perempuan" ? "P" : "L"}
                                        </span>
                                      </div>

                                      <div className="mt-2.5 space-y-1.5 text-[11px] text-slate-600">
                                        <div className="flex justify-between">
                                          <span className="text-slate-400 font-mono text-[10px]">NIK:</span>
                                          <span className="font-mono font-bold text-slate-800">{formatMaskedNik(fam.nik, maskSensitiveData)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">Pekerjaan:</span>
                                          <span className="font-semibold text-slate-800">{fam.pekerjaan || "-"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">Kelahiran:</span>
                                          <span className="text-slate-700 truncate max-w-[130px]" title={fam.ttl}>
                                            {fam.ttl || "Kuningan"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between pt-1 border-t border-slate-100 text-[10px]">
                                          <span className="text-slate-400">Status Kawin:</span>
                                          <span className="text-slate-600 font-medium">{fam.statusPerkawinan || "-"}</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-12 text-center text-slate-400 text-sm">
                        Tidak ada data keluarga yang cocok dengan filter.
                      </div>
                    )}
                  </div>
                )}

                {/* ============================================================== */}
                {/* SUB-VIEW 2: MATRIKS KONEKTOR TABEL LENGKAP                    */}
                {/* ============================================================== */}
                {relasiSubView === "matrix" && (
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-3 px-4">NIK (KTP Warga)</th>
                          <th className="py-3 px-4">Nama Lengkap & TTL</th>
                          <th className="py-3 px-4">Relasi dalam KK</th>
                          <th className="py-3 px-4">Nomor KK Terhubung</th>
                          <th className="py-3 px-4">Dusun / RT / RW</th>
                          <th className="py-3 px-4">Pekerjaan</th>
                          <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentMembers.map((m) => (
                          <tr key={m.nik} className="hover:bg-slate-50/80 transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                              {formatMaskedNik(m.nik, maskSensitiveData)}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">{m.nama}</div>
                              <div className="text-[10px] text-slate-500">{m.ttl}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  m.hubunganKeluarga?.toLowerCase().includes("kepala")
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : m.hubunganKeluarga?.toLowerCase().includes("istri")
                                    ? "bg-pink-50 text-pink-700 border-pink-200"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                }`}
                              >
                                {m.hubunganKeluarga || "Anggota"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-700">
                              {formatMaskedNik(m.noKk, maskSensitiveData)}
                            </td>
                            <td className="py-3.5 px-4">
                              Dusun {m.dusun} (RT {m.rt}/{m.rw})
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">{m.pekerjaan}</td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setSelectedGraphEntity({ type: "KTP", data: m })}
                                className="px-2.5 py-1 rounded-lg bg-[#009388] text-white font-bold hover:bg-[#007b71] transition text-[11px]"
                              >
                                Sorot Relasi
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}



                {/* ============================================================== */}
                {/* SLIDE-OVER INSPECTOR DRAWER (DETAIL KTP / KK)                 */}
                {/* ============================================================== */}
                {selectedGraphEntity && (
                  <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex justify-end">
                    <div className="w-84 sm:w-96 bg-white border-l border-slate-200 shadow-2xl h-full p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
                      <div>
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs ${
                                selectedGraphEntity.type === "KTP"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {selectedGraphEntity.type}
                            </div>
                            <div>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider ${
                                  selectedGraphEntity.type === "KTP"
                                    ? "text-blue-600"
                                    : "text-amber-700"
                                }`}
                              >
                                {selectedGraphEntity.type === "KTP"
                                  ? "Entitas e-KTP Warga"
                                  : "Kartu Keluarga (Hub)"}
                              </span>
                              <h3 className="font-extrabold text-slate-900 text-base leading-tight truncate max-w-[200px]">
                                {selectedGraphEntity.type === "KTP"
                                  ? selectedGraphEntity.data.nama
                                  : selectedGraphEntity.data.namaKepalaKeluarga}
                              </h3>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedGraphEntity(null)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Drawer Details Content */}
                        <div className="mt-5 space-y-3 text-xs">
                          {selectedGraphEntity.type === "KTP" ? (
                            <>
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                <span className="text-slate-400 text-[10px] block">NIK Warga</span>
                                <span className="font-mono font-bold text-slate-900 text-xs">
                                  {formatMaskedNik(selectedGraphEntity.data.nik, maskSensitiveData)}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                  <span className="text-slate-400 text-[10px] block">Hubungan</span>
                                  <span className="font-bold text-slate-800">
                                    {selectedGraphEntity.data.hubunganKeluarga}
                                  </span>
                                </div>
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                  <span className="text-slate-400 text-[10px] block">Jenis Kelamin</span>
                                  <span className="font-bold text-slate-800">
                                    {selectedGraphEntity.data.jenisKelamin}
                                  </span>
                                </div>
                              </div>
                              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                <span className="text-slate-400 text-[10px] block">Tempat, Tanggal Lahir</span>
                                <span className="font-bold text-slate-800">
                                  {selectedGraphEntity.data.ttl || "Kuningan"}
                                </span>
                              </div>
                              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                <span className="text-slate-400 text-[10px] block">Mata Pencaharian</span>
                                <span className="font-bold text-slate-800">
                                  {selectedGraphEntity.data.pekerjaan}
                                </span>
                              </div>
                              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                <span className="text-slate-400 text-[10px] block">Nomor KK</span>
                                <span className="font-mono font-bold text-[#009388]">
                                  {formatMaskedNik(selectedGraphEntity.data.noKk, maskSensitiveData)}
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* Foto Fisik Kondisi Rumah */}
                              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                                <div className="relative aspect-video w-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                  {selectedGraphEntity.data.foto_rumah_url ? (
                                    <img
                                      src={selectedGraphEntity.data.foto_rumah_url}
                                      alt={`Foto Rumah ${selectedGraphEntity.data.namaKepalaKeluarga}`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                          selectedGraphEntity.data.dusun === "Pahing"
                                            ? "/dusun-pahing.jpg"
                                            : selectedGraphEntity.data.dusun === "Wage"
                                            ? "/dusun-wage.jpg"
                                            : "/dusun-manis.jpg";
                                      }}
                                    />
                                  ) : (
                                    <div className="relative w-full h-full">
                                      <img
                                        src={
                                          selectedGraphEntity.data.dusun === "Pahing"
                                            ? "/dusun-pahing.jpg"
                                            : selectedGraphEntity.data.dusun === "Wage"
                                            ? "/dusun-wage.jpg"
                                            : "/dusun-manis.jpg"
                                        }
                                        alt="Placeholder Rumah"
                                        className="w-full h-full object-cover opacity-60"
                                      />
                                      <div className="absolute inset-0 bg-slate-900/30 flex flex-col items-center justify-center text-white text-center p-2">
                                        <Camera className="w-5 h-5 mb-1" />
                                        <span className="text-[10px] font-semibold">Foto Lapangan Belum Diunggah</span>
                                        <span className="text-[9px] text-white/80">(Ilustrasi Dusun {selectedGraphEntity.data.dusun})</span>
                                      </div>
                                    </div>
                                  )}
                                  <div className="absolute top-2.5 right-2.5">
                                    <span
                                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-sm ${
                                        selectedGraphEntity.data.kondisiRumah === "RTLH"
                                          ? "bg-red-600 text-white"
                                          : "bg-emerald-600 text-white"
                                      }`}
                                    >
                                      {selectedGraphEntity.data.kondisiRumah || "Layak Huni"}
                                    </span>
                                  </div>
                                </div>
                                <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px]">
                                  <span className="text-slate-500">Struktur Bangunan:</span>
                                  <span className="font-semibold text-slate-800">
                                    {selectedGraphEntity.data.dinding || "Tembok"} • {selectedGraphEntity.data.lantai || "Keramik"}
                                  </span>
                                </div>
                              </div>

                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                <span className="text-slate-400 text-[10px] block">Nomor Kartu Keluarga</span>
                                <span className="font-mono font-bold text-slate-900 text-xs">
                                  {formatMaskedNik(selectedGraphEntity.data.noKk, maskSensitiveData)}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                  <span className="text-slate-400 text-[10px] block">Desil Kesejahteraan</span>
                                  <span className="font-bold text-red-600">
                                    Desil {selectedGraphEntity.data.desil}
                                  </span>
                                </div>
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                  <span className="text-slate-400 text-[10px] block">Status PBB</span>
                                  <span className="font-bold text-emerald-600">
                                    {selectedGraphEntity.data.statusPbb}
                                  </span>
                                </div>
                              </div>
                              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                <span className="text-slate-400 text-[10px] block">Kondisi Rumah</span>
                                <span className="font-bold text-slate-800">
                                  {selectedGraphEntity.data.kondisiRumah}
                                </span>
                              </div>
                              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                <span className="text-slate-400 text-[10px] block">Alamat</span>
                                <span className="font-medium text-slate-800">
                                  {selectedGraphEntity.data.alamat}
                                </span>
                              </div>
                              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                <span className="text-slate-400 text-[10px] block">Bansos Aktif</span>
                                <span className="font-bold text-indigo-600">
                                  {selectedGraphEntity.data.bansosAktif || "Non-Bansos"}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Drawer Actions */}
                      <div className="mt-6 pt-4 border-t border-slate-200 space-y-2">
                        {selectedGraphEntity.type === "KTP" ? (
                          <button
                            onClick={() => {
                              const found = residentsList.find(
                                (r) => r.nik === selectedGraphEntity.data.nik
                              );
                              if (found) {
                                setEditingResident(found);
                                setIsEditingResidentExisting(true);
                                setIsResidentModalOpen(true);
                                setSelectedGraphEntity(null);
                              }
                            }}
                            className="w-full py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Ubah Data Warga Ini</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedSensusForPdf(selectedGraphEntity.data);
                              setSelectedGraphEntity(null);
                            }}
                            className="w-full py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition"
                          >
                            <Printer className="w-4 h-4" />
                            <span>Cetak Lembar Profil KK</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedGraphEntity(null)}
                          className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ================================================================ */}
          {/* TAB: MANAJEMEN KABAR DESA (FULL CRUD SUPABASE)                    */}
          {/* ================================================================ */}
          {activeTab === "berita" && (
            <div className="space-y-6">
              {/* SUB-NAVIGASI INFORMASI DESA */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 flex-wrap">
                <button
                  onClick={() => setActiveTab("berita")}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-[#009388] text-white shadow-xs"
                >
                  <Newspaper className="w-3.5 h-3.5" />
                  <span>Warta Berita ({newsList.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("pengumuman")}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pengumuman Resmi ({announcementList.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("agenda")}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Agenda Kegiatan ({agendaList.length})</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2.5">
                    <Newspaper className="w-6 h-6 text-[#009388]" />
                    <span>Manajemen Kabar & Publikasi Desa</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Kelola warta kegiatan desa, liputan pembangunan, dan pengumuman resmi untuk warga.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/berita"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                  >
                    <span>Lihat Portal Berita</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {canManageNews && (
                    <button
                      onClick={handleOpenCreateNews}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tulis Warta Baru</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    placeholder="Cari judul, penulis, atau kata kunci..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Kategori:</span>
                  <select
                    value={newsCategoryFilter}
                    onChange={(e) => setNewsCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="Pemerintahan">Pemerintahan</option>
                    <option value="Bansos">Bansos</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Pembangunan">Pembangunan</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Ekonomi">Ekonomi</option>
                  </select>
                </div>
              </div>

              {/* News Articles List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">Daftar Publikasi Warta</h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                      {filteredNews.length} artikel
                    </span>
                  </div>
                  <button
                    onClick={fetchAllData}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    title="Segarkan Data"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {filteredNews.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 space-y-2">
                    <Newspaper className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                    <p className="text-slate-800 font-bold text-sm">Belum Ada Artikel Berita</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {newsSearch ? "Tidak ada berita yang cocok dengan kata kunci pencarian." : "Mulai terbitkan warta resmi kegiatan desa sekarang."}
                    </p>
                    {canManageNews && !newsSearch && (
                      <button
                        onClick={handleOpenCreateNews}
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#009388] text-white text-xs font-bold hover:bg-[#007b71] transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tulis Warta Pertama</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredNews.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition group"
                      >
                        <div className="flex items-start gap-4 min-w-0">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/dusun-manis.jpg";
                              }}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0 bg-slate-100 border border-slate-200"
                            />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-400">
                              <Newspaper className="w-6 h-6" />
                            </div>
                          )}

                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                {item.category}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.status === "Terbit"
                                    ? "bg-teal-50 text-teal-700 border border-teal-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {item.status}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {item.date}
                              </span>
                            </div>

                            <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-[#009388] transition">
                              {item.title}
                            </h4>

                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {item.summary}
                            </p>

                            <div className="text-[11px] text-slate-400 pt-0.5">
                              Penulis: <strong className="text-slate-600">{item.author}</strong> ({item.author_role || "Pamong"})
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:self-center flex-shrink-0">
                          <Link
                            href={`/berita/${item.slug}`}
                            target="_blank"
                            className="p-2 rounded-xl text-slate-500 hover:text-[#009388] hover:bg-emerald-50 transition"
                            title="Buka Halaman Berita"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {canManageNews && (
                            <>
                              <button
                                onClick={() => handleOpenEditNews(item)}
                                className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                                title="Edit Berita"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteNews(item)}
                                className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                                title="Hapus Berita (Soft Delete)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB: MANAJEMEN PENGUMUMAN RESMI (FULL CRUD SUPABASE)              */}
          {/* ================================================================ */}
          {activeTab === "pengumuman" && (
            <div className="space-y-6">
              {/* SUB-NAVIGASI INFORMASI DESA */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 flex-wrap">
                <button
                  onClick={() => setActiveTab("berita")}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                >
                  <Newspaper className="w-3.5 h-3.5" />
                  <span>Warta Berita ({newsList.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("pengumuman")}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-[#009388] text-white shadow-xs"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-300" />
                  <span>Pengumuman Resmi ({announcementList.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("agenda")}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Agenda Kegiatan ({agendaList.length})</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2.5">
                    <Bell className="w-6 h-6 text-amber-600" />
                    <span>Manajemen Pengumuman Resmi Balai Desa</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Terbitkan surat edaran Kuwu, jadwal pajak PBB, pengumuman bansos, dan info penting warga.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/pengumuman"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                  >
                    <span>Buka Papan Pengumuman</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {canManagePengumuman && (
                    <button
                      onClick={handleOpenCreateAnnouncement}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Buat Pengumuman Baru</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={announcementSearch}
                    onChange={(e) => setAnnouncementSearch(e.target.value)}
                    placeholder="Cari nomor, judul, atau isi pengumuman..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Kategori:</span>
                  <select
                    value={announcementCategoryFilter}
                    onChange={(e) => setAnnouncementCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="Edaran Kuwu">Edaran Kuwu</option>
                    <option value="Bansos">Bansos</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Pajak PBB">Pajak PBB</option>
                    <option value="Administrasi">Administrasi</option>
                  </select>
                </div>
              </div>

              {/* Announcements List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">Daftar Pengumuman Resmi</h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                      {filteredAnnouncements.length} edaran
                    </span>
                  </div>
                </div>

                {filteredAnnouncements.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 space-y-2">
                    <Bell className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                    <p className="text-slate-800 font-bold text-sm">Belum Ada Pengumuman</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {announcementSearch ? "Tidak ada pengumuman yang cocok dengan filter." : "Mulai buat surat edaran atau pemberitahuan balai desa."}
                    </p>
                    {canManagePengumuman && !announcementSearch && (
                      <button
                        onClick={handleOpenCreateAnnouncement}
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#009388] text-white text-xs font-bold hover:bg-[#007b71] transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Buat Pengumuman Pertama</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredAnnouncements.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition group"
                      >
                        <div className="flex items-start gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-600">
                            <Bell className="w-6 h-6" />
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                                {item.category}
                              </span>
                              {item.is_urgent && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> MENDESAK
                                </span>
                              )}
                              <span className="text-[11px] text-slate-500 font-mono font-bold">
                                No: {item.number}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                • {item.date}
                              </span>
                            </div>

                            <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-[#009388] transition">
                              {item.title}
                            </h4>

                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {item.summary}
                            </p>

                            <div className="text-[11px] text-slate-400 pt-0.5">
                              Waktu/Jam: <span className="font-medium text-slate-600">{item.time || "08.00 - 15.00 WIB"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:self-center flex-shrink-0">
                          <Link
                            href="/pengumuman"
                            target="_blank"
                            className="p-2 rounded-xl text-slate-500 hover:text-[#009388] hover:bg-emerald-50 transition"
                            title="Buka Papan Pengumuman"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {canManagePengumuman && (
                            <>
                              <button
                                onClick={() => handleOpenEditAnnouncement(item)}
                                className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                                title="Edit Pengumuman"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAnnouncement(item)}
                                className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                                title="Hapus Pengumuman"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB: MANAJEMEN AGENDA KEGIATAN DESA (FULL CRUD SUPABASE)          */}
          {/* ================================================================ */}
          {activeTab === "agenda" && (
            <div className="space-y-6">
              {/* SUB-NAVIGASI INFORMASI DESA */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 flex-wrap">
                <button
                  onClick={() => setActiveTab("berita")}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                >
                  <Newspaper className="w-3.5 h-3.5" />
                  <span>Warta Berita ({newsList.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("pengumuman")}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pengumuman Resmi ({announcementList.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("agenda")}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-[#009388] text-white shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Agenda Kegiatan ({agendaList.length})</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2.5">
                    <Calendar className="w-6 h-6 text-[#009388]" />
                    <span>Manajemen Agenda & Kalender Musyawarah</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Jadwalkan musrenbang, posyandu, kerja bakti, dan agenda warga di Dusun Manis, Pahing, dan Wage.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/agenda"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                  >
                    <span>Lihat Kalender Publik</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {canManageAgenda && (
                    <button
                      onClick={handleOpenCreateAgenda}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Agenda Baru</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={agendaSearch}
                    onChange={(e) => setAgendaSearch(e.target.value)}
                    placeholder="Cari judul, lokasi, atau deskripsi agenda..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Wilayah Dusun:</span>
                  <select
                    value={agendaDusunFilter}
                    onChange={(e) => setAgendaDusunFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  >
                    <option value="all">Semua Dusun</option>
                    <option value="Semua Dusun">Semua Dusun</option>
                    <option value="Dusun Manis">Dusun Manis</option>
                    <option value="Dusun Pahing">Dusun Pahing</option>
                    <option value="Dusun Wage">Dusun Wage</option>
                  </select>
                </div>
              </div>

              {/* Agenda List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">Daftar Agenda Kegiatan</h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                      {filteredAgenda.length} agenda
                    </span>
                  </div>
                </div>

                {filteredAgenda.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 space-y-2">
                    <Calendar className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                    <p className="text-slate-800 font-bold text-sm">Belum Ada Agenda</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {agendaSearch ? "Tidak ada agenda yang cocok dengan pencarian." : "Jadwalkan rapat, posyandu, atau musyawarah warga."}
                    </p>
                    {canManageAgenda && !agendaSearch && (
                      <button
                        onClick={handleOpenCreateAgenda}
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#009388] text-white text-xs font-bold hover:bg-[#007b71] transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Agenda Pertama</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredAgenda.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition group"
                      >
                        <div className="flex items-start gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 text-[#009388]">
                            <Calendar className="w-6 h-6" />
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                {item.dusun}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.status === "Akan Datang"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : item.status === "Berlangsung"
                                    ? "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                                    : "bg-slate-100 text-slate-600 border border-slate-200"
                                }`}
                              >
                                {item.status}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {item.date} • {item.time}
                              </span>
                            </div>

                            <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-[#009388] transition">
                              {item.title}
                            </h4>

                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>

                            <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-0.5 flex-wrap">
                              <span className="flex items-center gap-1 text-slate-600 font-medium">
                                <MapPin className="w-3 h-3 text-[#009388]" /> {item.location}
                              </span>
                              <span className="text-slate-400">
                                Penyelenggara: <strong className="text-slate-600">{item.organizer}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:self-center flex-shrink-0">
                          <Link
                            href="/agenda"
                            target="_blank"
                            className="p-2 rounded-xl text-slate-500 hover:text-[#009388] hover:bg-emerald-50 transition"
                            title="Buka Kalender Agenda"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {canManageAgenda && (
                            <>
                              <button
                                onClick={() => handleOpenEditAgenda(item)}
                                className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                                title="Edit Agenda"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAgenda(item)}
                                className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                                title="Hapus Agenda"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 4: KELOLA APBDES 2026 (EDITABLE SUPABASE)                      */}
          {/* ================================================================ */}
          {activeTab === "apbdes" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2.5">
                    <PieChart className="w-6 h-6 text-[#009388]" />
                    <span>Kelola Realisasi APBDes 2026</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Angka penetapan Perdes APBDes 2026 Desa Kadurama (Pagu vs Realisasi 5 Bidang).
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/transparansi/apbdes"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                  >
                    <span>Buka Transparansi Publik</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {canManageApbdes && (
                    <button
                      onClick={handleOpenEditSummary}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Ringkasan Fiskal</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Fiscal Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Total Pendapatan 2026</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                    Rp {Number(apbdesSummary.total_pendapatan || 0).toLocaleString("id-ID")}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Dana Desa, ADD, PADes</div>
                </div>

                <div className="p-4.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Pagu Belanja</div>
                  <div className="text-xl font-bold font-mono text-[#eda50c] mt-1">
                    Rp {Number(apbdesSummary.total_belanja || 0).toLocaleString("id-ID")}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">5 Bidang Penyelenggaraan</div>
                </div>

                <div className="p-4.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Realisasi Berjalan</div>
                  <div className="text-xl font-bold font-mono text-[#009388] mt-1">
                    Rp {Number(apbdesSummary.total_realisasi_belanja || 0).toLocaleString("id-ID")}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-1">
                    Serapan {apbdesSummary.persen_realisasi_belanja}%
                  </div>
                </div>

                <div className="p-4.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Surplus / SiLPA</div>
                  <div className="text-xl font-bold font-mono text-slate-800 mt-1">
                    Rp {Number(apbdesSummary.surplus_defisit || 0).toLocaleString("id-ID")}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Kondisi kas sehat</div>
                </div>
              </div>

              {/* 5 Sectors Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Realisasi 5 Bidang APBDes</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pagu anggaran dan progres belanja masing-masing bidang.
                    </p>
                  </div>
                  <button
                    onClick={fetchAllData}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    title="Segarkan"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {apbdesList.map((sec) => (
                    <div
                      key={sec.id}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-[11px] px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                            Bidang 0{sec.id}
                          </span>
                          <span className="font-bold text-slate-900 text-xs">{sec.nama}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">{sec.keterangan}</div>

                        {/* Mini progress bar */}
                        <div className="mt-2 w-full max-w-md bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#009388] h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(sec.persen || 0, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:justify-end">
                        <div className="text-right">
                          <div className="font-bold font-mono text-xs text-[#009388]">
                            Rp {Number(sec.realisasi).toLocaleString("id-ID")}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Pagu: Rp {Number(sec.pagu).toLocaleString("id-ID")} ({sec.persen}%)
                          </div>
                        </div>

                        {canManageApbdes && (
                          <button
                            onClick={() => handleOpenEditSector(sec)}
                            className="p-2 rounded-xl text-slate-500 hover:text-[#009388] hover:bg-emerald-50 transition"
                            title="Edit Pagu / Realisasi Bidang"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 5: AUDIT LOGS & RIWAYAT AKTIVITAS (Real-time Timeline)       */}
          {/* ================================================================ */}
          {activeTab === "audit" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2.5">
                    <History className="w-6 h-6 text-[#009388]" />
                    <span>Log Aktivitas & Audit Trail Digital</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Rekam jejak transparan: siapa melakukan aksi apa terhadap data desa, terurut dari timestamp terbaru.
                  </p>
                </div>

                <button
                  onClick={fetchAllData}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Segarkan Log</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                {auditLogs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">Belum ada riwayat aktivitas tercatat.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-4 hover:bg-slate-50/70 transition flex items-start gap-3.5">
                        <span
                          className={`mt-0.5 px-2 py-1 rounded text-[10px] font-bold font-mono uppercase ${
                            log.action === "CREATE"
                              ? "bg-emerald-100 text-emerald-800"
                              : log.action === "UPDATE"
                              ? "bg-amber-100 text-amber-800"
                              : log.action === "DELETE"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {log.action}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-800">{log.description}</div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                            <span className="font-bold text-slate-600">{log.actor_name}</span>
                            <span>•</span>
                            <span className="font-mono">{log.actor_email}</span>
                            <span>•</span>
                            <span className="font-mono">
                              {new Date(log.created_at).toLocaleString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })} WIB
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* =================================================================== */}
      {/* MODAL INPUT / EDIT SENSUS KK (DENGAN INPUT FOTO RUMAH & AUTO DESIL)  */}
      {/* =================================================================== */}
      {isSensusModalOpen && editingSensus && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-[#eda50c]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {sensusList.some((s) => s.id === editingSensus.id)
                      ? "Ubah Data Sensus Keluarga"
                      : "Formulir Sensus & SDGs Keluarga Baru"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Survei lapangan Desa Kadurama (Dusun Manis, Pahing, Wage)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSensusModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Bagian 1: Identitas KK */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  1. Identitas Kepala Keluarga
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700">Nomor Kartu Keluarga (KK) <span className="text-red-500">*</span></label>
                      <span className={`text-[10px] font-mono font-bold ${
                        editingSensus.noKk.length === 16 && /^\d+$/.test(editingSensus.noKk)
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}>
                        {editingSensus.noKk.length}/16 Digit
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={16}
                      value={editingSensus.noKk}
                      onChange={(e) => setEditingSensus({ ...editingSensus, noKk: e.target.value.replace(/\D/g, "") })}
                      placeholder="16 digit No KK"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono focus:ring-2 focus:ring-[#009388]"
                    />
                    <div className="mt-1 text-[10px]">
                      {editingSensus.noKk.length === 16 ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> 16 digit angka valid
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          Format 16 digit angka sesuai blanko KK
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700">NIK Kepala Keluarga</label>
                      <span className={`text-[10px] font-mono font-bold ${
                        editingSensus.nikKepalaKeluarga.length === 16 && /^\d+$/.test(editingSensus.nikKepalaKeluarga)
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}>
                        {editingSensus.nikKepalaKeluarga.length}/16 Digit
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={16}
                      value={editingSensus.nikKepalaKeluarga}
                      onChange={(e) => setEditingSensus({ ...editingSensus, nikKepalaKeluarga: e.target.value.replace(/\D/g, "") })}
                      placeholder="16 digit NIK"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono focus:ring-2 focus:ring-[#009388]"
                    />
                    <div className="mt-1 text-[10px]">
                      {editingSensus.nikKepalaKeluarga.length === 16 ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> 16 digit angka valid
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          Format 16 digit angka KTP-el
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap Kepala Keluarga</label>
                    <input
                      type="text"
                      value={editingSensus.namaKepalaKeluarga}
                      onChange={(e) => setEditingSensus({ ...editingSensus, namaKepalaKeluarga: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Dusun</label>
                      <select
                        value={editingSensus.dusun}
                        disabled={currentUser?.role === "kadus"}
                        onChange={(e) => setEditingSensus({ ...editingSensus, dusun: e.target.value as any })}
                        className="w-full px-2 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                      >
                        <option value="Manis">Manis</option>
                        <option value="Pahing">Pahing</option>
                        <option value="Wage">Wage</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">RT</label>
                      <input
                        type="text"
                        value={editingSensus.rt}
                        onChange={(e) => setEditingSensus({ ...editingSensus, rt: e.target.value })}
                        className="w-full px-2 py-2 rounded-xl border border-slate-300 bg-white text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">RW</label>
                      <input
                        type="text"
                        value={editingSensus.rw}
                        onChange={(e) => setEditingSensus({ ...editingSensus, rw: e.target.value })}
                        className="w-full px-2 py-2 rounded-xl border border-slate-300 bg-white text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bagian 2: Foto Rumah Warga (Bukti Fisik RTLH) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#009388]" />
                    <span>2. Foto Fisik Rumah Warga (Verifikasi RTLH)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">Format Gambar / Foto Kamera</span>
                </div>

                {/* Pilihan Preset Placeholder Cepat */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                    Pilih Contoh / Placeholder Wilayah:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "Permanen Layak (Manis)", url: "/dusun-manis.jpg" },
                      { label: "Rumah Dusun (Pahing)", url: "/dusun-pahing.jpg" },
                      { label: "Rumah Sederhana (Wage)", url: "/dusun-wage.jpg" },
                      { label: "Balai Pertemuan", url: "/og-image.jpg" },
                    ].map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setEditingSensus({ ...editingSensus, foto_rumah_url: preset.url })}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                          editingSensus.foto_rumah_url === preset.url
                            ? "bg-[#009388] text-white border-[#009388] shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
                  {/* Upload File atau URL */}
                  <div className="sm:col-span-7 space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        1. Unggah Foto dari Kamera HP / Galeri
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 3 * 1024 * 1024) {
                              alert("Ukuran file foto maksimal 3MB!");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result as string;
                              if (result) {
                                setEditingSensus({ ...editingSensus, foto_rumah_url: result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#009388] file:text-white hover:file:bg-[#007b71] file:cursor-pointer cursor-pointer border border-slate-300 rounded-xl bg-white p-1"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        2. Atau Masukkan URL / Path Gambar
                      </label>
                      <input
                        type="text"
                        value={editingSensus.foto_rumah_url || ""}
                        onChange={(e) => setEditingSensus({ ...editingSensus, foto_rumah_url: e.target.value })}
                        placeholder="/dusun-manis.jpg atau https://..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                      />
                    </div>
                  </div>

                  {/* Pratinjau Foto Standar Rasio 16:9 */}
                  <div className="sm:col-span-5">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-slate-300 bg-slate-200 shadow-inner group">
                      <img
                        src={editingSensus.foto_rumah_url || "/dusun-manis.jpg"}
                        alt="Pratinjau Rumah Sensus"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/dusun-manis.jpg";
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[10px] text-white font-medium truncate">
                          {editingSensus.foto_rumah_url ? "Pratinjau Foto Tampak Depan" : "Placeholder Standar Dusun"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bagian 3: Kondisi Rumah & Sanitasi */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  3. Kondisi Bangunan & Sanitasi
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Material Lantai</label>
                    <select
                      value={editingSensus.lantai}
                      onChange={(e) => setEditingSensus({ ...editingSensus, lantai: e.target.value as any })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Keramik / Granit">Keramik / Granit</option>
                      <option value="Semen Rata">Semen Rata</option>
                      <option value="Tanah">Tanah (Indikator RTLH)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Material Dinding</label>
                    <select
                      value={editingSensus.dinding}
                      onChange={(e) => setEditingSensus({ ...editingSensus, dinding: e.target.value as any })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Tembok Permanen">Tembok Permanen</option>
                      <option value="Setengah Tembok">Setengah Tembok</option>
                      <option value="Bilik Bambu / Papan">Bilik Bambu / Papan (RTLH)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Kondisi Atap</label>
                    <select
                      value={editingSensus.atap}
                      onChange={(e) => setEditingSensus({ ...editingSensus, atap: e.target.value as any })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Genteng Baik">Genteng Baik</option>
                      <option value="Seng / Asbes">Seng / Asbes</option>
                      <option value="Rumbia / Lapuk">Rumbia / Lapuk (RTLH)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Status Fisik</label>
                    <select
                      value={editingSensus.kondisiRumah}
                      onChange={(e) => setEditingSensus({ ...editingSensus, kondisiRumah: e.target.value as any })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                    >
                      <option value="Layak Huni">Layak Huni</option>
                      <option value="RTLH">RTLH (Bedah Rumah)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Sumber Air</label>
                    <select
                      value={editingSensus.sumberAir}
                      onChange={(e) => setEditingSensus({ ...editingSensus, sumberAir: e.target.value as any })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="PDAM / Sumur Bor Bersih">PDAM / Sumur Bor</option>
                      <option value="Sumur Timba Gali">Sumur Timba</option>
                      <option value="Mata Air Terbuka">Mata Air Terbuka</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Status PBB-P2 2026</label>
                    <select
                      value={editingSensus.statusPbb}
                      onChange={(e) => setEditingSensus({ ...editingSensus, statusPbb: e.target.value as any })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                    >
                      <option value="Lunas">Lunas</option>
                      <option value="Belum Lunas">Belum Lunas</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Indikator & Penetapan Desil (Auto vs Manual Apdes) */}
              <div className="p-4 bg-gradient-to-br from-[#e6f7f5] to-emerald-50/50 rounded-2xl border border-[#009388]/30 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#009388]" />
                    <span className="font-bold text-slate-900 text-xs">Penetapan Desil Kesejahteraan</span>
                  </div>
                  {/* Toggle Mode */}
                  <div className="flex items-center p-0.5 bg-white rounded-xl border border-slate-200 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setDesilMode("auto")}
                      className={`px-3 py-1 rounded-lg transition ${
                        desilMode === "auto"
                          ? "bg-[#009388] text-white shadow-2xs font-bold"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Otomatis Sistem
                    </button>
                    <button
                      type="button"
                      onClick={() => setDesilMode("manual")}
                      className={`px-3 py-1 rounded-lg transition ${
                        desilMode === "manual"
                          ? "bg-[#009388] text-white shadow-2xs font-bold"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Penetapan Pemdes
                    </button>
                  </div>
                </div>

                {desilMode === "auto" ? (
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#009388]/20 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Kalkulasi Otomatis Algoritma:</span>
                      <span className="font-bold text-slate-800">
                        {(() => {
                          const d = calculateDesil(
                            editingSensus.dinding,
                            editingSensus.lantai,
                            editingSensus.penghasilanBulanan,
                            editingSensus.luasLantai,
                            editingSensus.jumlahAnggota
                          );
                          return d === 1
                            ? "Sangat Miskin / Desil Ekstrem"
                            : d === 2
                            ? "Keluarga Miskin"
                            : d === 3
                            ? "Hampir Miskin / Rentan"
                            : "Mampu / Sejahtera";
                        })()}
                      </span>
                    </div>
                    <strong className="px-3.5 py-1.5 rounded-xl bg-[#009388] text-white text-xs font-extrabold shadow-xs">
                      Desil{" "}
                      {calculateDesil(
                        editingSensus.dinding,
                        editingSensus.lantai,
                        editingSensus.penghasilanBulanan,
                        editingSensus.luasLantai,
                        editingSensus.jumlahAnggota
                      )}
                    </strong>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-600">
                      Pilih klasifikasi desil berdasarkan hasil musyawarah desa (Musdes) atau verifikasi faktual aparatur:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { val: 1, label: "Desil 1", desc: "Sangat Miskin (Ekstrem)", color: "border-red-500 bg-red-50 text-red-900" },
                        { val: 2, label: "Desil 2", desc: "Keluarga Miskin", color: "border-amber-500 bg-amber-50 text-amber-900" },
                        { val: 3, label: "Desil 3", desc: "Hampir Miskin", color: "border-blue-500 bg-blue-50 text-blue-900" },
                        { val: 4, label: "Desil 4", desc: "Mampu / Sejahtera", color: "border-emerald-500 bg-emerald-50 text-emerald-900" },
                      ].map((d) => (
                        <button
                          key={d.val}
                          type="button"
                          onClick={() => setManualDesil(d.val)}
                          className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                            manualDesil === d.val
                              ? `${d.color} ring-2 ring-[#009388] shadow-xs font-bold`
                              : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <span className="text-xs font-extrabold">{d.label}</span>
                          <span className="text-[10px] text-slate-500 mt-0.5">{d.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsSensusModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
              >
                Batal
              </button>
              <button
                onClick={handleSaveSensus}
                className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Hasil Sensus KK</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL INPUT / EDIT DATA WARGA (SESUAI SKEMA DATABASE RESIDENTS)      */}
      {/* =================================================================== */}
      {isResidentModalOpen && editingResident && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {isEditingResidentExisting ? "Ubah Data Warga Kependudukan" : "Pendaftaran Warga Baru"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Master Kependudukan SIAK • Desa Kadurama, Kec. Ciawigebang
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsResidentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-5 text-xs">
              {/* Bagian 1: Identitas Dokumen */}
              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-[#009388]" />
                  <span>1. Dokumen Identitas Kependudukan</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-700">
                        NIK (16 Digit) <span className="text-red-500">*</span>
                        {isEditingResidentExisting && (
                          <span className="ml-1.5 text-[9px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded">
                            Terkunci (Primary Key)
                          </span>
                        )}
                      </label>
                      <span className={`text-[10px] font-mono font-bold ${
                        editingResident.nik.length === 16 && /^\d+$/.test(editingResident.nik)
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}>
                        {editingResident.nik.length}/16 Digit
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={16}
                      disabled={isEditingResidentExisting}
                      value={editingResident.nik}
                      onChange={(e) => setEditingResident({ ...editingResident, nik: e.target.value.replace(/\D/g, "") })}
                      placeholder="320815..."
                      className={`w-full px-3 py-2 rounded-xl border font-mono ${
                        isEditingResidentExisting
                          ? "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                          : "bg-white border-slate-300 focus:ring-2 focus:ring-[#009388]"
                      }`}
                    />
                    <div className="mt-1 text-[10px]">
                      {editingResident.nik.length === 16 ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> 16 digit angka valid (Standar KTP-el)
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          Wajib 16 digit angka sesuai fisik KTP / Akta
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-700">
                        Nomor Kartu Keluarga (No. KK) <span className="text-red-500">*</span>
                      </label>
                      <span className={`text-[10px] font-mono font-bold ${
                        editingResident.noKk.length === 16 && /^\d+$/.test(editingResident.noKk)
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}>
                        {editingResident.noKk.length}/16 Digit
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={16}
                      value={editingResident.noKk}
                      onChange={(e) => setEditingResident({ ...editingResident, noKk: e.target.value.replace(/\D/g, "") })}
                      placeholder="320815..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono focus:ring-2 focus:ring-[#009388]"
                    />
                    <div className="mt-1 text-[10px]">
                      {editingResident.noKk.length === 16 ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> 16 digit angka valid
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          Wajib 16 digit angka sesuai blanko KK
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nama Lengkap (Sesuai KTP / Akta Lahir) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingResident.nama}
                      onChange={(e) => setEditingResident({ ...editingResident, nama: e.target.value })}
                      placeholder="Nama lengkap warga..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 focus:ring-2 focus:ring-[#009388]"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 2: Data Kelahiran & Demografi */}
              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-[#009388]" />
                  <span>2. Data Kelahiran & Demografi</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Tempat, Tanggal Lahir (TTL)
                    </label>
                    <input
                      type="text"
                      value={editingResident.ttl}
                      onChange={(e) => setEditingResident({ ...editingResident, ttl: e.target.value })}
                      placeholder="Kuningan, 15-08-1990"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#009388]"
                    />
                    <span className="text-[9px] text-slate-400 mt-0.5 block">Format: Kota, DD-MM-YYYY</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Jenis Kelamin
                    </label>
                    <select
                      value={editingResident.jenisKelamin}
                      onChange={(e) => setEditingResident({ ...editingResident, jenisKelamin: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#009388]"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Agama
                    </label>
                    <select
                      value={editingResident.agama}
                      onChange={(e) => setEditingResident({ ...editingResident, agama: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#009388]"
                    >
                      <option value="Islam">Islam</option>
                      <option value="Kristen">Kristen Protestan</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddha">Buddha</option>
                      <option value="Konghucu">Konghucu</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bagian 3: Keluarga & Profesi */}
              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  <UserCheck className="w-3.5 h-3.5 text-[#009388]" />
                  <span>3. Hubungan Keluarga, Pernikahan & Pekerjaan</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Hubungan Keluarga
                    </label>
                    <select
                      value={editingResident.hubunganKeluarga}
                      onChange={(e) => setEditingResident({ ...editingResident, hubunganKeluarga: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#009388]"
                    >
                      <option value="Kepala Keluarga">Kepala Keluarga</option>
                      <option value="Istri">Istri</option>
                      <option value="Anak">Anak</option>
                      <option value="Orang Tua">Orang Tua</option>
                      <option value="Mertua">Mertua</option>
                      <option value="Famili Lain">Famili Lain</option>
                      <option value="Anggota Lain">Anggota Lain</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Status Perkawinan
                    </label>
                    <select
                      value={editingResident.statusPerkawinan}
                      onChange={(e) => setEditingResident({ ...editingResident, statusPerkawinan: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#009388]"
                    >
                      <option value="Kawin">Kawin</option>
                      <option value="Belum Kawin">Belum Kawin</option>
                      <option value="Cerai Hidup">Cerai Hidup</option>
                      <option value="Cerai Mati">Cerai Mati</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Pekerjaan / Mata Pencaharian
                    </label>
                    <input
                      type="text"
                      list="listPekerjaan"
                      value={editingResident.pekerjaan}
                      onChange={(e) => setEditingResident({ ...editingResident, pekerjaan: e.target.value })}
                      placeholder="Petani / Wiraswasta..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#009388]"
                    />
                    <datalist id="listPekerjaan">
                      <option value="Petani / Pekebun" />
                      <option value="Wiraswasta" />
                      <option value="Pedagang" />
                      <option value="Buruh Harian Lepas" />
                      <option value="Karyawan Swasta" />
                      <option value="Pegawai Negeri Sipil (PNS)" />
                      <option value="Guru / Dosen" />
                      <option value="Pelajar / Mahasiswa" />
                      <option value="Mengurus Rumah Tangga" />
                      <option value="Pensiunan" />
                      <option value="Belum / Tidak Bekerja" />
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Bagian 4: Domisili & Wilayah */}
              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-[#009388]" />
                  <span>4. Wilayah Domisili (Dusun & RT/RW)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Dusun
                    </label>
                    <select
                      value={editingResident.dusun}
                      disabled={currentUser?.role === "kadus"}
                      onChange={(e) => setEditingResident({ ...editingResident, dusun: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-[#009388]"
                    >
                      <option value="Manis">Dusun Manis</option>
                      <option value="Pahing">Dusun Pahing</option>
                      <option value="Wage">Dusun Wage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">RT</label>
                    <input
                      type="text"
                      maxLength={3}
                      value={editingResident.rt}
                      onChange={(e) => setEditingResident({ ...editingResident, rt: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-center font-bold font-mono focus:ring-2 focus:ring-[#009388]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">RW</label>
                    <input
                      type="text"
                      maxLength={3}
                      value={editingResident.rw}
                      onChange={(e) => setEditingResident({ ...editingResident, rw: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-center font-bold font-mono focus:ring-2 focus:ring-[#009388]"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Alamat Lengkap / Blok Jalan
                    </label>
                    <input
                      type="text"
                      value={editingResident.alamat}
                      onChange={(e) => setEditingResident({ ...editingResident, alamat: e.target.value })}
                      placeholder="Contoh: Jl. Desa Kadurama Blok Manis RT 01/RW 01"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#009388]"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 5: Status Administrasi & Sinkronisasi */}
              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#009388]" />
                  <span>5. Status Administrasi & Sinkronisasi</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Status Warga
                    </label>
                    <select
                      value={editingResident.status}
                      onChange={(e) => setEditingResident({ ...editingResident, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#009388]"
                    >
                      <option value="Warga Tetap">Warga Tetap</option>
                      <option value="Warga Sementara">Warga Sementara / Kontrak</option>
                      <option value="Pindah">Pindah Keluar</option>
                      <option value="Meninggal">Meninggal Dunia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Status Sinkronisasi SIAK
                    </label>
                    <select
                      value={editingResident.syncStatus}
                      onChange={(e) => setEditingResident({ ...editingResident, syncStatus: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#009388]"
                    >
                      <option value="Tersinkronisasi">Tersinkronisasi (SIAK)</option>
                      <option value="Perlu Sinkronisasi">Perlu Sinkronisasi</option>
                      <option value="Diperbarui Internal">Diperbarui Internal</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 italic">
                * Tanda bintang menandakan isian identitas wajib diisi.
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsResidentModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveResident}
                  className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Data Warga</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL CETAK LEMBAR PROFIL KK RESMI                                  */}
      {/* =================================================================== */}
      {selectedSensusForPdf && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Printer className="w-5 h-5 text-[#009388]" />
                <h3 className="font-bold text-base text-slate-900">Lembar Profil Kesejahteraan KK</h3>
              </div>
              <button
                onClick={() => setSelectedSensusForPdf(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 p-6 border border-slate-200 rounded-2xl bg-white text-xs space-y-4">
              <div className="text-center border-b pb-3 border-slate-200">
                <div className="font-extrabold text-sm uppercase text-slate-900">
                  PEMERINTAH KABUPATEN KUNINGAN
                </div>
                <div className="font-bold text-xs uppercase text-[#003733]">
                  KECAMATAN CIAWIGEBANG • DESA KADURAMA
                </div>
                <div className="text-[10px] text-slate-500">LEMBAR VERIFIKASI SENSUS DESIL DAN PROFIL KELUARGA</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500">Nomor Kartu Keluarga:</span>
                  <div className="font-mono font-bold text-slate-900">{formatMaskedNik(selectedSensusForPdf.noKk, maskSensitiveData)}</div>
                </div>
                <div>
                  <span className="text-slate-500">Nama Kepala Keluarga:</span>
                  <div className="font-bold text-slate-900">{selectedSensusForPdf.namaKepalaKeluarga}</div>
                </div>
                <div>
                  <span className="text-slate-500">Wilayah:</span>
                  <div className="font-bold text-slate-800">
                    Dusun {selectedSensusForPdf.dusun}, RT {selectedSensusForPdf.rt} / RW {selectedSensusForPdf.rw}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Tingkat Desil:</span>
                  <div className="font-bold text-[#009388]">Desil {selectedSensusForPdf.desil}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span>Status PBB-P2 2026: <strong>{selectedSensusForPdf.statusPbb}</strong></span>
                <span>Fisik Rumah: <strong>{selectedSensusForPdf.kondisiRumah}</strong></span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedSensusForPdf(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-[#003733] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#002825]"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar A4</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL IMPOR EXCEL DUKCAPIL SIAK                                     */}
      {/* =================================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-950">
                    Impor Otomatis Kependudukan & Sensus KK (Dukcapil)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mendukung berkas spreadsheet SIAK Dukcapil Kuningan (format 34 kolom: NO_KK, NIK, NAMA, SHDK, JK, dll.)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="/template_kependudukan_kadurama.xlsx"
                  download="template_kependudukan_kadurama.xlsx"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 transition"
                  title="Unduh file contoh format SIAK Dukcapil"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Unduh Contoh (.xlsx)</span>
                  <span className="sm:hidden">Contoh</span>
                </a>
                <button
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportError("");
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto py-5 space-y-5 flex-1 pr-1">
              {/* Opsi & Konfigurasi Wilayah */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    1. Konfigurasi Wilayah Target & Fallback
                  </span>
                  {currentUser?.role === "kadus" && currentUser.dusun && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      Otoritas Terkunci: Dusun {currentUser.dusun}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Dusun Target
                    </label>
                    <select
                      value={importDefaultDusun}
                      disabled={currentUser?.role === "kadus" && currentUser.dusun !== "all"}
                      onChange={(e) => setImportDefaultDusun(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-800 disabled:bg-slate-100 disabled:text-slate-500"
                    >
                      <option value="Wage">Dusun Wage</option>
                      <option value="Manis">Dusun Manis</option>
                      <option value="Pahing">Dusun Pahing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      RT Fallback (Bila kosong)
                    </label>
                    <input
                      type="text"
                      value={importDefaultRt}
                      onChange={(e) => setImportDefaultRt(e.target.value)}
                      placeholder="Contoh: 01"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 text-center font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      RW Fallback (Bila kosong)
                    </label>
                    <input
                      type="text"
                      value={importDefaultRw}
                      onChange={(e) => setImportDefaultRw(e.target.value)}
                      placeholder="Contoh: 01"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 text-center font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="chkCreateSensusKK"
                    checked={importCreateSensusKK}
                    onChange={(e) => setImportCreateSensusKK(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-[#009388] focus:ring-[#009388]"
                  />
                  <label htmlFor="chkCreateSensusKK" className="text-xs text-slate-700 select-none">
                    <span className="font-bold text-slate-900">
                      Otomatisasi Sensus KK:
                    </span>{" "}
                    Setiap baris dengan hubungan Kepala Keluarga (SHDK) otomatis didaftarkan sebagai kartu keluarga di tabel sensus_kk desa.
                  </label>
                </div>
              </div>

              {/* Upload Drop Area */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                  2. Pilih Berkas Spreadsheet Dukcapil (.xlsx / .xls / .csv)
                </label>
                <label
                  htmlFor="fileExcelInput"
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition text-center ${
                    importFileName
                      ? "border-emerald-500 bg-emerald-50/30"
                      : "border-slate-300 hover:border-[#009388] hover:bg-slate-50"
                  }`}
                >
                  <input
                    id="fileExcelInput"
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {importFileName ? (
                    <div className="space-y-1">
                      <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-sm text-slate-900">{importFileName}</div>
                      <p className="text-xs text-emerald-700 font-medium">
                        {importParsedResidents.length} data warga & {importParsedSensus.length} KK terdeteksi. Klik untuk mengganti berkas.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-sm text-slate-800">
                        Klik atau seret file spreadsheet kemari
                      </div>
                      <p className="text-xs text-slate-400">
                        Mendukung .xlsx, .xls, .csv (format SIAK Dukcapil atau Buku Induk Desa)
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Alert Error */}
              {importError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Preview Tabel */}
              {importParsedResidents.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setImportPreviewTab("warga")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          importPreviewTab === "warga"
                            ? "bg-[#009388] text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Pratinjau Warga ({importParsedResidents.length})
                      </button>
                      {importCreateSensusKK && (
                        <button
                          type="button"
                          onClick={() => setImportPreviewTab("kk")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            importPreviewTab === "kk"
                              ? "bg-[#009388] text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Pratinjau Profil KK ({importParsedSensus.length})
                        </button>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Menampilkan sampel 10 data pertama
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
                    {importPreviewTab === "warga" ? (
                      <table className="w-full text-left text-[11px] text-slate-700">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] sticky top-0">
                          <tr>
                            <th className="py-2.5 px-3">NIK</th>
                            <th className="py-2.5 px-3">No KK</th>
                            <th className="py-2.5 px-3">Nama</th>
                            <th className="py-2.5 px-3">JK</th>
                            <th className="py-2.5 px-3">Hub. Keluarga</th>
                            <th className="py-2.5 px-3">Dusun / RT / RW</th>
                            <th className="py-2.5 px-3">Pekerjaan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {importParsedResidents.slice(0, 10).map((r, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-mono font-bold text-slate-900">{formatMaskedNik(r.nik, maskSensitiveData)}</td>
                              <td className="py-2 px-3 font-mono text-slate-500">{formatMaskedNik(r.noKk, maskSensitiveData)}</td>
                              <td className="py-2 px-3 font-semibold text-slate-800">{r.nama}</td>
                              <td className="py-2 px-3">{r.jenisKelamin === "Laki-laki" ? "L" : "P"}</td>
                              <td className="py-2 px-3">{r.hubunganKeluarga}</td>
                              <td className="py-2 px-3">{r.dusun} RT {r.rt}/{r.rw}</td>
                              <td className="py-2 px-3 text-slate-500">{r.pekerjaan}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <table className="w-full text-left text-[11px] text-slate-700">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] sticky top-0">
                          <tr>
                            <th className="py-2.5 px-3">No KK</th>
                            <th className="py-2.5 px-3">Nama Kepala Keluarga</th>
                            <th className="py-2.5 px-3">NIK Kepala Keluarga</th>
                            <th className="py-2.5 px-3">Dusun / RT / RW</th>
                            <th className="py-2.5 px-3">Anggota</th>
                            <th className="py-2.5 px-3">Desil Awal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {importParsedSensus.slice(0, 10).map((s, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-mono font-bold text-slate-900">{formatMaskedNik(s.no_kk, maskSensitiveData)}</td>
                              <td className="py-2 px-3 font-semibold text-slate-800">{s.nama_kepala_keluarga}</td>
                              <td className="py-2 px-3 font-mono text-slate-500">{formatMaskedNik(s.nik_kepala_keluarga, maskSensitiveData)}</td>
                              <td className="py-2 px-3">{s.dusun} RT {s.rt}/{s.rw}</td>
                              <td className="py-2 px-3">{s.jumlah_anggota} Jiwa</td>
                              <td className="py-2 px-3 font-bold text-[#009388]">Desil {s.desil}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                {importParsedResidents.length > 0 ? (
                  <span>
                    Siap mengimpor <strong className="text-slate-800">{importParsedResidents.length}</strong> warga &{" "}
                    <strong className="text-[#009388]">{importCreateSensusKK ? importParsedSensus.length : 0}</strong> profil KK ke Supabase.
                  </span>
                ) : (
                  <span>Unggah berkas untuk melihat kalkulasi & pratinjau data.</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={importParsedResidents.length === 0 || isProcessingImport}
                  onClick={handleExecuteImport}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm flex items-center gap-2 transition"
                >
                  {isProcessingImport ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan ke Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4" />
                      <span>Jalankan Impor Otomatis</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL UBAH KATA SANDI RESMI                                         */}
      {/* =================================================================== */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shrink-0">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-950">Ganti Kata Sandi Akun</h3>
                  <p className="text-xs text-slate-500">{currentUser?.nama}</p>
                </div>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="mt-4 space-y-3.5 text-xs">
              {passwordForm.error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{passwordForm.error}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kata Sandi Saat Ini
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, oldPassword: e.target.value, error: "" })
                  }
                  placeholder="Masukkan kata sandi lama..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-xs focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kata Sandi Baru (Min. 6 Karakter)
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value, error: "" })
                  }
                  placeholder="Masukkan kata sandi baru..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-xs focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Ulangi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value, error: "" })
                  }
                  placeholder="Ulangi kata sandi baru..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-xs focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={passwordForm.isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] disabled:bg-slate-300 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  {passwordForm.isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Simpan Sandi Baru</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL BERITA / WARTA DESA (CREATE / EDIT)                           */}
      {/* =================================================================== */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-950">
                    {editingNews ? "Edit Warta / Publikasi Desa" : "Tulis Warta Baru Desa"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data tersimpan langsung ke Supabase dan otomatis tampil di portal publik warga.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="overflow-y-auto py-5 space-y-4 flex-1 pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Artikel Warta <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  placeholder="Contoh: Musyawarah Rencana Kerja Desa Kadurama 2027..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Berita
                  </label>
                  <select
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  >
                    <option value="Pemerintahan">Pemerintahan</option>
                    <option value="Bansos">Bansos</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Pembangunan">Pembangunan</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Ekonomi">Ekonomi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status Publikasi
                  </label>
                  <select
                    value={newsForm.status}
                    onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value as "Terbit" | "Draf" })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  >
                    <option value="Terbit">Terbit (Tampil di Website Publik)</option>
                    <option value="Draf">Draf (Disimpan Internal)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Penulis
                  </label>
                  <input
                    type="text"
                    value={newsForm.author}
                    onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                    placeholder="Nama penulis..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jabatan / Role Penulis
                  </label>
                  <input
                    type="text"
                    value={newsForm.author_role}
                    onChange={(e) => setNewsForm({ ...newsForm, author_role: e.target.value })}
                    placeholder="Sekretaris Desa / Kasi Kesejahteraan..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  />
                </div>
              </div>

              {/* FOTO UNGGULAN & PREVIEW DENGAN RASIO BAKU 16:9 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-800">
                      Foto Unggulan Warta
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Upload foto, pilih preset resmi desa, atau masukkan link (rasio diseragamkan 16:9 lewat kode).
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold w-fit">
                    <CheckCircle2 className="w-3 h-3" /> Rasio 16:9 Baku
                  </span>
                </div>

                {/* Preset Tombol Cepat Foto Desa */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500 font-medium mr-1">Foto Cepat:</span>
                  {[
                    { label: "Dusun Manis", url: "/dusun-manis.jpg" },
                    { label: "Dusun Pahing", url: "/dusun-pahing.jpg" },
                    { label: "Dusun Wage", url: "/dusun-wage.jpg" },
                    { label: "Banner Pemdes", url: "/og-image.jpg" },
                  ].map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setNewsForm({ ...newsForm, image_url: preset.url })}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                        newsForm.image_url === preset.url
                          ? "bg-[#009388] text-white border-[#009388] shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
                  {/* Pilihan Upload atau URL */}
                  <div className="sm:col-span-7 space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        1. Upload Foto dari HP / Komputer
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 3 * 1024 * 1024) {
                              alert("Ukuran file foto maksimal 3MB!");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result as string;
                              if (result) {
                                setNewsForm({ ...newsForm, image_url: result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#009388] file:text-white hover:file:bg-[#007b71] file:cursor-pointer cursor-pointer border border-slate-300 rounded-xl bg-white p-1"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        2. Atau Masukkan URL / Path Foto
                      </label>
                      <input
                        type="text"
                        value={newsForm.image_url}
                        onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })}
                        placeholder="/dusun-manis.jpg atau https://..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388] bg-white"
                      />
                    </div>
                  </div>

                  {/* Pratinjau Foto dengan Frame Standar 16:9 */}
                  <div className="sm:col-span-5">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-slate-300 bg-slate-200 shadow-inner group">
                      <img
                        src={newsForm.image_url || "/dusun-manis.jpg"}
                        alt="Pratinjau Foto Warta"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/dusun-manis.jpg";
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[10px] text-white font-medium truncate">
                          Pratinjau Rasio Standar 16:9
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tagar (Dipisah Koma)
                </label>
                <input
                  type="text"
                  value={newsForm.tags}
                  onChange={(e) => setNewsForm({ ...newsForm, tags: e.target.value })}
                  placeholder="Kadurama, Musrenbang, 2027..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ringkasan Berita (Lead / Excerpt) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={newsForm.summary}
                  onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                  placeholder="Ringkasan singkat 1-2 kalimat mengenai pokok berita..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Lengkap Artikel (Pisahkan Antar Paragraf dengan Baris Kosong)
                </label>
                <textarea
                  rows={6}
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  placeholder="Paragraf 1...&#10;&#10;Paragraf 2...&#10;&#10;Paragraf 3..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388] font-sans"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNews}
                  className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] disabled:bg-slate-300 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  {isSubmittingNews ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan ke Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingNews ? "Simpan Perubahan" : "Terbitkan Warta"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL PENGUMUMAN RESMI DESA (CREATE / EDIT)                         */}
      {/* =================================================================== */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-950">
                    {editingAnnouncement ? "Edit Pengumuman Resmi" : "Buat Pengumuman Baru"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Surat edaran, pengumuman bansos, jadwal PBB, atau informasi darurat warga.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="py-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Registrasi / Edaran <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={announcementForm.number}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, number: e.target.value })}
                    placeholder="140/084/Pemdes/IX/2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Pengumuman
                  </label>
                  <select
                    value={announcementForm.category}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  >
                    <option value="Edaran Kuwu">Edaran Kuwu</option>
                    <option value="Bansos">Bansos</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Pajak PBB">Pajak PBB</option>
                    <option value="Administrasi">Administrasi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Pengumuman <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  placeholder="Contoh: Jadwal Penyaluran Bantuan Pangan Beras Tahap IV..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Pengumuman
                  </label>
                  <input
                    type="text"
                    value={announcementForm.date}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, date: e.target.value })}
                    placeholder="17 September 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Waktu / Jam Layanan
                  </label>
                  <input
                    type="text"
                    value={announcementForm.time}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, time: e.target.value })}
                    placeholder="08.00 - 15.00 WIB"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi / Uraian Pengumuman <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={announcementForm.summary}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, summary: e.target.value })}
                  placeholder="Tuliskan isi pengumuman atau instruksi bagi warga secara lengkap dan jelas..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              {/* Status Mendesak Checkbox */}
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_urgent_checkbox"
                  checked={announcementForm.is_urgent}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, is_urgent: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
                />
                <label htmlFor="is_urgent_checkbox" className="text-xs text-slate-800 font-medium cursor-pointer">
                  Tandai sebagai <strong className="text-amber-800 font-bold">Pengumuman Mendesak / Penting</strong> (badge merah di portal publik)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAnnouncementModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAnnouncement}
                  className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] disabled:bg-slate-300 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  {isSubmittingAnnouncement ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingAnnouncement ? "Simpan Perubahan" : "Terbitkan Pengumuman"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL AGENDA KEGIATAN DESA (CREATE / EDIT)                          */}
      {/* =================================================================== */}
      {isAgendaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#009388] flex items-center justify-center border border-emerald-200">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-950">
                    {editingAgenda ? "Edit Agenda Kegiatan" : "Tambah Agenda Kegiatan Baru"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Musyawarah desa, posyandu, gotong royong, atau pertemuan warga per dusun.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAgendaModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAgenda} className="py-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama / Judul Agenda Kegiatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={agendaForm.title}
                  onChange={(e) => setAgendaForm({ ...agendaForm, title: e.target.value })}
                  placeholder="Contoh: Musyawarah Dusun (Musdus) Perencanaan RKPDes 2027..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Wilayah Dusun
                  </label>
                  <select
                    value={agendaForm.dusun}
                    onChange={(e) => setAgendaForm({ ...agendaForm, dusun: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  >
                    <option value="Semua Dusun">Semua Dusun (Tingkat Desa)</option>
                    <option value="Dusun Manis">Dusun Manis</option>
                    <option value="Dusun Pahing">Dusun Pahing</option>
                    <option value="Dusun Wage">Dusun Wage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status Pelaksanaan
                  </label>
                  <select
                    value={agendaForm.status}
                    onChange={(e) => setAgendaForm({ ...agendaForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  >
                    <option value="Akan Datang">Akan Datang</option>
                    <option value="Berlangsung">Sedang Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={agendaForm.date}
                    onChange={(e) => setAgendaForm({ ...agendaForm, date: e.target.value })}
                    placeholder="25 September 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Waktu / Jam
                  </label>
                  <input
                    type="text"
                    value={agendaForm.time}
                    onChange={(e) => setAgendaForm({ ...agendaForm, time: e.target.value })}
                    placeholder="09.00 - 11.30 WIB"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tempat / Lokasi
                  </label>
                  <input
                    type="text"
                    value={agendaForm.location}
                    onChange={(e) => setAgendaForm({ ...agendaForm, location: e.target.value })}
                    placeholder="Balai Desa Kadurama / Pos Balai Dusun..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Penyelenggara
                  </label>
                  <input
                    type="text"
                    value={agendaForm.organizer}
                    onChange={(e) => setAgendaForm({ ...agendaForm, organizer: e.target.value })}
                    placeholder="Pemerintah Desa / Kepala Dusun & BPD..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Uraian / Keterangan Kegiatan <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={agendaForm.description}
                  onChange={(e) => setAgendaForm({ ...agendaForm, description: e.target.value })}
                  placeholder="Rincian pembahasan rapat, perlengkapan yang perlu dibawa warga, atau tujuan musyawarah..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAgendaModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAgenda}
                  className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] disabled:bg-slate-300 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  {isSubmittingAgenda ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingAgenda ? "Simpan Perubahan" : "Jadwalkan Agenda"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL EDIT RINGKASAN FISKAL APBDES 2026                             */}
      {/* =================================================================== */}
      {isEditSummaryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-950">
                    Edit Ringkasan Fiskal APBDes 2026
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Perbarui angka pagu pendapatan, pagu belanja, dan serapan berjalan desa.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditSummaryModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveApbdesSummary} className="py-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Pendapatan Desa (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={summaryForm.total_pendapatan || 0}
                  onChange={(e) => setSummaryForm({ ...summaryForm, total_pendapatan: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Pagu Belanja Desa (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={summaryForm.total_belanja || 0}
                  onChange={(e) => setSummaryForm({ ...summaryForm, total_belanja: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Realisasi Belanja Berjalan (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={summaryForm.total_realisasi_belanja || 0}
                  onChange={(e) => setSummaryForm({ ...summaryForm, total_realisasi_belanja: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  SiLPA Tahun Lalu (Rp)
                </label>
                <input
                  type="number"
                  value={summaryForm.silpa_tahun_lalu || 0}
                  onChange={(e) => setSummaryForm({ ...summaryForm, silpa_tahun_lalu: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              {/* Kalkulasi Otomatis */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Surplus / Defisit:</span>
                  <span className="font-bold text-emerald-700">
                    Rp {(Number(summaryForm.total_pendapatan || 0) - Number(summaryForm.total_belanja || 0)).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Persentase Serapan Belanja:</span>
                  <span className="font-bold text-[#009388]">
                    {Number(summaryForm.total_belanja || 0) > 0
                      ? ((Number(summaryForm.total_realisasi_belanja || 0) / Number(summaryForm.total_belanja || 1)) * 100).toFixed(1)
                      : "0"}%
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditSummaryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingApbdes}
                  className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] disabled:bg-slate-300 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  {isSubmittingApbdes ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Simpan Perubahan Fiskal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL EDIT BIDANG APBDES 2026                                       */}
      {/* =================================================================== */}
      {isEditSectorModalOpen && editingSector && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-950">
                    Edit Bidang 0{editingSector.id}: {editingSector.nama}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Perbarui pagu dan realisasi anggaran bidang ini.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditSectorModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveApbdesSector} className="py-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Bidang
                </label>
                <input
                  type="text"
                  required
                  value={sectorForm.nama}
                  onChange={(e) => setSectorForm({ ...sectorForm, nama: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pagu Anggaran (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={sectorForm.pagu}
                  onChange={(e) => setSectorForm({ ...sectorForm, pagu: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Realisasi Anggaran (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={sectorForm.realisasi}
                  onChange={(e) => setSectorForm({ ...sectorForm, realisasi: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keterangan Singkat
                </label>
                <textarea
                  rows={2}
                  value={sectorForm.keterangan}
                  onChange={(e) => setSectorForm({ ...sectorForm, keterangan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#009388]"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center font-mono">
                <span className="text-slate-500">Persentase Serapan Bidang:</span>
                <span className="font-bold text-[#009388]">
                  {sectorForm.pagu > 0 ? ((sectorForm.realisasi / sectorForm.pagu) * 100).toFixed(1) : "0"}%
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditSectorModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingApbdes}
                  className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] disabled:bg-slate-300 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  {isSubmittingApbdes ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Simpan Perubahan Bidang</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL KONFIRMASI ARSIP & SOFT DELETE DATA (ALASAN RESMI)            */}
      {/* =================================================================== */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Konfirmasi Pengarsipan / Hapus Data
                </h3>
                <p className="text-xs text-slate-500">
                  {deleteModal.type === "sensus"
                    ? "Arsip data Sensus Kartu Keluarga ke status nonaktif"
                    : "Arsip data Kependudukan Warga ke status nonaktif"}
                </p>
              </div>
            </div>

            {/* Target Card Info */}
            <div className="my-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              {deleteModal.type === "sensus" && deleteModal.sensusItem ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nomor KK:</span>
                    <span className="font-mono font-bold text-slate-800">{formatMaskedNik(deleteModal.sensusItem.noKk, maskSensitiveData)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kepala Keluarga:</span>
                    <span className="font-bold text-slate-900">{deleteModal.sensusItem.namaKepalaKeluarga}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Wilayah:</span>
                    <span className="font-semibold text-slate-700">
                      Dusun {deleteModal.sensusItem.dusun} RT {deleteModal.sensusItem.rt} / RW {deleteModal.sensusItem.rw}
                    </span>
                  </div>
                </>
              ) : deleteModal.residentItem ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">NIK Warga:</span>
                    <span className="font-mono font-bold text-slate-800">{formatMaskedNik(deleteModal.residentItem.nik, maskSensitiveData)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nama Lengkap:</span>
                    <span className="font-bold text-slate-900">{deleteModal.residentItem.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nomor KK / Wilayah:</span>
                    <span className="font-semibold text-slate-700">
                      KK: {formatMaskedNik(deleteModal.residentItem.noKk, maskSensitiveData)} (Dusun {deleteModal.residentItem.dusun})
                    </span>
                  </div>
                </>
              ) : null}
            </div>

            {/* Form Alasan */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Pilih Alasan Penghapusan / Pengarsipan <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {(deleteModal.type === "resident"
                    ? [
                        { id: "Meninggal Dunia", label: "Meninggal Dunia (Surat/Akta Kematian)" },
                        { id: "Pindah Domisili / Keluar Desa", label: "Pindah Domisili / Keluar Desa (SKPWNI)" },
                        { id: "Pecah KK / Perubahan Administrasi", label: "Perubahan Administrasi / Pecah KK" },
                        { id: "Kesalahan Input Data / Duplikasi", label: "Kesalahan Input Data / Duplikasi" },
                        { id: "Lainnya", label: "Lainnya (Tuliskan Keterangan Khusus)" },
                      ]
                    : [
                        { id: "Pindah Domisili / Keluar Desa", label: "Keluarga Pindah Domisili Keluar Desa" },
                        { id: "Kepala Keluarga Meninggal / Reorganisasi KK", label: "Kepala Keluarga Meninggal / Reorganisasi KK" },
                        { id: "Penggabungan / Pecah KK", label: "Penggabungan atau Pecah Kartu Keluarga" },
                        { id: "Kesalahan Input Data / Duplikasi", label: "Kesalahan Input Data / Duplikasi" },
                        { id: "Lainnya", label: "Lainnya (Tuliskan Keterangan Khusus)" },
                      ]
                  ).map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                        deleteModal.reason === opt.id
                          ? "border-red-500 bg-red-50/50 text-red-950 font-semibold"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deleteReason"
                        value={opt.id}
                        checked={deleteModal.reason === opt.id}
                        onChange={(e) => setDeleteModal({ ...deleteModal, reason: e.target.value })}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="flex-1 text-slate-800">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Keterangan Tambahan / Catatan Alasan
                  {deleteModal.reason === "Lainnya" && <span className="text-red-500"> (Wajib Diisi)</span>}
                </label>
                <textarea
                  rows={2}
                  value={deleteModal.customReason}
                  onChange={(e) => setDeleteModal({ ...deleteModal, customReason: e.target.value })}
                  placeholder="Contoh: Pindah ke Kabupaten Cirebon, SKPWNI No. 474/12/2026 atau Meninggal dunia tanggal 14 Sep 2026..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Data tidak akan dihapus permanen melainkan diarsipkan (soft-delete) untuk riwayat audit kependudukan desa.
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
                disabled={deleteModal.isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={
                  deleteModal.isSubmitting ||
                  (deleteModal.reason === "Lainnya" && !deleteModal.customReason.trim())
                }
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                {deleteModal.isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mengarsipkan...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Konfirmasi & Arsipkan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#003733] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400/30 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
