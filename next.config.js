module.exports = {
	webpack: (config, { isServer }) => {
		// Fixes npm packages that depend on `fs` module
		if (!isServer) {
			config.node = {
				fs: 'empty',
			}
		}

		return config
	},
	env: {
		APP_ENV: process.env.APP_ENV,
		CONTRACT_NAME: process.env.CONTRACT_NAME,
		API_URL: process.env.API_URL
	},
}
