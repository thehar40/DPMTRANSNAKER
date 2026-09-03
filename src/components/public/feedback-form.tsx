"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send, Star } from "lucide-react";
import {
  FieldError,
  Input,
  Label,
  SubmitButton,
  Textarea,
} from "@/components/ui/fields";
import { feedbackSchema } from "@/lib/validation";

export function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = feedbackSchema.safeParse({
      name,
      email,
      rating: rating || "",
      message,
    });
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
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) {
        toast.error(
          "Maaf, feedback Anda gagal terkirim. Silakan coba lagi nanti."
        );
        return;
      }
      toast.success(
        "Terima kasih! Feedback Anda telah kami terima dan menjadi bahan evaluasi kami."
      );
      setName("");
      setEmail("");
      setRating(0);
      setMessage("");
      setErrors({});
    } catch {
      toast.error("Maaf, feedback Anda gagal terkirim. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const stars = [1, 2, 3, 4, 5];

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker !text-accent-300">Feed Back</p>
          <h2 className="mt-2 text-xl font-bold text-white">
            Sampaikan Masukan Anda
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Kritik dan saran Anda sangat berarti untuk peningkatan pelayanan
            kami.
          </p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-400 text-primary-950">
          <Star className="h-5 w-5" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="feedback-name" required>
            Nama
          </Label>
          <Input
            id="feedback-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
          />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="feedback-email">Email</Label>
          <Input
            id="feedback-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
          />
          <FieldError>{errors.email}</FieldError>
        </div>
      </div>

      <div>
        <span className="label">Penilaian</span>
        <div className="flex items-center gap-1">
          {stars.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} bintang`}
              className="rounded p-1 transition hover:scale-110"
            >
              <Star
                className={
                  value <= rating
                    ? "h-6 w-6 fill-accent-400 text-accent-400"
                    : "h-6 w-6 text-white/40"
                }
              />
            </button>
          ))}
          <span className="ml-2 text-xs text-white/60">
            {rating ? `${rating}/5` : "Pilih bintang"}
          </span>
        </div>
      </div>

      <div>
        <Label htmlFor="feedback-message" required>
          Pesan / Masukan
        </Label>
        <Textarea
          id="feedback-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tuliskan kritik, saran, atau masukan Anda..."
        />
        <FieldError>{errors.message}</FieldError>
      </div>

      <SubmitButton loading={loading} className="w-full !bg-accent-500 !text-primary-950 hover:!bg-accent-400">
        <Send className="h-4 w-4" />
        Kirim Feedback
      </SubmitButton>
    </form>
  );
}
