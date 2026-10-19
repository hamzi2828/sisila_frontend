"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, BarChart3, Calendar, Eye, RefreshCw } from "lucide-react";
import { ConfirmDialog, StatusBadge } from "@/components/admin/ui";
import BlogForm, { BlogFormData } from "./BlogForm";
import { Blog } from "./AllBlogs";

interface EditBlogProps {
  blog: Blog;
  onUpdate: (updatedBlog: Blog) => void;
  onCancel: () => void;
}

const formatDate = (value?: string, fallback = "Unknown") =>
  value ? new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : fallback;

export default function EditBlog({ blog, onUpdate, onCancel }: EditBlogProps) {
  const [hasChanges, setHasChanges] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const handleBlogUpdated = (updatedBlog: BlogFormData) => {
    // Transform the updated blog to match the Blog interface
    const transformedBlog: Blog = {
      id: updatedBlog.id!,
      title: updatedBlog.title,
      content: updatedBlog.content,
      category: updatedBlog.category || blog.category,
      categoryId: updatedBlog.categoryId,
      status: updatedBlog.status,
      featured: blog.featured,
      image: updatedBlog.image,
      thumbnail: updatedBlog.thumbnail,
      slug: updatedBlog.slug,
      views: blog.views,
      tags: updatedBlog.tags,
      createdAt: blog.createdAt,
      updatedAt: new Date().toISOString(),
      author: {
        _id: updatedBlog.authorId,
        name: updatedBlog.authorName
      }
    };

    setHasChanges(false);
    onUpdate(transformedBlog);
  };

  const handleCancel = () => {
    if (hasChanges) {
      setConfirmLeave(true);
      return;
    }
    onCancel();
  };

  // Handle browser back button and page refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    if (hasChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasChanges]);

  const infoTiles = [
    { label: "Created", value: formatDate(blog.createdAt), icon: Calendar },
    { label: "Last Updated", value: formatDate(blog.updatedAt, "Never"), icon: RefreshCw },
    { label: "Views", value: String(blog.views || 0), icon: Eye },
  ];

  return (
    <>
      {/* Header (same shape as PageHeader, with a back button that checks for unsaved changes) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            aria-label="Back to blogs"
            title="Back to blogs"
            className="shrink-0 rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-stone-900 sm:text-2xl">Edit Blog</h1>
            <p className="mt-0.5 truncate text-xs text-stone-500 sm:mt-1 sm:text-sm">
              Editing: <span className="font-medium text-stone-700">{blog.title}</span>
            </p>
          </div>
        </div>
        {hasChanges && (
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" aria-hidden />
            Unsaved changes
          </span>
        )}
      </div>

      <BlogForm
        mode="edit"
        initialData={{
          ...blog,
          author: blog.author || { _id: "", name: "" }
        }}
        onSubmit={handleBlogUpdated}
        onChangeDetected={setHasChanges}
        onCancel={handleCancel}
      />

      {/* Blog Information */}
      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <h3 className="mb-4 text-base font-semibold text-stone-900">Blog Information</h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {infoTiles.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
              <span className="rounded-lg bg-white p-2 text-stone-600 ring-1 ring-stone-200">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-stone-500">{label}</p>
                <p className="truncate text-sm font-medium text-stone-900">{value}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
            <span className="rounded-lg bg-white p-2 text-stone-600 ring-1 ring-stone-200">
              <BarChart3 className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-stone-500">Status</p>
              <StatusBadge status={blog.status} size="sm" className="mt-0.5" />
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-stone-400">Blog ID: {blog.id}</p>
      </div>

      <ConfirmDialog
        open={confirmLeave}
        title="Discard unsaved changes?"
        message="You have unsaved changes to this blog. If you leave now they will be lost."
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        onCancel={() => setConfirmLeave(false)}
        onConfirm={() => {
          setConfirmLeave(false);
          setHasChanges(false);
          onCancel();
        }}
      />
    </>
  );
}
