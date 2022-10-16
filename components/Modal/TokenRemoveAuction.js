import { useState } from 'react'
import { useToast } from 'hooks/useToast'
import { GAS_FEE } from 'config/constants'
import { sentryCaptureException } from 'lib/sentry'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import LoginModal from './LoginModal'
import { IconX } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'
import useStore from 'lib/store'
import { useWalletSelector } from 'components/Common/WalletSelector'
import Media from 'components/Common/Media'
import { parseImgUrl, prettyTruncate, prettyBalance } from 'utils/common'
import Link from 'next/link'
import IconInfoSecond from 'components/Icons/component/IconInfoSecond'
import { InputText } from 'components/Common/form'
import { useForm } from 'react-hook-form'

const ConfirmEnum = {
	REMOVE: 'remove',
}

const TokenRemoveAuction = ({ data, show, onClose }) => {
	const store = useStore()
	const toast = useToast()
	const { localeLn } = useIntl()
	const { signAndSendTransaction } = useWalletSelector()
	const { errors, register } = useForm()
	const { userBalance, setTransactionRes } = useStore((state) => ({
		userBalance: state.userBalance,
		setTransactionRes: state.setTransactionRes,
	}))

	const [showLogin, setShowLogin] = useState(false)
	const [confirm, setConfirm] = useState('')
	const [isCancelAuction, setIsCancelAuction] = useState(false)

	const onCancelAuction = async () => {
		setIsCancelAuction(true)

		try {
			const params = {
				nft_contract_id: data.contract_id,
				token_id: data.token_id,
				is_auction: true,
			}

			const res = await signAndSendTransaction({
				receiverId: process.env.MARKETPLACE_CONTRACT_ID,
				actions: [
					{
						type: 'FunctionCall',
						params: {
							methodName: 'delete_market_data',
							args: params,
							gas: GAS_FEE,
							deposit: '1',
						},
					},
				],
			})
			if (res) {
				onClose()
				setTransactionRes([res])
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
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{err.message || localeLn('SomethingWentWrong')}
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			sentryCaptureException(err)
			setIsCancelAuction(false)
		}
	}

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-[504px] w-full bg-neutral-03 text-white rounded-lg mx-auto p-6">
					<div className="relative mb-5">
						<p className="text-sm font-bold text-center">Remove Auction</p>
						<button className="absolute bg-neutral-05 rounded-md right-0 -top-2" onClick={onClose}>
							<IconX className={'ml-1 mt-1'} />
						</button>
					</div>

					<div className="bg-neutral-02 rounded-lg p-4 mb-4">
						<p className="text-sm font-bold p-1">Item</p>
						<div className="border-b border-b-neutral-05 mx-1"></div>

						<div>
							<div className="flex flex-row justify-between items-center p-2">
								<div className="inline-flex items-center w-16">
									<Media
										className="rounded-lg"
										url={parseImgUrl(data?.metadata.media, null, {
											width: `30`,
											useOriginal: process.env.APP_ENV === 'production' ? false : true,
											isMediaCdn: data?.isMediaCdn,
										})}
										videoControls={false}
										videoLoop={true}
										videoMuted={true}
										autoPlay={false}
										playVideoButton={false}
									/>
									<div className="flex flex-col justify-between items-stretch ml-2">
										<p className="text-xs font-thin mb-2">Collection</p>
										<Link href={`/collection/${data.metadata?.collection_id || data.contract_id}`}>
											<a className="text-sm font-bold truncate">
												{prettyTruncate(data.metadata?.collection || data.contract_id, 20)}
											</a>
										</Link>
									</div>
								</div>
							</div>
							<div className="border-b border-b-neutral-05 mx-1"></div>
						</div>
					</div>

					<div className="flex flex-row justify-between items-center mb-2">
						<p className="text-sm">Your Balance</p>
						<div className="inline-flex">
							<p className="text-sm text-neutral-10 font-bold truncate p-1">{`${prettyBalance(
								userBalance.available,
								24,
								4
							)} Ⓝ`}</p>
							{userBalance.available && store.nearUsdPrice !== 0 && (
								<div className="text-[10px] text-gray-400 truncate ml-2">
									(~$
									{prettyBalance(userBalance.available * store.nearUsdPrice, 24, 2)})
								</div>
							)}
						</div>
					</div>

					<div className="flex flex-row justify-between items-center mb-2">
						<p className="text-sm">Payment Method</p>
						<div className="inline-flex items-center">
							<p className="text-sm text-white">Near Wallet</p>
							<IconInfoSecond size={18} color={'#F9F9F9'} className={'ml-2 mb-1'} />
						</div>
					</div>

					<div className="border-b border-b-neutral-05 mx-1 mb-6"></div>

					<div className="mb-6">
						<p className="text-sm text-center text-danger-200">
							All bids that have been entered will be canceled too.
						</p>
						<p className="text-sm text-center text-danger-200 font-bold">
							This operation cannot be undone.
						</p>
					</div>

					<div className="mb-6">
						<p className="text-sm text-neutral-10 mb-2">Type “remove” to confirm</p>
						<InputText
							name="removeAuction"
							step="any"
							onChange={(e) => setConfirm(e.target.value)}
							ref={register({
								required: true,
							})}
							className={`${
								errors.removeAuction && 'error'
							} w-full bg-neutral-04 border border-neutral-06 hover:bg-neutral-05 focus:bg-neutral-04 focus:border-neutral-07 text-xs`}
							placeholder="Account ID (example.near)"
						/>
					</div>

					<div className="grid grid-cols-2 gap-x-4">
						<div>
							<Button variant="second" className={'text-sm'} onClick={onClose}>
								Cancel
							</Button>
						</div>
						<div>
							<Button
								isDisabled={confirm !== ConfirmEnum.REMOVE}
								isLoading={isCancelAuction}
								onClick={onCancelAuction}
								className={`
                ${
									confirm === ConfirmEnum.REMOVE
										? 'bg-danger-500 text-neutral-10'
										: 'bg-danger-disabled text-neutral-07'
								} 
                text-sm w-full pl-12 text-center`}
							>
								Remove Auction
							</Button>
						</div>
					</div>
				</div>
			</Modal>

			<LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
		</>
	)
}

export default TokenRemoveAuction
