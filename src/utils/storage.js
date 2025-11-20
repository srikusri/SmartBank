const STORAGE_KEY = 'smartbank_data';

export const getStorage = (key = 'smartbank_data') => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const setStorage = (data, key = 'smartbank_data') => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const clearStorage = (key = 'smartbank_data') => {
  localStorage.removeItem(key);
};
