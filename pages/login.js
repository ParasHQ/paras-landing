import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Nav from 'components/Nav'
import useStore from 'lib/store'
import Footer from 'components/Footer'
import { useIntl } from 'hooks/useIntl'
import Button from 'components/Common/Button'
import { useWalletSelector } from 'components/Common/WalletSelector'

const LoginPage = () => {
	const { currentUser } = useStore()
	const router = useRouter()

	const { modal } = useWalletSelector()

	const { localeLn } = useIntl()

	useEffect(() => {
		if (currentUser) {
			router.replace('/market')
		}
	}, [currentUser])

	const _signIn = async () => {
		modal.show()
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
				<title>{localeLn('LoginParas')}</title>
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
			<div className="relative min-h-screen flex flex-col justify-between px-4">
				<div className="max-w-lg m-auto pt-16">
					<div className="w-full">
						<div className="flex items-center">
							<div>
								<div>
									<h3 className="text-4xl text-gray-100 font-bold">
										{localeLn('CreateAndCollect')}
									</h3>
									<h3 className="text-xl text-gray-300 font-semibold">
										{localeLn('StartJourneyCards')}
									</h3>
								</div>
							</div>
						</div>
						<div className="mt-4">
							<Button className="h-16" onClick={() => _signIn()} isFullWidth>
								Login Wallet
							</Button>
						</div>
						{/* Faucet balance is empty */}
						{/* <div className="mt-8 text-center">
							<a
								href="https://faucet.paras.id"
								target="_blank"
								className="text-gray-200 hover:text-white font-semibold border-b-2 cursor-pointer text-sm"
								rel="noreferrer"
							>
								{localeLn('CreateFreeNEARAccount')}
							</a>
						</div> */}
					</div>
				</div>
				<div className="-mx-4">
					<Footer />
				</div>
			</div>
		</div>
	)
}

export default LoginPage
