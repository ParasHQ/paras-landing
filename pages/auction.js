import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'hooks/useIntl'
import Nav from 'components/Nav'
import axios from 'axios'
import TokenList from 'components/Token/TokenList'
import Footer from 'components/Footer'
import CardListLoader from 'components/Card/CardListLoader'
import { IconDownArrow } from 'components/Icons'

const Auction = () => {
	const { localeLn } = useIntl()
	const [token, setToken] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [sortBy, setSortBy] = useState('urgent')
	const [showSortModal, setShowSortModal] = useState(false)
	const sortModalRef = useRef()

	useEffect(() => {
		fetchAuctionToken(true, sortBy)
	}, [])

	const fetchAuctionToken = async (initial = false, _sortBy) => {
		const _page = initial ? 0 : page
		const _auctionToken = initial ? [] : token
		const auctionParams = {
			is_auction: true,
			__sort: _sortBy === 'urgent' ? `ended_at::1` : `ended_at::-1`,
			__limit: 10,
			__skip: _page * 10,
		}
		if (!hasMore) {
			return
		}
		setIsLoading(true)
		const resp = await axios.get(`${process.env.V2_API_URL}/token`, {
			params: auctionParams,
		})
		const newAuctionToken = [..._auctionToken, ...resp.data.data.results]
		setToken(newAuctionToken)
		setPage(_page + 1)
		if (resp.data.data.results.length === 0) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsLoading(false)
	}

	const onChangeSort = (sort) => {
		setSortBy(sort)
		fetchAuctionToken(true, sort)
	}

	return (
		<div className="min-h-screen bg-black">
			<div
				className="fixed inset-0 opacity-75"
				style={{
					zIndex: 0,
					backgroundImage: `url('/bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			/>
			<Head>
				<title>Live Auction - Paras</title>
				<meta
					name="description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
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
			<Nav />
			<div className="max-w-4xl relative m-auto py-12 px-4">
				<div className="flex items-center justify-center">
					<p className="cursor-pointer text-2xl md:text-4xl text-white opacity-75 font-bold">
						{localeLn('LiveAuction')}
					</p>
				</div>
				<div className="w-full py-2 md:py-4 flex md:justify-end">
					<div className="relative" ref={sortModalRef}>
						<div
							className="rounded-l-lg rounded-r-lg cursor-pointer bg-gray-800 flex items-center justify-center p-2 w-48 md:w-64"
							onClick={() => setShowSortModal(!showSortModal)}
						>
							<p className="text-sm text-white mr-1">
								Sort By:{' '}
								<span className="font-semibold text-xs md:text-sm">
									{sortBy === 'urgent' ? `Time Urgent` : `Time Non-Urgent`}
								</span>
							</p>
							<IconDownArrow size={14} color={`#fff`} />
						</div>
						{showSortModal && (
							<div className="absolute max-w-full mt-1 z-30 px-5 py-2 rounded-lg text-lg text-gray-100 w-full bg-gray-800">
								<p
									className={`opacity-50 cursor-pointer select-none text-sm mb-2
										${sortBy === 'urgent' && 'font-semibold opacity-100'}
									`}
									onClick={() => onChangeSort('urgent')}
								>
									Time Urgent
								</p>
								<p
									className={`opacity-50 cursor-pointer select-none text-sm mt-2
										${sortBy === 'non-urgent' && 'font-semibold opacity-100'}
									`}
									onClick={() => onChangeSort('non-urgent')}
								>
									Time Non-Urgent
								</p>
							</div>
						)}
					</div>
				</div>
				<div className="my-3 p-4 md:p-8 w-full border-2 border-gray-500 border-dashed rounded-md">
					{isLoading ? (
						<CardListLoader length={4} />
					) : (
						<>
							<div className="block md:hidden">
								<TokenList tokens={token} displayType="small" />
							</div>
							<div className="hidden md:block">
								<TokenList tokens={token} />
							</div>
						</>
					)}
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default Auction
