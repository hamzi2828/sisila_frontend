"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { Palette, Pencil, Plus, Ruler, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Alert,
  Button,
  ConfirmDialog,
  EmptyState,
  IconButton,
  Input,
  LoadingState,
  Switch,
} from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { colorService, mapColor } from "../services/colorService";
import { sizeService, mapSize } from "../services/sizeService";

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const isHex = (v: string) => /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v.trim());

type Color = ReturnType<typeof mapColor>;
type Size = ReturnType<typeof mapSize>;
type DeleteTarget = { kind: "color" | "size"; id: string; name: string };

function Swatch({ hex, className }: { hex?: string; className?: string }) {
  const valid = !!hex && isHex(hex);
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block shrink-0 rounded-md border",
        valid ? "border-stone-300" : "border-dashed border-stone-300 bg-white",
        className
      )}
      style={valid ? { backgroundColor: hex } : undefined}
    />
  );
}

function Panel({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle: ReactNode;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-stone-200 bg-white">
      <div className="flex items-center gap-3 border-b border-stone-200 px-3 py-3 sm:px-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-stone-900">{title}</h3>
          <p className="text-xs text-stone-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function ActiveSwitch({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <span title={checked ? "Active – click to deactivate" : "Inactive – click to activate"} className="inline-flex">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Switch id={id} checked={checked} onChange={onChange} />
    </span>
  );
}

