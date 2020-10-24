import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx)
		return { ...initialProps }
	}

	render() {
		return (
			<Html>
				<Head>
					<script
						async
						src="https://stat.paras.id/tracker.js"
						data-ackee-server="https://stat.paras.id"
						data-ackee-domain-id="a0e57436-7219-4936-a292-8d63a9a9b9e6"
					></script>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
