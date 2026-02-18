import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Virtual Wardrobe | Your Personal Digital Fashion Closet",
  description:
    "Organize your fashion collection, build outfits, track spending, and manage your wishlist — all in one beautiful digital wardrobe.",
  keywords: ["fashion", "wardrobe", "outfit builder", "style tracker", "closet organizer"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
