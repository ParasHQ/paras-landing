import * as Sentry from '@sentry/nextjs'

export const sentryCaptureException = (error, errorInfo) => {
	Sentry.captureException(error, {
		extra: errorInfo,
	})
}
