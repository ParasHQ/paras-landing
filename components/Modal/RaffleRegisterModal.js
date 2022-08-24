import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import Button from 'components/Common/Button'
import { IconX } from 'components/Icons'
import useStore from 'lib/store'
import { capitalizeFirstLetter } from 'utils/common'
import ParasRequest from 'lib/ParasRequest'

const RaffleRegisterModal = () => {
	const [showModal, setShowModal] = useState(false)
	const [isSignedUp, setIsSignedUp] = useState(false)
	const [dontShowAgain, setDontShowAgain] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const currentUser = useStore((state) => state.currentUser)

	const localStorageDontShowAgain = useRef(null)

	const fetchRaffle = async () =>
		ParasRequest.get(`${process.env.V2_API_URL}/raffle/status`).then((res) => res.data)

	const { data } = useSWR(currentUser ? 'raffle-status' : null, fetchRaffle, {
		revalidateOnFocus: false,
		revalidateIfStale: false,
		revalidateOnReconnect: false,
	})

	const onClickSignUp = async () => {
		try {
			setIsLoading(true)
			await ParasRequest.post(`${process.env.V2_API_URL}/raffle/register`, {
				raffle_id: data.raffle_id,
			})
			setIsSignedUp(true)
			setIsLoading(false)
			localStorage.removeItem('dontShowAgainRaffle')
		} catch (error) {
			return error
		}
	}

	const onClickNextTime = () => {
		if (dontShowAgain) {
			localStorage.setItem('dontShowAgainRaffle', true)
		}
		onClose()
	}

	const onClose = () => {
		setShowModal(false)
	}

	useEffect(() => {
		localStorageDontShowAgain.current = localStorage.getItem('dontShowAgainRaffle')
	}, [])

	useEffect(() => {
		if (
			data &&
			data.raffle_id &&
			data.current_level !== 'bronze' &&
			data.status !== 'registered' &&
			localStorageDontShowAgain.current !== 'true'
		) {
			setShowModal(true)
		}
	}, [data])

	if (!data || !showModal) {
		return null
	}

	return (
		<div className="fixed z-50 bottom-0 right-0 w-full md:w-auto">
			<div className="max-w-xl relative bg-[#25222b] rounded-md p-4 md:py-6 md:px-10 text-center m-8">
				<div className="absolute right-0 top-0 pr-4 pt-4">
					<div className="cursor-pointer" onClick={onClose}>
						<IconX />
					</div>
				</div>
				{isSignedUp ? (
					<div className="md:w-[23rem]">
						<p className="text-xl md:text-2xl font-semibold text-gray-100">
							Thanks for Participating
						</p>
						<p className="text-xl md:text-2xl font-semibold text-gray-100 mt-2">Goodluck!✨</p>
					</div>
				) : (
					<div className="md:w-[23rem]">
						<p className="text-xl md:text-2xl font-semibold text-gray-100">
							Sign Up for {capitalizeFirstLetter(data?.current_level)} Raffle Now!
						</p>
						<p className="text-white pr-2 text-sm">
							{`Click 'Sign Up' & get a chance to win exclusive rewards for ${capitalizeFirstLetter(
								data?.current_level
							)} member.`}
						</p>
						<div className="flex my-4 md:my-6 items-center">
							<input
								type="checkbox"
								id="dontShowAgain"
								name="dontShowAgain"
								className="flex-0 w-auto"
								value={dontShowAgain}
								onChange={(e) => setDontShowAgain(e.target.checked)}
							/>
							<label htmlFor="dontShowAgain" className="ml-2 text-gray-300 text-xs select-none">
								{`Don't show this message again`}
							</label>
						</div>
						<div className="flex space-x-4 md:space-x-8">
							<Button size="md" isFullWidth onClick={onClickSignUp} isLoading={isLoading}>
								Sign up
							</Button>
							<Button variant="white" size="md" isFullWidth onClick={onClickNextTime}>
								Next time
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default RaffleRegisterModal
