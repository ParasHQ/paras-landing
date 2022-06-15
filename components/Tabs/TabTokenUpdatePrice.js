import { useEffect, useState } from 'react'
import Button from 'components/Common/Button'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import JSBI from 'jsbi'
import { InputText } from 'components/Common/form'
import { GAS_FEE, GAS_FEE_200, STORAGE_ADD_MARKET_FEE, STORAGE_APPROVE_FEE } from 'config/constants'
import { IconInfo } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import { trackRemoveListingToken, trackUpdateListingToken } from 'lib/ga'
import { useForm } from 'react-hook-form'
import useStore from 'lib/store'
import Tooltip from 'components/Common/Tooltip'
import { parseDate } from 'utils/common'
import WalletHelper from 'lib/WalletHelper'
import { useToast } from 'hooks/useToast'
import { mutate } from 'swr'
import axios from 'axios'

const TabTokenUpdatePrice = ({ show, onClose, data }) => {
	const [newPrice, setNewPrice] = useState(data.price ? formatNearAmount(data.price) : '')
	const [needDeposit, setNeedDeposit] = useState(false)
	const [txFee, setTxFee] = useState(null)
	const [isUpdatingPrice, setIsUpdatingPrice] = useState(false)
	const [isRemovingPrice, setIsRemovingPrice] = useState(false)
	const { register, handleSubmit, errors } = useForm()
	const currentUser = useStore((state) => state.currentUser)
	const setTransactionRes = useStore((state) => state.setTransactionRes)
	const [isAnyTradeOffer, setIsAnyTradeOffer] = useState(false)
	const [lockedTxFee, setLockedTxFee] = useState('')
	const { localeLn } = useIntl()
	const toast = useToast()

	const showTooltipTxFee = (txFee?.next_fee || 0) > (txFee?.current_fee || 0)
	const tooltipTxFeeText = localeLn('DynamicTxFee', {
		date: parseDate((txFee?.start_time || 0) * 1000),
		fee: (txFee?.current_fee || 0) / 100,
	})
	const tooltipLockedFeeText = `This is the current locked transaction fee. Every update to the NFT price will also update the value according to the global transaction fee.`

	useEffect(() => {
		const getTxFee = async () => {
			const txFeeContract = await WalletHelper.viewFunction({
				methodName: 'get_transaction_fee',
				contractId: process.env.MARKETPLACE_CONTRACT_ID,
			})
			setTxFee(txFeeContract)
		}

		if (show) {
			getTxFee()
		}
	}, [show])

	useEffect(() => {
		if (!data?.transaction_fee || !newPrice) return
		const calcLockedTxFee = (data?.transaction_fee / 10000) * 100
		setLockedTxFee(calcLockedTxFee.toString())
	}, [show, newPrice])

	useEffect(() => {
		const checkIsAnyTradeOffer = async () => {
			const resp = await axios.get(`${process.env.V2_API_URL}/offers`, {
				params: {
					buyer_id: currentUser,
				},
			})
			if (
				resp.data.data.results.some(
					(offer) => offer.type === 'trade' && offer.buyer_token_id === data?.token_id
				)
			) {
				setIsAnyTradeOffer(true)
			} else {
				setIsAnyTradeOffer(false)
			}
		}
		checkIsAnyTradeOffer()
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
			const currentStorage = await WalletHelper.viewFunction({
				methodName: 'storage_balance_of',
				contractId: process.env.MARKETPLACE_CONTRACT_ID,
				args: { account_id: currentUser },
			})

			const supplyPerOwner = await WalletHelper.viewFunction({
				methodName: 'get_supply_by_owner_id',
				contractId: process.env.MARKETPLACE_CONTRACT_ID,
				args: { account_id: currentUser },
			})

			const usedStorage = JSBI.multiply(
				JSBI.BigInt(parseInt(supplyPerOwner) + 1),
				JSBI.BigInt(STORAGE_ADD_MARKET_FEE)
			)

			if (JSBI.greaterThanOrEqual(JSBI.BigInt(currentStorage), usedStorage)) {
				setNeedDeposit(false)
			} else {
				setNeedDeposit(true)
			}
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const onUpdateListing = async () => {
		if (!currentUser) {
			return
		}
		setIsUpdatingPrice(true)

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
							args: { receiver_id: currentUser },
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
						gas: GAS_FEE_200,
					},
				],
			})

			const res = await WalletHelper.multipleCallFunction(txs)

			if (res?.response) {
				onClose()
				setTransactionRes(res?.response)
			}
			setIsUpdatingPrice(false)
		} catch (err) {
			sentryCaptureException(err)
			setIsUpdatingPrice(false)
		}
	}

	const onRemoveListing = async (e) => {
		e.preventDefault()
		if (!currentUser) {
			return
		}
		setIsRemovingPrice(true)

		trackRemoveListingToken(data.token_id)

		const txs = []
		try {
			txs.push({
				receiverId: process.env.MARKETPLACE_CONTRACT_ID,
				functionCalls: [
					{
						methodName: 'delete_market_data',
						contractId: process.env.MARKETPLACE_CONTRACT_ID,
						args: {
							token_id: data.token_id,
							nft_contract_id: data.contract_id,
						},
						attachedDeposit: `1`,
						gas: GAS_FEE,
					},
				],
			})
			!isAnyTradeOffer &&
				txs.push({
					receiverId: data.contract_id,
					functionCalls: [
						{
							methodName: 'nft_revoke',
							contractId: data.contract_id,
							args: {
								token_id: data.token_id,
								account_id: process.env.MARKETPLACE_CONTRACT_ID,
							},
							attachedDeposit: `1`,
							gas: GAS_FEE,
						},
					],
				})

			const res = await WalletHelper.multipleCallFunction(txs)

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
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							{`Successfully remove listing ${data.metadata.title}`}
						</div>
					),
					type: 'success',
					duration: 2500,
				})
				setTimeout(() => {
					mutate(`${data.contract_id}::${data.token_series_id}/${data.token_id}`)
					onClose()
				}, 2500)
			}

			setIsRemovingPrice(false)
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
				{data.transaction_fee && txFee && `${txFee?.current_fee}` !== data.transaction_fee && (
					<div className="flex items-center">
						<Tooltip
							id="locked-fee"
							show={true}
							text={tooltipLockedFeeText}
							className="font-normal"
							type="light"
						>
							<div className="border-primary p-1 rounded-md border-2 text-xs mr-1 flex">
								<span className="text-white font-semibold">{localeLn('LockedFee')} :</span>
								<span className="text-white font-semibold">
									{` `}
									{lockedTxFee} %
								</span>
							</div>
						</Tooltip>
					</div>
				)}
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

				<p className="text-white mt-4 text-sm text-center opacity-90 px-4">
					{localeLn('RedirectedToconfirm')}
				</p>
			</div>
			<div className="mt-6">
				<Button
					type="submit"
					size="md"
					isFullWidth
					isDisabled={newPrice === '' || isUpdatingPrice}
					isLoading={isUpdatingPrice}
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
					isDisabled={!data.price || isRemovingPrice}
					isLoading={isRemovingPrice}
				>
					{localeLn('RemoveListing')}
				</Button>
			</div>
		</form>
	)
}

export default TabTokenUpdatePrice
