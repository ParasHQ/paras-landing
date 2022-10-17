import { prettyBalance } from 'utils/common'
import Modal from 'components/Modal'
import { useIntl } from 'hooks/useIntl'
import JSBI from 'jsbi'
import Button from 'components/Common/Button'
import useStore from 'lib/store'

const RejectOfferModal = ({ onClose, token, data, isLoading, onSubmitForm }) => {
	const { localeLn } = useIntl()
	const { nearUsdPrice } = useStore()

	return (
		<Modal closeOnBgClick={false} closeOnEscape={false} close={onClose}>
			<div className="max-w-sm w-full p-4 bg-gray-800 m-auto rounded-md relative">
				<div>
					<h1 className="text-2xl font-bold text-white tracking-tight">
						{localeLn('Reject Offer')}
					</h1>
					<p className="text-white mt-2">
						{localeLn('AboutToRejectOffer')} <b>{data.buyer_id}</b>
					</p>
					<div className="text-center">
						<div className="text-white mt-4 text-2xl font-bold text-center">
							{`${prettyBalance(data.price, 24, 4)} Ⓝ `}
						</div>
						{nearUsdPrice !== 0 && (
							<div className="text-xs text-gray-300 truncate">
								${prettyBalance(JSBI.BigInt(data.price) * nearUsdPrice, 24, 2)}
							</div>
						)}
					</div>
					<p className="text-white mt-4 text-sm text-center opacity-90 px-4">
						<b>{data.buyer_id}</b> {' still possible to make another offer for '}
						{token.metadata.title}
					</p>

					<div className="">
						<Button
							size="md"
							isFullWidth
							isDisabled={token.is_staked || isLoading}
							isLoading={isLoading}
							className="mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-red-500 bg-red-500 text-gray-100"
							onClick={onSubmitForm}
						>
							{'Reject Offer'}
						</Button>
						<Button
							className="mt-4"
							variant="ghost"
							size="md"
							isFullWidth
							onClick={onClose}
							isDisabled={isLoading}
						>
							{localeLn('Cancel')}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default RejectOfferModal
