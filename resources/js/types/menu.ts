export interface Category {
  id: number;
  name: string;
  menu_items: MenuItem[];
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: string;
  variant_price: string | null;
  image: string | null;
  featured?: boolean;
}
