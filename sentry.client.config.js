// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
	dsn:
		process.env.NODE_ENV === 'production' && process.env.APP_ENV === 'production'
			? 'https://1148bd7ae2364e64bcf607d8bc4cca8a@o989538.ingest.sentry.io/5946256'
			: '',
	ignoreErrors: [
		'Network request failed',
		'Failed Coingecko',
		'Network Error',
		'Failed to redirect to sign transaction',
		'Request failed with status code 400',
		'Request aborted',
	],
	// Adjust this value in production, or use tracesSampler for greater control
	tracesSampleRate: 1.0,
	environment: process.env.APP_ENV,
	// ...
	// Note: if you want to override the automatic release value, do not set a
	// `release` value here - use the environment variable `SENTRY_RELEASE`, so
	// that it will also get attached to your source maps
})
