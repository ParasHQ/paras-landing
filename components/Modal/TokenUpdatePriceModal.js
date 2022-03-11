import { useEffect, useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import near from 'lib/near'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import JSBI from 'jsbi'
import { InputText } from 'components/Common/form'
import { GAS_FEE, STORAGE_ADD_MARKET_FEE, STORAGE_APPROVE_FEE } from 'config/constants'
import { IconInfo, IconX } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import { trackRemoveListingToken, trackUpdateListingToken } from 'lib/ga'
import { useForm } from 'react-hook-form'
import useStore from 'lib/store'
import Tooltip from 'components/Common/Tooltip'
import { parseDate } from 'utils/common'

const TokenUpdatePriceModal = ({ show, onClose, data }) => {
	const [newPrice, setNewPrice] = useState(data.price ? formatNearAmount(data.price) : '')
	const [needDeposit, setNeedDeposit] = useState(true)
	const [txFee, setTxFee] = useState(null)
	const { register, handleSubmit, errors } = useForm()
	const currentUser = useStore((state) => state.currentUser)
	const { localeLn } = useIntl()

	const showTooltipTxFee = (txFee?.next_fee || 0) > (txFee?.current_fee || 0)
	const tooltipTxFeeText = localeLn('DynamicTxFee', {
		date: parseDate((txFee?.start_time || 0) * 1000),
		fee: (txFee?.current_fee || 0) / 100,
	})

	useEffect(() => {
		const getTxFee = async () => {
			const txFeeContract = await near.wallet
				.account()
				.viewFunction(process.env.MARKETPLACE_CONTRACT_ID, `get_transaction_fee`)
			setTxFee(txFeeContract)
		}

		if (show) {
			getTxFee()
		}
	}, [show])

	useEffect(() => {
		if (currentUser) {
			setTimeout(() => {
				checkStorageBalance()
			}, 250)
		}
	}, [currentUser])

	const checkStorageBalance = async () => {
		try {
			if (!data.approval_id) {
				const currentStorage = await near.wallet
					.account()
					.viewFunction(process.env.MARKETPLACE_CONTRACT_ID, `storage_balance_of`, {
						account_id: currentUser,
					})

				const supplyPerOwner = await near.wallet
					.account()
					.viewFunction(process.env.MARKETPLACE_CONTRACT_ID, `get_supply_by_owner_id`, {
						account_id: currentUser,
					})

				const usedStorage = JSBI.multiply(
					JSBI.BigInt(parseInt(supplyPerOwner) + 1),
					JSBI.BigInt(STORAGE_ADD_MARKET_FEE)
				)

				if (JSBI.greaterThanOrEqual(JSBI.BigInt(currentStorage), usedStorage)) {
					setNeedDeposit(false)
				}
			} else {
				setNeedDeposit(false)
			}
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const onUpdateListing = async () => {
		if (!near.currentUser) {
			return
		}

		trackUpdateListingToken(data.token_id)

		try {
			const txs = []

			if (needDeposit) {
				txs.push({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					functionCalls: [
						{
							methodName: 'storage_deposit',
							contractId: process.env.MARKETPLACE_CONTRACT_ID,
							args: { receiver_id: near.currentUser.accountId },
							attachedDeposit: STORAGE_ADD_MARKET_FEE,
							gas: GAS_FEE,
						},
					],
				})
			}

			const params = {
				token_id: data.token_id,
				account_id: process.env.MARKETPLACE_CONTRACT_ID,
				msg: JSON.stringify({
					price: parseNearAmount(newPrice),
					market_type: 'sale',
					ft_token_id: `near`,
				}),
			}
			txs.push({
				receiverId: data.contract_id,
				functionCalls: [
					{
						methodName: 'nft_approve',
						contractId: data.contract_id,
						args: params,
						attachedDeposit: data.approval_id ? `1` : STORAGE_APPROVE_FEE,
						gas: GAS_FEE,
					},
				],
			})

			return await near.executeMultipleTransactions(txs)
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
			let fee
			if (txFee?.start_time && new Date() > new Date(txFee?.start_time * 1000)) {
				fee = JSBI.BigInt(txFee?.next_fee || 0)
			} else {
				fee = JSBI.BigInt(txFee?.current_fee || 0)
			}

			const calcRoyalty =
				Object.keys(data.royalty).length > 0
					? JSBI.divide(
							JSBI.multiply(
								JSBI.BigInt(parseNearAmount(newPrice)),
								JSBI.BigInt(
									Object.values(data.royalty).reduce((a, b) => {
										return parseInt(a) + parseInt(b)
									}, 0)
								)
							),
							JSBI.BigInt(10000)
					  )
					: JSBI.BigInt(0)

			if (calcRoyalty.toString() === parseNearAmount(newPrice)) {
				fee = JSBI.BigInt(0)
			}

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

	const getStorageFee = () => {
		if (needDeposit) {
			return (
				parseFloat(formatNearAmount(STORAGE_APPROVE_FEE)) +
				parseFloat(formatNearAmount(STORAGE_ADD_MARKET_FEE))
			)
		}
		return formatNearAmount(STORAGE_APPROVE_FEE)
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
						{localeLn('CardListing')}
					</h1>
					<form>
						<div className="mt-4">
							<label className="block text-sm text-white mb-2">
								{localeLn('NewPrice')}{' '}
								{data.price && `(${localeLn('CurrentPrice')}: ${formatNearAmount(data.price)} Ⓝ)`}
							</label>
							<div className="flex justify-between rounded-md border-transparent w-full relative">
								<InputText
									type="number"
									name="newPrice"
									step="any"
									value={newPrice}
									onChange={(e) => setNewPrice(e.target.value)}
									placeholder="Card price per pcs"
									className={errors.newPrice && 'error'}
									ref={register({
										min: 0,
										max: 999999999,
									})}
								/>
								<div className="absolute inset-y-0 right-3 flex items-center text-white">Ⓝ</div>
							</div>
							<div className="mt-2 text-sm text-red-500">
								{errors.newPrice?.type === 'min' && `Minimum 0`}
								{errors.newPrice?.type === 'max' && `Maximum 999,999,999 Ⓝ`}
							</div>
							<div
								className={`flex items-center justify-between ${
									showTooltipTxFee ? 'text-gray-300' : 'text-gray-200'
								}`}
							>
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
							<div
								className={`flex items-center justify-between ${
									showTooltipTxFee ? 'text-gray-300' : 'text-gray-200'
								}`}
							>
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
							<div
								className={`flex items-center justify-between ${
									showTooltipTxFee ? 'font-bold text-white' : 'text-gray-200'
								}`}
							>
								<Tooltip
									id="text-fee"
									show={showTooltipTxFee}
									text={tooltipTxFeeText}
									className="font-normal"
								>
									<span>
										{localeLn('Fee')}
										{showTooltipTxFee && <IconInfo size={10} color="#ffffff" />}:
									</span>
								</Tooltip>
								<Tooltip
									id="text-number"
									show={showTooltipTxFee}
									text={tooltipTxFeeText}
									className="font-normal"
									place="left"
								>
									<span> {calculatePriceDistribution().fee} Ⓝ</span>
								</Tooltip>
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
												<div className="text-sm">{localeLn('StorageFee')}</div>
												<div className="text">{getStorageFee()} Ⓝ</div>
											</div>
										</div>
									</div>
								</div>
							)}

							<p className="text-white mt-4 text-sm text-center opacity-90">
								{localeLn('RedirectedToconfirm')}
							</p>
						</div>
						<div className="mt-6">
							<Button
								type="submit"
								size="md"
								isFullWidth
								isDisabled={newPrice === ''}
								onClick={handleSubmit(onUpdateListing)}
							>
								{localeLn('UpdateListing')}
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
								{localeLn('RemoveListing')}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</Modal>
	)
}

export default TokenUpdatePriceModal
