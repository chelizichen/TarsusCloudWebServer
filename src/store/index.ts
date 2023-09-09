// store.js
import create from 'zustand';

const useStore = create((set) => ({
    user: null,
    setUser: (userInfo) => set({user: userInfo}),
    logout: () => set({user: null}),
    invokePort: 3411,
    setInvokePort: (port) => set({invokePort: port}),
    currDir: 3411,
    setCurrDir: (currDir) => set({currDir})
}));

export default useStore;
