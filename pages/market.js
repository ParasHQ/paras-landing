import axios from 'axios'
import {
	CarouselProvider,
	Slider,
	Slide,
	ButtonBack,
	ButtonNext,
	CarouselContext,
} from 'pure-react-carousel'

import { useContext, useEffect, useState } from 'react'
import Card from '../components/Card'
import { prettyBalance } from '../utils/common'

export function MyComponentUsingContext({ setCurrentSlide }) {
	const carouselContext = useContext(CarouselContext)

	useEffect(() => {
		function onChange() {
			setCurrentSlide(carouselContext.state.currentSlide)
		}
		carouselContext.subscribe(onChange)
		return () => carouselContext.unsubscribe(onChange)
	}, [carouselContext])
	return null
}

export default function MarketPage({ data }) {
	const [tokens, setTokens] = useState(data.results)
	const [page, setPage] = useState(1)
	const [currentSlide, setCurrentSlide] = useState(0)
	const [isFetching, setIsFetching] = useState(false)

	useEffect(() => {
		if (currentSlide > tokens.length - 2) {
			_fetchData()
		}
	}, [currentSlide])

	const _fetchData = async () => {
		if (isFetching) {
			return
		}
		setIsFetching(true)
		const res = await axios(
			`http://localhost:9090/tokens?__skip=${page * 10}&__limit=10`
		)
		const data = await res.data.data

		console.log(data.results)

		const newTokens = [...tokens, ...data.results]
		setIsFetching(false)
		setTokens(newTokens)
		setPage(page + 1)
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
			className="min-h-screen"
			style={{
				backgroundColor: `rgb(5 0 50)`,
			}}
		>
			<div>Market</div>
			<div className="max-w-6xl relative m-auto mt-12">
				<div
					className="pointer-events-none absolute z-10 inset-0"
					style={{
						background: `linear-gradient(
              to right, 
              rgb(5 0 50) 0%, 
              rgb(5 0 50 / 30%) 10%,
              rgb(5 0 50 / 0%) 15%,
              rgb(5 0 50 / 0%) 85%,
              rgb(5 0 50 / 30%) 90%,
              rgb(5 0 50) 100%
            )
            `,
					}}
				></div>
				<CarouselProvider
					naturalSlideWidth={100}
					naturalSlideHeight={100}
					visibleSlides={1}
					totalSlides={tokens.length}
					isIntrinsicHeight={true}
				>
					<Slider
						className="outline-none"
						style={{
							paddingLeft: `25%`,
							paddingRight: `25%`,
						}}
					>
						{tokens.map((token, idx) => {
							return (
								<Slide index={idx}>
									<div>
										<div className="p-8 relative">
											<div
												className="max-w-full lg:max-w-sm m-auto"
												style={{
													width: `40vh`,
												}}
											>
												<Card
													imgUrl={token.metadata.image}
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
										</div>
										<div className="text-center p-4">
											<h4 className="text-gray-400 ">
												{token.metadata.collection}
											</h4>
											<h2 className="text-3xl text-white">
												{token.metadata.name}
											</h2>

											<p className="mt-8 text-gray-400 ">Start From</p>
											<div className="text-white text-3xl">
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
											<p className="text-white mt-8">See Details</p>
										</div>
									</div>
								</Slide>
							)
						})}
					</Slider>
					<MyComponentUsingContext
						currentSlide={currentSlide}
						setCurrentSlide={setCurrentSlide}
					/>
				</CarouselProvider>
			</div>
		</div>
	)
}

export async function getServerSideProps() {
	const res = await axios(`http://localhost:9090/tokens?__limit=10`)
	const data = await res.data.data

	return { props: { data } }
}
