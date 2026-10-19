"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Check, Edit2, FileText, Plus, ToggleLeft, ToggleRight, Trash2, Users } from "lucide-react";
import { toast } from 'react-hot-toast';
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  ConfirmDialog,
  EmptyState,
  FormField,
  IconButton,
  Input,
  LoadingState,
  Modal,
  Pagination,
  SearchInput,
  Select,
  StatCard,
  StatGrid,
  StatusBadge,
  Textarea,
} from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { assetUrl } from '@/lib/productMedia';
import authorService, { Author } from "../services/authorService";
import ImageDropzone from "../_shared/ImageDropzone";
import { getErrorMessage } from "../_shared/apiError";

interface AuthorFormData {
  name: string;
  email: string;
  bio: string;
  active: boolean;
}

const initialFormData: AuthorFormData = {
  name: "",
  email: "",
  bio: "",
  active: true
};

export default function AuthorsTab() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState<AuthorFormData>(initialFormData);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [currentAvatar, setCurrentAvatar] = useState<string>("");
  const [pendingDelete, setPendingDelete] = useState<Author | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);

  // Debounce the search box so we don't hit the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== searchQuery) {
        setSearchQuery(searchInput);
        setPagination(p => ({ ...p, page: 1 }));
      }
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput, searchQuery]);

  useEffect(() => {
    fetchAuthors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, searchQuery, activeFilter]);

  // The page header's "Add Author" button opens the create modal
  useEffect(() => {
    const handleOpenCreate = () => openCreate();
    window.addEventListener("openCreateAuthor", handleOpenCreate);
    return () => window.removeEventListener("openCreateAuthor", handleOpenCreate);
  }, []);

  const fetchAuthors = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const response = await authorService.getAllAuthors({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        active: activeFilter
      });

      setAuthors(response.authors);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching authors:", error);
      setLoadError(getErrorMessage(error, "Failed to load authors. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const formDataToSend = new FormData();

      // Add basic fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("active", formData.active.toString());

      // Add avatar file if selected
      if (avatar) {
        formDataToSend.append("avatar", avatar);
      }

      if (editingAuthor) {
        await authorService.updateAuthor(editingAuthor.id, formDataToSend);
        toast.success("Author updated successfully");
      } else {
        await authorService.createAuthor(formDataToSend);
        toast.success("Author created successfully");
      }

      await fetchAuthors();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving author:", error);
      toast.error(getErrorMessage(error, "Failed to save author", { upload: Boolean(avatar) }));
    } finally {
      setIsSaving(false);
    }
  };

  const openCreate = () => {
    setEditingAuthor(null);
    setFormData(initialFormData);
    setAvatar(null);
    setCurrentAvatar("");
    setIsModalOpen(true);
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      email: author.email,
      bio: author.bio || "",
      active: author.active
    });
    setAvatar(null);
    setCurrentAvatar(author.avatar ? assetUrl(author.avatar) : "");
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;

    try {
      setIsDeleting(true);
      await authorService.deleteAuthor(pendingDelete.id);
      toast.success("Author deleted successfully");
      setPendingDelete(null);
      await fetchAuthors();
    } catch (error) {
      console.error("Error deleting author:", error);
      toast.error(getErrorMessage(error, "Failed to delete author. They may have blogs associated with them."), { duration: 6000 });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (authorId: string) => {
    try {
      setTogglingId(authorId);
      await authorService.toggleAuthorActive(authorId);
      await fetchAuthors();
      toast.success("Author status updated");
    } catch (error) {
      console.error("Error toggling author status:", error);
      toast.error(getErrorMessage(error, "Failed to update author status"));
    } finally {
      setTogglingId(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAuthor(null);
    setFormData(initialFormData);
    setAvatar(null);
    setCurrentAvatar("");
  };

  const hasFilters = Boolean(searchQuery) || activeFilter !== undefined;

  return (
    <>
      <StatGrid cols={3}>
        <StatCard size="sm" label="Total" value={pagination.total} icon={Users} />
        <StatCard size="sm" label="Active" value={authors.filter(a => a.active).length} icon={ToggleRight} tone="success" />
        <StatCard size="sm" label="Blogs" value={authors.reduce((acc, a) => acc + (a.blogCount || 0), 0)} icon={FileText} tone="info" />
      </StatGrid>

      <Card padding="none">
        <div className="p-3 sm:p-6">
          {/* Filters */}
          <div className="mb-4 grid grid-cols-1 gap-2 sm:mb-6 sm:grid-cols-2 sm:gap-4">
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search by name or email..."
              aria-label="Search authors"
              wrapperClassName="sm:max-w-none"
            />
            <Select
              aria-label="Filter by status"
              value={activeFilter === undefined ? "" : activeFilter.toString()}
              onChange={(e) => {
                setActiveFilter(e.target.value === "" ? undefined : e.target.value === "true");
                setPagination(p => ({ ...p, page: 1 }));
              }}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
          </div>

          {/* Authors List */}
          {loadError ? (
            <Alert tone="error" title="Error loading authors" onRetry={fetchAuthors}>
              {loadError}
            </Alert>
          ) : isLoading && authors.length === 0 ? (
            <LoadingState label="Loading authors..." />
          ) : authors.length > 0 ? (
            <div className={cn("space-y-2 sm:space-y-3", isLoading && "opacity-60 transition-opacity")}>
              {authors.map((author) => (
                <div
                  key={author.id}
                  className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3 transition-all duration-200 hover:shadow-md sm:flex-row sm:items-center sm:gap-4 sm:p-4"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                    {/* Avatar */}
                    {author.avatar ? (
                      <Image
                        src={assetUrl(author.avatar)}
                        alt={author.name}
                        width={56}
                        height={56}
                        className="h-11 w-11 flex-shrink-0 rounded-full border-2 border-stone-200 object-cover sm:h-14 sm:w-14"
                      />
                    ) : (
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-stone-200 bg-stone-200 sm:h-14 sm:w-14">
                        <span className="text-base font-semibold text-stone-600 sm:text-xl">
                          {author.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-stone-900 sm:text-base">{author.name}</h3>
                      <p className="truncate text-xs text-stone-500 sm:text-sm">
                        {author.email}
                        {author.slug && <span className="hidden text-stone-400 md:inline"> · @{author.slug}</span>}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-stone-600 sm:text-sm">
                        {author.bio || <span className="text-stone-400">No bio available</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-stone-200 pt-2 sm:justify-end sm:border-0 sm:pt-0">
                    {/* Badges */}
                    <div className="flex items-center gap-2">
                      <Badge size="sm">
                        {author.blogCount || 0} {(author.blogCount || 0) === 1 ? "blog" : "blogs"}
                      </Badge>
                      <StatusBadge size="sm" status={author.active ? "active" : "inactive"} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <IconButton
                        label={author.active ? "Deactivate" : "Activate"}
                        icon={author.active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        loading={togglingId === author.id}
                        onClick={() => handleToggleActive(author.id)}
                        className={cn(
                          author.active
                            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700"
                            : "bg-white text-stone-400 ring-1 ring-stone-200 hover:bg-stone-100 hover:text-stone-700"
                        )}
                      />
                      <IconButton
                        label="Edit"
                        icon={<Edit2 className="h-4 w-4" />}
                        onClick={() => handleEdit(author)}
                        className="bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100"
                      />
                      <IconButton
                        label="Delete"
                        tone="danger"
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => setPendingDelete(author)}
                        className="bg-white text-red-500 ring-1 ring-stone-200 hover:bg-red-50 hover:text-red-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No authors found"
              description={hasFilters ? "Try adjusting your search or filters." : "Get started by adding your first author."}
              action={
                !hasFilters && (
                  <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
                    Add Author
                  </Button>
                )
              }
            />
          )}

          {/* Pagination */}
          {!loadError && pagination.pages > 1 && (
            <div className="mt-4 border-t border-stone-200 pt-4 sm:mt-6">
              <Pagination
                page={pagination.page}
                totalPages={pagination.pages}
                onPageChange={(page) => setPagination(p => ({ ...p, page }))}
                totalItems={pagination.total}
                pageSize={pagination.limit}
                itemLabel="authors"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Add / edit modal */}
      <Modal
        open={isModalOpen}
        onClose={isSaving ? () => {} : handleCloseModal}
        title={editingAuthor ? "Edit Author" : "Add New Author"}
        description={editingAuthor ? "Update this author's profile." : "Authors can be assigned to blog posts."}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="blog-author-form"
              loading={isSaving}
              loadingText="Saving..."
              leftIcon={<Check className="h-4 w-4" />}
            >
              {editingAuthor ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <form id="blog-author-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Avatar Upload */}
          <ImageDropzone
            id="blog-author-avatar"
            name="Avatar"
            label="Avatar"
            file={avatar}
            onFileChange={setAvatar}
            currentUrl={currentAvatar}
            circle
            disabled={isSaving}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Name" htmlFor="blog-author-name" required>
              <Input
                id="blog-author-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter author name"
                disabled={isSaving}
              />
            </FormField>

            <FormField label="Email" htmlFor="blog-author-email" required>
              <Input
                id="blog-author-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                disabled={isSaving}
              />
            </FormField>
          </div>

          {/* Bio */}
          <FormField label="Bio" htmlFor="blog-author-bio">
            <Textarea
              id="blog-author-bio"
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="resize-none"
              placeholder="Brief description about the author..."
              disabled={isSaving}
            />
          </FormField>

          {/* Active Status */}
          <Checkbox
            id="blog-author-active"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            label="Active author"
            description="Active authors can be assigned to blogs."
            disabled={isSaving}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete author?"
        message={
          <div className="space-y-2">
            <p>
              <span className="font-medium text-stone-900">{pendingDelete?.name}</span> will be removed permanently.
            </p>
            {pendingDelete && (pendingDelete.blogCount || 0) > 0 && (
              <p className="text-amber-700">
                This author has {pendingDelete.blogCount} {pendingDelete.blogCount === 1 ? "blog" : "blogs"}. Authors with
                blogs can&apos;t be deleted until those posts are reassigned or deleted.
              </p>
            )}
          </div>
        }
        confirmLabel="Delete author"
        loading={isDeleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
