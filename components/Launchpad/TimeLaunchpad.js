import { useEffect, useRef, useState } from 'react'

const TimeLaunchpad = ({ date, timeType, isEnded = () => {} }) => {
	const [count, setCount] = useState()
	let intervalRef = useRef()

	const decreaseNum = () => {
		const firstDate = date
		const secondDate = new Date().getTime()

		const distance = firstDate - secondDate

		if (distance >= 0) {
			setCount(Math.max(0, distance))
		} else {
			isEnded(true)
			setCount(0)
			clearInterval(intervalRef.current)
		}
	}

	useEffect(() => {
		intervalRef.current = setInterval(decreaseNum, 1000)
		return () => clearInterval(intervalRef.current)
	}, [])

	const days = Math.floor(count / (1000 * 60 * 60 * 24))
	const hours = Math.floor((count % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
	const minutes = Math.floor((count % (1000 * 60 * 60)) / (1000 * 60))
	const seconds = Math.floor((count % (1000 * 60)) / 1000)

	const daysText = `${days}d `
	const hoursText = `${hours}h `
	const minutesText = `${minutes}m `
	const secondsText = `${seconds}s`

	if (count === undefined) {
		return (
			<p
				className={`text-white ${
					timeType === 'upcoming' && `text-sm bg-gray-800 rounded-xl`
				} mx-6 md:mx-[72px] -mt-0.5 pt-0.5`}
			>
				-
			</p>
		)
	}

	return (
		<>
			{count !== 0 ? (
				<p
					className={`text-white ${
						timeType === 'upcoming' && `text-sm bg-gray-800 rounded-xl`
					} mx-6 md:mx-[72px] -mt-0.5 pt-0.5`}
				>
					{daysText + hoursText + minutesText + secondsText}
				</p>
			) : (
				<p className={`${timeType === 'upcoming' && `text-green-500`}`}>
					{timeType === 'upcoming' || timeType === 'mint-start' ? `Live` : 'Ended'}
				</p>
			)}
		</>
	)
}

export default TimeLaunchpad
