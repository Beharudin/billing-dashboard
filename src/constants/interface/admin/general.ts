export interface TopMembers {
  id: number;
  name: string;
  share: number;
  profit: number;
}

export interface RecentTransaction {
  consumerName: string;
  agentName: string;
  paymentMethod: string;
  amount: number;
  notes: string;
  recordedAt: string;
  transactionId: string;
}

export interface City {
  id: number;
  createdAt: string;
  cityName: string;
  isEnabled: boolean;
  subcities: Subcity[];
}

export interface Subcity {
  id: number;
  createdAt: string;
  subcityName: string;
  cityName: string;
  isEnabled: boolean;
  woredas: Woreda[];
}

export interface Woreda {
  id: number;
  createdAt: string;
  woredaName: string;
  subcityName: string;
}

export interface DocumentType {
  id: number;
  userTypes: string[];
  name: string;
  isActive: boolean;
}
