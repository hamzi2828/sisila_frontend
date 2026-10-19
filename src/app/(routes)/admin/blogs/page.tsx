// src/app/(routes)/admin/blogs/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileText, FolderOpen, PenSquare, Plus, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AdminPage, Button, ConfirmDialog, PageHeader, Tabs } from '@/components/admin/ui';
import CategoriesTab from './components/CategoriesTab';
import AuthorsTab from './components/AuthorsTab';
import AllBlogs, { type Blog } from './components/AllBlogs';
import CreateBlog from './components/CreateBlog';
import EditBlog from './components/EditBlog';
import blogService from './services/blogService';
import { getErrorMessage } from './_shared/apiError';

type BlogTab = 'all' | 'categories' | 'authors' | 'create' | 'edit';

const SUBTITLES: Record<BlogTab, string> = {
  all: 'Manage your blog posts',
  categories: 'Organize blogs with categories',
  authors: 'Manage blog authors',
  create: 'Write a new post with rich content and images',
  edit: 'Update this post',
};

const BlogsPage = () => {
  const [activeTab, setActiveTab] = useState<BlogTab>('all');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Blog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const fetchBlogs = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const { blogs: blogsData, pagination: paginationData } = await blogService.getAllBlogs(page, 10);
      setBlogs(blogsData);
      setPagination(paginationData);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError(getErrorMessage(error, 'Failed to load blogs. Please try again.'));
      toast.error('Failed to load blogs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch blogs on component mount or page change
  useEffect(() => {
    if (activeTab === 'all') {
      fetchBlogs(currentPage);
    }
  }, [activeTab, currentPage, fetchBlogs]);

  // Blog edit handlers
  const handleEdit = (id: string) => {
    const blog = blogs.find(b => b.id === id);
    if (blog) {
      setEditingBlog(blog);
      setActiveTab('edit');
    }
  };

  const handleUpdate = (updatedBlog: Blog) => {
    setBlogs((prev) => prev.map(b => b.id === updatedBlog.id ? updatedBlog : b));
    setEditingBlog(null);
    setActiveTab('all');
  };

  const handleCancelEdit = () => {
    setEditingBlog(null);
    setActiveTab('all');
  };

  const handleCreated = () => {
    setCurrentPage(1);
    setActiveTab('all');
  };

  // Blog deletion: ask first, then delete
  const handleDelete = (id: string) => {
    const blog = blogs.find(b => b.id === id);
    if (blog) setPendingDelete(blog);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      setIsDeleting(true);
      await blogService.deleteBlog(pendingDelete.id);
      // Step back a page when the last post on this page was removed
      if (blogs.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
      else fetchBlogs(currentPage);
      toast.success('Blog deleted successfully');
      setPendingDelete(null);
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error(getErrorMessage(error, 'Failed to delete blog'));
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle featured handler
  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      const updatedBlog = await blogService.toggleFeatured(id, featured);
      setBlogs((prev) => prev.map(b => b.id === updatedBlog.id ? updatedBlog : b));
      toast.success(`Blog ${featured ? 'marked as featured' : 'removed from featured'}`);
    } catch (error) {
      console.error('Error toggling blog featured status:', error);
      toast.error(getErrorMessage(error, 'Failed to update blog featured status'));
    }
  };

  // Toggle status handler
  const handleToggleStatus = async (id: string, status: 'published' | 'draft') => {
    try {
      const updatedBlog = await blogService.toggleStatus(id, status);
      setBlogs((prev) => prev.map(b => b.id === updatedBlog.id ? updatedBlog : b));
      toast.success(`Blog ${status === 'published' ? 'published' : 'saved as draft'} successfully`);
    } catch (error) {
      console.error('Error toggling blog status:', error);
      toast.error(getErrorMessage(error, 'Failed to update blog status'));
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const headerAction =
    activeTab === 'categories' ? (
      <Button
        leftIcon={<Plus className="h-4 w-4" />}
        onClick={() => window.dispatchEvent(new CustomEvent('openCreateCategory'))}
      >
        <span className="hidden sm:inline">Add Category</span>
        <span className="sm:hidden">Add</span>
      </Button>
    ) : activeTab === 'authors' ? (
      <Button
        leftIcon={<Plus className="h-4 w-4" />}
        onClick={() => window.dispatchEvent(new CustomEvent('openCreateAuthor'))}
      >
        <span className="hidden sm:inline">Add Author</span>
        <span className="sm:hidden">Add</span>
      </Button>
    ) : activeTab === 'all' ? (
      <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setActiveTab('create')}>
        <span className="hidden sm:inline">Create Blog</span>
        <span className="sm:hidden">Add</span>
      </Button>
    ) : null;

  return (
    <AdminPage>
      {activeTab === 'edit' && editingBlog ? (
        <EditBlog
          blog={editingBlog}
          onUpdate={handleUpdate}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          <PageHeader title="Blogs" subtitle={SUBTITLES[activeTab]} actions={headerAction} />

          <Tabs
            variant="pills"
            tabs={[
              { key: 'all', label: 'All Blogs', icon: FileText, count: pagination.total || blogs.length },
              { key: 'categories', label: 'Blog Categories', icon: FolderOpen },
              { key: 'authors', label: 'Authors', icon: Users },
              { key: 'create', label: 'Create Blog', icon: PenSquare },
            ]}
            value={activeTab}
            onChange={(key) => setActiveTab(key as BlogTab)}
          />

          {activeTab === 'all' && (
            <AllBlogs
              blogs={blogs}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onToggleFeatured={handleToggleFeatured}
              onToggleStatus={handleToggleStatus}
              loading={isLoading}
              error={error}
              onRetry={() => fetchBlogs(currentPage)}
              onCreate={() => setActiveTab('create')}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}

          {activeTab === 'categories' && <CategoriesTab />}

          {activeTab === 'authors' && <AuthorsTab />}

          {activeTab === 'create' && <CreateBlog onCreated={handleCreated} />}
        </>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete blog?"
        message={
          <>
            <span className="font-medium text-stone-900">&ldquo;{pendingDelete?.title}&rdquo;</span> will be removed
            permanently. This can&apos;t be undone.
          </>
        }
        confirmLabel="Delete blog"
        loading={isDeleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </AdminPage>
  );
};

export default BlogsPage;
