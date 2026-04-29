export interface Batch {
  id: number;
  variant: string;
  pd: string;
  exp: string;
  stock: number;
}

export interface InventoryGroup {
  baseName: string;
  totalStock: number;
  image: string; // Raw GitHub URL
  batches: Batch[];
}

export interface StatusResponse {
  status: string; // 'FREE' or Device ID
}

export interface InventoryItem {
  id?: number;
  baseName: string;
  variant: string;
  pd: string;
  exp: string;
  stock: number;
  image: string;
}

export type UpdateInventoryItem = Partial<InventoryItem> & { id?: number };

export interface BaseResponse {
  success: boolean;
  message?: string;
  error?: string;
  currentOwner?: string;
}
