import type { Metadata } from "next";
import { geistMono, geistSans } from "@/app/config/fonts";
import "@/app/styles/globals.css";

export const metadata: Metadata = {
	title: "Votum Ferri",
	description: "Votum Ferri application",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
