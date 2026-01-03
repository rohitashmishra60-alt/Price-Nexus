export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  offers: Offer[];
  features: string[];
  rating: number;
}

export interface Offer {
  store: string;
  price: number;
  url: string;
  currency: string;
  inStock: boolean;
}

export interface SearchState {
  query: string;
  results: Product[];
  isLoading: boolean;
  hasSearched: boolean;
}

export enum ViewState {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD'
}