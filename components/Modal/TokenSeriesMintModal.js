import { useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import near from 'lib/near'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import LoginModal from './LoginModal'
import { InputText } from 'components/Common/form'
import { GAS_FEE, STORAGE_MINT_FEE } from 'config/constants'
import { IconX } from 'components/Icons'
import { sentryCaptureException } from 'lib/sentry'

const TokenSeriesTransferModal = ({
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
	const [isSelfMint, setIsSelfMint] = useState(true)
	const [receiverId, setReceiverId] = useState('')

	const onTransfer = async () => {
		if (!near.currentUser) {
			setShowLogin(true)
			return
		}
		const params = {
			token_series_id: data.token_series_id,
			receiver_id: isSelfMint ? near.currentUser.accountId : receiverId,
		}

		try {
			await near.wallet.account().functionCall({
				contractId: data.contract_id,
				methodName: `nft_mint`,
				args: params,
				gas: GAS_FEE,
				attachedDeposit: STORAGE_MINT_FEE,
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
							Confirm Mint
						</h1>
						<p className="text-white mt-2">
							You are about to mint <b>{data.metadata.title}</b>
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
									Mint to myself
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
									<div className="text-sm">Storage Fee</div>
									<div className="text">
										{formatNearAmount(STORAGE_MINT_FEE)} Ⓝ
									</div>
								</div>
							</div>
						</div>
						<p className="text-white mt-4 text-sm text-center opacity-90">
							You will be redirected to NEAR Web Wallet to confirm your
							transaction.
						</p>
						<div className="mt-6">
							<Button size="md" isFullWidth onClick={onTransfer}>
								Mint
							</Button>
						</div>
					</div>
				</div>
			</Modal>
			<LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
		</>
	)
}

export default TokenSeriesTransferModal
