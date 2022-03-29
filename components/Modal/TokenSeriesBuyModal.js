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
import { trackBuyTokenSeries, trackBuyTokenSeriesImpression } from 'lib/ga'
import useProfileData from 'hooks/useProfileData'
import { flagColor, flagText } from 'constants/flag'
import BannedConfirmModal from './BannedConfirmModal'
import useStore from 'lib/store'
import WalletHelper from 'lib/WalletHelper'

const TokenSeriesBuyModal = ({ show, onClose, data }) => {
	const [showLogin, setShowLogin] = useState(false)
	const [showBannedConfirm, setShowBannedConfirm] = useState(false)
	const [isBuying, setIsBuying] = useState(false)
	const { currentUser, setTransactionRes } = useStore()
	const creatorData = useProfileData(data.metadata.creator_id)

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

		try {
			const res = await WalletHelper.callFunction({
				contractId: data.contract_id,
				methodName: `nft_buy`,
				args: params,
				gas: GAS_FEE,
				deposit: attachedDeposit.toString(),
			})
			if (res?.response) {
				onClose()
				setTransactionRes(res?.response)
			}
			setIsBuying(false)
		} catch (err) {
			sentryCaptureException(err)
			setIsBuying(false)
		}
	}

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
