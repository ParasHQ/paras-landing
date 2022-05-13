import Card from 'components/Card/Card'
import { IconX } from 'components/Icons'
import Modal from 'components/Modal'
import { flagColor, flagText } from 'constants/flag'
import { useIntl } from 'hooks/useIntl'
import React from 'react'
import { parseImgUrl } from 'utils/common'

const BannedConfirmModal = ({
	creatorData,
	action,
	setIsShow,
	onClose,
	isTradeType = false,
	tradedTokenData,
	isFlagged = false,
}) => {
	const { localeLn } = useIntl()

	return (
		<Modal
			close={() => {
				isTradeType
					? setIsShow((prev) => ({ ...prev, isShowBannedConfirm: false }))
					: setIsShow(false)
			}}
		>
			<div className="w-full max-w-sm p-4 m-auto bg-gray-800 rounded-md overflow-y-auto max-h-screen relative">
				<h1 className="text-2xl font-bold text-white text-center tracking-tight">
					{localeLn('Warning')}
				</h1>
				<div className="absolute right-0 top-0 pr-4 pt-4">
					<div className="cursor-pointer" onClick={() => setIsShow(false)}>
						<IconX onClick={onClose} />
					</div>
				</div>
				{isTradeType && (
					<div className="w-48 my-3 m-auto">
						<Card
							imgUrl={parseImgUrl(tradedTokenData?.metadata.media, null, {
								width: `600`,
								useOriginal: process.env.APP_ENV === 'production' ? false : true,
								isMediaCdn: tradedTokenData?.isMediaCdn,
							})}
							token={{
								title: tradedTokenData?.metadata.title,
								collection: tradedTokenData?.metadata.collection || tradedTokenData?.contract_id,
								copies: tradedTokenData?.metadata.copies,
								creatorId: tradedTokenData?.metadata.creator_id || tradedTokenData?.contract_id,
								is_creator: tradedTokenData?.is_creator,
								mime_type: tradedTokenData?.metadata.mime_type,
							}}
						/>
					</div>
				)}
				{(!isTradeType || isFlagged) && (
					<div
						className={`w-full text-white ${
							isTradeType && `text-xs`
						} p-2 rounded-md text-center mt-2 mb-6 ${flagColor[creatorData?.flag]}`}
					>
						{localeLn(flagText[creatorData?.flag] || 'FlaggedByPARASStealing')}
					</div>
				)}
				<div
					className={`w-full text-white text-sm text-center ${
						!creatorData.isCreator && `bg-red-600 p-1 rounded-md`
					}`}
				>
					{isTradeType ? `Are you sure to accept NFT trade with` : localeLn('AreYouSureBuy')}
					{` `}
					{isTradeType && <span className="font-bold">{tradedTokenData?.metadata.title}</span>}?
				</div>
				<button
					className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
					onClick={action}
				>
					{localeLn('IUnderstand')}
				</button>
			</div>
		</Modal>
	)
}

export default BannedConfirmModal
