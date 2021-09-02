import { animated } from 'react-spring'
import { useEffect, useRef } from 'react'
import Card from '../components/Card'
import { parseImgUrl, prettyBalance } from '../utils/common'
import Link from 'next/link'
import useStore from '../lib/store'
import { useRouter } from 'next/router'
import JSBI from 'jsbi'
import InfiniteScroll from 'react-infinite-scroll-component'
import CardDetailModal from './CardDetailModal'
import CardListLoader from './CardListLoader'

import _tokens from '../dummy/tokens.json'

const CardList = ({
	name = 'default',
	tokens,
	fetchData,
	hasMore,
	toggleOwnership = false,
}) => {
	const store = useStore()
	const router = useRouter()
	const containerRef = useRef()
	const animValuesRef = useRef(store.marketScrollPersist[name])

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

	const _getUserOwnership = (userId, ownership) => {
		return ownership.some((ownership) => ownership.ownerId === userId)
	}

	return (
		<div ref={containerRef} className="rounded-md">
			<CardDetailModal tokens={tokens} />
			{tokens.length === 0 && !hasMore && (
				<div className="w-full">
					<div className="m-auto text-2xl text-gray-600 font-semibold py-32 text-center">
						<div className="w-40 m-auto">
							<img src="/cardstack.png" className="opacity-75" />
						</div>
						<p className="mt-4">No Cards</p>
					</div>
				</div>
			)}
			<InfiniteScroll
				dataLength={tokens.length}
				next={fetchData}
				hasMore={hasMore}
				loader={<CardListLoader />}
			>
				<animated.div className="flex flex-wrap select-none -mx-4">
					{_tokens.map((token) => {
						return (
							<div
								key={token.tokenId}
								className={`w-full md:w-1/3 lg:w-1/4 flex-shrink-0 p-4 relative ${
									toggleOwnership &&
									!_getUserOwnership(store.currentUser, token.ownerships) &&
									'opacity-25'
								}`}
							>
								<div className="w-full m-auto">
									<Card
										imgUrl={parseImgUrl(token.metadata.media, null, {
											width: `600`,
											useOriginal: true,
										})}
										onClick={() => {
											router.push(
												{
													pathname: router.pathname,
													query: {
														...router.query,
														...{ tokenId: token.tokenId },
														...{ prevAs: router.asPath },
													},
												},
												`/token/${token.token_series_id}`
												// {
												// 	shallow: true,
												// 	scroll: false,
												// }
											)
										}}
										imgBlur={token.metadata.blurhash}
										token={{
											title: token.metadata.title,
											collection:
												token.metadata.collection || token.contract_id,
											copies: token.metadata.copies,
											creatorId: token.metadata.creator_id || token.contract_id,
										}}
									/>
								</div>
								<div className="text-center">
									<div className="mt-4">
										<div className="p-2">
											<p className="text-gray-400 text-xs">Start From</p>
											<div className="text-gray-100 text-xl">
												{token.price ? (
													<div>
														<div>{prettyBalance(token.price, 24, 4)} Ⓝ</div>
														<div className="text-xs text-gray-400">
															~ $
															{prettyBalance(
																JSBI.BigInt(token.price * store.nearUsdPrice),
																24,
																4
															)}
														</div>
													</div>
												) : (
													<div className="line-through text-red-600">
														<span className="text-gray-100">SALE</span>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
								{/* <div className="text-center mt-2 text-xs pb-4">
									<Link
										href={{
											pathname: router.pathname,
											query: {
												...router.query,
												...{ tokenId: token.tokenId },
												...{ prevAs: router.asPath },
											},
										}}
										as={`/token/${token.tokenId}`}
										scroll={false}
										shallow
									>
										<a className="inline-block text-gray-100 cursor-pointer font-semibold border-b-2 border-gray-100">
											See Details
										</a>
									</Link> */}
								{/* </div> */}
							</div>
						)
					})}
				</animated.div>
			</InfiniteScroll>
		</div>
	)
}

export default CardList
