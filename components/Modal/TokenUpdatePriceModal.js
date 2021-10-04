import { useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import near from 'lib/near'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import JSBI from 'jsbi'
import { InputText } from 'components/Common/form'
import { GAS_FEE, STORAGE_APPROVE_FEE } from 'config/constants'
import { IconX } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import { trackRemoveListingToken, trackUpdateListingToken } from 'lib/ga'

const TokenUpdatePriceModal = ({ show, onClose, data }) => {
	const [newPrice, setNewPrice] = useState(data.price ? formatNearAmount(data.price) : '0')
	const { localeLn } = useIntl()
	const onUpdateListing = async (e) => {
		e.preventDefault()
		if (!near.currentUser) {
			return
		}

		trackUpdateListingToken(data.token_id)

		try {
			const params = {
				token_id: data.token_id,
				account_id: process.env.MARKETPLACE_CONTRACT_ID,
				msg: JSON.stringify({
					price: parseNearAmount(newPrice),
					ft_token_id: `near`,
				}),
			}
			await near.wallet.account().functionCall({
				contractId: data.contract_id,
				methodName: `nft_approve`,
				args: params,
				gas: GAS_FEE,
				attachedDeposit: data.approval_id ? `1` : STORAGE_APPROVE_FEE,
			})
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const onRemoveListing = async (e) => {
		e.preventDefault()
		if (!near.currentUser) {
			return
		}

		trackRemoveListingToken(data.token_id)

		try {
			const params = {
				token_id: data.token_id,
				nft_contract_id: data.contract_id,
			}
			await near.wallet.account().functionCall({
				contractId: process.env.MARKETPLACE_CONTRACT_ID,
				methodName: `delete_market_data`,
				args: params,
				gas: GAS_FEE,
				attachedDeposit: `1`,
			})
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const calculatePriceDistribution = () => {
		if (newPrice && JSBI.greaterThan(JSBI.BigInt(parseNearAmount(newPrice)), JSBI.BigInt(0))) {
			let fee = JSBI.BigInt(500)

			const calcRoyalty =
				Object.keys(data.royalty).length > 0
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

			const calcReceive = JSBI.subtract(JSBI.BigInt(parseNearAmount(newPrice)), cut)

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
		<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
			<div className="max-w-sm w-full p-4 bg-gray-800 m-auto rounded-md relative">
				<div className="absolute right-0 top-0 pr-4 pt-4">
					<div className="cursor-pointer" onClick={onClose}>
						<IconX />
					</div>
				</div>
				<div>
					<h1 className="text-2xl font-bold text-white tracking-tight">
						{localeLn('Card Listing')}
					</h1>
					<form>
						<div className="mt-4">
							<label className="block text-sm text-white mb-2">
								{localeLn('New Price')}{' '}
								{data.price && `(${localeLn('Current price')}: ${formatNearAmount(data.price)} Ⓝ)`}
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
									placeholder="Card price per pcs"
								/>
								<div className="absolute inset-y-0 right-3 flex items-center text-white">Ⓝ</div>
							</div>
							<div className="mt-2 text-gray-200 flex items-center justify-between">
								<span>{localeLn('Receive')}:</span>
								<span>{calculatePriceDistribution().receive} Ⓝ</span>
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
							</div>
							<div className="text-gray-200 flex items-center justify-between">
								<span>{localeLn('Royalty')}:</span>
								<span>{calculatePriceDistribution().royalty} Ⓝ</span>
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
							</div>
							<div className="text-gray-200 flex items-center justify-between">
								<span>{localeLn('Fee')}:</span>
								<span> {calculatePriceDistribution().fee} Ⓝ</span>
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
							</div>
							<div className="mt-2 text-sm text-red-500">
								{/* {errors.amount?.type === 'required' && `Sale price is required`}
                {errors.amount?.type === 'min' && `Minimum 0`} */}
							</div>
							{!data.approval_id && (
								<div>
									<div className="mt-4 text-center">
										<div className="text-white my-1">
											<div className="flex justify-between">
												<div className="text-sm">{localeLn('Storage Fee')}</div>
												<div className="text">{formatNearAmount(STORAGE_APPROVE_FEE)} Ⓝ</div>
											</div>
										</div>
									</div>
								</div>
							)}

							<p className="text-white mt-4 text-sm text-center opacity-90">
								{localeLn('You will be redirected to NEAR Web Wallet to confirm your transaction.')}
							</p>
						</div>
						<div className="mt-6">
							<Button type="submit" size="md" isFullWidth onClick={onUpdateListing}>
								{localeLn('Update Listing')}
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
								{localeLn('Remove Listing')}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</Modal>
	)
}

export default TokenUpdatePriceModal
