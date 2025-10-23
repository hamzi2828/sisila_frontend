// src/app/(routes)/admin/blogs/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Tabs from '../products/components/Tabs';
import CategoriesTab from './components/CategoriesTab';
import AuthorsTab from './components/AuthorsTab';
import AllBlogs, { type Blog } from './components/AllBlogs';
import CreateBlog from './components/CreateBlog';
import EditBlog from './components/EditBlog';
import blogService from './services/blogService';

const BlogsPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'categories' | 'authors' | 'create' | 'edit'>('all');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
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
      setError('Failed to load blogs. Please try again.');
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
  
  // Blog deletion handler
  const handleDelete = async (id: string) => {
    try {
      await blogService.deleteBlog(id);
      // Refresh current page after deletion
      fetchBlogs(currentPage);
      toast.success('Blog deleted successfully');
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
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
      toast.error('Failed to update blog featured status');
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
      toast.error('Failed to update blog status');
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your blog posts and categories</p>
        </div>
        {activeTab === 'categories' ? (
          <button
            onClick={() => {
              const event = new CustomEvent('openCreateCategory');
              window.dispatchEvent(event);
            }}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Add Category
          </button>
        ) : activeTab === 'authors' ? (
          null
        ) : (
          <button
            onClick={() => setActiveTab('create')}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Create Blog
          </button>
        )}
      </div>

      {activeTab !== 'edit' && (
        <Tabs
          tabs={[
            { key: 'all', label: 'All Blogs', count: pagination.total || blogs.length },
            { key: 'categories', label: 'Blog Categories' },
            { key: 'authors', label: 'Authors' },
            { key: 'create', label: 'Create Blog' },
          ]}
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as 'all' | 'categories' | 'authors' | 'create')}
        />
      )}

      {activeTab === 'all' && (
        <AllBlogs
          blogs={blogs}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onToggleFeatured={handleToggleFeatured}
          onToggleStatus={handleToggleStatus}
          loading={isLoading}
          error={error}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      {activeTab === 'categories' && <CategoriesTab />}

      {activeTab === 'authors' && <AuthorsTab />}

      {activeTab === 'create' && (
        <CreateBlog />
      )}

      {activeTab === 'edit' && editingBlog && (
        <EditBlog
          blog={editingBlog}
          onUpdate={handleUpdate}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default BlogsPage;