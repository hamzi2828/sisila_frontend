import axios from 'axios';
import { megaMenuData, type MegaMenu } from './headerData';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  active: boolean;
}

export interface Theme {
  _id: string;
  id: string;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  isActive: boolean;
}

export interface Series {
  _id: string;
  id: string;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  subitems: { title: string; href?: string }[];
  isActive: boolean;
}

export interface NavbarData {
  categories: Category[];
  themes: Theme[];
  series: Series[];
}

// Fetch all navbar data
export async function fetchNavbarData(): Promise<NavbarData> {
  try {
    const [categoriesRes, themesRes, seriesRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/categories/public`).catch(() => ({ data: { data: [] } })),
      axios.get(`${API_BASE_URL}/themes/active`).catch(() => ({ data: { data: [] } })),
      axios.get(`${API_BASE_URL}/series/active`).catch(() => ({ data: { data: [] } })),
    ]);

    return {
      categories: (categoriesRes.data.data || []).filter((c: Category) => c.active),
      themes: themesRes.data.data || [],
      series: seriesRes.data.data || [],
    };
  } catch (error) {
    console.error('Error fetching navbar data:', error);
    return { categories: [], themes: [], series: [] };
  }
}

const toAbsolute = (src?: string) =>
  src ? (src.startsWith('http') ? src : `${API_BASE_URL}${src}`) : undefined;

// Build dynamic mega menu data. Menus with no API data are omitted so the
// static fallbacks in headerData stay in place.
export function buildDynamicMegaMenus(data: NavbarData): Record<string, MegaMenu> {
  const { categories, themes, series } = data;

  const menus: Record<string, MegaMenu> = {
    Categories: {
      sections: [
        {
          heading: 'All Categories',
          links: categories.map((cat) => ({
            label: cat.name,
            href: `/shop?category=${encodeURIComponent(cat.name)}`,
          })),
        },
      ],
      image: {
        src:
          toAbsolute(categories[0]?.bannerUrl || categories[0]?.thumbnailUrl) ||
          megaMenuData.Categories.image!.src,
        alt: 'Categories',
        href: '/categories',
        caption: 'Explore all categories',
      },
    },
    Themes: {
      sections: [
        {
          heading: 'All Themes',
          links: themes.map((theme) => ({
            label: theme.title,
            href: `/themes#${theme.id}`,
          })),
        },
      ],
      image: {
        src: toAbsolute(themes[0]?.cover) || megaMenuData.Themes.image!.src,
        alt: 'Themes',
        href: '/themes',
        caption: 'See all themes',
      },
    },
    Series: {
      sections: [
        {
          heading: 'All Series',
          links: series.map((s) => ({
            label: s.title,
            href: `/series#${s.id}`,
          })),
        },
      ],
      image: {
        src: toAbsolute(series[0]?.cover) || megaMenuData.Series.image!.src,
        alt: 'Series',
        href: '/series',
        caption: 'Explore series',
      },
    },
  };

  if (!categories.length) delete menus.Categories;
  if (!themes.length) delete menus.Themes;
  if (!series.length) delete menus.Series;
  return menus;
}
