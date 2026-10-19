"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  AlignLeft,
  Eye,
  FileText,
  Image as ImageIcon,
  Info,
  Plus,
  Save,
  Search,
  Settings2,
  Tag,
} from "lucide-react";
import type { Product, ProductVariant } from "./AllProducts";
import type { Category } from "./CategoriesTab";
import { slugify, buildVariantCombos, syncVariants, type Variant } from "../services/productCreateService";
import { productService } from "../services/productService";
import { collectionService, type CollectionItem } from "../services/collectionService";
import { prepareImagesForUpload } from "@/lib/compressImage";
import { getApiErrorMessage } from "@/lib/apiError";
import { formatPrice } from "@/lib/formatPrice";
import { htmlToPlainText } from "@/lib/htmlToText";
import {
  Button,
  FormField,
  Input,
  Section,
  Select,
  StatusBadge,
  Textarea,
} from "@/components/admin/ui";
import { ImageGalleryField, SingleImageField } from "./product_form/ImageFields";
import { OptionChips } from "./product_form/OptionChips";
import { VariantEditor } from "./product_form/VariantEditor";
import { ColorImagesCard } from "./product_form/ColorImagesCard";
import { HintWithCount, ProductTypePicker, StatusPicker } from "./product_form/FormBits";
import { SeoPreview } from "./product_form/SeoPreview";
import { ProductSummary } from "./product_form/ProductSummary";
import { focusFirstError } from "./product_form/focusFirstError";

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
// The backend stores at most 5 banner images per product
const MAX_BANNERS = 5;

