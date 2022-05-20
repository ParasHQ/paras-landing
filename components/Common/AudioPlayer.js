import React, { useEffect, useRef, useState } from 'react'

const BackwardIcon = ({ onClick }) => (
	<div
		onClick={onClick}
		className="w-7 h-7 p-1 flex items-center justify-center rounded-full bg-dark-primary-5 cursor-pointer hover:bg-dark-primary-7 transition-all"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="icon icon-tabler icon-tabler-chevron-left"
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
			<polyline points="15 6 9 12 15 18" />
		</svg>
	</div>
)

const ForwardIcon = ({ onClick }) => (
	<div
		onClick={onClick}
		className="w-7 h-7 p-1 flex items-center justify-center rounded-full bg-dark-primary-5 cursor-pointer hover:bg-dark-primary-7 transition-all"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="icon icon-tabler icon-tabler-chevron-right"
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
			<polyline points="9 6 15 12 9 18" />
		</svg>
	</div>
)

const PlayIcon = ({ onClick }) => (
	<div
		onClick={onClick}
		className="w-7 h-7 p-1 flex items-center justify-center rounded-full bg-dark-primary-5 cursor-pointer hover:bg-dark-primary-7 transition-all"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="icon icon-tabler icon-tabler-player-play"
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
			<path d="M7 4v16l13 -8z" />
		</svg>
	</div>
)

const PauseIcon = ({ onClick }) => (
	<div
		onClick={onClick}
		className="w-7 h-7 p-1 flex items-center justify-center rounded-full bg-dark-primary-5 cursor-pointer hover:bg-dark-primary-7 transition-all"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="icon icon-tabler icon-tabler-player-pause"
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
			<rect x={6} y={5} width={4} height={14} rx={1} />
			<rect x={14} y={5} width={4} height={14} rx={1} />
		</svg>
	</div>
)

const AudioPlayer = ({ audioSrc, showTime = true, showForwardBackward = false }) => {
	const [isPlaying, setIsPlaying] = useState(false)
	const [duration, setDuration] = useState(0)
	const [currentTime, setCurrentTime] = useState(0)
	const audioRef = useRef()
	const progressRef = useRef()
	const animateRef = useRef()

	const togglePlayPause = (type) => {
		const nextToggleValue = type
		if (nextToggleValue === 'play') {
			setIsPlaying(false)
			audioRef.current.pause()
			cancelAnimationFrame(animateRef.current)
		} else {
			setIsPlaying(true)
			audioRef.current.play()
			animateRef.current = requestAnimationFrame(whilePlaying)
		}
	}

	const calculateTime = (secs) => {
		const minutes = Math.floor(secs / 60)
		const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
		const seconds = Math.floor(secs % 60)
		const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
		return `${returnedMinutes}:${returnedSeconds}`
	}

	const whilePlaying = () => {
		if (progressRef?.current?.value === progressRef?.current?.max) {
			setIsPlaying(false)
			progressRef.current.value = 0
			progressRef.current.style.setProperty('--seek-before-width', `0%`)
		} else {
			progressRef.current.value = audioRef?.current?.currentTime
			changeCurrentTime()
			animateRef.current = requestAnimationFrame(whilePlaying)
		}
	}

	const changeCurrentTime = () => {
		progressRef.current.style.setProperty(
			'--seek-before-width',
			`${(progressRef.current.value / duration) * 100}%`
		)
		setCurrentTime(progressRef.current.value)
	}

	const rangeSliding = () => {
		audioRef.current.currentTime = progressRef.current.value
		changeCurrentTime()
	}

	const forwarding = (e) => {
		e.preventDefault()
		e.stopPropagation()
		progressRef.current.value = Number(progressRef.current.value + 30)
		rangeSliding()
	}

	const backwarding = (e) => {
		e.preventDefault()
		e.stopPropagation()
		progressRef.current.value = Number(progressRef.current.value - 30)
		rangeSliding()
	}

	useEffect(() => {
		const durationAudio = Math.floor(audioRef?.current?.duration)
		setDuration(durationAudio)
		progressRef.current.max = durationAudio
	}, [audioRef?.current?.loadedmetadata, audioRef?.current?.readyState])

	return (
		<div className="w-full">
			<audio ref={audioRef} src={audioSrc}></audio>
			<div className={`flex relative items-center justify-center`}>
				{showTime && (
					<div className="absolute left-0 top-2">
						<p className="pt-0 md:pt-1 text-xs text-white">
							{calculateTime(currentTime)} /{' '}
							{duration && !isNaN(duration) && calculateTime(duration)}
						</p>
					</div>
				)}
				<div className="flex items-center space-x-2">
					{showForwardBackward && <BackwardIcon onClick={backwarding} />}
					{isPlaying ? (
						<PauseIcon
							onClick={(e) => {
								e.preventDefault()
								e.stopPropagation()
								togglePlayPause('play')
							}}
						/>
					) : (
						<PlayIcon
							onClick={(e) => {
								e.preventDefault()
								e.stopPropagation()
								togglePlayPause('pause')
							}}
						/>
					)}
					{showForwardBackward && <ForwardIcon onClick={forwarding} />}
				</div>
			</div>
			<div className="w-full items-start">
				<div className="flex">
					<input
						ref={progressRef}
						style={{ padding: `0.1rem`, accentColor: `#3A3346` }}
						defaultValue="0"
						type="range"
						onChange={rangeSliding}
					/>
				</div>
			</div>
		</div>
	)
}

export default AudioPlayer
