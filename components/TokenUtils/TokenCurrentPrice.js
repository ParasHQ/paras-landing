import { useState } from 'react'
import { prettyBalance } from 'utils/common'
import Button from 'components/Common/Button'
import JSBI from 'jsbi'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { IconDownArrow } from 'components/Icons'
import useStore from 'lib/store'

const TokenCurrentPrice = ({ token, setShowModal }) => {
	const [isDropDown, setIsDropDown] = useState(true)
	const currentUser = useStore((state) => state.currentUser)
	const store = useStore()

	const onClickBuy = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('buy')
	}

	const onClickOffer = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('placeoffer')
	}

	return (
		<div>
			<div
				className={`text-white bg-cyan-blue-3 ${
					isDropDown ? 'rounded-t-xl' : 'rounded-xl'
				} hover:cursor-pointer mt-3`}
			>
				<div
					className="flex justify-between items-center pr-2 pl-6 hover:cursor-pointer"
					onClick={() => setIsDropDown(!isDropDown)}
				>
					<p className="text-xl py-3">Current Price</p>
					<IconDownArrow size={30} />
				</div>
			</div>
			{isDropDown && (
				<div className="text-white bg-cyan-blue-2 rounded-b-xl px-6">
					<p className="flex items-center gap-1 text-4xl font-bold py-8">
						{formatNearAmount(token.price)} <span className="text-2xl">Ⓝ</span>
						<span className="text-[10px] font-normal text-gray-400 pt-2">
							(${prettyBalance(JSBI.BigInt(token.price * store.nearUsdPrice), 24, 4)})
						</span>
					</p>
					<div className="pb-8">
						{token.owner_id !== currentUser && token.price && (
							<div className="flex justify-between gap-6">
								<Button size="lg" className="truncate" onClick={onClickBuy} isFullWidth>
									Buy
								</Button>
								<Button size="lg" onClick={onClickOffer} isFullWidth variant="ghost">
									{`Place an offer`}
								</Button>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default TokenCurrentPrice
