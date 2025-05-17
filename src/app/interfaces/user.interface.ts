export interface User {
    id?: number;
    firstName: string;
    lastName: string; 
    email: string;
    password: string;
    role: string;
    photoUrl?: string;
    photo?: File;
    status: boolean;
    phoneNumber: string;
    address: string;
    createdAt: string;
  }