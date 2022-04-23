import create from 'zustand';

const initialUser = {
  user_id: null,
  name: null,
  email: null,
  picture: null,
};

const useAuth = create(
  (set, get) => ({
    isLoggedIn: false,
    user: initialUser,
    login: (user) => set((state) => ({ ...state, user, isLoggedIn: true })),
    logout: () => set((state) => ({ ...state, user: initialUser, isLoggedIn: false })),
  }),
);

export default useAuth;
