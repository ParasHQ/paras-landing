import near from './near'
import senderWallet, {
	getSenderWalletLocalStorage,
	removeSenderWalletLocalStorage,
} from './senderWallet'

export const walletType = { sender: 'sender', web: 'web' }

class WalletHelper {
	activeWallet = null
	_authToken = null

	async initialize() {
		await near.init()
		if (typeof window.near !== 'undefined' && window.near.isSender) {
			window.near.on('signIn', () => {
				this.activeWallet = walletType.sender
			})

			window.near.on('signOut', () => {
				this.activeWallet = null
				this._authToken = null
				removeSenderWalletLocalStorage()
			})

			const signedInRes = getSenderWalletLocalStorage()
			if (signedInRes && !window.near.isSignedIn()) {
				await senderWallet.signIn()
			}
		} else if (near.currentUser) {
			this.activeWallet = walletType.web
		}
	}

	async authToken() {
		if (!this._authToken && this.activeWallet !== walletType.sender) {
			return await near.authToken()
		}
		return this.activeWallet === walletType.sender ? senderWallet.authToken : this._authToken
	}

	get currentUser() {
		return this.activeWallet === walletType.sender ? senderWallet.currentUser : near.currentUser
	}

	signOut() {
		this.activeWallet === walletType.sender ? senderWallet.signOut() : near.logout()
	}

	viewFunction({ methodName, args, contractName }) {
		near.viewFunction({ methodName, args, contractName })
	}

	callFunction({ methodName, args, deposit, contractId, gas }) {
		if (this.activeWallet === walletType.sender) {
			return senderWallet.signAndSendTransaction({
				methodName,
				args,
				deposit,
				contractId,
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
}

export default new WalletHelper()
