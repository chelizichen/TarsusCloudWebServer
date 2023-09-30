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

// todo 后期迁移
const ComponentUidStore = create((set,) => ({
    components:{},
    setComponent: (uid,component) => {
        const state = ComponentUidStore.getState();
        state.components[uid] = component;
        const mergeComponent = Object.assign({},state.components,{[uid]:component})
        set({components:mergeComponent})
    },
    setComponents:(record)=>set({components:record})
}))
export default useStore;
