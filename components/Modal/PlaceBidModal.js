import { useForm } from 'react-hook-form'
import useStore from 'lib/store'
import { prettyBalance } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import Modal from 'components/Common/Modal'
import Button from 'components/Common/Button'
import { InputText } from 'components/Common/form'
import near from 'lib/near'
import { sentryCaptureException } from 'lib/sentry'
import { GAS_FEE, STORAGE_ADD_MARKET_FEE } from 'config/constants'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import { transactions } from 'near-api-js'
import JSBI from 'jsbi'
import { IconX } from 'components/Icons'
import { useEffect, useState } from 'react'
import useProfileData from 'hooks/useProfileData'
import { flagColor, flagText } from 'constants/flag'
import BannedConfirmModal from './BannedConfirmModal'

const HARD_CODE_TOKEN = {
	62036: '10',
	61752: '10',
	61776: '15',
	61880: '10',
	61601: '13',
	61811: '15',
	61736: '10',
	61817: '10',
	62386: '10',
}

const PlaceBidModal = ({ data, show, onClose, isSubmitting, bidAmount, bidQuantity }) => {
	const [showBannedConfirm, setShowBannedConfirm] = useState(false)
	const creatorData = useProfileData(data.metadata.creator_id)
	const { localeLn } = useIntl()
	const { errors, register, handleSubmit, watch, setValue } = useForm({
		defaultValues: {
			bidAmount,
			bidQuantity,
		},
	})
	const [hasBid, setHasBid] = useState(false)
	const { currentUser, userBalance } = useStore((state) => ({
		currentUser: state.currentUser,
		userBalance: state.userBalance,
	}))

	useEffect(async () => {
		if (show) {
			try {
				const params = {
					nft_contract_id: data.contract_id,
					buyer_id: currentUser,
					...(data.token_id
						? { token_id: data.token_id }
						: { token_series_id: data.token_series_id }),
				}
				const bidData = await near.wallet
					.account()
					.viewFunction(process.env.MARKETPLACE_CONTRACT_ID, `get_offer`, params)
				setHasBid(true)
				setValue('bidAmount', formatNearAmount(bidData.price))
			} catch (error) {
				// if doesn't have offer
			}
		}
	}, [show])

	const hasStorageBalance = async () => {
		try {
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
				return true
			}
			return false
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const onPlaceBid = async ({ bidAmount }) => {
		const hasDepositStorage = await hasStorageBalance()

		try {
			const depositParams = {
				receiver_id: near.currentUser.accountId,
			}

			const params = {
				nft_contract_id: data.contract_id,
				...(data.token_id
					? { token_id: data.token_id }
					: { token_series_id: data.token_series_id }),
				ft_token_id: 'near',
				price: parseNearAmount(bidAmount),
			}

			if (hasDepositStorage) {
				await near.wallet.account(process.env.MARKETPLACE_CONTRACT_ID).signAndSendTransaction({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					actions: [
						transactions.functionCall(`add_offer`, params, GAS_FEE, parseNearAmount(bidAmount)),
					],
				})
			} else {
				await near.wallet.account(process.env.MARKETPLACE_CONTRACT_ID).signAndSendTransaction({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					actions: [
						transactions.functionCall(
							`storage_deposit`,
							depositParams,
							GAS_FEE,
							STORAGE_ADD_MARKET_FEE
						),
						transactions.functionCall(`add_offer`, params, GAS_FEE, parseNearAmount(bidAmount)),
					],
				})
			}
		} catch (err) {
			sentryCaptureException(err)
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
						<h1 className="text-2xl font-bold text-white tracking-tight">
							{hasBid ? 'Update Offer' : 'Place an Offer'}
						</h1>
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
										// min: 0.01,
										min: HARD_CODE_TOKEN[data.token_series_id]
											? HARD_CODE_TOKEN[data.token_series_id]
											: 0.01,
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
							<p className="text-white opacity-80 mt-4 text-sm text-center">
								{localeLn('YouWillRedirectedTo')}
							</p>
							<div className="">
								<Button
									disabled={isSubmitting}
									className="mt-4"
									isFullWidth
									size="md"
									type="submit"
								>
									{hasBid ? 'Update' : localeLn('Submit offer')}
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

export default PlaceBidModal
