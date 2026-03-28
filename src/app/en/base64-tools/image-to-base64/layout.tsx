import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to Base64",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
