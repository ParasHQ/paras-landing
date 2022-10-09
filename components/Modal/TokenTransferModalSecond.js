import { useEffect, useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import LoginModal from './LoginModal'
import { GAS_FEE_150 } from 'config/constants'
import { IconX } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import { trackBuyToken, trackBuyTokenImpression, trackClickBuyButton } from 'lib/ga'
import useProfileData from 'hooks/useProfileData'
import BannedConfirmModal from './BannedConfirmModal'
import useStore from 'lib/store'
import { useWalletSelector } from 'components/Common/WalletSelector'
import Media from 'components/Common/Media'
import { parseImgUrl, prettyTruncate, prettyBalance } from 'utils/common'
import JSBI from 'jsbi'
import Link from 'next/link'
import IconInfoSecond from 'components/Icons/component/IconInfoSecond'
import { InputText } from 'components/Common/form'
import { useForm } from 'react-hook-form'

const TokenTransferModalSecond = ({ data, show, onClose, onSuccess }) => {
	const store = useStore()
	const { localeLn } = useIntl()
	const { signAndSendTransaction } = useWalletSelector()
	const { errors, register, handleSubmit, watch, setValue } = useForm()
	const { currentUser, userBalance, setTransactionRes } = useStore((state) => ({
		currentUser: state.currentUser,
		userBalance: state.userBalance,
		setTransactionRes: state.setTransactionRes,
	}))

	const creatorData = useProfileData(data.metadata.creator_id)

	const [showBannedConfirm, setShowBannedConfirm] = useState(false)
	const [showLogin, setShowLogin] = useState(false)
	const [isBuying, setIsBuying] = useState(false)

	const onTransfer = async () => {}

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-[504px] w-full bg-neutral-03 text-white rounded-lg mx-auto p-6">
					<form onSubmit={handleSubmit((bidQuantity) => onTransfer(bidQuantity))}>
						<div className="relative mb-5">
							<p className="text-sm font-bold text-center">Transfer NFT to Another Account</p>
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

							<p className="text-sm text-neutral-10 my-2">Send NFT to</p>
							<InputText
								name="offerAmount"
								step="any"
								ref={register({
									required: true,
									min: 0.01,
									max: parseFloat(userBalance.available / 10 ** 24),
								})}
								className={`${
									errors.offerAmount && 'error'
								} w-full bg-neutral-04 border border-neutral-06 hover:bg-neutral-05 focus:bg-neutral-04 focus:border-neutral-07 text-xs`}
								placeholder="Account ID (example.near)"
							/>
						</div>

						<div className="flex flex-row justify-between items-center mb-2">
							<p className="text-sm">Your Balance</p>
							<div className="inline-flex">
								<p className="text-sm text-neutral-10 font-bold truncate p-1">{`${prettyBalance(
									data.price ? formatNearAmount(data.price) : '0',
									0,
									4
								)} Ⓝ`}</p>
								{data?.price !== '0' && store.nearUsdPrice !== 0 && (
									<div className="text-[10px] text-gray-400 truncate ml-2">
										($
										{/* {prettyBalance(JSBI.BigInt(data.price) * store.nearUsdPrice, 24, 2)}) */}
									</div>
								)}
							</div>
						</div>

						<div className="flex flex-row justify-between items-center mb-10">
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
								<Button variant="primary" className={'text-sm w-full pl-9 text-center'}>
									Complete Transfer
								</Button>
							</div>
						</div>
					</form>
				</div>
			</Modal>
			{/* {showBannedConfirm && (
				<BannedConfirmModal
					creatorData={creatorData}
					action={onBuyToken}
					setIsShow={(e) => setShowBannedConfirm(e)}
					onClose={onClose}
				/>
			)} */}
			<LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
		</>
	)
}

export default TokenTransferModalSecond
