import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/forms/login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login Admin",
};

export default function AdminLoginPage() {
  return <LoginForm />;
}
