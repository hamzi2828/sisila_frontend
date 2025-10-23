"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import BlogForm, { BlogFormData } from "./BlogForm";
import { toast } from "react-hot-toast";

export default function CreateBlog() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleBlogCreated = (blog: BlogFormData) => {
    setIsCreating(true);
    
    setTimeout(() => {
      toast.success(`Blog "${blog.title}" has been created successfully!`);
      router.push("/admin/blogs");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                disabled={isCreating}
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back to Blogs
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Create New Blog</h1>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FiSave className="h-4 w-4" />
              <span>Auto-save enabled</span>
            </div>
          </div>
          
          <p className="mt-2 text-sm text-gray-600">
            Create a new blog post with rich content, images, and SEO optimization
          </p>
        </div>

        {/* Progress Indicator */}
        {isCreating && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                <p className="text-blue-700">Creating blog and redirecting...</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Section */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <BlogForm mode="create" onSubmit={handleBlogCreated} />
        </div>


      </div>
    </div>
  );
}