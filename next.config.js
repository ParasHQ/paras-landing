module.exports = {
	experimental: {
		scrollRestoration: true,
	},
	env: {
		APP_ENV: process.env.APP_ENV,
		CONTRACT_NAME: process.env.CONTRACT_NAME,
		BASE_URL: process.env.BASE_URL,
		API_URL: process.env.API_URL,
		V1_API_URL: process.env.V1_API_URL,
		V2_API_URL: process.env.V2_API_URL,
		MARKETPLACE_CONTRACT_ID: process.env.MARKETPLACE_CONTRACT_ID,
	},
}
