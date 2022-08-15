import { useState } from 'react'
import useSWR from 'swr'
import Button from 'components/Common/Button'
import ParasRequest from 'lib/ParasRequest'

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
			}, 500)
		} catch (error) {
			return error
		}
	}

	if (data && data.current_level !== 'bronze' && data.status !== 'registered') {
		return (
			<div className="p-2 rounded-md w-full button-wrapper flex items-center">
				<div className="text-gray-300 select-none w-full">
					<div className="text-center">
						<p className="text-lg font-bold">Get a chance to win a raffle!</p>
						<Button size="sm" onClick={onClickSignUp} isDisabled={isLoading}>
							Sign Up
						</Button>
					</div>
				</div>
			</div>
		)
	}

	if (isSignedUp) {
		return (
			<div className="p-2 rounded-md w-full button-wrapper flex items-center">
				<div className="text-gray-300 select-none w-full">
					<p>We have recorded your information for the raffle</p>
				</div>
			</div>
		)
	}

	return null
}

export default NotificationSignUpRaffle
