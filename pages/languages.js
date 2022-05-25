import React from 'react'
import Head from 'next/head'
import Nav from 'components/Nav'
import Footer from 'components/Footer'
import { useIntl } from 'hooks/useIntl'
const LanguagesPage = () => {
	const { localeLn } = useIntl()

	const setLang = async (lang) => {
		localStorage.setItem('lang', lang)

		window.location.replace(window.location.origin + '/' + lang)
	}

	return (
		<div className="min-h-screen relative bg-black">
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
				<title>{localeLn('LanguagesParas')}</title>
				<meta
					name="description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>

				<meta
					name="twitter:title"
					content="Paras - NFT Marketplace for Digital Collectibles on NEAR"
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta
					property="og:title"
					content="Paras - NFT Marketplace for Digital Collectibles on NEAR"
				/>
				<meta
					property="og:site_name"
					content="Paras - NFT Marketplace for Digital Collectibles on NEAR"
				/>
				<meta
					property="og:description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<Nav />
			<div className="max-w-6xl min-h-full relative m-auto py-12">
				<h1 className="text-4xl font-bold text-gray-100 text-center">{localeLn('Languages')}</h1>
				<div className="mt-8">
					<p className="text-center text-xl text-gray-300">
						{localeLn('AvailableInFollowingLang')}
					</p>
				</div>
				<div className="mt-8">
					<div className="flex flex-wrap text-gray-100 px-24 py-4 justify-start">
						<div className="md:w-1/4 px-4 mb-12">
							<div>English</div>
							<div className="mt-2">
								<a
									onClick={() => setLang('')}
									className="underline text-2xl text-gray-100 font-bold pointer"
								>
									English
								</a>
							</div>
						</div>

						<div className="md:w-1/4 px-4 mb-12">
							<div>Simplified Chinese</div>
							<div className="mt-2">
								<a
									onClick={() => setLang('zh')}
									className="underline text-2xl text-gray-100 font-bold pointer"
								>
									简体中文
								</a>
							</div>
						</div>

						<div className="md:w-1/4 px-4 mb-12">
							<div>Spanish</div>
							<div className="mt-2">
								<a
									onClick={() => setLang('es')}
									className="underline text-2xl text-gray-100 font-bold pointer"
								>
									Español
								</a>
							</div>
						</div>

						<div className="md:w-1/4 px-4 mb-12">
							<div>Russian</div>
							<div className="mt-2">
								<a
									onClick={() => setLang('ru')}
									className="underline text-2xl text-gray-100 font-bold" /* href="/ru" */
								>
									Русский
								</a>
							</div>
						</div>

						<div className="md:w-1/4 px-4 mb-12">
							<div>French</div>
							<div className="mt-2">
								<a
									onClick={() => setLang('fr')}
									className="underline text-2xl text-gray-100 font-bold pointer"
								>
									Français
								</a>
							</div>
						</div>

						<div className="md:w-1/4 px-4 mb-12 opacity-50">
							<div>
								Korean <span className="text-xs">(Needs Contributors)</span>
							</div>
							<div className="mt-2">
								<a className="underline text-2xl text-gray-100 font-bold" /* href="/ko" */>
									한국어
								</a>
							</div>
						</div>

						<div className="md:w-1/4 px-4 mb-12 opacity-50">
							<div>
								Vietnamese <span className="text-xs">(Needs Contributors)</span>
							</div>
							<div className="mt-2">
								<a className="underline text-2xl text-gray-100 font-bold" /*  href="/vi" */>
									Tiếng Việt
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default LanguagesPage
