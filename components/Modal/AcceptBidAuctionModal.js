import useStore from 'lib/store'
import { parseDate, prettyBalance } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import Modal from 'components/Common/Modal'
import Button from 'components/Common/Button'
import { sentryCaptureException } from 'lib/sentry'
import { GAS_FEE_150, STORAGE_ADD_MARKET_FEE } from 'config/constants'
import JSBI from 'jsbi'
import { IconInfo } from 'components/Icons'
import { useEffect, useState } from 'react'
import WalletHelper from 'lib/WalletHelper'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import Tooltip from 'components/Common/Tooltip'
import { useToast } from 'hooks/useToast'

const AcceptBidAuctionModal = ({ data, show, onClose, onSuccess }) => {
	const { localeLn } = useIntl()
	const { nearUsdPrice } = useStore()
	const [txFee, setTxFee] = useState(null)
	const showTooltipTxFee = (txFee?.next_fee || 0) > (txFee?.current_fee || 0)
	const tooltipTxFeeText = localeLn('DynamicTxFee', {
		date: parseDate((txFee?.start_time || 0) * 1000),
		fee: (txFee?.current_fee || 0) / 100,
	})
	const [isAcceptBid, setIsAcceptBid] = useState(false)
	const { currentUser, setTransactionRes } = useStore((state) => ({
		currentUser: state.currentUser,
		setTransactionRes: state.setTransactionRes,
	}))
	const toast = useToast()

	useEffect(() => {
		const getTxFee = async () => {
			if (show) {
				const txFeeContract = await WalletHelper.viewFunction({
					methodName: 'get_transaction_fee',
					contractId: process.env.MARKETPLACE_CONTRACT_ID,
				})
				setTxFee(txFeeContract)
			}
		}

		getTxFee()
	}, [show])

	const hasStorageBalance = async () => {
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
				return true
			}
			return false
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const onAcceptBidAuction = async () => {
		setIsAcceptBid(true)

		const hasDepositStorage = await hasStorageBalance()

		try {
			const depositParams = { receiver_id: currentUser }

			const params = {
				nft_contract_id: data.contract_id,
				token_id: data.token_id,
			}

			let res
			if (hasDepositStorage) {
				res = await WalletHelper.signAndSendTransaction({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					actions: [
						{
							methodName: 'accept_bid',
							args: params,
							deposit: '1',
							gas: GAS_FEE_150,
						},
					],
				})
			} else {
				res = await WalletHelper.signAndSendTransaction({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					actions: [
						{
							methodName: 'storage_deposit',
							args: depositParams,
							deposit: STORAGE_ADD_MARKET_FEE,
							gas: GAS_FEE_150,
						},
						{
							methodName: 'accept_bid',
							args: params,
							deposit: '1',
							gas: GAS_FEE_150,
						},
					],
				})
			}
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
			} else if (res) {
				onClose()
				setTransactionRes(res?.response)
				onSuccess && onSuccess()
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">{`Successfully accept bid auction`}</div>
					),
					type: 'success',
					duration: 2500,
				})
			}
			setIsAcceptBid(false)
		} catch (err) {
			sentryCaptureException(err)
			setIsAcceptBid(false)
		}
	}

	const calculatePriceDistribution = () => {
		if (isCurrentBid('amount') !== undefined) {
			if (JSBI.greaterThan(JSBI.BigInt(isCurrentBid('amount')), JSBI.BigInt(0))) {
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
									JSBI.BigInt(isCurrentBid('amount')),
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
					JSBI.multiply(JSBI.BigInt(isCurrentBid('amount')), fee),
					JSBI.BigInt(10000)
				)

				const cut = JSBI.add(calcRoyalty, calcFee)

				const calcReceive = JSBI.subtract(JSBI.BigInt(isCurrentBid('amount')), cut)

				return {
					receive: formatNearAmount(calcReceive.toString()),
					royalty: formatNearAmount(calcRoyalty.toString()),
					fee: formatNearAmount(calcFee.toString()),
				}
			}
		}

		return {
			receive: 0,
			royalty: 0,
			fee: 0,
		}
	}

	const isCurrentBid = (type) => {
		let list = []
		data?.bidder_list?.map((item) => {
			if (type == 'amount') list.push(item.amount)
			else if (type == 'bidder') list.push(item.bidder)
		})

		return list[list.length - 1]
	}

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-sm w-full p-4 bg-gray-800 m-auto rounded-md relative">
					<div>
						<h1 className="text-2xl font-bold text-white tracking-tight">
							{localeLn('Accept Highest Bid')}
						</h1>
						<p className="text-white mt-2">
							{localeLn('You are about to accept bid auction from ')}{' '}
							<b>{isCurrentBid('bidder')}</b>
						</p>
						<div className="text-center">
							<div className="text-white mt-4 text-2xl font-bold text-center">
								{`${prettyBalance(isCurrentBid('amount'), 24, 4)} Ⓝ `}
							</div>
							{nearUsdPrice !== 0 && isCurrentBid('amount') !== undefined && (
								<div className="text-xs text-gray-300 truncate">
									${prettyBalance(JSBI.BigInt(isCurrentBid('amount')) * nearUsdPrice, 24, 2)}
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
									{Object.keys(data.royalty).length === 0
										? `None`
										: `${
												Object.values(data.royalty).reduce((a, b) => {
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
									<div className="text">{formatNearAmount(STORAGE_ADD_MARKET_FEE)} Ⓝ</div>
								</div>
							</div>
						</div>
						<p className="text-white mt-4 text-sm text-center opacity-90 px-4">
							{localeLn('RedirectedToconfirm')}
						</p>

						{data.is_staked && (
							<p className="text-sm text-center font-bold mt-2 -mb-2">
								Please Unstake your token to accept offer
							</p>
						)}

						<div className="">
							<Button
								size="md"
								isFullWidth
								isDisabled={isAcceptBid}
								isLoading={isAcceptBid}
								className="mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
								onClick={onAcceptBidAuction}
							>
								{'Accept Bid Auction'}
							</Button>
							<Button
								className="mt-4"
								variant="ghost"
								size="md"
								isFullWidth
								onClick={onClose}
								isDisabled={isAcceptBid}
							>
								{localeLn('Cancel')}
							</Button>
						</div>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default AcceptBidAuctionModal
