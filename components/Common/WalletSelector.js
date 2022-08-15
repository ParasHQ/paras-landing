import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { map, distinctUntilChanged } from 'rxjs'
import { setupWalletSelector } from '@paras-wallet-selector/core'
import { setupModal } from '@paras-wallet-selector/modal-ui'
import { setupNearWallet } from '@paras-wallet-selector/near-wallet'
import { setupMyNearWallet } from '@paras-wallet-selector/my-near-wallet'
import { setupSender } from '@paras-wallet-selector/sender'
import getConfig from 'config/near'
import { providers } from 'near-api-js'
import useStore from 'lib/store'
import ParasRequest from 'lib/ParasRequest'
import JSBI from 'jsbi'
import { Base64 } from 'js-base64'
import * as Sentry from '@sentry/nextjs'
import cookie from 'lib/cookie'

const WalletSelectorContext = React.createContext(null)

export const WalletSelectorContextProvider = ({ children }) => {
	const [selector, setSelector] = useState(null)
	const [modal, setModal] = useState(null)
	const [authToken, setAuthToken] = useState(null)
	const store = useStore()
	const authSession = useRef()

	const init = useCallback(async () => {
		const nearConfig = getConfig(process.env.APP_ENV || 'development')
		const _selector = await setupWalletSelector({
			network: nearConfig.networkId,
			debug: process.env.NODE_ENV !== 'production',
			modules: [
				setupNearWallet({ iconUrl: window.location.origin + '/assets/near-wallet-icon.png' }),
				setupSender({ iconUrl: window.location.origin + '/assets/sender-icon.png' }),
				setupMyNearWallet({ iconUrl: window.location.origin + '/assets/my-near-wallet-icon.png' }),
			],
		})
		const _modal = setupModal(_selector, { contractId: nearConfig.contractName })

		window.selector = _selector
		window.modal = _modal

		setSelector(_selector)
		setModal(_modal)
		store.setInitialized(true)
	}, [])

	useEffect(() => {
		init()
	}, [init])

	useEffect(() => {
		if (!selector) {
			return
		}

		const setupUser = async (currentUser) => {
			if (!currentUser.accountId) return

			await generateAuthToken(currentUser.accountId)

			store.setCurrentUser(currentUser.accountId)

			Sentry.configureScope((scope) => {
				const user = currentUser ? { id: currentUser.accountId } : null
				scope.setUser(user)
				scope.setTag('environment', process.env.APP_ENV)
			})

			const userNearBalance = await getAccountBalance(currentUser.accountId)
			store.setUserBalance(userNearBalance)

			const userProfileResp = await ParasRequest.get(`${process.env.V2_API_URL}/profiles`, {
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
					const resp = await ParasRequest.put(`${process.env.V2_API_URL}/profiles`, formData)
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

			authSession.current = setInterval(() => generateAuthToken(currentUser.accountId), 1000 * 3600)

			const parasBalance = await viewFunction({
				methodName: 'ft_balance_of',
				receiverId: process.env.PARAS_TOKEN_CONTRACT,
				args: { account_id: currentUser.accountId },
			})
			store.setParasBalance(parasBalance)
		}

		const subscription = selector.store.observable
			.pipe(
				map((state) => state.accounts),
				distinctUntilChanged()
			)
			.subscribe((nextAccounts) => {
				const accountId = nextAccounts.find((account) => account.active)?.accountId || null
				setupUser({ accountId: accountId })
			})

		return () => {
			subscription.unsubscribe()
			clearInterval(authSession.current)
		}
	}, [selector])

	const viewFunction = async ({ receiverId, methodName, args = '' }) => {
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

	const getAccountBalance = async (accountId) => {
		const nearConfig = getConfig(process.env.APP_ENV || 'development')
		const provider = new providers.JsonRpcProvider({ url: nearConfig.nodeUrl })
		const state = await provider.query({
			request_type: 'view_account',
			account_id: accountId,
			finality: 'final',
		})
		const protocolConfig = await provider.experimental_protocolConfig({
			finality: 'final',
		})
		const costPerByte = JSBI.BigInt(protocolConfig.runtime_config.storage_amount_per_byte)
		const stateStaked = JSBI.multiply(JSBI.BigInt(state.storage_usage), costPerByte)
		const staked = JSBI.BigInt(state.locked)
		const totalBalance = JSBI.add(JSBI.BigInt(state.amount), staked)
		const availableBalance = JSBI.subtract(
			totalBalance,
			JSBI.greaterThan(staked, stateStaked) ? staked : stateStaked
		)

		return {
			total: totalBalance.toString(),
			stateStaked: stateStaked.toString(),
			staked: staked.toString(),
			available: availableBalance.toString(),
		}
	}

	const generateAuthToken = async (accountId) => {
		const wallet = await selector.wallet()
		const arr = new Array(accountId)
		for (var i = 0; i < accountId.length; i++) {
			arr[i] = accountId.charCodeAt(i)
		}
		const msgBuf = new Uint8Array(arr)
		const signedMsg = await wallet.signMessage({ message: msgBuf })
		const pubKey = Buffer.from(signedMsg.publicKey.data).toString('hex')
		const signature = Buffer.from(signedMsg.signature).toString('hex')
		const payload = [accountId, pubKey, signature]
		const _authToken = Base64.encode(payload.join('&'))

		setAuthToken(_authToken)

		ParasRequest.defaults.headers.common['Authorization'] = _authToken

		return _authToken
	}

	return (
		<WalletSelectorContext.Provider
			value={{
				selector,
				modal,
				authToken,
				getAccountBalance,
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
