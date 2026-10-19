'use client';

import { Layers } from 'lucide-react';
import { type Theme } from '../services/themeAdminService';
import { CollectionGrid } from './collection/CollectionGrid';

interface AllThemesProps {
  themes: Theme[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, newStatus: boolean) => Promise<void>;
  onCreate: () => void;
  onRetry: () => void;
  loading: boolean;
  error: string | null;
}

export default function AllThemes({ themes, onEdit, onDelete, onToggleStatus, onCreate, onRetry, loading, error }: AllThemesProps) {
  return (
    <CollectionGrid
      items={themes}
      loading={loading}
      error={error}
      onRetry={onRetry}
      onCreate={onCreate}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleStatus={onToggleStatus}
      noun="theme"
      nounPlural="themes"
      emptyIcon={Layers}
      emptyDescription="Create your first theme to showcase a creative pillar on the storefront."
    />
  );
}
