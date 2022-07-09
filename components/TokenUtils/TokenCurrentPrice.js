import { prettyBalance } from 'utils/common'
import Button from 'components/Common/Button'
import JSBI from 'jsbi'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import useStore from 'lib/store'

const TokenCurrentPrice = ({ localToken, setShowModal, className }) => {
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
		<div className={className}>
			<div className="text-white bg-cyan-blue-3 rounded-t-xl mt-3">
				<div className="flex justify-between items-center pr-2 pl-6">
					<p className="text-xl py-3">Current Price</p>
				</div>
			</div>
			<div className="text-white bg-cyan-blue-2 rounded-b-xl px-6">
				<p className="flex items-center gap-1 text-4xl font-bold py-8">
					{formatNearAmount(localToken.price)} <span className="text-2xl">Ⓝ</span>
					<span className="text-[10px] font-normal text-gray-400 pt-2">
						(${prettyBalance(JSBI.BigInt(localToken.price * store.nearUsdPrice), 24, 4)})
					</span>
				</p>
				<div className="pb-8">
					{localToken.owner_id !== currentUser && localToken.price && (
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
		</div>
	)
}

export default TokenCurrentPrice
