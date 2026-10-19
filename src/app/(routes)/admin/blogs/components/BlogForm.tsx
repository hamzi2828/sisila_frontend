"use client";
import React, { useState, useEffect } from "react";
import type { JSX } from "react";
import { FileText, Image as ImageIcon, Info, Loader2, Save, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  FormField,
  Input,
  Select,
  Tabs,
  Textarea,
} from "@/components/admin/ui";
import { assetUrl } from "@/lib/productMedia";
import blogCategoryService from "../services/blogCategoryService";
import blogService from "../services/blogService";
import authorService, { Author } from "../services/authorService";
import type { Blog as BaseBlog } from "./AllBlogs";
import RichTextEditor from "./RichTextEditor";
import ImageDropzone from "../_shared/ImageDropzone";
import { getErrorMessage } from "../_shared/apiError";
import { compressInlineImages, estimateRequestBytes, formatBytes, MAX_REQUEST_BYTES } from "../_shared/imageUpload";

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
  /** Shows a Cancel button in the footer. */
  onCancel?: () => void;
}

type FormTab = "basic" | "content" | "media" | "seo";

// Which tab each validation error lives on, so we can jump to it.
const FIELD_TAB: Record<string, FormTab> = {
  title: "basic",
  slug: "basic",
  categoryId: "basic",
  authorId: "basic",
  content: "content",
  image: "media",
  metaTitle: "seo",
  metaDescription: "seo",
  metaSchema: "seo",
};

const TAB_ORDER: FormTab[] = ["basic", "content", "media", "seo"];

/** Plain-text version of the editor HTML (for meta description fallbacks and previews). */
const htmlToText = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

