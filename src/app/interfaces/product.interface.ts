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
}

  
  export interface ProductItemCart {
    product: Product;
    quantity: number;
  }
