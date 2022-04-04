import { useEffect, useState } from 'react'
import { parseImgUrl } from 'utils/common'
import axios from 'axios'
import FileType from 'file-type/browser'

const Media = ({
	className,
	url,
	videoControls = false,
	videoMuted = true,
	videoLoop = false,
	videoPadding = false,
	playVideoButton = true,
	mimeType,
	seeDetails,
	isAuction,
}) => {
	const [media, setMedia] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [playVideo, setPlayVideo] = useState(false)

	useEffect(() => {
		if (url && !mimeType?.includes('gif')) {
			getMedia()
		} else {
			setIsLoading(false)
		}
	}, [url, playVideo])

	const getMedia = async () => {
		try {
			const resp = await axios.get(`${parseImgUrl(url, undefined, { seeDetails: seeDetails })}`, {
				responseType: 'blob',
			})

			const fileType = await FileType.fromBlob(resp.data)

			const objectUrl = URL.createObjectURL(resp.data)

			setMedia({
				type: fileType.mime,
				url: [objectUrl],
			})
			setIsLoading(false)
		} catch (err) {
			setMedia({
				type: 'image/jpg',
				url: parseImgUrl(url, undefined, { seeDetails: seeDetails }),
			})
			setIsLoading(false)
		}
	}

	if (isLoading) {
		return (
			<div className={className}>
				<div className="flex items-center justify-center w-full h-full">
					<svg
						className="animate-spin m h-5 w-5 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				</div>
			</div>
		)
	}

	if (media?.type.includes('image')) {
		const isPng = media?.type === 'image/png'
		const pixelated = isPng ? '' : ''
		return (
			<>
				<img className={`object-contain w-full h-full ${className} ${pixelated}`} src={media.url} />
				{isAuction === '561' && (
					<div className="absolute right-0 bottom-3 text-gray-100 py-1 px-2 rounded-l-md bg-primary bg-opacity-70 z-10">
						<p className="text-[8px] font-thin">Auction ends in</p>
						<div className="flex justify-between items-center gap-1">
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<div>
								<p className="text-[10px] font-bold">
									04 &nbsp;:&nbsp; 19 &nbsp;:&nbsp; 27 &nbsp;:&nbsp; 12
								</p>
								<p className="text-[8px]">Days&nbsp; Hours&nbsp; Mins&nbsp; Secs</p>
							</div>
						</div>
					</div>
				)}
			</>
		)
	}

	if (mimeType?.includes('gif')) {
		return (
			<video
				playsInline
				controls={false}
				loop={true}
				muted={false}
				autoPlay
				className="w-full h-full"
			>
				<source type="video/mp4" src={`${url}&fm=mp4`}></source>
			</video>
		)
	}

	if (media?.type.includes('video')) {
		return (
			<div className="relative w-full mx-auto h-full">
				{!videoControls && playVideoButton && (
					<div
						className=" absolute bg-gray-200 p-2 rounded-full right-3 md:right-5 z-30 bottom-1/10"
						onClick={async (e) => {
							e.preventDefault()
							e.stopPropagation()
							setPlayVideo(true)
						}}
					>
						<svg
							className="relative z-10"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M5 20.9999V2.99993C5 2.20876 5.87525 1.73092 6.54076 2.15875L20.5408 11.1587C21.1531 11.5524 21.1531 12.4475 20.5408 12.8411L6.54076 21.8411C5.87525 22.2689 5 21.7911 5 20.9999Z"
								fill="rgba(0,0,0,0.8)"
							/>
						</svg>
					</div>
				)}
				<video
					className={`w-full h-full ${className} ${videoPadding ? 'md:pt-0 pt-8' : ''}`}
					playsInline
					loop={videoLoop}
					controls={videoControls}
					muted={videoMuted}
				>
					<source type="video/mp4" src={media.url}></source>
				</video>
				{playVideo && (
					<video
						className={`w-full h-full absolute inset-0 rounded-lg overflow-hidden z-40 pt-0 `}
						playsInline
						loop={true}
						controls={true}
						muted={false}
						autoPlay
						onClick={(e) => {
							if (navigator.userAgent.indexOf('Chrome') !== -1) {
								e.preventDefault()
								e.stopPropagation()
								setPlayVideo(false)
							}
						}}
					>
						<source type="video/mp4" src={media.url}></source>
					</video>
				)}
			</div>
		)
	}

	if (media?.type) {
		return (
			<div className={className}>
				<div className="w-full h-full flex items-center justify-center">
					<p>Media not supported</p>
				</div>
			</div>
		)
	}

	return null
}

export default Media
