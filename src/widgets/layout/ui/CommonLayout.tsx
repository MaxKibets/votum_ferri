import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";

export function CommonLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
