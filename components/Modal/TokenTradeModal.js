import { useState } from 'react'
import Modal from 'components/Common/Modal'
import { IconX } from 'components/Icons'
import { useForm } from 'react-hook-form'
import { useWalletSelector } from 'components/Common/WalletSelector'
import useStore from 'lib/store'
import JSBI from 'jsbi'
import { STORAGE_ADD_MARKET_FEE } from 'config/constants'
import { sentryCaptureException } from 'lib/sentry'
import useProfileData from 'hooks/useProfileData'
import { parseImgUrl } from 'utils/common'
import Link from 'next/link'
import Card from 'components/Card/Card'
import { InputText } from 'components/Common/form'
import Button from 'components/Common/Button'

const TokenTradeModal = ({ data, show, onClose }) => {
	const { currentUser, setTransactionRes } = useStore((state) => ({
		currentUser: state.currentUser,
		userBalance: state.userBalance,
		setTransactionRes: state.setTransactionRes,
	}))
	const { errors, register, handleSubmit, watch, setValue } = useForm()
	const creatorData = useProfileData(data.metadata.creator_id)

	const [tradedToken, setTradedToken] = useState([])
	const [isTrading, setIsTrading] = useState(false)
	const [showBannedConfirm, setShowBannedConfirm] = useState(false)
	const { signAndSendTransactions, viewFunction } = useWalletSelector()

	const onTrade = async () => {}

	const hasStorageBalance = async () => {
		try {
			const currentStorage = await viewFunction({
				methodName: `storage_balance_of`,
				args: {
					account_id: currentUser,
				},
				receiverId: process.env.MARKETPLACE_CONTRACT_ID,
			})

			const supplyPerOwner = await viewFunction({
				methodName: `get_supply_by_owner_id`,
				args: {
					account_id: currentUser,
				},
				receiverId: process.env.MARKETPLACE_CONTRACT_ID,
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

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-[504px] w-full bg-neutral-03 text-white rounded-lg mx-auto p-6">
					<form
						onSubmit={handleSubmit((bidQuantity) =>
							creatorData?.flag ? setShowBannedConfirm(true) : onTrade(bidQuantity)
						)}
					>
						<div className="relative mb-5">
							<p className="text-sm font-bold text-center">Offer NFT by Trade</p>
							<button
								className="absolute bg-neutral-05 rounded-md right-0 -top-2"
								onClick={onClose}
							>
								<IconX className={'ml-1 mt-1'} />
							</button>
						</div>

						<div className="bg-neutral-02 rounded-lg p-4 mb-4">
							<p className="text-sm font-bold p-1">Add your NFT for Trade</p>
							<div className="border-b border-b-neutral-05 mx-1 mb-4"></div>

							{tradedToken.length > 1 ? (
								<div className="w-48 h-auto text-white mb-4 mx-auto">
									<Card
										imgUrl={parseImgUrl(data.metadata.media, null, {
											width: `600`,
											useOriginal: process.env.APP_ENV === 'production' ? false : true,
											isMediaCdn: data.isMediaCdn,
										})}
										audioUrl={
											data.metadata.mime_type &&
											data.metadata.mime_type.includes('audio') &&
											data.metadata?.animation_url
										}
										threeDUrl={
											data.metadata.mime_type &&
											data.metadata.mime_type.includes('model') &&
											data.metadata.animation_url
										}
										iframeUrl={
											data.metadata.mime_type &&
											data.metadata.mime_type.includes('iframe') &&
											data.metadata.animation_url
										}
										imgBlur={data.metadata.blurhash}
										token={{
											title: data.metadata.title,
											collection: data.metadata.collection || data.contract_id,
											copies: data.metadata.copies,
											creatorId: data.metadata.creator_id || data.contract_id,
											is_creator: data.is_creator,
											mime_type: data.metadata.mime_type,
										}}
										isNewDesign={true}
									/>
								</div>
							) : (
								<div className="flex justify-center items-center w-48 h-72 bg-neutral-04 border border-neutral-05 rounded-lg mx-auto p-1">
									<p className="text-neutral-07 text-xs my-auto">Your card will appear here</p>
								</div>
							)}

							<div>
								<p className="text-neutral-10 text-sm mb-2">NFT Link</p>
								<InputText
									name="offerAmount"
									step="any"
									ref={register({
										required: true,
									})}
									className={`${
										errors.offerAmount && 'error'
									} w-full text-sm bg-neutral-04 border border-neutral-06 hover:bg-neutral-05 focus:bg-neutral-04 focus:border-neutral-07 mb-2`}
									placeholder="i.e.: https://paras.id/token/x.paras.near:1|"
								/>
								<Link href={`/${currentUser}`}>
									<a className="w-full">
										<p className="text-neutral-10 text-sm underline text-right">
											Check to My Profile
										</p>
									</a>
								</Link>
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
									className={'text-sm w-full pl-12 text-center'}
									isDisabled={isTrading}
									isLoading={isTrading}
									type="submit"
								>
									Complete Trade
								</Button>
							</div>
						</div>
					</form>
				</div>
			</Modal>
		</>
	)
}

export default TokenTradeModal
