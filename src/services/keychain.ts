import * as Keychain from 'react-native-keychain';

const SERVICE_KEY = 'intermotors.auth.token';
const REFRESH_SERVICE_KEY = 'intermotors.auth.refresh_token';

export const saveToken = async (token: string): Promise<void> => {
  await Keychain.setGenericPassword(SERVICE_KEY, token, {
    service: SERVICE_KEY,
  });
};

export const getToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: SERVICE_KEY,
    });

    if (credentials === false) {
      return null;
    }

    return credentials.password;
  } catch {
    return null;
  }
};

export const deleteToken = async (): Promise<void> => {
  await Keychain.resetGenericPassword({ service: SERVICE_KEY });
};

export const saveRefreshToken = async (token: string): Promise<void> => {
  await Keychain.setGenericPassword(REFRESH_SERVICE_KEY, token, {
    service: REFRESH_SERVICE_KEY,
  });
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: REFRESH_SERVICE_KEY,
    });

    if (credentials === false) {
      return null;
    }

    return credentials.password;
  } catch {
    return null;
  }
};

export const deleteRefreshToken = async (): Promise<void> => {
  await Keychain.resetGenericPassword({ service: REFRESH_SERVICE_KEY });
};
