export interface Gallery {
  id: number;
  category: string;
  image: string;
  title: string;
  description: string;
  date: string;
  position: number;
  created_at?: string;
  updated_at?: string;
}