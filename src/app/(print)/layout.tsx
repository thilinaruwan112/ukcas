
import type { ReactNode } from "react";

// This is a special layout for print-only pages.
// It ensures no headers, footers, or other UI elements are rendered.
export default function PrintLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
