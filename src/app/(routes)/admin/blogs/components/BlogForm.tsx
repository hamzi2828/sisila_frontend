"use client";
import React, { useState, useEffect } from "react";
import type { JSX } from "react";
import Image from "next/image";
import blogCategoryService from "../services/blogCategoryService";
import blogService from "../services/blogService";
import authorService, { Author } from "../services/authorService";
import { toast } from "react-hot-toast";
import type { Blog as BaseBlog } from "./AllBlogs";
import RichTextEditor from "./RichTextEditor";

// Extend the Blog interface to include author property from blogService
interface Blog extends BaseBlog {
  author: {
    _id: string;
    name?: string;
  };
}

// Extended Blog type with all fields from backend
interface ExtendedBlog extends Blog {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaSchema?: string;
}

interface BlogCategory {
  id: string;
  name: string;
}

type FileWithPreview = {
  file: File;
  preview: string;
};

export type BlogFormData = {
  id?: string;
  title: string;
  slug: string;
  content?: string;
  categoryId: string;
  category?: string;
  authorId: string;
  authorName?: string;
  status: "published" | "draft";
  image: string;
  thumbnail?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaSchema?: string;
};

interface BlogFormProps {
  mode: "create" | "edit";
  initialData?: Blog;
  onSubmit: (data: BlogFormData) => void;
  onChangeDetected?: (hasChanges: boolean) => void;
}

