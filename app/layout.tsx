import "./globals.css";

import SupabaseProvider from "./supabase-provider";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Aspect - A video sharing platform for creators",
  description: "Showcase Your Video Content in a Beautifully Designed Page Tailored to Your liking. Created with You in Mind",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SupabaseProvider>
        <body className="bg-neutral-950 w-screen min-h-screen text-white overflow-x-hidden">
          <Navbar />
          {children}
        </body>
      </SupabaseProvider>
    </html>
  );
}
