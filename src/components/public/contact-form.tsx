"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/fields";
import { inquirySchema } from "@/lib/validation";

interface ContactFormProps {
  divisions: { id: number; name: string }[];
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  divisionId: string;
  subject: string;
  message: string;
}

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  divisionId: "",
  subject: "",
  message: "",
};

export function ContactForm({ divisions }: ContactFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsed = inquirySchema.safeParse({
      name: form.name,
      email: form.email,
      phone: form.phone,
      divisionId: form.divisionId || "",
      subject: form.subject,
      message: form.message,
    });

    if (!parsed.success) {
      const next: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.errors) {
        const key = issue.path[0] as keyof FormState;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Mohon periksa kembali isian formulir.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        toast.error(
          "Maaf, pesan Anda gagal terkirim. Silakan coba lagi beberapa saat lagi."
        );
        return;
      }
      toast.success(
        "Terima kasih! Pesan Anda telah kami terima dan akan ditindaklanjuti oleh petugas kami."
      );
      setForm(INITIAL);
      setErrors({});
    } catch {
      toast.error(
        "Maaf, pesan Anda gagal terkirim. Silakan coba lagi beberapa saat lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name" required>
            Nama Lengkap
          </Label>
          <Input
            id="contact-name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Contoh: Ahmad Fauzi"
            autoComplete="name"
          />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="Contoh: nama@email.com"
            autoComplete="email"
          />
          <FieldError>{errors.email}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-phone" hint="Opsional">
            Nomor WhatsApp
          </Label>
          <Input
            id="contact-phone"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="Contoh: 081234567890"
            autoComplete="tel"
          />
          <FieldError>{errors.phone}</FieldError>
        </div>
        <div>
          <Label htmlFor="contact-division" hint="Opsional">
            Pilih Bidang
          </Label>
          <Select
            id="contact-division"
            value={form.divisionId}
            onChange={(e) => set("divisionId", e.target.value)}
          >
            <option value="">- Pilih bidang tujuan -</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
          <FieldError>{errors.divisionId}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="contact-subject" required>
          Subjek
        </Label>
        <Input
          id="contact-subject"
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
          placeholder="Contoh: Pertanyaan tentang perizinan OSS"
        />
        <FieldError>{errors.subject}</FieldError>
      </div>

      <div>
        <Label htmlFor="contact-message" required>
          Pesan
        </Label>
        <Textarea
          id="contact-message"
          rows={5}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tuliskan pertanyaan atau pesan Anda di sini. Jangan sertakan data sensitif seperti password atau OTP."
        />
        <FieldError>{errors.message}</FieldError>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-400">
          * Wajib diisi. Kami tidak pernah meminta password atau OTP melalui
          formulir ini.
        </p>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {loading ? "Mengirim..." : "Kirim Pesan"}
        </button>
      </div>
    </form>
  );
}
