"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { createService, updateService } from "@/lib/actions/services";
import {
  FieldError,
  Input,
  Label,
  Select,
  SubmitButton,
  Textarea,
} from "@/components/ui/fields";
import { serviceSchema } from "@/lib/validation";
import { ICON_OPTIONS } from "@/lib/constants";
import { slugify } from "@/lib/utils";

interface ServiceFormProps {
  divisions: { id: number; name: string }[];
  service?: {
    id: number;
    divisionId: number;
    name: string;
    slug: string;
    description: string;
    requirements: string | null;
    procedures: string | null;
    externalUrl: string | null;
    externalButtonLabel: string | null;
    icon: string | null;
    order: number;
    status: string;
  } | null;
}

export function ServiceForm({ divisions, service }: ServiceFormProps) {
  const router = useRouter();
  const isEdit = !!service;

  const [form, setForm] = useState({
    divisionId: String(service?.divisionId ?? divisions[0]?.id ?? ""),
    name: service?.name ?? "",
    slug: service?.slug ?? "",
    description: service?.description ?? "",
    requirements: service?.requirements ?? "",
    procedures: service?.procedures ?? "",
    externalUrl: service?.externalUrl ?? "",
    externalButtonLabel: service?.externalButtonLabel ?? "",
    icon: service?.icon ?? "",
    order: String(service?.order ?? 0),
    status: service?.status ?? "active",
  });
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleName = (value: string) => {
    setForm((f) => ({
      ...f,
      name: value,
      slug: slugTouched ? f.slug : slugify(value),
    }));
    setErrors((e) => ({ ...e, name: "" }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = serviceSchema.safeParse(form);
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
    if (service) fd.set("id", String(service.id));
    for (const [key, value] of Object.entries(parsed.data)) {
      if (value !== undefined && value !== null) fd.set(key, String(value));
    }
    const result = isEdit ? await updateService(fd) : await createService(fd);
    setLoading(false);
    if (result.ok) {
      toast.success(isEdit ? "Layanan berhasil diperbarui." : "Layanan berhasil ditambahkan.");
      router.push("/admin/services");
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
            Nama Layanan
          </Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => handleName(e.target.value)}
          />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="slug" required hint="URL unik">
            Slug
          </Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", slugify(e.target.value));
            }}
          />
          <FieldError>{errors.slug}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="description" required>
          Deskripsi Layanan
        </Label>
        <Textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
        <FieldError>{errors.description}</FieldError>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="requirements" hint="Markdown, awali setiap poin dengan -">
            Persyaratan
          </Label>
          <Textarea
            id="requirements"
            rows={6}
            value={form.requirements}
            onChange={(e) => set("requirements", e.target.value)}
            placeholder={"- Persyaratan pertama\n- Persyaratan kedua"}
          />
        </div>
        <div>
          <Label htmlFor="procedures" hint="Markdown, awali setiap langkah dengan 1.">
            Prosedur
          </Label>
          <Textarea
            id="procedures"
            rows={6}
            value={form.procedures}
            onChange={(e) => set("procedures", e.target.value)}
            placeholder={"1. Langkah pertama\n2. Langkah kedua"}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="externalUrl" hint="https://...">
            Tautan Aplikasi Eksternal
          </Label>
          <Input
            id="externalUrl"
            value={form.externalUrl}
            onChange={(e) => set("externalUrl", e.target.value)}
            placeholder="https://oss.go.id"
          />
        </div>
        <div>
          <Label htmlFor="externalButtonLabel">Label Tombol Eksternal</Label>
          <Input
            id="externalButtonLabel"
            value={form.externalButtonLabel}
            onChange={(e) => set("externalButtonLabel", e.target.value)}
            placeholder="Contoh: Buka OSS"
          />
        </div>
        <div>
          <Label htmlFor="icon">Ikon</Label>
          <Select
            id="icon"
            value={form.icon}
            onChange={(e) => set("icon", e.target.value)}
          >
            {ICON_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
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
          {isEdit ? "Simpan Perubahan" : "Tambah Layanan"}
        </SubmitButton>
      </div>
    </form>
  );
}
