import type { Metadata, Viewport } from "next"
import { Outfit, Plus_Jakarta_Sans } from "next/font/google"

import { Toaster } from "@/components/ui/sonner"

import "./globals.css"

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600"],
})

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Balto",
  description: "El perfil de salud de tu mascota, en un solo lugar.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${outfit.variable} ${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full">
        {/* Mobile-first: en pantallas anchas la app se ve centrada con el ancho de un celular. */}
        <div className="relative mx-auto flex min-h-dvh w-full max-w-app flex-col bg-fondo">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}
