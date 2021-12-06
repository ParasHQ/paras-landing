import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'hooks/useIntl'
import Media from 'components/Common/Media'

const Card = ({
	imgUrl,
	imgWidth = 640,
	imgHeight = 890,
	token,
	onClick = () => {},
	flippable = false,
}) => {
	const initialRotate = {
		x: 0,
		y: 0,
	}
	const containerRef = useRef()
	const cardRef = useRef()
	const [dimension, setDimension] = useState({ width: 0, height: 0 })
	const [rotate, setRotate] = useState(initialRotate)
	const [isShowFront, setIsShowFront] = useState(true)

	const { localeLn } = useIntl()

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

	const handleMouseMove = (e) => {
		const bbox = cardRef.current.getBoundingClientRect()

		const mouseX = e.pageX - (bbox.left + window.scrollX) - dimension.width / 2
		const mouseY = e.pageY - (bbox.top + window.scrollY) - dimension.height / 2

		const mousePX = mouseX / dimension.width
		const mousePY = mouseY / dimension.height

		setRotate({
			x: mousePX * 20,
			y: mousePY * -20,
		})
	}

	const handleMouseLeave = () => {
		setTimeout(() => {
			setRotate(initialRotate)
		}, 500)
	}

	const _flipCard = () => {
		if (flippable) {
			setIsShowFront(!isShowFront)
		}
	}

	const calculateRoyalty = () => {
		if (token.royalty) {
			return Object.values(token.royalty).reduce((a, b) => parseInt(a) + parseInt(b), 0) / 100 + '%'
		}
		return 'None'
	}

	return (
		<div
			className="relative select-none m-auto outline-none"
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
					WebkitBackfaceVisibility: 'hidden',
				}}
			>
				<div
					onClick={onClick}
					className="card-wrap"
					onMouseMove={handleMouseMove}
					onMouseLeave={handleMouseLeave}
					ref={cardRef}
					style={{
						transform: `perspective(${dimension.height * 4}px)`,
					}}
				>
					<div
						className="card bg-transparent w-full h-full bg-black"
						style={{
							fontSize: `${dimension.width / 14}px`,
							transform: `rotateY(${rotate.x}deg) rotateX(${rotate.y}deg)`,
							borderRadius: `${dimension.width / 27}px`,
						}}
					>
						<div className="h-full py-2 flex flex-col">
							<div className="text-center px-2">
								<p className="text-white font-bold truncate" style={{ fontSize: `.85em` }}>
									{token.title}
								</p>
								<p className="text-white truncate" style={{ fontSize: `.6em` }}>
									{token.collection}
								</p>
							</div>
							<div className="card-content my-2 relative flex flex-grow h-0">
								<Media
									className="mx-auto h-full object-contain relative z-10"
									url={imgUrl}
									videoControls={false}
									videoMuted={true}
									videoLoop={true}
								/>
							</div>
							<div className="px-2 mt-auto">
								<div className="flex justify-between">
									<div className="w-1/2">
										<p className="text-white truncate" style={{ fontSize: `.6em` }}>
											{token.creatorId}
										</p>
									</div>
									<div className="w-1/2 text-right">
										<p className="text-white" style={{ fontSize: `.6em` }}>
											{token.edition_id
												? `#${token.edition_id} of ${token.copies || localeLn('OpenEdition')}`
												: token.copies
												? `${localeLn('EditionOf')} ${token.copies}`
												: (token.contract_id === process.env.NFT_CONTRACT_ID ||
														process.env.WHITELIST_CONTRACT_ID.split(',').includes(
															token.contract_id
														)) &&
												  localeLn('OpenEdition')}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{flippable && (
				<div
					className="card-back absolute inset-0 z-10"
					style={{
						transform: `rotateY(180deg)`,
						backfaceVisibility: `hidden`,
						WebkitBackfaceVisibility: 'hidden',
					}}
				>
					<div
						className={`card-wrap`}
						onMouseMove={handleMouseMove}
						onMouseLeave={handleMouseLeave}
						ref={cardRef}
						style={{ transform: `perspective(${dimension.height * 4}px)` }}
					>
						<div
							className="card w-full h-full text-white"
							style={{ transform: `rotateY(${rotate.x}deg) rotateX(${rotate.y}deg)` }}
						>
							<div className="bg-white opacity-10 absolute inset-0">
								<Media
									className="mx-auto h-full object-cover relative z-10 img-hor-vert"
									url={imgUrl}
									videoControls={false}
									videoMuted={true}
									videoLoop={true}
								/>
							</div>
							<div className="card-bg relative z-10">
								<div
									className="absolute inset-0 rounded-md z-20"
									style={{ fontSize: `${dimension.width / 14}px`, padding: `.3em` }}
								>
									<div className="h-full border-gray-400 border-2">
										<div className="py-2 overflow-hidden" style={{ height: '90%' }}>
											<div className="mb-2">
												<h4 className="px-2 truncate" style={{ fontSize: `0.75em` }}>
													Description
												</h4>
												<h4 className="px-2 whitespace-pre-line" style={{ fontSize: `0.5em` }}>
													{token.description?.replace(/\n\s*\n\s*\n/g, '\n\n')}
												</h4>
											</div>
											<div className="mb-2">
												<h4 className="px-2 truncate" style={{ fontSize: `0.75em` }}>
													{'Attributes'}
												</h4>
												<h4 className="px-2" style={{ fontSize: `0.5em` }}>
													{token.attributes
														?.map(({ value, trait_type }) => `${trait_type} ${value}`)
														.join(', ') || 'None'}
												</h4>
											</div>
											<div className="flex items-end px-2 space-x-2">
												<h4 style={{ fontSize: `0.5em` }}>Royalty:</h4>
												<h4 style={{ fontSize: `0.5em` }}>{calculateRoyalty()}</h4>
											</div>
										</div>
										<div style={{ height: '10%' }}></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Card
