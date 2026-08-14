export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  createdAt: number;
}

export interface NewProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
}