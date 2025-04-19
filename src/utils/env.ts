export const getEnv = (key: string, defaultValue: string = ''): string => {
  const envKey = `VITE_${key}`;
  return import.meta.env[envKey] || defaultValue;
};

export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

export const getApiUrl = (): string => {
  return getEnv('API_URL');
};