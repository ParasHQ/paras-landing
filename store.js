import create from 'zustand'

const useStore = create((set) => ({
	currentUser: null,
	setCurrentUser: (user) => set((state) => ({ currentUser: user })),
	initialized: false,
	setInitialized: (val) => set(() => ({ initialized: val })),
}))

export default useStore
