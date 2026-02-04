
import React from 'react';

export interface Category {
  id: string; // collection handle
  label: string;
  icon?: React.ReactNode;
}

export interface Product {
  id: string;
  collectionHandle: string;
  handle: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  specs: string[];
  img: string;
  images: string[];
  available: boolean;
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Bundle {
  name: string;
  price: string;
  protect: string;
  img: string;
  featured: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
