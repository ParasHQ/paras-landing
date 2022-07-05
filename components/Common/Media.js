import { useEffect, useRef, useState } from 'react'
import { parseImgUrl } from 'utils/common'
import axios from 'axios'
import FileType from 'file-type/browser'
import { IconPause, IconPlay, IconSpin } from 'components/Icons'

const Media = ({
	className,
	url,
	audioUrl,
	videoControls = false,
	videoMuted = true,
	videoLoop = false,
	videoPadding = false,
	playVideoButton = true,
	animationUrlforVideo,
	mimeType,
	seeDetails,
	isMediaCdn,
	isAuction,
}) => {
	const [media, setMedia] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [playVideo, setPlayVideo] = useState(false)
	const audioRef = useRef()
	const [isPlaying, setIsPlaying] = useState(false)

	useEffect(() => {
		if (url && seeDetails && media !== null) {
			setMedia(null)
		}
		if (url && !mimeType?.includes('gif')) {
			getMedia()
		} else {
			setIsLoading(false)
		}
	}, [url, playVideo])

	const togglePlayPause = (type) => {
		const nextToggleValue = type
		if (nextToggleValue === 'play') {
			setIsPlaying(false)
			audioRef.current.pause()
		} else {
			setIsPlaying(true)
			audioRef.current.play()
		}
	}

	const getMedia = async () => {
		try {
			const resp = await axios.get(`${parseImgUrl(url, undefined, { seeDetails, isMediaCdn })}`, {
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
				url: parseImgUrl(url, undefined, { seeDetails, isMediaCdn }),
			})
			setIsLoading(false)
		}
	}

	if (isLoading) {
		return (
			<div className={`h-full w-full ${className}`}>
				<div className="flex items-center justify-center w-full h-full">
					<IconSpin />
				</div>
			</div>
		)
	}

	if (audioUrl && mimeType?.includes('audio')) {
		return (
			<div className="relative flex items-center justify-center w-full">
				<img className={`object-contain w-full h-full`} src={media.url} />
				<div className="absolute bottom-1 md:bottom-2 flex justify-end items-center w-11/12 z-10">
					{isPlaying ? (
						<div
							className="w-9 h-9 p-1 flex items-center justify-center rounded-full bg-dark-primary-5 cursor-pointer hover:bg-dark-primary-7 transition-all"
							onClick={(e) => {
								e.preventDefault()
								e.stopPropagation()
								togglePlayPause('play')
							}}
						>
							<IconPause size={26} />
						</div>
					) : (
						<div
							className="w-9 h-9 p-1 flex items-center justify-center rounded-full bg-dark-primary-5 cursor-pointer hover:bg-dark-primary-7 transition-all"
							onClick={(e) => {
								e.preventDefault()
								e.stopPropagation()
								togglePlayPause('pause')
							}}
						>
							<IconPlay size={26} />
						</div>
					)}
					<audio ref={audioRef}>
						<source src={parseImgUrl(audioUrl, undefined, { seeDetails: seeDetails })} />
					</audio>
				</div>
			</div>
		)
	}

	if (media?.type.includes('image')) {
		const isPng = media?.type === 'image/png'
		const pixelated = isPng ? '' : ''
		return (
			<img className={`object-contain w-full h-full ${className} ${pixelated}`} src={media.url} />
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
						className={`absolute bg-gray-200 p-2 rounded-full ${
							isAuction ? 'top-0 md: left-3 md:left-5' : 'right-3 md:right-5 bottom-1/10'
						} z-30`}
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
					<source type="video/mp4" src={animationUrlforVideo || media.url}></source>
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
						<source type="video/mp4" src={animationUrlforVideo || media.url}></source>
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
