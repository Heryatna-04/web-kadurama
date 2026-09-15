"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/master");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="flex items-center gap-3 text-emerald-400 text-xs font-mono">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span>Mengarahkan ke Panel Otorisasi Aparatur (/master)...</span>
      </div>
    </div>
  );
}
