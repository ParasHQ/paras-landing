import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { parseDate, prettyBalance } from 'utils/common'
import Modal from 'components/Modal'
import { useIntl } from 'hooks/useIntl'
import JSBI from 'jsbi'
import Button from 'components/Common/Button'
import { useEffect, useState } from 'react'
import Tooltip from 'components/Common/Tooltip'
import { IconInfo } from 'components/Icons'
import WalletHelper from 'lib/WalletHelper'
import useStore from 'lib/store'

const AcceptBidModal = ({ onClose, token, data, storageFee, isLoading, onSubmitForm }) => {
	const { localeLn } = useIntl()
	const [txFee, setTxFee] = useState(null)
	const { nearUsdPrice } = useStore()

	const showTooltipTxFee = (txFee?.next_fee || 0) > (txFee?.current_fee || 0)
	const tooltipTxFeeText = localeLn('DynamicTxFee', {
		date: parseDate((txFee?.start_time || 0) * 1000),
		fee: (txFee?.current_fee || 0) / 100,
	})

	useEffect(() => {
		const getTxFee = async () => {
			const txFeeContract = await WalletHelper.viewFunction({
				methodName: 'get_transaction_fee',
				contractId: process.env.MARKETPLACE_CONTRACT_ID,
			})
			setTxFee(txFeeContract)
		}

		getTxFee()
	}, [])

	const calculatePriceDistribution = () => {
		if (JSBI.greaterThan(JSBI.BigInt(data.price), JSBI.BigInt(0))) {
			let fee
			if (txFee?.start_time && new Date() > new Date(txFee?.start_time * 1000)) {
				fee = JSBI.BigInt(txFee?.next_fee || 0)
			} else {
				fee = JSBI.BigInt(txFee?.current_fee || 0)
			}

			const calcRoyalty =
				Object.keys(token.royalty).length > 0
					? JSBI.divide(
							JSBI.multiply(
								JSBI.BigInt(data.price),
								JSBI.BigInt(
									Object.values(token.royalty).reduce((a, b) => {
										return parseInt(a) + parseInt(b)
									}, 0)
								)
							),
							JSBI.BigInt(10000)
					  )
					: JSBI.BigInt(0)

			const calcFee = JSBI.divide(JSBI.multiply(JSBI.BigInt(data.price), fee), JSBI.BigInt(10000))

			const cut = JSBI.add(calcRoyalty, calcFee)

			const calcReceive = JSBI.subtract(JSBI.BigInt(data.price), cut)

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
		<Modal closeOnBgClick={false} closeOnEscape={false} close={onClose}>
			<div className="max-w-sm w-full p-4 bg-gray-800 m-auto rounded-md relative">
				<div>
					<h1 className="text-2xl font-bold text-white tracking-tight">
						{localeLn('Accept a Bid')}
					</h1>
					<p className="text-white mt-2">
						{localeLn('AboutToAcceptBid')} <b>{token.metadata.name}</b> {localeLn('From')}{' '}
						<b>{data.buyer_id}</b>
					</p>
					<div className="text-center">
						<div className="text-white mt-4 text-2xl font-bold text-center">
							{`${prettyBalance(data.price, 24, 4)} Ⓝ `}
						</div>
						{nearUsdPrice !== 0 && (
							<div className="text-xs text-gray-300 truncate">
								${prettyBalance(JSBI.BigInt(data.price) * nearUsdPrice, 24, 2)}
							</div>
						)}
					</div>

					<div className="mt-4 text-center">
						<div
							className={`flex items-center justify-between ${
								showTooltipTxFee ? 'text-gray-300' : 'text-gray-200'
							}`}
						>
							<div className="text-sm">
								{localeLn('RoyaltyForArtist')} (
								{Object.keys(token.royalty).length === 0
									? `None`
									: `${
											Object.values(token.royalty).reduce((a, b) => {
												return parseInt(a) + parseInt(b)
											}, 0) / 100
									  }%`}
								)
							</div>
							<div>{calculatePriceDistribution().royalty} Ⓝ</div>
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
						</div>
						<div
							className={`flex items-center justify-between ${
								showTooltipTxFee ? 'text-gray-300' : 'text-gray-200'
							}`}
						>
							<div className="text-sm">{localeLn('YouWillGet')}</div>
							<div>{calculatePriceDistribution().receive} Ⓝ</div>
						</div>
					</div>
					<div className="mt-4 text-center">
						<div className="text-white my-1">
							<div
								className={`flex items-center justify-between ${
									showTooltipTxFee ? 'text-gray-300' : 'text-gray-200'
								}`}
							>
								<div className="text-sm">{localeLn('StorageFee')}</div>
								<div className="text">{formatNearAmount(storageFee)} Ⓝ</div>
							</div>
						</div>
					</div>
					<p className="text-white mt-4 text-sm text-center opacity-90 px-4">
						{localeLn('RedirectedToconfirm')}
					</p>

					{token.is_staked && (
						<p className="text-sm text-center font-bold mt-2 -mb-2">
							Please Unstake your token to accept offer
						</p>
					)}

					<div className="">
						<Button
							size="md"
							isFullWidth
							isDisabled={token.is_staked || isLoading}
							isLoading={isLoading}
							className="mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
							onClick={onSubmitForm}
						>
							{'Accept Bid'}
						</Button>
						<Button
							className="mt-4"
							variant="ghost"
							size="md"
							isFullWidth
							onClick={onClose}
							isDisabled={isLoading}
						>
							{localeLn('Cancel')}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default AcceptBidModal
