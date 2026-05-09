import HostHeader from "@/components/shared/HostHeader";
import Footer from "@/components/shared/Footer";

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <HostHeader />
      <main className="pt-16 md:pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
} 