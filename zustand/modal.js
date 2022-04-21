import create from 'zustand';

const useModalState = create((set, get) => ({
  modalAuthOpen: false,
  modalAuthMode: 'signin',
  toggleModalAuth: () => set((state) => ({ ...state, modalAuthOpen: !state.modalAuthOpen })),
  setModalAuthMode: (mode) => set((state) => ({ ...state, modalAuthMode: mode })),
}));

export default useModalState;
