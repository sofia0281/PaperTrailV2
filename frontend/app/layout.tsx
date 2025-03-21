import type { Metadata } from "next";
import { Urbanist } from "next/font/google"; // Importa la fuente Urbanist
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
// Importa la fuente Urbanist
const urbanist = Urbanist({
  variable: "--font-urbanist", // Nombre de la variable CSS para la fuente
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PaperTrail - Librería",
  description: "En papertrail vas a encontrar toda clase de libros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${urbanist.variable} antialiased`} // Aplica la fuente Urbanist
      >
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
