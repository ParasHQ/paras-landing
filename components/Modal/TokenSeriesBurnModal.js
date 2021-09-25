import { useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import near from 'lib/near'
import LoginModal from './LoginModal'
import { GAS_FEE } from 'config/constants'
import { InputText } from 'components/Common/form'
import { IconX } from 'components/Icons'
import { sentryCaptureException } from 'lib/sentry'

const TokenSeriesBurnModal = ({
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
	const [burnCopies, setBurnCopies] = useState('')

	const onBurnToken = async () => {
		if (!near.currentUser) {
			setShowLogin(true)
			return
		}

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
							Burn Asset
						</h1>
						<p className="text-white mt-2">
							You are about to reduce the copies of {data.metadata.title}
						</p>
						<div className="mt-4">
							<InputText
								type="text"
								name="decrease-copies"
								step="any"
								value={burnCopies}
								onChange={(e) =>
									setBurnCopies(e.target.value.replace(/\D/, ''))
								}
								placeholder="Decrease copies by"
							/>
							{burnCopies > data.metadata.copies - data.in_circulation && (
								<div className="mt-2 text-sm text-red-500">
									<p>Cannot reduce more than current copies</p>
								</div>
							)}
						</div>
						<div className="mt-4 text-center">
							<div className="text-white my-1">
								<div className="flex justify-between">
									<div className="text-sm">Available Copies</div>
									<div className="text">
										{parseInt(data.metadata.copies || 0) -
											parseInt(data.in_circulation || 0)}
									</div>
								</div>
							</div>
							<div className="text-white my-1">
								<div className="flex justify-between">
									<div className="text-sm">Decrease Copies</div>
									<div className="text">{parseInt(burnCopies || 0)}</div>
								</div>
							</div>
							<hr />
							<div className="text-white my-1">
								<div className="flex justify-between">
									<div className="text-sm">Total</div>
									<div className="text">
										{parseInt(data.metadata.copies || 0) -
											parseInt(data.in_circulation || 0) -
											parseInt(burnCopies || 0)}
									</div>
								</div>
							</div>
						</div>
						<p className="text-white mt-4 text-sm text-center opacity-90">
							You will be redirected to NEAR Web Wallet to confirm your
							transaction.
						</p>
						<div className="mt-6">
							<Button
								size="md"
								isFullWidth
								onClick={onBurnToken}
								isDisabled={
									!burnCopies ||
									burnCopies > data.metadata.copies - data.in_circulation
								}
							>
								Reduce
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
