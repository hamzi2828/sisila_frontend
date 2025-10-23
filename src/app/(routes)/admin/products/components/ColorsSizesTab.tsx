"use client";
import React, { useEffect, useMemo, useState } from "react";
import { colorService, mapColor } from "../services/colorService";
import { sizeService, mapSize } from "../services/sizeService";

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

type Color = ReturnType<typeof mapColor>;
type Size = ReturnType<typeof mapSize>;

export default function ColorsSizesTab() {
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newColor, setNewColor] = useState<{ name: string; hex: string; active: boolean }>({ name: "", hex: "", active: true });
  const [newSize, setNewSize] = useState<{ name: string; active: boolean }>({ name: "", active: true });
  // Edit states
  const [editingColorId, setEditingColorId] = useState<string | null>(null);
  const [colorDraft, setColorDraft] = useState<{ name: string; hex: string }>({ name: "", hex: "" });
  const [editingSizeId, setEditingSizeId] = useState<string | null>(null);
  const [sizeDraft, setSizeDraft] = useState<{ name: string }>({ name: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [c, s] = await Promise.all([colorService.listColors(), sizeService.listSizes()]);
        if (!mounted) return;
        setColors(c);
        setSizes(s);
      } catch (e) {
        console.error("Failed to load colors/sizes", e);
        if (mounted) setError("Failed to load colors/sizes");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const activeColorCount = useMemo(() => colors.filter(c => c.active).length, [colors]);
  const activeSizeCount = useMemo(() => sizes.filter(s => s.active).length, [sizes]);

  const handleCreateColor = async () => {
    const name = newColor.name.trim();
    if (!name) return;
    const slug = slugify(name);
    try {
      const created = await colorService.createColor({ name, slug, hex: newColor.hex || "", active: newColor.active });
      setColors(prev => [created, ...prev]);
      setNewColor({ name: "", hex: "", active: true });
    } catch (e) {
      console.error("Failed to create color", e);
      alert("Failed to create color");
    }
  };

  // Edit: Color
  const startEditColor = (c: Color) => {
    setEditingColorId(c.id);
    setColorDraft({ name: c.name, hex: c.hex || "" });
  };

  const cancelEditColor = () => {
    setEditingColorId(null);
  };

  const saveEditColor = async () => {
    if (!editingColorId) return;
    const name = colorDraft.name.trim();
    if (!name) return;
    try {
      setSaving(true);
      const updated = await colorService.updateColor(editingColorId, {
        name,
        slug: slugify(name),
        hex: colorDraft.hex || "",
      });
      setColors((prev) => prev.map((c) => (c.id === editingColorId ? updated : c)));
      setEditingColorId(null);
    } catch (e) {
      console.error("Failed to update color", e);
      alert("Failed to update color");
    } finally {
      setSaving(false);
    }
  };

  // Edit: Size
  const startEditSize = (s: Size) => {
    setEditingSizeId(s.id);
    setSizeDraft({ name: s.name });
  };

  const cancelEditSize = () => {
    setEditingSizeId(null);
  };

  const saveEditSize = async () => {
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
    } catch (e) {
      console.error("Failed to update size", e);
      alert("Failed to update size");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSize = async () => {
    const name = newSize.name.trim();
    if (!name) return;
    const slug = slugify(name);
    try {
      const created = await sizeService.createSize({ name, slug, active: newSize.active });
      setSizes(prev => [created, ...prev]);
      setNewSize({ name: "", active: true });
    } catch (e) {
      console.error("Failed to create size", e);
      alert("Failed to create size");
    }
  };

  const toggleColor = async (id: string, next: boolean) => {
    const prev = colors;
    setColors(p => p.map(c => c.id === id ? { ...c, active: next } : c));
    try { await colorService.setActive(id, next); } catch (e) {
      console.error("Failed to update color", e);
      setColors(prev);
      alert("Failed to update color");
    }
  };

  const toggleSize = async (id: string, next: boolean) => {
    const prev = sizes;
    setSizes(p => p.map(s => s.id === id ? { ...s, active: next } : s));
    try { await sizeService.setActive(id, next); } catch (e) {
      console.error("Failed to update size", e);
      setSizes(prev);
      alert("Failed to update size");
    }
  };

  const deleteColor = async (id: string) => {
    const prev = colors;
    setColors(p => p.filter(c => c.id !== id));
    try { await colorService.deleteColor(id); } catch (e) {
      console.error("Failed to delete color", e);
      setColors(prev);
      alert("Failed to delete color");
    }
  };

  const deleteSize = async (id: string) => {
    const prev = sizes;
    setSizes(p => p.filter(s => s.id !== id));
    try { await sizeService.deleteSize(id); } catch (e) {
      console.error("Failed to delete size", e);
      setSizes(prev);
      alert("Failed to delete size");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Colors</h3>
              <p className="mt-1 text-sm text-gray-500">Active: {activeColorCount} / {colors.length}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={newColor.name}
              onChange={(e) => setNewColor(p => ({ ...p, name: e.target.value }))}
              placeholder="Color name"
              className="h-9 w-44 rounded-lg border border-gray-300 px-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={newColor.hex}
              onChange={(e) => setNewColor(p => ({ ...p, hex: e.target.value }))}
              placeholder="#HEX (optional)"
              className="h-9 w-40 rounded-lg border border-gray-300 px-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="button"
              aria-pressed={newColor.active}
              onClick={() => setNewColor(p => ({ ...p, active: !p.active }))}
              className={`inline-flex items-center justify-center h-8 rounded-full px-2 text-sm transition ${newColor.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow`}></span>
            </button>
            <button
              type="button"
              onClick={handleCreateColor}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >Add Color</button>
          </div>

          <div className="mt-4 divide-y divide-gray-100 border rounded-lg">
            {loading ? (
              <div className="p-3 text-sm text-gray-500">Loading…</div>
            ) : error ? (
              <div className="p-3 text-sm text-red-600">{error}</div>
            ) : colors.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">No colors yet.</div>
            ) : (
              colors.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-white">
                  {editingColorId === c.id ? (
                    <>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={colorDraft.name}
                          onChange={(e) => setColorDraft((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Name"
                          className="h-9 w-44 rounded-lg border border-gray-300 px-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          value={colorDraft.hex}
                          onChange={(e) => setColorDraft((p) => ({ ...p, hex: e.target.value }))}
                          placeholder="#HEX"
                          className="h-9 w-32 rounded-lg border border-gray-300 px-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={saveEditColor} disabled={saving} className="text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-60">Save</button>
                        <button type="button" onClick={cancelEditColor} className="text-sm text-gray-600 hover:text-gray-700">Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        {c.hex ? <span className="h-4 w-4 rounded border" style={{ backgroundColor: c.hex }} /> : null}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{c.name}</div>
                          <div className="text-xs text-gray-500">{c.slug}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-pressed={c.active}
                          onClick={() => toggleColor(c.id, !c.active)}
                          className={`inline-flex items-center justify-center h-8 rounded-full px-2 text-sm transition ${c.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                          <span className={`inline-block h-5 w-5 rounded-full bg-white shadow`}></span>
                        </button>
                        <button type="button" className="text-sm text-gray-600 hover:text-gray-700" onClick={() => startEditColor(c)}>Edit</button>
                        <button
                          type="button"
                          className="text-sm text-red-600 hover:text-red-700"
                          onClick={() => deleteColor(c.id)}
                        >Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Sizes</h3>
              <p className="mt-1 text-sm text-gray-500">Active: {activeSizeCount} / {sizes.length}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={newSize.name}
              onChange={(e) => setNewSize(p => ({ ...p, name: e.target.value }))}
              placeholder="Size label (e.g., XS)"
              className="h-9 w-44 rounded-lg border border-gray-300 px-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="button"
              aria-pressed={newSize.active}
              onClick={() => setNewSize(p => ({ ...p, active: !p.active }))}
              className={`inline-flex items-center justify-center h-8 rounded-full px-2 text-sm transition ${newSize.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow`}></span>
            </button>
            <button
              type="button"
              onClick={handleCreateSize}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >Add Size</button>
          </div>

          <div className="mt-4 divide-y divide-gray-100 border rounded-lg">
            {loading ? (
              <div className="p-3 text-sm text-gray-500">Loading…</div>
            ) : error ? (
              <div className="p-3 text-sm text-red-600">{error}</div>
            ) : sizes.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">No sizes yet.</div>
            ) : (
              sizes.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-white">
                  {editingSizeId === s.id ? (
                    <>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={sizeDraft.name}
                          onChange={(e) => setSizeDraft({ name: e.target.value })}
                          placeholder="Name"
                          className="h-9 w-44 rounded-lg border border-gray-300 px-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={saveEditSize} disabled={saving} className="text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-60">Save</button>
                        <button type="button" onClick={cancelEditSize} className="text-sm text-gray-600 hover:text-gray-700">Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{s.name}</div>
                        <div className="text-xs text-gray-500">{s.slug}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-pressed={s.active}
                          onClick={() => toggleSize(s.id, !s.active)}
                          className={`inline-flex items-center justify-center h-8 rounded-full px-2 text-sm transition ${s.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                          <span className={`inline-block h-5 w-5 rounded-full bg-white shadow`}></span>
                        </button>
                        <button type="button" className="text-sm text-gray-600 hover:text-gray-700" onClick={() => startEditSize(s)}>Edit</button>
                        <button
                          type="button"
                          className="text-sm text-red-600 hover:text-red-700"
                          onClick={() => deleteSize(s.id)}
                        >Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
