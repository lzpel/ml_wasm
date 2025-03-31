import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ml_wasm",
  description: "機械学習一覧",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <body>
        {children}
      </body>
    </html>
  );
}
