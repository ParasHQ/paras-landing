import { animated } from 'react-spring'
import { useEffect, useRef } from 'react'
import Card from '../components/Card'
import { prettyBalance } from '../utils/common'
import Link from 'next/link'
import useStore from '../store'
import { useRouter } from 'next/router'
import JSBI from 'jsbi'
import InfiniteScroll from 'react-infinite-scroll-component'
import CardDetailModal from './CardDetailModal'
import CardListLoader from './CardListLoader'

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

	const _getLowestPrice = (ownerships) => {
		const marketDataList = ownerships
			.filter((ownership) => ownership.marketData)
			.map((ownership) => ownership.marketData.amount)
			.sort((a, b) => a - b)

		return marketDataList[0]
	}

	const _getUserOwnership = (userId, ownership) => {
		return ownership.some((ownership) => ownership.ownerId === userId)
	}

	return (
		<div
			ref={containerRef}
			className="overflow-x-hidden border-2 border-dashed border-gray-800 rounded-md"
		>
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
				<animated.div className="flex flex-wrap select-none ">
					{tokens.map((token) => {
						return (
							<div
								key={token.tokenId}
								className={`w-full md:w-1/3 lg:w-1/4 flex-shrink-0 p-8 relative ${
									toggleOwnership &&
									!_getUserOwnership(store.currentUser, token.ownerships) &&
									'opacity-25'
								}`}
							>
								<div className="w-full m-auto">
									<Card
										imgUrl={token.metadata.image}
										imgBlur={token.metadata.blurhash}
										token={{
											name: token.metadata.name,
											collection: token.metadata.collection,
											description: token.metadata.description,
											creatorId: token.creatorId,
											supply: token.supply,
											tokenId: token.tokenId,
											createdAt: token.createdAt,
										}}
										initialRotate={{
											x: 0,
											y: 0,
										}}
									/>
								</div>
								<div className="text-center">
									<div className="mt-8">
										<div className="p-2">
											<p className="text-gray-400 text-xs">Start From</p>
											<div className="text-gray-100 text-2xl">
												{_getLowestPrice(token.ownerships) ? (
													<div>
														<div>
															{prettyBalance(
																_getLowestPrice(token.ownerships),
																24,
																4
															)}{' '}
															Ⓝ
														</div>
														<div className="text-sm text-gray-400">
															~ $
															{prettyBalance(
																JSBI.BigInt(
																	_getLowestPrice(token.ownerships) *
																		store.nearUsdPrice
																),
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
								<div className="text-center mt-2 text-sm">
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
									</Link>
								</div>
							</div>
						)
					})}
				</animated.div>
			</InfiniteScroll>
		</div>
	)
}

export default CardList
