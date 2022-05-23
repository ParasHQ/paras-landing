import useStore from 'lib/store'
import { useIntl } from 'hooks/useIntl'
import Modal from 'components/Common/Modal'
import Button from 'components/Common/Button'
import { sentryCaptureException } from 'lib/sentry'
import { GAS_FEE, STORAGE_ADD_MARKET_FEE } from 'config/constants'
import JSBI from 'jsbi'
import { IconX } from 'components/Icons'
import { useState } from 'react'
import WalletHelper from 'lib/WalletHelper'
import { useToast } from 'hooks/useToast'

const CancelAuctionModal = ({ data, show, onClose, onSuccess }) => {
	const { localeLn } = useIntl()
	const [isCancelAuction, setIsCancelAuction] = useState(false)
	const { currentUser, setTransactionRes } = useStore((state) => ({
		currentUser: state.currentUser,
		setTransactionRes: state.setTransactionRes,
	}))
	const toast = useToast()

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

	const onCancelAuction = async () => {
		setIsCancelAuction(true)

		const hasDepositStorage = await hasStorageBalance()

		try {
			const depositParams = { receiver_id: currentUser }

			const params = {
				nft_contract_id: data.contract_id,
				token_id: data.token_id,
				is_auction: true,
			}

			let res
			if (hasDepositStorage) {
				res = await WalletHelper.signAndSendTransaction({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					actions: [
						{
							methodName: 'delete_market_data',
							args: params,
							gas: GAS_FEE,
							deposit: '1',
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
							gas: GAS_FEE,
							deposit: STORAGE_ADD_MARKET_FEE,
						},
						{
							methodName: 'delete_market_data',
							args: params,
							gas: GAS_FEE,
							deposit: '1',
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
						<div className="font-semibold text-center text-sm">{`Successfully remove auction`}</div>
					),
					type: 'success',
					duration: 2500,
				})
			}
			setIsCancelAuction(false)
		} catch (err) {
			sentryCaptureException(err)
			setIsCancelAuction(false)
		}
	}

	return (
		<Modal isShow={show} close={onClose} closeOnBgClick={false} closeOnEscape={false}>
			<div className="max-w-sm w-full p-4 bg-gray-800  m-auto rounded-md relative">
				<div className="absolute right-0 top-0 pr-4 pt-4">
					<div className="cursor-pointer" onClick={onClose}>
						<IconX />
					</div>
				</div>
				<div>
					<div className="flex items-center space-x-2">
						<h1 className="text-2xl font-bold text-white tracking-tight">{'Remove Auction'}</h1>
					</div>
					<p className="text-white mt-2">
						{localeLn('Are you sure to remove')} <b>{data?.metadata.title}</b> auction?
					</p>
					<p className="text-white opacity-80 mt-4 text-sm text-center px-4">
						{localeLn(
							'Removing the auction means that all bids that have been entered will be canceled too.'
						)}
					</p>
					<div className="">
						<Button
							disabled={isCancelAuction}
							isLoading={isCancelAuction}
							className="mt-4"
							isFullWidth
							size="md"
							type="submit"
							variant="error"
							onClick={onCancelAuction}
						>
							{localeLn('Remove Auction')}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default CancelAuctionModal