export default function ColorsSizesTab() {
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newColor, setNewColor] = useState<{ name: string; hex: string; active: boolean }>({ name: "", hex: "", active: true });
  const [newSize, setNewSize] = useState<{ name: string; active: boolean }>({ name: "", active: true });
  const [creatingColor, setCreatingColor] = useState(false);
  const [creatingSize, setCreatingSize] = useState(false);
  // Edit states
  const [editingColorId, setEditingColorId] = useState<string | null>(null);
  const [colorDraft, setColorDraft] = useState<{ name: string; hex: string }>({ name: "", hex: "" });
  const [editingSizeId, setEditingSizeId] = useState<string | null>(null);
  const [sizeDraft, setSizeDraft] = useState<{ name: string }>({ name: "" });
  const [saving, setSaving] = useState(false);
  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async (isMounted: () => boolean = () => true) => {
    try {
      setLoading(true);
      setError(null);
      const [c, s] = await Promise.all([colorService.listColors(), sizeService.listSizes()]);
      if (!isMounted()) return;
      setColors(c);
      setSizes(s);
    } catch (e) {
      console.error("Failed to load colors/sizes", e);
      if (isMounted()) setError("Failed to load colors and sizes.");
    } finally {
      if (isMounted()) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    load(() => mounted);
    return () => {
      mounted = false;
    };
  }, [load]);

  const activeColorCount = useMemo(() => colors.filter((c) => c.active).length, [colors]);
  const activeSizeCount = useMemo(() => sizes.filter((s) => s.active).length, [sizes]);

  const handleCreateColor = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const name = newColor.name.trim();
    if (!name || creatingColor) return;
    const slug = slugify(name);
    if (colors.some((c) => c.slug === slug)) {
      toast.error(`"${name}" already exists`);
      return;
    }
    try {
      setCreatingColor(true);
      const created = await colorService.createColor({ name, slug, hex: newColor.hex.trim() || "", active: newColor.active });
      setColors((prev) => [created, ...prev]);
      setNewColor({ name: "", hex: "", active: true });
      toast.success(`Color "${created.name}" added`);
    } catch (err) {
      console.error("Failed to create color", err);
      toast.error("Failed to create color");
    } finally {
      setCreatingColor(false);
    }
  };

  // Edit: Color
  const startEditColor = (c: Color) => {
    setEditingSizeId(null);
    setEditingColorId(c.id);
    setColorDraft({ name: c.name, hex: c.hex || "" });
  };

  const saveEditColor = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!editingColorId) return;
    const name = colorDraft.name.trim();
    if (!name) return;
    try {
      setSaving(true);
      const updated = await colorService.updateColor(editingColorId, {
        name,
        slug: slugify(name),
        hex: colorDraft.hex.trim() || "",
      });
      setColors((prev) => prev.map((c) => (c.id === editingColorId ? updated : c)));
      setEditingColorId(null);
      toast.success("Color updated");
    } catch (err) {
      console.error("Failed to update color", err);
      toast.error("Failed to update color");
    } finally {
      setSaving(false);
    }
  };

  // Edit: Size
  const startEditSize = (s: Size) => {
    setEditingColorId(null);
    setEditingSizeId(s.id);
    setSizeDraft({ name: s.name });
  };

  const saveEditSize = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!editingSizeId) return;
    const name = sizeDraft.name.trim();
    if (!name) return;
    try {
      setSaving(true);
      const updated = await sizeService.updateSize(editingSizeId, {
        name,
        slug: slugify(name),
      });
      setSizes((prev) => prev.map((s) => (s.id === editingSizeId ? updated : s)));
      setEditingSizeId(null);
      toast.success("Size updated");
    } catch (err) {
      console.error("Failed to update size", err);
      toast.error("Failed to update size");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSize = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const name = newSize.name.trim();
    if (!name || creatingSize) return;
    const slug = slugify(name);
    if (sizes.some((s) => s.slug === slug)) {
      toast.error(`"${name}" already exists`);
      return;
    }
    try {
      setCreatingSize(true);
      const created = await sizeService.createSize({ name, slug, active: newSize.active });
      setSizes((prev) => [created, ...prev]);
      setNewSize({ name: "", active: true });
      toast.success(`Size "${created.name}" added`);
    } catch (err) {
      console.error("Failed to create size", err);
      toast.error("Failed to create size");
    } finally {
      setCreatingSize(false);
    }
  };

  const toggleColor = async (id: string, next: boolean) => {
    const prev = colors;
    setColors((p) => p.map((c) => (c.id === id ? { ...c, active: next } : c)));
    try {
      await colorService.setActive(id, next);
    } catch (err) {
      console.error("Failed to update color", err);
      setColors(prev);
      toast.error("Failed to update color");
    }
  };

  const toggleSize = async (id: string, next: boolean) => {
    const prev = sizes;
    setSizes((p) => p.map((s) => (s.id === id ? { ...s, active: next } : s)));
    try {
      await sizeService.setActive(id, next);
    } catch (err) {
      console.error("Failed to update size", err);
      setSizes(prev);
      toast.error("Failed to update size");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { kind, id, name } = deleteTarget;
    setDeleting(true);
    try {
      if (kind === "color") {
        await colorService.deleteColor(id);
        setColors((p) => p.filter((c) => c.id !== id));
      } else {
        await sizeService.deleteSize(id);
        setSizes((p) => p.filter((s) => s.id !== id));
      }
      toast.success(`${kind === "color" ? "Color" : "Size"} "${name}" deleted`);
      setDeleteTarget(null);
    } catch (err) {
      console.error(`Failed to delete ${kind}`, err);
      toast.error(`Failed to delete ${kind}`);
    } finally {
      setDeleting(false);
    }
  };

  const listBody = (kind: "color" | "size", count: number, rows: ReactNode) => {
    if (loading && count === 0) return <LoadingState label={`Loading ${kind}s...`} />;
    if (error && count === 0) {
      return (
        <div className="p-3 sm:p-4">
          <Alert tone="error" title={`Couldn't load ${kind}s`} onRetry={() => load()}>
            {error}
          </Alert>
        </div>
      );
    }
    if (count === 0) {
      return (
        <EmptyState
          icon={kind === "color" ? Palette : Ruler}
          title={`No ${kind}s yet`}
          description={`Add your first ${kind} above.`}
          className="py-10"
        />
      );
    }
    return <ul className="divide-y divide-stone-100">{rows}</ul>;
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-3 sm:gap-6 sm:p-6 xl:grid-cols-2">
      {/* Colors */}
      <Panel
        title="Colors"
        icon={Palette}
        subtitle={loading && colors.length === 0 ? "Loading..." : `${activeColorCount} of ${colors.length} active`}
      >
        <form onSubmit={handleCreateColor} className="flex flex-wrap items-center gap-2 border-b border-stone-200 bg-stone-50/60 p-3 sm:p-4">
          <Input
            aria-label="New color name"
            type="text"
            value={newColor.name}
            onChange={(e) => setNewColor((p) => ({ ...p, name: e.target.value }))}
            placeholder="Color name"
            className="min-w-0 py-2"
            style={{ flex: "1 1 9rem" }}
          />
          <div className="w-[8.5rem] shrink-0">
            <Input
              aria-label="New color hex code (optional)"
              type="text"
              value={newColor.hex}
              onChange={(e) => setNewColor((p) => ({ ...p, hex: e.target.value }))}
              placeholder="#HEX"
              prefix={<Swatch hex={newColor.hex} className="h-4 w-4" />}
              className="py-2"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-stone-600">
              <Switch checked={newColor.active} onChange={(v) => setNewColor((p) => ({ ...p, active: v }))} />
              Active
            </label>
            <Button type="submit" leftIcon={<Plus className="h-4 w-4" />} loading={creatingColor} disabled={!newColor.name.trim()}>
              Add
            </Button>
          </div>
        </form>

        {listBody(
          "color",
          colors.length,
          colors.map((c) =>
            editingColorId === c.id ? (
              <li key={c.id} className="bg-stone-50 px-3 py-3 sm:px-4">
                <form onSubmit={saveEditColor} className="flex flex-wrap items-center gap-2">
                  <Input
                    aria-label="Color name"
                    type="text"
                    value={colorDraft.name}
                    onChange={(e) => setColorDraft((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Name"
                    className="min-w-0 py-2"
                    style={{ flex: "1 1 8rem" }}
                    autoFocus
                  />
                  <div className="w-[8.5rem] shrink-0">
                    <Input
                      aria-label="Color hex code"
                      type="text"
                      value={colorDraft.hex}
                      onChange={(e) => setColorDraft((p) => ({ ...p, hex: e.target.value }))}
                      placeholder="#HEX"
                      prefix={<Swatch hex={colorDraft.hex} className="h-4 w-4" />}
                      className="py-2"
                    />
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setEditingColorId(null)} disabled={saving}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" loading={saving} disabled={!colorDraft.name.trim()}>
                      Save
                    </Button>
                  </div>
                </form>
              </li>
            ) : (
              <li key={c.id} className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-stone-50 sm:px-4">
                <Swatch hex={c.hex} className="h-8 w-8 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-sm font-medium", c.active ? "text-stone-900" : "text-stone-500")}>{c.name}</p>
                  <p className="truncate text-xs text-stone-500">
                    {c.hex ? c.hex.toUpperCase() : "No hex"} · {c.slug}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                  <span className="mr-1 inline-flex">
                    <ActiveSwitch
                      id={`color-active-${c.id}`}
                      label={`${c.active ? "Deactivate" : "Activate"} ${c.name}`}
                      checked={c.active}
                      onChange={(v) => toggleColor(c.id, v)}
                    />
                  </span>
                  <IconButton label="Edit color" size="sm" icon={<Pencil className="h-4 w-4" />} onClick={() => startEditColor(c)} />
                  <IconButton
                    label="Delete color"
                    size="sm"
                    tone="danger"
                    icon={<Trash2 className="h-4 w-4" />}
                    onClick={() => setDeleteTarget({ kind: "color", id: c.id, name: c.name })}
                  />
                </div>
              </li>
            )
          )
        )}
      </Panel>

      {/* Sizes */}
      <Panel
        title="Sizes"
        icon={Ruler}
        subtitle={loading && sizes.length === 0 ? "Loading..." : `${activeSizeCount} of ${sizes.length} active`}
      >
        <form onSubmit={handleCreateSize} className="flex flex-wrap items-center gap-2 border-b border-stone-200 bg-stone-50/60 p-3 sm:p-4">
          <Input
            aria-label="New size label"
            type="text"
            value={newSize.name}
            onChange={(e) => setNewSize((p) => ({ ...p, name: e.target.value }))}
            placeholder="Size label (e.g. XS)"
            className="min-w-0 py-2"
            style={{ flex: "1 1 9rem" }}
          />
          <div className="ml-auto flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-stone-600">
              <Switch checked={newSize.active} onChange={(v) => setNewSize((p) => ({ ...p, active: v }))} />
              Active
            </label>
            <Button type="submit" leftIcon={<Plus className="h-4 w-4" />} loading={creatingSize} disabled={!newSize.name.trim()}>
              Add
            </Button>
          </div>
        </form>

        {listBody(
          "size",
          sizes.length,
          sizes.map((s) =>
            editingSizeId === s.id ? (
              <li key={s.id} className="bg-stone-50 px-3 py-3 sm:px-4">
                <form onSubmit={saveEditSize} className="flex flex-wrap items-center gap-2">
                  <Input
                    aria-label="Size label"
                    type="text"
                    value={sizeDraft.name}
                    onChange={(e) => setSizeDraft({ name: e.target.value })}
                    placeholder="Name"
                    className="min-w-0 py-2"
                    style={{ flex: "1 1 8rem" }}
                    autoFocus
                  />
                  <div className="ml-auto flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setEditingSizeId(null)} disabled={saving}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" loading={saving} disabled={!sizeDraft.name.trim()}>
                      Save
                    </Button>
                  </div>
                </form>
              </li>
            ) : (
              <li key={s.id} className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-stone-50 sm:px-4">
                <span className="flex h-8 min-w-[2rem] shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 px-1.5 text-xs font-semibold text-stone-700">
                  {s.name.length <= 4 ? s.name : s.name.slice(0, 3)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-sm font-medium", s.active ? "text-stone-900" : "text-stone-500")}>{s.name}</p>
                  {s.slug !== s.name.toLowerCase() && <p className="truncate text-xs text-stone-500">{s.slug}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                  <span className="mr-1 inline-flex">
                    <ActiveSwitch
                      id={`size-active-${s.id}`}
                      label={`${s.active ? "Deactivate" : "Activate"} ${s.name}`}
                      checked={s.active}
                      onChange={(v) => toggleSize(s.id, v)}
                    />
                  </span>
                  <IconButton label="Edit size" size="sm" icon={<Pencil className="h-4 w-4" />} onClick={() => startEditSize(s)} />
                  <IconButton
                    label="Delete size"
                    size="sm"
                    tone="danger"
                    icon={<Trash2 className="h-4 w-4" />}
                    onClick={() => setDeleteTarget({ kind: "size", id: s.id, name: s.name })}
                  />
                </div>
              </li>
            )
          )
        )}
      </Panel>

      <ConfirmDialog
        open={!!deleteTarget}
        title={deleteTarget?.kind === "size" ? "Delete size?" : "Delete color?"}
        message={
          deleteTarget ? (
            <>
              <span className="font-semibold text-stone-900">{deleteTarget.name}</span> will be removed from the list of{" "}
              {deleteTarget.kind}s. Existing products keep their variants. This can&apos;t be undone.
            </>
          ) : null
        }
        confirmLabel={deleteTarget?.kind === "size" ? "Delete size" : "Delete color"}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
