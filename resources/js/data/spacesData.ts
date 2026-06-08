export interface Space {
  id: string;
  title: string;
  description: string;
  capacity: string;
  size: string;
  features: string[];
  image: string;
  pricePerHour: number;
  category: 'indoor' | 'outdoor' | 'private';
}

export const spacesData: Space[] = [
  {
    id: '1',
    title: 'Beachfront Pavilion',
    description: 'Our stunning open-air pavilion offers panoramic views of Lake Tanganyika. Perfect for weddings, corporate events, and large celebrations.',
    capacity: '200-300 guests',
    size: '500 sq meters',
    features: [
      'Lake views',
      'Sound system',
      'Stage area',
      'Lighting setup',
      'Bar service',
      'Catering available',
    ],
    image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c594?w=800',
    pricePerHour: 150000,
    category: 'outdoor',
  },
  {
    id: '2',
    title: 'VIP Lounge',
    description: 'Exclusive indoor space with modern amenities and air conditioning. Ideal for business meetings, private parties, and intimate gatherings.',
    capacity: '30-50 guests',
    size: '120 sq meters',
    features: [
      'Air conditioning',
      'Private bar',
      'AV equipment',
      'WiFi',
      'Private entrance',
      'Catering service',
    ],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    pricePerHour: 80000,
    category: 'indoor',
  },
  {
    id: '3',
    title: 'Garden Terrace',
    description: 'Lush tropical garden setting with covered terrace area. Perfect for afternoon events, cocktail parties, and casual celebrations.',
    capacity: '50-80 guests',
    size: '200 sq meters',
    features: [
      'Garden setting',
      'Covered area',
      'String lights',
      'Bar access',
      'Music system',
      'Photo opportunities',
    ],
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    pricePerHour: 60000,
    category: 'outdoor',
  },
  {
    id: '4',
    title: 'Private Beach Cabana',
    description: 'Intimate beachside cabana with exclusive beach access. Perfect for romantic dinners, small parties, or VIP experiences.',
    capacity: '10-20 guests',
    size: '50 sq meters',
    features: [
      'Beach access',
      'Privacy curtains',
      'Lounge seating',
      'Personal waiter',
      'Custom menu',
      'Sunset views',
    ],
    image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800',
    pricePerHour: 100000,
    category: 'private',
  },
  {
    id: '5',
    title: 'Main Restaurant',
    description: 'Our spacious main dining area can be reserved for private functions. Includes full kitchen access and dedicated service staff.',
    capacity: '100-150 guests',
    size: '300 sq meters',
    features: [
      'Full kitchen',
      'Lake views',
      'Indoor/outdoor seating',
      'Dedicated staff',
      'Custom menus',
      'Bar service',
    ],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    pricePerHour: 120000,
    category: 'indoor',
  },
  {
    id: '6',
    title: 'Poolside Deck',
    description: 'Modern poolside area with deck seating and lounge areas. Great for daytime events, pool parties, and casual gatherings.',
    capacity: '60-100 guests',
    size: '250 sq meters',
    features: [
      'Pool access',
      'Deck seating',
      'Umbrellas',
      'Bar nearby',
      'Music system',
      'BBQ area',
    ],
    image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800',
    pricePerHour: 70000,
    category: 'outdoor',
  },
];
