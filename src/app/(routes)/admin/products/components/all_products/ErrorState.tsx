"use client";
import React from "react";
import { Alert } from "@/components/admin/ui";

interface ErrorStateProps {
  error: string;
  title?: string;
  onRetry?: () => void;
}

export default function ErrorState({ error, title = "Couldn't load products", onRetry }: ErrorStateProps) {
  return (
    <Alert tone="error" title={title} onRetry={onRetry}>
      {error}
    </Alert>
  );
}
