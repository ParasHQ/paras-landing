import React, { useCallback, useContext, useEffect, useState } from 'react'
import { map, distinctUntilChanged } from 'rxjs'
import { setupWalletSelector } from '@near-wallet-selector/core'
import { setupModal } from '@near-wallet-selector/modal-ui'
import { setupNearWallet } from '@near-wallet-selector/near-wallet'
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet'
import { setupSender } from '@near-wallet-selector/sender'
import getConfig from 'config/near'
import { providers } from 'near-api-js'

const WalletSelectorContext = React.createContext(null)

export const WalletSelectorContextProvider = ({ children }) => {
	const [selector, setSelector] = useState(null)
	const [modal, setModal] = useState(null)
	const [accounts, setAccounts] = useState([])
	const nearConfig = getConfig(process.env.APP_ENV || 'development')

	const init = useCallback(async () => {
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

				setAccounts(nextAccounts)
			})

		return () => subscription.unsubscribe()
	}, [selector])

	if (!selector || !modal) {
		return null
	}

	const accountId = accounts.find((account) => account.active)?.accountId || null

	const signAndSendTransactions = async (transactions) => {
		const wallet = await selector.wallet()
		return wallet.signAndSendTransactions({ transactions })
	}

	const signAndSendTransaction = async (actions) => {
		const wallet = await selector.wallet()
		await wallet.signAndSendTransaction({ actions })
	}

	const viewFunction = async ({ receiverId, methodName, args }) => {
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
