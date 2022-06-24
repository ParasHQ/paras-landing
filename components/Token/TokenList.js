import { useEffect, useRef, useState } from 'react'
import Card from 'components/Card/Card'
import { parseImgUrl, prettyBalance, abbrNum } from 'utils/common'
import Link from 'next/link'
import useStore from 'lib/store'
import { useRouter } from 'next/router'
import JSBI from 'jsbi'
import InfiniteScroll from 'react-infinite-scroll-component'

import TokenDetailModal from 'components/Token/TokenDetailModal'
import { useIntl } from 'hooks/useIntl'
import CardListLoader from 'components/Card/CardListLoader'
import MarketTokenModal from 'components/Modal/MarketTokenModal'
import CardListLoaderSmall from 'components/Card/CardListLoaderSmall'
import useToken from 'hooks/useToken'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useToast } from 'hooks/useToast'
import axios from 'axios'
import WalletHelper from 'lib/WalletHelper'
import IconLove from 'components/Icons/component/IconLove'
import LoginModal from 'components/Modal/LoginModal'
import { trackLikeToken, trackUnlikeToken } from 'lib/ga'

const TokenList = ({
	name = 'default',
	tokens,
	fetchData,
	hasMore,
	displayType = 'large',
	volume,
	showRarityScore = false,
	showLike = false,
}) => {
	const store = useStore()
	const containerRef = useRef()
	const animValuesRef = useRef(store.marketScrollPersist[name])
	const { localeLn } = useIntl()
	const [tokenIsLiked, setTokenIsLiked] = useState({})

	useEffect(() => {
		animValuesRef.current = store.marketScrollPersist[name]
	}, [store.marketScrollPersist[name]])

	useEffect(() => {
		return () => {
			if (containerRef.current) {
				containerRef.current.removeEventListener('wheel', handleScroll)
			}
		}
	}, [containerRef, store.marketScrollPersist[name]])

	const handleScroll = (e) => {
		e.preventDefault()

		var rawData = e.deltaY ? e.deltaY : e.deltaX
		var mouseY = Math.floor(rawData)

		var animationValue = animValuesRef.current || 0
		var newAnimationValue = animationValue - mouseY

		animateScroll(newAnimationValue)
	}

	const animateScroll = (newAnimationValue) => {
		let max = containerRef.current.lastElementChild.scrollWidth
		let win = containerRef.current.offsetWidth

		var bounds = -(max - win)

		if (newAnimationValue > 0) {
			store.setMarketScrollPersist(name, 0)
		} else if (newAnimationValue < bounds) {
			fetchData()
			store.setMarketScrollPersist(name, bounds)
		} else {
			store.setMarketScrollPersist(name, newAnimationValue)
		}
	}

	return (
		<div ref={containerRef} className="rounded-md p-4 md:p-0">
			{tokens.length === 0 && !hasMore && (
				<div className="w-full">
					<div className="m-auto text-2xl text-gray-600 font-semibold py-32 text-center">
						<div className="w-40 m-auto">
							<img src="/cardstack.png" className="opacity-75" />
						</div>
						<p className="mt-4">{localeLn('NoCards')}</p>
					</div>
				</div>
			)}
			<InfiniteScroll
				dataLength={tokens.length}
				next={fetchData}
				hasMore={hasMore}
				loader={
					displayType === 'large' ? (
						<CardListLoader length={4} />
					) : (
						<CardListLoaderSmall length={6} />
					)
				}
				className="-mx-4"
			>
				<div className="flex flex-wrap select-none">
					{tokens.map((token, idx) => (
						<TokenSingle
							key={`${token.contract_id}::${token.token_series_id}/${token.token_id}-${displayType}-${idx}`}
							initialData={token}
							displayType={displayType}
							volume={token.volume || volume?.[idx]}
							showRarityScore={showRarityScore}
							showLike={showLike}
							tokenIsLiked={tokenIsLiked}
							setTokenIsLiked={setTokenIsLiked}
						/>
					))}
				</div>
			</InfiniteScroll>
		</div>
	)
}

export default TokenList

