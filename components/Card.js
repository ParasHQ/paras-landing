import { useEffect, useRef, useState } from 'react'
import { Blurhash } from 'react-blurhash'

const parseImgUrl = (url) => {
	const [protocol, path] = url.split('://')
	if (protocol === 'ipfs') {
		return `https://ipfs-gateway.paras.id/ipfs/${path}`
	}
	return url
}

const Card = ({
	imgUrl,
	imgWidth,
	imgHeight,
	token,
	initialRotate = {
		x: 15,
		y: 15,
	},
	disableFlip = false
}) => {
	const containerRef = useRef()
	const cardRef = useRef()
	const dimensionRef = useRef()
	const [imgLoaded, setImgLoaded] = useState(null)
	const [dimension, setDimension] = useState({ width: 0, height: 0 })
	const [rotate, setRotate] = useState(initialRotate)
	const [isShowFront, setIsShowFront] = useState(true)

	let cardTimeout

	useEffect(() => {
		var img = new Image()
		img.onload = function () {
			setImgLoaded(parseImgUrl(imgUrl))
		}
		img.src = parseImgUrl(imgUrl)
	}, [imgUrl])

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
			setRotate(initialRotate)
		}, 500)
	}

	const _flipCard = () => {
		if (disableFlip) {
			return
		}
		setIsShowFront(!isShowFront)
	}

	return (
		<div
			className="relative select-none"
			onClick={_flipCard}
			style={{
				paddingBottom: `138%`,
				transition: `.6s .1s`,
				transform: !isShowFront && `rotateY(180deg)`,
				transformStyle: `preserve-3d`,
			}}
			ref={containerRef}
		>
			<img
				ref={dimensionRef}
				className="fixed opacity-0"
				style={{
					zIndex: -1,
					top: -1000,
				}}
				src={parseImgUrl(imgUrl)}
			/>
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
					<div
						className="card  bg-gray-800 w-full h-full"
						style={{
							transform: `rotateY(${rotate.x}deg) rotateX(${rotate.y}deg)`,
						}}
					>
						<div className="card-bg relative">
							<img className="w-full h-full relative z-10" src={imgLoaded} />
							<div
								className="absolute inset-0 z-20 transition-opacity duration-500 ease-in"
								style={{
									opacity: imgLoaded ? 0 : 1,
								}}
							>
								<Blurhash
									hash="UZ9ZtPzmpHv;R]ONJ6bKQ-l7Z.S_bow5$-nh"
									width={`100%`}
									height={`100%`}
									resolutionX={32}
									resolutionY={32}
									punch={1}
								/>
							</div>
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
					<div
						className="card bg-gray-100 w-full h-full"
						style={{
							transform: `rotateY(${rotate.x}deg) rotateX(${rotate.y}deg)`,
						}}
					>
						<div className="card-bg relative">
							<div
								className="absolute inset-0 z-20 transition-opacity duration-500 ease-in"
								style={{
									opacity: imgLoaded ? 0 : 1,
								}}
							>
								<Blurhash
									hash="UZ9ZtPzmpHv;R]ONJ6bKQ-l7Z.S_bow5$-nh"
									width={`100%`}
									height={`100%`}
									resolutionX={32}
									resolutionY={32}
									punch={1}
								/>
							</div>
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
										<div className="px-2 overflow-hidden">
											<h4
												className="truncate"
												style={{
													fontSize: `0.75em`,
												}}
											>
												{token.name}
											</h4>
											<h4
												className="truncate"
												style={{
													fontSize: `0.5em`,
												}}
											>
												{token.collection}
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
												<div className="overflow-hidden">
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
															fontSize: `0.65em`,
														}}
														className="truncate px-2"
													>
														{token.creatorId}
													</h4>
												</div>
											</div>
											<div className="w-1/2 flex items-center border-l-2 border-gray-900 h-full">
												<div className="overflow-hidden">
													<h4
														className="px-2 truncate"
														style={{
															fontSize: `0.5em`,
														}}
													>
														Year
													</h4>
													<h4
														className="truncate px-2"
														style={{
															fontSize: `0.65em`,
														}}
													>
														{new Date(token.createdAt).getFullYear()}
													</h4>
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
											{token.description}
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
													Edition of {token.supply}
												</h4>
											</div>
											<div>
												<h4
													className="px-2"
													style={{
														fontSize: `0.5em`,
													}}
												>
													{token.tokenId.slice(0, 8)}
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
	)
}

export default Card
