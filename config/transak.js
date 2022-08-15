function getConfigTransak(env, accountId) {
	switch (env) {
		case 'staging':
			return {
				apiKey: `${process.env.TRANSAK_API_KEY}`,
				environment: 'STAGING',
				widgetWidth: `500px`,
				widgetHeight: `600px`,
				themeColor: `#1300BA`,
				hostURL: typeof window !== 'undefined' ? window.location.origin : ``,
				defaultCryptoCurrency: 'NEAR',
				walletAddress: accountId || '',
			}
		case 'production':
			return {
				apiKey: `${process.env.TRANSAK_API_KEY}`,
				environment: 'PRODUCTION',
				widgetWidth: `500px`,
				widgetHeight: `600px`,
				themeColor: `#1300BA`,
				hostURL: typeof window !== 'undefined' ? window.location.origin : ``,
				defaultCryptoCurrency: 'NEAR',
				walletAddress: accountId || '',
			}
		default:
			throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`)
	}
}

module.exports = getConfigTransak
