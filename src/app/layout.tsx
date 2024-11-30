import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

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
  title: "Supplier Management",
  description: "Generated by create next app",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="grid grid-rows-[5rem_1fr_5rem] h-svh">
            <Header />
            <main className="h-full grid items-center font-[family-name:var(--font-geist-sans)]">
              {children}
            </main>
            <footer className="row-start-3 text-muted-foreground flex gap-6 flex-wrap items-center justify-center">
              © {new Date().getFullYear()}
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="flex p-5 justify-between items-center text-center">
      <Link href="/">
        <span className="font-black tracking-tight">📦 ELMM</span> | Supplier
        Management
      </Link>
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage></AvatarImage>
          <AvatarFallback>
            <UserRound />
          </AvatarFallback>
        </Avatar>
        <ModeToggle />
      </div>
    </header>
  );
}
