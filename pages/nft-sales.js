import { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Card from '../components/Card'
import { Blurhash } from 'react-blurhash'
import { parseImgUrl } from '../utils/common'

const tokenId = [
	'QmXyJEBuCHbpykhQHhcnmXr9CEi2PxLEU3Ufw9zUkCb84w',
	'QmUfnmSbK1iRTH1XjroSFRfTchPKxeiQ3vhQBQi4wY7RU5',
	'QmcWkp9qfjcyp6cDJJPXkVrhwKvsXYdyC3BeLz5u7cxVhR',
]

export default function Home() {
	const [email, setEmail] = useState('')

	return (
		<div
			className="min-h-screen relative bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Head>
				<title>Paras — Digital Art Cards Market</title>
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
			<div className="max-w-6xl m-auto">
				<div className="h-64 flex items-center justify-center">
					<h1 className="text-center text-white font-bold text-3xl object-center">
						NFT Sales
					</h1>
				</div>
				<h1 className="text-white mb-64">See details</h1>
			</div>
			<div className="flex justify-center space-x-8">
				<SpecialCard tokenId={tokenId[0]} />
				<SpecialCard tokenId={tokenId[1]} />
				<SpecialCard tokenId={tokenId[2]} />
			</div>
			<div className="max-w-2xl m-auto pt-16">
				<h1 className="text-center text-white font-bold text-3xl object-center mt-8">
					Benefits
				</h1>
				<h1 className="text-center text-white font-bold text-3xl object-center mt-8 mb-4">
					How to buy
				</h1>
				<p className="text-gray-100 mb-2">
					In order to buy your card(s), please ensure your wallet is connected
					and funded with enough ETH.
				</p>
				<ol className="text-gray-100 ml-2">
					<li>1. Click the "Buy" button on your desired card series</li>
					<li>
						2. Agree to the T&Cs Enter the amount of ETH you would like to spend
						purchasing cards of the selected series*
					</li>
					<li>
						3. Click buy & confirm the transaction in your wallet if needed You
						will be redirected to your wallet page with your purchased cards
						showing soon
					</li>
					<li>
						4. If you wish to purchase more cards, please go to the sale page
						through the top menu
					</li>
				</ol>
				<h1 className="text-center text-white font-bold text-3xl object-center mt-8">
					Timeline
				</h1>
			</div>
			<Footer />
		</div>
	)
}

const SpecialCard = ({ tokenId }) => {
	const [localToken, setLocalToken] = useState(null)

	useEffect(() => {
		fetchToken()
	}, [])

	const fetchToken = async () => {
		const res = await axios(`${process.env.API_URL}/tokens?tokenId=${tokenId}`)
		const token = (await res.data.data.results[0]) || null
		setLocalToken(token)
	}

	return (
		<div className="relative" style={{ width: '25rem' }}>
			<div className="absolute inset-0 m-auto overflow-hidden rounded-xl opacity-50">
				<Blurhash
					hash={
						localToken?.metadata.blurhash ||
						'UZ9ZtPzmpHv;R]ONJ6bKQ-l7Z.S_bow5$-nh'
					}
					width={`100%`}
					height={`100%`}
					className
					resolutionX={32}
					resolutionY={32}
					punch={1}
				/>
			</div>
			<div className="relative py-8 m-auto">
				<div className="static m-auto">
					<h1 className="text-white mb-8 text-3xl font-bold text-center">
						The Founders
					</h1>
					<div className="m-8">
						<div className="w-full m-auto">
							<Card
								imgUrl={parseImgUrl(localToken?.metadata.image)}
								imgBlur={localToken?.metadata.blurhash}
								token={{
									name: localToken?.metadata.name,
									collection: localToken?.metadata.collection,
									description: localToken?.metadata.description,
									creatorId: localToken?.creatorId,
									supply: localToken?.supply,
									tokenId: localToken?.tokenId,
									createdAt: localToken?.createdAt,
								}}
								initialRotate={{
									x: 0,
									y: 0,
								}}
							/>
						</div>
					</div>
					{/* <div className="flex justify-center items-center space-x-8"> */}
					<div className="text-center">
						<div>
							<p className="text-gray-400">Price</p>
							<p className="text-gray-100 mb-4 text-4xl font-bold">50 Ⓝ</p>
						</div>
						<div>
							<p className="text-gray-400">Card Supply</p>
							<p className="text-gray-100 mb-4 text-lg font-semibold">50 pcs</p>
							<p className="text-gray-400">Card Available</p>
							<p className="text-gray-100 mb-4 text-lg font-semibold">50/100</p>
						</div>
						{/* </div> */}
						<p className="text-gray-400">Chances & Benefit</p>
						<p className="text-gray-100 text-lg">
							Emmision/pcs: 166$ paras/week
						</p>
						<p className="text-gray-100 mb-12 text-lg">Period: 12-weeks</p>
						<div className="mx-8">
							<button
								// disabled
								className="w-full outline-none h-12 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-gray-200 bg-gray-200 text-primary"
							>
								Buy now
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
