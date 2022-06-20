import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import near from 'lib/near'
import Nav from 'components/Nav'
import useStore from 'lib/store'
import Footer from 'components/Footer'
import { useIntl } from 'hooks/useIntl'
import Button from 'components/Common/Button'
import senderWallet from 'lib/senderWallet'
import { isChromeBrowser } from 'utils/common'
import { useToast } from 'hooks/useToast'
import { IconNear } from 'components/Icons'
import IconSender from 'components/Icons/component/IconSender'

const LoginPage = () => {
	const { currentUser, setActiveWallet } = useStore()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const { localeLn } = useIntl()

	useEffect(() => {
		if (currentUser) {
			router.replace('/market')
		}
	}, [currentUser])

	const _signIn = () => {
		setIsLoading(true)
		near.login()
	}

	const loginSenderWallet = async () => {
		if (typeof window.near !== 'undefined' && window.near.isSender) {
			await senderWallet.signIn()
			setActiveWallet('senderWallet')
		} else {
			toast.show({
				text: (
					<div className="text-sm text-gray-900 flex items-center gap-4">
						<div className="h-24 w-24 flex items-center justify-center">
							<IconSender size={81} />
						</div>
						<div>
							<p className="mb-2">{localeLn('Sender Wallet is not installed. Install here:')}</p>
							<Button size="sm" isFullWidth onClick={() => window.open('https://senderwallet.io/')}>
								Install
							</Button>
						</div>
					</div>
				),
				type: 'info',
				duration: null,
			})
		}
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
							<Button className="h-16" onClick={() => _signIn()} isFullWidth isDisabled={isLoading}>
								<IconNear className="rounded-full absolute h-8 w-8 top-0 bottom-0 left-4 m-auto" />
								{isLoading ? localeLn('LoadingLoading') : localeLn('LoginWithNEAR')}
							</Button>
						</div>
						{isChromeBrowser && (
							<div className="mt-4 hidden md:block">
								<Button className="h-16" variant="white" isFullWidth onClick={loginSenderWallet}>
									<div className="absolute h-8 w-8 top-0 bottom-0 left-4 m-auto flex items-center justify-center">
										<IconSender size={36} />
									</div>
									Login with Sender Wallet
									<span
										className="bg-white text-primary font-bold rounded-full px-3 text-sm absolute right-4"
										style={{ boxShadow: `rgb(83 97 255) 0px 0px 5px 1px` }}
									>
										beta
									</span>
								</Button>
							</div>
						)}
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
