import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useIntl } from 'hooks/useIntl'
import { parseImgUrl, prettyTruncate } from 'utils/common'
import { IconDownArrow, IconInfo, IconQuestion } from 'components/Icons'
import TokenInfoCopy from 'components/TokenInfoCopy'
import TokenRoyaltyModal from 'components/Modal/TokenRoyaltyModal'
import Tooltip from 'components/Common/Tooltip'
import TokenHistoryModal from 'components/Modal/TokenHistoryModal'
import { trackClickInfo } from 'lib/ga'

const TokenInfo = ({ localToken, className }) => {
	const [isDropDown, setIsDropDown] = useState(true)
	const [showModal, setShowModal] = useState('')
	const [lockedTxFee, setLockedTxFee] = useState('')
	const tooltipLockedFeeText = `This is the current locked transaction fee. Every update to the NFT price will also update the value according to the global transaction fee.`

	const collection = localToken.metadata.collection_id
		? {
				id: localToken.metadata.collection_id,
				name: localToken.metadata.collection,
		  }
		: {
				id: localToken.contract_id,
				name: localToken.contract_id,
		  }

	const { localeLn } = useIntl()

	useEffect(() => {
		if (!localToken.transaction_fee) return
		const calcLockedTxFee = (localToken?.transaction_fee / 10000) * 100
		setLockedTxFee(calcLockedTxFee.toString())
	}, [localToken.transaction_fee])

	return (
		<div className={className}>
			<div
				className={`text-white bg-cyan-blue-3 ${
					isDropDown ? 'rounded-t-xl' : 'rounded-xl'
				} hover:cursor-pointer mt-3`}
			>
				<div
					className="flex justify-between items-center pr-2 pl-6 hover:cursor-pointer"
					onClick={() => setIsDropDown(!isDropDown)}
				>
					<p className="text-xl py-3">Info</p>
					<div className={`${isDropDown && 'rotate-180'}`}>
						<IconDownArrow size={30} />
					</div>
				</div>
			</div>
			{isDropDown && (
				<div className="text-white text-sm md:text-lg bg-cyan-blue-1 rounded-b-xl border-b-[14px] border-cyan-blue-1 px-6 py-4 h-56 md:overflow-y-auto">
					<div className="flex justify-between mb-2 md:mb-0">
						<p>Collection</p>
						<Link href={`/collection/${collection.id}`}>
							<a
								onClick={() => {
									trackClickInfo(
										localToken.token_id || localToken.token_series_id,
										'collection_info',
										collection.name
									)
									sessionStorage.clear()
								}}
								className="text-gray-100 font-semibold hover:opacity-80"
							>
								{prettyTruncate(collection.name, 30, 'address')}
							</a>
						</Link>
					</div>
					<div className="flex justify-between mb-2 md:mb-0">
						<p>Royalty</p>
						{localToken.royalty && Object.keys(localToken.royalty).length > 0 ? (
							<div
								className="flex items-center cursor-pointer hover:opacity-80"
								onClick={() => {
									setShowModal('royalty')
									trackClickInfo(
										localToken.token_id || localToken.token_series_id,
										'royalty_info',
										`${
											Object.values(localToken.royalty).reduce(
												(a, b) => parseInt(a) + parseInt(b),
												0
											) / 100
										}
                    %}`
									)
								}}
							>
								<p className="text-gray-100 font-semibold">
									{Object.values(localToken.royalty).reduce(
										(a, b) => parseInt(a) + parseInt(b),
										0
									) / 100}
									%
								</p>
								<div className="pl-2 pb-0.5">
									<IconQuestion size={16} />
								</div>
							</div>
						) : (
							<p className="text-gray-100 font-semibold">None</p>
						)}
					</div>
					<div className="flex justify-between mb-2 md:mb-0">
						<p>Token Id</p>
						<p>
							{prettyTruncate(localToken.token_id, 25, 'address') ||
								prettyTruncate(localToken.token_series_id, 25, 'address')}
						</p>
					</div>
					<div className="flex justify-between mb-2 md:mb-0">
						<p>Transactions</p>
						<div
							className="flex items-center cursor-pointer hover:opacity-80"
							onClick={() => {
								setShowModal('history')
								trackClickInfo(
									localToken.token_id || localToken.token_series_id,
									'history_info',
									true
								)
							}}
						>
							<p>History</p>
							<div className="pl-2 pb-0.5">
								<IconQuestion size={16} />
							</div>
						</div>
					</div>
					<div className="flex justify-between mb-2 md:mb-0">
						<p>Smart Contract</p>
						<div
							onClick={() =>
								trackClickInfo(
									localToken.token_id || localToken.token_series_id,
									'smartcontract_info',
									true
								)
							}
						>
							<TokenInfoCopy text={localToken.contract_id} size="md" />
						</div>
					</div>
					<div className="flex justify-between mb-2 md:mb-0 overflow-hidden">
						<p>{localeLn('ImageLink')}</p>
						<div
							onClick={() =>
								trackClickInfo(
									localToken.token_id || localToken.token_series_id,
									'imagelink_info',
									true
								)
							}
						>
							<TokenInfoCopy
								text={parseImgUrl(localToken.metadata.media, null, {
									useOriginal: process.env.APP_ENV === 'production' ? true : false,
								})}
								size="md"
							/>
						</div>
					</div>
					{localToken.transaction_fee && (
						<div className="flex items-center mb-2 md:mb-0 justify-between relative z-10 text-white">
							<p>{localeLn('LockedFee')} </p>
							<div className="flex items-center gap-2">
								<p>{lockedTxFee} %</p>
								<Tooltip
									id="locked-fee"
									show={true}
									text={tooltipLockedFeeText}
									className="font-normal w-full flex items-center"
									type="light"
									place="left"
								>
									<IconInfo size={20} color="#ffffff" className="inline mb-1" />
								</Tooltip>
							</div>
						</div>
					)}
				</div>
			)}
			{showModal === 'royalty' && (
				<TokenRoyaltyModal
					show={true}
					royalty={localToken.royalty}
					onClose={() => setShowModal('')}
				/>
			)}
			{showModal === 'history' && (
				<TokenHistoryModal show={true} localToken={localToken} onClose={() => setShowModal('')} />
			)}
		</div>
	)
}

export default TokenInfo
