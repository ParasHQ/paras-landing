import { useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import LoginModal from './LoginModal'
import { InputText } from 'components/Common/form'
import { GAS_FEE } from 'config/constants'
import { IconX } from 'components/Icons'
import getConfig from 'config/near'
import Axios from 'axios'
import { useToast } from 'hooks/useToast'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import { trackTransferToken } from 'lib/ga'
import useStore from 'lib/store'
import WalletHelper from 'lib/WalletHelper'

const TokenTransferModal = ({ show, onClose, data }) => {
	const [showLogin, setShowLogin] = useState(false)
	const [receiverId, setReceiverId] = useState('')
	const [isTransferring, setIsTransferring] = useState(false)
	const { currentUser } = useStore()
	const toast = useToast()
	const { localeLn } = useIntl()

	const onTransfer = async () => {
		if (!currentUser) {
			setShowLogin(true)
			return
		}
		setIsTransferring(true)
		const params = {
			token_id: data.token_id,
			receiver_id: receiverId,
		}

		try {
			if (receiverId === currentUser) {
				throw new Error(`Cannot transfer to self`)
			}
			const nearConfig = getConfig(process.env.APP_ENV || 'development')
			const resp = await Axios.post(nearConfig.nodeUrl, {
				jsonrpc: '2.0',
				id: 'dontcare',
				method: 'query',
				params: {
					request_type: 'view_account',
					finality: 'final',
					account_id: receiverId,
				},
			})
			if (resp.data.error) {
				throw new Error(`Account ${receiverId} not exist`)
			}
		} catch (err) {
			sentryCaptureException(err)
			const message = err.message || 'Something went wrong, try again later'
			toast.show({
				text: <div className="font-semibold text-center text-sm">{message}</div>,
				type: 'error',
				duration: 2500,
			})
			setIsTransferring(false)
			return
		}

		trackTransferToken(data.token_id)

		try {
			const res = await WalletHelper.callFunction({
				contractId: data.contract_id,
				methodName: `nft_transfer`,
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
				onClose()
				setReceiverId('')
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							{`Successfully transferred to ${receiverId}`}
						</div>
					),
					type: 'success',
					duration: 2500,
				})
			}
			setIsTransferring(false)
		} catch (err) {
			sentryCaptureException(err)
			setIsTransferring(false)
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
							{localeLn('Confirm Transfer')}
						</h1>
						<p className="text-white mt-2">
							{localeLn('AreAboutToSend')} <b>{data.metadata.title}</b> {localeLn('To')}:
						</p>
						<div className="mt-4">
							<div className="mt-2 text-sm text-red-500"></div>
						</div>
						<div
							className={`flex justify-between rounded-md border-transparent w-full relative ${
								null // errors.amount && 'error'
							}`}
						>
							<InputText
								type="text"
								name=""
								step="any"
								value={receiverId}
								onChange={(e) => setReceiverId(e.target.value)}
								placeholder="Account ID (abc.near)"
							/>
						</div>
						<p className="text-white mt-4 text-sm text-center opacity-90 px-4">
							{localeLn('RedirectedToconfirm')}
						</p>
						<div className="mt-6">
							<Button
								size="md"
								isFullWidth
								onClick={onTransfer}
								isDisabled={isTransferring}
								isLoading={isTransferring}
							>
								{localeLn('Transfer')}
							</Button>
						</div>
					</div>
				</div>
			</Modal>
			<LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
		</>
	)
}

export default TokenTransferModal
