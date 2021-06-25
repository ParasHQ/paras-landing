import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import near from '../lib/near'
import Nav from '../components/Nav'
import useStore from '../store'
import Footer from '../components/Footer'

const LoginPage = () => {
	const store = useStore()
	const router = useRouter()

	useEffect(() => {
		if (store.currentUser) {
			router.replace('/market')
		}
	}, [store.currentUser])

	const _signIn = async () => {
		const appTitle = 'Paras — Digital Art Cards Market'
		near.wallet.requestSignIn(near.config.contractName, appTitle)
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
				<title>Login — Paras</title>
				<meta
					name="description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>

				<meta name="twitter:title" content="Paras — Digital Art Cards Market" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Paras — Digital Art Cards Market" />
				<meta
					property="og:site_name"
					content="Paras — Digital Art Cards Market"
				/>
				<meta
					property="og:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<Nav />
			<div className="relative min-h-screen flex flex-col justify-between px-4 pb-24">
				<div className="max-w-lg m-auto pt-16">
					<div className="w-full">
						<div className="flex items-center">
							<div>
								<div>
									<h3 className="text-4xl text-gray-100 font-bold">
										Create and Collect
									</h3>
									<h3 className="text-xl text-gray-300 font-semibold">
										Start your journey with digital art cards on blockchain
									</h3>
								</div>
							</div>
						</div>
						<div className="mt-4">
							<button
								onClick={() => _signIn()}
								className="outline-none h-12 w-full mt-4 rounded-md bg-transparent font-semibold px-4 py-2 bg-primary text-gray-100 "
							>
								Login with NEAR
							</button>
						</div>
						<div className="mt-8 text-center">
							<a
								href="https://faucet.paras.id"
								target="_blank"
								className="text-gray-200 hover:text-white font-semibold border-b-2 cursor-pointer text-sm"
							>
								Create free NEAR account with Metamask
							</a>
						</div>
					</div>
				</div>
				<div className="mt-auto">
					<Footer />
				</div>
			</div>
		</div>
	)
}

export default LoginPage
