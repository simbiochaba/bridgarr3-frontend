import { Inter } from "next/font/google";
import { Connect } from "@stacks/connect-react";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bridgarr - Decentralized Escrow",
  description: "Secure escrow service built on Stacks blockchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Connect>
            {children}
          </Connect>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}