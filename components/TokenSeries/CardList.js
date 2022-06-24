import { useEffect, useRef, useState } from 'react'
import Card from 'components/Card/Card'
import { parseImgUrl, prettyBalance, abbrNum } from 'utils/common'
import Link from 'next/link'
import useStore from 'lib/store'
import { useRouter } from 'next/router'
import JSBI from 'jsbi'
import InfiniteScroll from 'react-infinite-scroll-component'
import axios from 'axios'
import WalletHelper from 'lib/WalletHelper'

import { useIntl } from 'hooks/useIntl'
import TokenSeriesDetailModal from './TokenSeriesDetailModal'
import CardListLoader from 'components/Card/CardListLoader'
import TokenDetailModal from 'components/Token/TokenDetailModal'
import MarketTokenModal from 'components/Modal/MarketTokenModal'
import CardListLoaderSmall from 'components/Card/CardListLoaderSmall'
import useTokenSeries from 'hooks/useTokenSeries'
import { useToast } from 'hooks/useToast'

import IconLove from 'components/Icons/component/IconLove'
import LoginModal from 'components/Modal/LoginModal'
import { trackLikeToken, trackUnlikeToken } from 'lib/ga'

const CardList = ({
	name = 'default',
	tokens,
	fetchData,
	hasMore,
	profileCollection,
	type,
	displayType = 'large',
	showLike = false,
}) => {
	const store = useStore()
	const containerRef = useRef()
	const animValuesRef = useRef(store.marketScrollPersist[name])
	const { localeLn } = useIntl()

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
					{tokens.map((_token, idx) => (
						<TokenSeriesSingle
							key={`${_token.contract_id}::${_token.token_series_id}-${displayType}-${idx}`}
							_token={_token}
							profileCollection={profileCollection}
							displayType={displayType}
							type={type}
							showLike={showLike}
						/>
					))}
				</div>
			</InfiniteScroll>
		</div>
	)
}

export default CardList

