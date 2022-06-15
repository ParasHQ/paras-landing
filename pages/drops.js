import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Blurhash } from 'react-blurhash'

import Nav from 'components/Nav'
import Footer from 'components/Footer'
import Card from 'components/Card/Card'
import { parseImgUrl, prettyBalance } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import TokenSeriesDetailModal from 'components/TokenSeries/TokenSeriesDetailModal'

export const specialTokenId = [
	{
		tokenId: 38124,
		image: 'bafybeihkl2v7yzvyyftd55wtuu3sqeul3463re5qe7e4xzntgt7h5tqkcy',
		title: `Lidra`,
		price: `20`,
		supply: `250`,
	},
	{
		tokenId: 38125,
		image: 'bafybeig5o6y446cgk5k3tnae37jxroxuyvx7ivydu5yxu23qu3h5k65p64',
		title: `Pyro`,
		price: `10`,
		supply: `500`,
	},
	{
		tokenId: 38126,
		image: 'bafybeib3y5vj5rjf5daf77uy7nwlug57kxzjqlyas4q57eah5h7d6khc6a',
		title: `Rayo`,
		price: `10`,
		supply: `500`,
	},
	{
		tokenId: 38127,
		image: 'bafybeifezesodcrc5zg4dnj46duxfa2o2qvx7nrlibof2245vpntbkieva',
		title: `Lilo Explorer Sketch`,
		price: `50`,
		supply: `50`,
	},
	{
		tokenId: 38128,
		image: 'bafybeie33tikoko67irxpy6bjurbtztf4t5jd4mhibqj26l6ndgkthvfo4',
		title: `Pico Explorer Sketch`,
		price: `50`,
		supply: `50`,
	},
	{
		tokenId: null,
		image: 'bafybeidvk5fbtan4zviz25tv43w6bl4dr5jgmqeykzowk5wjq3wer7wuea',
		title: `?`,
		price: `?`,
		supply: `?`,
	},
]

const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

export const specialAccountId = 'hdriqi'

