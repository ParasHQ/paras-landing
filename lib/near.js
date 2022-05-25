import getConfig from '../config/near'
import * as nearAPI from 'near-api-js'
import { Base64 } from 'js-base64'
import { sentryCaptureException } from './sentry'
import queryString from 'query-string'
import { base_decode } from 'near-api-js/lib/utils/serialize'
import { PublicKey } from 'near-api-js/lib/utils'
import { createTransaction, functionCall } from 'near-api-js/lib/transaction'
import { GAS_FEE } from 'config/constants'
import { removeSenderWalletLocalStorage } from './senderWallet'

class Near {
	constructor() {
		this.currentUser = null
		this.config = {}
		this.wallet = {}
		this.signer = {}
		this.near = {}
		this._authToken = null
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
			this._authToken = Base64.encode(payload.join('&'))
			return this._authToken
		} catch (err) {
			sentryCaptureException(err)
			if (err?.message?.includes(' not found in ')) this.logout()
			return null
		}
	}

	async init() {
		const nearConfig = getConfig(process.env.APP_ENV || 'development')

		try {
			const urlSearchParams = queryString.parse(window.location.search)
			const { successLogin, account_id } = urlSearchParams

			const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore()
			const near = await nearAPI.connect({
				deps: {
					keyStore,
				},
				...nearConfig,
			})

			let idLogin
			const connectedAcc = this.getAccountAndKey()
			const haveNotLogin = connectedAcc.every((acc) => acc.accountId !== account_id)

			if (successLogin && haveNotLogin) {
				localStorage.setItem('ACTIVE_ACCOUNT', successLogin)
				idLogin = successLogin
			} else if (!haveNotLogin && account_id) {
				const { key } = connectedAcc.filter((acc) => acc.accountId === account_id)[0]
				localStorage.setItem('ACTIVE_ACCOUNT', key)
				idLogin = key
			}

			// Needed to access wallet
			const appKeyPrefix = `paras-v2-${idLogin || localStorage.getItem('ACTIVE_ACCOUNT') || 0}`
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

			this.near = near
			this.currentUser = currentUser
			this.config = nearConfig
			this.signer = new nearAPI.InMemorySigner(wallet._keyStore)
			this.authToken()
		} catch (err) {
			sentryCaptureException(err)
			throw err
		}
	}

	async login() {
		if (this.getAccountAndKey().length === 3) {
			return
		}

		if (!this.wallet.requestSignIn) {
			await this.init()
		}
		removeSenderWalletLocalStorage()

		const url = new URL(window.location.href)
		url.searchParams.set('successLogin', new Date().getTime())

		const appTitle = 'Paras - NFT Marketplace for Digital Collectibles on NEAR'
		this.wallet.requestSignIn(process.env.MARKETPLACE_CONTRACT_ID, appTitle, url.href)
	}

	logout() {
		this.wallet.signOut()
		const authAccId = this.getAccountAndKey()
		localStorage.setItem('ACTIVE_ACCOUNT', authAccId[0]?.key)

		window.location.replace(window.location.origin + window.location.pathname)
	}

	getAccountAndKey = () => {
		const accountAndKey = Object.entries({ ...localStorage })
			.filter(
				(authkey) => authkey[0].includes('wallet_auth_key') && authkey[0].includes('paras-v2')
			)
			.map((authkey) => ({
				key: authkey[0].replace('_wallet_auth_key', '').replace('paras-v2-', ''),
				accountId: JSON.parse(authkey[1]).accountId,
			}))
		return accountAndKey
	}

	switchAccount = (key) => {
		localStorage.setItem('ACTIVE_ACCOUNT', key)
		window.location.replace(window.location.origin + window.location.pathname)
	}

	callFunction({ methodName, args = {}, gas = GAS_FEE, deposit, contractId }) {
		return this.wallet.account().functionCall({
			contractId,
			methodName,
			attachedDeposit: deposit,
			gas,
			args,
		})
	}

	viewFunction({ methodName, args, contractId }) {
		return this.wallet.account().viewFunction(contractId, methodName, args)
	}

	signAndSendTransactions({ receiverId, actions }) {
		return this.wallet.account().signAndSendTransaction({ receiverId, actions })
	}

	async getTransactionStatus({ txHash, accountId }) {
		try {
			const result = await this.near.connection.provider.txStatus(txHash, accountId)
			return result
		} catch (error) {
			return null
		}
	}

	async createTransaction({ receiverId, actions, nonceOffset = 1 }) {
		const localKey = await this.near.connection.signer.getPublicKey(
			this.wallet.account().accountId,
			this.near.connection.networkId
		)
		const accessKey = await this.wallet
			.account()
			.accessKeyForTransaction(receiverId, actions, localKey)
		if (!accessKey) {
			throw new Error(`Cannot find matching key for transaction sent to ${receiverId}`)
		}

		const block = await this.near.connection.provider.block({ finality: 'final' })
		const blockHash = base_decode(block.header.hash)
		const publicKey = PublicKey.from(accessKey.public_key)
		const nonce = accessKey.access_key.nonce + nonceOffset

		return createTransaction(
			this.wallet.account().accountId,
			publicKey,
			receiverId,
			nonce,
			actions,
			blockHash
		)
	}

	async executeMultipleTransactions(transactions, callbackUrl) {
		const nearTransactions = await Promise.all(
			transactions.map((tx, i) =>
				this.createTransaction({
					receiverId: tx.receiverId,
					nonceOffset: i + 1,
					actions: tx.functionCalls.map((fc) =>
						functionCall(fc.methodName, fc.args, fc.gas, fc.attachedDeposit)
					),
				})
			)
		)

		return this.wallet.requestSignTransactions({
			transactions: nearTransactions,
			callbackUrl: callbackUrl,
		})
	}
}

const near = new Near()

export default near
