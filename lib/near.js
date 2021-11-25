import getConfig from '../config/near'
import * as nearAPI from 'near-api-js'
import { Base64 } from 'js-base64'
import { sentryCaptureException } from './sentry'

class Near {
	constructor() {
		this.currentUser = null
		this.config = {}
		this.wallet = {}
		this.signer = {}
	}

	async authToken() {
		if (!this.currentUser) {
			return null
		}

		try {
			const accountId = this.currentUser.accountId
			const arr = new Array(accountId)
			for (var i = 0; i < accountId.length; i++) {
				arr[i] = accountId.charCodeAt(i)
			}
			const msgBuf = new Uint8Array(arr)
			const signedMsg = await this.signer.signMessage(
				msgBuf,
				this.wallet._authData.accountId,
				this.wallet._networkId
			)
			const pubKey = Buffer.from(signedMsg.publicKey.data).toString('hex')
			const signature = Buffer.from(signedMsg.signature).toString('hex')
			const payload = [accountId, pubKey, signature]
			return Base64.encode(payload.join('&'))
		} catch (err) {
			sentryCaptureException(err)
			return null
		}
	}

	async init() {
		const nearConfig = getConfig(process.env.APP_ENV || 'development')

		try {
			const urlSearchParams = new URLSearchParams(window.location.search)
			const { successLogin } = Object.fromEntries(urlSearchParams.entries())

			const near = await nearAPI.connect({
				deps: {
					keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
				},
				...nearConfig,
			})

			if (successLogin) {
				localStorage.setItem('ACTIVE_ACCOUNT', successLogin)
			}

			// Needed to access wallet
			const appKeyPrefix = `paras-v2-${successLogin || localStorage.getItem('ACTIVE_ACCOUNT') || 0}`
			const wallet = new nearAPI.WalletConnection(near, appKeyPrefix)
			this.wallet = wallet

			// Load in account data
			let currentUser
			if (wallet.getAccountId()) {
				currentUser = {
					accountId: wallet.getAccountId(),
					balance: await wallet.account().getAccountBalance(),
				}
			}

			this.currentUser = currentUser
			this.config = nearConfig
			this.signer = new nearAPI.InMemorySigner(wallet._keyStore)
		} catch (err) {
			sentryCaptureException(err)
			throw err
		}
	}

	login() {
		if (this.getConnectedAccount().length === 3) {
			return
		}

		const appTitle = 'Paras — Digital Art Cards Market'
		this.wallet.requestSignIn(
			process.env.MARKETPLACE_CONTRACT_ID,
			appTitle,
			`${process.env.BASE_URL}?successLogin=${new Date().getTime()}`
		)
	}

	logout() {
		this.wallet.signOut()
		const authAccId = this.getConnectedAuthAccountID()
		localStorage.setItem('ACTIVE_ACCOUNT', authAccId[0])

		window.location.replace(window.location.origin + window.location.pathname)
	}

	getConnectedAccount = () => {
		const loggedInAcc = Object.entries({ ...localStorage })
			.filter((authkey) => authkey[0].includes('wallet_auth_key'))
			.map((authkey) => JSON.parse(authkey[1]).accountId)

		return loggedInAcc
	}

	getConnectedAuthAccountID = () => {
		const loggedInAuthAccId = Object.entries({ ...localStorage })
			.filter((authkey) => authkey[0].includes('_wallet_auth_key'))
			.map((authkey) => authkey[0].replace('_wallet_auth_key', '').replace('paras-v2-', ''))

		return loggedInAuthAccId
	}
}

const near = new Near()

export default near
