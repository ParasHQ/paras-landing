import { useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import LoginModal from './LoginModal'
import { InputText } from 'components/Common/form'
import { GAS_FEE, STORAGE_MINT_FEE } from 'config/constants'
import { IconX } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import { trackMintToken } from 'lib/ga'
import axios from 'axios'
import getConfig from 'config/near'
import { useToast } from 'hooks/useToast'
import WalletHelper from 'lib/WalletHelper'
import useStore from 'lib/store'

const TokenSeriesMintModal = ({ show, onClose, data }) => {
	const [showLogin, setShowLogin] = useState(false)
	const [isSelfMint, setIsSelfMint] = useState(true)
	const [receiverId, setReceiverId] = useState('')
	const [isMinting, setIsMinting] = useState(false)
	const { currentUser } = useStore()
	const { localeLn } = useIntl()
	const toast = useToast()

	const onTransfer = async () => {
		if (!currentUser) {
			setShowLogin(true)
			return
		}
		setIsMinting(true)
		const params = {
			token_series_id: data.token_series_id,
			receiver_id: isSelfMint ? currentUser : receiverId,
		}

		if (!isSelfMint) {
			try {
				const nearConfig = getConfig(process.env.APP_ENV || 'development')
				const resp = await axios.post(nearConfig.nodeUrl, {
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
				setIsMinting(false)
				return
			}
		}

		trackMintToken(data.token_series_id)

		try {
			const res = await WalletHelper.callFunction({
				contractId: data.contract_id,
				methodName: `nft_mint`,
				args: params,
				gas: GAS_FEE,
				deposit: STORAGE_MINT_FEE,
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
							{`Successfully minted to ${isSelfMint ? currentUser : receiverId}`}
						</div>
					),
					type: 'success',
					duration: 2500,
				})
			}
			setIsMinting(false)
		} catch (err) {
			sentryCaptureException(err)
			setIsMinting(false)
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
							{localeLn('ConfirmMint')}
						</h1>
						<p className="text-white mt-2">
							{localeLn('AreAboutToMint')} <b>{data.metadata.title}</b>
						</p>
						<div className="mt-4">
							<div className="mt-2 text-sm text-red-500"></div>
						</div>
						<div>
							<div className="flex items-center">
								<div className="pr-2">
									<input
										id="self-mint"
										className="w-auto"
										type="checkbox"
										defaultChecked={isSelfMint}
										onChange={() => {
											setIsSelfMint(!isSelfMint)
										}}
									/>
								</div>
								<label htmlFor="self-mint" className="text-white">
									{localeLn('MintToMyself')}
								</label>
							</div>
						</div>
						{!isSelfMint && (
							<div className="mt-4">
								<InputText
									type="text"
									name=""
									step="any"
									value={receiverId}
									onChange={(e) => setReceiverId(e.target.value)}
									placeholder="Account ID (abc.near)"
								/>
							</div>
						)}
						<div className="mt-4 text-center">
							<div className="text-white my-1">
								<div className="flex justify-between">
									<div className="text-sm">{localeLn('StorageFee')}</div>
									<div className="text">{formatNearAmount(STORAGE_MINT_FEE)} Ⓝ</div>
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
								onClick={onTransfer}
								isDisabled={isMinting}
								isLoading={isMinting}
							>
								{localeLn('Mint')}
							</Button>
						</div>
					</div>
				</div>
			</Modal>
			<LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
		</>
	)
}

export default TokenSeriesMintModal
