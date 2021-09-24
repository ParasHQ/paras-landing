import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import near from '../lib/near'
import useStore from '../lib/store'
import axios from 'axios'
import { useRouter } from 'next/router'
import * as gtag from '../lib/gtag'
import cookie from '../lib/cookie'

import '../styles/font.css'
import '../styles/tailwind.css'
import 'draft-js/dist/Draft.css'
import 'pure-react-carousel/dist/react-carousel.es.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'croppie/croppie.css'

import ToastProvider from '../hooks/useToast'
import { SWRConfig } from 'swr'
import { getLocaleStrings, strings } from 'utils/strings'

function MyApp({ Component, pageProps }) {
	const store = useStore()

	const router = useRouter()
	const { locale } = router

	const counter = async (url) => {
		// check cookie uid
		let uid = cookie.get('uid')
		// create cookie uid if not exist
		if (!uid) {
			uid = uuidv4()
			cookie.set('uid', uid, {
				expires: 30,
			})
		}
		const authHeader = await near.authToken()
		await axios.post(
			`${process.env.V2_API_URL}/analytics`,
			{
				uid: uid,
				page: url,
			},
			{
				headers: {
					authorization: authHeader,
				},
			}
		)
	}

	useEffect(() => {
		const handleRouteChange = (url) => {
			if (window && window.gtag) {
				gtag.pageview(url)
			}
			if (window) {
				counter(url)
			}
		}

		if (process.env.APP_ENV === 'production') {
			router.events.on('routeChangeComplete', handleRouteChange)
		}

		return () => {
			router.events.off('routeChangeComplete', handleRouteChange)
		}
	}, [router.events])

	useEffect(() => storePathValues, [router.asPath])

	function storePathValues() {
		const storage = globalThis?.sessionStorage
		if (!storage) return

		const prevPath = storage.getItem('currentPath')
		if (prevPath) {
			storage.setItem('prevPath', prevPath)
		}
		storage.setItem(
			'currentPath',
			`${globalThis.location.pathname}${globalThis.location.search}`
		)
	}

	useEffect(() => {
		_init()
		const storage = globalThis?.sessionStorage
		if (!storage) return
		storage.setItem(
			'currentPath',
			`${globalThis.location.pathname}${globalThis.location.search}`
		)
	}, [])

	const _init = async () => {
		await near.init()
		const currentUser = await near.currentUser
		const nearUsdPrice = await axios.get(
			'https://api.coingecko.com/api/v3/simple/price?ids=NEAR&vs_currencies=USD'
		)
		if (currentUser) {
			const userProfileResp = await axios.get(
				`${process.env.V2_API_URL}/profiles`,
				{
					params: {
						accountId: currentUser.accountId,
					},
				}
			)
			const userProfileResults = userProfileResp.data.data.results

			if (userProfileResults.length === 0) {
				const formData = new FormData()
				formData.append('bio', 'Citizen of Paras')
				formData.append('accountId', currentUser.accountId)

				try {
					const resp = await axios.put(
						`${process.env.V2_API_URL}/profiles`,
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
					store.setUserProfile({})
				}
			} else {
				const userProfile = userProfileResults[0]
				store.setUserProfile(userProfile)

				const { isEmailVerified = false } = userProfile
				if (!isEmailVerified && !cookie.get('hideEmailNotVerified')) {
					store.setShowEmailWarning(true)
				}
			}

			store.setCurrentUser(currentUser.accountId)
			store.setUserBalance(currentUser.balance)
		}
		store.setNearUsdPrice(nearUsdPrice.data.near.usd)
		store.setInitialized(true)

		if (process.env.APP_ENV === 'production') {
			// initial route analytics
			const url = router.asPath

			if (window && window.gtag) {
				gtag.pageview(url)
			}
			if (window) {
				counter(url)
			}
		}
	}

	useEffect(async () => {
		const labels = await getLocaleStrings({ locale })
		strings.setContent({ [locale]: labels })
		strings.setLanguage(locale)
		store.setLocale(locale)
	}, [locale])

	return (
		<div>
			<SWRConfig value={{}}>
				<ToastProvider>
					<Component {...pageProps} />
				</ToastProvider>
			</SWRConfig>
		</div>
	)
}

export default MyApp
