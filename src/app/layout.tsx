import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitMirror｜AI Virtual Try-On Studio",
  description: "根据身型、姿势和服装尺寸生成视觉试穿参考",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
