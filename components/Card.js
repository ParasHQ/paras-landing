import { useEffect, useRef, useState } from 'react'
import { useIntl } from '../hooks/useIntl'
// import { Blurhash } from 'react-blurhash'

const Card = ({
	imgUrl,
	imgWidth = 640,
	imgHeight = 890,
	token,
	// imgBlur,
	borderRadius = '10px',
	onClick = () => {},
}) => {
	const containerRef = useRef()
	const [imgLoaded, setImgLoaded] = useState(null)
	const [dimension, setDimension] = useState({ width: 0, height: 0 })
	const { localeLn } = useIntl()
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
		}
		window.addEventListener('resize', updateSize)
		updateSize()
		return () => window.removeEventListener('resize', updateSize)
	}, [containerRef])

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
					className="card-wrap transform transition-all origin-bottom-right duration-300 ease-in-out hover:-translate-y-1"
				>
					<div
						className="card bg-transparent w-full h-full bg-black"
						style={{
							fontSize: `${dimension.width / 14}px`,
							borderRadius: borderRadius,
							// background: '#202124',
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
									{token.title}
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
								<img className="mx-auto h-full object-contain relative z-10" src={imgLoaded} />
								<div className="absolute inset-0 z-0">
									{/* <Blurhash
										hash={imgBlur || 'UZ9ZtPzmpHv;R]ONJ6bKQ-l7Z.S_bow5$-nh'}
										width={`100%`}
										height={`100%`}
										resolutionX={32}
										resolutionY={32}
										punch={1}
									/> */}
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
											{token.edition_id
												? `#${token.edition_id} of ${token.copies}`
												: token.copies
												? `${localeLn('Edition of')} ${token.copies}`
												: localeLn('Open Edition')}
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
