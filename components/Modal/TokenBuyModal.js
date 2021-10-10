import { useEffect, useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import near from 'lib/near'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import LoginModal from './LoginModal'
import { GAS_FEE_150 } from 'config/constants'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import { trackBuyToken, trackBuyTokenImpression } from 'lib/ga'

const TokenBuyModal = ({ show, onClose, data }) => {
	const [showLogin, setShowLogin] = useState(false)
	const { localeLn } = useIntl()

	useEffect(() => {
		if (show) {
			trackBuyTokenImpression(data.token_id)
		}
	}, [show])

	const onBuyToken = async () => {
		if (!near.currentUser) {
			setShowLogin(true)
			return
		}

		trackBuyToken(data.token_id)

		try {
			const params = {
				token_id: data.token_id,
				nft_contract_id: data.contract_id,
				ft_token_id: data.ft_token_id,
				price: data.price,
			}

			await near.wallet.account().functionCall({
				contractId: process.env.MARKETPLACE_CONTRACT_ID,
				methodName: `buy`,
				args: params,
				gas: GAS_FEE_150,
				attachedDeposit: data.price,
			})
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-sm w-full p-4 bg-gray-800 m-4 md:m-auto rounded-md">
					<div>
						<h1 className="text-2xl font-bold text-white tracking-tight">
							{localeLn('Confirm Buy')}
						</h1>
						<p className="text-white mt-2">
							{localeLn('You are about to purchase')} <b>{data.metadata.title}</b>
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
							</div>
						</div>
						<p className="text-white mt-4 text-sm text-center opacity-90">
							{localeLn('You will be redirected to NEAR Web Wallet to confirm your transaction.')}
						</p>
						<div className="mt-6">
							<Button size="md" isFullWidth onClick={onBuyToken}>
								{data.price !== '0' ? localeLn('Buy') : localeLn('Get for Free')}
							</Button>
							<Button variant="ghost" size="md" isFullWidth className="mt-4" onClick={onClose}>
								{localeLn('Cancel')}
							</Button>
						</div>
					</div>
				</div>
			</Modal>
			<LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
		</>
	)
}

export default TokenBuyModal
