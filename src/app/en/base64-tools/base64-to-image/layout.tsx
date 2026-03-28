import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 to Image",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
