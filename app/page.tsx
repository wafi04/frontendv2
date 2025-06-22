"use client"

import { AuthenticatedLayout } from "@/components/layouts/authenticated";

export default function Home() {
  const { data, isLoading, error } = AuthenticatedLayout()
  console.log(data)
  return (
  <main></main>
  );
}
