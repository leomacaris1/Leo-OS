import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Leo OS - Personal Dashboard & Management System",
  description: "A centralized, next-generation dashboard for tracking personal projects, digital accounts, and subscriptions. Designed with high-performance metrics and AI operations integrations.",
  keywords: ["Next.js", "Dashboard", "Personal CRM", "Supabase", "UI/UX", "TailwindCSS"],
  authors: [{ name: "Leo Macaris" }],
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark selection:bg-cyan-500/30 selection:text-cyan-200">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('leo-os-theme');
                if (theme) {
                  document.documentElement.setAttribute('data-theme', theme);
                }
                const perf = localStorage.getItem('leo-os-performance');
                if (perf === 'high') {
                  document.documentElement.setAttribute('data-performance', 'high');
                }
              } catch (e) {}
            `,
          }}
        />
        {children}
        <Toaster theme="dark" position="bottom-right" toastOptions={{
          style: { background: 'rgba(15, 22, 42, 0.9)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#e2e8f0', backdropFilter: 'blur(12px)' }
        }} />
      </body>
    </html>
  );
}
