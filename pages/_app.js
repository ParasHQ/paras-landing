import { useEffect } from 'react'
import near from '../lib/near'
import useStore from '../store'
import axios from 'axios'

import '../styles/font.css'
import '../styles/tailwind.css'
import 'pure-react-carousel/dist/react-carousel.es.css'
import 'croppie/croppie.css'

function MyApp({ Component, pageProps }) {
	const store = useStore()

	useEffect(() => {
		_init()
	}, [])

	const _init = async () => {
		console.log('near init')
		await near.init()
		const currentUser = await near.currentUser
		const nearUsdPrice = await axios.get(
			'https://api.coingecko.com/api/v3/simple/price?ids=NEAR&vs_currencies=USD'
		)
		if (currentUser) {
			store.setCurrentUser(currentUser.accountId)
			store.setUserBalance(currentUser.balance)
		}
		store.setNearUsdPrice(nearUsdPrice.data.near.usd)
		store.setInitialized(true)
	}

	return <Component {...pageProps} />
}

export default MyApp
