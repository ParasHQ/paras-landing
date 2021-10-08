import { useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import near from 'lib/near'
import LoginModal from './LoginModal'
import { GAS_FEE } from 'config/constants'
import { InputText } from 'components/Common/form'
import { IconX } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import { trackBurnTokenSeries } from 'lib/ga'

const TokenSeriesBurnModal = ({ show, onClose, data }) => {
	const [showLogin, setShowLogin] = useState(false)
	const [burnCopies, setBurnCopies] = useState('')
	const { localeLn } = useIntl()
	const onBurnToken = async () => {
		if (!near.currentUser) {
			setShowLogin(true)
			return
		}

		trackBurnTokenSeries(data.token_series_id)
		try {
			const params = {
				token_series_id: data.token_series_id,
				decrease_copies: burnCopies,
			}
			await near.wallet.account().functionCall({
				contractId: data.contract_id,
				methodName: `nft_decrease_series_copies`,
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
				<div className="max-w-sm w-full p-4 bg-gray-800 m-auto rounded-md relative">
					<div className="absolute right-0 top-0 pr-4 pt-4">
						<div className="cursor-pointer" onClick={onClose}>
							<IconX />
						</div>
					</div>
					<div>
						<h1 className="text-2xl font-bold text-white tracking-tight">
							{localeLn('Burn_Asset')}
						</h1>
						<p className="text-white mt-2">
							{localeLn('Are_About_To_Reduce')} {data.metadata.title}
						</p>
						<div className="mt-4">
							<InputText
								type="text"
								name="decrease-copies"
								step="any"
								value={burnCopies}
								onChange={(e) => setBurnCopies(e.target.value.replace(/\D/, ''))}
								placeholder={localeLn('Decrease_Copies_By')}
							/>
							{burnCopies > data.metadata.copies - data.in_circulation && (
								<div className="mt-2 text-sm text-red-500">
									<p>{localeLn('Cannot_Reduce_More')}</p>
								</div>
							)}
						</div>
						<div className="mt-4 text-center">
							<div className="text-white my-1">
								<div className="flex justify-between">
									<div className="text-sm">{localeLn('Available_Copies')}</div>
									<div className="text">
										{parseInt(data.metadata.copies || 0) - parseInt(data.in_circulation || 0)}
									</div>
								</div>
							</div>
							<div className="text-white my-1">
								<div className="flex justify-between">
									<div className="text-sm">{localeLn('Decrease_Copies')}</div>
									<div className="text">{parseInt(burnCopies || 0)}</div>
								</div>
							</div>
							<hr />
							<div className="text-white my-1">
								<div className="flex justify-between">
									<div className="text-sm">{localeLn('Total')}</div>
									<div className="text">
										{parseInt(data.metadata.copies || 0) -
											parseInt(data.in_circulation || 0) -
											parseInt(burnCopies || 0)}
									</div>
								</div>
							</div>
						</div>
						<p className="text-white mt-4 text-sm text-center opacity-90">
							{localeLn('Redirected_To_confirm')}
						</p>
						<div className="mt-6">
							<Button
								size="md"
								isFullWidth
								onClick={onBurnToken}
								isDisabled={!burnCopies || burnCopies > data.metadata.copies - data.in_circulation}
							>
								{localeLn('Reduce')}
							</Button>
						</div>
					</div>
				</div>
			</Modal>
			<LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
		</>
	)
}

export default TokenSeriesBurnModal
