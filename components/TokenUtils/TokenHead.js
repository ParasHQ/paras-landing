import { useEffect, useState } from 'react'
import useStore from 'lib/store'
import { trackLikeToken, trackUnlikeToken } from 'lib/ga'
import { abbrNum, prettyTruncate } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import { mutate } from 'swr'
import IconLove from 'components/Icons/component/IconLove'
import Tooltip from 'components/Common/Tooltip'
import { IconDots } from 'components/Icons'
import TokenMoreModal from 'components/Modal/TokenMoreModal'
import TokenShareModal from 'components/Modal/TokenShareModal'
import TokenUpdatePriceModal from 'components/Modal/TokenUpdatePriceModal'
import TokenBurnModal from 'components/Modal/TokenBurnModal'
import TokenBuyModal from 'components/Modal/TokenBuyModal'
import TokenTransferModal from 'components/Modal/TokenTransferModal'
import ReportModal from 'components/Modal/ReportModal'
import ParasRequest from 'lib/ParasRequest'
import Link from 'next/link'
import TradeNFTModal from 'components/Modal/TradeNFTModal'
import TokenSeriesTransferBuyer from 'components/Modal/TokenSeriesTransferBuyer'
import TokenSeriesBurnModal from 'components/Modal/TokenSeriesBurnModal'
import LoginModal from 'components/Modal/LoginModal'

