import Document, { Html, Head, Main, NextScript } from 'next/document'
import { Fragment } from 'react'
import { GA_TRACKING_ID } from 'lib/gtag'
import { GTM_ID } from 'lib/gtm'

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx)
		const isProduction = process.env.NODE_ENV === 'production'

		return { ...initialProps, isProduction }
	}

	render() {
		return (
			<Html>
				<Head>
					<Fragment>
						{/* Global Site Tag (gtag.js) - Google Analytics */}
						<script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
						<script
							dangerouslySetInnerHTML={{
								__html: `
									window.dataLayer = window.dataLayer || [];
									function gtag(){dataLayer.push(arguments);}
									gtag('js', new Date());
								
									gtag('config', '${GA_TRACKING_ID}');
                  `,
							}}
						/>
					</Fragment>
				</Head>
				<body>
					<script>0</script>
					<noscript>
						<iframe
							src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
							height="0"
							width="0"
							style={{ display: 'none', visibility: 'hidden' }}
						/>
					</noscript>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
