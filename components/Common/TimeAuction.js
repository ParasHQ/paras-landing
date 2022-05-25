import { useEffect, useState } from 'react'

const TimeAuction = ({ endedAt }) => {
	const [days, setDays] = useState('-')
	const [hours, setHours] = useState('-')
	const [mins, setMins] = useState('-')
	const [secs, setSecs] = useState('-')
	const [isEndedTime, setIsEndedTime] = useState(false)

	useEffect(() => {
		countDownTimeAuction()
	}, [isEndedTime])

	const convertTimeOfAuction = (date) => {
		const sliceNanoSec = String(date).slice(0, 13)

		if (sliceNanoSec !== 'undefined') {
			return sliceNanoSec
		}
	}

	const countDownTimeAuction = () => {
		const endedDate = convertTimeOfAuction(endedAt)

		const timer = setInterval(() => {
			const startedDate = new Date().getTime()

			if (!isEndedTime) {
				let distance = parseInt(endedDate) - parseInt(startedDate)

				const days = Math.floor(distance / (1000 * 60 * 60 * 24))
				const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
				const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
				const seconds = Math.floor((distance % (1000 * 60)) / 1000)

				setDays(days)
				setHours(hours)
				setMins(minutes)
				setSecs(seconds)

				if (distance <= 0) {
					clearInterval(timer)
					setIsEndedTime(true)
				}
			}

			return
		})
	}

	return (
		!isEndedTime && (
			<div className="absolute right-0 bottom-5 text-gray-100 py-1 px-2 rounded-l-md bg-primary bg-opacity-70 z-10">
				<p className="text-[8px] md:text-[8px] font-thin">Auction ends in</p>
				<div className="flex justify-between items-center gap-1">
					<svg
						className="w-4 h-4 md:w-6 md:h-6"
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
						<p className="text-[10px] md:text-[10px] font-bold">
							{days} &nbsp;&nbsp;:&nbsp;&nbsp; {hours} &nbsp;&nbsp;:&nbsp;&nbsp; {mins}{' '}
							&nbsp;&nbsp;:&nbsp;&nbsp; {secs}
						</p>
						<p className="text-[8px] md:text-[8px]">Days&nbsp; Hours&nbsp; Mins&nbsp; Secs</p>
					</div>
				</div>
			</div>
		)
	)
}

export default TimeAuction
