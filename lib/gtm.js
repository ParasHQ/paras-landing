export const GTM_ID =
	process.env.NODE_ENV === 'production' ? process.env.GOOGLE_TAG_MANAGER_ID : 'GTM-NZN5CT6'

export const pageview = (url) => {
	window.dataLayer.push({
		event: 'pageview',
		page: url,
	})
}
