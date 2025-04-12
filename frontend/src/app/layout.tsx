import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SocketProvider } from "./context/SocketProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Real-time Chat App",
  description: "Real-time chat application with Socket.io",
};

// クライアントサイドコンポーネントを含むレイアウトコンポーネント
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <SocketProvider>
          <main className="min-h-screen">{children}</main>
        </SocketProvider>
      </body>
    </html>
  );
}
