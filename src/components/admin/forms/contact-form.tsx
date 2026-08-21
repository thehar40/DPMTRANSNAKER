"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { createContact, updateContact } from "@/lib/actions/contacts";
import {
  FieldError,
  Input,
  Label,
  Select,
  SubmitButton,
} from "@/components/ui/fields";
import { contactSchema } from "@/lib/validation";

interface ContactFormProps {
  divisions: { id: number; name: string }[];
  contact?: {
    id: number;
    divisionId: number;
    name: string;
    position: string;
    phone: string;
    whatsapp: string;
    email: string | null;
    photo: string | null;
    order: number;
    status: string;
  } | null;
}

export function ContactForm({ divisions, contact }: ContactFormProps) {
  const router = useRouter();
  const isEdit = !!contact;

  const [form, setForm] = useState({
    divisionId: String(contact?.divisionId ?? divisions[0]?.id ?? ""),
    name: contact?.name ?? "",
    position: contact?.position ?? "",
    phone: contact?.phone ?? "",
    whatsapp: contact?.whatsapp ?? "",
    email: contact?.email ?? "",
    photo: contact?.photo ?? "",
    order: String(contact?.order ?? 0),
    status: contact?.status ?? "active",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.errors) {
        const key = String(issue.path[0] ?? "");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Mohon periksa kembali isian formulir.");
      return;
    }
    setLoading(true);
    const fd = new FormData();
    if (contact) fd.set("id", String(contact.id));
    for (const [key, value] of Object.entries(parsed.data)) {
      if (value !== undefined && value !== null) fd.set(key, String(value));
    }
    const result = isEdit ? await updateContact(fd) : await createContact(fd);
    setLoading(false);
    if (result.ok) {
      toast.success(isEdit ? "Contact person berhasil diperbarui." : "Contact person berhasil ditambahkan.");
      router.push("/admin/contacts");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-6">
      <div>
        <Label htmlFor="divisionId" required>
          Bidang Terkait
        </Label>
        <Select
          id="divisionId"
          value={form.divisionId}
          onChange={(e) => set("divisionId", e.target.value)}
        >
          {divisions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </Select>
        <FieldError>{errors.divisionId}</FieldError>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>
            Nama
          </Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="position" required>
            Jabatan
          </Label>
          <Input
            id="position"
            value={form.position}
            onChange={(e) => set("position", e.target.value)}
          />
          <FieldError>{errors.position}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Nomor Telepon</Label>
          <Input
            id="phone"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="081234567890"
          />
        </div>
        <div>
          <Label htmlFor="whatsapp" hint="Untuk tombol WhatsApp">
            Nomor WhatsApp
          </Label>
          <Input
            id="whatsapp"
            inputMode="tel"
            value={form.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            placeholder="6281234567890"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
          <FieldError>{errors.email}</FieldError>
        </div>
        <div>
          <Label htmlFor="photo" hint="URL gambar, opsional">
            Foto
          </Label>
          <Input
            id="photo"
            value={form.photo}
            onChange={(e) => set("photo", e.target.value)}
            placeholder="/images/foto-petugas.jpg"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="order">Urutan</Label>
          <Input
            id="order"
            type="number"
            value={form.order}
            onChange={(e) => set("order", e.target.value)}
          />
          <FieldError>{errors.order}</FieldError>
        </div>
        <div>
          <Label htmlFor="status" required>
            Status
          </Label>
          <Select
            id="status"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </Select>
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-5">
        <SubmitButton loading={loading}>
          <Save className="h-4 w-4" />
          {isEdit ? "Simpan Perubahan" : "Tambah Contact Person"}
        </SubmitButton>
      </div>
    </form>
  );
}
