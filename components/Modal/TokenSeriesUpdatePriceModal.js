import { useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import near from 'lib/near'
import useStore from 'lib/store'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import LoginModal from './LoginModal'
import JSBI from 'jsbi'
import { InputText } from 'components/Common/form'
import { GAS_FEE } from 'config/constants'
import { IconX } from 'components/Icons'

const TokenSeriesUpdatePriceModal = ({
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
	const [newPrice, setNewPrice] = useState(0)

	const onUpdateListing = async (e) => {
		e.preventDefault()
		if (!near.currentUser) {
			setShowLogin(true)
			return
		}
		const params = {
			token_series_id: data.token_series_id,
			price: parseNearAmount(newPrice),
		}

		try {
			await near.wallet.account().functionCall({
				contractId: data.contract_id,
				methodName: `nft_set_series_price`,
				args: params,
				gas: GAS_FEE,
				attachedDeposit: `1`,
			})
		} catch (err) {
			console.log(err)
		}
	}

	const onRemoveListing = async (e) => {
		e.preventDefault()
		if (!near.currentUser) {
			setShowLogin(true)
			return
		}

		try {
			const params = {
				token_series_id: data.token_series_id,
			}
			await near.wallet.account().functionCall({
				contractId: data.contract_id,
				methodName: `nft_set_series_price`,
				args: params,
				gas: GAS_FEE,
				attachedDeposit: `1`,
			})
		} catch (err) {
			console.log(err)
		}
	}

	const calculatePriceDistribution = () => {
		if (
			newPrice &&
			JSBI.greaterThan(JSBI.BigInt(parseNearAmount(newPrice)), JSBI.BigInt(0))
		) {
			let fee = JSBI.BigInt(500)

			const calcRoyalty =
				Object.values(data.royalty).length > 0
					? JSBI.divide(
							JSBI.multiply(
								JSBI.BigInt(parseNearAmount(newPrice)),
								JSBI.BigInt(Object.values(data.royalty)[0])
							),
							JSBI.BigInt(10000)
					  )
					: JSBI.BigInt(0)

			const calcFee = JSBI.divide(
				JSBI.multiply(JSBI.BigInt(parseNearAmount(newPrice)), fee),
				JSBI.BigInt(10000)
			)

			const cut = JSBI.add(calcRoyalty, calcFee)

			const calcReceive = JSBI.subtract(
				JSBI.BigInt(parseNearAmount(newPrice)),
				cut
			)

			return {
				receive: formatNearAmount(calcReceive.toString()),
				royalty: formatNearAmount(calcRoyalty.toString()),
				fee: formatNearAmount(calcFee.toString()),
			}
		}
		return {
			receive: 0,
			royalty: 0,
			fee: 0,
		}
	}

	return (
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
						Series Listing
					</h1>
					<form onSubmit={onUpdateListing}>
						<div className="mt-4">
							<label className="block text-sm text-white mb-2">
								New Price{' '}
								{data.price &&
									`(Current price: ${formatNearAmount(data.price)})`}
							</label>
							<div
								className={`flex justify-between rounded-md border-transparent w-full relative ${
									null // errors.amount && 'error'
								}`}
							>
								<InputText
									type="number"
									name="new-price"
									step="any"
									value={newPrice}
									onChange={(e) => setNewPrice(e.target.value)}
									// ref={register({
									//   required: true,
									//   min: 0,
									// })}
									// className="clear pr-2"
									placeholder="Card price per pcs"
								/>
								<div className="absolute inset-y-0 right-3 flex items-center text-white">
									Ⓝ
								</div>
							</div>
							<p className="text-sm mt-2 text-gray-200">
								Receive: {calculatePriceDistribution().receive}
								{/* {prettyBalance(
                  Number(
                    watch('amount', 0) *
                      (0.95 - (localToken.metadata.royalty || 0) / 100)
                  )
                    .toPrecision(4)
                    .toString(),
                  0,
                  4
                )}{' '} */}
								Ⓝ (~$ 20
								{/* {prettyBalance(
                  Number(
                    store.nearUsdPrice *
                      watch('amount', 0) *
                      (0.95 - (localToken.metadata.royalty || 0) / 100)
                  )
                    .toPrecision(4)
                    .toString(),
                  0,
                  4
                )} */}
								)
							</p>
							<p className="text-sm text-gray-200">
								Royalty: {calculatePriceDistribution().royalty}
								{/* {prettyBalance(
                  Number(
                    watch('amount', 0) *
                      ((localToken.metadata.royalty || 0) / 100)
                  )
                    .toPrecision(4)
                    .toString(),
                  0,
                  4
                )}{' '}
                Ⓝ (~$
                {prettyBalance(
                  Number(
                    store.nearUsdPrice *
                      watch('amount', 0) *
                      ((localToken.metadata.royalty || 0) / 100)
                  )
                    .toPrecision(4)
                    .toString(),
                  0,
                  4
                )}
                ) */}
							</p>
							<p className="text-sm text-gray-200">
								Fee: {calculatePriceDistribution().fee}
								{/* {prettyBalance(
                  Number(watch('amount', 0) * 0.05)
                    .toPrecision(4)
                    .toString(),
                  0,
                  4
                )}{' '}
                Ⓝ (~$
                {prettyBalance(
                  Number(store.nearUsdPrice * watch('amount', 0) * 0.05)
                    .toPrecision(4)
                    .toString(),
                  0,
                  4
                )} */}
							</p>
							<div className="mt-2 text-sm text-red-500">
								{/* {errors.amount?.type === 'required' && `Sale price is required`}
                {errors.amount?.type === 'min' && `Minimum 0`} */}
							</div>
						</div>
						<div className="mt-6">
							<Button type="submit" size="md" isFullWidth>
								Update Listing
							</Button>
							<Button
								className="mt-4"
								type="submit"
								variant="ghost"
								size="md"
								isFullWidth
								onClick={onRemoveListing}
								isDisabled={!data.price}
							>
								Remove Listing
							</Button>
						</div>
					</form>
				</div>
			</div>
		</Modal>
	)
}

export default TokenSeriesUpdatePriceModal
