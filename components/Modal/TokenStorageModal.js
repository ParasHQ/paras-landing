import { useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import LoginModal from './LoginModal'
import { GAS_FEE, STORAGE_ADD_MARKET_FEE } from 'config/constants'
import { IconX } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import { trackStorageDeposit } from 'lib/ga'
import useStore from 'lib/store'
import WalletHelper from 'lib/WalletHelper'

const TokenStorageModal = ({ show, onClose }) => {
	const [showLogin, setShowLogin] = useState(false)
	const { currentUser } = useStore()
	const { localeLn } = useIntl()

	const onBuyToken = async () => {
		if (currentUser) {
			setShowLogin(true)
			return
		}

		trackStorageDeposit()

		try {
			await WalletHelper.callFunction({
				contractId: process.env.MARKETPLACE_CONTRACT_ID,
				methodName: `storage_deposit`,
				args: { receiver_id: currentUser },
				gas: GAS_FEE,
				deposit: STORAGE_ADD_MARKET_FEE,
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
							{localeLn('DepositStorage')}
						</h1>
						<p className="text-white mt-2">{localeLn('ToDepositSmallAmount')}</p>
						<div className="mt-4">
							<div className="mt-2 text-sm text-red-500"></div>
						</div>
						<div className="mt-4 text-center">
							<div className="text-white my-1">
								<div className="flex justify-between">
									<div className="text-sm">{localeLn('StorageFee')}</div>
									<div className="text">{formatNearAmount(STORAGE_ADD_MARKET_FEE)} Ⓝ</div>
								</div>
							</div>
						</div>
						<p className="text-white mt-4 text-sm text-center opacity-90 px-4">
							{localeLn('RedirectedToconfirm')}
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
