export const GA_TRACKING_ID = process.env.GA_TRACKING_ID
export const EXPERIMENT_ID = process.env.EXPERIMENT_ID
// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = ({ url, userId }) => {
	window.gtag('config', GA_TRACKING_ID, {
		page_path: url,
		...(userId && { user_id: userId }),
		is_login: userId ? 'logged-in' : 'non-login',
	})

	window.gtag('set', 'user_properties', {
		...(userId && { account_id: userId }),
		is_login: userId ? 'logged-in' : 'non-login',
	})
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value, additionalParams }) => {
	window.gtag('event', action, {
		event_category: category,
		event_label: label,
		value: value,
		...additionalParams,
	})
}
