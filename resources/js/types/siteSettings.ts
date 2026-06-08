export interface SiteSettings {
  business_name: string;
  tagline: string;
  logo_path: string;
  about_title: string;
  about_description: string;
  about_mission: string;
  about_vision: string;
  about_history: string;
  phone: string;
  secondary_phone: string;
  email: string;
  secondary_email: string;
  address: string;
  weekday_hours: string;
  weekend_hours: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  map_url: string;
}

export const defaultSiteSettings: SiteSettings = {
  business_name: 'World Beach Burundi',
  tagline: 'Where the Lake Meets Luxury',
  logo_path: '',
  about_title: 'About World Beach Burundi',
  about_description:
    'A culinary journey inspired by Lake Tanganyika and the vibrant culture of Burundi.',
  about_mission:
    'Our mission is to create memorable dining experiences that blend warm hospitality, fresh ingredients, and the beauty of the lakeside.',
  about_vision:
    'Our vision is to be the destination where guests gather for great food, genuine connection, and unforgettable moments by the water.',
  about_history:
    'World Beach Burundi was built to bring people together through food, atmosphere, and the natural charm of Bujumbura.',
  phone: '+257 22 28 45 67',
  secondary_phone: '+257 79 12 34 56',
  email: 'hello@worldbeach.bi',
  secondary_email: 'info@worldbeachburundi.com',
  address: 'Avenue de la Plage, Bujumbura, Burundi',
  weekday_hours: '09:00 - 23:00',
  weekend_hours: '08:00 - 00:00',
  facebook_url: 'https://facebook.com/worldbeachburundi',
  instagram_url: 'https://instagram.com/worldbeachburundi',
  twitter_url: 'https://twitter.com/worldbeachbi',
  map_url: 'https://maps.google.com',
};
