import { useEffect } from 'react'
import near from '../lib/near'
import useStore from '../store'
import axios from 'axios'
import { useRouter } from 'next/router'
import * as gtag from '../lib/gtag'

import '../styles/font.css'
import '../styles/tailwind.css'
import 'pure-react-carousel/dist/react-carousel.es.css'
import 'croppie/croppie.css'

import ToastProvider from '../hooks/useToast'
import { SWRConfig } from 'swr'

function MyApp({ Component, pageProps }) {
	const store = useStore()

	const router = useRouter()

	useEffect(() => {
		const handleRouteChange = (url) => {
			if (window && window.gtag) {
				gtag.pageview(url)
			}
		}
		router.events.on('routeChangeComplete', handleRouteChange)

		return () => {
			router.events.off('routeChangeComplete', handleRouteChange)
		}
	}, [router.events])

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
			const userProfileResp = await axios.get(
				`${process.env.API_URL}/profiles?accountId=${currentUser.accountId}`
			)
			const userProfileResults = userProfileResp.data.data.results

			if (userProfileResults.length === 0) {
				const formData = new FormData()
				formData.append('bio', 'Citizen of Paras')
				formData.append('accountId', currentUser.accountId)

				try {
					const resp = await axios.put(
						`${process.env.API_URL}/profiles`,
						formData,
						{
							headers: {
								'Content-Type': 'multipart/form-data',
								authorization: await near.authToken(),
							},
						}
					)
					store.setUserProfile(resp.data.data)
				} catch (err) {
					console.log(err)
					store.setUserProfile({})
				}
			} else {
				const userProfile = userProfileResults[0]
				store.setUserProfile(userProfile)
			}

			store.setCurrentUser(currentUser.accountId)
			store.setUserBalance(currentUser.balance)
		}
		store.setNearUsdPrice(nearUsdPrice.data.near.usd)
		store.setInitialized(true)
	}

	return (
		<div>
			<SWRConfig
				value={{
					refreshInterval: 3000,
				}}
			>
				<ToastProvider>
					<Component {...pageProps} />
				</ToastProvider>
			</SWRConfig>
		</div>
	)
}

export default MyApp
