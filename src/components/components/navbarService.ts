import axios from 'axios';

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

// Build dynamic mega menu data
export function buildDynamicMegaMenus(data: NavbarData) {
  const { categories, themes, series } = data;

  return {
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
        src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
        alt: 'Categories',
        href: '/shop',
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
        src: themes[0]?.cover
          ? (themes[0].cover.startsWith('http') ? themes[0].cover : `${API_BASE_URL}${themes[0].cover}`)
          : 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
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
        src: series[0]?.cover
          ? (series[0].cover.startsWith('http') ? series[0].cover : `${API_BASE_URL}${series[0].cover}`)
          : 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80',
        alt: 'Series',
        href: '/series',
        caption: 'Explore series',
      },
    },
  };
}
