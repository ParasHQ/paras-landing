import { useSpring, animated } from 'react-spring'
import { useEffect, useRef, useState } from 'react'
import Card from '../components/Card'
import { prettyBalance } from '../utils/common'
import Link from 'next/link'
import useStore from '../store'
import { useRouter } from 'next/router'
import Modal from './Modal'
import CardDetail from './CardDetail'

const CardList = ({ name = 'default', tokens, fetchData }) => {
	const store = useStore()
	const router = useRouter()
	const containerRef = useRef()
	const [mouseDown, setMouseDown] = useState(null)
	const [touchStart, setTouchStart] = useState(null)
	const animValuesRef = useRef(store.marketScrollPersist[name])
	const [activeToken, setActiveToken] = useState(null)

	const props = useSpring({
		transform: `translate3d(${store.marketScrollPersist[name] || 0}px, 0,0)`,
	})

	useEffect(() => {
		animValuesRef.current = store.marketScrollPersist[name]
	}, [store.marketScrollPersist[name]])

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

	const closeCardDetail = () => {
		router.push(router.query.prevAs)
	}

	useEffect(() => {
		if (router.query.tokenId) {
			const token = tokens.find(
				(token) => token.tokenId === router.query.tokenId
			)
			setActiveToken(token)
		}
		else {
			setActiveToken(null)
		}
	}, [router.query])

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
			animateScroll(animationValue - diffX)
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
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseMove={handleMouseMove}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
			onTouchMove={handleTouchMove}
			className="overflow-x-hidden border-2 border-dashed border-gray-800 rounded-md"
		>
			{activeToken && (
				<Modal close={(_) => closeCardDetail(null)}>
					<div className="max-w-5xl m-auto w-full relative">
						<div className="absolute top-0 left-0 p-4 z-50">
							<div
								className="cursor-pointer flex items-center"
								onClick={(_) => closeCardDetail(null)}
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M5.41412 7.00001H13.9999V9.00001H5.41412L8.70701 12.2929L7.2928 13.7071L1.58569 8.00001L7.2928 2.29291L8.70701 3.70712L5.41412 7.00001Z"
										fill="white"
									/>
								</svg>
								<p className="pl-2 text-gray-100 cursor-pointer">Back</p>
							</div>
						</div>
						<CardDetail token={activeToken} />
					</div>
				</Modal>
			)}
			{tokens.length === 0 && (
				<div className="w-full">
					<div className="m-auto text-lg text-gray-800 font-semibold py-24 text-center">
						No Cards
					</div>
				</div>
			)}
			<animated.div className="flex select-none " style={props}>
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
														{(
															prettyBalance(
																_getLowestPrice(token.ownerships),
																24,
																4
															) * store.nearUsdPrice
														).toPrecision(4)}
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
								{/* <div onClick={(_) => pushCardDetail(token)}>
									<p className="inline-block text-gray-100 cursor-pointer">
										See Details
									</p>
								</div> */}
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
									<p className="inline-block text-gray-100 cursor-pointer">
										See Details
									</p>
								</Link>
							</div>
						</div>
					)
				})}
			</animated.div>
		</div>
	)
}

export default CardList
