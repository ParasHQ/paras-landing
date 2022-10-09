import { IconX } from 'components/Icons'
import { useEffect, useState } from 'react'
import Button from 'components/Common/Button'
import IconInfoSecond from 'components/Icons/component/IconInfoSecond'
import Link from 'next/link'
import Modal from 'components/Common/Modal'
import JSBI from 'jsbi'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import LoginModal from './LoginModal'
import { GAS_FEE_150 } from 'config/constants'
import { useIntl } from 'hooks/useIntl'
import useProfileData from 'hooks/useProfileData'
import useStore from 'lib/store'
import { useWalletSelector } from 'components/Common/WalletSelector'
import { InputText } from 'components/Common/form'
import { parseImgUrl, prettyTruncate, prettyBalance } from 'utils/common'
import Media from 'components/Common/Media'
import { useForm } from 'react-hook-form'

const TokenAuctionModal = ({ data, show, onClose, onSuccess }) => {
	const store = useStore()
	const creatorData = useProfileData(data.metadata.creator_id)
	const { localeLn } = useIntl()
	const { errors, register, handleSubmit, watch, setValue } = useForm()
	const { signAndSendTransaction, viewFunction } = useWalletSelector()
	const { currentUser, userBalance, setTransactionRes } = useStore((state) => ({
		currentUser: state.currentUser,
		userBalance: state.userBalance,
		setTransactionRes: state.setTransactionRes,
	}))

	const [showBannedConfirm, setShowBannedConfirm] = useState(false)
	const [isOffering, setIsOffering] = useState(false)
	const [showLogin, setShowLogin] = useState(false)
	const [showDate, setShowDate] = useState(false)

	const onAuction = async () => {}

	const distanceExpirationDate = (type) => {
		const currentDate = new Date()
		if (type === 'min') {
			return `${currentDate.toISOString().split('T')[0]}`
		} else if (type === 'max') {
			let days = currentDate.getDate()
			currentDate.setDate(days + 4)
			return `${currentDate.toISOString().split('T')[0]}`
		}
	}

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-[504px] w-full bg-neutral-03 text-white rounded-lg mx-auto p-6">
					<form onSubmit={handleSubmit((bidQuantity) => onAuction(bidQuantity))}>
						<div className="relative mb-5">
							<p className="text-sm font-bold text-center">Create Auction</p>
							<button
								className="absolute bg-neutral-05 rounded-md right-0 -top-2"
								onClick={onClose}
							>
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
											<Link
												href={`/collection/${data.metadata?.collection_id || data.contract_id}`}
											>
												<a className="text-sm font-bold truncate">
													{prettyTruncate(data.metadata?.collection || data.contract_id, 20)}
												</a>
											</Link>
										</div>
									</div>
								</div>
							</div>

							<div className="flex flex-row justify-between items-center pl-2 mb-2">
								<p className="text-sm text-neutral-10">Starting Bid</p>
								<InputText
									name="startingBid"
									step="any"
									ref={register({
										required: true,
										min: 0.01,
									})}
									className={`${
										errors.offerAmount && 'error'
									} w-2/3 bg-neutral-04 border border-neutral-06 hover:bg-neutral-05 hover:border-color-06 focus:bg-neutral-04 focus:border-neutral-08 py-2 text-right`}
									placeholder="Place your starting bid"
								/>
							</div>

							<p className="text-sm text-neutral-10 pl-2">Expiration Date</p>
							<div className="grid grid-cols-3 gap-x-2 pl-2">
								<button className="bg-neutral-05 rounded-lg px-4 py-2">1 day</button>
								<div className="col-span-2">
									<input
										{...register('endDateAuction', {
											required: true,
											validate: (date) => {
												const currentDate = new Date()
												const fiveDaysAfter = new Date(
													currentDate.getTime() + 5 * 24 * 60 * 60 * 1000
												)
												const inputtedDate = new Date(date)
												if (fiveDaysAfter < inputtedDate) {
													return 'Auction must be less than 5 days'
												} else if (currentDate > inputtedDate) {
													return 'Auction must be in the future'
												} else {
													return true
												}
											},
										})}
										type="datetime-local"
										className="bg-neutral-04 focus:bg-neutral-01 border border-neutral-07 focus:border-neutral-10 rounded-lg text-sm text-right text-neutral-10"
									/>
								</div>
							</div>
							<div className="relative inline-flex justify0=-between gap-x-2">
								{showDate && (
									<div className="absolute left-0 bg-neutral-01 border border-neutral-10 rounded-lg w-36 z-10 p-3">
										<p className="hover:bg-neutral-03 p-2 rounded-lg hover:border hover:border-neutral-05 text-sm text-neutral-10 cursor-pointer">
											1 day
										</p>
										<p className="hover:bg-neutral-03 p-2 rounded-lg hover:border hover:border-neutral-05 text-sm text-neutral-10 cursor-pointer">
											3 days
										</p>
										<p className="hover:bg-neutral-03 p-2 rounded-lg hover:border hover:border-neutral-05 text-sm text-neutral-10 cursor-pointer">
											7 days
										</p>
										<p className="hover:bg-neutral-03 p-2 rounded-lg hover:border hover:border-neutral-05 text-sm text-neutral-10 cursor-pointer">
											1 month
										</p>
										<p className="hover:bg-neutral-03 p-2 rounded-lg hover:border hover:border-neutral-05 text-sm text-neutral-10 cursor-pointer">
											Custom date
										</p>
									</div>
								)}
							</div>
							<div className="bg-neutral-04 border border-neutral-05 rounded-xl p-4 ml-2 mb-2">
								<p className="text-sm font-bold">Auction Summary</p>
								<div className="border-b border-b-neutral-05 mb-4"></div>

								<div className="flex flex-row justify-between items-center mb-3">
									<p className="text-sm">Starting Bid</p>
									<div className="inline-flex">
										<p className="text-sm text-neutral-10 truncate">{`${prettyBalance(
											data.price ? formatNearAmount(data.price) : '0',
											0,
											4
										)} Ⓝ`}</p>
										{/* {data?.price !== '0' && store.nearUsdPrice !== 0 && (
											<div className="text-[10px] text-gray-400 truncate ml-2">
												($
												{prettyBalance(JSBI.BigInt(data.price) * store.nearUsdPrice, 24, 2)})
											</div>
										)} */}
									</div>
								</div>
								<div className="flex flex-row justify-between items-center">
									<p className="text-sm">Expiration Date</p>
									<div className="inline-flex">
										<p className="text-sm text-neutral-10">DD/MM/YYYY 00.00 (UTC)</p>
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-row justify-between items-center mb-2">
							<p className="text-sm">Your Balance</p>
							<div className="inline-flex">
								<p className="text-sm text-neutral-10 font-bold truncate p-1">{`${prettyBalance(
									data.price ? formatNearAmount(data.price) : '0',
									0,
									4
								)} Ⓝ`}</p>
								{/* {data?.price !== '0' && store.nearUsdPrice !== 0 && (
									<div className="text-[10px] text-gray-400 truncate ml-2">
										($
										{prettyBalance(JSBI.BigInt(data.price) * store.nearUsdPrice, 24, 2)})
									</div>
								)} */}
							</div>
						</div>

						<div className="flex flex-row justify-between items-center mb-6">
							<p className="text-sm">Payment Method</p>
							<div className="inline-flex items-center">
								<p className="text-sm text-white">Near Wallet</p>
								<IconInfoSecond size={18} color={'#F9F9F9'} className={'ml-2 mb-1'} />
							</div>
						</div>

						<div className="grid grid-cols-2 gap-x-4">
							<div>
								<Button variant="second" className={'text-sm'} onClick={onClose}>
									Cancel
								</Button>
							</div>
							<div>
								<Button
									variant="primary"
									className={'text-sm w-full pl-10 text-center'}
									isDisabled={isOffering}
									isLoading={isOffering}
									type="submit"
								>
									Complete Auction
								</Button>
							</div>
						</div>
					</form>
				</div>
			</Modal>
		</>
	)
}

export default TokenAuctionModal
