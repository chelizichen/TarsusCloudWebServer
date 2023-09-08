// store.js
import create from 'zustand';

const useStore = create((set) => ({
    user: null,
    setUser: (userInfo) => set({ user: userInfo }),
    logout: () => set({ user: null }),
}));

export default useStore;
