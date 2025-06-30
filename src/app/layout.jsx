import { Toaster } from "react-hot-toast";
import vazirFont from "@/constants/localFont";
import "../style/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: {
    template: "%s | VPNVIP",
    default: "اطلاعات کاربران",
  },
  description: "وب اپلیکیشن مدیریت  کاربران VPNVIP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className="dark-mode">
      <body className={`font-sans ${vazirFont.variable} min-h-screen `}>
        <Header />
        <Toaster />

        <div>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
