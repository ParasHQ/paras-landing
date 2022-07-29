export const GTM_ID =
	process.env.NODE_ENV === 'production'
		? process.env.GOOGLE_TAG_MANAGER_ID
		: process.env.GOOGLE_TAG_MANAGER_ID_DEV

export const pageview = (url) => {
	window.dataLayer.push({
		event: 'pageview',
		page: url,
	})
}
