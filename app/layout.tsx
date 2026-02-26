import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Container from "@/components/Container";
import RouteTransition from "@/components/RouteTransition";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Faceometer | Carómetro FAO",
  description: "Base UI de Faceometer / Carómetro FAO",
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
                    Faceometer
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
              <p className="text-center text-xs text-muted sm:text-sm">
                Faceometer / Carómetro FAO
              </p>
            </Container>
          </footer>
        </div>
      </body>
    </html>
  );
}
