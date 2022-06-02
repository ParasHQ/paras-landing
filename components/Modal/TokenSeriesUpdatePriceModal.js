import { useEffect, useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import JSBI from 'jsbi'
import { InputText } from 'components/Common/form'
import { GAS_FEE } from 'config/constants'
import { IconInfo, IconX } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import { trackRemoveListingTokenSeries, trackUpdateListingTokenSeries } from 'lib/ga'
import { useForm } from 'react-hook-form'
import Tooltip from 'components/Common/Tooltip'
import { parseDate } from 'utils/common'
import WalletHelper from 'lib/WalletHelper'
import useStore from 'lib/store'

const TokenSeriesUpdatePriceModal = ({ show, onClose, data }) => {
	const [txFee, setTxFee] = useState(null)
	const [newPrice, setNewPrice] = useState(data.price ? formatNearAmount(data.price) : '')
	const [isUpdatingPrice, setIsUpdatingPrice] = useState(false)
	const [isRemovingPrice, setIsRemovingPrice] = useState(false)
	const [lockedTxFee, setLockedTxFee] = useState('')
	const { register, handleSubmit, errors } = useForm()
	const { localeLn } = useIntl()

	const showTooltipTxFee = (txFee?.next_fee || 0) > (txFee?.current_fee || 0)
	const tooltipTxFeeText = localeLn('DynamicTxFee', {
		date: parseDate((txFee?.start_time || 0) * 1000),
		fee: (txFee?.current_fee || 0) / 100,
	})
	const tooltipLockedFeeText = `This is the current locked transaction fee. Every update to the NFT price will also update the value according to the global transaction fee.`
	const { currentUser, setTransactionRes } = useStore()

	useEffect(() => {
		const getTxFee = async () => {
			const contractForCall =
				process.env.NFT_CONTRACT_ID === data.contract_id
					? data.contract_id
					: process.env.MARKETPLACE_CONTRACT_ID
			const txFeeContract = await WalletHelper.viewFunction({
				methodName: 'get_transaction_fee',
				contractId: contractForCall,
			})
			setTxFee(txFeeContract)
		}

		if (show) {
			getTxFee()
		}
	}, [show])

	useEffect(() => {
		if (!data?.transaction_fee || !newPrice) return
		else {
			const calcLockedTxFee = (data?.transaction_fee / 10000) * 100
			setLockedTxFee(calcLockedTxFee.toString())
		}
	}, [show, newPrice])

	const onUpdateListing = async () => {
		if (!currentUser) {
			return
		}
		setIsUpdatingPrice(true)
		const params = {
			token_series_id: data.token_series_id,
			price: parseNearAmount(newPrice),
		}

		trackUpdateListingTokenSeries(data.token_series_id)

		try {
			const res = await WalletHelper.callFunction({
				contractId: data.contract_id,
				methodName: `nft_set_series_price`,
				args: params,
				gas: GAS_FEE,
				deposit: `1`,
			})

			if (res?.response) {
				onClose()
				setTransactionRes(res?.response)
			}
			setIsUpdatingPrice(false)
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const onRemoveListing = async (e) => {
		e.preventDefault()
		if (!currentUser) {
			return
		}
		setIsRemovingPrice(true)
		trackRemoveListingTokenSeries(data.token_series_id)

		try {
			const params = {
				token_series_id: data.token_series_id,
			}
			const res = await WalletHelper.callFunction({
				contractId: data.contract_id,
				methodName: `nft_set_series_price`,
				args: params,
				gas: GAS_FEE,
				deposit: `1`,
			})

			if (res?.response) {
				onClose()
				setTransactionRes(res?.response)
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

			if (data.contract_id === 'comic.paras.near') {
				fee = JSBI.BigInt(500)
			}

			const calcRoyalty =
				Object.values(data.royalty).length > 0
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
						{localeLn('SeriesListing')}
					</h1>
					<form onSubmit={handleSubmit(onUpdateListing)}>
						<div className="mt-4">
							<label className="block text-sm text-white mb-2">
								{localeLn('NewPrice')}{' '}
								{data.price && `(${localeLn('CurrentPrice')}: ${formatNearAmount(data.price)} Ⓝ)`}
							</label>
							<div className="flex justify-between rounded-md border-transparent w-full relative">
								<InputText
									type="number"
									step="any"
									name="newPrice"
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
								className={`mt-2 flex items-center justify-between ${
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
											<span className=" text-white font-semibold">{localeLn('LockedFee')} :</span>
											<span className=" text-white font-semibold">
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
						</div>
						<div className="mt-6">
							<Button
								type="submit"
								size="md"
								isFullWidth
								isDisabled={newPrice === '' || isUpdatingPrice}
								isLoading={isUpdatingPrice}
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
				</div>
			</div>
		</Modal>
	)
}

export default TokenSeriesUpdatePriceModal
