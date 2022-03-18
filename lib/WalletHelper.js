import { transactions } from 'near-api-js'
import near from './near'
import senderWallet, {
	getSenderWalletLocalStorage,
	removeSenderWalletLocalStorage,
} from './senderWallet'

export const walletType = { sender: 'sender', web: 'web' }

class WalletHelper {
	activeWallet = null
	_authToken = null
	_wallet = null

	async initialize({ onChangeUser }) {
		await near.init()
		setTimeout(async () => {
			if (typeof window.near !== 'undefined' && window.near.isSender) {
				window.near.on('signIn', () => {
					this.activeWallet = walletType.sender
				})

				window.near.on('accountChanged', async () => {
					await senderWallet.signIn()
					onChangeUser(this.currentUser)
				})

				window.near.on('signOut', () => {
					this.activeWallet = null
					this._authToken = null
					removeSenderWalletLocalStorage()
				})

				const signedInRes = getSenderWalletLocalStorage()
				if (signedInRes && !window.near.isSignedIn()) {
					await senderWallet.signIn()
					await onChangeUser(senderWallet.currentUser)
					return
				}
			}
		}, 200)
		if (near.currentUser) {
			this.activeWallet = walletType.web
		}
	}

	async authToken() {
		if (this.activeWallet === walletType.web && !near._authToken) {
			return await near.authToken()
		}

		return this.activeWallet === walletType.sender ? senderWallet.authToken : near._authToken
	}

	get currentUser() {
		return this.activeWallet === walletType.sender ? senderWallet.currentUser : near.currentUser
	}

	signOut() {
		this.activeWallet === walletType.sender ? senderWallet.signOut() : near.logout()
	}

	viewFunction({ methodName, args, contractId }) {
		return near.viewFunction({ methodName, args, contractId })
	}

	callFunction({ methodName, args, deposit, contractId, gas }) {
		if (this.activeWallet === walletType.sender) {
			return senderWallet.signAndSendTransaction({
				methodName,
				args,
				deposit,
				receiverId: contractId,
				gas,
			})
		} else {
			return near.callFunction({
				methodName,
				args,
				deposit,
				contractId,
				gas,
			})
		}
	}

	signAndSendTransaction({ receiverId, actions }) {
		if (this.activeWallet === walletType.sender) {
			return senderWallet.signAndSendTransaction({ receiverId, transactions: actions })
		} else {
			return near.signAndSendTransactions({
				receiverId,
				actions: actions.map((action) =>
					transactions.functionCall(action.methodName, action.args, action.gas, action.deposit)
				),
			})
		}
	}

	multipleCallFunction(transactions) {
		if (this.activeWallet === walletType.sender) {
			const _transactions = transactions.map((tx) => ({
				receiverId: tx.receiverId,
				actions: tx.functionCalls.map((params) => ({
					...params,
					deposit: params.attachedDeposit,
				})),
			}))
			return senderWallet.signAndSendCrossChainTransaction(_transactions)
		} else {
			return near.executeMultipleTransactions(transactions)
		}
	}
}

export default new WalletHelper()
