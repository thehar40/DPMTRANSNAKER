"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { createDivision, updateDivision } from "@/lib/actions/divisions";
import {
  FieldError,
  Input,
  Label,
  Select,
  SubmitButton,
  Textarea,
} from "@/components/ui/fields";
import { divisionSchema } from "@/lib/validation";
import { ICON_OPTIONS } from "@/lib/constants";
import { slugify } from "@/lib/utils";

interface DivisionFormProps {
  division?: {
    id: number;
    name: string;
    slug: string;
    abbreviation: string | null;
    description: string;
    duties: string | null;
    icon: string | null;
    order: number;
  } | null;
}

export function DivisionForm({ division }: DivisionFormProps) {
  const router = useRouter();
  const isEdit = !!division;

  const [form, setForm] = useState({
    name: division?.name ?? "",
    slug: division?.slug ?? "",
    abbreviation: division?.abbreviation ?? "",
    description: division?.description ?? "",
    duties: division?.duties ?? "",
    icon: division?.icon ?? "",
    order: String(division?.order ?? 0),
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
    const parsed = divisionSchema.safeParse(form);
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
    if (division) fd.set("id", String(division.id));
    for (const [key, value] of Object.entries(parsed.data)) {
      if (value !== undefined && value !== null) fd.set(key, String(value));
    }
    const result = isEdit ? await updateDivision(fd) : await createDivision(fd);
    setLoading(false);
    if (result.ok) {
      toast.success(isEdit ? "Bidang berhasil diperbarui." : "Bidang berhasil ditambahkan.");
      router.push("/admin/divisions");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>
            Nama Bidang
          </Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => handleName(e.target.value)}
          />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="slug" required hint="URL unik, huruf kecil dan tanda hubung">
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

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="abbreviation">Singkatan</Label>
          <Input
            id="abbreviation"
            value={form.abbreviation}
            onChange={(e) => set("abbreviation", e.target.value)}
            placeholder="Contoh: PTSP"
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
      </div>

      <div>
        <Label htmlFor="description" required>
          Deskripsi Singkat
        </Label>
        <Textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
        <FieldError>{errors.description}</FieldError>
      </div>

      <div>
        <Label htmlFor="duties" hint="Mendukung Markdown">
          Tugas dan Fungsi
        </Label>
        <Textarea
          id="duties"
          rows={4}
          value={form.duties}
          onChange={(e) => set("duties", e.target.value)}
        />
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-5">
        <SubmitButton loading={loading}>
          <Save className="h-4 w-4" />
          {isEdit ? "Simpan Perubahan" : "Tambah Bidang"}
        </SubmitButton>
      </div>
    </form>
  );
}