const TokenHead = ({ localToken, typeToken }) => {
	const [defaultLikes, setDefaultLikes] = useState(0)
	const [showModal, setShowModal] = useState(null)
	const [isLiked, setIsLiked] = useState(false)
	const currentUser = useStore((state) => state.currentUser)

	const { localeLn } = useIntl()
	const isEnableTrade = !process.env.WHITELIST_CONTRACT_ID.split(';').includes(
		localToken?.contract_id
	)

	useEffect(() => {
		if (localToken?.total_likes && localToken?.likes) {
			setIsLiked(true)
			setDefaultLikes(localToken?.total_likes)
			return
		}
		setIsLiked(false)
		setDefaultLikes(localToken?.total_likes)
	}, [localToken])

	const likeToken = async (contract_id, token_series_id, source) => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}

		setIsLiked(true)
		setDefaultLikes(defaultLikes + 1)
		const params = {
			account_id: currentUser,
		}

		const res = await ParasRequest.put(
			`${process.env.V2_API_URL}/like/${contract_id}/${token_series_id}`,
			params
		)

		mutate(`${localToken.contract_id}::${localToken.token_series_id}`)
		mutate(`${localToken.contract_id}::${localToken.token_series_id}/${localToken.token_id}`)
		if (res.status !== 200) {
			setIsLiked(false)
			setDefaultLikes(defaultLikes - 1)
			return
		}

		trackLikeToken(`${contract_id}::${token_series_id}`, source)
	}

	const unlikeToken = async (contract_id, token_series_id, source) => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}

		setIsLiked(false)
		setDefaultLikes(defaultLikes - 1)
		const params = {
			account_id: currentUser,
		}

		const res = await ParasRequest.put(
			`${process.env.V2_API_URL}/unlike/${contract_id}/${token_series_id}`,
			params
		)

		mutate(`${localToken.contract_id}::${localToken.token_series_id}`)
		mutate(`${localToken.contract_id}::${localToken.token_series_id}/${localToken.token_id}`)
		if (res.status !== 200) {
			setIsLiked(true)
			setDefaultLikes(defaultLikes + 1)
			return
		}

		trackUnlikeToken(`${contract_id}::${token_series_id}`, source)
	}

	const onDismissModal = () => {
		setShowModal(null)
	}

	const onClickShare = () => {
		setShowModal('share')
	}

	const onClickUpdate = () => {
		setShowModal('updatePrice')
	}

	const onClickOfferNFT = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('placeofferNFT')
	}

	const onClickTransfer = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('transfer')
	}

	const onClickBurn = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('burn')
	}

	const isOwner = () => {
		if (!currentUser) {
			return false
		}
		return currentUser === localToken.owner_id
	}

	const isCreator = () => {
		if (!currentUser) {
			return false
		}
		return (
			currentUser === localToken.metadata.creator_id ||
			(!localToken.metadata.creator_id && currentUser === localToken.contract_id)
		)
	}

	const onClickDecreaseCopies = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('decreaseCopies')
	}

	const onClickBuyerTransfer = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('buyerTransfer')
	}

	console.log('test', isOwner() && !localToken.is_staked)

	return (
		<div>
			<div className="flex justify-between relative">
				<div className="overflow-x-hidden">
					<div className="flex justify-between items-center">
						{typeToken !== 'token-series' ? (
							<p className="text-gray-300 text-xl ">
								NFT //{' '}
								{prettyTruncate(
									localToken.contract_id === process.env.NFT_CONTRACT_ID
										? `#${localToken.edition_id} of ${localToken.metadata.copies}`
										: `#${localToken.token_id}`,
									25
								)}
							</p>
						) : (
							<p className="text-gray-300 text-xl truncate">
								{localeLn('SERIES')} {'// '}
								{localToken.metadata.copies
									? `Edition of ${localToken.metadata.copies}`
									: `Open Edition`}
							</p>
						)}
						<IconDots
							color="#ffffff"
							className="cursor-pointer mb-1 absolute right-0"
							onClick={() => setShowModal('more')}
						/>
					</div>
					<h1 className="mt-2 text-xl md:text-4xl font-bold text-white tracking-tight pr-4 break-all">
						{localToken.metadata.title}
					</h1>
					<div className="mt-1 text-white text-lg flex">
						<div className="mr-1 truncate">
							<Link
								href={`/collection/${localToken.metadata.collection_id || localToken.contract_id}`}
							>
								<a className="font-bold border-b-2 border-transparent hover:border-white">
									{localToken.metadata.collection ||
										localToken.contract_id?.replace(/\b(?:-|.|near)\b/gi, ' ').trim()}
								</a>
							</Link>
							<span className="font-normal"> by </span>
							<Link href={`/${localToken.metadata.creator_id}`}>
								<a className="font-bold border-b-2 border-transparent hover:border-white">
									{localToken.metadata.creator_id}
								</a>
							</Link>
						</div>
					</div>
				</div>
			</div>
			<div className="w-full flex items-center justify-start gap-8 relative mt-10">
				<div className="flex gap-2 items-center">
					<div
						className="cursor-pointer"
						onClick={() => {
							isLiked
								? unlikeToken(localToken.contract_id, localToken.token_series_id, 'detail')
								: likeToken(localToken.contract_id, localToken.token_series_id, 'detail')
						}}
					>
						<IconLove
							size={24}
							color={isLiked ? '#c51104' : 'transparent'}
							stroke={isLiked ? 'none' : 'white'}
						/>
					</div>
					<p className="text-white text-center text-lg">{abbrNum(defaultLikes ?? 0, 1)} Likes</p>
				</div>
				<div className="flex text-white">
					<div className="flex gap-1 items-center text-lg">
						<svg
							className="w-8 h-8 -mt-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							></path>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
							></path>
						</svg>
						<p>{!localToken.view ? '0' : localToken.view}</p>
						<p>{localeLn('Views')}</p>
					</div>
				</div>
				<div className="absolute right-0">
					{localToken.is_staked && (
						<Tooltip
							id="text-staked"
							show={true}
							text={'The NFT is being staked by the owner'}
							className="font-bold bg-gray-800 text-white"
						>
							<span
								className="bg-white text-primary font-bold rounded-full px-3 py-2 text-sm"
								style={{ boxShadow: `rgb(83 97 255) 0px 0px 5px 1px` }}
							>
								staked
							</span>
						</Tooltip>
					)}
				</div>
			</div>
			{typeToken === 'token-series' ? (
				<TokenMoreModal
					show={showModal === 'more'}
					onClose={onDismissModal}
					listModalItem={[
						{ name: 'Share to...', onClick: onClickShare },
						isEnableTrade && {
							name: 'Offer Via NFT',
							onClick: onClickOfferNFT,
						},
						{ name: 'Transfer', onClick: onClickBuyerTransfer },
						isCreator() && { name: 'Reduce Copies', onClick: onClickDecreaseCopies },
						{ name: 'Report', onClick: () => setShowModal('report') },
					].filter((x) => x)}
				/>
			) : (
				<TokenMoreModal
					show={showModal === 'more'}
					onClose={onDismissModal}
					listModalItem={[
						{ name: 'Share to...', onClick: onClickShare },
						!isOwner() &&
							!localToken.is_staked && { name: 'Offer Via NFT', onClick: onClickOfferNFT },
						isOwner() &&
							!localToken.is_staked && { name: 'Update Listing', onClick: onClickUpdate },
						false && { name: 'Transfer', onClick: onClickTransfer },
						isOwner() && !localToken.is_staked && { name: 'Burn Card', onClick: onClickBurn },
						{ name: 'Report', onClick: () => setShowModal('report') },
					].filter((x) => x)}
				/>
			)}
			<TokenShareModal
				show={showModal === 'share'}
				onClose={onDismissModal}
				tokenData={localToken}
			/>
			<TokenUpdatePriceModal
				show={showModal === 'updatePrice'}
				onClose={onDismissModal}
				data={localToken}
			/>
			<TokenBurnModal show={showModal === 'burn'} onClose={onDismissModal} data={localToken} />
			<TokenBuyModal show={showModal === 'buy'} onClose={onDismissModal} data={localToken} />
			<TokenTransferModal
				show={showModal === 'transfer'}
				onClose={onDismissModal}
				data={localToken}
			/>
			<TradeNFTModal
				show={showModal === 'placeofferNFT'}
				data={localToken}
				onClose={onDismissModal}
				tokenType={`token`}
			/>
			<TokenSeriesTransferBuyer
				show={showModal === 'buyerTransfer'}
				onClose={onDismissModal}
				data={localToken}
			/>
			<TokenSeriesBurnModal
				show={showModal === 'decreaseCopies'}
				onClose={onDismissModal}
				data={localToken}
			/>
			<ReportModal show={showModal === 'report'} data={localToken} onClose={onDismissModal} />
			<LoginModal show={showModal === 'notLogin'} onClose={onDismissModal} />
		</div>
	)
}

export default TokenHead
