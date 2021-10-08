import { useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import near from 'lib/near'
import LoginModal from './LoginModal'
import { GAS_FEE } from 'config/constants'
import { sentryCaptureException } from 'lib/sentry'
import { useIntl } from 'hooks/useIntl'
import { trackBurnToken } from 'lib/ga'

const TokenBurnModal = ({ show, onClose, data }) => {
	const [showLogin, setShowLogin] = useState(false)
	const { localeLn } = useIntl()
	const onBurnToken = async () => {
		if (!near.currentUser) {
			setShowLogin(true)
			return
		}

		trackBurnToken(data.token_id)
		try {
			const params = {
				token_id: data.token_id,
			}
			await near.wallet.account().functionCall({
				contractId: data.contract_id,
				methodName: `nft_burn`,
				args: params,
				gas: GAS_FEE,
				attachedDeposit: `1`,
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
							{localeLn('Burn_Asset')}
						</h1>
						<p className="text-white mt-2">
							{localeLn('Are_About_To_Burn')} {data.metadata.title}
						</p>
						<div className="mt-4">
							<div className="mt-2 text-sm text-red-500"></div>
						</div>
						<p className="text-white mt-4 text-sm text-center opacity-90">
							{localeLn('Redirected_To_confirm')}
						</p>
						<div className="mt-6">
							<Button size="md" isFullWidth onClick={onBurnToken}>
								{localeLn('Burn')}
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

export default TokenBurnModal
