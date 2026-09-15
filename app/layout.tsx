import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { PlausibleScript } from "@/components/analytics/PlausibleScript";
import { FloatingWhatsApp } from "@/components/cta/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SedeProvider } from "@/components/sede/SedeProvider";
import { SITE } from "@/data/site";
import { jsonLdOrganizacion } from "@/lib/seo";
import "./globals.css";

/*
  Cinzel: instancia estática (peso 600) generada desde el Cinzel-Variable.ttf del kit y
  subconjuntada a latín básico. Pesa 16 KB y es el único recurso del que depende el titular (LCP).
  Inter: desde Google Fonts, autoalojada y subconjuntada en el build; no se precarga para
  no competir con Cinzel en 4G.
*/
const cinzel = localFont({
  src: "./fonts/cinzel-600-latin.woff2",
  weight: "600",
  style: "normal",
  variable: "--font-cinzel",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-inter",
  display: "swap",
  // Sin preload: el titular (Cinzel) es el LCP y debe llegar primero en 4G.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Ana Cure Estética & Spa · Medicina estética y spa en El Banco y Aguachica",
    template: "%s · Ana Cure Estética & Spa",
  },
  description: SITE.descripcion,
  applicationName: SITE.nombre,
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: SITE.nombre,
    url: SITE.url,
    images: [{ url: "/og/portada.jpg", width: 1200, height: 630, alt: "Ana Cure Estética & Spa: donde el cuidado se convierte en experiencia" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#8323AB",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CO" data-scroll-behavior="smooth" className={`${cinzel.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <SedeProvider>
          <Header />
          <div id="contenido" className="flex-1">
            {children}
          </div>
          <Footer />
          <FloatingWhatsApp />
        </SedeProvider>
        <PlausibleScript />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganizacion()) }} />
      </body>
    </html>
  );
}