export default function Drops() {
	const { localeLn } = useIntl()
	const timeline = [
		{
			date: `Nov 8th`,
			note: [
				`NFT drop is live`,
				`Drops will start on Nov 8th at 00.01 and will end at Nov 14th at 00.00 (6-days)`,
			],
		},
		{
			date: 'Nov 12th',
			note: [`Bid item is live`],
		},
		{
			date: `Nov 14th`,
			note: [`NFT Drop ends`, `Burn all the remaining NFTs`],
		},
	]

	const [token, setToken] = useState(null)
	const detail = useRef(null)

	return (
		<div
			className="min-h-screen relative bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Head>
				<title>{localeLn('ParasXMTVRS')}</title>
				<meta
					name="description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta name="twitter:title" content="Paras X MTVRS NFT Drops" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta
					name="twitter:image"
					content={parseImgUrl('bafybeid5pask4j3ejkbeegmau6n5mmfj5gkja64exyobxg4uzltjdcw7kq')}
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Paras X MTVRS NFT Drops" />
				<meta property="og:site_name" content="Paras X MTVRS NFT Drops" />
				<meta
					property="og:description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content={parseImgUrl('bafybeid5pask4j3ejkbeegmau6n5mmfj5gkja64exyobxg4uzltjdcw7kq')}
				/>
			</Head>
			<Nav />
			<div
				className="fixed inset-0 opacity-75"
				style={{
					zIndex: 0,
					backgroundImage: `url('/bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			/>
			<TokenSeriesDetailModal tokens={[token]} />
			<div className="max-w-2xl m-auto py-12 min-h-full relative z-10">
				<div className="flex items-center justify-center m-4 md:m-0">
					<div className="text-center px-4 whitespace-pre-wrap">
						<div className="flex justify-center items-baseline">
							<svg
								width="80"
								height="19"
								viewBox="0 0 80 19"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M27.8185 18.223L27.4999 17.0833C27.4018 17.1649 27.2956 17.2426 27.1812 17.3161C26.1355 18.0269 24.6813 18.3823 22.8185 18.3823C21.0538 18.3823 19.6486 18.0636 18.6029 17.4264C17.5571 16.7891 17.0342 15.6168 17.0342 13.9092C17.0342 12.3079 17.5653 11.1723 18.6274 10.5024C19.6976 9.83247 21.3561 9.4975 23.6028 9.4975H27.218V9.05633C27.218 8.10045 26.9647 7.41826 26.4582 7.00977C25.9517 6.59311 25.2736 6.38477 24.4239 6.38477C23.6559 6.38477 23.0023 6.5686 22.4631 6.93624C21.9239 7.30389 21.589 7.88803 21.4582 8.68868L17.3406 7.53673C17.5857 6.20504 18.3128 5.20831 19.522 4.54655C20.7393 3.88479 22.3079 3.5539 24.2278 3.5539C27.0056 3.5539 28.9051 4.12988 29.9263 5.28184C30.9476 6.43379 31.4582 8.07186 31.4582 10.196V18.223H27.8185ZM27.218 13.897V11.9852H24.4852C23.276 11.9852 22.4468 12.1364 21.9974 12.4387C21.5563 12.741 21.3357 13.2107 21.3357 13.848C21.3357 14.4771 21.5358 14.9509 21.9362 15.2695C22.3365 15.58 22.9778 15.7352 23.8602 15.7352C24.8324 15.7352 25.633 15.5514 26.2621 15.1838C26.8994 14.8161 27.218 14.3872 27.218 13.897Z"
									fill="white"
								/>
								<path
									d="M43.0744 10.8823C43.0744 9.06041 42.8661 7.87169 42.4494 7.31614C42.0409 6.75242 41.4691 6.47056 40.7338 6.47056C39.8841 6.47056 39.206 6.76876 38.6995 7.36516C38.2746 7.87169 38.0295 8.43542 37.9642 9.05633V18.223H33.7485V3.68871H37.7803L37.8661 5.08576C37.907 5.04491 37.9478 5.00815 37.9887 4.97547C39.0916 4.03593 40.5377 3.56616 42.3269 3.56616C44.2632 3.56616 45.5744 4.16256 46.2607 5.35537C46.947 6.54 47.2901 8.38231 47.2901 10.8823H43.0744Z"
									fill="white"
								/>
								<path
									d="M59.9157 18.223L59.597 17.0833C59.499 17.1649 59.3928 17.2426 59.2784 17.3161C58.2327 18.0269 56.7784 18.3823 54.9157 18.3823C53.151 18.3823 51.7458 18.0636 50.7 17.4264C49.6543 16.7891 49.1314 15.6168 49.1314 13.9092C49.1314 12.3079 49.6624 11.1723 50.7245 10.5024C51.7948 9.83247 53.4533 9.4975 55.7 9.4975H59.3152V9.05633C59.3152 8.10045 59.0619 7.41826 58.5554 7.00977C58.0488 6.59311 57.3707 6.38477 56.5211 6.38477C55.7531 6.38477 55.0995 6.5686 54.5603 6.93624C54.0211 7.30389 53.6861 7.88803 53.5554 8.68868L49.4378 7.53673C49.6829 6.20504 50.41 5.20831 51.6191 4.54655C52.8364 3.88479 54.4051 3.5539 56.325 3.5539C59.1028 3.5539 61.0023 4.12988 62.0235 5.28184C63.0447 6.43379 63.5553 8.07186 63.5553 10.196V18.223H59.9157ZM59.3152 13.897V11.9852H56.5823C55.3732 11.9852 54.5439 12.1364 54.0946 12.4387C53.6534 12.741 53.4328 13.2107 53.4328 13.848C53.4328 14.4771 53.633 14.9509 54.0333 15.2695C54.4337 15.58 55.075 15.7352 55.9573 15.7352C56.9296 15.7352 57.7302 15.5514 58.3593 15.1838C58.9965 14.8161 59.3152 14.3872 59.3152 13.897Z"
									fill="white"
								/>
								<path
									d="M72.9902 18.3455C71.0131 18.3455 69.3914 18.0514 68.1251 17.4632C66.8587 16.8667 66.0376 15.8823 65.6618 14.5097L69.3628 13.1617C69.5262 14.0277 69.9347 14.6445 70.5883 15.0122C71.25 15.3717 72.0262 15.5514 72.9167 15.5514C73.8481 15.5514 74.567 15.4248 75.0736 15.1715C75.5801 14.9182 75.8334 14.5547 75.8334 14.0808C75.8334 13.4844 75.527 13.0963 74.9142 12.9166C74.3097 12.7287 73.317 12.5326 71.9363 12.3284C69.7059 12.0343 68.121 11.589 67.1814 10.9926C66.2419 10.3962 65.7721 9.3627 65.7721 7.89212C65.7721 6.38886 66.4176 5.29409 67.7084 4.60782C69.0074 3.92155 70.7231 3.57841 72.8554 3.57841C74.9224 3.57841 76.5074 3.87253 77.6103 4.46076C78.7214 5.04083 79.4445 5.98445 79.7794 7.29163L76.2133 8.61516C76.0417 7.83084 75.6618 7.25895 75.0736 6.89948C74.4935 6.53183 73.7296 6.34801 72.7819 6.34801C71.8832 6.34801 71.1806 6.4869 70.6741 6.76467C70.1757 7.04245 69.9265 7.40193 69.9265 7.8431C69.9265 8.41499 70.2492 8.77855 70.8947 8.93378C71.5482 9.08901 72.5327 9.26058 73.8481 9.44848C75.9886 9.72626 77.549 10.1715 78.5294 10.7843C79.5098 11.3888 80 12.4101 80 13.848C80 15.4738 79.3668 16.6298 78.1005 17.3161C76.8423 18.0024 75.1389 18.3455 72.9902 18.3455Z"
									fill="white"
								/>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M2.45097 18.3823L0 0L10.3553 1.83823C10.7955 1.95407 11.2031 2.0472 11.5784 2.13296C12.9897 2.45543 13.9444 2.67359 14.4607 3.60292C15.1143 4.77122 15.4411 6.20912 15.4411 7.91663C15.4411 9.63231 15.1143 11.0743 14.4607 12.2426C13.8071 13.4109 12.4387 13.995 10.3553 13.995H5.87007L6.72791 18.3823H2.45097ZM3.799 3.799L9.3876 4.78089C9.62517 4.84277 9.84513 4.89252 10.0477 4.93832C10.8093 5.11057 11.3246 5.2271 11.6032 5.72351C11.9559 6.34755 12.1323 7.11561 12.1323 8.02767C12.1323 8.9441 11.9559 9.71434 11.6032 10.3384C11.2505 10.9624 10.5119 11.2745 9.3876 11.2745H6.8347L5.29625 11.1519L3.799 3.799Z"
									fill="white"
								/>
							</svg>
							<div className="text-gray-100 ml-2 font-bold text-2xl">{'x MTVRS'}</div>
						</div>
						<h1 className="text-white font-bold text-6xl mt-4 mb-2">{localeLn('NFTDrops')}</h1>
						<img
							className="max-w-full"
							src={parseImgUrl('bafybeid5pask4j3ejkbeegmau6n5mmfj5gkja64exyobxg4uzltjdcw7kq')}
						/>
						<div className="max-w-xl m-auto">
							<p className="text-gray-200 mt-4">
								Welcome to Metamon! Get ready to explore an exciting universe full of powerful
								creatures with unique abilities! Capture, evolve and train your Metamon to become
								the best! Battle each other in a competitive online battle royale and earn your
								place as the Supreme One!
							</p>
							<p className="text-gray-200 mt-4">
								The upcoming Metamon game is an online competitive Battle Royale PC Play-To-Earn
								game with an official launch date of January 20th.
							</p>
							<a
								target="blank"
								href="https://forms.gle/oiyYYLx5gvqFNgtH8"
								className="underline break-all block text-gray-200 mt-4 font-medium"
							>
								Sign up here for exclusive early access to the game.
							</a>
						</div>
					</div>
				</div>
			</div>
			<div className="max-w-6xl mx-auto">
				<div ref={detail} className="flex flex-wrap px-4 -mx-4">
					{specialTokenId.map((token, idx) => {
						return (
							<SpecialCard
								key={idx}
								tokenId={token.tokenId}
								onClick={setToken}
								titleCard={token.title}
								price={token.price}
								priceOriginal={null}
								cardSupplyText={token.supply}
								cardAvailableText={`${token.supply}/${token.supply}`}
								imgUrl={token.image}
								blurhash="UHC$2K~9J{5K-.%DflN3A5Su$P$jRFV@WEXA"
							/>
						)
					})}
				</div>
			</div>
			<div className="relative z-10">
				<h1 className="text-center text-gray-100 font-bold text-3xl object-center mt-12 mb-2">
					{localeLn('Timeline')}
				</h1>
				<div className="max-w-4xl m-auto md:flex">
					{timeline.map((item, index) => (
						<div
							key={index}
							className="border-2 border-dashed border-gray-800 rounded-md p-4 m-4 md:w-1/3"
						>
							<p className="font-semibold text-lg text-center mb-2 text-gray-200">{item.date}</p>
							<ul className="list-disc ml-4">
								{item.note.map((note, index) => (
									<li key={index} className="text-gray-200">
										{note}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
			{/* <div className="max-w-xl m-4 md:m-auto text-gray-100 ">
				<h1 className="text-center text-gray-100 font-bold text-3xl object-center mt-12 mb-2">
					{localeLn('HowToRegister')}
				</h1>
				<p className="mb-2 break-all">{localeLn('How_To_Register_So')}</p>
				<ReactLinkify
					componentDecorator={(decoratedHref, decoratedText, key) => (
						<a target="blank" href={decoratedHref} key={key} className="italic">
							{decoratedText}
						</a>
					)}
				>
					<ol className="text-gray-100 ml-8 break-all" style={{ listStyleType: 'decimal' }}>
						{tasks.map((task, index) => (
							<li key={index}>{task}</li>
						))}
					</ol>
				</ReactLinkify>
				<div className="text-center">
					<h1 className="text-center text-gray-100 font-bold text-3xl mt-12 mb-2">
						{localeLn('ReadDetails')}
					</h1>
					<p className="text-gray-200">{localeLn('ReadFullInformation')}</p>
					<div className="flex justify-center my-8">
						<a
							className="flex text-gray-200 hover:text-white font-semibold border-b-2 cursor-pointer"
							target="_blank"
							href="https://paras.id/publication/editorial/paras-x-mtvrs-nft-drops-the-architects-devices-60bf7208a537580686cbf237"
						>
							{localeLn('FindOutMore')}
							<svg
								width="12"
								height="12"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="ml-1"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M7.70421 9.70711L13.9971 3.41421V7H15.9971V0H8.9971V2H12.5829L6.28999 8.29289L7.70421 9.70711ZM15 14V10H13V14H2V3H6V1H2C0.89543 1 0 1.89543 0 3V14C0 15.1046 0.89543 16 2 16H13C14.1046 16 15 15.1046 15 14Z"
									fill="white"
								/>
							</svg>
						</a>
					</div>
				</div>
			</div> */}
			<Footer />
		</div>
	)
}

const SpecialCard = ({
	tokenId,
	onClick,
	blurhash,
	imgUrl,
	titleCard,
	price,
	cardSupplyText,
	priceOriginal,
	cardAvailableText,
}) => {
	const [localToken, setLocalToken] = useState(null)
	const router = useRouter()

	useEffect(() => {
		if (tokenId) {
			fetchToken()
		}
	}, [])

	const fetchToken = async () => {
		const res = await axios(`${process.env.V2_API_URL}/token-series`, {
			params: {
				contract_id: 'x.paras.near',
				token_series_id: tokenId,
			},
		})
		const token = (await res.data.data.results[0]) || null
		setLocalToken(token)
	}

	const onPressBuyNow = () => {
		if (localToken) {
			onClick(localToken)
			router.push(
				{
					pathname: router.pathname,
					query: {
						...router.query,
						tokenSeriesId: localToken.token_series_id,
						contractId: localToken.contract_id,
					},
				},
				`/token/${localToken.contract_id}::${localToken.token_series_id}`,
				{
					shallow: true,
					scroll: false,
				}
			)
		}
	}

	// const _getLowestPrice = (ownerships = []) => {
	// 	const marketDataList = ownerships
	// 		.filter((ownership) => ownership.marketData)
	// 		.map((ownership) => ownership.marketData.amount)
	// 		.sort((a, b) => a - b)
	// 	return marketDataList[0]
	// }

	// const getCardAvailable = (ownerships = []) => {
	// 	let total = 0
	// 	const marketDataList = ownerships
	// 		.filter((ownership) => ownership.marketData)
	// 		.map((ownership) => ownership.marketData.quantity)
	// 	total = marketDataList.reduce((a, b) => a + b, 0)
	// 	return total
	// }
	const { localeLn } = useIntl()

	return (
		<div className="relative p-4 md:m-0 w-full md:w-1/3">
			<ReactTooltip effect={'solid'} className="bg-dark-primary-1 text-white px-2 py-4 max-w-sm" />
			<div className="absolute p-4 inset-0 m-auto opacity-50">
				<div className="overflow-hidden rounded-xl w-full h-full">
					<Blurhash
						hash={blurhash}
						width={`100%`}
						height={`100%`}
						resolutionX={32}
						resolutionY={32}
						punch={1}
					/>
				</div>
			</div>
			<div className="relative py-8 m-auto">
				<div className="static m-auto">
					<h1 className="text-white mb-8 text-2xl font-bold text-center">
						{localToken?.metadata.name || titleCard}
					</h1>
					<div className="m-8">
						<div className="w-full m-auto">
							<Card
								special
								imgUrl={
									localToken
										? parseImgUrl(localToken.metadata.media, null, {
												isMediaCdn: localToken.isMediaCdn,
										  })
										: parseImgUrl(imgUrl, null)
								}
								imgBlur={blurhash}
								disableFlip
								token={{
									name: localToken?.metadata.name,
									collection: localToken?.metadata.collection,
									description: localToken?.metadata.description,
									creatorId: localToken?.creatorId,
									copies: localToken?.copies || cardSupplyText,
									tokenId: localToken?.tokenId,
									createdAt: localToken?.createdAt,
									is_creator: localToken?.is_creator,
								}}
								initialRotate={{
									x: 0,
									y: 0,
								}}
							/>
						</div>
					</div>
					<div className="text-center">
						<div>
							<p className="text-gray-400">{localeLn('Price')}</p>
							<div className="mb-4 flex space-x-2 justify-center items-center">
								<p
									className="text-gray-100 text-xl font-bold line-through opacity-75"
									style={{ textDecorationColor: '#DC143C' }}
								>
									{priceOriginal}
								</p>
								<p className="text-gray-100 text-4xl font-bold">{`${price} Ⓝ`}</p>
							</div>
						</div>
						<div
							className="flex flex-col cursor-default mb-4"
							data-tip={`Total supply of the card`}
						>
							<div className="flex text-white justify-center">
								<p className="text-gray-400 mr-1">{localeLn('CardSupply')}</p>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="#ffffff"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										className="fill-current"
										fill="#ffffff"
										fillRule="evenodd"
										clipRule="evenodd"
										d="M1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM13.0036 13.9983H14.003V15.9983H10.003V13.9983H11.003V11.9983H10.003V9.99835H13.0036V13.9983ZM13.0007 7.99835C13.0007 8.55063 12.5528 8.99835 12.0003 8.99835C11.4479 8.99835 11 8.55063 11 7.99835C11 7.44606 11.4479 6.99835 12.0003 6.99835C12.5528 6.99835 13.0007 7.44606 13.0007 7.99835Z"
									/>
								</svg>
							</div>
							<p className="text-gray-100 text-lg font-semibold">
								{localToken?.metadata.copies || cardSupplyText} {localeLn('pcs')}
							</p>
						</div>
						<div
							className="flex flex-col cursor-default mb-4"
							data-tip={`Card available for purchase`}
						>
							<div className="flex text-white justify-center">
								<p className="text-gray-400 mr-1">{localeLn('CardAvailable')}</p>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="#ffffff"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										className="fill-current"
										fill="#ffffff"
										fillRule="evenodd"
										clipRule="evenodd"
										d="M1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM13.0036 13.9983H14.003V15.9983H10.003V13.9983H11.003V11.9983H10.003V9.99835H13.0036V13.9983ZM13.0007 7.99835C13.0007 8.55063 12.5528 8.99835 12.0003 8.99835C11.4479 8.99835 11 8.55063 11 7.99835C11 7.44606 11.4479 6.99835 12.0003 6.99835C12.5528 6.99835 13.0007 7.44606 13.0007 7.99835Z"
									/>
								</svg>
							</div>
							{localToken ? (
								<p className="text-gray-100 text-lg font-semibold">
									{`${localToken.metadata.copies - (localToken.total_mint || 0)} / ${
										localToken.metadata.copies
									}`}
								</p>
							) : (
								<p className="text-gray-100 text-lg font-semibold">{cardAvailableText}</p>
							)}
						</div>
						<div className="mx-8 mt-8">
							<button
								onClick={onPressBuyNow}
								// disabled
								className={`w-full outline-none h-12 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-gray-200 text-primary bg-gray-200`}
							>
								{localToken?.price ? (
									<p>
										{`Buy for
										${prettyBalance(localToken?.price, 24, 4)}
										Ⓝ`}
									</p>
								) : (
									<p>{localeLn('SeeDetails')}</p>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export async function getServerSideProps() {
	return {
		redirect: {
			destination: '/',
			permanent: false,
		},
	}
}
