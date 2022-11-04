/* eslint-disable react/no-unescaped-entities */
import Head from 'next/head'
import Nav from 'components/Nav'
import Footer from 'components/Footer'
import Card from 'components/Card/Card'
import { parseImgUrl } from 'utils/common'
import useSWR from 'swr'
import axios from 'axios'
import { STAKE_PARAS_URL } from 'constants/common'
import { useEffect } from 'react'
import {
	trackViewLPLoyalty,
	trackClickBottomButtonLockedStaking,
	trackClickTopButtonLockedStaking,
} from 'lib/ga'
import LoyaltyMechanism from 'components/Loyalty/LoyaltyMechanism'
import LoyaltyLeaderboard from 'components/Loyalty/LoyaltyLeaderboard'
import LoyaltyFAQ from 'components/Loyalty/LoyaltyFAQ'
import LoyaltyTC from 'components/Loyalty/LoyaltyTC'

const url = `${process.env.V2_API_URL}/raffle/current`
const fetchData = () => axios.get(url).then((res) => res.data)

export default function Loyalty() {
	const { data } = useSWR('loyalty-raffle-data', fetchData, {
		revalidateOnFocus: false,
		revalidateIfStale: false,
		revalidateOnReconnect: false,
	})

	useEffect(() => {
		trackViewLPLoyalty()
	}, [])

	return (
		<div className="min-h-screen relative bg-black">
			<Head>
				<title>Paras Loyalty</title>
				<meta
					name="description"
					content="To appreciate our users, we will launch a new program, Paras Loyalty, on September 5, at 1 PM UTC. This program will give you exclusive access to limited raffles 🔥🔥"
				/>
				<meta
					name="keywords"
					content="paras, paras id, paras digital, nft, nft marketplace, near, near marketplace"
				/>

				<meta name="twitter:title" content="Paras Loyalty" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="To appreciate our users, we will launch a new program, Paras Loyalty, on September 5, at 1 PM UTC. This program will give you exclusive access to limited raffles 🔥🔥"
				/>
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Paras Loyalty" />
				<meta property="og:site_name" content="Paras Loyalty" />
				<meta
					property="og:description"
					content="To appreciate our users, we will launch a new program, Paras Loyalty, on September 5, at 1 PM UTC. This program will give you exclusive access to limited raffles 🔥🔥"
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
				<div className="relative md:mx-4 md:my-12 bg-[#20124D]">
					<div
						className="py-4 md:py-12 relative"
						style={{ background: 'linear-gradient(180deg, #4E29AA 0%, #20124D 100%)' }}
					>
						<img
							src="https://paras-cdn.imgix.net/bafybeiamb47hdmkix7sn3yqdttbdryat2xaql3e25uj3nlhgi2a2tqnahe"
							className="absolute top-10 left-0 h-full"
						/>
						<img
							src="https://paras-cdn.imgix.net/bafkreihphetd3lgmjqrxd5ngaxpos3mm6rswsacgwxrlybtfuxzumzlbxy"
							className="absolute top-0 right-0 bottom-0 h-full"
						/>
						<img
							className="w-1/2 mx-auto"
							src="https://paras-cdn.imgix.net/bafkreigxmtjfl6nsvb6ycpx3zvkdgqhtebbrq5ukf3lwyiigyycxhni6rq"
						/>
						<div className="flex items-center justify-center">
							<p className="text-[#20124D] font-bold text:xl md:text-2xl bg-[#F1C232] px-8 py-4 m-4 rounded-md text-center">
								Join Paras Loyalty & Get Excellent Rewards!
							</p>
						</div>
					</div>

					<div className="bg-[#20124D] text-center py-8">
						<p className="text-white font-bold text-2xl mb-2">What is Paras Loyalty?</p>
						<p className="text-gray-200 text-xl px-4 md:w-2/3 m-auto">
							It is a special program created to appreciate $PARAS stakers by giving exclusive
							access to limited raffles.
						</p>
						{/* eslint-disable-next-line react/jsx-no-target-blank */}
						<a
							href={STAKE_PARAS_URL}
							target={'_blank'}
							onClick={trackClickTopButtonLockedStaking}
							className="inline-block p-3 bg-white text-primary font-bold border-[0.5rem] mt-4 border-primary rounded-xl text-xl"
						>
							Start Locked Staking
						</a>
					</div>

					{/* Rewards */}
					<div className="m-4 md:m-6 bg-white pb-8 rounded-xl">
						<div>
							<p className="font-bold text-center text-2xl text-white py-4 bg-[#674EA7] rounded-xl">
								November's Rewards
							</p>
						</div>
						<div className="my-8">
							<p className="loyalty-mechanism-text text-center mx-4 md:mx-16 mb-8">Tokens</p>
							<div className="w-28 h-28 md:h-44 md:w-44 rounded-md m-auto">
								<img
									className="h-full w-full object-cover"
									src="https://paras-cdn.imgix.net/bafkreigijfnsv2hdwwwaxdtxveq75kmlijgt4baxk2dmocbjwuajjgitcy"
								/>
							</div>
							<p className="font-bold py-4 text-center md:text-xl">12,222 $PARAS</p>
						</div>
						<div className="my-8">
							<p className="loyalty-mechanism-text text-center mx-4 md:mx-16">
								NFTs from Paras Top 10 Collections
							</p>
							<RewardNFT data={data?.raffle.reward.nft.platinum} level="Platinum" />
							<RewardNFT data={data?.raffle.reward.nft.gold} level="Gold" />
							<RewardNFT data={data?.raffle.reward.nft.silver} level="Silver" />
						</div>
						<div className="my-8">
							<p className="loyalty-mechanism-text text-center mx-4 md:mx-16">
								NFTs from New Collections
							</p>
							{/* <p className="font-bold py-16 text-center text-xl">Coming Soon</p> */}
							<div className="my-8 flex items-center justify-center md:space-x-8 mx-4 md:mx-28 flex-wrap">
								{data?.raffle.reward.wl_spot.map?.((nft) => (
									<div className="w-1/2 md:w-1/4 mb-6 p-2" key={nft.name}>
										<div className="w-28 h-28 md:h-44 md:w-44 rounded-md border-4 border-[#20124D] m-auto">
											<a href={nft.link} target="_blank" rel="noreferrer">
												<img className="h-full w-full object-cover" src={parseImgUrl(nft.media)} />
											</a>
										</div>
										<p className="font-bold py-4 text-center md:text-xl">{nft.name}</p>
									</div>
								))}
							</div>
						</div>
					</div>

					<LoyaltyLeaderboard raffleId={data?.raffle._id} />

					{/* Mechanism */}
					<LoyaltyMechanism />

					<div className="py-16 text-center">
						<p className="text-white text-2xl">Join Paras Loyalty & Grab Your Rewards!</p>
						{/* eslint-disable-next-line react/jsx-no-target-blank */}
						<a
							href={STAKE_PARAS_URL}
							target="_blank"
							onClick={trackClickBottomButtonLockedStaking}
							className="inline-block p-3 bg-white text-primary font-bold border-[0.5rem] mt-4 border-primary rounded-xl text-xl"
						>
							Start Locked Staking
						</a>
					</div>
					<div className="bg-white">
						<div className="md:w-2/3 m-auto">
							<LoyaltyFAQ />
							<div className="px-8 md:px-16 bg-white">
								<hr className="border-dashed" />
							</div>
							<LoyaltyTC />
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	)
}

const RewardNFT = ({ data, level }) => {
	if (!data || !data.length) return null

	return (
		<>
			<p className="font-bold mt-6 text-center text-xl">{level}</p>
			<div className="flex flex-wrap items-center justify-center md:mx-16 my-4">
				{data?.map(({ token }) => {
					if (!token) return null
					return (
						<div key={token._id} className="w-1/2 md:w-1/4 p-1 md:p-2">
							<div className="bg-black rounded-xl overflow-hidden">
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
						</div>
					)
				})}
			</div>
		</>
	)
}
