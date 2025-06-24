import { AdminLayout } from "@/components/layouts/adminLayout";
import { ReactNode } from "react";

export default function Page({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
