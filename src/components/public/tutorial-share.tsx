"use client";

import { Facebook, Link2, MessageCircle, Share2, Twitter } from "lucide-react";
import { toast } from "sonner";

export function TutorialShare({ title }: { title: string }) {
  function shareUrl() {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }

  async function copyLink() {
    const url = shareUrl();
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link tutorial berhasil disalin.");
    } catch {
      toast.error("Link belum dapat disalin. Silakan salin dari alamat browser.");
    }
  }

  function openShare(type: "whatsapp" | "facebook" | "twitter") {
    const url = shareUrl();
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const shareLinks = {
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    };
    window.open(shareLinks[type], "_blank", "noopener,noreferrer");
  }

  const shareButtonClass =
    "flex h-9 w-9 items-center justify-center rounded-xl transition";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Share2 className="h-3.5 w-3.5" />
        Bagikan
      </span>
      <button
        type="button"
        onClick={() => openShare("whatsapp")}
        aria-label="Bagikan melalui WhatsApp"
        className={`${shareButtonClass} bg-green-50 text-green-600 hover:bg-green-500 hover:text-white`}
      >
        <MessageCircle className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => openShare("facebook")}
        aria-label="Bagikan melalui Facebook"
        className={`${shareButtonClass} bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white`}
      >
        <Facebook className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => openShare("twitter")}
        aria-label="Bagikan melalui Twitter"
        className={`${shareButtonClass} bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white`}
      >
        <Twitter className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={copyLink}
        aria-label="Salin link tutorial"
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition hover:bg-primary-700 hover:text-white"
      >
        <Link2 className="h-4 w-4" />
      </button>
    </div>
  );
}
