import Head from 'next/head'
import Nav from 'components/Nav'
import Footer from 'components/Footer'
import { useIntl } from 'hooks/useIntl'
import Button from 'components/Common/Button'
import { useEffect, useState } from 'react'
import cachios from 'cachios'
import { getRandomInt, prettyBalance } from 'utils/common'
import { CURRENT_SUPPLY } from 'constants/token'
import useStore from 'lib/store'
import near from 'lib/near'
import JSBI from 'jsbi'
import AnimatedNumber from 'react-awesome-animated-number'
import 'react-awesome-animated-number/dist/index.css'
import { sentryCaptureException } from 'lib/sentry'
import { IconShare } from 'components/Icons'

export default function Home() {
	const store = useStore()
	const [apr, setAPR] = useState(getRandomInt(10, 100))
	const [curPrice, setCurPrice] = useState(Math.random())
	const [curSupply, setCurSupply] = useState(getRandomInt(10000000, 50000000))
	const [curMarketCap, setCurMarket] = useState(getRandomInt(10000000, 50000000))
	const [totalSupply, setTotalSupply] = useState(getRandomInt(10000000, 50000000))
	const { localeLn } = useIntl()

	useEffect(() => {
		const getFarms = async () => {
			try {
				const poolList = await near.wallet
					.account()
					.viewFunction(process.env.FARM_CONTRACT_ID, `list_seeds_info`, {
						from_index: 0,
						limit: 1,
					})

				const data = poolList[process.env.PARAS_TOKEN_CONTRACT]

				const parasPrice = await getParasPrice()
				const parasPriceInDecimal = parasPrice / 10 ** 18

				const nearPrice = await getNearPrice()
				const nearPriceInDecimal = nearPrice / 10 ** 24

				const priceInDecimal = {
					'token.paras.near': parasPriceInDecimal,
					'wrap.near': nearPriceInDecimal,
				}

				const totalStakedInUSD = data.amount * parasPriceInDecimal

				let startDate = null
				let allStartDate = 0
				let endDate = null
				let allEndDate = 0
				let totalRewardPerYearInUSD = 0
				let allTotalRewardPerYearInUSD = 0

				const totalRewards = {}
				const allTotalRewards = {}

				for (const farmId of data.farms) {
					const farmDetails = await near.wallet
						.account()
						.viewFunction(process.env.FARM_CONTRACT_ID, `get_farm`, {
							farm_id: farmId,
						})

					const farmEndDate =
						farmDetails.start_at +
						(farmDetails.session_interval * farmDetails.total_reward) /
							farmDetails.reward_per_session

					// check if hasn't started or expired
					const currentTs = new Date().getTime() / 1000

					if (farmDetails.start_at > currentTs || currentTs > farmEndDate) {
						if (allStartDate) {
							if (farmDetails.start_at < allStartDate) {
								allStartDate = farmDetails.start_at
							}
						} else {
							allStartDate = farmDetails.start_at
						}
						if (allEndDate) {
							if (allEndDate < farmEndDate) {
								allEndDate = farmEndDate
							}
						} else {
							allEndDate = farmEndDate
						}
						const farmTotalRewardPerWeek =
							(farmDetails.reward_per_session * 86400 * 7) / farmDetails.session_interval
						const farmTotalRewardPerWeekInUSD =
							farmTotalRewardPerWeek * priceInDecimal[farmDetails.reward_token]

						const farmTotalRewardPerYearInUSD = farmTotalRewardPerWeekInUSD * 52
						allTotalRewardPerYearInUSD += farmTotalRewardPerYearInUSD

						if (allTotalRewards[farmDetails.reward_token]) {
							allTotalRewards[farmDetails.reward_token] = {
								amount: JSBI.add(
									JSBI.BigInt(allTotalRewards[farmDetails.reward_token].amount),
									JSBI.BigInt(farmTotalRewardPerWeek)
								).toString(),
								startDateTs: farmDetails.start_at,
								endDateTs: farmEndDate,
							}
						} else {
							allTotalRewards[farmDetails.reward_token] = {
								amount: JSBI.BigInt(farmTotalRewardPerWeek).toString(),
								startDateTs: farmDetails.start_at,
								endDateTs: farmEndDate,
							}
						}
					} else {
						if (startDate) {
							if (farmDetails.start_at < startDate) {
								startDate = farmDetails.start_at
							}
						} else {
							startDate = farmDetails.start_at
						}

						if (endDate) {
							if (endDate < farmEndDate) {
								endDate = farmEndDate
							}
						} else {
							endDate = farmEndDate
						}

						const farmTotalRewardPerWeek =
							(farmDetails.reward_per_session * 86400 * 7) / farmDetails.session_interval
						const farmTotalRewardPerWeekInUSD =
							farmTotalRewardPerWeek * priceInDecimal[farmDetails.reward_token]

						const farmTotalRewardPerYearInUSD = farmTotalRewardPerWeekInUSD * 52

						totalRewardPerYearInUSD += farmTotalRewardPerYearInUSD

						if (totalRewards[farmDetails.reward_token]) {
							totalRewards[farmDetails.reward_token] = {
								amount: JSBI.add(
									JSBI.BigInt(totalRewards[farmDetails.reward_token].amount),
									JSBI.BigInt(farmTotalRewardPerWeek)
								).toString(),
								startDateTs: farmDetails.start_at,
								endDateTs: farmEndDate,
							}
						} else {
							totalRewards[farmDetails.reward_token] = {
								amount: JSBI.BigInt(farmTotalRewardPerWeek).toString(),
								startDateTs: farmDetails.start_at,
								endDateTs: farmEndDate,
							}
						}
					}
				}

				// if has no start date, means the pool is coming soon
				// use all data instead of active data
				const activeAPR =
					totalStakedInUSD > 0 ? (totalRewardPerYearInUSD * 100) / totalStakedInUSD : 0
				const allAPR =
					totalStakedInUSD > 0 ? (allTotalRewardPerYearInUSD * 100) / totalStakedInUSD : 0

				const APR = startDate ? activeAPR : allAPR

				setAPR(APR)

				// const poolData = {
				// 	apr: `${prettyBalance(APR.toString(), 0, 1)}%`,
				// 	totalStaked: data.amount / 10 ** 18,
				// 	totalStakedInUSD: totalStakedInUSD,
				// 	rewards: startDate ? totalRewards : allTotalRewards,
				// 	startDate: startDate ? startDate * 1000 : allStartDate * 1000,
				// 	endDate: endDate ? endDate * 1000 : allEndDate * 1000,
				// 	nftPoints: seedDetails.nft_balance,
				// 	comingSoon: startDate ? false : true,
				// }
				// console.log(poolData)
			} catch (err) {
				sentryCaptureException(err)
			}
		}

		const getPrice = async () => {
			try {
				const curPrice = await getParasPrice()
				const curMonth = `${new Date().getMonth()}/${new Date().getFullYear()}`
				const curSupply = CURRENT_SUPPLY[curMonth] || CURRENT_SUPPLY['8/2026']
				setCurPrice(curPrice)
				setCurSupply(curSupply)
				setCurMarket(curPrice * curSupply)
				setTotalSupply(100000000)
			} catch (err) {
				sentryCaptureException(err)
			}
		}

		if (store.initialized) {
			getFarms()
			getPrice()
		}
	}, [store.initialized])

	const getParasPrice = async () => {
		const res = await cachios.get(
			`https://api.coingecko.com/api/v3/simple/price?ids=PARAS&vs_currencies=USD`,
			{
				ttl: 60 * 15,
			}
		)
		return res.data.paras.usd
	}

	const getNearPrice = async () => {
		const res = await cachios.get(
			`https://api.coingecko.com/api/v3/simple/price?ids=NEAR&vs_currencies=USD`,
			{
				ttl: 60 * 15,
			}
		)
		return res.data.near.usd
	}

	return (
		<div className="min-h-screen relative bg-black">
			<Head>
				<title>{localeLn('Paras Token - NFT Marketplace for Digital Collectibles')}</title>
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
					content="Paras Token - NFT Marketplace for Digital Collectibles"
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
					content="Paras Token - NFT Marketplace for Digital Collectibles"
				/>
				<meta
					property="og:site_name"
					content="Paras Token - NFT Marketplace for Digital Collectibles"
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
			<div className="max-w-6xl m-auto relative p-4">
				<div className="py-12 flex flex-wrap items-center">
					<div className="w-full lg:w-1/2 pr-0 lg:pr-8 pt-8 lg:pt-0 order-2 lg:order-1">
						<p className="rounded-md bg-blue-500 inline-block px-2 py-1 text-white text-xs tracking-widest font-medium">
							PARAS TOKEN
						</p>
						<p className="mt-4 text-5xl text-white font-bold">Own Your Marketplace</p>
						<p className="mt-4 text-xl text-gray-300 max-w-lg">
							PARAS is a utility token that lets you shape the future of Paras ecosystem and at the
							same time gives you more rewards and benefits.
						</p>
						<div className="mt-8 text-xl text-gray-300 max-w-lg">
							Stake PARAS and earn up to{' '}
							<AnimatedNumber
								className="font-bold text-white overflow-hidden"
								size={32}
								value={`${prettyBalance(apr, 0, 0)}%`}
							/>
							{} APR
						</div>
						<div className="mt-8 flex items-center justify-between max-w-xs">
							<div>
								<Button
									onClick={() =>
										document.getElementById('buy').scrollIntoView({
											behavior: 'smooth',
											block: 'start',
											inline: 'nearest',
										})
									}
									size="md"
									className="font-bold w-40"
								>
									Buy PARAS
								</Button>
							</div>
							<div>
								<a
									className="flex text-white border-b-2 hover:opacity-75 font-bold"
									target="_blank"
									href="https://stake.paras.id"
									rel="noreferrer"
								>
									Stake PARAS
									<span className="pl-1">
										<IconShare size={12} />
									</span>
								</a>
							</div>
						</div>
					</div>
					<div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
						<div className="w-full">
							<img src="/token/hero.png" />
						</div>
					</div>
				</div>
				<div className="mt-32 flex flex-wrap justify-between text-white">
					<div className="w-1/2 lg:w-auto text-center p-4">
						<p className="font-semibold">Current Price</p>
						<AnimatedNumber
							className="mt-2 font-bold overflow-hidden"
							size={18}
							value={`$${prettyBalance(curPrice, 0, 4)}`}
							duration={1000}
						/>
					</div>
					<div className="hidden lg:block border-dashed border-r-2 border-gray-600"></div>
					<div className="w-1/2 lg:w-auto text-center p-4">
						<p className="font-semibold">Market Cap</p>
						<AnimatedNumber
							className="mt-2 font-bold overflow-hidden"
							size={18}
							value={`$${prettyBalance(curMarketCap, 0, 4)}`}
							duration={1000}
						/>
					</div>

					<div className="hidden lg:block border-dashed border-r-2 border-gray-600"></div>
					<div className="w-1/2 lg:w-auto text-center p-4">
						<p className="font-semibold">Circulating Supply</p>
						<AnimatedNumber
							className="mt-2 font-bold overflow-hidden"
							size={18}
							value={`${prettyBalance(parseInt(curSupply), 0, 0)}`}
							duration={1000}
						/>
						<span className="font-bold text-lg"> PARAS</span>
					</div>
					<div className="hidden lg:block border-dashed border-r-2 border-gray-600"></div>
					<div className="w-1/2 lg:w-auto text-center p-4">
						<p className="font-semibold">Total Supply</p>
						<AnimatedNumber
							className="mt-2 font-bold overflow-hidden"
							size={18}
							value={`${prettyBalance(totalSupply, 0, 0)}`}
							duration={1000}
						/>
						<span className="font-bold text-lg"> PARAS</span>
					</div>
				</div>
				<div className="mt-32 max-w-xl mx-auto text-center">
					<p className="text-3xl font-bold text-white">Explore the Benefits</p>
					<p className="mt-4 text-gray-300">
						PARAS holders will be able to claim rewards if they stake their tokens, participate in
						key governance votes (soon), and exclusive access to features and benefits from
						Paras&apos; artists and partners.
					</p>
				</div>
				<div className="flex flex-wrap -mx-4">
					<div className="w-full lg:w-1/3 text-white px-4">
						<div className="mt-16 w-full p-4">
							<img className="w-full max-w-sm mx-auto" src="/token/staking.png" />
						</div>
						<p className="mt-2 font-bold text-2xl">Staking</p>
						<p className="mt-2 text-gray-300">
							PARAS holders can earn more cryptocurrency just by staking their tokens. By staking
							the PARAS token, you will be able to claim more rewards through our Marketplace
							Rewards Program.
						</p>
					</div>
					<div className="w-full lg:w-1/3 text-white px-4">
						<div className="mt-16 w-full p-4">
							<img className="w-full max-w-sm mx-auto" src="/token/loyalty.png" />
						</div>
						<p className="mt-2 font-bold text-2xl">Loyalty Program</p>
						<p className="mt-2 text-gray-300">
							PARAS holders immediately become part of our Loyalty Program. Certain features can
							only be accessed by the PARAS holders and more benefits that comes throught our
							partners, such as whitelist spots for upcoming NFT launches and limited edition
							physical goods.
						</p>
					</div>
					<div className="w-full lg:w-1/3 text-white px-4">
						<div className="mt-16 w-full p-4">
							<img className="w-full max-w-sm mx-auto" src="/token/gov.png" />
						</div>
						<div className="mt-2 flex items-center">
							<p className="font-bold text-2xl">Governance</p>
							<div className="ml-2 text-xs font-bold rounded-md bg-dark-primary-6 text-gray-300 inline-block px-2 py-1">
								SOON
							</div>
						</div>
						<p className="mt-2 text-gray-300">
							Community is a big part of Paras, most of the updates that we have in fact are coming
							from the voice of the community members. PARAS holders will be able vote and shape the
							future of Paras.
						</p>
					</div>
				</div>
				<div className="mt-32 max-w-3xl mx-auto text-white rounded-xl bg-primary bg-opacity-15 flex items-center flex-wrap">
					<div className="w-full lg:w-2/3 p-4 lg:p-8">
						<p className="mt-4 rounded-md bg-blue-500 inline-block px-2 py-1">
							Earn up to <span className="font-bold text-xl">{prettyBalance(apr, 0, 0)}% APR</span>
						</p>
						<p className="mt-4 text-3xl font-bold text-white">Marketplace Rewards Program</p>
						<p className="mt-4">
							We’ll be distributing 70% of Paras Marketplace fee as reward to the PARAS stakers
							every month.
						</p>
						<p className="mt-2">
							PARAS holders will be able to earn <span className="font-bold">PARAS</span> and{' '}
							<span className="font-bold">NEAR</span> just by staking their PARAS Tokens.
						</p>
						<div className="mt-8">
							<p className="inline-block text-2xl font-bold">
								<a
									className="flex text-white border-b-2 hover:opacity-75 font-bold"
									target="_blank"
									href="https://stake.paras.id"
									rel="noreferrer"
								>
									Stake PARAS
									<span className="pl-1">
										<IconShare size={12} />
									</span>
								</a>
							</p>
						</div>
					</div>
					<div className="w-full lg:w-1/3">
						<img className="w-full max-w-sm mx-auto" src="/token/marketplace-rewards.png" />
					</div>
				</div>
				<div id="buy" className="mt-32 max-w-xl mx-auto text-white">
					<div className="text-white text-center">
						<p className="mt-4 text-3xl font-bold text-white">Get PARAS Tokens</p>
						<p className="mt-4">PARAS Tokens are available for purchase through our partners:</p>
						<div className="mt-8 flex justify-center">
							<div className="flex flex-wrap -mx-4">
								<a
									href="https://app.ref.finance/#wrap.near|token.paras.near"
									target="_blank"
									rel="noreferrer"
									className="block px-4"
								>
									<div className="w-16 h-16 hover:opacity-75">
										<svg
											width="100%"
											height="100%"
											viewBox="0 0 394 394"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<circle cx="197" cy="197" r="197" fill="white" />
											<g clipPath="url(#clip0_1717_151)">
												<path
													d="M214.03 213.035V276.917H277.917L214.03 213.035ZM158.744 157.752L183.807 182.801L209.115 157.494V111.069H158.744V157.752ZM158.744 180.332V276.905H209.115V180.099L183.807 205.406L158.744 180.332ZM217.102 111.057H214.03V152.58L246.121 120.455C237.678 114.348 227.522 111.063 217.102 111.069V111.057ZM101 199.755V276.917H153.829V175.43L139.578 161.18L101 199.755ZM101 177.162L139.578 138.587L153.829 152.85V111.081H101V177.162ZM266.859 160.823C266.873 150.382 263.583 140.203 257.46 131.745L214.03 175.185V210.578H217.102C223.637 210.578 230.108 209.291 236.146 206.789C242.184 204.288 247.67 200.622 252.29 196.001C256.91 191.379 260.576 185.893 263.075 179.855C265.575 173.817 266.861 167.346 266.859 160.811V160.823Z"
													fill="black"
												/>
												<path d="M244.167 100L277.339 133.17V100H244.167Z" fill="#00C08B" />
											</g>
											<defs>
												<clipPath id="clip0_1717_151">
													<rect
														width="193"
														height="193"
														fill="white"
														transform="translate(101 100)"
													/>
												</clipPath>
											</defs>
										</svg>
									</div>
								</a>
								<a
									href="https://www.mexc.com/exchange/PARAS_USDT"
									target="_blank"
									rel="noreferrer"
									className="block px-4"
								>
									<div className="w-16 h-16 hover:opacity-75">
										<svg
											width="100%"
											height="100%"
											viewBox="0 0 394 394"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<circle cx="197" cy="197" r="197" fill="white" />
											<path
												d="M317.142 227.913L263.318 134.594C251.435 115.196 222.775 114.847 211.416 135.468L154.796 232.631C144.31 250.456 157.242 272.825 178.387 272.825H291.628C312.948 272.825 328.851 249.757 317.142 227.913Z"
												fill="#00B897"
											/>
											<path
												d="M239.376 235.25L236.056 229.483C232.911 224.066 226.095 212.532 226.095 212.532L180.484 133.368C171.397 119.563 152.873 115.893 139.068 124.98C134.699 127.776 131.204 131.796 128.932 136.514L75.9814 228.26C67.7679 242.415 72.661 260.589 86.9909 268.803C91.5345 271.424 96.6024 272.822 101.845 272.822H291.104C261.92 272.997 252.658 257.793 239.376 235.25Z"
												fill="#76FCB2"
											/>
											<path
												d="M239.376 235.254L236.055 229.487C232.91 224.07 226.094 212.536 226.094 212.536L196.736 160.809L154.445 232.807C143.96 250.632 156.892 273.001 178.037 273.001H291.103C261.744 272.826 252.657 257.797 239.376 235.254Z"
												fill="url(#paint0_linear_1717_152)"
											/>
											<defs>
												<linearGradient
													id="paint0_linear_1717_152"
													x1="139.535"
													y1="200.104"
													x2="270.373"
													y2="248.441"
													gradientUnits="userSpaceOnUse"
												>
													<stop stopColor="#53E57A" stopOpacity="0" />
													<stop offset="1" stopColor="#00A977" />
												</linearGradient>
											</defs>
										</svg>
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-32 max-w-3xl mx-auto">
					<div className="text-white">
						<p className="mt-4 text-3xl font-bold text-white">About Paras</p>
						<p className="mt-4">
							Paras is an NFT marketplace for digital collectibles. We focus on supporting and
							developing the crypto-native IPs as we believe that by creating new exclusive IPs, we
							could tailor and design new experiences of these mediums: comics, games, and toys.
							Giving utility and use cases over digital assets could create more value to collectors
							and creators.
						</p>
						<p className="mt-2">
							We launched PARAS Tokens in Sept 2021 as a way to gradually decentralizing the
							ecosystem. We want Paras to be community-owned marketplace, where the community has
							voice and can help shape the future of the Paras together.
						</p>
						<div className="mt-8 flex items-center -mx-4">
							<p className="text-2xl font-bold px-4">
								<a
									className="flex text-white hover:opacity-75 font-bold"
									target="_blank"
									href="https://team.paras.id"
									rel="noreferrer"
								>
									<span className="border-b-2 ">Team</span>
									<span className="pl-1">
										<IconShare size={12} />
									</span>
								</a>
							</p>
							<p className="text-2xl font-bold px-4">
								<a
									className="flex text-white hover:opacity-75 font-bold"
									target="_blank"
									href="https://ipfs.fleek.co/ipfs/bafybeihu6atdada45rmx4sszny6sahrzas4tuzrpuufdcpe6b63r6ugdce"
									rel="noreferrer"
								>
									<span className="border-b-2 ">Whitepaper</span>
									<span className="pl-1">
										<IconShare size={12} />
									</span>
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className="pt-12">
				<Footer />
			</div>
		</div>
	)
}
