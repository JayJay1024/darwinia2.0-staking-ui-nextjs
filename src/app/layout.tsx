import { RainbowProvider } from "@/providers";
import "./globals.css";
import { JetBrains_Mono } from "next/font/google";

const fontJetBrainsMono = JetBrains_Mono({ subsets: ["latin", "latin-ext"] });

export const metadata = {
  title: "Darwinia Staking",
  description: "Darwinia and Crab network staking app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-app-black text-white">
      <body className={fontJetBrainsMono.className}>
        <RainbowProvider>{children}</RainbowProvider>
      </body>
    </html>
  );
}
