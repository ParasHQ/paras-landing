import { useState } from 'react'
import { useIntl } from 'hooks/useIntl'
import { prettyBalance } from 'utils/common'
import useStore from 'lib/store'
import Button from 'components/Common/Button'
import TokenTransferModal from 'components/Modal/TokenTransferModal'
import PlaceOfferModal from 'components/Modal/PlaceOfferModal'
import TokenUpdatePriceModal from 'components/Modal/TokenUpdatePriceModal'
import TokenBuyModal from 'components/Modal/TokenBuyModal'
import JSBI from 'jsbi'

const TokenCurrentPrice = ({ localToken, className }) => {
	const [showModal, setShowModal] = useState('')

	const currentUser = useStore((state) => state.currentUser)
	const store = useStore()
	const { localeLn } = useIntl()

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

	const onClickTransfer = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('transfer')
	}

	const onClickUpdate = () => {
		setShowModal('updatePrice')
	}

	const onDismissModal = () => {
		setShowModal(null)
	}

	return (
		<div className={className}>
			<div className="text-white bg-cyan-blue-3 rounded-t-xl mt-3">
				<div className="flex justify-between items-center pr-2 pl-6">
					<p className="text-xl py-3">Current Price</p>
				</div>
			</div>
			<div className="text-white bg-cyan-blue-1 rounded-b-xl px-6 pb-8">
				<p className="flex items-center gap-1 text-4xl font-bold py-8">
					{localToken.price ? (
						<div className="flex">
							<div className="truncate">
								{localToken.price === '0'
									? localeLn('Free')
									: localToken.price && `${prettyBalance(localToken.price, 24, 4)} Ⓝ`}
							</div>
							<span className="text-[10px] font-normal text-gray-400 pt-2">
								(${prettyBalance(JSBI.BigInt(localToken.price * store.nearUsdPrice), 24, 4)})
							</span>
						</div>
					) : (
						<div>
							<div className="line-through text-red-600">
								<span className="text-gray-100">{localeLn('SALE')}</span>
							</div>
						</div>
					)}
				</p>
				{localToken.owner_id !== currentUser && localToken.price ? (
					<div className="flex justify-between gap-6">
						<Button size="lg" onClick={onClickBuy} isFullWidth>
							Buy
						</Button>
						<Button size="md" onClick={onClickOffer} isFullWidth variant="ghost">
							Place an offer
						</Button>
					</div>
				) : (
					localToken.owner_id !== currentUser &&
					!localToken.price && (
						<Button size="lg" onClick={onClickOffer} isFullWidth variant="ghost">
							{`Place an offer`}
						</Button>
					)
				)}
				{localToken.owner_id === currentUser && (
					<div className="flex justify-between gap-6">
						<Button size="lg" onClick={onClickUpdate} isFullWidth>
							Update Listing
						</Button>
						<Button size="md" onClick={onClickTransfer} isFullWidth>
							Transfer
						</Button>
					</div>
				)}
			</div>
			<TokenBuyModal show={showModal === 'buy'} onClose={onDismissModal} data={localToken} />
			<PlaceOfferModal
				show={showModal === 'placeoffer'}
				data={localToken}
				onClose={onDismissModal}
				setShowModal={setShowModal}
			/>
			<TokenTransferModal
				show={showModal === 'transfer'}
				onClose={onDismissModal}
				data={localToken}
			/>
			<TokenUpdatePriceModal
				show={showModal === 'updatePrice'}
				onClose={onDismissModal}
				data={localToken}
			/>
		</div>
	)
}

export default TokenCurrentPrice
