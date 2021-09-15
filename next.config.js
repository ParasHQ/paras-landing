// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require('@sentry/nextjs')

const moduleExports = {
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
		NFT_CONTRACT_ID: process.env.NFT_CONTRACT_ID,
	},
	async redirects() {
		return [
			{
				source: '/:id/collection',
				destination: '/:id/collectibles',
				permanent: true,
			},
		]
	},
}

const SentryWebpackPluginOptions = {
	// Additional config options for the Sentry Webpack plugin. Keep in mind that
	// the following options are set automatically, and overriding them is not
	// recommended:
	//   release, url, org, project, authToken, configFile, stripPrefix,
	//   urlPrefix, include, ignore

	silent: true, // Suppresses all logs
	// For all available options, see:
	// https://github.com/getsentry/sentry-webpack-plugin#options.
}

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions)