export default function BlogForm({ 
  mode, 
  initialData, 
  onSubmit, 
  onChangeDetected 
}: BlogFormProps): JSX.Element {
  const [form, setForm] = useState<BlogFormData>({
    id: initialData?.id || "",
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    categoryId: initialData?.categoryId || "",
    category: initialData?.category || "",
    authorId: initialData?.author?._id || "",
    authorName: initialData?.author?.name || "",
    status: initialData?.status || "draft",
    image: initialData?.image || "",
    thumbnail: initialData?.thumbnail,
    tags: initialData?.tags || [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    metaSchema: ""
  });

  console.log("initialData", initialData);
  const [originalForm, setOriginalForm] = useState<BlogFormData | null>(null);
  const [coverImage, setCoverImage] = useState<FileWithPreview | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<FileWithPreview | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");

  const META_TITLE_LIMIT = 60;
  const META_DESC_LIMIT = 155;

  const isValidJson = (val: string) => {
    if (!val.trim()) return true;
    try {
      const parsed = JSON.parse(val);
      return typeof parsed === "object";
    } catch {
      return false;
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories and authors
        const [categoriesData, authorsData] = await Promise.all([
          blogCategoryService.getAllCategories(),
          authorService.getAuthorsForDropdown()
        ]);
        
        setCategories(
          categoriesData.map((cat: BlogCategory) => ({
            id: cat.id,
            name: cat.name,
          }))
        );
        
        setAuthors(authorsData);

        // If editing, load full blog details to get SEO fields
        if (mode === "edit" && initialData?.id) {
          const fullBlog = await blogService.getBlogById(initialData.id);
          console.log("fullBlog", fullBlog);
          const updatedForm = {
            ...form,
            content: fullBlog.content || "",
            authorId: fullBlog.author?._id || "",
            author: fullBlog.author?.name || "", // Will be populated from authors list
            metaTitle: (fullBlog as ExtendedBlog).metaTitle || "",
            metaDescription: (fullBlog as ExtendedBlog).metaDescription || "",
            metaKeywords: (fullBlog as ExtendedBlog).metaKeywords || "",
            metaSchema: (fullBlog as ExtendedBlog).metaSchema || "",
            tags: fullBlog.tags || [],
          };
          
          setForm(updatedForm);
          setOriginalForm(updatedForm);
        } else {
          // For create mode, set original form to current form
          setOriginalForm(form);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      }
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, initialData?.id]);

  // Update author name when authors are loaded or authorId changes
  useEffect(() => {
    if (form.authorId && authors.length > 0) {
      const selectedAuthor = authors.find(author => author.id === form.authorId);
      if (selectedAuthor) {
        setForm(prev => ({ ...prev, authorName: selectedAuthor.name }));
      }
    }
  }, [form.authorId, authors]);

  // Check for changes
  useEffect(() => {
    if (originalForm && onChangeDetected) {
      const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm) || 
                        coverImage !== null || thumbnailImage !== null;
      onChangeDetected(hasChanges);
    }
  }, [form, originalForm, coverImage, thumbnailImage, onChangeDetected]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title?.trim()) e.title = "Title is required";
    if (!form.slug?.trim()) e.slug = "Slug is required";
    if (!/^[a-z0-9-]+$/.test(form.slug)) e.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    if (!form.categoryId) e.categoryId = "Category is required";
    if (!form.authorId) e.authorId = "Author is required";
    if (!form.content?.trim()) e.content = "Content is required";

    // For create mode, require cover image
    if (mode === "create" && !coverImage && !form.image.trim()) {
      e.image = "Cover image is required";
    }

    // SEO validations
    if (form.metaTitle && form.metaTitle.length > META_TITLE_LIMIT) {
      e.metaTitle = `Keep under ${META_TITLE_LIMIT} characters`;
    }
    if (form.metaDescription && form.metaDescription.length > META_DESC_LIMIT) {
      e.metaDescription = `Keep under ${META_DESC_LIMIT} characters`;
    }
    if (!isValidJson(form.metaSchema || "")) {
      e.metaSchema = "Meta Schema must be valid JSON (JSON-LD).";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "cover" | "thumbnail") => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const fileWithPreview: FileWithPreview = { file, preview: reader.result as string };
      if (type === "cover") {
        setCoverImage(fileWithPreview);
        setForm((prev) => ({ ...prev, image: file.name }));
      } else {
        setThumbnailImage(fileWithPreview);
      }
    };
    reader.onerror = () => toast.error("Error reading file");
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      if (errors.metaTitle || errors.metaDescription || errors.metaSchema) setActiveTab("seo");
      return;
    }

    setIsLoading(true);
    try {
      // Auto-fill empty metaTitle/Description from Title/Content (best-effort)
      const fallbackMetaTitle = (form.metaTitle || form.title || "").slice(0, META_TITLE_LIMIT);
      const fallbackMetaDescription =
        (form.metaDescription ||
          (form.content || "")
            .replace(/\s+/g, " ")
            .slice(0, META_DESC_LIMIT)) ?? "";

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("slug", form.slug);
      formData.append("content", form.content || "");
      formData.append("categoryId", form.categoryId);
      formData.append("authorId", form.authorId || "");
      formData.append("status", form.status);

      // Handle tags
      if (form.tags && form.tags.length > 0) {
        formData.append("tags", form.tags.join(","));
      }

      // SEO fields
      formData.append("metaTitle", fallbackMetaTitle);
      formData.append("metaDescription", fallbackMetaDescription);
      formData.append("metaKeywords", form.metaKeywords || "");
      formData.append("metaSchema", form.metaSchema || "");

      // Handle file uploads
      if (coverImage) formData.append("image", coverImage.file);
      if (thumbnailImage) formData.append("thumbnail", thumbnailImage.file);

      let result: ExtendedBlog;
      if (mode === "create") {
        result = await blogService.createBlog(formData);
      } else {
        result = await blogService.updateBlog(form.id!, formData);
      }

      // Prepare data for parent component
      const submitData: BlogFormData = {
        ...form,
        category: categories.find((cat) => cat.id === form.categoryId)?.name || form.category,
        authorName: authors.find((author) => author.id === form.authorId)?.name || form.authorName,
        image: result.image || form.image,
        thumbnail: result.thumbnail || form.thumbnail,
        metaTitle: fallbackMetaTitle,
        metaDescription: fallbackMetaDescription,
      };

      onSubmit(submitData);

      // Reset form for create mode
      if (mode === "create") {
        setForm({
          title: "",
          slug: "",
          content: "",
          categoryId: "",
          authorId: "",
          authorName: "",
          status: "draft",
          image: "",
          thumbnail: undefined,
          tags: [],
          metaTitle: "",
          metaDescription: "",
          metaKeywords: "",
          metaSchema: "",
        });
        setCoverImage(null);
        setThumbnailImage(null);
      }
      
      setErrors({});
      toast.success(`Blog ${mode === "create" ? "created" : "updated"} successfully!`);
    } catch (error) {
      console.error(`Error ${mode === "create" ? "creating" : "updating"} blog:`, error);
      toast.error(`Failed to ${mode} blog`);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (text: string): string =>
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
      .slice(0, 60);

  const setField = <K extends keyof BlogFormData>(key: K, value: BlogFormData[K]) => {
    setForm((prev) => {
      if (key === "title" && typeof value === "string") {
        const slug = generateSlug(value);
        const metaTitle = prev.metaTitle ? prev.metaTitle : value.slice(0, META_TITLE_LIMIT);
        return { ...prev, [key]: value, slug, metaTitle };
      }
      return { ...prev, [key]: value };
    });
  };

  const handleTagsChange = (tagsString: string) => {
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setField("tags", tagsArray);
  };

  const previewTitle = (form.metaTitle || form.title || "").slice(0, META_TITLE_LIMIT);
  const previewUrl = `/blog/${form.slug || "your-slug"}`;
  const previewDesc = (form.metaDescription ||
    (form.content || "").replace(/\s+/g, " ").slice(0, META_DESC_LIMIT)) as string;

  const currentImageUrl = coverImage 
    ? coverImage.preview 
    : form.image 
    ? form.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${form.image}` : form.image
    : '';

  const currentThumbnailUrl = thumbnailImage
    ? thumbnailImage.preview
    : form.thumbnail
    ? form.thumbnail.startsWith('/') ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${form.thumbnail}` : form.thumbnail
    : '';

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {mode === "create" ? "Create Blog" : "Edit Blog"}
        </h3>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { key: "content", label: "Content" },
              { key: "seo", label: "SEO" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key as "content" | "seo")}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === t.key
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* CONTENT TAB */}
        {activeTab === "content" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                placeholder="e.g., 10 Tips to Improve Your Workout"
                className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">URL Slug</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  /blog/
                </span>
                <input
                  type="text"
                  className={`block w-full min-w-0 flex-1 rounded-none rounded-r-md px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    mode === "create" 
                      ? "border-gray-200 bg-gray-50 text-gray-500 focus:ring-0" 
                      : "border-gray-300"
                  }`}
                  value={form.slug}
                  onChange={(e) => setField("slug", e.target.value)}
                  placeholder="auto-generated-from-title"
                  readOnly={mode === "create"}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Only letters, numbers, and hyphens.</p>
              {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={form.categoryId}
                onChange={(e) => setField("categoryId", e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
              {mode === "edit" && (
                <div className="mt-1 text-xs text-gray-500">
                  Current category ID: {form.categoryId || "None selected"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Author</label>
              <select
                className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={form.authorId}
                onChange={(e) => setField("authorId", e.target.value)}
                required
              >
                <option value="" disabled>
                  Select an author
                </option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
              {errors.authorId && <p className="mt-1 text-sm text-red-600">{errors.authorId}</p>}
              {mode === "edit" && (
                <div className="mt-1 text-xs text-gray-500">
                  Current author ID: {form.authorId || "None selected"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={form.status}
                onChange={(e) => setField("status", e.target.value as BlogFormData["status"])}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g., fitness, workout, health"
                className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                value={form.tags?.join(", ") || ""}
                onChange={(e) => handleTagsChange(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <RichTextEditor
                value={form.content || ""}
                onChange={(content) => setField("content", content)}
                placeholder="Write your blog content here..."
                error={errors.content}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Cover Image</label>
              <div className="mt-1 flex items-center">
                <label className="cursor-pointer">
                  <span className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {mode === "create" 
                      ? "Upload Cover Image" 
                      : coverImage 
                        ? "Change Cover Image" 
                        : "Upload New Cover Image"
                    }
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "cover")}
                    />
                  </span>
                </label>
                {coverImage && <span className="ml-4 text-sm text-gray-500">{coverImage.file.name}</span>}
              </div>
              {currentImageUrl && (
                <div className="mt-2 relative h-32 w-full">
                  <Image
                    src={currentImageUrl}
                    alt="Cover preview"
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              )}
              {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Thumbnail Image (Optional)</label>
              <div className="mt-1 flex items-center">
                <label className="cursor-pointer">
                  <span className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {mode === "create" 
                      ? "Upload Thumbnail" 
                      : thumbnailImage 
                        ? "Change Thumbnail" 
                        : "Upload New Thumbnail"
                    }
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "thumbnail")}
                    />
                  </span>
                </label>
                {thumbnailImage && <span className="ml-4 text-sm text-gray-500">{thumbnailImage.file.name}</span>}
              </div>
              {currentThumbnailUrl && (
                <div className="mt-2 relative h-24 w-24">
                  <Image
                    src={currentThumbnailUrl}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover rounded"
                    sizes="96px"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEO TAB */}
        {activeTab === "seo" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Meta Title <span className="text-gray-400">({(form.metaTitle || "").length}/{META_TITLE_LIMIT})</span>
              </label>
              <input
                type="text"
                placeholder="Keep it under ~60 characters, include primary keyword"
                className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                value={form.metaTitle || ""}
                onChange={(e) => setField("metaTitle", e.target.value)}
                maxLength={120}
              />
              {errors.metaTitle && <p className="mt-1 text-sm text-red-600">{errors.metaTitle}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Meta Description{" "}
                <span className="text-gray-400">({(form.metaDescription || "").length}/{META_DESC_LIMIT})</span>
              </label>
              <textarea
                rows={3}
                placeholder="Compelling summary under ~155 characters"
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                value={form.metaDescription || ""}
                onChange={(e) => setField("metaDescription", e.target.value)}
                maxLength={320}
              />
              {errors.metaDescription && <p className="mt-1 text-sm text-red-600">{errors.metaDescription}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Meta Keywords (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g., fitness tips, workout guide, health"
                className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                value={form.metaKeywords || ""}
                onChange={(e) => setField("metaKeywords", e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Meta Schema (JSON-LD)</label>
              <textarea
                rows={8}
                placeholder='Paste valid JSON-LD here. Example: {"@context":"https://schema.org","@type":"BlogPosting",...}'
                className={`mt-1 w-full rounded-md border px-3 py-2 text-sm font-mono ${
                  errors.metaSchema ? "border-red-300 focus:border-red-400 focus:ring-red-200" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
                value={form.metaSchema || ""}
                onChange={(e) => setField("metaSchema", e.target.value)}
              />
              {errors.metaSchema && <p className="mt-1 text-sm text-red-600">{errors.metaSchema}</p>}
            </div>

            {/* Google Preview */}
            <div className="sm:col-span-2">
              <div className="rounded-md border border-gray-200 p-4 bg-gray-50">
                <p className="text-sm text-[#1a0dab] leading-snug truncate">{previewTitle || "Your SEO Title Here"}</p>
                <p className="text-xs text-[#006621]">{previewUrl}</p>
                <p className="text-sm text-gray-700">{previewDesc || "Your meta description preview will appear here."}</p>
              </div>
              <p className="mt-2 text-xs text-gray-500">Preview approximates Google snippets; actual display may vary.</p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isLoading 
              ? (mode === "create" ? "Creating..." : "Updating...")
              : (mode === "create" ? "Create Blog" : "Update Blog")
            }
          </button>
        </div>
      </form>
    </div>
  );
}