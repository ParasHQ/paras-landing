import { useState } from 'react'
import Head from 'next/head'
import Nav from 'components/Nav'
import Footer from 'components/Footer'
import Modal from 'components/Modal'
import YouTube from 'react-youtube'
import { HomeTopUserList } from 'components/Home/HomeTopUserList'
import { HomeCardList } from 'components/Home/HomeCardList'
import { useIntl } from 'hooks/useIntl'
import HomeCollectionList from 'components/Home/HomeCollectionList'
import HomeFeaturedBanner from 'components/Home/HomeFeaturedBanner'
import HomeBanner from 'components/Home/HomeBanner'

export default function Home() {
	const [showVideoModal, setShowVideoModal] = useState(false)

	const { localeLn } = useIntl()

	return (
		<div className="min-h-screen relative bg-black">
			<Head>
				<title>{localeLn('Paras - NFT Marketplace for Digital Collectibles')}</title>
				<meta
					name="description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta
					name="keywords"
					content="paras, paras id, paras digital, nft, nft marketplace, near, near marketplace"
				/>

				<meta name="twitter:title" content="Paras - NFT Marketplace for Digital Collectibles" />
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
				<meta property="og:title" content="Paras - NFT Marketplace for Digital Collectibles" />
				<meta property="og:site_name" content="Paras - NFT Marketplace for Digital Collectibles" />
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
			{showVideoModal && (
				<Modal close={() => setShowVideoModal(false)}>
					<div className="max-w-3xl w-full mx-auto p-4 relative">
						<div className="absolute z-10 top-0 right-0">
							<div
								className="bg-gray-300 p-2 rounded-full cursor-pointer"
								onClick={() => setShowVideoModal(false)}
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M8.00008 9.41423L3.70718 13.7071L2.29297 12.2929L6.58586 8.00001L2.29297 3.70712L3.70718 2.29291L8.00008 6.5858L12.293 2.29291L13.7072 3.70712L9.41429 8.00001L13.7072 12.2929L12.293 13.7071L8.00008 9.41423Z"
										fill="black"
									/>
								</svg>
							</div>
						</div>
						<YouTube
							containerClassName="youtube-container"
							className="rounded-lg"
							videoId="keW4k5pF4MA"
							opts={{
								playerVars: {
									autoplay: 1,
								},
							}}
						/>
					</div>
				</Modal>
			)}
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
					{/* <HomeCollectionList /> */}
					<HomeTopUserList showToggle={false} />
					<HomeCollectionList showDetails={false} />
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
