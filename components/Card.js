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
								<div className="absolute inset-0 py-4">
									<h4 className="text-sm truncate px-4">Lorum Ipsum</h4>
									<h4
										className="px-4 pb-2 truncate"
										style={{
											fontSize: `0.5rem`,
										}}
									>
										Royal Army
									</h4>
									<hr className="border-gray-700 border-2" />
									<div className="flex">
										<div className="w-1/2 py-2 border-gray-700 border-r-2">
											<h4
												className="px-4 truncate"
												style={{
													fontSize: `0.5rem`,
												}}
											>
												Artist
											</h4>
											<h4 className="text-sm truncate px-4">Lorum Ipsum</h4>
										</div>
										<div className="w-1/2 py-2 border-gray-700 border-l-2">
											<h4
												className="px-4 truncate"
												style={{
													fontSize: `0.5rem`,
												}}
											>
												Artist
											</h4>
											<h4 className="text-sm truncate px-4">Lorum Ipsum</h4>
										</div>
									</div>
									<hr className="border-gray-700 border-2" />
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
