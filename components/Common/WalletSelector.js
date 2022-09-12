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
import {
	init as initRamper,
	signIn,
	AUTH_PROVIDER,
	THEME,
	getUser,
	signMessage,
	sendTransaction,
	signOut,
} from '@ramper/near'
import { createAction } from '@paras-wallet-selector/wallet-utils'
import SignMesssageModal from 'components/Modal/SignMessageModal'
import { sentryCaptureException } from 'lib/sentry'

const WalletSelectorContext = React.createContext(null)

export const WalletSelectorContextProvider = ({ children }) => {
	const [selector, setSelector] = useState(null)
	const [modal, setModal] = useState(null)
	const [authToken, setAuthToken] = useState(null)
	const [showRamperSignModal, setShowRamperSignModal] = useState(false)
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
	}, [])

	const initializeRamper = async () => {
		const nearConfig = getConfig(process.env.APP_ENV || 'development')
		await initRamper({
			appName: 'Paras - NFT Marketplace for Digital Collectibles on NEAR',

			authProviders: [
				AUTH_PROVIDER.GOOGLE,
				AUTH_PROVIDER.FACEBOOK,
				AUTH_PROVIDER.TWITTER,
				AUTH_PROVIDER.APPLE,
				AUTH_PROVIDER.EMAIL,
			],
			walletProviders: [],
			network: nearConfig.networkId,
			theme: THEME.DARK,
		})
		const user = getUser()
		if (getActiveWallet() === 'ramper') {
			setupUser({ accountId: user?.wallets.near.publicKey }, 'ramper')
		}
	}

	useEffect(() => {
		init()
		initializeRamper()
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
				const accountId = nextAccounts.find((account) => account.active)?.accountId || null
				setupUser({ accountId: accountId })
			})

		return () => {
			subscription.unsubscribe()
			clearInterval(authSession.current)
		}
	}, [selector])

	const signInRamper = async () => {
		localStorage.removeItem('RAMPER_SIGNED_MSG')
		await signIn()
		const user = getUser()

		setupUser({ accountId: user?.wallets.near.publicKey }, 'ramper')
	}

	const setupUser = async (currentUser, walletType = 'wallet-selector') => {
		if (!currentUser.accountId) return
		setActiveWallet(walletType)

		const authToken = await generateAuthToken(currentUser.accountId, walletType)
		store.setCurrentUser(currentUser.accountId)

		if (!authToken) return

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

		authSession.current = setInterval(
			() => generateAuthToken(currentUser.accountId, walletType),
			1000 * 3600
		)

		const parasBalance = await viewFunction({
			methodName: 'ft_balance_of',
			receiverId: process.env.PARAS_TOKEN_CONTRACT,
			args: { account_id: currentUser.accountId },
		})
		store.setParasBalance(parasBalance)

		store.setInitialized(true)
	}

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
		try {
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
		} catch (error) {
			sentryCaptureException(error)
			return {
				total: '0',
				stateStaked: '0',
				staked: '0',
				available: '0',
			}
		}
	}

	const generateAuthToken = async (accountId, walletType = 'wallet-selector') => {
		const arr = new Array(accountId)
		for (var i = 0; i < accountId.length; i++) {
			arr[i] = accountId.charCodeAt(i)
		}
		const msgBuf = new Uint8Array(arr)
		let signedMsg

		if (walletType === 'wallet-selector') {
			const wallet = await selector.wallet()
			signedMsg = await wallet.signMessage({ message: msgBuf })
		}

		if (walletType === 'ramper') {
			const ramperSignedMsg = JSON.parse(localStorage.getItem('RAMPER_SIGNED_MSG'))
			if (ramperSignedMsg && ramperSignedMsg.accountId === accountId) {
				signedMsg = ramperSignedMsg.signedMsg
			} else if (!showRamperSignModal) {
				setShowRamperSignModal(true)
				return
			} else {
				const nearConfig = getConfig(process.env.APP_ENV || 'development')
				signedMsg = (await signMessage({ message: msgBuf, network: nearConfig.networkId })).result
			}

			if (!signedMsg) {
				signOut()
				localStorage.removeItem('RAMPER_SIGNED_MSG')
				localStorage.removeItem('PARAS_ACTIVE_WALLET')

				window.location.replace(window.location.origin + window.location.pathname)
				return
			}

			// save the signed message to local storage
			const signedMsgString = JSON.stringify({ accountId, signedMsg })
			localStorage.setItem('RAMPER_SIGNED_MSG', signedMsgString)

			signedMsg.publicKey.data = new Uint8Array(Object.values(signedMsg.publicKey.data))
			signedMsg.signature = new Uint8Array(Object.values(signedMsg.signature))
		}

		const pubKey = Buffer.from(signedMsg.publicKey.data).toString('hex')
		const signature = Buffer.from(signedMsg.signature).toString('hex')
		const payload = [accountId, pubKey, signature]
		const _authToken = Base64.encode(payload.join('&'))

		setAuthToken(_authToken)
		setShowRamperSignModal(false)

		ParasRequest.defaults.headers.common['Authorization'] = _authToken

		return _authToken
	}

	const signAndSendTransactions = async ({ transactions = [] }) => {
		const activeWallet = getActiveWallet()
		if (activeWallet === 'wallet-selector') {
			const wallet = await selector.wallet()
			return wallet.signAndSendTransactions({ transactions: transactions })
		}

		if (activeWallet === 'ramper') {
			return signAndSendTransactionRamper({ transactions })
		}
	}

	const signAndSendTransaction = async ({ receiverId, actions = [] }) => {
		const activeWallet = getActiveWallet()
		if (activeWallet === 'wallet-selector') {
			const wallet = await selector.wallet()
			return wallet.signAndSendTransaction({ receiverId: receiverId, actions: actions })
		}

		if (activeWallet === 'ramper') {
			return signAndSendTransactionRamper({ receiverId, actions })
		}
	}

	const signAndSendTransactionRamper = async ({ receiverId, actions = [], transactions = [] }) => {
		let transactionActions
		if (transactions.length > 0) {
			// map signAndSendTransactions with (s)
			transactionActions = transactions.map((transaction) => ({
				receiverId: transaction.receiverId,
				actions: transaction.actions.map((action) => createAction(action)),
			}))
		}

		if (actions.length > 0) {
			// map signAndSendTransaction
			transactionActions = actions.map((action) => ({
				receiverId: receiverId || process.env.MARKETPLACE_CONTRACT_ID,
				actions: [createAction(action)],
			}))
		}

		const res = await sendTransaction({
			transactionActions: transactionActions,
		})

		if (res.type === 'success') {
			return res.result.length > 1 ? res.result : res.result[0]
		} else {
			throw new Error('Failed')
		}
	}

	const getActiveWallet = () => {
		return localStorage.getItem('PARAS_ACTIVE_WALLET')
	}

	const setActiveWallet = (wallet) => {
		return localStorage.setItem('PARAS_ACTIVE_WALLET', wallet)
	}

	return (
		<WalletSelectorContext.Provider
			value={{
				selector,
				modal,
				authToken,
				getAccountBalance,
				signInRamper,
				viewFunction,
				signAndSendTransaction,
				signAndSendTransactions,
			}}
		>
			<SignMesssageModal
				show={showRamperSignModal}
				onClick={async () => setupUser({ accountId: store.currentUser }, 'ramper')}
			/>
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
