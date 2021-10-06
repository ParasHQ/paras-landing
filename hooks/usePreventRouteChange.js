import { useEffect } from 'react'
import { useRouter } from 'next/router'

/**
 * Hook that listens to `next/router` `'routeChangeStart'` events and prevents changing
 * to a requested URL when `shouldPreventRouteChange` is `true`.
 *
 * @param {boolean} shouldPreventRouteChange Whether to prevent all Next.js route changes or not.
 * @param {Function} [onRouteChangePrevented] Callback function called when route change was prevented (optional).
 */
function usePreventRouteChangeIf(shouldPreventRouteChange, onRouteChangePrevented) {
	const router = useRouter()

	useEffect(() => {
		const routeChangeStart = (url) => {
			if (router.asPath !== url && shouldPreventRouteChange) {
				router.events.emit('routeChangeError')
				onRouteChangePrevented && onRouteChangePrevented(url)
				// Following is a hack-ish solution to abort a Next.js route change
				// as there's currently no official API to do so
				// See https://github.com/zeit/next.js/issues/2476#issuecomment-573460710
				// eslint-disable-next-line no-throw-literal
				throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`
			}
		}

		router.events.on('routeChangeStart', routeChangeStart)

		return () => {
			router.events.off('routeChangeStart', routeChangeStart)
		}
	}, [onRouteChangePrevented, router.asPath, router.events, shouldPreventRouteChange])
}

export default usePreventRouteChangeIf
