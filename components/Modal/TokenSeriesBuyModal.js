import { useEffect, useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import near from 'lib/near'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import LoginModal from './LoginModal'
import JSBI from 'jsbi'
import { GAS_FEE, STORAGE_MINT_FEE } from 'config/constants'
import { IconX } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import { trackBuyTokenSeries, trackBuyTokenSeriesImpression } from 'lib/ga'

const TokenSeriesBuyModal = ({ show, onClose, data }) => {
	const [showLogin, setShowLogin] = useState(false)
	const { localeLn } = useIntl()

	useEffect(() => {
		if (show) {
			trackBuyTokenSeriesImpression(data.token_series_id)
		}
	}, [show])

	const onBuyToken = async () => {
		if (!near.currentUser) {
			setShowLogin(true)
			return
		}
		const params = {
			token_series_id: data.token_series_id,
			receiver_id: near.currentUser.accountId,
		}

		const attachedDeposit = JSBI.add(JSBI.BigInt(data.price), JSBI.BigInt(STORAGE_MINT_FEE))

		trackBuyTokenSeries(data.token_series_id)

		try {
			await near.wallet.account().functionCall({
				contractId: data.contract_id,
				methodName: `nft_buy`,
				args: params,
				gas: GAS_FEE,
				attachedDeposit: attachedDeposit.toString(),
			})
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-sm w-full p-4 bg-gray-800 m-auto rounded-md relative">
					<div className="absolute right-0 top-0 pr-4 pt-4">
						<div className="cursor-pointer" onClick={onClose}>
							<IconX />
						</div>
					</div>
					<div>
						<h1 className="text-2xl font-bold text-white tracking-tight">
							{localeLn('Confirm_Buy')}
						</h1>
						<p className="text-white mt-2">
							{localeLn('Are_About_To_Purchase')} <b>{data.metadata.title}</b>
						</p>
						<div className="mt-4">
							<div className="mt-2 text-sm text-red-500"></div>
						</div>
						<div className="mt-4 text-center">
							<div className="text-white my-1">
								<div className="flex justify-between">
									<div className="text-sm">{localeLn('Total')}</div>
									<div className="text">{data.price && `${formatNearAmount(data.price)} Ⓝ`}</div>
								</div>
								<div className="flex justify-between">
									<div className="text-sm">{localeLn('Storage_Fee')}</div>
									<div className="text">{formatNearAmount(STORAGE_MINT_FEE)} Ⓝ</div>
								</div>
							</div>
						</div>
						<p className="text-white mt-4 text-sm text-center opacity-90">
							{localeLn('Redirected_To_confirm')}
						</p>
						<div className="mt-6">
							<Button size="md" isFullWidth onClick={onBuyToken}>
								{data.price !== '0' ? 'Buy' : 'Get for Free'}
							</Button>
						</div>
					</div>
				</div>
			</Modal>
			<LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
		</>
	)
}

export default TokenSeriesBuyModal
