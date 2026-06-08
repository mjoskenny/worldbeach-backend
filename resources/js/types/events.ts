export interface EventVariant {
  id: string;
  name: string;
  price: number;
  capacity: number;
  ticketsSold: number;
  benefits: string[]; // NEW: benefits per variant
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  image: string | File | null;
  status: 'upcoming' | 'past' | 'cancelled';
  featured?: boolean;       // NEW
  location?: string;        // NEW
  categoryId?: string;      // NEW: references categories table
  variants: EventVariant[];
}

