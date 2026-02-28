import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import RouteTransition from "@/components/RouteTransition";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Carómetro FAO | LARC 39",
  description: "Desarrollado por la Unidad Regional de Comunicaciones",
  icons: {
    icon: "https://www.fao.org/docs/corporatelibraries/default-document-library/favicon/favicon.ico",
  },
  openGraph: {
    title: "Carómetro FAO | LARC 39",
    description: "Desarrollado por la Unidad Regional de Comunicaciones",
    images: [
      {
        url: "/larc39.jpeg",
        width: 1200,
        height: 630,
        alt: "Carómetro FAO | LARC 39",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carómetro FAO | LARC 39",
    description: "Desarrollado por la Unidad Regional de Comunicaciones",
    images: ["/larc39.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-white">
          <header className="border-b border-line/80 bg-white">
            <Container>
              <div className="flex h-20 items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="/81.svg"
                    alt="Logo FAO"
                    width={116}
                    height={36}
                    priority
                    className="h-9 w-auto"
                  />
                  <div className="hidden h-8 w-px bg-line/80 sm:block" />
                  <span className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-700">
                    Carómetro
                  </span>
                </div>
                <span className="whitespace-nowrap text-xs text-muted sm:text-sm">
                  Carómetro FAO
                </span>
              </div>
            </Container>
          </header>

          <main className="flex-1 py-10 sm:py-14">
            <Container>
              <RouteTransition>{children}</RouteTransition>
            </Container>
          </main>

          <footer className="border-t border-line/80 py-5">
            <Container>
              <div className="space-y-2 text-center">
                <p className="text-xs font-semibold text-slate-700 sm:text-sm">
                  Carómetro FAO
                </p>
                <p className="mx-auto max-w-3xl text-[11px] leading-relaxed text-muted sm:text-xs">
                  Directorio para consulta y coordinación durante la LARC 39.
                </p>
                <p>
                  <Link
                    href="/disclaimer"
                    className="interactive-button rounded-lg px-1 text-xs text-slate-700 underline underline-offset-2 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 sm:text-sm"
                  >
                    Disclaimer (ES | EN | FR | PT)
                  </Link>
                </p>
              </div>
            </Container>
          </footer>
        </div>
      </body>
    </html>
  );
}
