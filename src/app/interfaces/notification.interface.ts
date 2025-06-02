export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  productId: number | null;
  type: string | null;
  isRead: boolean;
  createdAt: string; 
}
