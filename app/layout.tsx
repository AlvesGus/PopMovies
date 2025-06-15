import type { Metadata } from "next";
import "./globals.css";
import { Lato } from "next/font/google";
import SessionProvider from "./providers/session";
import { getServerSession } from "next-auth";
import { MoviesProvider } from "./providers/movies"; // Import the MoviesProvider
import { Navbar } from "./_components/navbar";


export const metadata: Metadata = {
  title: "PopMovies",
};

const lato = Lato({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lato",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en" className={`${lato.variable} `}>
      <body className="dark font-lato bg-zinc-950 text-white antialiased h-screen">
        <SessionProvider session={session}>
          <MoviesProvider > 
            <Navbar/>
            {children}
          </MoviesProvider>
        </SessionProvider>
      </body>
    </html>
  );
}