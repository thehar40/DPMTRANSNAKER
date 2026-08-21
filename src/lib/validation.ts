import { z } from "zod";

const str = (min: number, max: number, message = "Wajib diisi") =>
  z
    .string()
    .trim()
    .min(min, message)
    .max(max, `Maksimal ${max} karakter`);

const optStr = (max: number) =>
  z.preprocess(
    (v) => (v === "" || v == null ? null : String(v)),
    z.string().trim().max(max).nullable().optional()
  );

const optEmail = z.preprocess(
  (v) => (v === "" || v == null ? null : String(v)),
  z.string().trim().email("Format email tidak valid").nullable().optional()
);

const int = (min = 0) =>
  z.preprocess(
    (v) => (v === "" || v == null ? 0 : Number(v)),
    z.number().int().min(min, "Nilai tidak valid")
  );

const optInt = z.preprocess(
  (v) => (v === "" || v == null ? null : Number(v)),
  z.number().int().positive().nullable().optional()
);

const optDateTime = z.preprocess((v) => {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}, z.date().nullable().optional());

export const loginSchema = z.object({
  username: str(1, 100, "Username wajib diisi"),
  password: str(1, 200, "Password wajib diisi"),
});

export const inquirySchema = z.object({
  name: str(1, 120, "Nama wajib diisi"),
  email: optEmail,
  phone: z.preprocess(
    (v) => (v === "" || v == null ? null : String(v)),
    z
      .string()
      .trim()
      .regex(/^\+?\d{9,20}$/, "Nomor WhatsApp hanya boleh berisi angka")
      .nullable()
      .optional()
  ),
  divisionId: optInt,
  subject: str(1, 200, "Subjek wajib diisi"),
  message: str(1, 5000, "Pesan wajib diisi"),
});

export const settingSchema = z.object({
  agencyName: str(1, 200),
  shortName: str(1, 100),
  tagline: str(1, 200),
  address: str(1, 500),
  phone: z.string().trim().max(100).default(""),
  email: z.string().trim().max(100).default(""),
  whatsapp: z.string().trim().max(100).default(""),
  facebook: optStr(200),
  instagram: optStr(200),
  youtube: optStr(200),
  mapEmbedUrl: optStr(1000),
  officeHours: str(1, 200),
});

export const profileSchema = z.object({
  welcomeTitle: str(1, 200),
  welcomeName: optStr(200),
  welcomePosition: optStr(200),
  welcomeText: str(1, 20000),
  vision: str(1, 5000),
  mission: str(1, 20000),
  dutiesFunctions: str(1, 20000),
  serviceValues: str(1, 10000),
});

export const divisionSchema = z.object({
  name: str(1, 200),
  slug: str(1, 200),
  abbreviation: optStr(100),
  description: str(1, 5000),
  duties: optStr(10000),
  icon: optStr(100),
  order: int(),
});

export const serviceSchema = z.object({
  divisionId: int(1),
  name: str(1, 200),
  slug: str(1, 200),
  description: str(1, 5000),
  requirements: optStr(10000),
  procedures: optStr(10000),
  externalUrl: optStr(500),
  externalButtonLabel: optStr(100),
  icon: optStr(100),
  order: int(),
  status: z.enum(["active", "inactive"]),
});

export const contactSchema = z.object({
  divisionId: int(1),
  name: str(1, 150),
  position: str(1, 150),
  phone: z.string().trim().max(100).default(""),
  whatsapp: z.string().trim().max(100).default(""),
  email: optEmail,
  photo: optStr(500),
  order: int(),
  status: z.enum(["active", "inactive"]),
});

export const newsSchema = z.object({
  divisionId: optInt,
  title: str(1, 300),
  slug: str(1, 300),
  category: str(1, 50),
  excerpt: str(1, 1000),
  content: str(1, 50000),
  coverImage: optStr(500),
  status: z.enum(["draft", "published"]),
  publishedAt: optDateTime,
});

export const tutorialSchema = z.object({
  title: str(1, 300),
  slug: str(1, 300),
  category: str(1, 100),
  description: str(1, 2000),
  content: optStr(50000),
  videoUrl: optStr(1000),
  thumbnailUrl: optStr(500),
  duration: optStr(50),
  order: int(),
  status: z.enum(["draft", "published"]),
  publishedAt: optDateTime,
});

export const gallerySchema = z.object({
  title: str(1, 200),
  description: optStr(1000),
  category: optStr(100),
  imageUrl: str(1, 500),
  order: int(),
  status: z.enum(["active", "inactive"]),
});

export type SettingInput = z.infer<typeof settingSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type DivisionInput = z.infer<typeof divisionSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type NewsInput = z.infer<typeof newsSchema>;
export type TutorialInput = z.infer<typeof tutorialSchema>;
export type GalleryInput = z.infer<typeof gallerySchema>;
