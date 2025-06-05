export interface Order {
  id?: number;
  storeId: number;
  userId: number | null; // ✅ Permite null
  saleDate: string;
  paymentMethod: string;
  totalAmount: number;
  status: boolean;
  createdAt?: string;
  deleted: string;
  
  
}
