"use client";
import React from "react";
import BlogForm, { BlogFormData } from "./BlogForm";

interface CreateBlogProps {
  /** Called after the blog has been saved (BlogForm shows the success toast). */
  onCreated?: (blog: BlogFormData) => void;
}

export default function CreateBlog({ onCreated }: CreateBlogProps) {
  return <BlogForm mode="create" onSubmit={(blog) => onCreated?.(blog)} />;
}
