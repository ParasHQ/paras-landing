import { useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import LoginModal from './LoginModal'
import { GAS_FEE } from 'config/constants'
import { InputText } from 'components/Common/form'
import { IconX } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import { trackBurnTokenSeries } from 'lib/ga'
import WalletHelper from 'lib/WalletHelper'
import useStore from 'lib/store'
import { useToast } from 'hooks/useToast'
import { mutate } from 'swr'

const TokenSeriesBurnModal = ({ show, onClose, data }) => {
	const [showLogin, setShowLogin] = useState(false)
	const [burnCopies, setBurnCopies] = useState('')
	const [isBurning, setIsBurning] = useState(false)
	const { localeLn } = useIntl()
	const { currentUser } = useStore()
	const toast = useToast()

	const onBurnToken = async () => {
		if (!currentUser) {
			setShowLogin(true)
			return
		}
		setIsBurning(true)
		trackBurnTokenSeries(data.token_series_id)
		try {
			const params = {
				token_series_id: data.token_series_id,
				decrease_copies: burnCopies,
			}
			const res = await WalletHelper.callFunction({
				contractId: data.contract_id,
				methodName: `nft_decrease_series_copies`,
				args: params,
				gas: GAS_FEE,
				deposit: `1`,
			})
			if (res?.response.error) {
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							{res?.response.error.kind.ExecutionError}
						</div>
					),
					type: 'error',
					duration: 2500,
				})
				return
			} else if (res) {
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							{`Successfully decrease copies to ${
								parseInt(data.metadata.copies || 0) -
								parseInt(data.total_mint || 0) -
								parseInt(burnCopies || 0)
							}`}
						</div>
					),
					type: 'success',
					duration: 2500,
				})
				setTimeout(() => {
					mutate(`${data.contract_id}::${data.token_series_id}`)
					onClose()
				}, 2500)
			}
			setIsBurning(false)
		} catch (err) {
			sentryCaptureException(err)
			setIsBurning(false)
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
							{localeLn('BurnAsset')}
						</h1>
						<p className="text-white mt-2">
							{localeLn('AreAboutToReduce')} {data.metadata.title}
						</p>
						<div className="mt-4">
							<InputText
								type="text"
								name="decrease-copies"
								step="any"
								value={burnCopies}
								onChange={(e) => setBurnCopies(e.target.value.replace(/\D/, ''))}
								placeholder={localeLn('DecreaseCopiesBy')}
							/>
							{burnCopies > data.metadata.copies - (data.total_mint || 0) && (
								<div className="mt-2 text-sm text-red-500">
									<p>{localeLn('CannotReduceMore')}</p>
								</div>
							)}
						</div>
						<div className="mt-4 text-center">
							<div className="text-white my-1">
								<div className="flex justify-between">
									<div className="text-sm">{localeLn('AvailableCopies')}</div>
									<div className="text">
										{parseInt(data.metadata.copies || 0) - parseInt(data.total_mint || 0)}
									</div>
								</div>
							</div>
							<div className="text-white my-1">
								<div className="flex justify-between">
									<div className="text-sm">{localeLn('DecreaseCopies')}</div>
									<div className="text">{parseInt(burnCopies || 0)}</div>
								</div>
							</div>
							<hr />
							<div className="text-white my-1">
								<div className="flex justify-between">
									<div className="text-sm">{localeLn('Total')}</div>
									<div className="text">
										{parseInt(data.metadata.copies || 0) -
											parseInt(data.total_mint || 0) -
											parseInt(burnCopies || 0)}
									</div>
								</div>
							</div>
						</div>
						<p className="text-white mt-4 text-sm text-center opacity-90 px-4">
							{localeLn('RedirectedToconfirm')}
						</p>
						<div className="mt-6">
							<Button
								size="md"
								isFullWidth
								onClick={onBurnToken}
								isDisabled={
									!burnCopies ||
									burnCopies === '0' ||
									burnCopies > data.metadata.copies - (data.total_mint || 0) ||
									isBurning
								}
								isLoading={isBurning}
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
