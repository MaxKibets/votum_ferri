import type { Metadata } from "next";
import { geistMono, geistSans } from "@/app/config/fonts";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { CommonLayout } from "@/widgets/layout";
import "@/app/styles/globals.css";

export const metadata: Metadata = {
  title: "Votum Ferri",
  description: "Votum Ferri application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <CommonLayout>{children}</CommonLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
