import { useEffect } from 'react'
import near from '../lib/near'
import '../styles/font.css'
import '../styles/tailwind.css'
import 'pure-react-carousel/dist/react-carousel.es.css'
import useStore from '../store'

function MyApp({ Component, pageProps }) {
	const store = useStore()

	useEffect(() => {
		_init()
	}, [])

	const _init = async () => {
		console.log('near init')
		await near.init()
		const currentUser = await near.wallet.getAccountId()
		if (currentUser) {
			console.log(currentUser)
			store.setCurrentUser(currentUser)
		}
		store.setInitialized(true)
	}

	return <Component {...pageProps} />
}

export default MyApp
