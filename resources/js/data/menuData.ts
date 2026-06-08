export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  featured?: boolean;
  special?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: 'drinks', name: 'Drinks', icon: '' },
  { id: 'seafood', name: 'Seafood', icon: '' },
  { id: 'pizza', name: 'Pizza', icon: '' },
  { id: 'salads', name: 'Salads', icon: '' },
  { id: 'desserts', name: 'Desserts', icon: '' },
];

export const menuItems: MenuItem[] = [
  // Drinks
  {
    id: '1',
    name: 'Tropical Sunset',
    description: 'Rum, passion fruit, mango, lime with a hint of ginger',
    price: 8000,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1664993119473-013502f1e3f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGNvY2t0YWlsJTIwZHJpbmt8ZW58MXx8fHwxNzYyMzk2NjE0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: true,
  },
  {
    id: '2',
    name: 'Beach Breeze Mojito',
    description: 'Fresh mint, white rum, lime, soda and coconut water',
    price: 7500,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1664993119473-013502f1e3f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGNvY2t0YWlsJTIwZHJpbmt8ZW58MXx8fHwxNzYyMzk2NjE0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '3',
    name: 'Mango Smoothie Bowl',
    description: 'Fresh mango, banana, coconut milk topped with granola',
    price: 6500,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1539574610665-dc92264e9c4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbW9vdGhpZSUyMGJvd2wlMjB0cm9waWNhbHxlbnwxfHx8fDE3NjIzNjI5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  
  // Seafood
  {
    id: '4',
    name: 'Grilled Lake Tanganyika Fish',
    description: 'Fresh catch of the day, grilled with herbs and lemon butter',
    price: 18000,
    category: 'seafood',
    image: 'https://images.unsplash.com/photo-1673646960049-2bfb54a22f4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwZmlzaCUyMHBsYXRlfGVufDF8fHx8MTc2MjM1NTQ0OHww&ixlib=rb-4.1.0&q=80&w=1080',
    featured: true,
    special: true,
  },
  {
    id: '5',
    name: 'Seafood Platter',
    description: 'Grilled prawns, calamari, mussels with garlic aioli',
    price: 24000,
    category: 'seafood',
    image: 'https://images.unsplash.com/photo-1519351635902-7c60d09cb2ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwcGxhdHRlcnxlbnwxfHx8fDE3NjI0MDQzOTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: true,
  },
  {
    id: '6',
    name: 'Lobster Thermidor',
    description: 'Half lobster in creamy brandy sauce, gratinated',
    price: 32000,
    category: 'seafood',
    image: 'https://images.unsplash.com/photo-1650081484817-582d41d82f8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2JzdGVyJTIwc2VhZm9vZHxlbnwxfHx8fDE3NjI0MjI3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  
  // Pizza
  {
    id: '7',
    name: 'Beach Margherita',
    description: 'San Marzano tomatoes, buffalo mozzarella, fresh basil',
    price: 12000,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1760538635911-dee3b46f2011?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcGl6emF8ZW58MXx8fHwxNzYyMzQ0NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '8',
    name: 'Seafood Delight',
    description: 'Prawns, calamari, anchovies, cherry tomatoes, garlic',
    price: 16000,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1760538635911-dee3b46f2011?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcGl6emF8ZW58MXx8fHwxNzYyMzQ0NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: true,
  },
  {
    id: '9',
    name: 'Quattro Formaggi',
    description: 'Mozzarella, gorgonzola, parmesan, goat cheese',
    price: 14000,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1760538635911-dee3b46f2011?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcGl6emF8ZW58MXx8fHwxNzYyMzQ0NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  
  // Salads
  {
    id: '10',
    name: 'Tropical Poke Bowl',
    description: 'Fresh tuna, avocado, mango, edamame, sesame dressing',
    price: 14500,
    category: 'salads',
    image: 'https://images.unsplash.com/photo-1620019989479-d52fcedd99fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwYm93bHxlbnwxfHx8fDE3NjI0MDY5MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: true,
  },
  {
    id: '11',
    name: 'Caesar Salad',
    description: 'Romaine, parmesan, croutons, classic Caesar dressing',
    price: 9000,
    category: 'salads',
    image: 'https://images.unsplash.com/photo-1620019989479-d52fcedd99fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwYm93bHxlbnwxfHx8fDE3NjI0MDY5MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  
  // Desserts
  {
    id: '12',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center, vanilla ice cream',
    price: 7500,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1673551490243-f29547426841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBkZXNzZXJ0fGVufDF8fHx8MTc2MjQwNDMyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    featured: true,
  },
  {
    id: '13',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    price: 6500,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1714385905983-6f8e06fffae1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aXJhbWlzdSUyMGRlc3NlcnR8ZW58MXx8fHwxNzYyMzYxNjUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '14',
    name: 'Tropical Fruit Platter',
    description: 'Fresh seasonal fruits with passion fruit coulis',
    price: 8000,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1696824818288-83fd13091064?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGZydWl0JTIwcGxhdGV8ZW58MXx8fHwxNzYyNDM2OTk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '15',
    name: 'Passion Fruit Panna Cotta',
    description: 'Creamy panna cotta with passion fruit sauce',
    price: 7000,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1673551490243-f29547426841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBkZXNzZXJ0fGVufDF8fHx8MTc2MjQwNDMyMXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export const businessInfo = {
  name: defaultSiteSettings.business_name,
  tagline: defaultSiteSettings.tagline,
  phone: defaultSiteSettings.phone,
  email: defaultSiteSettings.email,
  address: defaultSiteSettings.address,
  hours: {
    weekday: defaultSiteSettings.weekday_hours,
    weekend: defaultSiteSettings.weekend_hours,
  },
  social: {
    facebook: defaultSiteSettings.facebook_url,
    instagram: defaultSiteSettings.instagram_url,
    twitter: defaultSiteSettings.twitter_url,
  },
};

export const teamMembers = [
  {
    id: '1',
    name: 'Jean-Claude Niyonzima',
    role: 'Executive Chef',
    image: 'https://images.unsplash.com/photo-1698653223689-24b0bfd5150b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYyNDA5MTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bio: '15 years of culinary excellence specializing in fusion cuisine',
  },
  {
    id: '2',
    name: 'Marie Nduwimana',
    role: 'Restaurant Manager',
    image: 'https://images.unsplash.com/photo-1698653223689-24b0bfd5150b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYyNDA5MTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Passionate about creating unforgettable dining experiences',
  },
  {
    id: '3',
    name: 'Pascal Habimana',
    role: 'Head Sommelier',
    image: 'https://images.unsplash.com/photo-1698653223689-24b0bfd5150b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYyNDA5MTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Expert in pairing wines with our seafood specialties',
  },
];

export const apiEndpoints = {
  categories: '/api/categories',
  menuItems: '/api/menu-items',
  cart: '/api/cart',
  orders: '/api/orders',
  login: '/api/login',
  register: '/api/register',
};
import { defaultSiteSettings } from '../types/siteSettings';

