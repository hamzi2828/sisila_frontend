"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { blogHeroService, BlogHeroData } from './services/blogHeroService';

export default function BlogSettingsPage() {
  const [heroes, setHeroes] = useState<BlogHeroData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingHero, setEditingHero] = useState<BlogHeroData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogHeroData>>({
    title: '',
    subtitle: '',
    backgroundImage: '',
    primaryButtonText: '',
    primaryButtonLink: '',
    secondaryButtonText: '',
    secondaryButtonLink: '',
    isActive: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      setIsLoading(true);
      const data = await blogHeroService.getAllBlogHeros();
      setHeroes(data);
    } catch (error) {
      console.error('Error fetching heroes:', error);
      toast.error('Failed to load hero sections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      if (editingHero) {
        await blogHeroService.updateBlogHero(editingHero.id!, formData, selectedFile || undefined);
        toast.success('Hero section updated successfully');
      } else {
        await blogHeroService.createBlogHero(formData as Omit<BlogHeroData, 'id' | 'createdAt' | 'updatedAt'>, selectedFile || undefined);
        toast.success('Hero section created successfully');
      }

      await fetchHeroes();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving hero:', error);
      toast.error('Failed to save hero section');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero section?')) return;

    try {
      setIsLoading(true);
      await blogHeroService.deleteBlogHero(id);
      toast.success('Hero section deleted successfully');
      await fetchHeroes();
    } catch (error) {
      console.error('Error deleting hero:', error);
      toast.error('Failed to delete hero section');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      setIsLoading(true);
      await blogHeroService.toggleActiveStatus(id);
      toast.success('Hero status updated successfully');
      await fetchHeroes();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update hero status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (hero: BlogHeroData) => {
    setEditingHero(hero);
    setSelectedFile(null); // Clear any previously selected file
    setFormData(hero);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingHero(null);
    setSelectedFile(null);
    setFormData({
      title: '',
      subtitle: '',
      backgroundImage: '',
      primaryButtonText: '',
      primaryButtonLink: '',
      secondaryButtonText: '',
      secondaryButtonLink: '',
      isActive: false,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHero(null);
    setSelectedFile(null);
    setFormData({
      title: '',
      subtitle: '',
      backgroundImage: '',
      primaryButtonText: '',
      primaryButtonLink: '',
      secondaryButtonText: '',
      secondaryButtonLink: '',
      isActive: false,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('File size too large. Maximum size allowed is 20MB.');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload PNG, JPG, GIF, WebP, or SVG images only.');
      return;
    }

    setSelectedFile(file);
    setFormData(prev => ({ ...prev, backgroundImage: `[Selected: ${file.name}]` }));
    toast.success('Image selected. It will be uploaded when you save.');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Hero Settings</h1>
          <p className="text-muted-foreground">
            Manage hero sections for your blog page
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Hero Section
        </Button>
      </div>

      {/* Heroes List */}
      <div className="grid gap-4">
        {heroes.map((hero, index) => (
          <Card key={hero.id || hero._id || index} className={hero.isActive ? 'border-green-500' : 'border-red-500'}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {hero.title}
                    {hero.isActive ? (
                      <span className="text-green-500 text-sm">(Active)</span>
                    ) : (
                      <span className="text-red-500 text-sm">(Inactive)</span>
                    )}
                  </CardTitle>
                  <CardDescription>{hero.subtitle}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {hero.backgroundImage && (
                    <div className="w-20 h-12 rounded overflow-hidden border relative">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}${hero.backgroundImage}`}
                        alt="Background"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive((hero.id || hero._id || '').toString())}
                    disabled={isLoading}
                  >
                    {hero.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(hero)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete((hero.id || hero._id || '').toString())}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Primary Button:</strong> {hero.primaryButtonText} → {hero.primaryButtonLink}
                </div>
                <div>
                  <strong>Secondary Button:</strong> {hero.secondaryButtonText} → {hero.secondaryButtonLink}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingHero ? 'Edit Hero Section' : 'Create Hero Section'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="backgroundImage">Background Image</Label>
                <p className="text-sm text-gray-500 mb-2">
                  Supported formats: PNG, JPG, GIF, WebP, SVG (max 20MB)
                </p>
                <div className="flex gap-2">
                  <Input
                    id="backgroundImage"
                    value={formData.backgroundImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, backgroundImage: e.target.value }))}
                    placeholder="Image URL or upload below"
                    required
                  />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('imageUpload')?.click()}>
                    <Upload className="h-4 w-4" />
                  </Button>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*,.svg"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryButtonText">Primary Button Text</Label>
                  <Input
                    id="primaryButtonText"
                    value={formData.primaryButtonText}
                    onChange={(e) => setFormData(prev => ({ ...prev, primaryButtonText: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="primaryButtonLink">Primary Button Link</Label>
                  <Input
                    id="primaryButtonLink"
                    value={formData.primaryButtonLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, primaryButtonLink: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="secondaryButtonText">Secondary Button Text</Label>
                  <Input
                    id="secondaryButtonText"
                    value={formData.secondaryButtonText}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryButtonText: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="secondaryButtonLink">Secondary Button Link</Label>
                  <Input
                    id="secondaryButtonLink"
                    value={formData.secondaryButtonLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryButtonLink: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    className={formData.isActive ? 'data-[state=checked]:bg-green-500' : 'data-[state=unchecked]:bg-red-500'}
                  />
                  <Label
                    htmlFor="isActive"
                    className={`font-medium ${formData.isActive ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {formData.isActive ? 'Active Hero' : 'Inactive Hero'}
                  </Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingHero ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}