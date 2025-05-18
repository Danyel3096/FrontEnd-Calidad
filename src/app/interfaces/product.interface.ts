import { Category } from './category.interface';
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  url: string;
  ratingRate: number;
  ratingCount: number;
  status: boolean;
  category: Category;
}

  
  export interface ProductItemCart {
    product: Product;
    quantity: number;
  }
