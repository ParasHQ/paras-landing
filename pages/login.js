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
		<div
			className="h-screen bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
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
			<div className="fixed">
				<Nav />
			</div>
			<div className="max-w-lg m-auto flex items-center justify-center h-full px-4">
				<div className=" w-full">
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
				</div>
			</div>
			<div className="fixed bottom-0 left-0 right-0">
				<Footer />
			</div>
		</div>
	)
}

export default LoginPage
