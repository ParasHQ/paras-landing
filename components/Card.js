import { useEffect, useRef, useState } from 'react'
import { Blurhash } from 'react-blurhash'

const Card = ({
	imgUrl,
	imgWidth = 640,
	imgHeight = 890,
	token,
	imgBlur,
	disableFlip = false,
	isShowFront = null,
	setIsShowFront = null,
	borderRadius = '10px',
	special = false,
	onClick = () => {},
}) => {
	const initialRotate = {
		x: 0,
		y: 0,
	}
	const containerRef = useRef()
	const cardRef = useRef()
	const [imgLoaded, setImgLoaded] = useState(null)
	const [dimension, setDimension] = useState({ width: 0, height: 0 })
	const [rotate, setRotate] = useState(initialRotate)
	if (!setIsShowFront) {
		// eslint-disable-next-line no-extra-semi
		;[isShowFront, setIsShowFront] = useState(true)
	}

	let cardTimeout

	useEffect(() => {
		var img = new Image()
		img.onload = function () {
			setImgLoaded(imgUrl)
		}
		img.src = imgUrl
	}, [imgUrl])

	useEffect(() => {
		function updateSize() {
			let w = containerRef.current.parentNode.offsetWidth
			let h =
				containerRef.current.parentNode.offsetWidth * (imgHeight / imgWidth)

			if (
				containerRef.current.parentNode.offsetHeight !== 0 &&
				h > containerRef.current.parentNode.offsetHeight
			) {
				w =
					(imgWidth * containerRef.current.parentNode.offsetHeight) / imgHeight
				h = containerRef.current.parentNode.offsetHeight
			}

			setDimension({
				width: w,
				height: h,
			})
		}
		window.addEventListener('resize', updateSize)
		updateSize()
		return () => window.removeEventListener('resize', updateSize)
	}, [containerRef])

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
			style={{
				transition: `transform .6s .1s`,
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
					WebkitBackfaceVisibility: 'hidden',
				}}
			>
				<div
					onClick={onClick}
					className={`card-wrap`}
					onMouseMove={handleMouseMove}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					ref={cardRef}
					style={{
						transform: `perspective(${dimension.height * 4}px)`,
					}}
				>
					<div
						className="card bg-dark-primary-1 w-full h-full"
						style={{
							fontSize: `${dimension.width / 14}px`,
							transform: `rotateY(${rotate.x}deg) rotateX(${rotate.y}deg)`,
							borderRadius: borderRadius,
							boxShadow:
								special &&
								'rgba(255, 255, 255, 0.2) 0 0 40px 5px, white 0 0 0 1px,rgba(0, 0, 0, 0.66) 0 30px 60px 0',
						}}
					>
						<div className="h-full py-2 flex flex-col">
							<div className="text-center px-2">
								<p
									className="text-white font-bold truncate"
									style={{
										fontSize: `.85em`,
									}}
								>
									{token.name}
								</p>
								<p
									className="text-white truncate"
									style={{
										fontSize: `.6em`,
									}}
								>
									{token.collection}
								</p>
							</div>
							<div className="card-content my-2 relative flex flex-grow h-0">
								<img
									className="mx-auto h-full object-contain relative z-10"
									src={imgLoaded}
								/>
								<div className="absolute inset-0 z-0">
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
							<div className="px-2 mt-auto">
								<div className="flex justify-between">
									<div className="w-1/2">
										<p
											className="text-white truncate"
											style={{
												fontSize: `.6em`,
											}}
										>
											{token.creatorId}
										</p>
									</div>
									<div className="w-1/2 text-right">
										<p
											className="text-white"
											style={{
												fontSize: `.6em`,
											}}
										>
											Edition of {token.supply}
										</p>
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
