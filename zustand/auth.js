import create from 'zustand';
import { persist } from 'zustand/middleware';

const initialUser = {
  user_id: null,
  name: null,
  email: null,
  picture: null
};

const dummyStorageApi = {
  getItem: () => null,
  setItem: () => undefined,
};

const useAuth = create(
  (set, get) => ({
    isLoggedIn: false,
    user: initialUser,
    login: (user) => set(state => ({ ...state, user: user, isLoggedIn: true })),
    logout: () => set(state => ({ ...state, user: initialUser, isLoggedIn: false })),
  })
  , {
    name: "propil:auth",
    storage: typeof window !== 'undefined' ? window.localStorage : dummyStorageApi,
  }
);

export default useAuth;