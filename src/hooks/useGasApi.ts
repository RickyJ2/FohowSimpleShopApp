import { useState, useCallback, useEffect } from 'react';
import { Device } from '@capacitor/device';
import type { InventoryItem, StatusResponse, BaseResponse } from '../types';

const GAS_URL = import.meta.env.VITE_GAS_URL;
const APP_TOKEN = import.meta.env.VITE_APP_TOKEN;

// Generic function to handle GAS POST requests
const fetchFromGas = async <T>(action: string, deviceId: string, payload: Record<string, unknown> = {}): Promise<T> => {
  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        action,
        token: APP_TOKEN,
        deviceId,
        ...payload,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Check for session expiration (another device took over)
    if (data && typeof data === 'object' && 'error' in data && data.error === 'SESSION_EXPIRED') {
      throw new Error('SESSION_EXPIRED');
    }

    return data as T;
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'SESSION_EXPIRED') {
      throw error;
    }
    console.error(`Error calling GAS API (${action}):`, error);
    throw new Error('Terjadi kesalahan koneksi.', { cause: error });
  }
};

export const useGasApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    const initDevice = async () => {
      try {
        const id = await Device.getId();
        setDeviceId(id.identifier);
      } catch (err) {
        console.error('Failed to get device ID:', err);
        setDeviceId('unknown-device');
      }
    };
    initDevice();
  }, []);

  const checkStatus = useCallback(async (): Promise<StatusResponse | null> => {
    if (!deviceId) return null;
    await Promise.resolve();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFromGas<StatusResponse>('checkStatus', deviceId);
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  const enterSystem = useCallback(async (): Promise<BaseResponse> => {
    if (!deviceId) return { success: false, message: 'Device ID not ready' };
    await Promise.resolve();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFromGas<BaseResponse>('masuk', deviceId);
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  const forceLogin = useCallback(async (): Promise<BaseResponse> => {
    if (!deviceId) return { success: false, message: 'Device ID not ready' };
    await Promise.resolve();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFromGas<BaseResponse>('forceLogin', deviceId);
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  const exitSystem = useCallback(async (): Promise<BaseResponse> => {
    if (!deviceId) return { success: false, message: 'Device ID not ready' };
    await Promise.resolve();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFromGas<BaseResponse>('keluar', deviceId);
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  const getInventory = useCallback(async (): Promise<InventoryItem[] | null> => {
    if (!deviceId) return null;
    await Promise.resolve();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFromGas<InventoryItem[]>('getInventory', deviceId);
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      setError(errorMessage);
      // Propagate SESSION_EXPIRED for the UI to handle
      if (errorMessage === 'SESSION_EXPIRED') throw err;
      return null;
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  const recordSale = useCallback(async (item: string, price: number): Promise<BaseResponse> => {
    if (!deviceId) return { success: false, message: 'Device ID not ready' };
    await Promise.resolve();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFromGas<BaseResponse>('addSale', deviceId, { item, price });
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      setError(errorMessage);
      if (errorMessage === 'SESSION_EXPIRED') throw err;
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  const updateInventory = useCallback(async (item: Partial<InventoryItem>): Promise<BaseResponse> => {
    if (!deviceId) return { success: false, message: 'Device ID not ready' };
    await Promise.resolve();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFromGas<BaseResponse>('updateInventory', deviceId, { item });
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      setError(errorMessage);
      if (errorMessage === 'SESSION_EXPIRED') throw err;
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  return {
    loading,
    error,
    deviceId,
    checkStatus,
    enterSystem,
    forceLogin,
    exitSystem,
    getInventory,
    updateInventory,
    recordSale,
  };
};
