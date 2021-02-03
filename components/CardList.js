import { useSpring, animated } from 'react-spring'
import { useEffect, useRef, useState } from 'react'
import Card from '../components/Card'
import { prettyBalance } from '../utils/common'
import Link from 'next/link'
import useStore from '../store'
import { useRouter } from 'next/router'
import JSBI from 'jsbi'
import InfiniteScroll from 'react-infinite-scroll-component'
import CardDetailModal from './CardDetailModal'

const CardList = ({ name = 'default', tokens, fetchData, hasMore }) => {
	const store = useStore()
	const router = useRouter()
	const containerRef = useRef()
	const [mouseDown, setMouseDown] = useState(null)
	const [touchStart, setTouchStart] = useState(null)
	const animValuesRef = useRef(store.marketScrollPersist[name])

	const props = useSpring({
		transform: `translate3d(${store.marketScrollPersist[name] || 0}px, 0,0)`,
	})

	useEffect(() => {
		animValuesRef.current = store.marketScrollPersist[name]
	}, [store.marketScrollPersist[name]])

	useEffect(() => {
		document.body.addEventListener('mouseup', handleMouseUp)
		document.body.addEventListener('touchend', handleTouchEnd)

		return () => {
			document.body.removeEventListener('mouseup', handleMouseUp)
			document.body.removeEventListener('touchend', handleTouchEnd)
		}
	}, [])

	useEffect(() => {
		if (containerRef) {
			// containerRef.current.addEventListener('wheel', handleScroll, {
			// 	passive: false,
			// })
		}

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

		// console.log(containerRef)
		if (newAnimationValue > 0) {
			// containerRef.current.scrollLeft = 0
			store.setMarketScrollPersist(name, 0)
		} else if (newAnimationValue < bounds) {
			fetchData()
			// containerRef.current.scrollLeft = bounds
			store.setMarketScrollPersist(name, bounds)
		} else {
			// containerRef.current.scrollLeft = -1 * newAnimationValue
			store.setMarketScrollPersist(name, newAnimationValue)
		}
	}

	const handleMouseDown = (e) => {
		setMouseDown({
			x: e.pageX,
			y: e.pageY,
		})
	}

	const handleMouseMove = (e) => {
		if (mouseDown) {
			const diffX = mouseDown.x - e.pageX

			const animationValue = animValuesRef.current || 0

			animateScroll(animationValue - diffX)
			setMouseDown({
				x: e.pageX,
				y: e.pageY,
			})
		}
	}

	const handleMouseUp = (e) => {
		setMouseDown(null)
	}

	const handleTouchStart = (e) => {
		setTouchStart({
			x: e.touches[0].pageX,
			y: e.touches[0].pageY,
		})
	}

	const handleTouchMove = (e) => {
		if (touchStart) {
			const diffX = touchStart.x - e.touches[0].pageX

			const animationValue = animValuesRef.current || 0
			animateScroll(animationValue - diffX * 2.5)
			setTouchStart({
				x: e.touches[0].pageX,
				y: e.touches[0].pageY,
			})
		}
	}

	const handleTouchEnd = () => {
		setTouchStart(null)
	}

	const _getLowestPrice = (ownerships) => {
		const marketDataList = ownerships
			.filter((ownership) => ownership.marketData)
			.map((ownership) => ownership.marketData.amount)
			.sort((a, b) => a - b)

		return marketDataList[0]
	}

	return (
		<div
			ref={containerRef}
			// onMouseDown={handleMouseDown}
			// onMouseUp={handleMouseUp}
			// onMouseMove={handleMouseMove}
			// onTouchStart={handleTouchStart}
			// onTouchEnd={handleTouchEnd}
			// onTouchMove={handleTouchMove}
			className="overflow-x-hidden border-2 border-dashed border-gray-800 rounded-md"
		>
			<CardDetailModal tokens={tokens} />
			{tokens.length === 0 && (
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
			>
				<animated.div
					className="flex flex-wrap select-none "
					// style={props}
				>
					{tokens.map((token, idx) => {
						return (
							<div
								key={idx}
								className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-8 lg:p-12 relative"
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
										<p className="inline-block text-gray-100 cursor-pointer font-semibold border-b-2 border-gray-100">
											See Details
										</p>
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