const TokenSingle = ({
	initialData,
	displayType = 'large',
	volume,
	showRarityScore,
	showLike,
	tokenIsLiked,
	setTokenIsLiked,
}) => {
	const currentUser = useStore((state) => state.currentUser)
	const { token, mutate } = useToken({
		key: `${initialData.contract_id}::${initialData.token_series_id}/${initialData.token_id}`,
		initialData: initialData,
		params: {
			lookup_likes: true,
			liked_by: currentUser,
		},
	})

	const store = useStore()
	const router = useRouter()
	const [activeToken, setActiveToken] = useState(null)
	const [modalType, setModalType] = useState(null)
	const [isLiked, setIsLiked] = useState(false)
	const [defaultLikes, setDefaultLikes] = useState(0)
	const [showLogin, setShowLogin] = useState(false)
	const { localeLn } = useIntl()
	const toast = useToast()
	const contractIdTokenSeriesId = `${token.contract_id}::${token.token_series_id}`

	const price =
		token.token?.amount && token.token?.bidder_list?.length !== 0
			? token.token?.amount
			: token.lowest_price || token.price
	const [isEndedTime, setIsEndedTime] = useState(false)

	const _showInfoUpdatingAuction = () => {
		toast.show({
			text: (
				<div className="text-sm text-white text-justify">
					<p>
						This auction data is being updated, please refresh the page periodically each minute.
					</p>
				</div>
			),
			type: 'updatingAuction',
			duration: null,
		})
	}

	useEffect(() => {
		countDownTimeAuction()
	}, [isEndedTime])

	useEffect(() => {
		if (token?.total_likes !== undefined) {
			if (token.likes) {
				setIsLiked(true)
			} else {
				setIsLiked(false)
			}

			setDefaultLikes(token?.total_likes)
		}
	}, [JSON.stringify(token)])

	useEffect(() => {
		if (tokenIsLiked[contractIdTokenSeriesId]?.liked === true) {
			setIsLiked(true)
			setDefaultLikes(tokenIsLiked[contractIdTokenSeriesId]?.total_liked ?? defaultLikes + 1)
		} else if (tokenIsLiked[contractIdTokenSeriesId]?.liked === false) {
			setIsLiked(false)
			setDefaultLikes(tokenIsLiked[contractIdTokenSeriesId]?.total_liked ?? defaultLikes - 1)
		} else {
			return
		}
	}, [tokenIsLiked])

	const convertTimeOfAuction = (date) => {
		const sliceNanoSec = String(date).slice(0, 13)

		if (sliceNanoSec !== 'undefined') {
			return sliceNanoSec
		}
	}

	const countDownTimeAuction = () => {
		const endedDate = convertTimeOfAuction(token?.ended_at)

		const timer = setInterval(() => {
			const startedDate = new Date().getTime()

			if (!isEndedTime) {
				let distance = parseInt(endedDate) - parseInt(startedDate)

				if (distance <= 0) {
					clearInterval(timer)
					setIsEndedTime(true)
				}
			}

			return
		}, 1000)
	}

	const onClickSeeDetails = async (choosenToken) => {
		const token = (await mutate()) || choosenToken
		let platform = navigator.userAgent.includes('iPhone')
		if (platform) {
			router.push(`/token/${token.contract_id}::${token.token_series_id}`)
			return
		}
		router.push(
			{
				pathname: router.pathname,
				query: {
					...router.query,
					tokenId: token.token_id,
					contractId: token.contract_id,
				},
			},
			`/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`,
			{
				shallow: true,
				scroll: false,
			}
		)
	}

	const onCloseModal = () => {
		setActiveToken(null)
		setModalType(null)
	}

	const actionButtonText = (token) => {
		if (token.owner_id === currentUser) {
			if (token.is_staked) {
				return localeLn('Unstake')
			}
			return localeLn('UpdateListing')
		}

		return token.price && !token?.is_auction && !isEndedTime
			? 'Buy Now'
			: token?.is_auction && !isEndedTime
			? 'Place a Bid'
			: isEndedTime
			? 'Auction Ends'
			: 'Place Offer'
	}

	const actionButtonClick = (token) => {
		const price = token.price

		setActiveToken(token)
		if (token.owner_id === currentUser) {
			if (token.is_staked) {
				router.push('https://stake.paras.id')
				return
			}
			setModalType('updatelisting')
		} else {
			setModalType(
				price && (!token?.is_auction || isEndedTime)
					? 'buy'
					: token?.is_auction && !isEndedTime
					? 'placebid'
					: 'offer'
			)
		}
	}

	const typeSale = () => {
		if (token?.is_auction && !isEndedTime) {
			return localeLn('OnAuction')
		} else if (token.lowest_price && token.metadata.copies > 1) {
			return localeLn('StartFrom')
		} else {
			return localeLn('OnSale')
		}
	}

	const checkBidder = () => {
		if (token?.bidder_list) {
			return 'Highest Bid'
		} else {
			return 'Starting Bid'
		}
	}

	const isCurrentBid = (type) => {
		let list = []
		token?.bidder_list?.map((item) => {
			if (type === 'bidder') list.push(item.bidder)
			else if (type === 'time') list.push(item.issued_at)
			else if (type === 'amount') list.push(item.amount)
		})
		return list[list.length - 1]
	}

	const likeToken = async (contract_id, token_series_id, source) => {
		if (!currentUser) {
			setShowLogin(true)
			return
		}

		const contractIdTokenSeriesIdState = {
			liked: true,
			total_liked: defaultLikes + 1,
		}
		const tokenIsLikedState = {
			...tokenIsLiked,
			[contractIdTokenSeriesId]: contractIdTokenSeriesIdState,
		}
		setTokenIsLiked(tokenIsLikedState)
		const params = {
			account_id: currentUser,
		}

		const res = await axios.put(
			`${process.env.V2_API_URL}/like/${contract_id}/${token_series_id}`,
			params,
			{
				headers: {
					authorization: await WalletHelper.authToken(),
				},
			}
		)

		if (res.status !== 200) {
			setIsLiked(false)
			setDefaultLikes(defaultLikes - 1)
			return
		}

		trackLikeToken(`${contract_id}::${token_series_id}`, source)
	}

	const unlikeToken = async (contract_id, token_series_id, source) => {
		if (!currentUser) {
			setShowLogin(true)
			return
		}

		const contractIdTokenSeriesIdState = {
			liked: false,
			total_liked: defaultLikes - 1,
		}
		const likedState = {
			...tokenIsLiked,
			[contractIdTokenSeriesId]: contractIdTokenSeriesIdState,
		}
		setTokenIsLiked(likedState)
		const params = {
			account_id: currentUser,
		}

		const res = await axios.put(
			`${process.env.V2_API_URL}/unlike/${contract_id}/${token_series_id}`,
			params,
			{
				headers: {
					authorization: await WalletHelper.authToken(),
				},
			}
		)

		if (res.status !== 200) {
			setIsLiked(true)
			setDefaultLikes(defaultLikes + 1)
			return
		}

		trackUnlikeToken(`${contract_id}::${token_series_id}`, source)
	}

	return (
		<>
			<TokenDetailModal tokens={[token]} isAuctionEnds={isEndedTime} />
			<MarketTokenModal
				useNFTModal
				activeToken={activeToken}
				onCloseModal={onCloseModal}
				modalType={modalType}
				setModalType={setModalType}
			/>
			<div
				className={`${
					displayType === `large` ? `w-full md:w-1/3 lg:w-1/4 p-4` : `w-1/2 md:w-1/4 lg:w-1/6 p-2`
				} flex-shrink-0 relative`}
			>
				<Link href={`/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`}>
					<a onClick={(e) => e.preventDefault()}>
						<div className="w-full m-auto">
							<Card
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
									edition_id: token.edition_id,
									collection: token.metadata.collection || token.contract_id,
									copies: token.metadata.copies,
									creatorId: token.metadata.creator_id || token.contract_id,
									is_creator: token.is_creator,
									description: token.metadata.description,
									royalty: token.royalty,
									attributes: token.metadata.attributes,
									mime_type: token.metadata.mime_type,
									is_auction: token?.is_auction,
									started_at: token?.started_at,
									ended_at: token?.ended_at,
									animation_url: token?.metadata?.animation_url,
								}}
								isAbleToLike
								onLike={() =>
									!isLiked &&
									likeToken(token.contract_id, token.token_series_id, 'double_click_likes')
								}
							/>
						</div>
					</a>
				</Link>
				<div className={`px-1 relative ${displayType === 'large' ? `mt-4` : `mt-2`}`}>
					<div className="block">
						<p className="text-gray-400 text-xs">{typeSale()}</p>
						{token?.is_auction && !isEndedTime && (
							<p className="text-gray-100 text-[9px] font-bold">{checkBidder()}</p>
						)}
						<div
							className={`text-gray-100 ${
								(displayType === 'large' && !token?.is_auction) || isEndedTime
									? `text-2xl`
									: displayType !== 'small' && token?.is_auction && !isEndedTime
									? 'text-lg -mt-.5 -mb-2'
									: displayType === 'small' && token?.is_auction && !isEndedTime
									? `text-base`
									: 'text-lg'
							}`}
						>
							{price || (token?.is_auction && !isEndedTime) ? (
								<div className="flex items-baseline space-x-1">
									<div className="truncate">
										{price === '0' && !token?.is_auction ? (
											localeLn('Free')
										) : price && token?.has_price && !isEndedTime ? (
											`${prettyBalance(
												token?.is_auction && !isEndedTime && token?.bidder_list?.length !== 0
													? isCurrentBid('amount') || price
													: price,
												24,
												4
											)} Ⓝ`
										) : (
											<div className="line-through text-red-600">
												<span className="text-gray-100">{localeLn('SALE')}</span>
											</div>
										)}
									</div>
									{price && !isEndedTime && (
										<div
											className={`${
												token?.is_auction ? 'text-[9px]' : 'text-xs'
											} text-gray-400 truncate`}
										>
											~ $
											{prettyBalance(
												JSBI.BigInt(
													token?.is_auction && token?.bidder_list?.length !== 0
														? isCurrentBid('amount') || price
														: price
												) * store.nearUsdPrice,
												24,
												2
											)}
										</div>
									)}
								</div>
							) : (
								<div className="line-through text-red-600">
									<span className="text-gray-100">{localeLn('SALE')}</span>
								</div>
							)}
						</div>
					</div>
					<div
						className={`${
							displayType === 'large' ? `block` : `flex gap-1`
						} text-right absolute top-0 right-0`}
					>
						{showRarityScore && !!token.metadata.score && (
							<p className="text-white opacity-80 md:text-sm" style={{ fontSize: 11 }}>
								Rarity Score {token.metadata?.score?.toFixed(2)}
							</p>
						)}
						{showLike && (
							<div className="inline-flex items-center">
								<div
									className="cursor-pointer"
									onClick={() => {
										isLiked
											? unlikeToken(token.contract_id, token.token_series_id, 'list')
											: likeToken(token.contract_id, token.token_series_id, 'list')
									}}
								>
									<IconLove
										size={displayType === 'large' ? 18 : 16}
										color={isLiked ? '#c51104' : 'transparent'}
										stroke={isLiked ? 'none' : 'white'}
									/>
								</div>
								<p className={`text-white ml-2 ${displayType === 'large' ? 'text-sm' : 'text-xs'}`}>
									{abbrNum(defaultLikes || 0, 1)}
								</p>
							</div>
						)}
					</div>

					{volume && (
						<div
							className={`${
								displayType === 'large' ? `block` : `flex flex-col`
							} text-right absolute top-0 right-0`}
						>
							<p
								className={`${
									displayType === 'large' ? `block` : `hidden`
								} text-white opacity-80 md:text-sm`}
								style={{ fontSize: 11 }}
							>
								Volume Total
							</p>
							<p
								className={`${
									displayType === 'large' ? `hidden` : `block`
								} text-white opacity-80 md:text-sm`}
								style={{ fontSize: 11 }}
							>
								Volume Total
							</p>
							<p className="text-white opacity-80 md:text-base">{formatNearAmount(volume)} Ⓝ</p>
						</div>
					)}
					<div className="flex justify-between md:items-baseline">
						{!token?.is_auction ||
						(currentUser !== token?.owner_id && isCurrentBid('bidder') !== currentUser) ? (
							<p
								className={`font-bold text-white ${
									isEndedTime && 'text-opacity-40'
								} cursor-pointer hover:opacity-80 ${
									displayType === 'large' ? `text-base md:text-base` : `text-sm md:text-sm`
								} mb-1 md:mb-0`}
								onClick={() =>
									isEndedTime ? _showInfoUpdatingAuction() : actionButtonClick(token)
								}
							>
								{actionButtonText(token)}
							</p>
						) : isCurrentBid('bidder') === currentUser ? (
							<p
								className={`font-bold text-white text-opacity-40 ${
									displayType === 'large' ? `text-base md:text-base` : `text-sm md:text-sm`
								} mb-1 md:mb-0`}
							>
								{`You're currently bid`}
							</p>
						) : !isEndedTime ? (
							<p
								className={`font-bold text-white text-opacity-40 ${
									displayType === 'large' ? `text-base md:text-base` : `text-sm md:text-sm`
								} mb-1 md:mb-0`}
							>
								Auction on going
							</p>
						) : (
							<p
								className={`font-bold text-white text-opacity-40 hover:text-opacity-60 cursor-pointer ${
									displayType === 'large' ? `text-base md:text-base` : `text-sm md:text-sm`
								} mb-1 md:mb-0`}
								onClick={_showInfoUpdatingAuction}
							>
								Auction Ends
							</p>
						)}
						<Link href={`/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`}>
							<a
								onClick={(e) => {
									e.preventDefault()
									onClickSeeDetails(token)
								}}
								className={`text-gray-300 underline ${
									displayType === 'large' ? `text-sm md:text-sm` : `text-xs md:text-xs`
								}`}
							>
								{displayType === 'large' ? 'See Details' : 'More'}
							</a>
						</Link>
					</div>
				</div>
			</div>
			<LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
		</>
	)
}
