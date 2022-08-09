/* eslint-disable react/no-unescaped-entities */
import Head from 'next/head'
import Nav from 'components/Nav'
import Footer from 'components/Footer'
import Card from 'components/Card/Card'
import { parseImgUrl } from 'utils/common'
import useSWR from 'swr'
import axios from 'axios'

const url = `https://api-v2-mainnet.paras.id/token-series?exclude_total_burn=true&__sort=updated_at::-1&__limit=6&is_verified=true&lookup_token=true`
const fetchData = () => axios.get(url).then((res) => res.data.data.results)

export default function Loyalty() {
	const { data } = useSWR('token-dummy', fetchData, {
		revalidateOnFocus: false,
		revalidateIfStale: false,
		revalidateOnReconnect: false,
	})

	return (
		<div className="min-h-screen relative bg-black">
			<Head>
				<title>Loyalty — Paras</title>
				<meta
					name="description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta
					name="keywords"
					content="paras, paras id, paras digital, nft, nft marketplace, near, near marketplace"
				/>

				<meta name="twitter:title" content="Loyalty — Paras" />
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
				<meta property="og:title" content="Loyalty — Paras" />
				<meta property="og:site_name" content="Loyalty — Paras" />
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
				<div className="relative mx-4 my-12 bg-[#20124D]">
					<div
						className="py-12"
						style={{ background: 'linear-gradient(180deg, #4E29AA 0%, #20124D 100%)' }}
					>
						<img
							className="w-1/2 mx-auto"
							src="https://paras-cdn.imgix.net/bafkreigxmtjfl6nsvb6ycpx3zvkdgqhtebbrq5ukf3lwyiigyycxhni6rq"
						/>
						<div className="flex items-center justify-center">
							<p className="text-[#20124D] font-bold text-2xl bg-[#F1C232] px-8 py-4 rounded-md">
								Join Paras Loyalty & Get Excellent Rewards!
							</p>
						</div>
					</div>

					<div className="bg-[#20124D] text-center py-8">
						<p className="text-white font-bold text-2xl mb-2">What is Paras Loyalty?</p>
						<p className="text-gray-200 text-xl w-2/3 m-auto">
							It is a special program created to appreciate $PARAS stakers by giving exclusive
							access to limited raffles.
						</p>
					</div>

					{/* Rewards */}
					<div className="m-6 bg-white pb-8 rounded-xl">
						<div>
							<p className="font-bold text-center text-2xl text-white py-4 bg-[#674EA7] rounded-xl">
								September's Rewards
							</p>
						</div>
						<div className="my-8">
							<p className="loyalty-mechanism-text text-center mx-16">
								NFTs from Paras Top 10 Collections
							</p>
							<div className="grid grid-cols-3 md:mx-32 my-4">
								{data?.map((token) => (
									<div key={token._id} className="bg-black m-2 rounded-xl overflow-hidden">
										<div className="w-full p-2 bg-black border-4 border-[#351C75] rounded-xl">
											<div>
												<Card
													key={token._id}
													imgUrl={parseImgUrl(token.metadata.media, null, {
														width: `600`,
														useOriginal: process.env.APP_ENV === 'production' ? false : true,
														isMediaCdn: token.isMediaCdn,
													})}
													audioUrl={
														token.metadata.mime_type &&
														token.metadata.mime_type.includes('audio') &&
														token.metadata.animation_url
													}
													threeDUrl={
														token.metadata.mime_type &&
														token.metadata.mime_type.includes('model') &&
														token.metadata.animation_url
													}
													iframeUrl={
														token.metadata.mime_type &&
														token.metadata.mime_type.includes('iframe') &&
														token.metadata.animation_url
													}
													imgBlur={token.metadata.blurhash}
													flippable
													token={{
														title: token.metadata.title,
														collection: token.metadata.collection || token.contract_id,
														copies: token.metadata.copies,
														creatorId: token.metadata.creator_id || token.contract_id,
														is_creator: token.is_creator,
														description: token.metadata.description,
														royalty: token.royalty,
														attributes: token.metadata.attributes,
														_is_the_reference_merged: token._is_the_reference_merged,
														mime_type: token.metadata.mime_type,
														is_auction: token.token?.is_auction,
														started_at: token.token?.started_at,
														ended_at: token.token?.ended_at,
														has_auction: token?.has_auction,
														animation_url: token?.metadata?.animation_url,
													}}
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
						<div className="my-8">
							<p className="loyalty-mechanism-text text-center mx-16">
								WL Spots & Free NFTs from New & Upcoming Projects
							</p>
						</div>
					</div>

					{/* Mechanism */}
					<div className="m-6 mt-16 bg-white pb-8 rounded-xl">
						<div>
							<p className="font-bold text-center text-2xl text-white py-4 bg-[#674EA7] rounded-xl">
								Loyalty Program Mechanism
							</p>
						</div>

						<div className="mx-16 my-6">
							<div className="my-6">
								<div className="flex">
									<p className="loyalty-mechanism-number">1</p>
									<p className="loyalty-mechanism-text">
										Loyalty level will be fetermined based on the amount of $PARAS locked.
									</p>
								</div>
								<div className="text-center my-4">
									<div>
										<img
											className="my-12 mx-auto"
											src="https://paras-cdn.imgix.net/bafkreigc23upnrqg6agxp5txv2xdqnwntngmmqv47vyixksyrvj4vvtoz4"
										/>
									</div>
									<p>
										Users who stake $PARAS without locking it will be considered as Bronze level.
									</p>
									<p>
										Learn more on how to do locked staking{' '}
										<a href="https://stake.paras.id" className="text-blue-700 underline">
											here
										</a>
										.
									</p>
								</div>
							</div>

							<div className="my-6">
								<div className="flex">
									<p className="loyalty-mechanism-number">2</p>
									<p className="loyalty-mechanism-text">
										On the 15th-18th day of every month, Silver, Gold, and Platinum members will
										have a chance to sign up and enter exclusive raffle.
									</p>
								</div>
								<div>
									<div className="text-center my-4">
										<img
											className="m-auto my-4"
											src="https://paras-cdn.imgix.net/bafkreigigsme75p5tnvvotbq3p5wgpq4vxtcgxucvpds32qyvkvg5dy5wa"
										/>
										<p>
											Silver, Gold, Platinum members can log in to{' '}
											<span>
												<a href="https://paras.id" className="text-blue-700 underline">
													Paras Marketplace
												</a>
											</span>
											, and sign up to the exclusive raffle through a whitelisted pop up banner that
											will appear on the home screen.
										</p>
									</div>
									<div className="text-center my-4">
										<img
											className="m-auto my-4"
											src="https://paras-cdn.imgix.net/bafkreihj2n5wlj2xuj7f45tx7mj4ybdhuz5pgm7gwgjtt65rpjgebn4g2e"
										/>
										<p>
											If you are a Silver, Gold, or Platinum member, and you can't find the pop up
											banner, you can check your notification box, look for the raffle announcement,
											and click 'Sign Up' to join the exclusive raffle.
										</p>
									</div>
								</div>
							</div>

							<div className="my-6">
								<div className="flex">
									<p className="loyalty-mechanism-number">3</p>
									<p className="loyalty-mechanism-text">
										All Silver, Gold, and Platinum members who has signed up for the raffle will be
										put into separate raffle pools.
									</p>
								</div>
								<div className="flex justify-center items-center mt-8">
									<img src="https://paras-cdn.imgix.net/bafkreihnolfcz3uxsw67bhfdq4hilg4axsqhzp5jirgz5iel5fyurnq5vi" />
									<img src="https://paras-cdn.imgix.net/bafkreiecmt6ab5az2yqfwn4au6o2xikuxphv2n5akvfrdpskmd5qosz7mi" />
									<img src="https://paras-cdn.imgix.net/bafkreib5somhf4ht7d4ygnon6tgls45ytxharnod7k3yldhxdvw2axnps4" />
								</div>
							</div>
							<div>
								<div className="flex">
									<p className="loyalty-mechanism-number">4</p>
									<p className="loyalty-mechanism-text">
										Each raffle pool will have different rewards.
									</p>
								</div>
								<div>
									<img
										className="my-12 mx-auto"
										src="https://paras-cdn.imgix.net/bafkreifu5bjpwp2n2pesjangyhc4h4q7prkmms2yal7o5zphh57ekl3gsi"
									/>
								</div>
							</div>

							<div className="my-6">
								<div className="flex">
									<p className="loyalty-mechanism-number">5</p>
									<p className="loyalty-mechanism-text">
										The monthly raffle period will be held as follows:
									</p>
								</div>
								<div>
									<img
										className="my-12 mx-auto"
										src="https://paras-cdn.imgix.net/bafkreiee7nrub2itrxlhz5mamvsnxdnr4izqt2dhytadiy435ssbep3c6m"
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="py-16 text-center">
						<p className="text-white text-2xl">Join Paras Loyalty & Grab Your Rewards!</p>
						<a
							href="https://stake.paras.id"
							className="inline-block p-3 bg-white text-primary font-bold border-[0.5rem] mt-4 border-primary rounded-xl text-xl"
						>
							Start Locked Staking
						</a>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	)
}
