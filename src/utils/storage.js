const STORAGE_KEY = 'smartbank_data';

export const getStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const setStorage = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const clearStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};
