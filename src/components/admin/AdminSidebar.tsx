'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiHome, FiUsers, FiPackage, FiDollarSign, FiSettings, FiBookOpen, FiImage, FiEdit3, FiMessageSquare, FiLayers } from 'react-icons/fi';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/admin', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Contact Queries', path: '/admin/contact-queries', icon: <FiMessageSquare className="w-5 h-5" /> },
    { name: 'Users', path: '/admin/users', icon: <FiUsers className="w-5 h-5" /> },
    { name: 'Products', path: '/admin/products', icon: <FiPackage className="w-5 h-5" /> },
    { name: 'Hero Slides', path: '/admin/hero-slides', icon: <FiImage className="w-5 h-5" /> },
    { name: 'Themes', path: '/admin/themes', icon: <FiLayers className="w-5 h-5" /> },
    { name: 'Blogs', path: '/admin/blogs', icon: <FiBookOpen className="w-5 h-5" /> },
    { name: 'Blog Settings', path: '/admin/blog-settings', icon: <FiEdit3 className="w-5 h-5" /> },
    { name: 'Orders', path: '/admin/orders', icon: <FiDollarSign className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <FiSettings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {!isOpen && (
        <div 
          className="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-gray-900 lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center h-16 px-4 bg-gray-900">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>
        <nav className="px-2 py-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-md ${
                pathname === item.path
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={onClose}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
