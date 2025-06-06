import { Sora as SoraFont } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import NextTopLoader from 'nextjs-toploader';
import ScrollToTop from "@/components/shared/ScrollToTop";


const sora = SoraFont({ subsets: ["latin"] });

export const metadata = {
  title: "PCCOJ - An Online Judge for Programming Contest Club,CSE-UAP",
  description: "An Online Judge for Programming Contest Club,CSE-UAP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={sora.className} >
        <Navbar />
        <NextTopLoader />
        {children}
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}
