import * as Sentry from '@sentry/nextjs'

export const sentryCaptureException = (error, errorInfo) => {
	// eslint-disable-next-line no-console
	console.log(error)
	Sentry.captureException(error, {
		extra: errorInfo,
	})
}
