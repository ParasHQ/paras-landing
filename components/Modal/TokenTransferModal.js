import { useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import near from 'lib/near'
import LoginModal from './LoginModal'
import { InputText } from 'components/Common/form'
import { GAS_FEE } from 'config/constants'
import { IconX } from 'components/Icons'
import getConfig from 'config/near'
import Axios from 'axios'
import { useToast } from 'hooks/useToast'
import { useIntl } from "../../hooks/useIntl"
import { sentryCaptureException } from 'lib/sentry'

const TokenTransferModal = ({
	show,
	onClose,
	data = {
		token_type: 'paradigm-1',
		comic_id: 'paradigm',
		chapter_id: 1,
		metadata: {
			title: 'Paradigm Ch.1 : The Metaverse',
			description:
				"While waiting for the hackathon's final stage, Abee got transferred into an unknown world",
			media: 'bafybeih4vvtevzfxtwsq2oadkvg6rtpspih4pyqqegtocwklcmnhe7p5mi',
			media_hash: null,
			copies: null,
			issued_at: '2021-08-21T16:33:28.475Z',
			expires_at: null,
			starts_at: null,
			updated_at: null,
			extra: null,
			reference: 'bafybeiaqaxyw2x6yx6vnbntg3dpdqzv2hpq2byffcrbit7dygcksauv3ta',
			reference_hash: null,
			blurhash: 'UCQ0XJ~qxu~q00IUayM{00M{M{M{00ayofWB',
			author_ids: ['afiq.testnet'],
			page_count: 12,
			collection: 'Paradigm',
			subtitle: 'The Metaverse',
		},
		price: '0',
	},
}) => {
	const [showLogin, setShowLogin] = useState(false)
	const [receiverId, setReceiverId] = useState('')
	const toast = useToast()
	const { localeLn } = useIntl()
	const onTransfer = async () => {
		if (!near.currentUser) {
			setShowLogin(true)
			return
		}
		const params = {
			token_id: data.token_id,
			receiver_id: receiverId,
		}

		try {
			if (receiverId === near.currentUser.accountId) {
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
				text: (
					<div className="font-semibold text-center text-sm">{message}</div>
				),
				type: 'error',
				duration: 2500,
			})
			return
		}

		try {
			await near.wallet.account().functionCall({
				contractId: data.contract_id,
				methodName: `nft_transfer`,
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
			<Modal
				isShow={show}
				closeOnBgClick={false}
				closeOnEscape={false}
				close={onClose}
			>
				<div className="max-w-sm w-full p-4 bg-gray-800 m-auto rounded-md relative">
					<div className="absolute right-0 top-0 pr-4 pt-4">
						<div className="cursor-pointer" onClick={onClose}>
							<IconX />
						</div>
					</div>
					<div>
						<h1 className="text-2xl font-bold text-white tracking-tight">
							{localeLn("Confirm Transfer")}
						</h1>
						<p className="text-white mt-2">
							{localeLn("You are about to send")} <b>{data.metadata.title}</b> {localeLn("to")}:
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
						<p className="text-white mt-4 text-sm text-center opacity-90">
							{localeLn("You will be redirected to NEAR Web Wallet to confirm your transaction.")}
						</p>
						<div className="mt-6">
							<Button size="md" isFullWidth onClick={onTransfer}>
								{localeLn("Transfer")}
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
