import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Relationship Visualizer",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
