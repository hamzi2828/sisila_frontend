"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { FiPlus, FiX } from "react-icons/fi";
import type { Product, ProductVariant } from "./AllProducts";
import type { Category } from "./CategoriesTab";
import { slugify, buildVariantCombos, syncVariants, type Variant } from "../services/productCreateService";
import { productService } from "../services/productService";

// Extended Product type with SEO and description fields
interface ExtendedProduct extends Product {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaSchema?: string;
  description?: string;
  shortDescription?: string;
}

export interface ProductFormData extends Omit<Product, "id"> {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaSchema?: string;
  description?: string;
  shortDescription?: string;
}

interface ProductFormProps {
  mode: "create" | "edit";
  initialData?: Product;
  categories: Category[];
  colorOptions: string[];
  sizeOptions: string[];
  onSubmit?: (data: ProductFormData) => void;
  onCancel?: () => void;
  onSuccess?: () => void;
  onManageAttributes?: () => void;
}

interface ColorMediaData {
  thumbnailUrl?: string;
  bannerUrls: string[];
  thumbFile?: File;
  bannerFiles?: File[];
  modified?: boolean;
}

const META_TITLE_LIMIT = 60;
const META_DESC_LIMIT = 155;

const initialFormData: ProductFormData = {
  name: "",
  category: "",
  price: 0,
  stock: 0,
  status: "draft",
  thumbnailUrl: "",
  bannerUrls: [],
  productType: "single",
  variants: [],
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  metaSchema: "",
  description: "",
  shortDescription: "",
  features: ""
};

