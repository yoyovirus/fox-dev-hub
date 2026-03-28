import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Path Tester",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
