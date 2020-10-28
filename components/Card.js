import { useEffect, useRef, useState } from 'react'
import { Blurhash } from 'react-blurhash'

const Card = ({ imgUrl, imgWidth, imgHeight }) => {
	const containerRef = useRef()
	const cardRef = useRef()
	const dimensionRef = useRef()
	const [imgLoaded, setImgLoaded] = useState(null)
	const [dimension, setDimension] = useState({ width: 0, height: 0 })
	const [rotate, setRotate] = useState({ x: 15, y: 15 })
	const [isShowFront, setIsShowFront] = useState(true)

	let cardTimeout

	useEffect(() => {
		var img = new Image()
		img.onload = function () {
			setTimeout(() => {
				setImgLoaded(imgUrl)
			}, 1000)
		}
		img.src = imgUrl
	}, [])

	useEffect(() => {
		if (imgWidth && imgHeight) {
			setDimension({
				width: containerRef.current.offsetWidth,
				height: containerRef.current.offsetWidth * (imgHeight / imgWidth),
			})
		} else if (imgLoaded) {
			setDimension({
				width: dimensionRef.current.offsetWidth,
				height: dimensionRef.current.offsetHeight,
			})
		}
	}, [imgLoaded])

	const handleMouseMove = (e) => {
		const bbox = cardRef.current.getBoundingClientRect()
		const mouseX = e.pageX - bbox.left - dimension.width / 2
		const mouseY = e.pageY - bbox.top - dimension.height / 2
		const mousePX = mouseX / dimension.width
		const mousePY = mouseY / dimension.height
		setRotate({
			x: mousePX * 30,
			y: mousePY * -30,
		})
	}

	const handleMouseEnter = () => {
		clearTimeout(cardTimeout)
	}

	const handleMouseLeave = () => {
		cardTimeout = setTimeout(() => {
			setRotate({
				x: 15,
				y: 15,
			})
		}, 500)
	}

	const _flipCard = () => {
		setIsShowFront(!isShowFront)
	}

	return (
		<div
			className="relative"
			onClick={_flipCard}
			style={{
				paddingBottom: `138%`,
				transition: `.6s .1s`,
				transform: !isShowFront && `rotateY(180deg)`,
				transformStyle: `preserve-3d`,
			}}
			ref={containerRef}
		>
			<div
				className="card-front absolute inset-0"
				style={{
					transform: `rotateY(0deg)`,
					backfaceVisibility: `hidden`,
				}}
			>
				<div
					className={`card-wrap`}
					onMouseMove={handleMouseMove}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					ref={cardRef}
					style={{
						transform: `perspective(${dimension.width * 4}px)`,
					}}
				>
					<img ref={dimensionRef} className="absolute opacity-0" src={imgUrl} />
					<div
						className="card  bg-gray-800"
						style={{
							width: `${dimension.width}px`,
							height: `${dimension.height}px`,
							transform: `rotateY(${rotate.x}deg) rotateX(${rotate.y}deg)`,
						}}
					>
						<div className="card-bg relative">
							<Blurhash
								hash="UZ9ZtPzmpHv;R]ONJ6bKQ-l7Z.S_bow5$-nh"
								width={dimension.width}
								height={dimension.height}
								resolutionX={32}
								resolutionY={32}
								punch={1}
								className="absolute inset-0 z-20 transition-opacity duration-500 ease-in"
								style={{
									opacity: imgLoaded ? 0 : 1,
								}}
							/>
							<img className="w-full absolute inset-0 z-10" src={imgLoaded} />
						</div>
					</div>
				</div>
			</div>
			<div
				className="card-back absolute inset-0 z-10"
				style={{
					transform: `rotateY(180deg)`,
					backfaceVisibility: `hidden`,
				}}
			>
				<div className="absolute inset-0">
					<div
						className={`card-wrap`}
						onMouseMove={handleMouseMove}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						ref={cardRef}
						style={{
							transform: `perspective(${dimension.width * 4}px)`,
						}}
					>
						<img
							ref={dimensionRef}
							className="absolute opacity-0"
							src={imgUrl}
						/>
						<div
							className="card bg-gray-100"
							style={{
								width: `${dimension.width}px`,
								height: `${dimension.height}px`,
								transform: `rotateY(${rotate.x}deg) rotateX(${rotate.y}deg)`,
							}}
						>
							<div className="card-bg relative">
								<Blurhash
									hash="UZ9ZtPzmpHv;R]ONJ6bKQ-l7Z.S_bow5$-nh"
									width={dimension.width}
									height={dimension.height}
									resolutionX={32}
									resolutionY={32}
									punch={1}
									className="absolute inset-0 z-20 transition-opacity duration-500 ease-in"
									style={{
										opacity: imgLoaded ? 0 : 1,
									}}
								/>
								<div
									className="absolute inset-0 p-2 rounded-md"
									style={{
										fontSize: `${dimension.width / 14}px`,
									}}
								>
									<div className="h-full border-gray-900 border-2">
										<div
											className="border-b-2 border-gray-900 flex items-center"
											style={{
												height: `15%`,
											}}
										>
											<div className="px-2">
												<h4 className="text-sm truncate">Lorum Ipsum</h4>
												<h4
													className="truncate"
													style={{
														fontSize: `0.5em`,
													}}
												>
													Royal Army
												</h4>
											</div>
										</div>
										<div
											className="border-b-2 border-gray-900"
											style={{
												height: `15%`,
											}}
										>
											<div className="flex h-full">
												<div className="w-1/2 flex items-center">
													<div>
														<h4
															className="px-2 truncate"
															style={{
																fontSize: `0.5em`,
															}}
														>
															Artist
														</h4>
														<h4
															style={{
																fontSize: `0.75em`,
															}}
															className="truncate px-2"
														>
															Riqi
														</h4>
													</div>
												</div>
												<div className="w-1/2 flex items-center border-l-2 border-gray-900 h-full">
													<div>
														<h4
															className="px-2 truncate"
															style={{
																fontSize: `0.5em`,
															}}
														>
															Year
														</h4>
														<h4 className="text-sm truncate px-2">2020</h4>
													</div>
												</div>
											</div>
										</div>
										<div
											className="py-2 overflow-hidden"
											style={{
												height: '65%',
											}}
										>
											<h4
												className="px-2"
												style={{
													fontSize: `0.5em`,
												}}
											>
												Lorem ipsum dolor sit amet, consectetur adipiscing elit,
												sed do eiusmod tempor incididunt ut labore et dolore
												magna aliqua.
											</h4>
										</div>
										<div
											style={{
												height: '5%',
											}}
										>
											<div className="flex items-center h-full justify-between">
												<div>
													<h4
														className="px-2"
														style={{
															fontSize: `0.5em`,
														}}
													>
														Edition of 20
													</h4>
												</div>
												<div>
													<h4
														className="px-2"
														style={{
															fontSize: `0.5em`,
														}}
													>
														{'QmSnbaci7xNtKE2gSP8wjb9BL7Bvz8RE9W7NhNks2qzRtu'.slice(
															0,
															8
														)}
													</h4>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Card
