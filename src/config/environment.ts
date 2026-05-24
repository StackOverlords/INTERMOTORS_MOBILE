import Config from 'react-native-config';

export const ENV = {
  API_BASE_URL: Config.API_BASE_URL ?? '',
  APP_VERSION: Config.APP_VERSION ?? '0.0.0',
} as const;
