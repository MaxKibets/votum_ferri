import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";

export function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center overflow-y-auto px-4">
        <div className="w-full max-w-sm">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
