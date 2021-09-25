import * as Sentry from '@sentry/nextjs'

export const sentryCaptureException = (error, errorInfo) => {
	console.log(error)
	Sentry.captureException(error, {
		extra: errorInfo,
	})
}
