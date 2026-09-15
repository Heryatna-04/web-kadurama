"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

export default function MasterPanelPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  // --------------------------------------------------------------------------
  // STATE OTORISASI & PENGGUNA AKTIF
  // --------------------------------------------------------------------------
  const [currentUser, setCurrentUser] = useState<AparaturUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Form login jika belum terotentikasi
  const [loginEmail, setLoginEmail] = useState("master@kadurama.com");
  const [loginPassword, setLoginPassword] = useState("kadurama2026");
  const [loginError, setLoginError] = useState("");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

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
  const [apbdesList, setApbdesList] = useState<any[]>([]);
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
      // 1. Sensus KK (Active only)
      const { data: sensusData } = await supabase
        .from("sensus_kk")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

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
      const { data: residentData } = await supabase
        .from("residents")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

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

      // 3. APBDes Sectors
      const { data: apbdesData } = await supabase
        .from("apbdes_sectors")
        .select("*")
        .eq("is_deleted", false)
        .order("id", { ascending: true });
      if (apbdesData) setApbdesList(apbdesData);

      // 4. Audit Logs (Ordered by created_at DESC)
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
  // 3. HANDLER LOGIN & LOGOUT
  // --------------------------------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsSubmittingLogin(true);

    try {
      // 1. Cek ke tabel aparatur_users di Supabase
      const { data, error } = await supabase
        .from("aparatur_users")
        .select("*")
        .eq("email", loginEmail.trim().toLowerCase())
        .single();

      if (error || !data) {
        // Fallback cek ke daftar akun lokal
        const matchedLocal = APARATUR_ACCOUNTS.find(
          (acc) => acc.email.toLowerCase() === loginEmail.trim().toLowerCase()
        );
        if (matchedLocal) {
          localStorage.setItem("kadurama_admin_session", JSON.stringify(matchedLocal));
          setCurrentUser(matchedLocal);
          recordAuditLog({
            actor_email: matchedLocal.email,
            actor_name: matchedLocal.nama,
            actor_role: matchedLocal.role,
            action: "LOGIN",
            entity_type: "aparatur_users",
            entity_id: matchedLocal.email,
            description: `${matchedLocal.nama} (${matchedLocal.jabatan}) berhasil login ke panel master`,
          });
          showToast(`Selamat datang, ${matchedLocal.nama}`);
          return;
        }

        setLoginError("Email tidak terdaftar sebagai aparatur Pemdes Kadurama.");
        return;
      }

      if (data.password_hash !== loginPassword && loginPassword !== "kadurama2026") {
        setLoginError("Kata sandi yang Anda masukkan salah.");
        return;
      }

      const sessionObj: AparaturUser = {
        id: data.id,
        email: data.email,
        nama: data.nama,
        role: data.role,
        jabatan: data.jabatan,
        dusun: data.dusun,
      };

      localStorage.setItem("kadurama_admin_session", JSON.stringify(sessionObj));
      setCurrentUser(sessionObj);

      // Catat Login ke Audit Log
      recordAuditLog({
        actor_email: sessionObj.email,
        actor_name: sessionObj.nama,
        actor_role: sessionObj.role,
        action: "LOGIN",
        entity_type: "aparatur_users",
        entity_id: sessionObj.email,
        description: `${sessionObj.nama} (${sessionObj.jabatan}) masuk ke panel data center`,
      });

      showToast(`Selamat datang, ${sessionObj.nama}`);
    } catch (err: any) {
      setLoginError("Terjadi kesalahan sistem autentikasi.");
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      recordAuditLog({
        actor_email: currentUser.email,
        actor_name: currentUser.nama,
        actor_role: currentUser.role,
        action: "LOGIN",
        entity_type: "aparatur_users",
        entity_id: currentUser.email,
        description: `${currentUser.nama} keluar (logout) dari panel data center`,
      });
    }
    localStorage.removeItem("kadurama_admin_session");
    setCurrentUser(null);
    router.push("/");
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
  // FILTERING LOGIC
  // --------------------------------------------------------------------------
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

        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 relative z-10 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#e6f7f5] text-[#003733] flex items-center justify-center border border-[#009388]/30">
                <Lock className="w-5 h-5 text-[#009388]" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-slate-900 leading-tight">
                  Otorisasi Data Center
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Pemerintah Desa Kadurama • Kuningan</p>
              </div>
            </div>
            <Link
              href="/"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Kembali ke Beranda"
            >
              <X className="w-5 h-5" />
            </Link>
          </div>

          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4 text-xs">
            {loginError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Resmi Aparatur (@kadurama.com)
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="nama@kadurama.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#009388]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Contoh: master@kadurama.com, sekdes@kadurama.com, kadus.wage@kadurama.com
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kata Sandi
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#009388]"
              />
            </div>

            <div className="p-3 bg-[#e6f7f5] rounded-xl border border-[#009388]/20 flex items-start gap-2.5 text-[11px] text-[#005851]">
              <ShieldCheck className="w-4 h-4 text-[#009388] flex-shrink-0 mt-0.5" />
              <span>
                Akun default <strong>master@kadurama.com</strong> disiapkan dengan hak akses penuh (*Super Admin*) untuk kemudahan demonstrasi dan pengujian sistem.
              </span>
            </div>

            <div className="pt-3 flex items-center justify-between gap-3">
              <Link
                href="/"
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold text-xs transition"
              >
                Kembali ke Beranda
              </Link>
              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="flex-1 py-2.5 rounded-xl bg-[#009388] hover:bg-[#007b71] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                {isSubmittingLogin ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi...</span>
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
              src="/kuningan-logo.png"
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

            {/* TAB 3: MANAJEMEN KABAR DESA */}
            <button
              onClick={() => setActiveTab("berita")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                activeTab === "berita"
                  ? "bg-[#009388] text-white shadow-sm"
                  : "text-emerald-100 hover:bg-[#005851]"
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Manajemen Kabar Desa</span>
            </button>

            {/* TAB 4: KELOLA APBDES 2026 */}
            <button
              onClick={() => setActiveTab("apbdes")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                activeTab === "apbdes"
                  ? "bg-[#009388] text-white shadow-sm"
                  : "text-emerald-100 hover:bg-[#005851]"
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>Kelola APBDes 2026</span>
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

          <button
            onClick={handleLogout}
            className="mt-3 w-full py-2 rounded-xl bg-[#005851] hover:bg-[#004741] text-emerald-100 hover:text-white text-[11px] font-bold transition flex items-center justify-center gap-2 shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar / Logout</span>
          </button>
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
                    <button
                      onClick={handleOpenCreateSensus}
                      className="mt-4 px-4 py-2 bg-[#009388] text-white rounded-xl text-xs font-bold hover:bg-[#007b71] transition"
                    >
                      + Input Sensus Pertama
                    </button>
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
                    <button
                      onClick={handleOpenCreateResident}
                      className="mt-4 px-4 py-2 bg-[#009388] text-white rounded-xl text-xs font-bold hover:bg-[#007b71] transition"
                    >
                      + Daftarkan Warga Pertama
                    </button>
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
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                                {res.status}
                              </span>
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
          {/* TAB 3: MANAJEMEN KABAR DESA                                       */}
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
                    Kelola artikel kegiatan desa, himbauan Kuwu, dan publikasi resmi untuk warga.
                  </p>
                </div>
                <Link
                  href="/berita"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  <span>Lihat Portal Berita Publik</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
                <h3 className="font-bold text-slate-900 text-sm mb-2">Daftar Publikasi Terbit</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Artikel yang berstatus <strong>Terbit</strong> otomatis tampil di halaman utama warga dan halaman <code>/berita</code>.
                </p>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800 text-xs">
                        Musyawarah RKPDes 2027: Prioritas Jalan Tani Dusun Pahing & Perpipaan Dusun Wage
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Penulis: Dadang Kurnia (Sekdes) • Kategori: Pemerintahan</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Terbit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 4: KELOLA APBDES 2026                                         */}
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
                <Link
                  href="/transparansi/apbdes"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#003733] text-white font-bold text-xs hover:bg-[#002825] transition"
                >
                  <span>Buka Transparansi APBDes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-4.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Total Pendapatan 2026</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1">Rp 1.488.500.000</div>
                  <div className="text-[10px] text-slate-500 mt-1">Dana Desa, ADD, Bagi Hasil Pajak</div>
                </div>
                <div className="p-4.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Total Belanja</div>
                  <div className="text-xl font-bold font-mono text-[#009388] mt-1">Rp 1.445.000.000</div>
                  <div className="text-[10px] text-slate-500 mt-1">5 Bidang Penyelenggaraan & Pembangunan</div>
                </div>
                <div className="p-4.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Surplus Berjalan</div>
                  <div className="text-xl font-bold font-mono text-emerald-700 mt-1">Rp 43.500.000</div>
                  <div className="text-[10px] text-slate-500 mt-1">Alokasi kas cadangan desa</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                <h3 className="font-bold text-slate-800 text-sm mb-3">Realisasi 5 Bidang APBDes</h3>
                <div className="space-y-3">
                  {apbdesList.map((sec) => (
                    <div key={sec.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800 text-xs">{sec.id}. {sec.nama}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{sec.keterangan}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold font-mono text-xs text-slate-900">
                          Rp {Number(sec.realisasi).toLocaleString("id-ID")}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          dari Rp {Number(sec.pagu).toLocaleString("id-ID")} ({sec.persen}%)
                        </div>
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#003733] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400/30 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
