export const GTM_ID = process.env.GOOGLE_TAG_MANAGER_ID

export const pageview = (url) => {
	window.dataLayer.push({
		event: 'pageview',
		page: url,
	})
}
