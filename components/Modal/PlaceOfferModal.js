import { useForm } from 'react-hook-form'
import useStore from 'lib/store'
import { prettyBalance } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import Modal from 'components/Common/Modal'
import Button from 'components/Common/Button'
import { InputText } from 'components/Common/form'
import { sentryCaptureException } from 'lib/sentry'
import { GAS_FEE, STORAGE_ADD_MARKET_FEE } from 'config/constants'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import JSBI from 'jsbi'
import { IconX } from 'components/Icons'
import { useEffect, useState } from 'react'
import useProfileData from 'hooks/useProfileData'
import { flagColor, flagText } from 'constants/flag'
import BannedConfirmModal from './BannedConfirmModal'
import WalletHelper from 'lib/WalletHelper'
import TradeNFTModal from './TradeNFTModal'
import { trackOfferToken, trackOfferTokenImpression } from 'lib/ga'

const PlaceOfferModal = ({
	data,
	show,
	onClose,
	bidAmount,
	bidQuantity,
	onSuccess,
	fromDetail = true,
	setShowModal,
	tokenType = `token`,
}) => {
	const [showBannedConfirm, setShowBannedConfirm] = useState(false)
	const [showTradeNFTModal, setShowTradeNFTModal] = useState(false)
	const creatorData = useProfileData(data.metadata.creator_id)
	const { localeLn } = useIntl()
	const { errors, register, handleSubmit, watch, setValue } = useForm({
		defaultValues: {
			bidAmount,
			bidQuantity,
		},
	})
	const [hasBid, setHasBid] = useState(false)
	const [isBidding, setIsBidding] = useState(false)
	const { currentUser, userBalance, setTransactionRes } = useStore((state) => ({
		currentUser: state.currentUser,
		userBalance: state.userBalance,
		setTransactionRes: state.setTransactionRes,
	}))
	const [isEnableTrade, setIsEnableTrade] = useState(true)

	useEffect(() => {
		if (show) {
			trackOfferTokenImpression(data.token_id)
		}
	}, [show])

	useEffect(() => {
		if (
			!data.token_id &&
			!process.env.WHITELIST_CONTRACT_ID.split(';').includes(data?.contract_id)
		) {
			setIsEnableTrade(false)
		}
	}, [show])

	useEffect(() => {
		if (show) {
			const viewGetOffer = async () => {
				try {
					const params = {
						nft_contract_id: data.contract_id,
						buyer_id: currentUser,
						...(data.token_id
							? { token_id: data.token_id }
							: { token_series_id: data.token_series_id }),
					}
					const bidData = await WalletHelper.viewFunction({
						methodName: 'get_offer',
						contractId: process.env.MARKETPLACE_CONTRACT_ID,
						args: params,
					})
					setHasBid(true)
					setValue('bidAmount', formatNearAmount(bidData.price))
				} catch (error) {
					// if doesn't have offer
				}
			}
			viewGetOffer()
		}
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

	const onPlaceBid = async ({ bidAmount }) => {
		setIsBidding(true)
		const hasDepositStorage = await hasStorageBalance()

		trackOfferToken(data.token_id)

		try {
			const depositParams = { receiver_id: currentUser }

			const params = {
				nft_contract_id: data.contract_id,
				...(data.token_id
					? { token_id: data.token_id }
					: { token_series_id: data.token_series_id }),
				ft_token_id: 'near',
				price: parseNearAmount(bidAmount),
			}

			let res
			if (hasDepositStorage) {
				res = await WalletHelper.signAndSendTransaction({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					actions: [
						{
							methodName: 'add_offer',
							args: params,
							deposit: parseNearAmount(bidAmount),
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
							methodName: 'add_offer',
							args: params,
							deposit: parseNearAmount(bidAmount),
							gas: GAS_FEE,
						},
					],
				})
			}
			if (res?.response) {
				onClose()
				setTransactionRes(res?.response)
				onSuccess && onSuccess()
			}
			setIsBidding(false)
		} catch (err) {
			sentryCaptureException(err)
			setIsBidding(false)
		}
	}

	return (
		<>
			{showTradeNFTModal && (
				<TradeNFTModal
					tokenType={tokenType}
					data={data}
					onClose={() => setShowTradeNFTModal(false)}
				/>
			)}
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
								{hasBid ? 'Update Offer' : 'Place an Offer'}
							</h1>
							{isEnableTrade && (
								<>
									{` `} <span className="text-sm text-white">or</span>
									<span
										className="bg-white text-primary font-bold rounded-md px-2 py-1 cursor-pointer hover:bg-slate-300 transition duration-300 text-xs"
										style={{ boxShadow: `rgb(83 97 255) 0px 0px 5px 1px` }}
										onClick={() => {
											if (!fromDetail) {
												setShowModal(`offerNFT`)
											} else {
												setShowTradeNFTModal(true)
												onClose()
											}
										}}
									>
										Trade NFT
									</span>
								</>
							)}
						</div>
						<p className="text-white mt-2">
							{localeLn('AboutToBid')} <b>{data.metadata.title}</b>.
						</p>
						<form
							onSubmit={handleSubmit((bidQuantity) =>
								creatorData?.flag ? setShowBannedConfirm(true) : onPlaceBid(bidQuantity)
							)}
						>
							<div className="mt-4 ">
								<label className="block text-sm mb-2 text-white opacity-90">
									{localeLn('AmountIn')} Ⓝ
								</label>
								<InputText
									name="bidAmount"
									type="number"
									step="any"
									ref={register({
										required: true,
										min: 0.01,
										max: parseFloat(userBalance.available / 10 ** 24),
									})}
									className={`${errors.bidAmount && 'error'}`}
									placeholder="Place your Offer"
								/>
								<div className="mt-2 text-sm text-red-500">
									{errors.bidAmount?.type === 'required' && `Offer amount is required`}
									{errors.bidAmount?.type === 'min' && `Minimum 0.01 Ⓝ`}
									{errors.bidAmount?.type === 'max' && `You don't have enough balance`}
								</div>
							</div>
							<div className="mt-4 text-center text-white opacity-90">
								<div className="flex justify-between">
									<div className="text-sm">Your balance</div>
									<div>{prettyBalance(userBalance.available, 24, 4)} Ⓝ</div>
								</div>
								<div className="flex justify-between">
									<div className="text-sm">{localeLn('Total Offer')}</div>
									<div>{watch('bidAmount', bidAmount || 0)} Ⓝ</div>
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
									{hasBid ? 'Update' : localeLn('Submit offer')}
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
					action={() => onPlaceBid(watch(bidAmount))}
					setIsShow={(e) => setShowBannedConfirm(e)}
					onClose={onClose}
					type="offer"
				/>
			)}
		</>
	)
}

export default PlaceOfferModal
