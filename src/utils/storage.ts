import { STORAGE_PREFIX } from '../constants/app';

export function getStorageData(key?: string): any | undefined {
  try {
    const data = JSON.parse(window.localStorage.getItem(`${STORAGE_PREFIX}`));

    if (key === undefined) {
      return data || {};
    }

    return data && typeof data === 'object' ? data[key] : undefined;
  } catch (error) {
    console.warn(error);
  }
}

export function saveStorageData(key: string, data: any): void {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}`, JSON.stringify({
      ...getStorageData(),
      [key]: data,
    }));
  } catch (error) {
    console.warn(error);
  }
}
