import Axios from 'axios'
import Head from 'next/head'
import { useEffect } from 'react'
import CategoryList from 'components/CategoryList'
import Footer from 'components/Footer'
import Nav from 'components/Nav'
import useStore from 'lib/store'
import { useIntl } from 'hooks/useIntl'

const AllCategory = () => {
	const store = useStore()
	const { localeLn } = useIntl()
	useEffect(() => {
		getCategory()
	}, [])

	const getCategory = async () => {
		const res = await Axios(`${process.env.API_URL}/categories`)
		store.setCardCategory(res.data.data.results)
	}

	return (
		<div className="min-h-screen bg-black">
			<div
				className="fixed inset-0 opacity-50"
				style={{
					zIndex: 0,
					backgroundImage: `url('../bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			></div>
			<Head>
				<title>{localeLn('CategoryParas')}</title>
				<meta
					name="description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>

				<meta name="twitter:title" content="Market — Paras" />
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
				<meta property="og:title" content="Market — Paras" />
				<meta property="og:site_name" content="Market — Paras" />
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
			<div className="max-w-6xl relative m-auto py-12">
				<div className="flex justify-center mb-4">
					<h1 className="text-4xl font-bold text-gray-100 text-center">{localeLn('Market')}</h1>
				</div>
				<CategoryList listCategory={store.cardCategory} />
				<div className="md:flex justify-between mt-8 px-4">
					<CategoryDesc />
				</div>
			</div>
			<Footer />
		</div>
	)
}

const CategoryDesc = () => {
	const data = {
		_id: '60dc3827e25b5d4e44cfeb24',
		categoryId: 'characters',
		name: 'Characters',
		description:
			"Character design can be bold, subtle, intriguing, mysterious, unique, etc. We're talking about character here, show us yours!",
		curators: ['rng.testnet'],
		coverImg:
			'https://images.unsplash.com/photo-1520468164108-7f393c152c59?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80',
		isPinned: true,
		createdAt: 1624613707956,
	}
	return (
		<div className="text-gray-100 md:w-1/3">
			<img src={data.coverImg} />
			<div>{data.name}</div>
			<div>{data.description}</div>
		</div>
	)
}

export default AllCategory
