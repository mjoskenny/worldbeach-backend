export interface TicketVariant {
  id: string;
  name: string;
  price: number;
  description: string;
  availability: number;
  benefits: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  price: number;
  ticketVariants: TicketVariant[];
  category: 'concert' | 'party' | 'cultural' | 'sports' | 'workshop';
  capacity: number;
  ticketsSold: number;
  featured: boolean;
}

export const eventsData: Event[] = [
  {
    id: '1',
    title: 'Sunset Beach Party',
    description: 'Join us for an unforgettable evening of music, dancing, and tropical vibes as the sun sets over Lake Tanganyika. Featuring live DJ performances and signature cocktails.',
    date: '2025-11-15',
    time: '18:00',
    location: 'World Beach Main Stage',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    price: 15000,
    ticketVariants: [
      {
        id: 'general',
        name: 'General Admission',
        price: 15000,
        description: 'Standard entry with access to main stage area',
        availability: 100,
        benefits: ['Main stage access', 'General seating', 'Cash bar']
      },
      {
        id: 'vip',
        name: 'VIP',
        price: 35000,
        description: 'Premium experience with exclusive perks',
        availability: 40,
        benefits: ['VIP lounge access', 'Reserved seating', 'Complimentary welcome drink', 'Fast track entry']
      },
      {
        id: 'vvip',
        name: 'VVIP',
        price: 60000,
        description: 'Ultimate luxury experience',
        availability: 15,
        benefits: ['Private lounge', 'Premium seating', 'Open bar', 'Meet & greet with DJ', 'Exclusive gift bag']
      }
    ],
    category: 'party',
    capacity: 200,
    ticketsSold: 145,
    featured: true,
  },
  {
    id: '2',
    title: 'Live Jazz & Seafood Night',
    description: 'Experience smooth jazz melodies while enjoying our chef\'s special seafood menu. Perfect evening for couples and music lovers.',
    date: '2025-11-20',
    time: '19:30',
    location: 'World Beach Restaurant',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800',
    price: 25000,
    ticketVariants: [
      {
        id: 'standard',
        name: 'Standard',
        price: 25000,
        description: 'Entry with 3-course meal',
        availability: 50,
        benefits: ['3-course seafood menu', 'Table seating', 'Live jazz performance']
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 45000,
        description: 'Enhanced dining experience',
        availability: 20,
        benefits: ['5-course tasting menu', 'Wine pairing', 'Premium seating', 'Dessert platter']
      },
      {
        id: 'vip',
        name: 'VIP Table',
        price: 80000,
        description: 'Private table for 2',
        availability: 10,
        benefits: ['Private table', 'Full tasting menu', 'Champagne bottle', 'Personalized service']
      }
    ],
    category: 'concert',
    capacity: 80,
    ticketsSold: 62,
    featured: true,
  },
  {
    id: '3',
    title: 'Burundian Cultural Festival',
    description: 'Celebrate Burundian heritage with traditional drumming, dance performances, and authentic local cuisine. A family-friendly cultural experience.',
    date: '2025-11-25',
    time: '15:00',
    location: 'World Beach Event Grounds',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    price: 10000,
    ticketVariants: [
      {
        id: 'adult',
        name: 'Adult',
        price: 10000,
        description: 'Standard adult entry',
        availability: 150,
        benefits: ['All performances', 'Food samples', 'Cultural activities']
      },
      {
        id: 'child',
        name: 'Child',
        price: 5000,
        description: 'Entry for children (under 12)',
        availability: 100,
        benefits: ['All performances', 'Kids activities', 'Face painting']
      },
      {
        id: 'family',
        name: 'Family Pass',
        price: 30000,
        description: '2 adults + 2 children',
        availability: 50,
        benefits: ['Entry for 4', 'All activities', 'Complimentary traditional meal', 'Souvenir photo']
      }
    ],
    category: 'cultural',
    capacity: 300,
    ticketsSold: 189,
    featured: false,
  },
  {
    id: '4',
    title: 'Beach Volleyball Tournament',
    description: 'Join our exciting beach volleyball tournament! Teams compete for prizes while enjoying the beautiful lake views. Register your team today.',
    date: '2025-12-01',
    time: '09:00',
    location: 'Beach Volleyball Courts',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
    price: 5000,
    ticketVariants: [
      {
        id: 'spectator',
        name: 'Spectator',
        price: 5000,
        description: 'Watch the tournament',
        availability: 50,
        benefits: ['Seating area', 'Refreshments available']
      },
      {
        id: 'team',
        name: 'Team Registration',
        price: 20000,
        description: 'Register team of 4',
        availability: 15,
        benefits: ['Team entry', 'Tournament participation', 'Team jerseys', 'Prize eligibility']
      }
    ],
    category: 'sports',
    capacity: 100,
    ticketsSold: 56,
    featured: false,
  },
  {
    id: '5',
    title: 'Cocktail Masterclass',
    description: 'Learn to craft signature tropical cocktails from our expert bartenders. Includes all ingredients, techniques, and recipe cards to take home.',
    date: '2025-12-05',
    time: '16:00',
    location: 'Beach Bar',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
    price: 20000,
    ticketVariants: [
      {
        id: 'single',
        name: 'Single',
        price: 20000,
        description: 'Individual session',
        availability: 20,
        benefits: ['2-hour class', 'All ingredients', 'Recipe cards', 'Certificate']
      },
      {
        id: 'couple',
        name: 'Couple',
        price: 35000,
        description: 'Experience for two',
        availability: 5,
        benefits: ['2-hour class', 'All ingredients', 'Recipe cards', 'Complimentary appetizers']
      }
    ],
    category: 'workshop',
    capacity: 25,
    ticketsSold: 18,
    featured: true,
  },
  {
    id: '6',
    title: 'New Year\'s Eve Gala',
    description: 'Ring in the new year with style! Enjoy a premium buffet, open bar, live entertainment, and fireworks over the lake at midnight.',
    date: '2025-12-31',
    time: '20:00',
    location: 'World Beach Main Venue',
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800',
    price: 50000,
    ticketVariants: [
      {
        id: 'general',
        name: 'General',
        price: 50000,
        description: 'Standard gala entry',
        availability: 120,
        benefits: ['Buffet dinner', 'Open bar', 'Live entertainment', 'Fireworks viewing']
      },
      {
        id: 'vip',
        name: 'VIP',
        price: 100000,
        description: 'Premium NYE experience',
        availability: 60,
        benefits: ['VIP dining area', 'Premium buffet', 'Champagne toast', 'Party favors', 'Best fireworks view']
      },
      {
        id: 'vvip',
        name: 'VVIP Platinum',
        price: 200000,
        description: 'Ultimate luxury celebration',
        availability: 20,
        benefits: ['Private cabana', 'Personal waiter service', 'Dom Pérignon champagne', 'Gourmet dinner', 'Exclusive gift', 'Priority everything']
      }
    ],
    category: 'party',
    capacity: 250,
    ticketsSold: 198,
    featured: true,
  },
  {
    id: '7',
    title: 'Afrobeat Live Concert',
    description: 'Top Burundian and East African artists performing the best of Afrobeat. Dance the night away with electrifying performances.',
    date: '2025-12-10',
    time: '19:00',
    location: 'World Beach Main Stage',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
    price: 18000,
    ticketVariants: [
      {
        id: 'general',
        name: 'General',
        price: 18000,
        description: 'Standing area',
        availability: 200,
        benefits: ['Main stage view', 'General standing area']
      },
      {
        id: 'vip',
        name: 'VIP',
        price: 40000,
        description: 'Premium concert experience',
        availability: 70,
        benefits: ['Reserved seating', 'VIP lounge access', 'Complimentary drinks', 'Artist meet & greet']
      },
      {
        id: 'vvip',
        name: 'VVIP',
        price: 75000,
        description: 'Ultimate concert package',
        availability: 30,
        benefits: ['Front row seating', 'Backstage access', 'Open bar', 'Exclusive merchandise', 'Photo with artists']
      }
    ],
    category: 'concert',
    capacity: 300,
    ticketsSold: 234,
    featured: false,
  },
  {
    id: '8',
    title: 'Kids Beach Fun Day',
    description: 'A special day for children with games, activities, face painting, and kid-friendly entertainment. Includes lunch and refreshments.',
    date: '2025-11-18',
    time: '10:00',
    location: 'Kids Activity Zone',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
    price: 8000,
    ticketVariants: [
      {
        id: 'child',
        name: 'Child',
        price: 8000,
        description: 'Entry for one child',
        availability: 100,
        benefits: ['All activities', 'Lunch included', 'Face painting', 'Balloon art']
      },
      {
        id: 'family',
        name: 'Family Package',
        price: 25000,
        description: '3 children + 1 adult',
        availability: 50,
        benefits: ['Entry for 4', 'All activities', 'Meals included', 'Family photo session']
      }
    ],
    category: 'cultural',
    capacity: 150,
    ticketsSold: 87,
    featured: false,
  },
];

export const eventCategories = [
  { id: 'all', name: 'All Events' },
  { id: 'concert', name: 'Concerts' },
  { id: 'party', name: 'Parties' },
  { id: 'cultural', name: 'Cultural' },
  { id: 'sports', name: 'Sports' },
  { id: 'workshop', name: 'Workshops' },
];
