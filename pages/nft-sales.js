import { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import ReactTooltip from 'react-tooltip'
import { Blurhash } from 'react-blurhash'

import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Card from '../components/Card'
import CardDetailModal from '../components/CardDetailModal'
import { parseImgUrl, prettyBalance } from '../utils/common'
import useStore from '../store'

export const specialTokenId = [
	'QmPEdrFaTX4PUgZ2VqrbcWnJPD1ZAizbG5so3KqhbTN5cj',
	'QmRmmeRzebGsgjFaX7qGCchCHEaYGiTNMXaQThUrFLDz9Y',
	'QmNSZZ8r23P562nFA5JJ1vtZVSiDHKHAXMhkuvPVwHQGHt',
]

const timeline = [
	{
		date: 'April 15th, 2021 - 00:01 UTC',
		note: [
			'The Founders start on sale for 3 days',
			'The Founders will release 80 cards per day',
			'The remaining that have not been sold will be burned each day',
		],
	},
	{
		date: 'April 17th, 2021 - 00:01 UTC',
		note: [
			'The Founders sales end and will burn the rest of the card’s supply owned by paras.near.',
			'The First Men start on sale for 3 days',
		],
	},
	{
		date: 'April 19th, 2021 - 00:01 UTC',
		note: [
			'The First Men sales end and will burn the rest of the card’s supply owned by paras.near.',
			'The Firstborn start on sale for 3 days',
		],
	},
	{
		date: 'April 21th, 2021 - 00:01 UTC',
		note: [
			'The Firstborn sales end and will burn the rest of the card’s supply owned by paras.near',
		],
	},
	{
		date: 'May 1st, 2021 - 00:01 UTC',
		note: [
			'First emission for all the NFT holders at that time based on the emission rate.',
			'The NFT holders snapshot happens every week at 00:01 UTC.',
			'The emission will be sent out every week from May 1st, 2021 (May 8th, May 15th, etc) until the period ends (each NFT has a different emission period).',
			'Users can claim their weekly emission via https://claim.paras.id',
		],
	},
]

export default function NFTSales() {
	const [token, setToken] = useState(null)

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
			<CardDetailModal tokens={[token]} />
			<div className="max-w-2xl m-auto py-12 min-h-full">
				<div className="flex items-center justify-center m-4 md:m-0">
					<div className="text-center">
						<div className="flex justify-center">
							<svg
								className="cursor-pointer hidden md:block"
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
						</div>
						<h1
							data-tip="hello world"
							className="text-white font-bold text-6xl mt-4 mb-2"
						>
							NFT Sales
						</h1>
						<img
							// will change the image source
							src={parseImgUrl(
								'ipfs://bafybeih6ceggaik2lpnupr7dxwjwzohbr5mhkx3kgaiqdba5zcu2xgwc5i'
							)}
						/>
						<div className="max-w-lg m-auto">
							<p className="text-gray-400 mb-4">
								Paras is looking forward to launching our first Paras NFT
								offering. In this project, we create three tiers of cards in
								three different price ranges. These cards will represent our
								early backers based on the number of their donations.
							</p>
							<p className="text-gray-400">
								Explore and buy exclusive card collection by Paras. Get special
								benefits and rewards only at Paras.
							</p>
							<div className="my-8 flex justify-center">
								<p className="flex text-gray-200 hover:text-white font-semibold border-b-2 cursor-pointer mb-8">
									Find out more
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="md:flex justify-center md:space-x-8 max-w-6xl m-auto">
				<SpecialCard
					tokenId={specialTokenId[0]}
					onClick={setToken}
					supply={240}
					emmision={166}
					period={12}
				/>
				<SpecialCard
					tokenId={specialTokenId[1]}
					onClick={setToken}
					supply={300}
					emmision={98}
					period={18}
				/>
				<SpecialCard
					tokenId={specialTokenId[2]}
					onClick={setToken}
					supply={420}
					emmision={52}
					period={24}
				/>
			</div>
			<div className="max-w-2xl m-4 md:m-auto pt-8 text-gray-100 ">
				<h1 className="text-center text-gray-100 font-bold text-3xl object-center mt-8 mb-2">
					Timeline
				</h1>
				<div className="max-w-xl m-auto">
					{timeline.map((item, index) => (
						<div
							key={index}
							className="border-2 border-dashed border-gray-800 rounded-md p-4 mb-4"
						>
							<p className="font-semibold text-lg text-center mb-2">
								{item.date}
							</p>
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
				<h1 className="text-center text-gray-100 font-bold text-3xl object-center mt-8 mb-2">
					How to buy
				</h1>
				<p className="mb-2">
					In order to buy your card(s), please ensure you have near account and
					funded with enough NEAR Coin.
				</p>
				<ol className="text-gray-100 ml-8" style={{ listStyleType: 'decimal' }}>
					<li>Click the "Buy" button on your desired card series</li>
					<li>
						Agree to the T&Cs Enter the amount of ETH you would like to spend
						purchasing cards of the selected series*
					</li>
					<li>
						Click buy & confirm the transaction in your wallet if needed You
						will be redirected to your wallet page with your purchased cards
						showing soon
					</li>
					<li>
						If you wish to purchase more cards, please go to the sale page
						through the top menu
					</li>
				</ol>
				<div className="text-center">
					<h1 className="text-center text-gray-100 font-bold text-3xl mt-8">
						Paras Litepaper
					</h1>
					<p className="text-gray-200">
						You can read paras litepaper{' '}
						<a
							href="https://www.dropbox.com/s/ir5nmhdjfi02cay/Paras%20Litepaper.pdf?dl=0"
							target="_blank"
							className="hover:text-white border-b-2 cursor-pointer"
						>
							here
						</a>
					</p>
				</div>
			</div>
			<Footer />
		</div>
	)
}

const SpecialCard = ({ tokenId, onClick, supply, emmision, period }) => {
	const [localToken, setLocalToken] = useState(null)
	const router = useRouter()

	useEffect(() => {
		fetchToken()
	}, [])

	const fetchToken = async () => {
		const res = await axios(`${process.env.API_URL}/tokens?tokenId=${tokenId}`)
		const token = (await res.data.data.results[0]) || null
		setLocalToken(token)
	}

	const onPressBuyNow = () => {
		onClick(localToken)
		router.push(
			{
				pathname: router.pathname,
				query: {
					...router.query,
					...{ tokenId: localToken?.tokenId },
					...{ prevAs: router.asPath },
				},
			},
			`/token/${localToken?.tokenId}`,
			{ shallow: true }
		)
	}

	const getPriceOriginal = (ownerships = []) => {
		// const _user = 'paras.near'
		const _user = 'hdriqi'
		const marketDataList = ownerships
			.filter((ownership) => ownership.marketData)
			.filter((ownership) => ownership.ownerId === _user)
			.map((ownership) => ownership.marketData.amount)
		return marketDataList[0]
	}

	return (
		<div className="relative m-4 md:m-0 md:w-1/3">
			<ReactTooltip
				effect={'solid'}
				className="bg-dark-primary-1 text-white px-2 py-4 w-56"
			/>
			<div className="absolute inset-0 m-auto overflow-hidden rounded-xl opacity-50">
				<Blurhash
					hash={
						localToken?.metadata.blurhash ||
						'UZ9ZtPzmpHv;R]ONJ6bKQ-l7Z.S_bow5$-nh'
					}
					width={`100%`}
					height={`100%`}
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
								special
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
					<div className="text-center">
						<p className="text-gray-400">Price</p>
						{getPriceOriginal(localToken?.ownerships) ? (
							<div className="mb-4">
								<p className="text-gray-100 text-4xl font-bold">
									{prettyBalance(
										getPriceOriginal(localToken?.ownerships),
										24,
										4
									)}{' '}
									Ⓝ
								</p>
							</div>
						) : (
							<div className="line-through text-red-600 mb-4 text-4xl font-bold">
								<span className="text-gray-100">SALE</span>
							</div>
						)}
						<div
							className="flex flex-col"
							data-tip={`Card supply will be released ${supply / 3}/day`}
						>
							<div className="flex text-white justify-center">
								<p className="text-gray-400 mr-1">Card Supply</p>
								<div>
									<a>
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
									</a>
								</div>
							</div>
							<p className="text-gray-100 mb-4 text-lg font-semibold">
								{supply} pcs
							</p>
						</div>
						<div
							className="flex text-white justify-center"
							data-tip={`Card available for purchase today`}
						>
							<p className="text-gray-400 mr-1">Card Available</p>
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
						<p className="text-gray-100 mb-4 text-lg font-semibold">50/100</p>
						<div
							className="flex text-white justify-center"
							data-tip="Holders of this card will receive exclusive airdrop incentives. Users will able to claim PARAS token via claim.paras.id"
							// data-tip={`Holders of SuperFarm series NFTs receive exclusive airdrop incentives in the form of SUPER. NFT holders will be able to claim SUPER tokens via a decentralized portal by simply holding NFTs in their wallets. Token claims will be tied to each NFT token, not the wallet itself, so once transferred the new holder can claim the remaining tokens.`}
						>
							<p className="text-gray-400 mr-1">Chances & Benefits</p>
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
						<p className="text-gray-100 text-lg">
							Emmision/pcs: {emmision} paras/week
						</p>
						<p className="text-gray-100 mb-12 text-lg">
							Period: {period}-weeks
						</p>
						<div className="mx-8">
							<button
								// disabled
								onClick={onPressBuyNow}
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
