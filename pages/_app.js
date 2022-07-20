import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useStore from 'lib/store'
import axios from 'axios'
import { useRouter } from 'next/router'
import { IntlProvider } from 'react-intl'
import * as locales from '../content/locale'
import { getLanguage } from '../content/locale'
import * as gtag from 'lib/gtag'
import cookie from 'lib/cookie'
import Script from 'next/script'

import '../styles/font.css'
import '../styles/tailwind.css'
import 'draft-js/dist/Draft.css'
import 'croppie/croppie.css'

import ToastProvider from 'hooks/useToast'
import { SWRConfig } from 'swr'
import * as Sentry from '@sentry/nextjs'
import { sentryCaptureException } from 'lib/sentry'
import { GTM_ID, pageview } from 'lib/gtm'
import SuccessTransactionModal from 'components/Modal/SuccessTransactionModal'
import WalletHelper from 'lib/WalletHelper'
import cachios from 'cachios'
import RPCStatus from 'components/Common/RPCStatus'

const MAX_ACTIVITY_DELAY = 5

function MyApp({ Component, pageProps }) {
	const store = useStore()
	const router = useRouter()
	const { locale, defaultLocale, pathname } = router

	let localeCopy = locales[locale]
	const defaultLocaleCopy = locales[defaultLocale]

	// For checking RPC status
	// eslint-disable-next-line no-unused-vars
	const rpc = RPCStatus()

	const messages = localeCopy[pathname]
		? {
				...defaultLocaleCopy[pathname],
				...localeCopy[pathname],
		  }
		: {
				...defaultLocaleCopy['defaultAll'],
				...localeCopy['defaultAll'],
		  }

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
		const authHeader = await WalletHelper.authToken()
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
				gtag.pageview({ url, userId: store.currentUser })
			}
			if (window) {
				counter(url)
			}
			pageview(url)
		}

		if (process.env.APP_ENV === 'production') {
			router.events.on('routeChangeComplete', handleRouteChange)
		}

		return () => {
			router.events.off('routeChangeComplete', handleRouteChange)
		}
	}, [router.events, store.currentUser])

	useEffect(() => storePathValues, [router.asPath])

	const fetchActivities = async () => {
		const _query = `is_verified=${false}&__limit=${1}`
		const respActivities = await axios.get(`${process.env.V2_API_URL}/activities?${_query}`)
		const respDataActivities = respActivities.data.data.results
		if (
			Math.floor((new Date() - new Date(respDataActivities[0].msg?.datetime)) / (1000 * 60)) >=
			MAX_ACTIVITY_DELAY
		) {
			store.setActivitySlowUpdate(true)
		} else {
			store.setActivitySlowUpdate(false)
		}
	}

	const fetchSmallBanner = async () => {
		const smallBannerResp = await axios.get(`${process.env.V2_API_URL}/small-banner`)
		const smallBanner = smallBannerResp.data.result

		store.setSmallBanner(smallBanner[0])
	}

	useEffect(() => {
		fetchActivities()
		fetchSmallBanner()
		setInterval(() => {
			fetchActivities()
		}, 1000 * 60 * 5)
	}, [])

	function storePathValues() {
		const storage = globalThis?.sessionStorage
		if (!storage) return

		const prevPath = storage.getItem('currentPath')
		if (prevPath) {
			storage.setItem('prevPath', prevPath)
		}
		storage.setItem('currentPath', `${globalThis?.location.pathname}${globalThis?.location.search}`)
	}

	useEffect(() => {
		let lang = getLanguage()
		if (locale != lang && pathname != '/languages') {
			router.push('/' + lang + router.asPath)
			return
		}
		_init()

		if (process.env.APP_ENV === 'production') {
			// initial route analytics
			const url = router.asPath

			if (window && window.gtag) {
				gtag.pageview({ url, userId: store.currentUser })
			}
			if (window) {
				counter(url)
			}
			pageview(url)
		}

		const storage = globalThis?.sessionStorage
		if (!storage) return
		storage.setItem('currentPath', `${globalThis?.location.pathname}${globalThis?.location.search}`)
	}, [])

	useEffect(() => {
		removeQueryTransactionFromNear()
	}, [router.isReady])

	useEffect(() => {
		if (store.activeWallet === 'senderWallet') {
			const currentUser = WalletHelper.currentUser
			setupUser(currentUser)
		}
	}, [store.activeWallet])

	const _init = async () => {
		await WalletHelper.initialize({ onChangeUser: setupUser })

		const currentUser = WalletHelper.currentUser

		if (currentUser) {
			setupUser(currentUser)
		}
		getNearUsdPrice()
		store.setInitialized(true)
	}

	const setupUser = async (currentUser) => {
		if (!currentUser) return

		store.setCurrentUser(currentUser.accountId)
		store.setUserBalance(currentUser.balance)

		Sentry.configureScope((scope) => {
			const user = currentUser ? { id: currentUser.accountId } : null
			scope.setUser(user)
			scope.setTag('environment', process.env.APP_ENV)
		})

		const userProfileResp = await axios.get(`${process.env.V2_API_URL}/profiles`, {
			params: {
				accountId: currentUser.accountId,
			},
		})
		const userProfileResults = userProfileResp.data.data.results

		if (userProfileResults.length === 0) {
			const formData = new FormData()
			formData.append('bio', 'Citizen of Paras')
			formData.append('accountId', currentUser.accountId)

			try {
				const resp = await axios.put(`${process.env.V2_API_URL}/profiles`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						authorization: await WalletHelper.authToken(),
					},
				})
				store.setUserProfile(resp.data.data)
			} catch (err) {
				sentryCaptureException(err)
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

		const parasBalance = await WalletHelper.viewFunction({
			methodName: 'ft_balance_of',
			contractId: process.env.PARAS_TOKEN_CONTRACT,
			args: { account_id: currentUser.accountId },
		})
		store.setParasBalance(parasBalance)
	}

	const removeQueryTransactionFromNear = () => {
		const query = router.query

		if (query.successLogin || query.public_key || query.all_keys) {
			delete query.account_id
			delete query.public_key
			delete query.transactionHashes
			delete query.all_keys
			delete query.successLogin

			router.replace({ pathname: router.pathname, query }, undefined, { shallow: true })
		}
	}

	const getNearUsdPrice = async () => {
		try {
			const nearUsdPrice = await cachios.get(
				'https://api.coingecko.com/api/v3/simple/price?ids=NEAR&vs_currencies=USD',
				{
					ttl: 60 * 15,
				}
			)
			store.setNearUsdPrice(nearUsdPrice.data.near.usd)
		} catch (error) {
			sentryCaptureException('Failed Coingecko')
		}
	}

	return (
		<>
			{/* Google Tag Manager - Global base code */}
			{/* eslint-disable @next/next/inline-script-id */}
			<Script
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${GTM_ID}');
          `,
				}}
			/>
			<Script
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
            (function(w,d,s,r,k,h,m){
              if(w.performance && w.performance.timing && w.performance.navigation) {
                w[r] = w[r] || function(){(w[r].q = w[r].q || []).push(arguments)};
                h=d.createElement('script');h.async=true;h.setAttribute('src',s+k);
                d.getElementsByTagName('head')[0].appendChild(h);
                (m = window.onerror),(window.onerror = function (b, c, d, f, g) {
                m && m(b, c, d, f, g),g || (g = new Error(b)),(w[r].q = w[r].q || []).push(["captureException",g]);})
              }
            })(window,document,'//static.site24x7rum.com/beacon/site24x7rum-min.js?appKey=','s247r','47149c3273e596e4b9c4f61e3136a75f');
          `,
				}}
			/>
			<div>
				<IntlProvider
					locale={locale}
					defaultLocale={defaultLocale}
					messages={messages}
					onError={(err) => {
						if (err.code === 'MISSING_TRANSLATION') {
							// console.warn('Missing translation', err.message)
							return
						}
						throw err
					}}
				>
					<SWRConfig value={{}}>
						<ToastProvider>
							<Component {...pageProps} />
							<SuccessTransactionModal />
						</ToastProvider>
					</SWRConfig>
				</IntlProvider>
			</div>
		</>
	)
}

export default MyApp
