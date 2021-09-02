import { useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import near from 'lib/near'
import useStore from 'lib/store'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import LoginModal from './LoginModal'
import JSBI from 'jsbi'

const TokenBuyModal = ({
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
	console.log(data)
	const [showLogin, setShowLogin] = useState(false)
	const buyChapter = useStore((state) => state.buyChapter)

	const onBuyToken = async () => {
		if (!near.currentUser) {
			setShowLogin(true)
			return
		}

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
			const params = {
				token_id: data.token_id,
				nft_contract_id: data.contract_id,
				ft_token_id: data.ft_token_id,
				price: data.price,
			}

			await near.wallet.account().functionCall({
				contractId: process.env.MARKETPLACE_CONTRACT_ID,
				methodName: `buy`,
				args: params,
				gas: `300000000000000`,
				attachedDeposit: data.price,
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
							</div>
						</div>
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

export default TokenBuyModal
