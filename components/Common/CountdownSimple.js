import { useRef, useEffect, useState } from 'react'

export default function CountdownSimple({ endedDate = 1656657390000 }) {
	const [num, setNum] = useState()

	let intervalRef = useRef()

	const decreaseNum = () => {
		const startedDate = new Date().getTime()
		const endedDateTime = new Date(parseInt(endedDate.slice(0, 13))).getTime()

		const distance = parseInt((parseInt(endedDateTime) - parseInt(startedDate)) / 1000)

		if (distance <= 0) {
			setNum(Math.max(0, distance))
			clearInterval(intervalRef.current)
		} else {
			setNum(Math.max(0, distance))
		}
	}

	useEffect(() => {
		intervalRef.current = setInterval(decreaseNum, 1000)
		return () => clearInterval(intervalRef.current)
	}, [])

	const days = Math.floor(num / (60 * 60 * 24))
	const hours = Math.floor((num % (60 * 60 * 24)) / (60 * 60))
	const minutes = Math.floor((num % (60 * 60)) / 60)
	const seconds = Math.floor(num % 60)

	const daysText = days > 0 ? `${days}d ` : ''
	const hoursText = hours > 0 ? `${hours}h ` : ''
	const minutesText = minutes > 0 ? `${minutes}m ` : ''
	const secondsText = seconds > 0 ? `${seconds}s` : ''

	return (
		<div>
			{num !== 0 ? (
				<>
					<p className="text-xs text-gray-400">Auction ends in</p>
					<div className="text-white text-xl">
						{daysText + hoursText + minutesText + secondsText}
					</div>
				</>
			) : (
				<p className="text-xs text-gray-400">Auction Ended</p>
			)}
		</div>
	)
}
