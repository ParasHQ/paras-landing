import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { prettyBalance } from '../utils/common'
import Modal from './Modal'

const AcceptBidModal = ({
	onClose,
	token,
	data,
	userOwnership,
	isLoading,
	onSubmitForm,
}) => {
	const bidTotalForUser =
		formatNearAmount(data.bidMarketData.amount) *
		(data.bidMarketData.quantity > userOwnership.quantity
			? userOwnership.quantity
			: data.bidMarketData.quantity)
	const royaltyForArtist =
		(parseInt(token.metadata.royalty) * bidTotalForUser) / 100
	const serviceFee = bidTotalForUser * 0.05
	const userWillGet = bidTotalForUser - royaltyForArtist - serviceFee

	return (
		<Modal closeOnBgClick={false} closeOnEscape={false} close={onClose}>
			<div className="max-w-sm w-full p-4 bg-gray-100 m-auto rounded-md">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
						Accept a Bid
					</h1>
					<p className="text-gray-900 mt-2">
						You are about to accept bid for <b>{token.metadata.name}</b> from{' '}
						<b>{data.accountId}</b>
					</p>
					<div className="text-gray-900 mt-4 text-2xl font-bold text-center">
						{`${prettyBalance(data.bidMarketData.amount, 24, 4)} Ⓝ `}
						<span className="font-normal text-base">for </span>
						{`${
							data.bidMarketData.quantity > userOwnership.quantity
								? userOwnership.quantity
								: data.bidMarketData.quantity
						} pcs`}
					</div>
					<div className="mt-4 text-center">
						<div className="flex justify-between">
							<div className="text-sm">
								Royalty for Artist ({token.metadata.royalty}%)
							</div>
							<div>{royaltyForArtist}</div>
						</div>
						<div className="flex justify-between">
							<div className="text-sm">Service Fee (5%)</div>
							<div>{serviceFee} Ⓝ</div>
						</div>
						<div className="flex justify-between">
							<div className="text-sm">You will get</div>
							<div>{userWillGet} Ⓝ</div>
						</div>
					</div>
					<p className="text-gray-900 mt-4 text-sm text-center">
						Please make sure that your card is not on sale to accept the bid
					</p>
					<div className="">
						<button
							disabled={isLoading}
							className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
							onClick={onSubmitForm}
						>
							{isLoading ? 'Accepting...' : 'Accept Bid'}
						</button>
						<button
							disabled={isLoading}
							className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary text-primary"
							onClick={onClose}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default AcceptBidModal
