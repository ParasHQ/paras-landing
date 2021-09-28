import Document, { Html, Head, Main, NextScript } from 'next/document'
import { Fragment } from 'react'
import { GA_TRACKING_ID } from '../lib/gtag'

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx)
		const isProduction = process.env.NODE_ENV === 'production'

		return { ...initialProps, isProduction }
	}

	render() {
		const { isProduction } = this.props

		return (
			<Html>
				<Head>
					{isProduction && (
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
					)}
				</Head>
				<body>
					<script>0</script>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
