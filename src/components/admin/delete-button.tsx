"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle, Trash2 } from "lucide-react";
import type { ActionResult } from "@/lib/actions/helpers";

interface DeleteButtonProps {
  id: number;
  entityName: string;
  onDelete: (id: number) => Promise<ActionResult>;
  iconOnly?: boolean;
}

export function DeleteButton({
  id,
  entityName,
  onDelete,
  iconOnly = true,
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleConfirm() {
    setLoading(true);
    try {
      const result = await onDelete(id);
      if (result.ok) {
        toast.success(`${entityName} berhasil dihapus.`);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Hapus ${entityName}`}
        className={iconOnly ? "btn-icon-danger" : "btn-danger !px-3 !py-1.5 text-xs"}
      >
        <Trash2 className="h-4 w-4" />
        {!iconOnly ? "Hapus" : null}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => !loading && setOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Hapus {entityName}?
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  Data yang dihapus tidak dapat dikembalikan. Pastikan Anda
                  yakin ingin melanjutkan.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="btn-secondary"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="btn-danger"
              >
                {loading ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
