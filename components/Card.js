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
	imgWidth = 640,
	imgHeight = 890,
	token,
	initialRotate = {
		x: 15,
		y: 15,
	},
	imgBlur,
	disableFlip = false,
}) => {
	const containerRef = useRef()
	const cardRef = useRef()
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
		let w = containerRef.current.parentNode.offsetWidth
		let h = containerRef.current.parentNode.offsetWidth * (imgHeight / imgWidth)

		if (
			containerRef.current.parentNode.offsetHeight !== 0 &&
			h > containerRef.current.parentNode.offsetHeight
		) {
			w = (imgWidth * containerRef.current.parentNode.offsetHeight) / imgHeight
			h = containerRef.current.parentNode.offsetHeight
		}

		setDimension({
			width: w,
			height: h,
		})
	}, [])

	const handleMouseMove = (e) => {
		const bbox = cardRef.current.getBoundingClientRect()

		const mouseX = e.pageX - (bbox.left + window.scrollX) - dimension.width / 2
		const mouseY = e.pageY - (bbox.top + window.scrollY) - dimension.height / 2

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
			className="relative select-none m-auto"
			onClick={_flipCard}
			style={{
				transition: `transform .6s .1s`,
				transform: !isShowFront && `rotateY(180deg)`,
				transformStyle: `preserve-3d`,
				width: dimension.width,
				height: dimension.height,
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
						transform: `perspective(${dimension.height * 5}px)`,
					}}
				>
					<div
						className="card  bg-gray-800 w-full h-full"
						style={{
							transform: `rotateY(${rotate.x}deg) rotateX(${rotate.y}deg)`,
						}}
					>
						<div className="card-bg relative">
							<img
								className="object-cover w-full h-full relative z-10"
								src={imgLoaded}
							/>
							<div
								className="absolute inset-0 z-20 transition-opacity duration-500 ease-in"
								style={{
									opacity: imgLoaded ? 0 : 1,
								}}
							>
								<Blurhash
									hash={imgBlur || 'UZ9ZtPzmpHv;R]ONJ6bKQ-l7Z.S_bow5$-nh'}
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
						transform: `perspective(${dimension.height * 5}px)`,
					}}
				>
					<div
						className="card bg-gray-100 w-full h-full"
						style={{
							transform: `rotateY(${rotate.x}deg) rotateX(${rotate.y}deg)`,
						}}
					>
						<div className="card-bg relative">
							<img
								className="object-cover w-full h-full relative z-10 opacity-25"
								src={imgLoaded}
							/>
							<div
								className="absolute inset-0 z-30 transition-opacity duration-500 ease-in"
								style={{
									opacity: imgLoaded ? 0 : 1,
								}}
							>
								<Blurhash
									hash={imgBlur || 'UZ9ZtPzmpHv;R]ONJ6bKQ-l7Z.S_bow5$-nh'}
									width={`100%`}
									height={`100%`}
									resolutionX={32}
									resolutionY={32}
									punch={1}
								/>
							</div>
							<div
								className="absolute inset-0 p-2 rounded-md z-20"
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
												{token.name.length > 0 ? token.name : 'Card Name'}
											</h4>
											<h4
												className="truncate"
												style={{
													fontSize: `0.5em`,
												}}
											>
												{token.collection && token.collection.length > 0
													? token.collection
													: 'Collection'}
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
											{token.description.length > 0
												? token.description
												: 'Your card description'}
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
													Edition of {token.supply || 0}
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
