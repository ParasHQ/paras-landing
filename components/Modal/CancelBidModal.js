import useStore from 'lib/store'
import { useIntl } from 'hooks/useIntl'
import Modal from 'components/Common/Modal'
import Button from 'components/Common/Button'
import { sentryCaptureException } from 'lib/sentry'
import { GAS_FEE } from 'config/constants'
import { IconX } from 'components/Icons'
import { useState } from 'react'
import { useToast } from 'hooks/useToast'
import { useWalletSelector } from 'components/Common/WalletSelector'

const CancelBidModal = ({ data, show, onClose }) => {
	const { localeLn } = useIntl()
	const [isCancelBid, setIsCancelBid] = useState(false)
	const { currentUser, setTransactionRes } = useStore((state) => ({
		currentUser: state.currentUser,
		setTransactionRes: state.setTransactionRes,
	}))
	const toast = useToast()
	const { selector } = useWalletSelector()

	const onCancelBid = async () => {
		setIsCancelBid(true)

		try {
			const params = {
				nft_contract_id: data.contract_id,
				token_id: data.token_id,
				account_id: currentUser,
			}

			const wallet = await selector.wallet()
			const res = await wallet.signAndSendTransaction({
				receiverId: process.env.MARKETPLACE_CONTRACT_ID,
				actions: [
					{
						type: 'FunctionCall',
						params: {
							methodName: 'cancel_bid',
							args: params,
							deposit: '1',
							gas: GAS_FEE,
						},
					},
				],
			})
			if (res) {
				onClose()
				setTransactionRes([res])
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">{`Successfully cancel bid auction`}</div>
					),
					type: 'success',
					duration: 2500,
				})
			}
			setIsCancelBid(false)
		} catch (err) {
			sentryCaptureException(err)
			setIsCancelBid(false)
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
							<h1 className="text-2xl font-bold text-white tracking-tight">{'Cancel Bid'}</h1>
						</div>
						<p className="text-white mt-2">
							{localeLn('Are you sure to cancel bid')} <b>{data?.metadata.title}</b>?
						</p>
						<div className="">
							<Button
								disabled={isCancelBid}
								isLoading={isCancelBid}
								className="mt-4"
								isFullWidth
								size="md"
								type="submit"
								variant="error"
								onClick={onCancelBid}
							>
								{localeLn('Remove Bid')}
							</Button>
						</div>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default CancelBidModal
