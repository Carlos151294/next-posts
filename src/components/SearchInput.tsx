"use client";

import { search } from "@/actions";
import { Input } from "@heroui/react";
import { useSearchParams } from "next/navigation";

export default function SearchInput() {
  const searchParams = useSearchParams();

  return (
    <form action={search}>
      <Input name="term" defaultValue={searchParams.get("term") ?? ""} />
    </form>
  );
}
