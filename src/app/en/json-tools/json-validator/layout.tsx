import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Validator",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
