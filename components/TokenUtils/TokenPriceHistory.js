import { useState } from 'react'
import { IconDownArrow } from 'components/Icons'

const TokenPriceHistory = ({ localToken, setShowModal, className }) => {
	const [isDropDown, setIsDropDown] = useState(true)

	return (
		<div className={className}>
			<div
				className={`text-white bg-cyan-blue-3 ${
					isDropDown ? 'rounded-t-xl' : 'rounded-xl'
				} hover:cursor-pointer mt-3`}
			>
				<div
					className="flex justify-between items-center pr-2 pl-6 hover:cursor-pointer"
					onClick={() => setIsDropDown(!isDropDown)}
				>
					<p className="text-xl py-3">Price History</p>
					<IconDownArrow size={30} />
				</div>
			</div>
			{isDropDown && (
				<div className="text-white bg-cyan-blue-1 rounded-b-xl px-6 text-center py-40">Content</div>
			)}
		</div>
	)
}

export default TokenPriceHistory
