import Head from 'next/head'
import Nav from 'components/Nav'
import Footer from 'components/Footer'
import { HomeTopUserList } from 'components/Home/HomeTopUserList'
import { HomeCardList } from 'components/Home/HomeCardList'
import { useIntl } from 'hooks/useIntl'
import HomeCollectionList from 'components/Home/HomeCollectionList'
import HomeFeaturedBanner from 'components/Home/HomeFeaturedBanner'
import HomeBanner from 'components/Home/HomeBanner'
import HomeAuctionList from 'components/Home/HomeAuctionList'
import HomeLaunchpad from 'components/Home/HomeLaunchpad'

export default function Home() {
	const { localeLn } = useIntl()

	return (
		<div className="min-h-screen relative bg-black">
			<Head>
				<title>{localeLn('Paras - NFT Marketplace for Digital Collectibles on NEAR')}</title>
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
			></div>
			<Nav />
			<div className="max-w-6xl m-auto">
				<div className="relative px-4 pb-24">
					<HomeFeaturedBanner />
					<HomeLaunchpad />
					<HomeCollectionList showDetails={false} />
					<HomeTopUserList showToggle={false} className="my-8" />
					<HomeAuctionList />
					<HomeBanner />
					<HomeCardList />
					<HomeTopUserList activeType="top-buyers" showToggle={false} className="mt-12" />
					<HomeTopUserList activeType="top-sellers" showToggle={false} className="mt-12" />
				</div>
			</div>

			<Footer />
		</div>
	)
}
