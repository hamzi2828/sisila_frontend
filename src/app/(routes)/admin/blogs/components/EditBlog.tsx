"use client";
import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiSave, FiLoader } from "react-icons/fi";
import BlogForm, { BlogFormData } from "./BlogForm";
import { toast } from "react-hot-toast";
import { Blog } from "./AllBlogs";

interface EditBlogProps {
  blog: Blog;
  onUpdate: (updatedBlog: Blog) => void;
  onCancel: () => void;
}

export default function EditBlog({ blog, onUpdate, onCancel }: EditBlogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
console.log(blog);
  const handleBlogUpdated = (updatedBlog: BlogFormData) => {
    setIsUpdating(true);
    
    setTimeout(() => {
      toast.success(`Blog "${updatedBlog.title}" has been updated successfully!`);
      
      // Transform the updated blog to match the Blog interface
      const transformedBlog: Blog = {
        id: updatedBlog.id!,
        title: updatedBlog.title,
        content: updatedBlog.content,
        category: updatedBlog.category || blog.category,
        categoryId: updatedBlog.categoryId,
        status: updatedBlog.status,
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
      
      onUpdate(transformedBlog);
    }, 500);
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmed) return;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                disabled={isUpdating}
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back to Blogs
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Editing: <span className="font-medium">{blog.title}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {hasChanges && (
                <div className="flex items-center space-x-2 text-sm text-amber-600">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span>Unsaved changes</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FiSave className="h-4 w-4" />
                <span>Auto-save enabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        {isUpdating && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <FiLoader className="animate-spin rounded-full h-5 w-5 text-blue-600 mr-3" />
                <p className="text-blue-700">Updating blog...</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Section */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <BlogForm 
            mode="edit"
            initialData={{
              ...blog,
              author: blog.author || { _id: "", name: "" }
            }}
            onSubmit={handleBlogUpdated}
            onChangeDetected={setHasChanges}
          />
        </div>

        {/* Blog Info Section */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Created:</span>
              <p className="font-medium">
                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <p className="font-medium">
                {blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString() : 'Never'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Views:</span>
              <p className="font-medium">{blog.views || 0}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between text-sm text-gray-500">
          <p>
            Need help? Check our{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              documentation
            </a>
          </p>
          <p>Blog ID: {blog.id}</p>
        </div>
      </div>
    </div>
  );
}