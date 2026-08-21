import type { Metadata } from "next";
import { Toaster } from "sonner";
import "@/app/globals.css";
import {
  SITE_DESCRIPTION,
  SITE_SHORT,
  SITE_TAGLINE,
  SITE_TITLE,
} from "@/lib/constants";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_SHORT}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE_SHORT,
    title: SITE_TITLE,
    description: SITE_TAGLINE,
  },
  icons: {
    icon: "/logo-aceh-utara.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
