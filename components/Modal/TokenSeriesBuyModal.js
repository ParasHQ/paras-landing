import { useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import near from 'lib/near'
import useStore from 'lib/store'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import LoginModal from './LoginModal'
import JSBI from 'jsbi'

const TokenSeriesBuyModal = ({
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

	const onBuyToken = async () => {
		console.log(near)
		if (!near.currentUser) {
			setShowLogin(true)
			return
		}
		const params = {
			token_series_id: data.token_series_id,
			receiver_id: near.currentUser.accountId,
		}

		const attachedDeposit = JSBI.add(
			JSBI.BigInt(data.price),
			JSBI.BigInt(parseNearAmount('0.01832'))
		)

		// if (
		// 	JSBI.lessThan(
		// 		JSBI.BigInt(near.currentUser.balance.available),
		// 		attachedDeposit
		// 	)
		// ) {
		// 	get().setToastConfig({
		// 		text: (
		// 			<div className="font-semibold text-center text-sm">
		// 				Insufficient Balance
		// 				<p className="mt-2">
		// 					Available
		// 					{prettyBalance(near.getAccount().balance.available, 24, 4)} Ⓝ
		// 				</p>
		// 			</div>
		// 		),
		// 		type: 'error',
		// 		duration: 2500,
		// 	})
		// 	return
		// }

		// nft_buy(
		//   params,
		//   '50000000000000',
		//   attachedDeposit.toString()
		// )
		try {
			await near.wallet.account().functionCall({
				contractId: data.contract_id,
				methodName: `nft_buy`,
				args: params,
				gas: `300000000000000`,
				attachedDeposit: attachedDeposit.toString(),
			})
		} catch (err) {
			console.log(err)
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
				<div className="max-w-sm w-full p-4 bg-blueGray-800 m-4 md:m-auto rounded-md">
					<div>
						<h1 className="text-2xl font-bold text-white tracking-tight">
							Confirm Buy
						</h1>
						<p className="text-white mt-2">
							You are about to purchase <b>{data.metadata.title}</b>
						</p>
						<div className="mt-4">
							<div className="mt-2 text-sm text-red-500"></div>
						</div>
						<div className="mt-4 text-center">
							<div className="text-white my-1">
								<div className="flex justify-between">
									<div className="text-sm">Total</div>
									<div className="text">
										{data.price && `${formatNearAmount(data.price)} Ⓝ`}
									</div>
								</div>
								<div className="flex justify-between">
									<div className="text-sm">Storage Fee</div>
									<div className="text">0.01832 Ⓝ</div>
								</div>
							</div>
						</div>
						<p className="text-white mt-4 text-sm text-center opacity-90">
							*Small storage fee is applied
						</p>
						<p className="text-white mt-2 text-sm text-center opacity-90">
							You will be redirected to NEAR Web Wallet to confirm your
							transaction.
						</p>
						<div className="mt-6">
							<Button size="md" isFullWidth onClick={onBuyToken}>
								{data.price !== '0' ? 'Buy' : 'Get for Free'}
							</Button>
							<Button
								variant="ghost"
								size="md"
								isFullWidth
								className="mt-4"
								onClick={onClose}
							>
								Cancel
							</Button>
						</div>
					</div>
				</div>
			</Modal>
			<LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
		</>
	)
}

export default TokenSeriesBuyModal
