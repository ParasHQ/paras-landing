import { useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import near from 'lib/near'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import LoginModal from './LoginModal'
import { GAS_FEE, STORAGE_ADD_MARKET_FEE } from 'config/constants'
import { IconX } from 'components/Icons'
import { useIntl } from '../../hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'

const TokenStorageModal = ({ show, onClose }) => {
	const [showLogin, setShowLogin] = useState(false)
	const { localeLn } = useIntl()
	const onBuyToken = async () => {
		if (!near.currentUser) {
			setShowLogin(true)
			return
		}
		const params = {
			receiver_id: near.currentUser.accountId,
		}

		try {
			await near.wallet.account().functionCall({
				contractId: process.env.MARKETPLACE_CONTRACT_ID,
				methodName: `storage_deposit`,
				args: params,
				gas: GAS_FEE,
				attachedDeposit: STORAGE_ADD_MARKET_FEE,
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
							{localeLn('Deposit Storage')}
						</h1>
						<p className="text-white mt-2">
							{localeLn(
								'Before you can list this asset to market, you need to deposit small amount of NEAR'
							)}
						</p>
						<div className="mt-4">
							<div className="mt-2 text-sm text-red-500"></div>
						</div>
						<div className="mt-4 text-center">
							<div className="text-white my-1">
								<div className="flex justify-between">
									<div className="text-sm">{localeLn('Storage Fee')}</div>
									<div className="text">{formatNearAmount(STORAGE_ADD_MARKET_FEE)} Ⓝ</div>
								</div>
							</div>
						</div>
						<p className="text-white mt-4 text-sm text-center opacity-90">
							{localeLn('You will be redirected to NEAR Web Wallet to confirm your transaction.')}
						</p>
						<div className="mt-6">
							<Button size="md" isFullWidth onClick={onBuyToken}>
								{localeLn('Deposit')}
							</Button>
						</div>
					</div>
				</div>
			</Modal>
			<LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
		</>
	)
}

export default TokenStorageModal
