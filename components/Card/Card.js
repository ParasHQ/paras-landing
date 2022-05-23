import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'hooks/useIntl'
import Media from 'components/Common/Media'
import { parseImgUrl } from 'utils/common'
import TimeAuction from 'components/Common/TimeAuction'

const Card = ({
	imgUrl,
	audioUrl,
	imgWidth = 640,
	imgHeight = 890,
	token,
	profileCollection,
	type,
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
	const wrapperRef = useRef()
	const descRef = useRef()
	const attrRef = useRef()
	const royaltyRef = useRef()
	const [classDescAttr, setClassDescAttr] = useState({
		desc: false,
		attr: false,
	})

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

	useEffect(() => {
		if (
			descRef.current?.clientHeight +
				attrRef.current?.clientHeight +
				royaltyRef.current?.clientHeight >
			wrapperRef.current?.clientHeight - 16
		) {
			setClassDescAttr((prev) => ({ ...prev, desc: true, attr: true }))
		}
	}, [wrapperRef.current])

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
		if (JSON.stringify(token.royalty) !== '{}') {
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
						className="card bg-black w-full h-full"
						style={{
							fontSize: `${dimension.width / 14}px`,
							transform: `rotateY(${rotate.x}deg) rotateX(${rotate.y}deg)`,
							borderRadius: `${dimension.width / 27}px`,
						}}
					>
						<div className="h-full py-2 flex flex-col">
							<div className="text-center px-2 relative">
								<p className="text-white font-bold truncate" style={{ fontSize: `.85em` }}>
									{token.title}
								</p>
								<p className="text-white truncate" style={{ fontSize: `.6em` }}>
									{token.collection}
								</p>
								{audioUrl && (
									<div className="absolute top-1 right-2">
										<div className="block md:hidden">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="icon icon-tabler icon-tabler-music"
												width={14}
												height={14}
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="#fff"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path stroke="none" d="M0 0h24v24H0z" fill="none" />
												<circle cx={6} cy={17} r={3} />
												<circle cx={16} cy={17} r={3} />
												<polyline points="9 17 9 4 19 4 19 17" />
												<line x1={9} y1={8} x2={19} y2={8} />
											</svg>
										</div>
										<div className="hidden md:block">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="icon icon-tabler icon-tabler-music"
												width={20}
												height={20}
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="#fff"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path stroke="none" d="M0 0h24v24H0z" fill="none" />
												<circle cx={6} cy={17} r={3} />
												<circle cx={16} cy={17} r={3} />
												<polyline points="9 17 9 4 19 4 19 17" />
												<line x1={9} y1={8} x2={19} y2={8} />
											</svg>
										</div>
									</div>
								)}
							</div>
							<div className="card-content my-2 relative flex flex-grow h-0">
								{token._is_the_reference_merged !== undefined &&
								!token._is_the_reference_merged &&
								type === 'collection' ? (
									<>
										<div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg backdrop-saturate-200 z-10" />
										<div
											className="absolute top-0 left-0 w-full h-full bg-cover bg-white"
											style={{ backgroundImage: `url(${parseImgUrl(profileCollection)})` }}
										/>
										<div className="flex items-center justify-center w-full h-full">
											<div className="z-20">
												<img
													src={parseImgUrl(profileCollection)}
													width={100}
													className="mx-auto rounded-full"
												/>
												<h4 className="text-white text-sm mt-4">Content not available yet</h4>
											</div>
										</div>
									</>
								) : (
									<>
										<Media
											className="mx-auto h-full object-contain relative z-10"
											url={imgUrl}
											audioUrl={audioUrl}
											videoControls={false}
											videoMuted={true}
											videoLoop={true}
											mimeType={token?.mime_type}
										/>
										{token?.is_auction && <TimeAuction endedAt={token.ended_at} />}
									</>
								)}
							</div>
							<div className="px-2 mt-auto">
								<div className="flex justify-between">
									<div className="w-1/2 flex items-center">
										<p className="text-white truncate mr-1" style={{ fontSize: `.6em` }}>
											{token.creatorId}
										</p>
										{token.is_creator && (
											<svg
												width="12"
												height="12"
												viewBox="0 0 18 17"
												className="leading-3 mb-1"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M17.8095 8.5L15.8343 6.24143L16.1095 3.25429L13.1871 2.59048L11.6571 0L8.90476 1.1819L6.15238 0L4.62238 2.58238L1.7 3.2381L1.97524 6.23333L0 8.5L1.97524 10.7586L1.7 13.7538L4.62238 14.4176L6.15238 17L8.90476 15.81L11.6571 16.9919L13.1871 14.4095L16.1095 13.7457L15.8343 10.7586L17.8095 8.5Z"
													fill="white"
												/>
												<path
													d="M7.3956 12.1429L5.66675 6.494H7.62684L8.74022 10.9039H9.06951L10.1855 5.66675H12.1429L10.4141 12.1429H7.3956Z"
													fill="#0816B3"
												/>
												<path
													fillRule="evenodd"
													clipRule="evenodd"
													d="M10.1191 5.26196H14.4169L13.6074 6.88101H10.1191V5.26196Z"
													fill="#0816B3"
												/>
											</svg>
										)}
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
								{token._is_the_reference_merged !== undefined &&
								!token._is_the_reference_merged &&
								type === 'collection' ? (
									<>
										<div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg backdrop-saturate-200 z-10" />
										<div
											className="absolute top-0 left-0 w-full h-full bg-cover bg-white"
											style={{ backgroundImage: `url(${parseImgUrl(profileCollection)})` }}
										/>
										<div className="flex items-center justify-center w-full h-full">
											<div className="z-20">
												<img
													src={parseImgUrl(profileCollection)}
													width={100}
													className="mx-auto rounded-full"
												/>
											</div>
										</div>
									</>
								) : (
									<>
										<Media
											className="mx-auto h-full object-cover relative z-10 img-hor-vert"
											url={imgUrl}
											videoControls={false}
											videoMuted={true}
											videoLoop={true}
											mimeType={token?.mime_type}
										/>
										{token?.is_auction && <TimeAuction endedAt={token.ended_at} />}
									</>
								)}
							</div>
							<div className="card-bg relative z-10">
								<div
									className="absolute inset-0 rounded-md z-20"
									style={{ fontSize: `${dimension.width / 14}px`, padding: `.3em` }}
								>
									<div className="h-full border-gray-400 border-2">
										<div
											className="py-2 overflow-hidden"
											style={{ height: '90%' }}
											ref={wrapperRef}
										>
											<div className="mb-2" ref={descRef}>
												<h4 className="px-2 truncate" style={{ fontSize: `0.75em` }}>
													Description
												</h4>
												<h4
													className={`px-2 whitespace-pre-line ${
														classDescAttr.desc && `line-clamp-12`
													}`}
													style={{ fontSize: `0.5em` }}
												>
													{token.description?.replace(/\n\s*\n\s*\n/g, '\n\n')}
												</h4>
											</div>
											<div className="mb-2" ref={attrRef}>
												<h4 className="px-2 truncate" style={{ fontSize: `0.75em` }}>
													{'Attributes'}
												</h4>
												<h4
													className={`px-2 ${classDescAttr.attr && `line-clamp-4`}`}
													style={{ fontSize: `0.5em` }}
												>
													{token.attributes
														?.map(({ value, trait_type }) => `${trait_type} ${value}`)
														.join(', ') || 'None'}
												</h4>
											</div>
											<div className="flex items-end px-2 space-x-1" ref={royaltyRef}>
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
