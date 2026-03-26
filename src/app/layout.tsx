import type { Metadata } from "next";
import { GlossaryButton } from "@/components/ui/Glossary";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agile Delivery Intelligence",
  description:
    "AI-powered delivery analysis tools that augment PM/SM judgment — built by Hiroya Ishida",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        <GlossaryButton />
      </body>
    </html>
  );
}
