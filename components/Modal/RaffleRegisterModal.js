import Button from 'components/Common/Button'
import { IconX } from 'components/Icons'
import { useState } from 'react'

const RaffleRegisterModal = ({ show, onClose }) => {
	const [isSignedUp, setIsSignedUp] = useState(false)
	const [dontShowAgain, setDontShowAgain] = useState(false)

	const changeState = () => setIsSignedUp(!isSignedUp)

	const onClickSignUp = () => {
		return
	}

	const onClickNextTime = () => {
		if (dontShowAgain) {
			localStorage.setItem('dontShowAgainRaffle', true)
		}
		onClose()
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
					<div className="w-[23rem]">
						<p className="text-xl md:text-2xl font-semibold text-gray-100">Congratulations,</p>
						<p className="text-xl md:text-2xl font-semibold text-gray-100">
							{"You're now a Gold Member!"}
						</p>
						<p className="text-white pr-2 text-sm">
							{`Get a chance to win a raffle by clicking "Sign Up"`}
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
							<Button size="md" isFullWidth onClick={changeState}>
								Sign up
							</Button>
							<Button variant="white" size="md" isFullWidth onClick={onClickNextTime}>
								Next time
							</Button>
						</div>
					</div>
				) : (
					<div className="w-[23rem]">
						<p className="text-xl md:text-2xl font-semibold text-gray-100">
							Thanks for Participating
						</p>
						<p
							className="text-xl md:text-2xl font-semibold text-gray-100 mt-2"
							onClick={changeState}
						>
							Goodluck!✨
						</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default RaffleRegisterModal
