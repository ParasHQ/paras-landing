export const loadDynamicWombiScript = (callback) => {
	const existingScript = document.getElementById('scriptId')

	if (!existingScript) {
		const script = document.createElement('script')
		script.src = 'https://web-sdk-js.wombi.xyz/wombi-analytics.min.js'
		script.id = 'wombiAnalytics'
		document.body.appendChild(script)

		script.onload = () => {
			// eslint-disable-next-line no-undef
			var WA = new WombiAnalytics()
			WA.init(process.env.WOMBI_ANALYTICS)
			if (callback) callback(WA)
		}
	}

	if (existingScript && callback) callback()
}
