import { IconX } from 'components/Icons'
import { useEffect, useState } from 'react'
import Button from 'components/Common/Button'
import Link from 'next/link'
import Modal from 'components/Common/Modal'
import JSBI from 'jsbi'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import LoginModal from './LoginModal'
import { GAS_FEE_150 } from 'config/constants'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import { trackBuyToken, trackBuyTokenImpression, trackClickBuyButton } from 'lib/ga'
import useProfileData from 'hooks/useProfileData'
import { flagColor, flagText } from 'constants/flag'
import BannedConfirmModal from './BannedConfirmModal'
import useStore from 'lib/store'
import { useWalletSelector } from 'components/Common/WalletSelector'
import { parseImgUrl, prettyTruncate, prettyBalance } from 'utils/common'
import Media from 'components/Common/Media'
import IconInfoSecond from 'components/Icons/component/IconInfoSecond'

const TokenMintModal = ({ data, show, onClose }) => {
	const store = useStore()
	const creatorData = useProfileData(data.metadata.creator_id)
	const { signAndSendTransaction } = useWalletSelector()

	const [isMinting, setIsMinting] = useState(false)
	const [isSelfMint, setIsSelfMint] = useState(true)
	const [showBannedConfirm, setShowBannedConfirm] = useState(false)
	const [showLogin, setShowLogin] = useState(false)

	const { localeLn } = useIntl()

	const onMintToken = async () => {}
	const handleSubmit = async () => {}

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-[504px] w-full bg-neutral-03 text-white rounded-lg mx-auto p-6">
					<form
						onSubmit={handleSubmit((bidQuantity) =>
							creatorData?.flag ? setShowBannedConfirm(true) : onMintToken(bidQuantity)
						)}
					>
						<div className="relative mb-5">
							<p className="text-sm font-bold text-center">Mint Confirmation</p>
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

							<div className="flex flex-row justify-between items-center p-2">
								<p className="text-sm text-neutral-10">Price</p>
								<div className="inline-flex">
									<div className="pr-2">
										<input
											id="self-mint"
											className="w-auto"
											type="checkbox"
											defaultChecked={isSelfMint}
											onChange={() => {
												setIsSelfMint(!isSelfMint)
											}}
										/>
									</div>

									<p className="font-bold text-sm text-neutral-10 truncate">Mint to myself</p>
								</div>
							</div>
							<div className="border-b border-b-neutral-05 mb-4 mx-1"></div>

							<div className="bg-neutral-04 border border-neutral-05 rounded-xl p-4 mb-4">
								<p className="text-sm font-bold">Mint Summary</p>
								<div className="border-b border-b-neutral-05 mb-4"></div>

								<div className="flex flex-row justify-between items-center my-2">
									<p className="text-sm">Storage Fee</p>
									<div className="inline-flex">
										<p className="text-sm text-neutral-10 truncate">{`${prettyBalance(
											data.price ? formatNearAmount(data.price) : '0',
											0,
											4
										)} Ⓝ`}</p>
										{data?.price !== '0' && store.nearUsdPrice !== 0 && (
											<div className="text-[10px] text-gray-400 truncate ml-2">
												($
												{prettyBalance(JSBI.BigInt(data.price) * store.nearUsdPrice, 24, 2)})
											</div>
										)}
									</div>
								</div>
								<div className="border-b border-b-neutral-05 mt-4 mb-2"></div>

								<div className="flex flex-row justify-between items-center">
									<p className="text-sm">Total Payment</p>
									<div className="inline-flex">
										<p className="bg-[#1300BA80] text-sm text-neutral-10 font-bold truncate p-1">{`${prettyBalance(
											data.price ? formatNearAmount(data.price) : '0',
											0,
											4
										)} Ⓝ`}</p>
										{data?.price !== '0' && store.nearUsdPrice !== 0 && (
											<div className="text-[10px] text-gray-400 truncate ml-2">
												($
												{prettyBalance(JSBI.BigInt(data.price) * store.nearUsdPrice, 24, 2)})
											</div>
										)}
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
								{data?.price !== '0' && store.nearUsdPrice !== 0 && (
									<div className="text-[10px] text-gray-400 truncate ml-2">
										($
										{prettyBalance(JSBI.BigInt(data.price) * store.nearUsdPrice, 24, 2)})
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
								<Button variant="primary" className={'text-sm w-full pl-[52px] text-center'}>
									Complete Mint
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

export default TokenMintModal
