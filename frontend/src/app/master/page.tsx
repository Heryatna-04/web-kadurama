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
import {
  ClipboardCheck,
  Users,
  PieChart,
  Newspaper,
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
  ChevronRight,
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

export default function MasterPanelPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

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
    "sensus" | "residents" | "berita" | "apbdes" | "audit"
  >("sensus");

  // --------------------------------------------------------------------------
  // DATA DARI SUPABASE (DENGAN REFRESH REAL-TIME)
  // --------------------------------------------------------------------------
  const [sensusList, setSensusList] = useState<SensusKK[]>([]);
  const [residentsList, setResidentsList] = useState<Resident[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
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

  // Modals
  const [isSensusModalOpen, setIsSensusModalOpen] = useState(false);
  const [editingSensus, setEditingSensus] = useState<SensusKK | null>(null);

  const [isResidentModalOpen, setIsResidentModalOpen] = useState(false);
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
      if (newsData) setNewsList(newsData);

      // 5. Audit Logs (Ordered by created_at DESC)
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
    setIsSensusModalOpen(true);
  };

  const handleSaveSensus = async () => {
    if (!editingSensus || !currentUser) return;
    if (!editingSensus.noKk.trim() || !editingSensus.namaKepalaKeluarga.trim()) {
      alert("Nomor KK dan Nama Kepala Keluarga wajib diisi!");
      return;
    }

    // Auto scoring desil
    const finalDesil = calculateDesil(
      editingSensus.dinding,
      editingSensus.lantai,
      editingSensus.penghasilanBulanan,
      editingSensus.luasLantai,
      editingSensus.jumlahAnggota
    );

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
          description: `Input data sensus KK ${editingSensus.noKk} (${editingSensus.namaKepalaKeluarga}) - Desil ${finalDesil} Dusun ${editingSensus.dusun}`,
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
          description: `Memperbarui sensus KK ${editingSensus.noKk} (${editingSensus.namaKepalaKeluarga})`,
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

  const handleSoftDeleteSensus = async (item: SensusKK) => {
    if (!currentUser) return;
    if (!canModify(item.dusun)) {
      alert(`Anda hanya berwenang mengelola data di Dusun ${currentUser.dusun}`);
      return;
    }

    if (!confirm(`Hapus data sensus KK ${item.noKk} (${item.namaKepalaKeluarga})? Data akan dipindahkan ke arsip soft-delete.`)) {
      return;
    }

    try {
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
        description: `Soft-delete sensus KK ${item.noKk} (${item.namaKepalaKeluarga}) Dusun ${item.dusun}`,
        old_data: item,
      });

      showToast(`Data KK ${item.namaKepalaKeluarga} berhasil diarsipkan.`);
      fetchAllData();
    } catch (err) {
      alert("Gagal menghapus data.");
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
      alert("NIK dan Nama Warga wajib diisi!");
      return;
    }

    const isNew = !residentsList.some((r) => r.nik === editingResident.nik);
    const payload = {
      nik: editingResident.nik,
      no_kk: editingResident.noKk,
      nama: editingResident.nama,
      ttl: editingResident.ttl,
      jenis_kelamin: editingResident.jenisKelamin,
      pekerjaan: editingResident.pekerjaan,
      agama: editingResident.agama,
      status_perkawinan: editingResident.statusPerkawinan,
      hubungan_keluarga: editingResident.hubunganKeluarga,
      dusun: editingResident.dusun,
      rt: editingResident.rt,
      rw: editingResident.rw,
      alamat: editingResident.alamat,
      status: editingResident.status,
      sync_status: editingResident.syncStatus,
      updated_by: currentUser.email,
    };

    try {
      if (isNew) {
        await supabase.from("residents").insert([{ ...payload, created_by: currentUser.email }]);
        await recordAuditLog({
          actor_email: currentUser.email,
          actor_name: currentUser.nama,
          actor_role: currentUser.role,
          action: "CREATE",
          entity_type: "residents",
          entity_id: editingResident.nik,
          description: `Pendaftaran warga baru NIK ${editingResident.nik} (${editingResident.nama}) Dusun ${editingResident.dusun}`,
          new_data: payload,
        });
      } else {
        const oldResident = residentsList.find((r) => r.nik === editingResident.nik);
        await supabase.from("residents").update(payload).eq("nik", editingResident.nik);
        await recordAuditLog({
          actor_email: currentUser.email,
          actor_name: currentUser.nama,
          actor_role: currentUser.role,
          action: "UPDATE",
          entity_type: "residents",
          entity_id: editingResident.nik,
          description: `Memperbarui data warga NIK ${editingResident.nik} (${editingResident.nama})`,
          old_data: oldResident,
          new_data: payload,
        });
      }

      setIsResidentModalOpen(false);
      showToast(isNew ? "Warga baru berhasil didaftarkan" : "Data warga berhasil diperbarui");
      fetchAllData();
    } catch (err) {
      alert("Gagal menyimpan data kependudukan.");
    }
  };

  const handleSoftDeleteResident = async (res: Resident) => {
    if (!currentUser) return;
    if (!canModify(res.dusun)) {
      alert(`Anda hanya berwenang mengelola warga di Dusun ${currentUser.dusun}`);
      return;
    }

    if (!confirm(`Hapus data warga NIK ${res.nik} (${res.nama})? Data akan diarsipkan di soft-delete.`)) {
      return;
    }

    try {
      await supabase
        .from("residents")
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
          deleted_by: currentUser.email,
        })
        .eq("nik", res.nik);

      await recordAuditLog({
        actor_email: currentUser.email,
        actor_name: currentUser.nama,
        actor_role: currentUser.role,
        action: "DELETE",
        entity_type: "residents",
        entity_id: res.nik,
        description: `Soft-delete warga NIK ${res.nik} (${res.nama}) Dusun ${res.dusun}`,
        old_data: res,
      });

      showToast(`Data warga ${res.nama} berhasil diarsipkan.`);
      fetchAllData();
    } catch (err) {
      alert("Gagal menghapus data warga.");
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
  const filteredSensus = sensusList.filter((item) => {
    const matchDusun = sensusDusunFilter === "all" || item.dusun === sensusDusunFilter;
    const matchDesil = sensusDesilFilter === "all" || item.desil.toString() === sensusDesilFilter;
    const matchSearch =
      !sensusSearch.trim() ||
      item.namaKepalaKeluarga.toLowerCase().includes(sensusSearch.toLowerCase()) ||
      item.noKk.includes(sensusSearch) ||
      item.nikKepalaKeluarga.includes(sensusSearch);
    return matchDusun && matchDesil && matchSearch;
  });

  const filteredResidents = residentsList.filter((res) => {
    const matchDusun = residentDusunFilter === "all" || res.dusun === residentDusunFilter;
    const matchSearch =
      !residentSearch.trim() ||
      res.nama.toLowerCase().includes(residentSearch.toLowerCase()) ||
      res.nik.includes(residentSearch) ||
      res.noKk.includes(residentSearch);
    return matchDusun && matchSearch;
  });

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
                        {filteredSensus.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/70 transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                              <div>{item.noKk}</div>
                              <div className="text-[10px] text-slate-400 font-normal">NIK: {item.nikKepalaKeluarga}</div>
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
                                  onClick={() => setSelectedSensusForPdf(item)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-[#009388] hover:bg-[#e6f7f5] transition"
                                  title="Cetak Profil Lembar KK"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                                {canModify(item.dusun) ? (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditingSensus(item);
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
                          <th className="py-3 px-4">Nama Lengkap</th>
                          <th className="py-3 px-4">Dusun / RT / RW</th>
                          <th className="py-3 px-4">Pekerjaan</th>
                          <th className="py-3 px-4">Hubungan Keluarga</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredResidents.map((res) => (
                          <tr key={res.nik} className="hover:bg-slate-50/70 transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                              <div>{res.nik}</div>
                              <div className="text-[10px] text-slate-400 font-normal">KK: {res.noKk}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-800">{res.nama}</div>
                              <div className="text-[10px] text-slate-500">{res.ttl}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-800 block">Dusun {res.dusun}</span>
                              <span className="text-[10px] text-slate-400">RT {res.rt} / RW {res.rw}</span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">{res.pekerjaan}</td>
                            <td className="py-3.5 px-4 font-semibold text-slate-700">{res.hubunganKeluarga}</td>
                            <td className="py-3.5 px-4 space-y-1">
                              <div>
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                                  {res.status}
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
                              {canModify(res.dusun) ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingResident(res);
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
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">Read-Only</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 3: MANAJEMEN KABAR DESA (FULL CRUD SUPABASE)                 */}
          {/* ================================================================ */}
          {activeTab === "berita" && (
            <div className="space-y-6">
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
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
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
                  <div className="p-12 text-center">
                    <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-800 font-bold text-sm">Belum Ada Artikel Berita</p>
                    <p className="text-slate-400 text-xs mt-1">
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
                                className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
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
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Nomor Kartu Keluarga (KK)</label>
                    <input
                      type="text"
                      value={editingSensus.noKk}
                      onChange={(e) => setEditingSensus({ ...editingSensus, noKk: e.target.value })}
                      placeholder="16 digit No KK"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">NIK Kepala Keluarga</label>
                    <input
                      type="text"
                      value={editingSensus.nikKepalaKeluarga}
                      onChange={(e) => setEditingSensus({ ...editingSensus, nikKepalaKeluarga: e.target.value })}
                      placeholder="16 digit NIK"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
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
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#009388]" />
                  <span>2. Foto Fisik Rumah Warga (Verifikasi RTLH)</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    URL Foto Rumah Tampak Depan
                  </label>
                  <input
                    type="text"
                    value={editingSensus.foto_rumah_url || ""}
                    onChange={(e) => setEditingSensus({ ...editingSensus, foto_rumah_url: e.target.value })}
                    placeholder="https://... atau path berkas foto"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono text-xs"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Masukkan URL gambar fisik tampak depan rumah untuk lampiran verifikasi RTLH.
                  </span>
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

              {/* Indikator Auto-Desil Preview */}
              <div className="p-3 bg-[#e6f7f5] rounded-xl border border-[#009388]/30 flex items-center justify-between text-xs text-[#003733]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#009388]" />
                  <span>Kalkulasi Otomatis Desil:</span>
                </div>
                <strong className="px-3 py-1 rounded-full bg-[#009388] text-white text-[11px] font-bold">
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
      {/* MODAL INPUT / EDIT DATA WARGA                                      */}
      {/* =================================================================== */}
      {isResidentModalOpen && editingResident && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e6f7f5] text-[#009388] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {residentsList.some((r) => r.nik === editingResident.nik)
                      ? "Ubah Data Warga"
                      : "Pendaftaran Warga Baru"}
                  </h3>
                  <p className="text-[11px] text-slate-500">Master Data Kependudukan Desa Kadurama</p>
                </div>
              </div>
              <button
                onClick={() => setIsResidentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">NIK (16 Digit)</label>
                <input
                  type="text"
                  value={editingResident.nik}
                  onChange={(e) => setEditingResident({ ...editingResident, nik: e.target.value })}
                  placeholder="320815..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nomor Kartu Keluarga (KK)</label>
                <input
                  type="text"
                  value={editingResident.noKk}
                  onChange={(e) => setEditingResident({ ...editingResident, noKk: e.target.value })}
                  placeholder="320815..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editingResident.nama}
                  onChange={(e) => setEditingResident({ ...editingResident, nama: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Dusun</label>
                <select
                  value={editingResident.dusun}
                  disabled={currentUser?.role === "kadus"}
                  onChange={(e) => setEditingResident({ ...editingResident, dusun: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                >
                  <option value="Manis">Dusun Manis</option>
                  <option value="Pahing">Dusun Pahing</option>
                  <option value="Wage">Dusun Wage</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">RT</label>
                  <input
                    type="text"
                    value={editingResident.rt}
                    onChange={(e) => setEditingResident({ ...editingResident, rt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">RW</label>
                  <input
                    type="text"
                    value={editingResident.rw}
                    onChange={(e) => setEditingResident({ ...editingResident, rw: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Pekerjaan</label>
                <input
                  type="text"
                  value={editingResident.pekerjaan}
                  onChange={(e) => setEditingResident({ ...editingResident, pekerjaan: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Hubungan Keluarga</label>
                <input
                  type="text"
                  value={editingResident.hubunganKeluarga}
                  onChange={(e) => setEditingResident({ ...editingResident, hubunganKeluarga: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsResidentModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSaveResident}
                className="px-5 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Warga</span>
              </button>
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
                  <div className="font-mono font-bold text-slate-900">{selectedSensusForPdf.noKk}</div>
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
                              <td className="py-2 px-3 font-mono font-bold text-slate-900">{r.nik}</td>
                              <td className="py-2 px-3 font-mono text-slate-500">{r.noKk}</td>
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
                              <td className="py-2 px-3 font-mono font-bold text-slate-900">{s.no_kk}</td>
                              <td className="py-2 px-3 font-semibold text-slate-800">{s.nama_kepala_keluarga}</td>
                              <td className="py-2 px-3 font-mono text-slate-500">{s.nik_kepala_keluarga}</td>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Gambar Unggulan
                  </label>
                  <input
                    type="url"
                    value={newsForm.image_url}
                    onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#009388]"
                  />
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#003733] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400/30 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
