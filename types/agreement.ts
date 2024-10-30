export interface Agreement {
  id: number;
  vendor: string;
  buyer: string;
  amount: number;
  description: string;
  status: 1 | 2 | 3 | 4 | 5 | 6;
  createdAt: string;
}

export interface NewAgreement {
  buyer: string;
  amount: string;
  description: string;
}
