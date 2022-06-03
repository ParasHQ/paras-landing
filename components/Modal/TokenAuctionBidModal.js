import { useForm } from 'react-hook-form'
import useStore from 'lib/store'
import { prettyBalance } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import Modal from 'components/Common/Modal'
import Button from 'components/Common/Button'
import { InputText } from 'components/Common/form'
import { sentryCaptureException } from 'lib/sentry'
import { GAS_FEE, STORAGE_ADD_MARKET_FEE } from 'config/constants'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import JSBI from 'jsbi'
import { IconX } from 'components/Icons'
import { useEffect, useState } from 'react'
import useProfileData from 'hooks/useProfileData'
import { flagColor, flagText } from 'constants/flag'
import BannedConfirmModal from './BannedConfirmModal'
import WalletHelper from 'lib/WalletHelper'
import { useToast } from 'hooks/useToast'

const TokenAuctionBidModal = ({ data, show, onClose, onSuccess }) => {
	const [showBannedConfirm, setShowBannedConfirm] = useState(false)
	const creatorData = useProfileData(data?.metadata.creator_id)
	const { localeLn } = useIntl()
	const { errors, register, handleSubmit, watch, setValue } = useForm()
	const [isBidding, setIsBidding] = useState(false)
	const { currentUser, userBalance, setTransactionRes } = useStore((state) => ({
		currentUser: state.currentUser,
		userBalance: state.userBalance,
		setTransactionRes: state.setTransactionRes,
	}))
	const toast = useToast()

	useEffect(() => {
		if (data && show) {
			setValue('bidAuctionAmount', checkNextPriceBid())
		}
	}, [data, show])

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

	const onPlaceBidAuction = async ({ bidAuctionAmount }) => {
		setIsBidding(true)

		const hasDepositStorage = await hasStorageBalance()

		try {
			const depositParams = { receiver_id: currentUser }

			const params = {
				nft_contract_id: data.contract_id,
				token_id: data.token_id,
				ft_token_id: 'near',
				amount: parseNearAmount(bidAuctionAmount),
			}

			let res
			if (hasDepositStorage) {
				res = await WalletHelper.signAndSendTransaction({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					actions: [
						{
							methodName: 'add_bid',
							args: params,
							deposit: parseNearAmount(bidAuctionAmount),
							gas: GAS_FEE,
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
							gas: GAS_FEE,
						},
						{
							methodName: 'add_bid',
							args: params,
							deposit: parseNearAmount(bidAuctionAmount),
							gas: GAS_FEE,
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
						<div className="font-semibold text-center text-sm">{`Successfully add bid auction`}</div>
					),
					type: 'success',
					duration: 2500,
				})
			}
			setIsBidding(false)
		} catch (err) {
			sentryCaptureException(err)
			setIsBidding(false)
		}
	}

	const isCurrentBid = (type) => {
		let list = []
		data?.bidder_list?.map((item) => {
			if (type === 'bidder') list.push(item.bidder)
			else if (type === 'time') list.push(item.issued_at)
			else if (type === 'amount') list.push(item.amount)
		})

		return list[list.length - 1]
	}

	const checkNextPriceBid = () => {
		if (data?.bidder_list && data?.bidder_list.length !== 0) {
			const currentBid = JSBI.BigInt(
				data?.bidder_list && data?.bidder_list?.length !== 0 ? isCurrentBid('amount') : data?.price
			)
			const multiplebid = JSBI.multiply(JSBI.divide(currentBid, JSBI.BigInt(100)), JSBI.BigInt(5))
			const nextBid = JSBI.add(currentBid, multiplebid).toString()
			const totalNextBid = (nextBid / 10 ** 24).toFixed(2)
			return totalNextBid
		} else {
			return prettyBalance(data.price || data?.lowest_price, 24, 4)
		}
	}

	return (
		<>
			<Modal isShow={show} close={onClose} closeOnBgClick={false} closeOnEscape={false}>
				<div className="max-w-sm w-full p-4 bg-gray-800  m-auto rounded-md relative">
					<div className="absolute right-0 top-0 pr-4 pt-4">
						<div className="cursor-pointer" onClick={onClose}>
							<IconX />
						</div>
					</div>
					<div>
						<div className="flex items-center space-x-2">
							<h1 className="text-2xl font-bold text-white tracking-tight">
								{'Place a Bid Auction'}
							</h1>
						</div>
						<p className="text-white mt-2">
							{localeLn('AboutToBid')} <b>{data?.metadata.title}</b>.
						</p>
						<form
							onSubmit={handleSubmit((bidAuctionAmount) =>
								creatorData?.flag ? setShowBannedConfirm(true) : onPlaceBidAuction(bidAuctionAmount)
							)}
						>
							<div className="mt-4 ">
								<label className="block text-sm mb-2 text-white opacity-90">
									{localeLn('AmountIn')} Ⓝ
								</label>
								<InputText
									name="bidAuctionAmount"
									type="number"
									step="any"
									ref={register({
										required: true,
										min: prettyBalance(checkNextPriceBid(), 0, 2),
										max: parseFloat(userBalance.available / 10 ** 24),
									})}
									className={`${errors.bidAuctionAmount && 'error'}`}
									placeholder="Place your Bid"
								/>
								<div className="mt-2 text-sm text-red-500">
									{errors.bidAuctionAmount?.type === 'required' && `Bid amount is required`}
									{errors.bidAuctionAmount?.type === 'min' &&
										`Minimum ${prettyBalance(checkNextPriceBid(), 0, 2)} Ⓝ`}
									{errors.bidAuctionAmount?.type === 'max' && `You don't have enough balance`}
								</div>
							</div>
							<div className="mt-4 text-center text-white opacity-90">
								<div className="flex justify-between">
									<div className="text-sm">Your balance</div>
									<div>{prettyBalance(userBalance.available, 24, 4)} Ⓝ</div>
								</div>
								<div className="flex justify-between">
									<div className="text-sm">{localeLn('Minimum Bid')}</div>
									<div>{checkNextPriceBid()} Ⓝ</div>
								</div>
								<div className="flex justify-between">
									<div className="text-sm">
										{data?.bidder_list && data?.bidder_list?.length !== 0
											? localeLn('Highest Bid')
											: localeLn('Starting Bid')}
									</div>
									<div>
										{data?.bidder_list && data?.bidder_list?.length !== 0
											? prettyBalance(isCurrentBid('amount'), 24, 4)
											: prettyBalance(data.price, 24, 4)}{' '}
										Ⓝ
									</div>
								</div>
							</div>
							{creatorData?.flag && (
								<div className="z-20 bottom-0 flex items-center justify-center px-4 mt-4 w-full">
									<p
										className={`text-white text-sm m-2 mt-2 p-1 font-bold w-full mx-auto px-4 text-center rounded-md ${
											flagColor[creatorData?.flag]
										}`}
									>
										{localeLn(flagText[creatorData?.flag])}
									</p>
								</div>
							)}
							<p className="text-white opacity-80 mt-4 text-sm text-center px-4">
								{localeLn('RedirectedToconfirm')}
							</p>
							<div className="">
								<Button
									disabled={isBidding}
									isLoading={isBidding}
									className="mt-4"
									isFullWidth
									size="md"
									type="submit"
								>
									{localeLn('Place a bid')}
								</Button>
								<Button variant="ghost" size="md" isFullWidth className="mt-4" onClick={onClose}>
									{localeLn('Cancel')}
								</Button>
							</div>
						</form>
					</div>
				</div>
			</Modal>
			{showBannedConfirm && (
				<BannedConfirmModal
					creatorData={creatorData}
					action={() => onPlaceBidAuction(watch('bidAuctionAmount'))}
					setIsShow={(e) => setShowBannedConfirm(e)}
					onClose={onClose}
					type="placeabid"
				/>
			)}
		</>
	)
}

export default TokenAuctionBidModal
