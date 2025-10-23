'use client';

import { type Theme } from '../services/themeAdminService';
import { FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';

interface AllThemesProps {
  themes: Theme[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, newStatus: boolean) => void;
  loading: boolean;
  error: string | null;
}

export default function AllThemes({ themes, onEdit, onDelete, onToggleStatus, loading, error }: AllThemesProps) {
  if (loading) {
    return (
      <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (themes.length === 0) {
    return (
      <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">No themes found. Create your first theme to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {themes.map((theme) => (
            <div
              key={theme._id}
              className="relative border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Cover Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={theme.cover}
                  alt={theme.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      theme.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {theme.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-xl font-semibold">{theme.title}</h3>
                  <p className="text-white/90 text-sm mt-1">{theme.tagline}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{theme.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>ID: {theme.id}</span>
                  <span>Gallery: {theme.gallery.length} images</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(theme._id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiEdit2 className="mr-2 h-4 w-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => onToggleStatus(theme._id, !theme.isActive)}
                    className={`flex-1 inline-flex items-center justify-center px-3 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      theme.isActive
                        ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                        : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    {theme.isActive ? (
                      <>
                        <FiEyeOff className="mr-2 h-4 w-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <FiEye className="mr-2 h-4 w-4" />
                        Activate
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onDelete(theme._id)}
                    className="inline-flex items-center justify-center p-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    title="Delete"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