export default function ProductForm({
  mode,
  initialData,
  categories,
  colorOptions,
  sizeOptions,
  onSubmit,
  onCancel,
  onSuccess,
  onManageAttributes
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(initialData ? {
    ...initialData,
    // Add backend URL prefix to image URLs for display (if not already present)
    thumbnailUrl: initialData.thumbnailUrl
      ? (initialData.thumbnailUrl.startsWith('http')
          ? initialData.thumbnailUrl
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}${initialData.thumbnailUrl}`)
      : initialData.thumbnailUrl,
    bannerUrls: Array.isArray(initialData.bannerUrls)
      ? initialData.bannerUrls.map((url: string) =>
          url.startsWith('http')
            ? url
            : `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`)
      : initialData.bannerUrls,
    metaTitle: (initialData as ExtendedProduct)?.metaTitle || "",
    metaDescription: (initialData as ExtendedProduct)?.metaDescription || "",
    metaKeywords: (initialData as ExtendedProduct)?.metaKeywords || "",
    metaSchema: (initialData as ExtendedProduct)?.metaSchema || "",
    description: (initialData as ExtendedProduct)?.description || "",
    shortDescription: (initialData as ExtendedProduct)?.shortDescription || "",
    features: (initialData as ExtendedProduct)?.features || ""
  } : initialFormData);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"content" | "description" | "seo">("content");
  const [isLoading, setIsLoading] = useState(false);
  
  // File handling state
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [bannerFiles, setBannerFiles] = useState<File[]>([]);
  // Removed unused thumbName state
  
  // Variant state
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [colorMedia, setColorMedia] = useState<Record<string, ColorMediaData>>({});
  
  // Refs
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const colorThumbRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const colorBannerRefs = useRef<Record<string, HTMLInputElement | null>>({});
  
  const isVariant = form.productType === "variant";
  const slug = useMemo(() => slugify(form.name), [form.name]);
  
  
  // Helper to clean URL for sending to backend (remove domain, keep relative path)
  const cleanUrlForBackend = (url: string): string => {
    if (!url) return url;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
    let cleanUrl = url;
    if (backendUrl && cleanUrl.startsWith(backendUrl)) {
      cleanUrl = cleanUrl.replace(backendUrl, '');
    }
    return cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
  };
  // Initialize form data from initialData for edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      // Extract variants information to set selected colors and sizes
      if (initialData.productType === "variant" && initialData.variants) {
        const colors = Array.from(new Set((initialData.variants as ProductVariant[]).map(v => v.color)));
        const sizes = Array.from(new Set((initialData.variants as ProductVariant[]).map(v => v.size)));
        setSelectedColors(colors);
        setSelectedSizes(sizes);
        
        // Initialize colorMedia from existing product data
        if (initialData.colorMedia && typeof initialData.colorMedia === 'object') {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
          const colorMediaData: Record<string, ColorMediaData> = {};
          Object.entries(initialData.colorMedia).forEach(([color, media]) => {
            if (media && typeof media === 'object') {
              colorMediaData[color] = {
                thumbnailUrl: media.thumbnailUrl ? `${backendUrl}${media.thumbnailUrl}` : undefined,
                bannerUrls: Array.isArray(media.bannerUrls) 
                  ? media.bannerUrls.map((url: string) => `${backendUrl}${url}`) 
                  : [],
                bannerFiles: [], // No files initially since these are existing URLs
                modified: false // Mark as not modified initially
              };
            }
          });
          console.log('Initializing colorMedia for edit mode:', colorMediaData);
          setColorMedia(colorMediaData);
        }
      }
    }
  }, [mode, initialData]);
  
  // Build all color-size combinations
  const variantCombos = useMemo(
    () => buildVariantCombos(selectedColors, selectedSizes),
    [selectedColors, selectedSizes]
  );
  
  // Keep form.variants in sync with selections
  useEffect(() => {
    if (!isVariant) return;

    // In edit mode, protect existing variant data by only syncing when actually needed
    if (mode === "edit" && initialData?.variants && Array.isArray(initialData.variants)) {
      const currentVariants = form.variants || [];

      // If we have no current variants but should have them from initialData,
      // or if variantCombos length is 0 (indicating initialization phase), skip
      if (variantCombos.length === 0 || currentVariants.length === 0) {
        return;
      }

      // Check if current variants match the variant combos exactly
      const hasAllCombos = variantCombos.every(combo =>
        currentVariants.some(v => v.color === combo.color && v.size === combo.size)
      );
      const hasExtraVariants = currentVariants.some(v =>
        !variantCombos.some(combo => combo.color === v.color && combo.size === v.size)
      );

      // Only sync if the combinations don't match (user changed color/size selections)
      if (!hasAllCombos || hasExtraVariants) {
        const next = syncVariants((form.variants || []) as unknown as Variant[], variantCombos);
        if (JSON.stringify(next) !== JSON.stringify(form.variants || [])) {
          setField("variants", next as ProductVariant[]);
        }
      }
    } else if (mode === "create") {
      // For create mode, always sync when combinations change
      const next = syncVariants((form.variants || []) as unknown as Variant[], variantCombos);
      if (JSON.stringify(next) !== JSON.stringify(form.variants || [])) {
        setField("variants", next as ProductVariant[]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantCombos, isVariant, mode]);
  
  const safeRevoke = useCallback((url?: string) => {
    if (url && url.startsWith("blob:")) {
      try { URL.revokeObjectURL(url); } catch {}
    }
  }, []);
  
  const isValidJson = (val: string) => {
    if (!val.trim()) return true;
    try {
      const parsed = JSON.parse(val);
      return typeof parsed === "object";
    } catch {
      return false;
    }
  };
  
  const validate = () => {
    const e: Record<string, string> = {};
    
    // Basic validations
    if (!form.name?.trim()) e.name = "Name is required";
    if (!form.category) e.category = "Category is required";
    
    if (!isVariant) {
      if (!form.price || form.price < 0) e.price = "Price must be a positive number";
      if (form.stock < 0) e.stock = "Stock cannot be negative";
      if (mode === "create" && !thumbFile && !form.thumbnailUrl?.trim()) {
        e.thumbnail = "Thumbnail is required";
      }
    } else {
      if (selectedColors.length === 0) e.colors = "Select at least one color";
      if (selectedSizes.length === 0) e.sizes = "Select at least one size";
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
  
  const setField = useCallback(<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setForm((prev) => {
      if (key === 'name' && typeof value === 'string') {
        const metaTitle = prev.metaTitle ? prev.metaTitle : value.slice(0, META_TITLE_LIMIT);
        return { ...prev, [key]: value, metaTitle };
      }
      return { ...prev, [key]: value };
    });
  }, []);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "thumbnail" | "banner") => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    
    if (type === "thumbnail") {
      if (form.thumbnailUrl && form.thumbnailUrl.toString().startsWith("blob:")) {
        safeRevoke(form.thumbnailUrl.toString());
      }
      const url = URL.createObjectURL(file);
      setThumbFile(file);
      // Removed setThumbName since it was unused
      setField("thumbnailUrl", url);
      setErrors(prev => ({ ...prev, thumbnail: "" }));
    } else {
      const existing = form.bannerUrls || [];
      if (existing.length >= 10) {
        toast.error("Maximum 10 banner images allowed");
        return;
      }
      const url = URL.createObjectURL(file);
      setField("bannerUrls", [...existing, url]);
      setBannerFiles(prev => [...prev, file]);
    }
  };
  
  const handleMultipleBannerFiles = (files: FileList) => {
    const existing = form.bannerUrls || [];
    const spaceLeft = 5 - existing.length;
    const filesToAdd = Array.from(files).slice(0, spaceLeft);
    
    if (filesToAdd.length < files.length) {
      toast.error(`Only ${spaceLeft} more banner images can be added`);
    }
    
    filesToAdd.forEach(file => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setField("bannerUrls", [...(form.bannerUrls || []), url]);
        setBannerFiles(prev => [...prev, file]);
      }
    });
  };
  
  const removeBanner = (index: number) => {
    const banners = [...(form.bannerUrls || [])];
    const [removed] = banners.splice(index, 1);
    if (removed) safeRevoke(removed.toString());
    setField("bannerUrls", banners);
    setBannerFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleColorThumbFiles = (color: string, files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (!file) return;
    
    setColorMedia((prev) => {
      const prevUrl = prev[color]?.thumbnailUrl;
      if (prevUrl && prevUrl.startsWith("blob:")) {
        safeRevoke(prevUrl);
      }
      const url = URL.createObjectURL(file);
      return {
        ...prev,
        [color]: {
          ...prev[color],
          thumbnailUrl: url,
          thumbFile: file,
          bannerUrls: prev[color]?.bannerUrls || [],
          modified: true
        },
      };
    });
  };
  
  const handleColorBannerFiles = (color: string, files: FileList | File[]) => {
    const incoming = Array.from(files);
    if (!incoming.length) return;
    
    setColorMedia((prev) => {
      const curr = prev[color] || { bannerUrls: [], bannerFiles: [] };
      const existing = curr.bannerUrls || [];
      const existingFiles = curr.bannerFiles || [];
      const spaceLeft = 10 - existing.length;
      const toAdd = incoming.slice(0, Math.max(0, spaceLeft));
      const urls = toAdd.map((f) => URL.createObjectURL(f));
      
      return { 
        ...prev, 
        [color]: { 
          ...curr, 
          bannerUrls: [...existing, ...urls],
          bannerFiles: [...existingFiles, ...toAdd],
          modified: true 
        } 
      };
    });
  };
  
  const removeColorBanner = (color: string, index: number) => {
    setColorMedia((prev) => {
      const banners = [...(prev[color]?.bannerUrls || [])];
      const files = [...(prev[color]?.bannerFiles || [])];
      const [removed] = banners.splice(index, 1);
      files.splice(index, 1);
      if (removed) safeRevoke(removed);
      return { 
        ...prev, 
        [color]: { 
          ...prev[color], 
          bannerUrls: banners,
          bannerFiles: files,
          modified: true 
        } 
      };
    });
  };
  
  const clearColorMedia = (color: string) => {
    setColorMedia((prev) => {
      const curr = prev[color];
      if (curr?.thumbnailUrl) safeRevoke(curr.thumbnailUrl);
      (curr?.bannerUrls || []).forEach(safeRevoke);
      return {
        ...prev,
        [color]: { bannerUrls: [], bannerFiles: [], modified: true }
      };
    });
    if (colorThumbRefs.current[color]) colorThumbRefs.current[color]!.value = "";
    if (colorBannerRefs.current[color]) colorBannerRefs.current[color]!.value = "";
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      if (errors.metaTitle || errors.metaDescription || errors.metaSchema) setActiveTab("seo");
      return;
    }
    
    setIsLoading(true);
    try {
      const fallbackMetaTitle = (form.metaTitle || form.name || "").slice(0, META_TITLE_LIMIT);
      
      const formData = new FormData();
      
      // Basic fields
      formData.append("name", form.name);
      formData.append("slug", slug);
      formData.append("category", form.category);
      formData.append("price", String(form.price ?? 0));
      if (form.discountedPrice !== undefined && form.discountedPrice !== null) {
        formData.append("discountedPrice", String(form.discountedPrice));
      }
      formData.append("stock", String(form.stock ?? 0));
      formData.append("status", form.status);
      formData.append("productType", form.productType || "single");
      
      // Description fields
      formData.append("description", form.description || "");
      formData.append("shortDescription", form.shortDescription || "");

      // Features as a simple string
      formData.append("features", form.features || "");

      // SEO fields
      formData.append("metaTitle", fallbackMetaTitle);
      formData.append("metaDescription", form.metaDescription || "");
      formData.append("metaKeywords", form.metaKeywords || "");
      formData.append("metaSchema", form.metaSchema || "");
      
      if (isVariant && form.variants) {
        // Handle variant products
        const variantStock = form.variants.reduce((sum, v) => sum + (Number((v as ProductVariant).stock) || 0), 0);
        const basePrice = (form.variants[0] as ProductVariant)?.price ?? 0;
        formData.set("stock", String(variantStock));
        formData.set("price", String(basePrice));
        formData.append("variants", JSON.stringify(form.variants));
        
        // Handle color-specific media
        console.log('Processing colorMedia for submission:', colorMedia);
        
        // If no colorMedia exists but we have variants, ensure each color gets processed
        if (Object.keys(colorMedia).length === 0 && selectedColors.length > 0) {
          console.log('No colorMedia found, but have selected colors:', selectedColors);
          // Initialize empty colorMedia for each selected color
          selectedColors.forEach(color => {
            if (!colorMedia[color]) {
              colorMedia[color] = { bannerUrls: [], modified: false };
            }
          });
        }
        
        for (const [color, media] of Object.entries(colorMedia)) {
          console.log(`Processing color ${color}:`, media);
          
          // Always process media in edit mode, regardless of modified status
          if (mode === "edit" || media.modified) {
            // Send new thumbnail file if uploaded
            if (media.thumbFile) {
              const thumbFileName = `${color}_${media.thumbFile.name}`;
              const renamedThumbFile = new File([media.thumbFile], thumbFileName, { type: media.thumbFile.type });
              formData.append("colorThumbnail", renamedThumbFile);
            } else if (media.thumbnailUrl && !media.thumbnailUrl.startsWith('blob:')) {
              // Keep existing thumbnail if no new file uploaded
              const cleanUrl = cleanUrlForBackend(media.thumbnailUrl);
              formData.append("existingColorThumbnails", JSON.stringify({ color, url: cleanUrl }));
            }
            
            // Send new banner files if uploaded
            if (media.bannerFiles && media.bannerFiles.length > 0) {
              media.bannerFiles.forEach((file, index) => {
                const bannerFileName = `${color}_${index}_${file.name}`;
                const renamedBannerFile = new File([file], bannerFileName, { type: file.type });
                formData.append("colorBanner", renamedBannerFile);
              });
            }
            
            // Always send existing banner URLs in edit mode
            const existingBanners = (media.bannerUrls || []).filter(url => 
              typeof url === 'string' && !url.startsWith('blob:')
            );
            if (existingBanners.length > 0) {
              const cleanUrls = existingBanners.map(cleanUrlForBackend);
              formData.append("existingColorBanners", JSON.stringify({ color, urls: cleanUrls }));
            }
          }
        }
      } else {
        // Handle single products
        if (thumbFile) formData.append("thumbnail", thumbFile);
        bannerFiles.forEach((f) => formData.append("banners", f));
      }
      
      // For edit mode, preserve existing images
      if (mode === "edit" && initialData) {
        if (!isVariant) {
          if (!thumbFile && initialData.thumbnailUrl) {
            // Clean the thumbnail URL to get relative path
            const cleanThumbUrl = cleanUrlForBackend(form.thumbnailUrl || initialData.thumbnailUrl);
            formData.append("existingThumbnail", cleanThumbUrl);
          }
          // Send the current banner URLs (which may have been modified by removal)
          // Filter out blob URLs and only keep actual server URLs
          const existingServerBanners = (form.bannerUrls || []).filter(url => 
            typeof url === 'string' && !url.startsWith('blob:')
          ).map(cleanUrlForBackend);
          if (existingServerBanners.length > 0 || bannerFiles.length > 0) {
            formData.append("existingBanners", JSON.stringify(existingServerBanners));
          }
        }
      }
      
      if (mode === "create") {
        await productService.createProduct(formData);
      } else {
        await productService.updateProduct((initialData as Product).id, formData);
      }
      
      if (onSubmit) {
        const submitData: ProductFormData = {
          ...form,
          slug,
          metaTitle: fallbackMetaTitle,
          metaDescription: form.metaDescription || "",
          metaKeywords: form.metaKeywords || "",
          metaSchema: form.metaSchema || ""
        };
        onSubmit(submitData);
      }
      
      toast.success(`Product ${mode === "create" ? "created" : "updated"} successfully!`);
      
      if (mode === "create") {
        // Reset form
        setForm(initialFormData);
        setSelectedColors([]);
        setSelectedSizes([]);
        setColorMedia({});
        setThumbFile(null);
        setBannerFiles([]);
        // Removed setThumbName since it was unused
        if (thumbInputRef.current) thumbInputRef.current.value = "";
        if (bannerInputRef.current) bannerInputRef.current.value = "";
      }
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error(`Error ${mode === "create" ? "creating" : "updating"} product:`, error);
      toast.error(`Failed to ${mode} product`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // SEO Preview
  const previewTitle = (form.metaTitle || form.name || "").slice(0, META_TITLE_LIMIT);
  const previewUrl = `/products/${slug || "your-slug"}`;
  const previewDesc = (form.metaDescription || `${form.name} - ${form.category} - Starting from £${form.price}`).slice(0, META_DESC_LIMIT);
  
  return (
    <div className="bg-white shadow-xl rounded-xl border border-gray-100">
      <form onSubmit={handleSubmit} className="">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-white">
                {mode === "create" ? "Create New Product" : "Edit Product"}
              </h3>
              <p className="text-indigo-100 text-sm mt-1">
                {mode === "create"
                  ? "Add a new product to your inventory"
                  : "Update product information and settings"
                }
              </p>
            </div>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-white hover:text-indigo-200 transition-colors duration-200 p-2 hover:bg-white/20 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="bg-gray-50 border-b border-gray-200">
          <nav className="flex px-6" aria-label="Tabs">
            {[
              {
                key: "content",
                label: "Product Details",
                icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
                description: "Basic info, pricing, variants"
              },
              {
                key: "description",
                label: "Description",
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                description: "Product descriptions, features"
              },
              {
                key: "seo",
                label: "SEO & Meta",
                icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
                description: "Meta tags, search optimization"
              },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key as "content" | "description" | "seo")}
                className={`group relative flex flex-col items-center px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === t.key
                    ? "text-indigo-600 bg-white rounded-t-lg shadow-sm border-x border-t border-gray-200 -mb-px"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-t-lg"
                }`}
              >
                <svg className={`w-5 h-5 mb-1 ${activeTab === t.key ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
                </svg>
                <span className="font-medium">{t.label}</span>
                <span className={`text-xs mt-1 ${activeTab === t.key ? 'text-indigo-500' : 'text-gray-400'}`}>
                  {t.description}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="px-6 py-6">

        {/* CONTENT TAB */}
        {activeTab === "content" && (
          <div className="space-y-8">
            {/* Basic Info Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Basic Information</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Product Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g., Premium Compression T-Shirt"
                      className="block w-full rounded-xl border-2 border-gray-200 shadow-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 px-5 py-4 text-lg font-medium text-gray-900 placeholder-gray-500 bg-white hover:border-gray-300"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                  {errors.name && <p className="mt-3 text-sm text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.name}
                  </p>}
                </div>

                <div>
                  <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    URL Slug
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={slug}
                      className="block w-full rounded-xl border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg text-gray-600 px-5 py-4 text-lg font-medium"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <div className="bg-blue-100 rounded-lg p-2">
                        <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-blue-600 flex items-center bg-blue-50 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Auto-generated from product name
                  </p>
                </div>

                <div>
                  <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Category
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      className="block w-full rounded-xl border-2 border-gray-200 shadow-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 px-5 py-4 text-lg font-medium text-gray-900 bg-white hover:border-gray-300 appearance-none"
                      value={form.category}
                      onChange={(e) => setField("category", e.target.value)}
                    >
                      <option value="" className="text-gray-500">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <div className="bg-purple-100 rounded-lg p-2">
                        <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {errors.category && <p className="mt-3 text-sm text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.category}
                  </p>}
                </div>

                <div>
                  <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Price (£)
                    {!isVariant && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <div className="bg-green-100 rounded-lg px-2 py-1">
                        <span className="text-green-700 text-lg font-bold">£</span>
                      </div>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required={!isVariant}
                      disabled={isVariant}
                      placeholder="0.00"
                      className={`block w-full pl-16 pr-5 py-4 rounded-xl border-2 shadow-lg focus:ring-4 transition-all duration-200 text-lg font-semibold ${
                        isVariant
                          ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                          : 'border-gray-200 bg-white text-gray-900 focus:border-green-500 focus:ring-green-100 hover:border-gray-300'
                      }`}
                      value={form.price}
                      onChange={(e) => setField("price", Number(e.target.value))}
                    />
                  </div>
                  {errors.price && <p className="mt-3 text-sm text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.price}
                  </p>}
                  {isVariant && <p className="mt-3 text-sm text-indigo-600 flex items-center bg-indigo-50 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Set individual prices for each variant below
                  </p>}
                </div>

                <div>
                  <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Discounted Price (£)
                    <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Optional</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <div className="bg-orange-100 rounded-lg px-2 py-1">
                        <span className="text-orange-700 text-lg font-bold">£</span>
                      </div>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      disabled={isVariant}
                      placeholder="0.00"
                      className={`block w-full pl-16 pr-5 py-4 rounded-xl border-2 shadow-lg focus:ring-4 transition-all duration-200 text-lg font-semibold ${
                        isVariant
                          ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                          : 'border-gray-200 bg-white text-gray-900 focus:border-orange-500 focus:ring-orange-100 hover:border-gray-300'
                      }`}
                      value={form.discountedPrice ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setField("discountedPrice", val === "" ? undefined : Number(val));
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                    Stock Quantity
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      disabled={isVariant}
                      placeholder="0"
                      className={`block w-full px-5 py-4 rounded-xl border-2 shadow-lg focus:ring-4 transition-all duration-200 text-lg font-semibold ${
                        isVariant
                          ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                          : 'border-gray-200 bg-white text-gray-900 focus:border-cyan-500 focus:ring-cyan-100 hover:border-gray-300'
                      }`}
                      value={form.stock}
                      onChange={(e) => setField("stock", Number(e.target.value))}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <div className="bg-cyan-100 rounded-lg p-2">
                        <svg className="h-4 w-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {errors.stock && <p className="mt-3 text-sm text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.stock}
                  </p>}
                  {isVariant && <p className="mt-3 text-sm text-cyan-600 flex items-center bg-cyan-50 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Total stock will automatically sum from all variants
                  </p>}
                </div>

                <div>
                  <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Publication Status
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full rounded-xl border-2 border-gray-200 shadow-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 px-5 py-4 text-lg font-semibold text-gray-900 bg-white hover:border-gray-300 appearance-none"
                      value={form.status}
                      onChange={(e) => setField("status", e.target.value as ProductFormData["status"])}
                    >
                      <option value="published" className="text-green-700">✅ Published - Live on store</option>
                      <option value="draft" className="text-yellow-700">📝 Draft - Not visible</option>
                      <option value="out_of_stock" className="text-red-700">📦 Out of Stock</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <div className="bg-yellow-100 rounded-lg p-2">
                        <svg className="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className={`text-sm px-3 py-2 rounded-lg flex items-center ${
                      form.status === 'published'
                        ? 'bg-green-50 text-green-700'
                        : form.status === 'draft'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        form.status === 'published'
                          ? 'bg-green-500'
                          : form.status === 'draft'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}></div>
                      {form.status === 'published' && 'Product will be visible to customers'}
                      {form.status === 'draft' && 'Product is saved but not published'}
                      {form.status === 'out_of_stock' && 'Product is visible but marked as unavailable'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Type Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Product Type</h4>
              </div>
              {mode === 'edit' && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-amber-700 font-medium">
                      Product type cannot be changed after creation to preserve data integrity
                    </p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative flex rounded-lg border p-4 transition-all duration-200 ${
                  !isVariant
                    ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  } ${mode === 'edit' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                  <input
                    type="radio"
                    name="productType"
                    value="single"
                    checked={!isVariant}
                    disabled={mode === 'edit'}
                    onChange={() => {
                      setField("productType", "single");
                      setSelectedColors([]);
                      setSelectedSizes([]);
                      setField("variants", []);
                    }}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                      !isVariant ? 'border-indigo-600' : 'border-gray-300'
                    }`}>
                      {!isVariant && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Single Product</div>
                      <div className="text-sm text-gray-500">One price, one stock level</div>
                    </div>
                  </div>
                </label>
                <label className={`relative flex rounded-lg border p-4 transition-all duration-200 ${
                  isVariant
                    ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  } ${mode === 'edit' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                  <input
                    type="radio"
                    name="productType"
                    value="variant"
                    checked={isVariant}
                    disabled={mode === 'edit'}
                    onChange={() => setField("productType", "variant")}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                      isVariant ? 'border-indigo-600' : 'border-gray-300'
                    }`}>
                      {isVariant && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Variant Product</div>
                      <div className="text-sm text-gray-500">Multiple colors & sizes</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Variant Configuration */}
            {isVariant && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">Colors *</label>
                    {onManageAttributes && (
                      <button
                        type="button"
                        onClick={onManageAttributes}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        Manage Colors
                      </button>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <label key={color} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedColors([...selectedColors, color]);
                            } else {
                              setSelectedColors(selectedColors.filter(c => c !== color));
                            }
                          }}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{color}</span>
                      </label>
                    ))}
                  </div>
                  {errors.colors && <p className="mt-1 text-sm text-red-600">{errors.colors}</p>}
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">Sizes *</label>
                    {onManageAttributes && (
                      <button
                        type="button"
                        onClick={onManageAttributes}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        Manage Sizes
                      </button>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sizeOptions.map((size) => (
                      <label key={size} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSizes([...selectedSizes, size]);
                            } else {
                              setSelectedSizes(selectedSizes.filter(s => s !== size));
                            }
                          }}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{size}</span>
                      </label>
                    ))}
                  </div>
                  {errors.sizes && <p className="mt-1 text-sm text-red-600">{errors.sizes}</p>}
                </div>

                {/* Variants Table */}
                {variantCombos.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Variant Pricing & Stock</label>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (£)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {(form.variants as ProductVariant[] || []).map((variant: ProductVariant, index: number) => (
                            <tr key={`${variant.color}-${variant.size}`}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.color}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.size}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={variant.price || ""}
                                  onChange={(e) => {
                                    const newVariants = [...(form.variants as ProductVariant[] || [])];
                                    newVariants[index] = { ...variant, price: Number(e.target.value) };
                                    setField("variants", newVariants);
                                  }}
                                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="number"
                                  min="0"
                                  value={variant.stock || ""}
                                  onChange={(e) => {
                                    const newVariants = [...(form.variants as ProductVariant[] || [])];
                                    newVariants[index] = { ...variant, stock: Number(e.target.value) };
                                    setField("variants", newVariants);
                                  }}
                                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Images */}
            {!isVariant && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thumbnail Image *</label>
                  <input
                    ref={thumbInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "thumbnail")}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {form.thumbnailUrl && (
                    <div className="mt-2">
                      <Image
                        src={form.thumbnailUrl.toString()}
                        alt="Thumbnail preview"
                        width={150}
                        height={150}
                        className="object-cover rounded"
                        unoptimized
                      />
                    </div>
                  )}
                  {errors.thumbnail && <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-semibold text-gray-700">Banner Images</label>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {form.bannerUrls?.length || 0}/10 images
                    </span>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors duration-200">
                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          handleMultipleBannerFiles(e.target.files);
                        }
                      }}
                      className="hidden"
                    />
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="text-gray-500 mb-3">Add banner images to showcase your product</p>
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                    >
                      Add Banner Images
                    </button>
                    <p className="text-xs text-gray-400 mt-2">Select multiple files (Max 10 images)</p>
                  </div>

                  {form.bannerUrls && form.bannerUrls.length > 0 && (
                    <div className="mt-6">
                      <h5 className="text-sm font-semibold text-gray-700 mb-3">Uploaded Banners</h5>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {form.bannerUrls.map((url, index) => (
                          <div key={index} className="relative group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                            <div className="aspect-square">
                              <Image
                                src={url.toString()}
                                alt={`Banner ${index + 1}`}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div className="absolute top-2 right-2">
                              <button
                                type="button"
                                onClick={() => removeBanner(index)}
                                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg transition-colors duration-200 opacity-80 hover:opacity-100"
                                aria-label={`Remove banner image ${index + 1}`}
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-1 px-2 text-center">
                              Banner {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Color-specific images for variant products */}
            {isVariant && selectedColors.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Color-Specific Images</h4>
                {selectedColors.map((color) => (
                  <div key={color} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all">
                    <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                      <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color.toLowerCase() }}></span>
                      {color}
                    </h5>
                    
                    <div className="space-y-3">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
                        <input
                          ref={(el) => { colorThumbRefs.current[color] = el; }}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files) {
                              handleColorThumbFiles(color, e.target.files);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        {colorMedia[color]?.thumbnailUrl && (
                          <div className="mt-3">
                            <div className="relative bg-gray-50 p-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all inline-block">
                              <div className="relative overflow-hidden rounded-md">
                                <Image
                                  src={colorMedia[color].thumbnailUrl!}
                                  alt={`${color} thumbnail`}
                                  width={120}
                                  height={120}
                                  className="object-cover rounded"
                                  unoptimized
                                />
                              </div>
                              <div className="mt-2 text-center text-xs text-gray-500">
                                {color} Thumbnail
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Banners (Max 5)</label>
                        <div className="flex items-center">
                          <input
                            ref={(el) => { colorBannerRefs.current[color] = el; }}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              if (e.target.files) {
                                handleColorBannerFiles(color, e.target.files);
                              }
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                          />
                          {colorMedia[color]?.bannerUrls && colorMedia[color].bannerUrls.length > 0 && (
                            <span className="ml-3 text-sm text-gray-500">
                              {colorMedia[color].bannerUrls.length}/5 images
                            </span>
                          )}
                        </div>
                        {colorMedia[color]?.bannerUrls && colorMedia[color].bannerUrls.length > 0 && (
                          <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5">
                            {colorMedia[color].bannerUrls.map((url, index) => (
                              <div key={index} className="relative group bg-white rounded border border-gray-200 hover:shadow-sm transition-all">
                                <div className="relative aspect-square">
                                  <Image
                                    src={url}
                                    alt={`${color} banner ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                                <div className="absolute top-1 right-1">
                                  <button
                                    type="button"
                                    onClick={() => removeColorBanner(color, index)}
                                    className="absolute -top-2 -right-2 bg-white hover:bg-red-50 text-red-600 rounded-full w-6 h-6 flex items-center justify-center border border-red-200 shadow-sm hover:shadow transition-all"
                                    aria-label={`Remove ${color} banner image ${index + 1}`}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </div>
                                <div className="p-0.5 text-center text-[11px] leading-tight text-gray-500 truncate">
                                  {color} {index + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => clearColorMedia(color)}
                        className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Clear all {color} images
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ENHANCED DESCRIPTION TAB */}
        {activeTab === "description" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                    Short Description
                  </h4>
                  <p className="text-base text-gray-700 mt-1">Brief product summary visible in listings and search results</p>
                </div>
              </div>

              <div className="relative mb-4">
                <textarea
                  rows={4}
                  placeholder="Enter a brief, compelling summary that highlights the key benefits and appeal of your product (2-3 sentences)"
                  className="block w-full rounded-2xl border-2 border-gray-200 shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 px-6 py-5 text-lg text-gray-900 placeholder-gray-500 bg-white hover:border-blue-300 resize-none font-medium leading-relaxed"
                  value={form.shortDescription || ""}
                  onChange={(e) => setField("shortDescription", e.target.value)}
                  maxLength={500}
                />
                <div className="absolute bottom-3 right-3">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-blue-700 bg-blue-100 px-4 py-2 rounded-xl">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Perfect for product cards and search results
                </div>
                <div className="flex items-center">
                  <span className={`text-sm font-bold px-4 py-2 rounded-xl shadow-sm ${
                    (form.shortDescription || "").length > 450
                      ? 'bg-red-100 text-red-700 border-2 border-red-200'
                      : (form.shortDescription || "").length > 300
                      ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-200'
                      : 'bg-green-100 text-green-700 border-2 border-green-200'
                  }`}>
                    <span className="mr-2">
                      {(form.shortDescription || "").length > 450 ? '⚠️' :
                       (form.shortDescription || "").length > 300 ? '⚡' : '✅'}
                    </span>
                    {(form.shortDescription || "").length}/500 characters
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                    Full Description
                  </h4>
                  <p className="text-base text-gray-700 mt-1">Comprehensive product information for the product page</p>
                </div>
              </div>

              <div className="relative mb-4">
                <textarea
                  rows={12}
                  placeholder="Enter comprehensive product details including:&#10;&#10;• Materials and fabric composition&#10;• Fit and sizing information&#10;• Care and washing instructions&#10;• Key benefits and features&#10;• Usage recommendations&#10;• Any special technologies or treatments"
                  className="block w-full rounded-2xl border-2 border-gray-200 shadow-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 px-6 py-5 text-lg text-gray-900 placeholder-gray-500 bg-white hover:border-green-300 resize-y min-h-[300px] font-medium leading-relaxed"
                  value={form.description || ""}
                  onChange={(e) => setField("description", e.target.value)}
                />
                <div className="absolute bottom-4 right-4">
                  <div className="bg-green-100 rounded-lg p-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </div>
              </div>


            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                    Key Features & Benefits
                  </h4>
                  <p className="text-base text-gray-700 mt-1">Highlight what makes your product special</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-white rounded-2xl p-6 border-2 border-purple-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-purple-300">
                  <textarea
                    value={form.features || ""}
                    onChange={(e) => setField("features", e.target.value)}
                    placeholder="Enter product features, one per line:&#10;• Moisture-wicking fabric technology&#10;• Anti-bacterial treatment for freshness&#10;• Four-way stretch for maximum mobility&#10;• Reinforced seams for durability&#10;• UPF 50+ sun protection"
                    rows={6}
                    className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 px-4 py-3 text-base font-medium text-gray-900 placeholder-gray-500 bg-white hover:border-gray-300 resize-vertical"
                  />
                </div>
              </div>


            </div>
          </div>
        )}

        {/* ENHANCED SEO & META TAB */}
        {activeTab === "seo" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></span>
                    Search Engine Optimization
                  </h4>
                  <p className="text-base text-gray-700 mt-1">Optimize your product for search engines and social media</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-base font-bold text-gray-800 flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      Meta Title
                    </label>
                    <div className="flex items-center">
                      <span className={`text-sm font-bold px-3 py-1 rounded-xl shadow-sm ${
                        (form.metaTitle || "").length > META_TITLE_LIMIT
                          ? 'bg-red-100 text-red-700 border-2 border-red-200'
                          : (form.metaTitle || "").length > META_TITLE_LIMIT - 10
                          ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-200'
                          : 'bg-green-100 text-green-700 border-2 border-green-200'
                      }`}>
                        <span className="mr-2">
                          {(form.metaTitle || "").length > META_TITLE_LIMIT ? '⚠️' :
                           (form.metaTitle || "").length > META_TITLE_LIMIT - 10 ? '⚡' : '✅'}
                        </span>
                        {(form.metaTitle || "").length}/{META_TITLE_LIMIT}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Keep it under ~60 characters, include primary keyword"
                      className="block w-full rounded-2xl border-2 border-gray-200 shadow-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 px-6 py-4 text-lg font-medium text-gray-900 placeholder-gray-500 bg-white hover:border-indigo-300 pr-16"
                      value={form.metaTitle || ""}
                      onChange={(e) => setField("metaTitle", e.target.value)}
                      maxLength={120}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <div className="bg-indigo-100 rounded-lg p-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {errors.metaTitle && <p className="mt-3 text-sm text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.metaTitle}
                  </p>}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-base font-bold text-gray-800 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Meta Description
                    </label>
                    <div className="flex items-center">
                      <span className={`text-sm font-bold px-3 py-1 rounded-xl shadow-sm ${
                        (form.metaDescription || "").length > META_DESC_LIMIT
                          ? 'bg-red-100 text-red-700 border-2 border-red-200'
                          : (form.metaDescription || "").length > META_DESC_LIMIT - 20
                          ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-200'
                          : 'bg-green-100 text-green-700 border-2 border-green-200'
                      }`}>
                        <span className="mr-2">
                          {(form.metaDescription || "").length > META_DESC_LIMIT ? '⚠️' :
                           (form.metaDescription || "").length > META_DESC_LIMIT - 20 ? '⚡' : '✅'}
                        </span>
                        {(form.metaDescription || "").length}/{META_DESC_LIMIT}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      rows={4}
                      placeholder="Write a compelling summary that describes your product and encourages clicks. Keep it under 155 characters for best results."
                      className="block w-full rounded-2xl border-2 border-gray-200 shadow-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 px-6 py-4 text-lg text-gray-900 placeholder-gray-500 bg-white hover:border-purple-300 resize-none font-medium leading-relaxed"
                      value={form.metaDescription || ""}
                      onChange={(e) => setField("metaDescription", e.target.value)}
                      maxLength={320}
                    />
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-purple-100 rounded-lg p-2">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {errors.metaDescription && <p className="mt-3 text-sm text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.metaDescription}
                  </p>}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></span>
                    Meta Keywords
                  </h4>
                  <p className="text-base text-gray-700 mt-1">Add relevant keywords separated by commas</p>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., compression shirt, athletic wear, gym clothing, moisture-wicking, fitness apparel"
                  className="block w-full rounded-2xl border-2 border-gray-200 shadow-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 px-6 py-4 text-lg font-medium text-gray-900 placeholder-gray-500 bg-white hover:border-emerald-300 pr-16"
                  value={form.metaKeywords || ""}
                  onChange={(e) => setField("metaKeywords", e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <div className="bg-emerald-100 rounded-lg p-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>


            </div>

            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-8 border-2 border-slate-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-slate-500 rounded-full mr-3"></span>
                    Structured Data (JSON-LD)
                  </h4>
                  <p className="text-base text-gray-700 mt-1">Advanced schema markup for rich search results</p>
                </div>
              </div>

              <div className="relative">
                <textarea
                  rows={10}
                  placeholder='Paste valid JSON-LD schema here. Example:&#10;{&#10;  "@context": "https://schema.org",&#10;  "@type": "Product",&#10;  "name": "Your Product Name",&#10;  "description": "Product description",&#10;  "brand": "Your Brand",&#10;  "offers": {&#10;    "@type": "Offer",&#10;    "price": "29.99",&#10;    "priceCurrency": "GBP"&#10;  }&#10;}'
                  className={`block w-full rounded-2xl border-2 shadow-lg transition-all duration-300 px-6 py-4 text-base text-gray-900 placeholder-gray-500 bg-white resize-y min-h-[200px] font-mono leading-relaxed ${
                    errors.metaSchema
                      ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 focus:border-slate-500 focus:ring-4 focus:ring-slate-100 hover:border-slate-300"
                  }`}
                  value={form.metaSchema || ""}
                  onChange={(e) => setField("metaSchema", e.target.value)}
                />
                <div className="absolute bottom-4 right-4">
                  <div className={`rounded-lg p-2 ${errors.metaSchema ? 'bg-red-100' : 'bg-slate-100'}`}>
                    <svg className={`w-4 h-4 ${errors.metaSchema ? 'text-red-600' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                </div>
              </div>

              {errors.metaSchema && <p className="mt-3 text-sm text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-lg">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.metaSchema}
              </p>}

            </div>

            {/* Enhanced Google Preview */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                    Search Engine Preview
                  </h4>
                  <p className="text-base text-gray-700 mt-1">See how your product will appear in Google search results</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-inner">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">G</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 font-medium">Google Search Result</span>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mt-1"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="text-lg text-[#1a0dab] leading-snug hover:underline cursor-pointer font-medium">
                        {previewTitle || "Your Product Title Here - Start typing to see changes"}
                      </h3>
                      <p className="text-sm text-[#006621] mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        {previewUrl}
                      </p>
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                        {previewDesc || "Your meta description preview will appear here. Make it compelling to encourage clicks from search results."}
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        </div>

        {/* Enhanced Actions */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {mode === "create" ? "Ready to add this product?" : "Save your changes?"}
            </div>
            <div className="flex space-x-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {mode === "create" ? "Creating Product..." : "Updating Product..."}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mode === "create" ? "M12 6v6m0 0v6m0-6h6m-6 0H6" : "M5 13l4 4L19 7"} />
                    </svg>
                    {mode === "create" ? "Create Product" : "Update Product"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}