const TokenSeriesSingle = ({
	_token,
	profileCollection,
	type,
	displayType = 'large',
	showLike,
}) => {
	const currentUser = useStore((state) => state.currentUser)
	const { token, mutate } = useTokenSeries({
		key: `${_token.contract_id}::${_token.token_series_id}`,
		initialData: _token,
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

	const price =
		token.token?.amount && token.token?.bidder_list && token.token?.bidder_list.length !== 0
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
		if (token.total_likes !== undefined) {
			if (token.likes) {
				setIsLiked(true)
			} else {
				setIsLiked(false)
			}

			setDefaultLikes(token.total_likes)
		}
	}, [JSON.stringify(token)])

	const convertTimeOfAuction = (date) => {
		const sliceNanoSec = String(date).slice(0, 13)

		if (sliceNanoSec !== 'undefined') {
			return sliceNanoSec
		}
	}

	const countDownTimeAuction = () => {
		const endedDate = convertTimeOfAuction(token.token?.ended_at)

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

	const onClickSeeDetails = async (choosenToken, additionalQuery) => {
		const token = (await mutate()) || choosenToken
		const lookupToken = token?.token
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
					...additionalQuery,
					contractId: token.contract_id,
					tokenSeriesId: token.token_series_id,
					tokenId: lookupToken?.token_id || '',
				},
			},
			`/token/${token.contract_id}::${token.token_series_id}/${lookupToken?.token_id || ''}`,
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
		const price = token.lowest_price || token.price

		if (token.is_non_mintable && token.total_mint === token.metadata.copies) {
			if (token.token && token.token.owner_id === currentUser) {
				return localeLn('UpdateListing')
			} else {
				return price && !token.token?.is_auction && !isEndedTime
					? 'Buy Now'
					: token.token?.is_auction && !isEndedTime
					? 'Place a Bid'
					: isEndedTime
					? 'Auction Ends'
					: 'Place Offer'
			}
		} else if (
			currentUser === token.metadata.creator_id ||
			(!token.metadata.creator_id && currentUser === token.contract_id)
		) {
			return localeLn('UpdatePrice')
		} else if (token.token && token.token.owner_id === currentUser) {
			return localeLn('UpdateListing')
		}

		return price && !token.token?.is_auction && !isEndedTime
			? 'Buy Now'
			: token.token?.is_auction && !isEndedTime
			? 'Place a Bid'
			: isEndedTime
			? 'Auction Ends'
			: 'Place Offer'
	}

	const actionButtonClick = (token) => {
		const price = token.lowest_price || token.price

		setActiveToken(token)
		// Primary Sales Sold Out
		if (token.is_non_mintable && token.total_mint === token.metadata.copies) {
			// Multiple Edition
			if (token.token === undefined && token.lowest_price) {
				onClickSeeDetails(token, { tab: 'owners' })
			}
			// 1 of 1 Edition, owned by current user
			else if (token.token && token.token.owner_id === currentUser) {
				setModalType('updatelisting')
			}
			// 1 of 1 Edition
			else {
				setModalType(
					price && (!token.token?.is_auction || isEndedTime)
						? 'buy'
						: token.token?.is_auction && !isEndedTime
						? 'placebid'
						: 'offer'
				)
			}
		} else if (
			currentUser === token.metadata.creator_id ||
			(!token.metadata.creator_id && currentUser === token.contract_id) ||
			(token.token && token.token.owner_id === currentUser)
		) {
			setModalType('updatelisting')
		} else if (token.price === null && token.token === undefined && token.lowest_price) {
			onClickSeeDetails(token, { tab: 'owners' })
		} else {
			setModalType(
				price && !token.token?.is_auction ? 'buy' : token.token?.is_auction ? 'placebid' : 'offer'
			)
		}
	}

	const typeSale = () => {
		if (token.token?.is_auction && !isEndedTime) {
			return localeLn('OnAuction')
		} else if (token.lowest_price && token.metadata.copies > 1) {
			return localeLn('StartFrom')
		} else {
			return localeLn('OnSale')
		}
	}

	const checkBidder = () => {
		if (token.token?.bidder_list && token.token?.bidder_list.length !== 0) {
			return 'Highest Bid'
		} else {
			return 'Starting Bid'
		}
	}

	const isCurrentBid = (type) => {
		let list = []
		token.token?.bidder_list?.map((item) => {
			if (type === 'bidder') list.push(item.bidder)
			else if (type === 'time') list.push(item.issued_at)
			else if (type === 'amount') list.push(item.amount)
		})
		const currentBid = list.reverse()

		return currentBid[0]
	}

	const likeToken = async (contract_id, token_series_id, source) => {
		if (!currentUser) {
			setShowLogin(true)
			return
		}

		setIsLiked(true)
		setDefaultLikes(defaultLikes + 1)
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

		setIsLiked(false)
		setDefaultLikes(defaultLikes - 1)
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
			<TokenSeriesDetailModal tokens={[token]} isAuctionEnds={isEndedTime} />
			<TokenDetailModal tokens={[token]} isAuctionEnds={isEndedTime} />
			<MarketTokenModal
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
				<Link href={`/token/${token.contract_id}::${token.token_series_id}`}>
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
								profileCollection={profileCollection}
								type={type}
								displayType={displayType}
								isAbleToLike
								onLike={() =>
									!isLiked &&
									likeToken(token.contract_id, token.token_series_id, 'double_click_list')
								}
							/>
						</div>
					</a>
				</Link>
				<div className={`px-1 relative ${displayType === 'large' ? `mt-4` : `mt-2`}`}>
					<div className="block">
						<p className="text-gray-400 text-xs">{typeSale()}</p>
						{token.token?.is_auction && !isEndedTime && (
							<p className="text-gray-100 text-[9px] font-bold">{checkBidder()}</p>
						)}
						<div
							className={`text-gray-100 ${
								(displayType === 'large' && !token.token?.is_auction) || isEndedTime
									? `text-2xl`
									: displayType !== 'small' && token.token?.is_auction && !isEndedTime
									? 'text-lg -mt-.5 -mb-2'
									: displayType === 'small' && token.token?.is_auction && !isEndedTime
									? `text-base`
									: 'text-lg'
							}`}
						>
							{price || (token.token?.is_auction && !isEndedTime) ? (
								<div className="flex items-baseline space-x-1">
									<div className="truncate">
										{price === '0' && !token.token?.is_auction ? (
											localeLn('Free')
										) : (price && token.token?.has_price && !isEndedTime) ||
										  (token.lowest_price && !isEndedTime) ? (
											`${prettyBalance(
												token.token?.is_auction && token.token?.bidder_list?.length !== 0
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
												token.token?.is_auction ? 'text-[9px]' : 'text-xs'
											} text-gray-400 truncate`}
										>
											~ $
											{prettyBalance(
												JSBI.BigInt(
													token.token?.is_auction && token.token?.bidder_list?.length !== 0
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
							displayType === 'large' ? `flex gap-1` : `flex gap-1`
						} text-right absolute top-0 right-0 flex-col items-end`}
					>
						{type === 'collection' && !!token.metadata.score && (
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
								<p className={`text-white ml-1 ${displayType === 'large' ? 'text-sm' : 'text-xs'}`}>
									{abbrNum(defaultLikes || 0, 1)}
								</p>
							</div>
						)}
					</div>
					<div className="flex justify-between md:items-baseline">
						{!token.token?.is_auction ||
						(currentUser !== token.token?.owner_id && isCurrentBid('bidder') !== currentUser) ? (
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
						) : isCurrentBid('bidder') === currentUser && !isEndedTime ? (
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
								className={`font-bold text-white text-opacity-40 hover:opacity-80 cursor-pointer ${
									displayType === 'large' ? `text-base md:text-base` : `text-sm md:text-sm`
								} mb-1 md:mb-0`}
								onClick={_showInfoUpdatingAuction}
							>
								Auction Ends
							</p>
						)}
						<Link href={`/token/${token.contract_id}::${token.token_series_id}`}>
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
