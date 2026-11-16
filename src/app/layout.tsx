import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yolanda | Professional Beauty & Hair Salon Equipment",
  description: "Premium salon-grade beauty equipment, hair steamers, facial machines & styling stations for professional salons.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} font-sans h-full antialiased`}
    >
      <body className={`${poppins.className} min-h-full flex flex-col font-sans bg-[#FAF6F0] text-[#4F2D1C] selection:bg-[#4F2D1C] selection:text-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
