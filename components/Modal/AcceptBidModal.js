import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { prettyBalance } from 'utils/common'
import Modal from 'components/Modal'
import { useIntl } from 'hooks/useIntl'
import JSBI from 'jsbi'
import Button from 'components/Common/Button'

const AcceptBidModal = ({ onClose, token, data, storageFee, isLoading, onSubmitForm }) => {
	const { localeLn } = useIntl()
	const royaltyForArtist =
		Object.keys(token.royalty).length === 0
			? 0
			: JSBI.divide(
					JSBI.multiply(JSBI.BigInt(Object.values(token.royalty)[0]), JSBI.BigInt(data.price)),
					JSBI.BigInt(10000)
			  ).toString()

	const serviceFee = JSBI.divide(
		JSBI.multiply(JSBI.BigInt(500), JSBI.BigInt(data.price)),
		JSBI.BigInt(10000)
	).toString()

	const userWillGet = JSBI.subtract(
		JSBI.BigInt(data.price),
		JSBI.add(JSBI.BigInt(royaltyForArtist), JSBI.BigInt(serviceFee))
	).toString()

	return (
		<Modal closeOnBgClick={false} closeOnEscape={false} close={onClose}>
			<div className="max-w-sm w-full p-4 bg-gray-800 m-auto rounded-md relative">
				<div>
					<h1 className="text-2xl font-bold text-white tracking-tight">
						{localeLn('Accept a Bid')}
					</h1>
					<p className="text-white mt-2">
						{localeLn('You are about to accept bid for')} <b>{token.metadata.name}</b>{' '}
						{localeLn('from')} <b>{data.buyer_id}</b>
					</p>
					<div className="text-white mt-4 text-2xl font-bold text-center">
						{`${prettyBalance(data.price, 24, 4)} Ⓝ `}
					</div>
					<div className="mt-4 text-center">
						<div className="flex justify-between">
							<div className="text-sm">
								{localeLn('Royalty for Artist')} (
								{Object.keys(token.royalty).length === 0
									? `None`
									: `${Object.values(token.royalty)[0] / 100}%`}
								)
							</div>
							<div>{formatNearAmount(royaltyForArtist)} Ⓝ</div>
						</div>
						<div className="flex justify-between">
							<div className="text-sm">{localeLn('Service Fee')} (5%)</div>
							<div>{formatNearAmount(serviceFee)} Ⓝ</div>
						</div>
						<div className="flex justify-between">
							<div className="text-sm">{localeLn('You will get')}</div>
							<div>{formatNearAmount(userWillGet)} Ⓝ</div>
						</div>
					</div>
					<div className="mt-4 text-center">
						<div className="text-white my-1">
							<div className="flex justify-between">
								<div className="text-sm">{localeLn('Storage Fee')}</div>
								<div className="text">{formatNearAmount(storageFee)} Ⓝ</div>
							</div>
						</div>
					</div>
					<p className="text-white mt-4 text-sm text-center opacity-90">
						{localeLn('You will be redirected to NEAR Web Wallet to confirm your transaction.')}
					</p>

					<div className="">
						<Button
							size="md"
							isFullWidth
							disabled={isLoading}
							className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
							onClick={onSubmitForm}
						>
							{isLoading ? 'Accepting...' : 'Accept Bid'}
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

export default AcceptBidModal
