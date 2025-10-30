export interface Product {
  id: string;
  category: string;
  description: string;
  title: string;
  price: number;
  featured: boolean;
  imageURLs: string | string[];
  discount?: number | null;
  finalPrice?: number | null;
  size?: string;
  // eSIM specific fields
  country?: string | null;
  region?: string | null;
  dataPlan?: string | null;
  validityDays?: number | null;
  simType?: string | null;
}

export interface Image {
  id: string;
  url: string;
}

export interface Billboard {
  id: string;
  label: string;
  imageURL: string;
}

export interface Category {
  id: string;
  category: string;
  billboardId: string;
}

export interface SelectedSize {
  id: string;
  name: string;
}

export interface RequestData {
  title: string;
  description: string;
  price: number;
  imageURLs: string[];
  featured: boolean;
  category: string;
  sizes: SelectedSize[];
  categoryId: string;
  discount?: number;
}
