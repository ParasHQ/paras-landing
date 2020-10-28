import getConfig from '../config/near'
import * as nearAPI from 'near-api-js'
import { Base64 } from 'js-base64'

class Near {
	constructor() {
		this.contract = {}
		this.currentUser = null
		this.config = {}
		this.wallet = {}
		this.signer = {}
	}

	async authToken() {
		const userId = near.currentUser.accountId
		const arr = new Array(userId)
		for (var i = 0; i < userId.length; i++) {
			arr[i] = userId.charCodeAt(i)
		}
		const msgBuf = new Uint8Array(arr)
		const signedMsg = await this.signer.signMessage(
			msgBuf,
			this.wallet._authData.accountId,
			this.wallet._networkId
		)
		const pubKey = Buffer.from(signedMsg.publicKey.data).toString('hex')
		const signature = Buffer.from(signedMsg.signature).toString('hex')
		const payload = [userId, pubKey, signature]
		return Base64.encode(payload.join('&'))
	}

	async signMessage(msg) {
		const arr = new Array(msg.length)
		for (var i = 0; i < msg.length; i++) {
			arr[i] = msg.charCodeAt(i)
		}
		const msgBuf = new Uint8Array(arr)
		const signedMsg = await this.signer.signMessage(
			msgBuf,
			this.wallet._authData.accountId,
			this.wallet._networkId
		)
		return {
			pubKey: Buffer.from(signedMsg.publicKey.data).toString('hex'),
			signature: Buffer.from(signedMsg.signature).toString('hex'),
		}
	}

	async init() {
		const nearConfig = getConfig(process.env.NODE_ENV || 'development')

		try {
			// Initializing connection to the NEAR DevNet
			const near = await nearAPI.connect({
				deps: {
					keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
				},
				...nearConfig,
			})

			// Needed to access wallet
			const wallet = new nearAPI.WalletConnection(near)

			// Load in account data
			let currentUser
			if (wallet.getAccountId()) {
				currentUser = {
					accountId: wallet.getAccountId(),
					balance: (await wallet.account().state()).amount,
				}
			}

			// Initializing our contract APIs by contract name and configuration
			const contract = await new nearAPI.Contract(
				wallet.account(),
				nearConfig.contractName,
				{
					changeMethods: ['buy', 'updateMarketData', 'deleteMarketData'],
					sender: wallet.getAccountId(),
				}
			)

			this.contract = contract
			this.currentUser = currentUser
			this.config = nearConfig
			this.wallet = wallet
      this.signer = new nearAPI.InMemorySigner(wallet._keyStore)

		} catch (err) {
			throw err
		}
	}
}

const near = new Near()

export default near
