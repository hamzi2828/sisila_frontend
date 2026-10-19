"use client";
import React from "react";
import { LoadingState as AdminLoadingState } from "@/components/admin/ui";

export default function LoadingState({ label = "Loading products..." }: { label?: string }) {
  return <AdminLoadingState label={label} />;
}
