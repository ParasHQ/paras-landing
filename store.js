import create from 'zustand'

const useStore = create((set) => ({
	currentUser: null,
	setCurrentUser: (user) => set((state) => ({ currentUser: user })),
	initialized: false,
	setInitialized: (val) => set(() => ({ initialized: val })),
	marketScrollPersist: 0,
	setMarketScrollPersist: (val) => set(() => ({ marketScrollPersist: val })),
	nearUsdPrice: 0,
	setNearUsdPrice: (val) => set(() => ({ nearUsdPrice: val })),
}))

export default useStore