// Existing image URLs from the API: absolute (Vercel Blob) or backend-relative (legacy uploads)
const toDisplayUrl = (url?: string): string | undefined => {
  if (!url) return url;
  if (/^(https?:|blob:|data:)/i.test(url)) return url;
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Reason a picked file can't be used as an image, or null when it is fine
const imageRejection = (file: File): string | null => {
  if (file.type.startsWith("image/")) return null;
  return /\.(heic|heif)$/i.test(file.name)
    ? "HEIC photos are not supported. Please export the photo as JPG or PNG."
    : "Please upload an image file (JPG, PNG or WebP)";
};

const IMAGE_HINT = "JPG, PNG or WebP. Images are optimized automatically before upload.";

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
  features: "",
  collectionType: "none",
  collectionId: ""
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
  const [form, setForm] = useState<ProductFormData>(() => {
    if (initialData) {
      console.log('ProductForm initialData:', initialData);
      console.log('Collection data:', {
        collectionType: initialData.collectionType,
        collectionId: initialData.collectionId
      });
      return {
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
        // Seeded products stored HTML; show (and re-save) it as the plain text the store displays.
        description: htmlToPlainText((initialData as ExtendedProduct)?.description),
        shortDescription: (initialData as ExtendedProduct)?.shortDescription || "",
        features: (initialData as ExtendedProduct)?.features || "",
        collectionType: initialData.collectionType || "none",
        collectionId: initialData.collectionId || ""
      };
    }
    return initialFormData;
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // File handling state
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [bannerFiles, setBannerFiles] = useState<File[]>([]);
  // Removed unused thumbName state

  // Variant state
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [colorMedia, setColorMedia] = useState<Record<string, ColorMediaData>>({});

  // Collection state
  const [themes, setThemes] = useState<CollectionItem[]>([]);
  const [series, setSeries] = useState<CollectionItem[]>([]);
  
  // Refs
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const colorThumbRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const colorBannerRefs = useRef<Record<string, HTMLInputElement | null>>({});
  
  const isVariant = form.productType === "variant";
  const slug = useMemo(() => slugify(form.name), [form.name]);
  
  
  // Helper to clean URL for sending to backend: backend-served paths become relative ("/uploads/..."),
  // absolute URLs on other hosts (Vercel Blob) are kept as-is. Prefixing those with "/" broke the image.
  const cleanUrlForBackend = (url: string): string => {
    if (!url) return url;
    const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');
    let cleanUrl = url.trim();
    if (backendUrl && cleanUrl.startsWith(backendUrl)) {
      cleanUrl = cleanUrl.slice(backendUrl.length);
    }
    cleanUrl = cleanUrl.replace(/^\/+(?=https?:\/\/)/i, '');
    if (/^https?:\/\//i.test(cleanUrl)) return cleanUrl;
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
          const colorMediaData: Record<string, ColorMediaData> = {};
          Object.entries(initialData.colorMedia).forEach(([color, media]) => {
            if (media && typeof media === 'object') {
              colorMediaData[color] = {
                thumbnailUrl: toDisplayUrl(media.thumbnailUrl),
                bannerUrls: Array.isArray(media.bannerUrls)
                  ? media.bannerUrls.map((url: string) => toDisplayUrl(url) as string)
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

  // Load themes and series on mount
  useEffect(() => {
    const loadCollections = async () => {
      try {
        const [themesData, seriesData] = await Promise.all([
          collectionService.getAllThemes(),
          collectionService.getAllSeries()
        ]);
        setThemes(themesData);
        setSeries(seriesData);
      } catch (error) {
        console.error('Error loading collections:', error);
      }
    };
    loadCollections();
  }, []);

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
      else if (!Number.isInteger(Number(form.stock))) e.stock = "Stock must be a whole number";
      if (form.discountedPrice !== undefined && form.discountedPrice !== null && form.discountedPrice > form.price) {
        e.discountedPrice = "Discounted price cannot be higher than the regular price";
      }
      if (mode === "create" && !thumbFile && !form.thumbnailUrl?.trim()) {
        e.thumbnail = "Thumbnail is required";
      }
    } else {
      if (selectedColors.length === 0) e.colors = "Select at least one color";
      if (selectedSizes.length === 0) e.sizes = "Select at least one size";
      ((form.variants as ProductVariant[]) || []).forEach((v, i) => {
        const label = `${v.color} / ${v.size}`;
        if (!v.price || v.price < 0) e[`variant-${i}-price`] = `Enter a price for ${label}`;
        else if (v.discountedPrice !== undefined && v.discountedPrice !== null && v.discountedPrice > v.price) {
          e[`variant-${i}-discountedPrice`] = `Discount for ${label} is higher than its price`;
        }
        if (Number(v.stock) < 0 || !Number.isInteger(Number(v.stock || 0))) {
          e[`variant-${i}-stock`] = `Stock for ${label} must be a whole number`;
        }
      });
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
  
  const setField = useCallback(<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setForm((prev) => {
      if (key === 'name' && typeof value === 'string') {
        const metaTitle = prev.metaTitle ? prev.metaTitle : value.slice(0, META_TITLE_LIMIT);
        return { ...prev, [key]: value, metaTitle };
      }
      return { ...prev, [key]: value };
    });
  }, []);
  
  // Clear inline errors as soon as the admin edits the field
  const clearError = useCallback((...keys: string[]) => {
    setErrors((prev) => {
      if (!keys.some((k) => prev[k])) return prev;
      const next = { ...prev };
      keys.forEach((k) => delete next[k]);
      return next;
    });
  }, []);

  const handleThumbnailFiles = (files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (!file) return;

    const rejection = imageRejection(file);
    if (rejection) {
      toast.error(rejection);
      return;
    }

    if (form.thumbnailUrl && form.thumbnailUrl.toString().startsWith("blob:")) {
      safeRevoke(form.thumbnailUrl.toString());
    }
    const url = URL.createObjectURL(file);
    setThumbFile(file);
    setField("thumbnailUrl", url);
    setErrors(prev => ({ ...prev, thumbnail: "" }));
  };

  // Create: drop the picked thumbnail. Edit: undo a newly picked one and show the saved image again.
  const clearThumbnail = () => {
    safeRevoke(form.thumbnailUrl?.toString());
    setThumbFile(null);
    setField("thumbnailUrl", mode === "edit" ? toDisplayUrl(initialData?.thumbnailUrl) || "" : "");
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  const handleMultipleBannerFiles = (files: FileList) => {
    const existing = form.bannerUrls || [];
    const spaceLeft = Math.max(0, MAX_BANNERS - existing.length);
    const images = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (images.length < files.length) {
      const rejected = Array.from(files).find((file) => !file.type.startsWith("image/"));
      toast.error(rejected && images.length === 0 ? imageRejection(rejected)! : "Only image files can be added");
    }
    const filesToAdd = images.slice(0, spaceLeft);

    if (filesToAdd.length < images.length) {
      toast.error(`Only ${spaceLeft} more banner images can be added`);
    }
    if (filesToAdd.length === 0) return;

    // One state update for all files (updating inside the loop kept only the last preview)
    const urls = filesToAdd.map((file) => URL.createObjectURL(file));
    setField("bannerUrls", [...existing, ...urls]);
    setBannerFiles(prev => [...prev, ...filesToAdd]);
  };

  const removeBanner = (index: number) => {
    const banners = [...(form.bannerUrls || [])];
    // bannerFiles only holds NEW files, in the same order as the blob: previews in bannerUrls
    // (existing server banners come first in edit mode), so map the index to the new-file index.
    const fileIndex = banners.slice(0, index + 1).filter((u) => String(u).startsWith("blob:")).length - 1;
    const [removed] = banners.splice(index, 1);
    if (removed) safeRevoke(removed.toString());
    setField("bannerUrls", banners);
    if (removed && String(removed).startsWith("blob:") && fileIndex >= 0) {
      setBannerFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
  };
  
  const handleColorThumbFiles = (color: string, files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (!file) return;
    const rejection = imageRejection(file);
    if (rejection) {
      toast.error(rejection);
      return;
    }

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
    const picked = Array.from(files);
    if (!picked.length) return;
    const incoming = picked.filter((file) => !imageRejection(file));
    if (incoming.length < picked.length) {
      toast.error(incoming.length === 0 ? imageRejection(picked[0])! : "Only image files can be added");
    }
    // Same limit as the product banners (the old 10 here contradicted the "Max 5" label)
    const spaceLeft = Math.max(0, MAX_BANNERS - (colorMedia[color]?.bannerUrls?.length || 0));
    if (incoming.length > spaceLeft) {
      toast.error(spaceLeft > 0
        ? `Only ${spaceLeft} more ${color} banner images can be added`
        : `Maximum ${MAX_BANNERS} banner images per color`);
    }
    const toAdd = incoming.slice(0, spaceLeft);
    if (!toAdd.length) return;
    const urls = toAdd.map((f) => URL.createObjectURL(f));

    setColorMedia((prev) => {
      const curr = prev[color] || { bannerUrls: [], bannerFiles: [] };
      const existing = curr.bannerUrls || [];
      const existingFiles = curr.bannerFiles || [];

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
      // bannerFiles only holds NEW files, in the same order as their blob: previews (saved banners
      // come first in edit mode), so map the preview index to the new-file index.
      const fileIndex = banners.slice(0, index + 1).filter((u) => String(u).startsWith("blob:")).length - 1;
      const [removed] = banners.splice(index, 1);
      if (removed && String(removed).startsWith("blob:") && fileIndex >= 0) files.splice(fileIndex, 1);
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
    const validationErrors = validate();
    const firstError = Object.values(validationErrors).find(Boolean);
    if (firstError) {
      // Every section is on one page now: bring the first invalid field into view
      focusFirstError(formRef.current);
      toast.error(firstError);
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading(mode === "create" ? "Creating product..." : "Saving product...");
    try {
      const fallbackMetaTitle = (form.metaTitle || form.name || "").slice(0, META_TITLE_LIMIT);

      // Shrink photos in the browser before upload: the API runs on Vercel, which rejects any
      // request over 4.5 MB, and a single phone photo can be bigger than that.
      const shouldSendColor = (media: ColorMediaData) => mode === "edit" || !!media.modified;
      const originals: File[] = isVariant
        ? Object.values(colorMedia).filter(shouldSendColor).flatMap((media) => [
            ...(media.thumbFile ? [media.thumbFile] : []),
            ...(media.bannerFiles || []),
          ])
        : [...(thumbFile ? [thumbFile] : []), ...bannerFiles];
      const optimized = new Map<File, File>();
      if (originals.length > 0) {
        toast.loading(`Optimizing ${originals.length} image${originals.length > 1 ? "s" : ""}...`, { id: toastId });
        const prepared = await prepareImagesForUpload(originals);
        originals.forEach((file, i) => optimized.set(file, prepared[i]));
        toast.loading(mode === "create" ? "Creating product..." : "Saving product...", { id: toastId });
      }
      const forUpload = (file: File) => optimized.get(file) ?? file;

      const formData = new FormData();
      
      // Basic fields
      formData.append("name", form.name);
      formData.append("slug", slug);
      formData.append("category", form.category);
      formData.append("price", String(form.price ?? 0));
      if (form.discountedPrice !== undefined && form.discountedPrice !== null && !Number.isNaN(form.discountedPrice)) {
        formData.append("discountedPrice", String(form.discountedPrice));
      } else if (mode === "edit") {
        formData.append("discountedPrice", ""); // cleared in the form: remove the saved discount
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

      // Collection fields
      formData.append("collectionType", form.collectionType || "none");
      if (form.collectionId && form.collectionType !== "none") {
        formData.append("collectionId", form.collectionId);
      }

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
          if (shouldSendColor(media)) {
            // Send new thumbnail file if uploaded
            if (media.thumbFile) {
              const thumb = forUpload(media.thumbFile);
              const thumbFileName = `${color}_${thumb.name}`;
              const renamedThumbFile = new File([thumb], thumbFileName, { type: thumb.type });
              formData.append("colorThumbnail", renamedThumbFile);
            } else if (media.thumbnailUrl && !media.thumbnailUrl.startsWith('blob:')) {
              // Keep existing thumbnail if no new file uploaded
              const cleanUrl = cleanUrlForBackend(media.thumbnailUrl);
              formData.append("existingColorThumbnails", JSON.stringify({ color, url: cleanUrl }));
            }
            
            // Send new banner files if uploaded
            if (media.bannerFiles && media.bannerFiles.length > 0) {
              media.bannerFiles.forEach((original, index) => {
                const file = forUpload(original);
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
        if (thumbFile) formData.append("thumbnail", forUpload(thumbFile));
        bannerFiles.forEach((f) => formData.append("banners", forUpload(f)));
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
      
      toast.success(`Product ${mode === "create" ? "created" : "updated"} successfully!`, { id: toastId });
      
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
      // Show the real reason (validation message, image too large, unsupported file, session expired...)
      toast.error(`Failed to ${mode} product: ${getApiErrorMessage(error)}`, { id: toastId, duration: 8000 });
    } finally {
      setIsLoading(false);
    }
  };
  
  // ---------------------------------------------------------------- Derived values for the UI
  const variantList = ((form.variants as ProductVariant[]) || []);
  const effectivePrice = (price?: number, discounted?: number) =>
    discounted !== undefined && discounted !== null && !Number.isNaN(discounted) && discounted > 0 && discounted < (price || 0)
      ? discounted
      : price || 0;
  const variantPrices = variantList.map((v) => effectivePrice(v.price, v.discountedPrice)).filter((p) => p > 0);
  const minVariantPrice = variantPrices.length ? Math.min(...variantPrices) : 0;
  const maxVariantPrice = variantPrices.length ? Math.max(...variantPrices) : 0;
  const hasDiscount =
    !isVariant &&
    form.discountedPrice !== undefined &&
    form.discountedPrice !== null &&
    !Number.isNaN(form.discountedPrice) &&
    form.discountedPrice > 0 &&
    form.discountedPrice < (form.price || 0);
  const discountPercent = hasDiscount ? Math.round((1 - (form.discountedPrice as number) / form.price) * 100) : 0;

  const summaryPrice: React.ReactNode = isVariant
    ? variantPrices.length
      ? minVariantPrice === maxVariantPrice
        ? formatPrice(minVariantPrice)
        : `${formatPrice(minVariantPrice)} – ${formatPrice(maxVariantPrice)}`
      : "—"
    : form.price
      ? hasDiscount
        ? (
          <span>
            {formatPrice(form.discountedPrice)}{" "}
            <span className="text-xs font-normal text-stone-400 line-through">{formatPrice(form.price)}</span>
          </span>
        )
        : formatPrice(form.price)
      : "—";
  const summaryStock = isVariant
    ? variantList.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
    : Number(form.stock) || 0;
  const firstColorThumb = selectedColors.map((c) => colorMedia[c]?.thumbnailUrl).find(Boolean);
  // Variant products may still carry a general thumbnail from before colour images existed
  const summaryThumb = (isVariant ? firstColorThumb : undefined) || form.thumbnailUrl?.toString() || undefined;
  const summaryImages = isVariant
    ? selectedColors.reduce(
        (sum, c) => sum + (colorMedia[c]?.thumbnailUrl ? 1 : 0) + (colorMedia[c]?.bannerUrls?.length || 0),
        0
      )
    : (form.thumbnailUrl ? 1 : 0) + (form.bannerUrls?.length || 0);
  const collectionItems = form.collectionType === "theme" ? themes : form.collectionType === "series" ? series : [];
  const collectionTitle =
    form.collectionType && form.collectionType !== "none" && form.collectionId
      ? collectionItems.find((item) => item.id === form.collectionId)?.title
      : undefined;
  const errorCount = Object.values(errors).filter(Boolean).length;

  // SEO Preview
  const previewTitle = (form.metaTitle || form.name || "").slice(0, META_TITLE_LIMIT);
  const previewUrl = `/products/${slug || "your-slug"}`;
  const fromPrice = isVariant ? minVariantPrice : effectivePrice(form.price, form.discountedPrice);
  const previewDesc = (
    form.metaDescription ||
    (form.name ? `${form.name}${form.category ? ` - ${form.category}` : ""}${fromPrice ? ` - Starting from ${formatPrice(fromPrice)}` : ""}` : "")
  ).slice(0, META_DESC_LIMIT);

  const updateVariant = (index: number, patch: Partial<ProductVariant>) => {
    const newVariants = [...variantList];
    newVariants[index] = { ...newVariants[index], ...patch };
    setField("variants", newVariants);
    clearError(...Object.keys(patch).map((key) => `variant-${index}-${key}`));
  };

  const toggleColor = (color: string) => {
    setSelectedColors(selectedColors.includes(color) ? selectedColors.filter((c) => c !== color) : [...selectedColors, color]);
    clearError("colors");
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(selectedSizes.includes(size) ? selectedSizes.filter((s) => s !== size) : [...selectedSizes, size]);
    clearError("sizes");
  };

  const manageButton = (label: string) =>
    onManageAttributes ? (
      <button
        type="button"
        onClick={onManageAttributes}
        className="text-xs font-medium text-stone-500 underline-offset-4 transition-colors hover:text-stone-900 hover:underline"
      >
        {label}
      </button>
    ) : null;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:items-start">
        {/* ------------------------------------------------ Main column */}
        <div className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-2">
          <Section
            title="Basic information"
            subtitle="Name, category and collection"
            icon={<FileText className="h-5 w-5" />}
          >
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
              <FormField label="Product name" htmlFor="product-name" required error={errors.name} className="md:col-span-2">
                <Input
                  id="product-name"
                  required
                  placeholder="e.g. Ghalib Ink Portrait Hoodie"
                  value={form.name}
                  invalid={!!errors.name}
                  onChange={(e) => {
                    setField("name", e.target.value);
                    clearError("name");
                  }}
                />
              </FormField>

              <FormField label="URL slug" htmlFor="product-slug" hint="Generated automatically from the name">
                <Input
                  id="product-slug"
                  readOnly
                  value={slug}
                  placeholder="generated-from-name"
                  className="bg-stone-50 font-mono text-stone-600"
                />
              </FormField>

              <FormField label="Category" htmlFor="product-category" required error={errors.category}>
                <Select
                  id="product-category"
                  required
                  value={form.category}
                  invalid={!!errors.category}
                  onChange={(e) => {
                    setField("category", e.target.value);
                    clearError("category");
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Collection type" htmlFor="product-collection-type" hint="Optionally link this product to a theme or series">
                <Select
                  id="product-collection-type"
                  value={form.collectionType || "none"}
                  onChange={(e) => {
                    setField("collectionType", e.target.value as "theme" | "series" | "none");
                    setField("collectionId", ""); // Reset collection ID when type changes
                  }}
                >
                  <option value="none">None</option>
                  <option value="theme">Theme</option>
                  <option value="series">Series</option>
                </Select>
              </FormField>

              {form.collectionType && form.collectionType !== "none" && (
                <FormField
                  label={form.collectionType === "theme" ? "Theme" : "Series"}
                  htmlFor="product-collection"
                  hint={collectionItems.length === 0 ? `No ${form.collectionType === "theme" ? "themes" : "series"} found yet` : undefined}
                >
                  <Select
                    id="product-collection"
                    value={form.collectionId || ""}
                    onChange={(e) => setField("collectionId", e.target.value)}
                  >
                    <option value="">Select a {form.collectionType}</option>
                    {form.collectionType === "theme"
                      ? themes.map((theme) => (
                          <option key={theme._id} value={theme.id}>
                            {theme.title}
                          </option>
                        ))
                      : series.map((seriesItem) => (
                          <option key={seriesItem._id} value={seriesItem.id}>
                            {seriesItem.title}
                          </option>
                        ))}
                  </Select>
                </FormField>
              )}
            </div>
          </Section>

          <Section
            title="Pricing & inventory"
            subtitle={isVariant ? "Pick colours and sizes, then price each variant" : "Price and stock in Pakistani rupees (Rs)"}
            icon={<Tag className="h-5 w-5" />}
          >
            <div className="space-y-5">
              <div>
                <ProductTypePicker
                  value={isVariant ? "variant" : "single"}
                  disabled={mode === "edit"}
                  onChange={(type) => {
                    if (type === "single") {
                      setField("productType", "single");
                      setSelectedColors([]);
                      setSelectedSizes([]);
                      setField("variants", []);
                    } else {
                      setField("productType", "variant");
                    }
                  }}
                />
                {mode === "edit" && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
                    <Info className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    The product type can&apos;t be changed after the product is created.
                  </p>
                )}
              </div>

              {!isVariant ? (
                <div className="grid grid-cols-1 gap-4 border-t border-stone-100 pt-5 sm:grid-cols-3 sm:gap-5">
                  <FormField label="Price (Rs)" htmlFor="product-price" required error={errors.price}>
                    <Input
                      id="product-price"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="any"
                      required
                      prefix="Rs"
                      placeholder="0"
                      value={form.price || ""}
                      invalid={!!errors.price}
                      onChange={(e) => {
                        setField("price", Number(e.target.value));
                        clearError("price", "discountedPrice");
                      }}
                    />
                  </FormField>

                  <FormField
                    label="Discounted price (Rs)"
                    htmlFor="product-discounted-price"
                    error={errors.discountedPrice}
                    hint={hasDiscount ? `${discountPercent}% off · saves ${formatPrice(form.price - (form.discountedPrice as number))}` : "Leave empty for no discount"}
                  >
                    <Input
                      id="product-discounted-price"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="any"
                      prefix="Rs"
                      placeholder="Optional"
                      value={form.discountedPrice ?? ""}
                      invalid={!!errors.discountedPrice}
                      onChange={(e) => {
                        const val = e.target.value;
                        setField("discountedPrice", val === "" ? undefined : Number(val));
                        clearError("discountedPrice");
                      }}
                    />
                  </FormField>

                  <FormField label="Stock quantity" htmlFor="product-stock" error={errors.stock} hint="Units available to sell">
                    <Input
                      id="product-stock"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1}
                      placeholder="0"
                      value={form.stock}
                      invalid={!!errors.stock}
                      onChange={(e) => {
                        setField("stock", Number(e.target.value));
                        clearError("stock");
                      }}
                    />
                  </FormField>
                </div>
              ) : (
                <div className="space-y-5 border-t border-stone-100 pt-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-stone-700">
                        Colours <span className="ml-0.5 text-red-500">*</span>
                      </span>
                      {manageButton("Manage colours")}
                    </div>
                    {colorOptions.length > 0 ? (
                      <OptionChips
                        label="Colours"
                        options={colorOptions}
                        selected={selectedColors}
                        onToggle={toggleColor}
                        swatches
                        invalid={!!errors.colors}
                      />
                    ) : (
                      <p className="rounded-lg border border-dashed border-stone-300 bg-stone-50 px-3 py-2.5 text-sm text-stone-500">
                        No colours yet. Add them under Products → Attributes.
                      </p>
                    )}
                    {errors.colors && <p className="mt-1 text-xs text-red-600">{errors.colors}</p>}
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-stone-700">
                        Sizes <span className="ml-0.5 text-red-500">*</span>
                      </span>
                      {manageButton("Manage sizes")}
                    </div>
                    {sizeOptions.length > 0 ? (
                      <OptionChips
                        label="Sizes"
                        options={sizeOptions}
                        selected={selectedSizes}
                        onToggle={toggleSize}
                        invalid={!!errors.sizes}
                      />
                    ) : (
                      <p className="rounded-lg border border-dashed border-stone-300 bg-stone-50 px-3 py-2.5 text-sm text-stone-500">
                        No sizes yet. Add them under Products → Attributes.
                      </p>
                    )}
                    {errors.sizes && <p className="mt-1 text-xs text-red-600">{errors.sizes}</p>}
                  </div>

                  {variantCombos.length > 0 && variantList.length > 0 ? (
                    <div>
                      <p className="mb-2 text-sm font-medium text-stone-700">Variant pricing & stock</p>
                      <VariantEditor variants={variantList} onChange={updateVariant} errors={errors} />
                    </div>
                  ) : (
                    <p className="rounded-lg bg-stone-50 px-3 py-2.5 text-sm text-stone-500">
                      Select at least one colour and one size to create variants.
                    </p>
                  )}
                </div>
              )}
            </div>
          </Section>

          <Section
            title="Images"
            subtitle={isVariant ? "A thumbnail and up to " + MAX_BANNERS + " banner images per colour" : "Thumbnail for listings and up to " + MAX_BANNERS + " banner images"}
            icon={<ImageIcon className="h-5 w-5" />}
          >
            {!isVariant ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] sm:gap-6">
                <div data-field-error={errors.thumbnail ? "true" : undefined}>
                  <p className="mb-1 text-sm font-medium text-stone-700">
                    Thumbnail {mode === "create" && <span className="ml-0.5 text-red-500">*</span>}
                  </p>
                  <div className="max-w-[240px] sm:max-w-none">
                    <SingleImageField
                      id="product-thumbnail"
                      inputRef={thumbInputRef}
                      src={form.thumbnailUrl?.toString() || undefined}
                      alt="Thumbnail"
                      onFiles={handleThumbnailFiles}
                      onRemove={mode === "create" ? (form.thumbnailUrl ? clearThumbnail : undefined) : thumbFile ? clearThumbnail : undefined}
                      removeMode={mode === "edit" ? "undo" : "remove"}
                      isNew={!!thumbFile}
                      invalid={!!errors.thumbnail}
                      title="Upload thumbnail"
                      hint="Click or drop an image"
                    />
                  </div>
                  {errors.thumbnail ? (
                    <p className="mt-1 text-xs text-red-600">{errors.thumbnail}</p>
                  ) : (
                    <p className="mt-1 text-xs text-stone-500">Main photo in the shop and listings</p>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="mb-1 flex items-center justify-between text-sm font-medium text-stone-700">
                    <span>Banner images</span>
                    <span className="text-xs font-normal tabular-nums text-stone-500">
                      {form.bannerUrls?.length || 0}/{MAX_BANNERS} images
                    </span>
                  </p>
                  <ImageGalleryField
                    id="product-banners"
                    inputRef={bannerInputRef}
                    urls={(form.bannerUrls || []).map(String)}
                    max={MAX_BANNERS}
                    altPrefix="Banner image"
                    onFiles={handleMultipleBannerFiles}
                    onRemove={removeBanner}
                    gridClassName="grid-cols-3 md:grid-cols-4"
                    emptyClassName="h-36 sm:h-[200px]"
                  />
                  <p className="mt-1 text-xs text-stone-500">
                    Extra photos for the product page. You can select several at once (max {MAX_BANNERS} images).
                  </p>
                </div>
              </div>
            ) : selectedColors.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {selectedColors.map((color) => (
                  <ColorImagesCard
                    key={color}
                    color={color}
                    thumbnailUrl={colorMedia[color]?.thumbnailUrl}
                    bannerUrls={colorMedia[color]?.bannerUrls || []}
                    hasNewThumbnail={!!colorMedia[color]?.thumbFile}
                    maxBanners={MAX_BANNERS}
                    thumbRef={(el) => { colorThumbRefs.current[color] = el; }}
                    bannerRef={(el) => { colorBannerRefs.current[color] = el; }}
                    onThumbnailFiles={(files) => handleColorThumbFiles(color, files)}
                    onBannerFiles={(files) => handleColorBannerFiles(color, files)}
                    onRemoveBanner={(index) => removeColorBanner(color, index)}
                    onClear={() => clearColorMedia(color)}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-stone-300 bg-stone-50 px-3 py-6 text-center text-sm text-stone-500">
                Select colours under Pricing &amp; inventory to add images for each colour.
              </p>
            )}
            <p className="mt-4 flex items-start gap-1.5 border-t border-stone-100 pt-3 text-xs text-stone-500">
              <Info className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
              {IMAGE_HINT}
            </p>
          </Section>

          <Section title="Description" subtitle="What customers read about this product" icon={<AlignLeft className="h-5 w-5" />}>
            <div className="space-y-4 sm:space-y-5">
              <FormField
                label="Short description"
                htmlFor="product-short-description"
                hint={<HintWithCount text="Shown on product cards and in search results" value={form.shortDescription || ""} max={500} />}
              >
                <Textarea
                  id="product-short-description"
                  rows={3}
                  maxLength={500}
                  placeholder="A brief summary of the product in 2-3 sentences"
                  className="resize-y"
                  value={form.shortDescription || ""}
                  onChange={(e) => setField("shortDescription", e.target.value)}
                />
              </FormField>

              <FormField label="Full description" htmlFor="product-description" hint="Materials, fit and sizing, care instructions and the story behind the design">
                <Textarea
                  id="product-description"
                  rows={8}
                  placeholder={"Materials and fabric\nFit and sizing\nCare instructions\nThe story behind the design"}
                  className="min-h-[180px] resize-y"
                  value={form.description || ""}
                  onChange={(e) => setField("description", e.target.value)}
                />
              </FormField>

              <FormField label="Key features" htmlFor="product-features" hint="One feature per line">
                <Textarea
                  id="product-features"
                  rows={5}
                  placeholder={"100% combed cotton\nOversized fit\nScreen-printed calligraphy"}
                  className="resize-y"
                  value={form.features || ""}
                  onChange={(e) => setField("features", e.target.value)}
                />
              </FormField>
            </div>
          </Section>

          <Section title="Search engine listing" subtitle="How this product appears in search results" icon={<Search className="h-5 w-5" />}>
            <div className="space-y-4 sm:space-y-5">
              <SeoPreview title={previewTitle} path={previewUrl} description={previewDesc} />

              <FormField
                label="Meta title"
                htmlFor="product-meta-title"
                error={errors.metaTitle}
                hint={<HintWithCount text="Defaults to the product name. Include the main keyword." value={form.metaTitle || ""} max={META_TITLE_LIMIT} />}
              >
                <Input
                  id="product-meta-title"
                  maxLength={120}
                  placeholder="Keep it under 60 characters"
                  value={form.metaTitle || ""}
                  invalid={!!errors.metaTitle}
                  onChange={(e) => {
                    setField("metaTitle", e.target.value);
                    clearError("metaTitle");
                  }}
                />
              </FormField>

              <FormField
                label="Meta description"
                htmlFor="product-meta-description"
                error={errors.metaDescription}
                hint={<HintWithCount text="A short pitch that encourages clicks" value={form.metaDescription || ""} max={META_DESC_LIMIT} />}
              >
                <Textarea
                  id="product-meta-description"
                  rows={3}
                  maxLength={320}
                  placeholder="Keep it under 155 characters"
                  className="resize-y"
                  value={form.metaDescription || ""}
                  invalid={!!errors.metaDescription}
                  onChange={(e) => {
                    setField("metaDescription", e.target.value);
                    clearError("metaDescription");
                  }}
                />
              </FormField>

              <FormField label="Meta keywords" htmlFor="product-meta-keywords" hint="Separate keywords with commas">
                <Input
                  id="product-meta-keywords"
                  placeholder="e.g. poetry tee, urdu calligraphy, oversized tee, streetwear pakistan"
                  value={form.metaKeywords || ""}
                  onChange={(e) => setField("metaKeywords", e.target.value)}
                />
              </FormField>

              <FormField
                label="Structured data (JSON-LD)"
                htmlFor="product-meta-schema"
                error={errors.metaSchema}
                hint="Optional. Advanced schema markup for rich search results; must be valid JSON."
              >
                <Textarea
                  id="product-meta-schema"
                  rows={8}
                  spellCheck={false}
                  placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Product",\n  "name": "Product name",\n  "offers": {\n    "@type": "Offer",\n    "price": "3999",\n    "priceCurrency": "PKR"\n  }\n}'}
                  className="resize-y font-mono text-xs leading-relaxed"
                  value={form.metaSchema || ""}
                  invalid={!!errors.metaSchema}
                  onChange={(e) => {
                    setField("metaSchema", e.target.value);
                    clearError("metaSchema");
                  }}
                />
              </FormField>
            </div>
          </Section>
        </div>

        {/* ------------------------------------------------ Side column */}
        <div className="min-w-0 space-y-4 sm:space-y-6 lg:sticky lg:top-0">
          <Section title="Status" subtitle="Who can see this product" icon={<Settings2 className="h-5 w-5" />}>
            <StatusPicker value={form.status} onChange={(status) => setField("status", status)} />
          </Section>

          <Section title="Summary" subtitle="Updates as you type" icon={<Eye className="h-5 w-5" />}>
            <ProductSummary
              name={form.name}
              category={form.category}
              status={form.status}
              thumbnail={summaryThumb}
              price={summaryPrice}
              stock={summaryStock}
              variantCount={isVariant ? variantList.length : undefined}
              imageCount={summaryImages}
              collection={collectionTitle}
            />
          </Section>
        </div>
      </div>

      {/* ------------------------------------------------ Actions
          Sticky inside the admin <main> scroll area. The negative bottom offset/margin + matching
          padding cancel <main>'s bottom padding, so the bar sits on a page-coloured strip instead
          of floating with the form visible underneath it. */}
      <div className="sticky -bottom-4 z-10 -mb-4 bg-stone-50 pb-4 pt-1 sm:-bottom-6 sm:-mb-6 sm:pb-6 lg:-bottom-8 lg:-mb-8 lg:pb-8">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="hidden min-w-0 items-center gap-2 text-sm text-stone-500 sm:flex">
            {errorCount > 0 ? (
              <span className="text-red-600">
                Fix {errorCount} highlighted field{errorCount === 1 ? "" : "s"} to continue
              </span>
            ) : (
              <>
                <span>{mode === "create" ? "Will be saved as" : "Status:"}</span>
                <StatusBadge status={form.status} />
              </>
            )}
          </div>
          <div className="flex w-full gap-2 sm:w-auto sm:gap-3">
            {onCancel && (
              <Button variant="secondary" onClick={onCancel} disabled={isLoading} className="flex-1 sm:flex-none">
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              loading={isLoading}
              loadingText={mode === "create" ? "Creating..." : "Saving..."}
              leftIcon={mode === "create" ? <Plus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              className="flex-1 sm:flex-none"
            >
              {mode === "create" ? "Create product" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
