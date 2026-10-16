export type NavItem = {
  label: string;
  href?: string;
  hasDropdown?: boolean;
  active?: boolean;
};

export type MenuSection = {
  heading: string;
  links: { label: string; href?: string }[]
};

export type MegaMenu = {
  sections: MenuSection[];
  image?: {
    src: string;
    alt: string;
    href?: string;
    caption?: string
  };
};

export const navItems: NavItem[] = [
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', hasDropdown: true },
  { label: 'Themes', hasDropdown: true },
  { label: 'Series', hasDropdown: true },
  { label: 'About Silsila', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const megaMenuData: Record<string, MegaMenu> = {
  Shop: {
    sections: [
      {
        heading: 'New & Popular',
        links: [
          { label: 'Latest Arrivals', href: '/new-arrivals' },
          { label: 'Trending Now', href: '/trending' },
        ],
      },
      {
        heading: 'Explore by',
        links: [
          { label: 'Categories', href: '/categories' },
          { label: 'Themes', href: '/themes' },
          { label: 'Series', href: '/series' },
        ],
      },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1200&q=80',
      alt: 'Shop',
      href: '/shop',
      caption: 'Shop all products',
    },
  },
  Categories: {
    sections: [
      {
        heading: 'All Categories',
        links: [
          { label: 'Poetry', href: '/shop?category=Poetry' },
          { label: 'Witty', href: '/shop?category=Witty' },
          { label: 'Fun', href: '/shop?category=Fun' },
          { label: 'Artistic', href: '/shop?category=Artistic' },
          { label: 'Creative', href: '/shop?category=Creative' },
        ],
      },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=80',
      alt: 'Categories',
      href: '/categories',
      caption: 'Explore categories',
    },
  },
  Themes: {
    sections: [
      {
        heading: 'All Themes',
        links: [
          { label: 'Southeastern Hymns', href: '/themes#southeastern-hymns' },
          { label: 'Artistic Passion', href: '/themes#artistic-passion' },
          { label: 'Echoes of the Winds', href: '/themes#echoes-of-the-winds' },
          { label: 'Uplifting Culture', href: '/themes#uplifting-culture' },
        ],
      },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80',
      alt: 'Themes',
      href: '/themes',
      caption: 'See all themes',
    },
  },
  Series: {
    sections: [
      {
        heading: 'All Series',
        links: [
          { label: 'Poets', href: '/series#poets' },
          { label: 'Alphabets', href: '/series#alphabets' },
          { label: 'Cinema', href: '/series#cinema' },
          { label: 'Anime', href: '/series#anime' },
        ],
      },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80',
      alt: 'Series',
      href: '/series',
      caption: 'Explore series',
    },
  },
};

export const trendingSearches = [
  'Poetry',
  'Ghalib',
  'Alif',
  'Cinema',
  'Anime',
];
