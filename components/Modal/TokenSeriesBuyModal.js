import { useEffect, useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import LoginModal from './LoginModal'
import JSBI from 'jsbi'
import { GAS_FEE, STORAGE_MINT_FEE } from 'config/constants'
import { IconX } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import { trackBuyTokenSeries, trackBuyTokenSeriesImpression, trackClickBuyButton } from 'lib/ga'
import useProfileData from 'hooks/useProfileData'
import { flagColor, flagText } from 'constants/flag'
import BannedConfirmModal from './BannedConfirmModal'
import useStore from 'lib/store'
import { useWalletSelector } from 'components/Common/WalletSelector'
import useSWRImmutable from 'swr/immutable'
import ParasRequest from 'lib/ParasRequest'

const TokenSeriesBuyModal = ({ show, onClose, data }) => {
	const [showLogin, setShowLogin] = useState(false)
	const [showBannedConfirm, setShowBannedConfirm] = useState(false)
	const [isBuying, setIsBuying] = useState(false)
	const { currentUser, setTransactionRes } = useStore()
	const creatorData = useProfileData(data.metadata.creator_id)
	const { signAndSendTransaction } = useWalletSelector()

	const { localeLn } = useIntl()

	useEffect(() => {
		if (show) {
			trackBuyTokenSeriesImpression(data.token_series_id)
		}
	}, [show])

	const onBuyToken = async () => {
		if (!currentUser) {
			setShowLogin(true)
			return
		}
		setIsBuying(true)
		const params = {
			token_series_id: data.token_series_id,
			receiver_id: currentUser,
		}

		const attachedDeposit = JSBI.add(JSBI.BigInt(data.price), JSBI.BigInt(STORAGE_MINT_FEE))

		trackBuyTokenSeries(data.token_series_id)
		trackClickBuyButton(data.token_series_id)

		try {
			const res = await signAndSendTransaction({
				receiverId: data.contract_id,
				actions: [
					{
						type: 'FunctionCall',
						params: {
							methodName: `nft_buy`,
							args: params,
							gas: GAS_FEE,
							deposit: attachedDeposit.toString(),
						},
					},
				],
			})
			if (res) {
				onClose()
				setTransactionRes([res])
			}
			setIsBuying(false)
		} catch (err) {
			sentryCaptureException(err)
			setIsBuying(false)
		}
	}

	const { data: ownedToken } = useSWRImmutable(
		data && currentUser
			? {
					contract_id: data.contract_id,
					token_series_id: data.token_series_id,
					owner_id: currentUser,
			  }
			: null,
		(key) => {
			return ParasRequest.get(`${process.env.V2_API_URL}/token`, {
				params: key,
			})
		}
	)

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-sm w-full p-4 bg-gray-800 m-4 md:m-auto rounded-md relative">
					<div className="absolute right-0 top-0 pr-4 pt-4">
						<div className="cursor-pointer" onClick={onClose}>
							<IconX />
						</div>
					</div>
					<div>
						<h1 className="text-2xl font-bold text-white tracking-tight">
							{localeLn('ConfirmBuy')}
						</h1>
						<p className="text-white mt-2">
							{localeLn('AreAboutToPurchase')} <b>{data.metadata.title}</b>
						</p>
						<div className="mt-4">
							<div className="mt-2 text-sm text-red-500"></div>
						</div>
						<div className="mt-4 text-center">
							<div className="text-white my-1">
								<div className="flex justify-between">
									<div className="text-sm">{localeLn('Total')}</div>
									<div className="text">{data.price && `${formatNearAmount(data.price)} Ⓝ`}</div>
								</div>
								<div className="flex justify-between">
									<div className="text-sm">{localeLn('StorageFee')}</div>
									<div className="text">{formatNearAmount(STORAGE_MINT_FEE)} Ⓝ</div>
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
						<p className="text-white mt-4 text-sm text-center opacity-90 px-4">
							{localeLn('RedirectedToconfirm')}
						</p>
						{data.category_ids?.filter((category) => category.includes('card4card'))[0] &&
							(data.is_bought || ownedToken?.data.data.results[0]) && (
								<div className="mt-4 p-3 w-full bg-[rgba(234,197,83,0.4)] rounded-md flex items-center justify-center">
									<img src="/warningYellow.png" alt="" className="w-5 h-5 object-contain" />
									<p className="mx-1 text-white font-light text-xs">
										You already have another edition of this card
									</p>
								</div>
							)}
						<div className="mt-6">
							<Button
								size="md"
								isFullWidth
								onClick={() => (creatorData?.flag ? setShowBannedConfirm(true) : onBuyToken())}
								isDisabled={isBuying}
								isLoading={isBuying}
							>
								{data.price !== '0' ? localeLn('Buy') : localeLn('GetForFree')}
							</Button>
							<Button variant="ghost" size="md" isFullWidth className="mt-4" onClick={onClose}>
								{localeLn('Cancel')}
							</Button>
						</div>
					</div>
				</div>
			</Modal>
			{showBannedConfirm && (
				<BannedConfirmModal
					creatorData={creatorData}
					action={onBuyToken}
					setIsShow={(e) => setShowBannedConfirm(e)}
					onClose={onClose}
				/>
			)}
			<LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
		</>
	)
}

export default TokenSeriesBuyModal
