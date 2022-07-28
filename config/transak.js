import WalletHelper from 'lib/WalletHelper'

function getConfigTransak(env) {
	switch (env) {
		case 'staging':
			return {
				apiKey: `${process.env.TRANSAK_API_KEY}`,
				environment: 'STAGING',
				widgetWidth: `500px`,
				widgetHeight: `600px`,
				themeColor: `#1300BA`,
				hostURL: typeof window !== 'undefined' ? window.location.origin : ``,
				cryptoCurrencyCode: 'NEAR',
				walletAddress: WalletHelper.currentUser ? WalletHelper.currentUser.accountId : '',
			}
		case 'production':
			return {
				apiKey: `${process.env.TRANSAK_API_KEY}`,
				environment: 'PRODUCTION',
				widgetWidth: `500px`,
				widgetHeight: `600px`,
				themeColor: `#1300BA`,
				hostURL: typeof window !== 'undefined' ? window.location.origin : ``,
				cryptoCurrencyCode: 'NEAR',
				walletAddress: WalletHelper.currentUser ? WalletHelper.currentUser.accountId : '',
			}
		default:
			throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`)
	}
}

module.exports = getConfigTransak
