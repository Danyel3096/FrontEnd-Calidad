export interface Order {
  id?: number;
  storeId: number;
  userId: number | null; // ✅ Permite null
  saleDate: string;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  deleted?: boolean;
  createdAt?: string;
  saleDetails?: any[];
  
}
