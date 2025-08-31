import Cookies from 'js-cookie';

const TOKEN_KEY = 'assessment_token';
const USER_KEY = 'assessment_user';

export const getToken = (): string | null => {
  return Cookies.get(TOKEN_KEY) || null;
};

export const setToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, { expires: 7, secure: true, sameSite: 'strict' });
};

export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(USER_KEY);
};

export const getUser = (): any => {
  const user = Cookies.get(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user: any): void => {
  Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7, secure: true, sameSite: 'strict' });
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};