import { useState } from 'react'
import useSWR from 'swr'
import Button from 'components/Common/Button'
import ParasRequest from 'lib/ParasRequest'
import { capitalize, isDateLessThanTwoDaysBefore } from 'utils/common'

const NotificationSignUpRaffle = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [isSignedUp, setIsSignedUp] = useState(false)

	const fetchRaffle = async () =>
		ParasRequest.get(`${process.env.V2_API_URL}/raffle/status`).then((res) => res.data)

	const { data, mutate } = useSWR('raffle-status', fetchRaffle, {
		revalidateOnFocus: false,
		revalidateIfStale: false,
		revalidateOnReconnect: false,
		revalidateOnMount: true,
	})

	const onClickSignUp = async () => {
		try {
			setIsLoading(true)
			await ParasRequest.post(`${process.env.V2_API_URL}/raffle/register`, {
				raffle_id: data.raffle_id,
			})
			setTimeout(() => {
				mutate()
				setIsSignedUp(true)
				setIsLoading(false)
				localStorage.removeItem('dontShowAgainRaffle')
			}, 500)
		} catch (error) {
			return error
		}
	}

	if (data && data.raffle_id && data.current_level !== 'bronze' && data.status !== 'registered') {
		return (
			<div className="p-2 rounded-md w-full button-wrapper flex items-center">
				<div className="text-gray-300 select-none w-full">
					<div>
						<p className="text-base font-bold">
							{data.raffle.ended_at && isDateLessThanTwoDaysBefore(data.raffle.ended_at)
								? 'Raffle Registration Will End Soon!'
								: `Sign Up for ${capitalize(data?.current_level)} Raffle Now!`}
						</p>
						<p className="text-sm">
							{`Click 'Sign Up' & get a chance to win exclusive rewards for ${capitalize(
								data?.current_level
							)} member.`}
						</p>
						<div className="flex justify-center">
							<Button
								size="sm"
								onClick={onClickSignUp}
								className="text-center mt-2"
								isDisabled={isLoading}
							>
								Sign Up
							</Button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (isSignedUp) {
		return (
			<div className="p-2 rounded-md w-full button-wrapper flex items-center">
				<div className="text-gray-300 select-none w-full">
					<p className="font-bold text-base">Confirmation of Raffle Entry</p>
					<p className="text-sm">{`You’ve been registered for the raffle. Thank you & good luck! ✨`}</p>
				</div>
			</div>
		)
	}

	return null
}

export default NotificationSignUpRaffle
