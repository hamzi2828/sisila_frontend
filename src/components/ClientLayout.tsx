'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideLayout = ['/authentication'].some(route => pathname.startsWith(route)) || pathname.startsWith('/admin');

  return (
    <>
      {!hideLayout && <Header />}
      <main>{children}</main>
      {!hideLayout && <Footer />}
      <Toaster position="top-center" toastOptions={{ duration: 3500, style: { borderRadius: "9999px", background: "#111", color: "#fff", fontSize: "14px" } }} />
      <SonnerToaster position="top-right" richColors />
    </>
  );
}