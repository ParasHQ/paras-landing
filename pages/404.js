import Head from 'next/head'
import Link from 'next/link'
import { useIntl } from 'hooks/useIntl'

const Custom404 = () => {
	const { localeLn } = useIntl()
	return (
		<div className="h-screen bg-black">
			<div
				className="fixed inset-0 opacity-75"
				style={{
					zIndex: 0,
					backgroundImage: `url('/bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			></div>
			<Head>
				<title>{localeLn('NotFoundParas')}</title>
				<meta name="description" content="We could not find what you were looking for on Paras." />

				<meta name="twitter:title" content="Not Found — Paras" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="We could not find what you were looking for on Paras."
				/>
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Not Found — Paras" />
				<meta property="og:site_name" content="Not Found — Paras" />
				<meta
					property="og:description"
					content="We could not find what you were looking for on Paras."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<div className="h-full w-full max-w-6xl m-auto relative">
				<div className="h-full w-full flex items-center justify-center">
					<div className="text-center">
						<div className="w-40 m-auto mt-8">
							<img src="/carddrop.png" className="opacity-75" />
						</div>
						<div className="mt-8">
							<div className="px-4">
								<h1 className="text-gray-100 mt-4 text-6xl">404</h1>
								<h4 className="text-lg text-gray-300">{localeLn('PageNotFound')}</h4>
								<div className="mt-16">
									<Link href="/market">
										<a className="flex items-center text-gray-100">
											<svg
												className="pr-2"
												width="24"
												height="24"
												viewBox="0 0 16 16"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													className="fill-current"
													fillRule="evenodd"
													clipRule="evenodd"
													d="M5.41412 7.00001H13.9999V9.00001H5.41412L8.70701 12.2929L7.2928 13.7071L1.58569 8.00001L7.2928 2.29291L8.70701 3.70712L5.41412 7.00001Z"
												/>
											</svg>
											<p>{localeLn('BackToMarket')}</p>
										</a>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Custom404
