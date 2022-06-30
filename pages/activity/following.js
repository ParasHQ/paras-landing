import axios from 'axios'
// import { InputText } from 'components/Common/form'
// import ActivityUserFollow from 'components/Follow/ActivityUserFollow'
import RecommendationUserFollow from 'components/Follow/RecommendationUserFollow'
import Footer from 'components/Footer'
import Nav from 'components/Nav'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Following = () => {
	const [topUsers, setTopUsers] = useState()

	useEffect(() => {
		let ignore = false
		const fetchTopUsers = async () => {
			const res = await axios(`${process.env.V2_API_URL}/activities/top-users?__limit=8`)
			if (!ignore) {
				setTopUsers(res.data.data)
			}
		}
		fetchTopUsers()
		return () => {
			ignore = true
		}
	}, [])

	return (
		<div className="min-h-screen relative bg-black">
			<Head>
				<title>Following - Paras</title>
				<meta
					name="description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta
					name="keywords"
					content="paras, paras id, paras digital, nft, nft marketplace, near, near marketplace"
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

			<div
				className="fixed inset-0 opacity-75"
				style={{
					zIndex: 0,
					backgroundImage: `url('/bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			/>
			<Nav />
			<div className="max-w-6xl m-auto">
				<div className="relative px-4 pb-24">
					<div className="max-w-5xl m-auto py-12 md:flex md:flex-col">
						<div className="w-full relative">
							<p className="text-4xl font-bold text-gray-100 mb-8 md:mb-16 mr-2 capitalize">
								Following
							</p>
							<div className="flex items-center justify-center">
								<p className="text-gray-200 text-center font-bold mb-8 md:w-1/3">
									Follow at least total of artists to build your Following page...
								</p>
							</div>
							<div className="flex items-center justify-center">
								<div className="w-full mx-4 md:mx-0 md:w-2/3">
									<input
										placeholder="Search artist by their name or their collections"
										className="bg-transparent border-gray-600 border border-opacity-40 focus:bg-transparent text-white px-4 py-2.5 text-sm placeholder:text-gray-600"
									/>
								</div>
							</div>
						</div>

						{topUsers && (
							<div className="mt-8">
								<div className="flex justify-between items-end mb-2">
									<p className="text-white font-bold text-2xl">Top Seller</p>
									<Link href="/activity/top-sellers">
										<a className="text-gray-200 text-sm">See more</a>
									</Link>
								</div>
								<div className="w-full grid md:grid-cols-4 gap-4">
									{topUsers?.sellers?.map((user) => (
										<RecommendationUserFollow key={user.account_id} data={user} />
									))}
								</div>
							</div>
						)}

						{topUsers && (
							<div className="mt-8">
								<div className="flex justify-between items-end mb-2">
									<p className="text-white font-bold text-2xl">Top Buyer</p>
									<Link href="/activity/top-buyers">
										<a className="text-gray-200 text-sm">See more</a>
									</Link>
								</div>
								<div className="w-full grid md:grid-cols-4 gap-4">
									{topUsers?.buyers?.map((user) => (
										<RecommendationUserFollow key={user.account_id} data={user} />
									))}
								</div>
							</div>
						)}
						{/* <div className="mt-8 max-w-4xl w-full m-auto">
							<ActivityUserFollow />
						</div> */}
					</div>
				</div>
			</div>

			<Footer />
		</div>
	)
}

export default Following
