export type TrendingItem = {
  id: string;
  title: string;
  price: number;
  compareAt?: number;
  image: string;
  detailImage: string;
  href: string;
  tag?: string;
};

export type TrendingTag = { label: string; href: string };
