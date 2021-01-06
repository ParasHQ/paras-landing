import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import useStore from '../store'
import { parseImgUrl, prettyTruncate } from '../utils/common'
import Head from 'next/head'
import Footer from '../components/Footer'

const { default: CardList } = require('../components/CardList')
const { default: Nav } = require('../components/Nav')

const CopyLink = ({ children, link, afterCopy }) => {
	const [isComponentMounted, setIsComponentMounted] = useState(false)
	const copyLinkRef = useRef()

	useEffect(() => {
		setIsComponentMounted(true)
	}, [])

	const _copyLink = () => {
		const copyText = copyLinkRef.current
		copyText.select()
		copyText.setSelectionRange(0, 99999)
		document.execCommand('copy')

		if (typeof afterCopy === 'function') {
			afterCopy()
		}
	}

	return (
		<div onClick={(_) => _copyLink()}>
			{isComponentMounted && (
				<div
					className="absolute z-0 opacity-0"
					style={{
						top: `-1000`,
					}}
				>
					<input ref={copyLinkRef} readOnly type="text" value={link} />
				</div>
			)}
			<div className="relative z-10">{children}</div>
		</div>
	)
}

const ProfileDetail = ({
	creatorTokens,
	ownerTokens,
	userProfile,
	accountId,
}) => {
	const store = useStore()
	const router = useRouter()

	const scrollCollection = `${router.query.id}::collection`
	const scrollCreation = `${router.query.id}::creation`

	const oTokens = store.marketDataPersist[scrollCollection]
	const cTokens = store.marketDataPersist[scrollCreation]

	const [isCopied, setIsCopied] = useState(false)

	const [cPage, setCPage] = useState(1)
	const [oPage, setOPage] = useState(1)

	const [cHasMore, setCHasMore] = useState(true)
	const [oHasMore, setOHasMore] = useState(true)

	const [activeTab, setActiveTab] = useState('collection')

	const [isFetching, setIsFetching] = useState(false)

	useEffect(() => {
		store.setMarketDataPersist(scrollCollection, ownerTokens)
		store.setMarketDataPersist(scrollCreation, creatorTokens)

		return () => {
			store.setMarketScrollPersist(scrollCollection, 0)
			store.setMarketScrollPersist(scrollCreation, 0)
			store.setMarketDataPersist(scrollCollection, [])
			store.setMarketDataPersist(scrollCreation, [])
		}
	}, [router.query.id])

	const fetchOwnerTokens = async () => {
		if (!oHasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			`${process.env.API_URL}/tokens?ownerId=${router.query.id}&__skip=${
				oPage * 5
			}&__limit=5`
		)
		const newData = await res.data.data

		const newTokens = [...oTokens, ...newData.results]
		store.setMarketDataPersist(scrollCollection, newTokens)
		setOPage(oPage + 1)
		if (newData.results.length === 0) {
			setOHasMore(false)
		} else {
			setOHasMore(true)
		}
		setIsFetching(false)
	}

	const fetchCreatorTokens = async () => {
		if (!cHasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			`${process.env.API_URL}/tokens?creatorId=${router.query.id}&__skip=${
				cPage * 5
			}&__limit=5`
		)
		const newData = await res.data.data

		const newTokens = [...cTokens, ...newData.results]
		store.setMarketDataPersist(scrollCreation, newTokens)
		setCPage(cPage + 1)
		if (newData.results.length === 0) {
			setCHasMore(false)
		} else {
			setCHasMore(true)
		}
		setIsFetching(false)
	}

	const headMeta = {
		title: `${accountId} — Paras`,
		description: `See digital card collectibles and creations from ${accountId}. ${
			userProfile.bio || ''
		}`,
		image: userProfile.imgUrl
			? `${process.env.API_URL}/socialCard/avatar/${
					userProfile.imgUrl.split('://')[1]
			  }`
			: `https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png`,
	}
	return (
		<div
			className="min-h-screen bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Head>
				<title>{headMeta.title}</title>
				<meta name="description" content={headMeta.description} />

				<meta name="twitter:title" content={headMeta.title} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta name="twitter:description" content={headMeta.description} />
				<meta name="twitter:image" content={headMeta.image} />
				<meta property="og:type" content="website" />
				<meta property="og:title" content={headMeta.title} />
				<meta property="og:site_name" content={headMeta.title} />
				<meta property="og:description" content={headMeta.description} />
				<meta property="og:url" content="https://paras.id" />
				<meta property="og:image" content={headMeta.image} />
			</Head>
			<Nav />

			<div className="max-w-6xl py-12 px-4 relative m-auto">
				<div className="flex flex-col items-center justify-center">
					<div className="w-32 h-32 rounded-full overflow-hidden bg-primary">
						<img
							src={parseImgUrl(userProfile.imgUrl)}
							className="object-cover"
						/>
					</div>
					<div className="mt-4 max-w-sm text-center overflow-hidden">
						<div className="flex items-center justify-center">
							<h4
								className="text-gray-100 font-bold truncate"
								title={router.query.id}
							>
								{' '}
								{prettyTruncate(router.query.id, 12, 'address')}
							</h4>
							<div title="Copy Account ID" className="relative cursor-pointer pl-4 flex-grow-0">
								<CopyLink
									link={`${router.query.id}`}
									afterCopy={() => {
										setIsCopied(true)
										setTimeout(() => {
											setIsCopied(false)
										}, 2500)
									}}
								>
									{isCopied ? (
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M9.70711 14.2929L19 5L20.4142 6.41421L9.70711 17.1213L4 11.4142L5.41421 10L9.70711 14.2929Z"
												fill="white"
											/>
										</svg>
									) : (
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M10 2H20C21.1523 2 22 2.84772 22 4V14C22 15.1523 21.1523 16 20 16H16V20C16 21.1523 15.1523 22 14 22H4C2.84772 22 2 21.1523 2 20V10C2 8.84772 2.84772 8 4 8H8V4C8 2.84772 8.84772 2 10 2ZM8 10H4V20H14V16H10C8.84772 16 8 15.1523 8 14V10ZM10 4V14H20V4H10Z"
												fill="white"
											/>
										</svg>
									)}
								</CopyLink>
							</div>
						</div>
						<p className="mt-2 text-gray-300 whitespace-pre-line">
							{userProfile.bio?.replace(/\n\s*\n\s*\n/g, '\n\n')}
						</p>
						<a
							href="https://www.github.com/ahnafalfariza"
							target="_blank"
							className="cursor-pointer italic"
						>
							<p className="mt-1 text-gray-400 text-sm whitespace-pre-line">
								{/* {userProfile.bio?.replace(/\n\s*\n\s*\n/g, '\n\n')} */}
								github.com/ahnafalfariza
							</p>
						</a>
					</div>
				</div>
				<div className="flex justify-center mt-4">
					<div className="flex -mx-4">
						<div
							className="px-4 relative"
							onClick={(_) => setActiveTab('collection')}
						>
							<h4 className="text-gray-100 font-bold cursor-pointer">
								Collection
							</h4>
							{activeTab === 'collection' && (
								<div
									className="absolute left-0 right-0"
									style={{
										bottom: `-.25rem`,
									}}
								>
									<div className="mx-auto w-8 h-1 bg-gray-100"></div>
								</div>
							)}
						</div>
						<div
							className="px-4 relative"
							onClick={(_) => setActiveTab('creation')}
						>
							<h4 className="text-gray-100 font-bold cursor-pointer">
								Creation
							</h4>
							{activeTab === 'creation' && (
								<div
									className="absolute left-0 right-0"
									style={{
										bottom: `-.25rem`,
									}}
								>
									<div className="mx-auto w-8 h-1 bg-gray-100"></div>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="mt-8">
					{activeTab === 'collection' && oTokens && (
						<CardList
							name={scrollCollection}
							tokens={oTokens}
							fetchData={fetchOwnerTokens}
							hasMore={oHasMore}
						/>
					)}
					{activeTab === 'creation' && cTokens && (
						<CardList
							name={scrollCreation}
							tokens={cTokens}
							fetchData={fetchCreatorTokens}
							hasMore={cHasMore}
						/>
					)}
				</div>
			</div>
			<Footer />
		</div>
	)
}

export async function getServerSideProps({ params }) {
	const creatorRes = await axios(
		`${process.env.API_URL}/tokens?creatorId=${params.id}&__limit=5`
	)
	const ownerRes = await axios(
		`${process.env.API_URL}/tokens?ownerId=${params.id}&__limit=5`
	)
	const profileRes = await axios(
		`${process.env.API_URL}/profiles?accountId=${params.id}`
	)
	const creatorTokens = await creatorRes.data.data.results
	const ownerTokens = await ownerRes.data.data.results
	const userProfile = (await profileRes.data.data.results[0]) || {}

	return {
		props: { creatorTokens, ownerTokens, userProfile, accountId: params.id },
	}
}

export default ProfileDetail