export default function BlogForm({
  mode,
  initialData,
  onSubmit,
  onChangeDetected,
  onCancel,
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

  const [originalForm, setOriginalForm] = useState<BlogFormData | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<FormTab>("basic");

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
        setIsFetching(true);
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
        toast.error(getErrorMessage(error, "Failed to load categories, authors or blog details"));
      } finally {
        setIsFetching(false);
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
    return e;
  };

  const handleCoverChange = (file: File | null) => {
    setCoverImage(file);
    // `image` mirrors the picked file name (used by validation); restore the saved image on remove
    setForm((prev) => ({ ...prev, image: file ? file.name : initialData?.image || "" }));
    if (file) setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate();
    const errorTabs = Object.keys(found).filter((k) => found[k]).map((k) => FIELD_TAB[k]).filter(Boolean);
    if (errorTabs.length > 0) {
      if (!errorTabs.includes(activeTab)) {
        setActiveTab(TAB_ORDER.find((t) => errorTabs.includes(t)) || activeTab);
      }
      toast.error("Please fix the highlighted fields");
      return;
    }

    setIsLoading(true);
    try {
      // Pasted/dropped editor images are inline base64; shrink them before sending
      const content = await compressInlineImages(form.content || "");

      // Auto-fill empty metaTitle/Description from Title/Content (best-effort)
      const fallbackMetaTitle = (form.metaTitle || form.title || "").slice(0, META_TITLE_LIMIT);
      const fallbackMetaDescription =
        (form.metaDescription || htmlToText(content).slice(0, META_DESC_LIMIT)) ?? "";

      const fields: Array<[string, string]> = [
        ["title", form.title],
        ["slug", form.slug],
        ["content", content],
        ["categoryId", form.categoryId],
        ["authorId", form.authorId || ""],
        ["status", form.status],
      ];
      // Handle tags
      if (form.tags && form.tags.length > 0) {
        fields.push(["tags", form.tags.join(",")]);
      }
      // SEO fields
      fields.push(
        ["metaTitle", fallbackMetaTitle],
        ["metaDescription", fallbackMetaDescription],
        ["metaKeywords", form.metaKeywords || ""],
        ["metaSchema", form.metaSchema || ""],
      );

      // The server rejects request bodies over ~4.5 MB; say so before uploading
      const requestBytes = estimateRequestBytes([...fields.map(([, v]) => v), coverImage, thumbnailImage]);
      if (requestBytes > MAX_REQUEST_BYTES) {
        toast.error(
          `This post is about ${formatBytes(requestBytes)} with its images, but the server accepts about ${formatBytes(MAX_REQUEST_BYTES)} per save. Use smaller images (images pasted into the content count too).`,
          { duration: 7000 }
        );
        return;
      }

      const formData = new FormData();
      fields.forEach(([key, value]) => formData.append(key, value));

      // Handle file uploads
      if (coverImage) formData.append("image", coverImage);
      if (thumbnailImage) formData.append("thumbnail", thumbnailImage);

      let result: ExtendedBlog;
      if (mode === "create") {
        result = await blogService.createBlog(formData);
      } else {
        result = await blogService.updateBlog(form.id!, formData);
      }

      // Prepare data for parent component
      const submitData: BlogFormData = {
        ...form,
        content,
        category: categories.find((cat) => cat.id === form.categoryId)?.name || form.category,
        authorName: authors.find((author) => author.id === form.authorId)?.name || form.authorName,
        image: result.image || form.image,
        thumbnail: result.thumbnail || form.thumbnail,
        metaTitle: fallbackMetaTitle,
        metaDescription: fallbackMetaDescription,
      };

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
      toast.success(
        mode === "create" ? `Blog "${form.title}" created successfully` : `Blog "${form.title}" updated successfully`
      );
      onSubmit(submitData);
    } catch (error) {
      console.error(`Error ${mode === "create" ? "creating" : "updating"} blog:`, error);
      toast.error(getErrorMessage(error, `Failed to ${mode} blog`, { upload: true }), { duration: 6000 });
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
    if (errors[key as string]) setErrors((prev) => ({ ...prev, [key as string]: "" }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setField("tags", tagsArray);
  };

  const previewTitle = (form.metaTitle || form.title || "").slice(0, META_TITLE_LIMIT);
  const previewUrl = `/blog/${form.slug || "your-slug"}`;
  const previewDesc = (form.metaDescription || htmlToText(form.content || "").slice(0, META_DESC_LIMIT)) as string;

  const savedCover = mode === "edit" && initialData?.image ? assetUrl(initialData.image) : "";
  const savedThumbnail = form.thumbnail ? assetUrl(form.thumbnail) : "";

  const tabHasError = (tab: FormTab) => Object.keys(errors).some((k) => errors[k] && FIELD_TAB[k] === tab);
  const tabLabel = (label: string, tab: FormTab) => (
    <span className="inline-flex items-center gap-1.5">
      {label}
      {tabHasError(tab) && <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-label="has errors" />}
    </span>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card padding="none">
        <CardHeader
          title={mode === "create" ? "Create Blog" : "Edit Blog"}
          subtitle={mode === "create" ? "Fill in the details, write the post, then add a cover image." : "Update the details, content, images and SEO of this post."}
          icon={<FileText className="h-5 w-5" />}
          actions={
            isFetching ? (
              <span className="inline-flex items-center gap-2 text-xs text-stone-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                {mode === "edit" ? "Loading post details…" : "Loading options…"}
              </span>
            ) : undefined
          }
          bordered={false}
        />

        <Tabs<FormTab>
          tabs={[
            { key: "basic", label: tabLabel("Basic Info", "basic"), icon: Info },
            { key: "content", label: tabLabel("Content", "content"), icon: FileText },
            { key: "media", label: tabLabel("Media", "media"), icon: ImageIcon },
            { key: "seo", label: tabLabel("SEO", "seo"), icon: Search },
          ]}
          value={activeTab}
          onChange={setActiveTab}
          className="px-1 sm:px-2"
        />

        <div className="p-4 sm:p-6">
          {/* BASIC INFO TAB */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <FormField label="Title" htmlFor="blog-title" required error={errors.title} className="md:col-span-2">
                <Input
                  id="blog-title"
                  type="text"
                  placeholder="e.g., Five Ways to Style an Oversized Tee"
                  value={form.title}
                  invalid={!!errors.title}
                  onChange={(e) => setField("title", e.target.value)}
                />
              </FormField>

              <FormField
                label="URL Slug"
                htmlFor="blog-slug"
                required
                error={errors.slug}
                hint={mode === "create" ? "Generated from the title. Only letters, numbers, and hyphens." : "Only letters, numbers, and hyphens."}
                className="md:col-span-2"
              >
                <Input
                  id="blog-slug"
                  type="text"
                  prefix="/blog/"
                  className="pl-[3.75rem]"
                  value={form.slug}
                  invalid={!!errors.slug}
                  onChange={(e) => setField("slug", e.target.value)}
                  placeholder="auto-generated-from-title"
                  readOnly={mode === "create"}
                  disabled={mode === "create"}
                />
              </FormField>

              <FormField label="Category" htmlFor="blog-category" required error={errors.categoryId}>
                <Select
                  id="blog-category"
                  value={form.categoryId}
                  invalid={!!errors.categoryId}
                  onChange={(e) => setField("categoryId", e.target.value)}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Author" htmlFor="blog-author" required error={errors.authorId}>
                <Select
                  id="blog-author"
                  value={form.authorId}
                  invalid={!!errors.authorId}
                  onChange={(e) => setField("authorId", e.target.value)}
                >
                  <option value="" disabled>
                    Select an author
                  </option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Status" htmlFor="blog-status" hint="Drafts are hidden from the storefront.">
                <Select
                  id="blog-status"
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value as BlogFormData["status"])}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </Select>
              </FormField>

              <FormField label="Tags" htmlFor="blog-tags" hint="Separate tags with commas.">
                <Input
                  id="blog-tags"
                  type="text"
                  placeholder="e.g., poetry, culture, styling"
                  value={form.tags?.join(", ") || ""}
                  onChange={(e) => handleTagsChange(e.target.value)}
                />
              </FormField>
            </div>
          )}

          {/* CONTENT TAB */}
          {activeTab === "content" && (
            <div className="space-y-3">
              <div>
                <p className="block text-sm font-medium text-stone-700">
                  Blog Content <span className="text-red-500">*</span>
                </p>
                <p className="mt-0.5 text-xs text-stone-500">
                  Write your post with the rich text editor. Pasted images are optimized when you save.
                </p>
              </div>
              <RichTextEditor
                value={form.content || ""}
                onChange={(content) => setField("content", content)}
                placeholder="Write your blog content here..."
                error={errors.content}
              />
            </div>
          )}

          {/* MEDIA TAB */}
          {activeTab === "media" && (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <ImageDropzone
                  id="blog-cover"
                  name="Cover image"
                  label="Cover Image"
                  required={mode === "create"}
                  hint={
                    <>
                      Shown as the hero of the blog post. A wide landscape image works best (around{" "}
                      <span className="font-semibold">1920 × 1080px</span>, 16:9).
                    </>
                  }
                  file={coverImage}
                  onFileChange={handleCoverChange}
                  currentUrl={savedCover}
                  error={errors.image}
                  previewClassName="aspect-[16/9]"
                  disabled={isLoading}
                />
              </div>

              <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <ImageDropzone
                  id="blog-thumbnail"
                  name="Thumbnail"
                  label="Thumbnail Image (Optional)"
                  hint={
                    <>
                      Used in blog listing cards (around <span className="font-semibold">800 × 500px</span>, 16:10).
                    </>
                  }
                  file={thumbnailImage}
                  onFileChange={setThumbnailImage}
                  currentUrl={savedThumbnail}
                  previewClassName="aspect-[16/10]"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* SEO TAB */}
          {activeTab === "seo" && (
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {/* Google Preview Card */}
              <div className="rounded-xl border border-stone-200 bg-white p-4">
                <h4 className="mb-3 text-sm font-semibold text-stone-900">Google Search Preview</h4>
                <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                  <p className="truncate text-sm font-medium leading-snug text-[#1a0dab]">{previewTitle || "Your SEO Title Here"}</p>
                  <p className="mt-1 text-xs text-[#006621]">{previewUrl}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-stone-600">{previewDesc || "Your meta description preview will appear here."}</p>
                </div>
                <p className="mt-2 text-xs text-stone-500">Preview approximates Google snippets; actual display may vary.</p>
              </div>

              <FormField
                label={
                  <>
                    Meta Title{" "}
                    <span className={(form.metaTitle || "").length > META_TITLE_LIMIT ? "text-red-500" : "text-stone-400"}>
                      ({(form.metaTitle || "").length}/{META_TITLE_LIMIT})
                    </span>
                  </>
                }
                htmlFor="blog-meta-title"
                error={errors.metaTitle}
              >
                <Input
                  id="blog-meta-title"
                  type="text"
                  placeholder="Keep it under ~60 characters, include primary keyword"
                  value={form.metaTitle || ""}
                  invalid={!!errors.metaTitle}
                  onChange={(e) => setField("metaTitle", e.target.value)}
                  maxLength={120}
                />
              </FormField>

              <FormField
                label={
                  <>
                    Meta Description{" "}
                    <span className={(form.metaDescription || "").length > META_DESC_LIMIT ? "text-red-500" : "text-stone-400"}>
                      ({(form.metaDescription || "").length}/{META_DESC_LIMIT})
                    </span>
                  </>
                }
                htmlFor="blog-meta-description"
                error={errors.metaDescription}
                hint="Leave empty to use the start of the post."
              >
                <Textarea
                  id="blog-meta-description"
                  rows={3}
                  placeholder="Compelling summary under ~155 characters"
                  value={form.metaDescription || ""}
                  invalid={!!errors.metaDescription}
                  onChange={(e) => setField("metaDescription", e.target.value)}
                  maxLength={320}
                />
              </FormField>

              <FormField label="Meta Keywords" htmlFor="blog-meta-keywords" hint="Separate keywords with commas.">
                <Input
                  id="blog-meta-keywords"
                  type="text"
                  placeholder="e.g., silsila journal, urdu poetry, streetwear"
                  value={form.metaKeywords || ""}
                  onChange={(e) => setField("metaKeywords", e.target.value)}
                />
              </FormField>

              <FormField label="Meta Schema (JSON-LD)" htmlFor="blog-meta-schema" error={errors.metaSchema}>
                <Textarea
                  id="blog-meta-schema"
                  rows={8}
                  placeholder='Paste valid JSON-LD here. Example: {"@context":"https://schema.org","@type":"BlogPosting",...}'
                  className="font-mono text-xs sm:text-sm"
                  value={form.metaSchema || ""}
                  invalid={!!errors.metaSchema}
                  onChange={(e) => setField("metaSchema", e.target.value)}
                />
              </FormField>
            </div>
          )}
        </div>

        <CardFooter>
          {onCancel && (
            <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            loading={isLoading}
            loadingText={mode === "create" ? "Creating..." : "Updating..."}
            leftIcon={<Save className="h-4 w-4" />}
          >
            {mode === "create" ? "Create Blog" : "Update Blog"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
