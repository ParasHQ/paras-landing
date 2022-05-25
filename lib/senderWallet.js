import getConfig from 'config/near'
import { Base64 } from 'js-base64'
import { InMemorySigner, KeyPair, keyStores } from 'near-api-js'
import near from './near'

export const SENDER_WALLED_ACCOUNT = 'SENDER_WALLED_ACCOUNT'

export const getSenderWalletLocalStorage = () => {
	return localStorage.getItem(SENDER_WALLED_ACCOUNT)
}

export const removeSenderWalletLocalStorage = () => {
	localStorage.removeItem(SENDER_WALLED_ACCOUNT)
}

class SenderWallet {
	constructor() {
		this.authToken = null
		this.accessKey = null
		this.currentUser = null
	}

	async generateAuthToken() {
		if (!this.currentUser) {
			return
		}

		const { networkId } = getConfig(process.env.APP_ENV || 'development')
		const keyStore = new keyStores.InMemoryKeyStore()
		const keyPair = KeyPair.fromString(this.accessKey.secretKey)
		await keyStore.setKey(networkId, this.currentUser.accountId, keyPair)

		const signer = new InMemorySigner(keyStore)

		const arr = new Array(this.currentUser.accountId)
		for (var i = 0; i < this.currentUser.accountId.length; i++) {
			arr[i] = this.currentUser.accountId.charCodeAt(i)
		}

		const msgBuf = new Uint8Array(arr)
		const signedMsg = await signer.signMessage(msgBuf, this.currentUser.accountId, networkId)

		const pubKey = Buffer.from(signedMsg.publicKey.data).toString('hex')
		const signature = Buffer.from(signedMsg.signature).toString('hex')
		const payload = [this.currentUser.accountId, pubKey, signature]

		this.authToken = Base64.encode(payload.join('&'))

		return this.authToken
	}

	async signIn() {
		const resSignIn = await window.near.requestSignIn({
			contractId: process.env.MARKETPLACE_CONTRACT_ID,
		})
		if (resSignIn && resSignIn.accessKey) {
			const accountId = resSignIn.accountId || window.near.accountId
			this.currentUser = {
				accountId,
				balance: await (await near.near.account(accountId)).getAccountBalance(),
			}
			this.accessKey = resSignIn.accessKey
			localStorage.setItem(SENDER_WALLED_ACCOUNT, SENDER_WALLED_ACCOUNT + '::' + accountId)
			await this.generateAuthToken()
		}
	}

	signOut() {
		window.near.signOut()
		window.location.replace(window.location.origin + window.location.pathname)
	}

	signAndSendTransaction({ transactions, methodName, args, deposit, receiverId, gas }) {
		const actions = transactions || [
			{
				methodName,
				args,
				gas,
				deposit,
			},
		]

		return window.near.signAndSendTransaction({ receiverId, actions })
	}

	signAndSendCrossChainTransaction(transactions) {
		return window.near.requestSignTransactions({
			transactions,
		})
	}
}

export default new SenderWallet()
