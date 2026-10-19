'use client';

import { ListPlus, Plus, Trash2 } from 'lucide-react';
import { Badge, Button, IconButton, Input } from '@/components/admin/ui';
import { type Subitem } from '../services/seriesAdminService';

interface SubitemsEditorProps {
  items: Subitem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChangeItem: (index: number, field: keyof Subitem, value: string) => void;
  /** Field errors keyed `subitem-${index}-title`. */
  errors: Record<string, string>;
  titleMaxLength?: number;
}

/** Optional list of named sub-entries (poet names, alphabet letters...) with an optional link each. */
export default function SubitemsEditor({ items, onAdd, onRemove, onChangeItem, errors, titleMaxLength }: SubitemsEditorProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge tone="neutral">
          {items.length} subitem{items.length === 1 ? '' : 's'}
        </Badge>
        <Button variant="secondary" size="sm" onClick={onAdd} leftIcon={<Plus className="h-4 w-4" />}>
          Add subitem
        </Button>
      </div>

      {items.length === 0 ? (
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-sm text-stone-500 transition-colors hover:border-stone-400 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20"
        >
          <ListPlus className="h-5 w-5 text-stone-400" />
          No subitems — add poet names, alphabet letters and similar entries (optional).
        </button>
      ) : (
        <ul className="divide-y divide-stone-100 overflow-hidden rounded-xl border border-stone-200">
          {items.map((item, index) => {
            const titleError = errors[`subitem-${index}-title`];
            return (
              <li key={index} className="flex items-start gap-2 bg-white p-2.5 sm:gap-3 sm:p-3">
                <span className="mt-2.5 w-6 shrink-0 text-center text-xs font-semibold text-stone-400">{index + 1}</span>
                <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`subitem-${index}-title`} className="sr-only">
                      Subitem {index + 1} title
                    </label>
                    <Input
                      id={`subitem-${index}-title`}
                      value={item.title}
                      onChange={(e) => onChangeItem(index, 'title', e.target.value)}
                      placeholder="e.g., Ghalib, Alif"
                      maxLength={titleMaxLength}
                      invalid={!!titleError}
                      className="py-2"
                    />
                    {titleError && <p className="mt-1 text-xs text-red-600">{titleError}</p>}
                  </div>
                  <div>
                    <label htmlFor={`subitem-${index}-href`} className="sr-only">
                      Subitem {index + 1} link
                    </label>
                    <Input
                      id={`subitem-${index}-href`}
                      value={item.href || ''}
                      onChange={(e) => onChangeItem(index, 'href', e.target.value)}
                      placeholder="Link (optional)"
                      className="py-2 font-mono text-xs"
                      spellCheck={false}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <IconButton
                  label={`Remove subitem ${index + 1}`}
                  tone="danger"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => onRemove(index)}
                  className="mt-0.5"
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
