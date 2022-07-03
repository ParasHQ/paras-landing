import { useEffect, useState } from 'react'

const TimeLaunchpad = ({ date, timeType, isEnded = () => {} }) => {
	const [days, setDays] = useState('-')
	const [hours, setHours] = useState('-')
	const [minutes, setMinutes] = useState('-')
	const [seconds, setSeconds] = useState('-')
	const [isEndedTime, setIsEndedTime] = useState(false)

	useEffect(() => {
		countDownTimer()
	}, [isEndedTime])

	const countDownTimer = () => {
		const firstDate = date * 1000

		const timer = setInterval(() => {
			const secondDate = new Date().getTime()

			if (!isEndedTime) {
				let distance = firstDate - secondDate

				const days = Math.floor(distance / (1000 * 60 * 60 * 24))
				const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
				const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
				const seconds = Math.floor((distance % (1000 * 60)) / 1000)

				if (distance <= 0) {
					clearInterval(timer)
					setIsEndedTime(true)
					isEnded(true)
					return
				}

				setDays(days)
				setHours(hours)
				setMinutes(minutes)
				setSeconds(seconds)
			}

			return
		})
	}
	return (
		<>
			{!isEndedTime ? (
				<p
					className={`text-white ${
						timeType === 'upcoming' && `text-sm bg-gray-800 rounded-xl`
					} mx-6 md:mx-[72px] -mt-0.5 pt-0.5`}
				>
					{days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's'}
				</p>
			) : (
				<p className={`${timeType === 'upcoming' ? `text-green-500` : `text-red-500`}`}>
					{timeType === 'upcoming' ? `Live` : 'Ended'}
				</p>
			)}
		</>
	)
}

export default TimeLaunchpad
