export type InventoryItem = {
  id: string | number;
  name: string;
  stock: number;
};

export interface StatusResponse {
  status: string; // 'FREE' or Device ID
}

export interface BaseResponse {
  success: boolean;
  message?: string;
  error?: string;
  currentOwner?: string;
}

export type GetInvResponse = InventoryItem[];
