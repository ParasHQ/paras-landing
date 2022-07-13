import React, { useCallback, useContext, useEffect, useState } from 'react'
import { map, distinctUntilChanged } from 'rxjs'
import { setupWalletSelector } from '@near-wallet-selector/core'
import { setupModal } from '@near-wallet-selector/modal-ui'
import { setupNearWallet } from '@near-wallet-selector/near-wallet'
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet'
import { setupSender } from '@near-wallet-selector/sender'
import getConfig from 'config/near'
import { providers } from 'near-api-js'
import useStore from 'lib/store'
import axios from 'axios'

const WalletSelectorContext = React.createContext(null)

export const WalletSelectorContextProvider = ({ children }) => {
	const [selector, setSelector] = useState(null)
	const [modal, setModal] = useState(null)
	const [accounts, setAccounts] = useState([])
	const store = useStore()

	const init = useCallback(async () => {
		const nearConfig = getConfig(process.env.APP_ENV || 'development')
		const _selector = await setupWalletSelector({
			network: nearConfig.networkId,
			debug: process.env.NODE_ENV !== 'production',
			modules: [setupNearWallet(), setupMyNearWallet(), setupSender()],
		})
		const _modal = setupModal(_selector, { contractId: nearConfig.contractName })
		const state = _selector.store.getState()

		setAccounts(state.accounts)

		window.selector = _selector
		window.modal = _modal

		setSelector(_selector)
		setModal(_modal)
	}, [])

	useEffect(() => {
		init().catch((err) => {
			console.error(err)
			alert('Failed to initialise wallet selector')
		})
	}, [init])

	useEffect(() => {
		if (!selector) {
			return
		}

		const subscription = selector.store.observable
			.pipe(
				map((state) => state.accounts),
				distinctUntilChanged()
			)
			.subscribe((nextAccounts) => {
				console.log('Accounts Update', nextAccounts)
				setupUser({
					accountId: nextAccounts?.[0]?.accountId,
					balance: '1000000000000000000',
				})

				setAccounts(nextAccounts)
			})

		return () => subscription.unsubscribe()
	}, [selector])

	const accountId = accounts.find((account) => account.active)?.accountId || null

	const signAndSendTransactions = async (transactions) => {
		const wallet = await selector.wallet()
		return wallet.signAndSendTransactions({ transactions })
	}

	const signAndSendTransaction = async (actions) => {
		const wallet = await selector.wallet()
		await wallet.signAndSendTransaction({ actions })
	}

	const setupUser = async (currentUser) => {
		console.log('currentuser', currentUser)
		if (!currentUser) return

		store.setCurrentUser(currentUser.accountId)
		store.setUserBalance(currentUser.balance)

		// Sentry.configureScope((scope) => {
		// 	const user = currentUser ? { id: currentUser.accountId } : null
		// 	scope.setUser(user)
		// 	scope.setTag('environment', process.env.APP_ENV)
		// })

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

			// try {
			// 	const resp = await axios.put(`${process.env.V2_API_URL}/profiles`, formData, {
			// 		headers: {
			// 			'Content-Type': 'multipart/form-data',
			// 			authorization: await WalletHelper.authToken(),
			// 		},
			// 	})
			// 	store.setUserProfile(resp.data.data)
			// } catch (err) {
			// 	sentryCaptureException(err)
			// 	store.setUserProfile({})
			// }
		} else {
			const userProfile = userProfileResults[0]
			store.setUserProfile(userProfile)

			const { isEmailVerified = false } = userProfile
			// if (!isEmailVerified && !cookie.get('hideEmailNotVerified')) {
			// 	store.setShowEmailWarning(true)
			// }
		}
	}

	const viewFunction = async ({ receiverId, methodName, args }) => {
		const nearConfig = getConfig(process.env.APP_ENV || 'development')
		return new providers.JsonRpcProvider({ url: nearConfig.nodeUrl })
			.query({
				request_type: 'call_function',
				account_id: receiverId,
				method_name: methodName,
				args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
				finality: 'optimistic',
			})
			.then((res) => JSON.parse(Buffer.from(res.result).toString()))
	}

	return (
		<WalletSelectorContext.Provider
			value={{
				selector,
				modal,
				accounts,
				accountId,
				signAndSendTransactions,
				signAndSendTransaction,
				viewFunction,
			}}
		>
			{children}
		</WalletSelectorContext.Provider>
	)
}

export function useWalletSelector() {
	const context = useContext(WalletSelectorContext)

	if (!context) {
		throw new Error('useWalletSelector must be used within a WalletSelectorContextProvider')
	}

	return context
}
