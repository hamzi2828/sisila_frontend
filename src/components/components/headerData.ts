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
  { label: 'Shop', hasDropdown: true },
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
      src: 'https://images.unsplash.com/photo-1519744346363-66f0d6f9e6a6?auto=format&fit=crop&w=1200&q=80',
      alt: 'Shop',
      href: '/shop',
      caption: 'Shop all products',
    },
  },
  Categories: {
    sections: [
      {
        heading: 'Core',
        links: [
          { label: 'Poetry', href: '/categories#poetry' },
          { label: 'Witty', href: '/categories#witty' },
          { label: 'Fun', href: '/categories#fun' },
          { label: 'Artistic', href: '/categories#artistic' },
          { label: 'Creative', href: '/categories#creative' },
        ],
      },
      {
        heading: 'Curations',
        links: [
          { label: 'Minimal', href: '/categories#minimal' },
          { label: 'Street', href: '/categories#street' },
          { label: 'Retro', href: '/categories#retro' },
          { label: 'Nature', href: '/categories#nature' },
          { label: 'Typography', href: '/categories#typography' },
        ],
      },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      alt: 'Categories',
      href: '/categories',
      caption: 'Explore categories',
    },
  },
  Themes: {
    sections: [
      {
        heading: 'Creative Pillars',
        links: [
          { label: 'Southeastern Hymns', href: '/themes#southeastern-hymns' },
          { label: 'Artistic Passion', href: '/themes#artistic-passion' },
          { label: 'Echoes of the Winds', href: '/themes#echoes-of-the-winds' },
          { label: 'Uplifting Culture', href: '/themes#uplifting-culture' },
        ],
      },
      {
        heading: 'Quick Links',
        links: [
          { label: 'Explore Themes', href: '/themes' },
          { label: 'Lookbook', href: '/lookbook' },
        ],
      },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
      alt: 'Themes',
      href: '/themes',
      caption: 'See all themes',
    },
  },
  Series: {
    sections: [
      {
        heading: 'By Series',
        links: [
          { label: 'Poets', href: '/series#poets' },
          { label: 'Alphabets', href: '/series#alphabets' },
          { label: 'Cinema', href: '/series#cinema' },
          { label: 'Anime', href: '/series#anime' },
        ],
      },
      {
        heading: 'Poets — Featured',
        links: [
          { label: 'Ghalib', href: '/series#poets' },
          { label: 'Faiz Ahmed Faiz', href: '/series#poets' },
          { label: 'John Elia', href: '/series#poets' },
          { label: 'Habib Jalib', href: '/series#poets' },
          { label: 'Muneer Niazi', href: '/series#poets' },
        ],
      },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80',
      alt: 'Series',
      href: '/series',
      caption: 'Explore series',
    },
  },
};

export const trendingSearches = [
  'Poets tee',
  'Ghalib',
  'Anime hoodie',
  'Typography graphic',
  'Street hoodie'
];
