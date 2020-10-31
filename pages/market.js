import axios from 'axios'
import { useSpring, animated } from 'react-spring'
import { useContext, useEffect, useRef, useState } from 'react'
import Card from '../components/Card'
import Nav from '../components/Nav'
import { prettyBalance } from '../utils/common'
import Link from 'next/link'
import useStore from '../store'

const CardContainer = ({ tokens, fetchData }) => {
	const store = useStore()
	const containerRef = useRef()
	// const [animValues, setAnimValues] = useState(store.marketScrollPersist)
	const [mouseDown, setMouseDown] = useState(null)
	const [touchStart, setTouchStart] = useState(null)
	const animValuesRef = useRef(store.marketScrollPersist)

	const props = useSpring({
		transform: `translate3d(${store.marketScrollPersist}px, 0,0)`,
	})

	useEffect(() => {
		animValuesRef.current = store.marketScrollPersist
	}, [store.marketScrollPersist])

	useEffect(() => {
		if (containerRef) {
			containerRef.current.addEventListener('wheel', handleScroll, {
				passive: false,
			})
		}

		return () => {
			if (containerRef.current) {
				containerRef.current.removeEventListener('wheel', handleScroll)
			}
		}
	}, [containerRef, store.marketScrollPersist])

	const handleScroll = (e) => {
		e.preventDefault()

		var rawData = e.deltaY ? e.deltaY : e.deltaX
		var mouseY = Math.floor(rawData)

		var animationValue = animValuesRef.current
		var newAnimationValue = animationValue - mouseY

		animateScroll(newAnimationValue)
	}

	const animateScroll = (newAnimationValue) => {
		let max = containerRef.current.lastElementChild.scrollWidth
		let win = containerRef.current.offsetWidth

		var bounds = -(max - win)

		if (newAnimationValue > 0) {
			store.setMarketScrollPersist(0)
		} else if (newAnimationValue < bounds) {
			fetchData()
			store.setMarketScrollPersist(bounds)
		} else {
			store.setMarketScrollPersist(newAnimationValue)
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

			animateScroll(store.marketScrollPersist - diffX)
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

			animateScroll(store.marketScrollPersist - diffX)
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
			className="overflow-hidden"
		>
			<animated.div className="flex -mx-8" style={props}>
				{tokens.map((token, idx) => {
					return (
						<div
							key={idx}
							className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-8 relative"
						>
							<div
								className="max-w-full m-auto"
								style={{
									maxWidth: `280px`,
								}}
							>
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
							{/* <div className="text-center absolute top-0 right-0 pointer-events-none">
								<div className="">
									<div className="p-2 bg-primary inline-block rounded-md">
										<p className="text-gray-400 text-xs">Start From</p>
										<div className="text-white text-lg">
											{_getLowestPrice(token.ownerships) ? (
												<div>
													{prettyBalance(
														_getLowestPrice(token.ownerships),
														24,
														4
													)}{' '}
													Ⓝ
												</div>
											) : (
												<div className="line-through text-red-600">
													<span className="text-white">SALE</span>
												</div>
											)}
										</div>
									</div>
								</div>
							</div> */}
							<div className="text-center">
								<div className="mt-8">
									<div className="p-2">
										<p className="text-gray-400 text-xs">Start From</p>
										<div className="text-white text-2xl">
											{_getLowestPrice(token.ownerships) ? (
												<span>
													{prettyBalance(
														_getLowestPrice(token.ownerships),
														24,
														4
													)}{' '}
													Ⓝ
												</span>
											) : (
												<div className="line-through text-red-600">
													<span className="text-white">SALE</span>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className="text-center mt-2 text-sm">
								<Link href={`/token/${token.tokenId}`}>
									<p className="inline-block text-white cursor-pointer">See Details</p>
								</Link>
							</div>
						</div>
					)
				})}
			</animated.div>
		</div>
	)
}

export default function MarketPage({ data }) {
	const [tokens, setTokens] = useState(data.results)
	const [page, setPage] = useState(1)
	const [isFetching, setIsFetching] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	const _fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			`http://localhost:9090/tokens?__skip=${page * 5}&__limit=5`
		)
		const newData = await res.data.data

		const newTokens = [...tokens, ...newData.results]
		setTokens(newTokens)
		setPage(page + 1)
		if (newData.results.length === 0) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	return (
		<div
			className="min-h-screen bg-dark-primary-1 select-none"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Nav />
			<div className="max-w-6xl relative m-auto">
				<div className="p-4">
					<CardContainer tokens={tokens} fetchData={_fetchData} />
				</div>
			</div>
		</div>
	)
}

export async function getServerSideProps() {
	const res = await axios(`http://localhost:9090/tokens?__limit=5`)
	const data = await res.data.data

	return { props: { data } }
}
