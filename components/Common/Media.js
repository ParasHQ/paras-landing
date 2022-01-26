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
}) => {
	const [media, setMedia] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [playVideo, setPlayVideo] = useState(false)

	useEffect(() => {
		if (url) {
			getMedia()
		} else {
			setIsLoading(false)
		}
	}, [url, playVideo])

	const getMedia = async () => {
		try {
			const resp = await axios.get(`${parseImgUrl(url)}`, {
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
				url: parseImgUrl(url),
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
			<img className={`object-contain w-full h-full ${className} ${pixelated}`} src={media.url} />
		)
	}

	if (media?.type.includes('video')) {
		return (
			<div className=" relative">
				{!videoControls && (
					<>
						{playVideoButton && (
							<div
								className=" absolute bg-gray-200 p-2 rounded-full right-5 bottom-5 z-30"
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
					</>
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
					<>
						<div
							className=" bg-black w-full h-full absolute inset-0 z-40 flex items-center"
							onClick={(e) => {
								e.preventDefault()
								e.stopPropagation()
								setPlayVideo(false)
							}}
						>
							<Media
								className="rounded-lg overflow-hidden"
								url={media.url}
								videoControls={true}
								videoLoop={true}
								videoMuted={true}
								videoPadding={true}
							/>
						</div>
					</>
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
