import { formatNearAmount } from 'near-api-js/lib/utils/format'
import useToken from 'hooks/useToken'
import IconCopySecond from 'components/Icons/component/IconCopySecond'
import IconInfoSecond from 'components/Icons/component/IconInfoSecond'
import { sentryCaptureException } from 'lib/sentry'
import IconOut from 'components/Icons/component/IconOut'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import IconEmptyDescription from 'components/Icons/component/IconEmptyDescription'
import cachios from 'cachios'
import ParasRequest from 'lib/ParasRequest'
import IconLoaderSecond from 'components/Icons/component/IconLoaderSecond'
import useStore from 'lib/store'
import { useIntl } from 'hooks/useIntl'
import ProfileImageBadge from 'components/Common/ProfileImageBadge'
import { parseImgUrl, prettyBalance, prettyTruncate, TabEnum } from 'utils/common'
import Button from 'components/Common/Button'
import TabOwnersSecond from 'components/Tabs/TabOwnersSecond'
import TabOffersSecond from 'components/Tabs/TabOffersSecond'
import TokenInfoCopy from 'components/TokenInfoCopy'
import CopyLink from 'components/Common/CopyLink'
import Tooltip from 'components/Common/Tooltip'

const TextCopyEnum = {
	TOKEN_ID: 'token_id',
	CONTRACT_ID: 'contract_id',
	MEDIA: 'media',
}

const TokenInformation = ({ localToken }) => {
	const { localeLn } = useIntl()

	const [tab, setTab] = useState(TabEnum.INFO)
	const [fetching, setFetching] = useState(null)
	const [textCopied, setTextCopied] = useState(null)
	const [lockedTxFee, setLockedTxFee] = useState('')
	const [collectionStats, setCollectionStats] = useState(null)

	useEffect(() => {
		fetchCollectionStats()
		fetchOffers()
	}, [])

	useEffect(() => {
		if (!localToken.transaction_fee) return
		const calcLockedTxFee = (localToken?.transaction_fee / 10000) * 100
		setLockedTxFee(calcLockedTxFee.toString())
	}, [localToken.transaction_fee])

	const fetchCollectionStats = async () => {
		setFetching(TabEnum.DESCRIPTION)

		const collectionId = localToken.metadata?.collection_id || localToken.contract_id
		const stat = await ParasRequest(`${process.env.V2_API_URL}/collection-stats`, {
			params: {
				collection_id: collectionId,
			},
		})

		const newStat = await stat.data.data.results
		setCollectionStats(newStat)

		setFetching(null)
	}

	const fetchOffers = async () => {}

	return (
		<div className="relative bg-neutral-04 border border-neutral-05 rounded-lg my-6 px-5 py-6">
			<div className="mb-6">
				<p className="font-bold text-xl text-neutral-10">General Informations</p>
				<p className="font-normal text-xs text-neutral-10 mt-2">
					Find your NFT initial information here. Make your offer and watch the move.
				</p>
			</div>
			<div className="grid grid-cols-4 bg-neutral-01 border border-neutral-05 rounded-lg p-2 mb-2">
				{Object.keys(TabEnum).map((t) => (
					<button
						key={t}
						className={`${
							tab === TabEnum[t] && 'bg-neutral-03 border border-neutral-05'
						} rounded-md text-neutral-10 text-xs text-center px-6 py-2`}
						onClick={() => setTab(TabEnum[t])}
					>
						{TabEnum[t]}
					</button>
				))}
			</div>

			{tab === TabEnum.INFO && (
				<div className="grid grid-rows-6 bg-neutral-01 border border-neutral-05 rounded-lg p-2 pb-10 h-[326px]">
					<div className="inline-flex justify-between items-center p-1">
						<div className="w-1/3">
							<p className="text-white text-sm">Collection</p>
						</div>
						<Link
							href={`/collection/${localToken.metadata?.collection_id || localToken.contract_id}`}
						>
							<a className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 hover:bg-neutral-05 hover:border-neutral-10 rounded-lg cursor-pointer p-2">
								<p className="text-white text-sm">
									{localToken.metadata?.collection_id || localToken.contract_id}
								</p>
								<IconOut size={20} stroke={'#F9F9F9'} className="text-right" />
							</a>
						</Link>
					</div>
					<div className="inline-flex justify-between items-center p-1">
						<div className="w-1/3">
							<p className="text-white text-sm">Royalty</p>
						</div>
						<div className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 hover:bg-neutral-05 hover:border-neutral-10 rounded-lg cursor-pointer p-2">
							<p className="text-white text-sm">
								{localToken.royalty && Object.keys(localToken.royalty).length > 0 ? (
									<p className="text-gray-100 font-semibold">
										{Object.values(localToken.royalty).reduce(
											(a, b) => parseInt(a) + parseInt(b),
											0
										) / 100}
										%
									</p>
								) : (
									<p className="text-neutral-10">None</p>
								)}
							</p>
							<Tooltip
								id="royalty"
								show={true}
								text={'Royalty will be given to artists'}
								place="top"
								className={'bg-neutral-01 border border-neutral-05 rounded-lg p-1'}
								width="30"
							>
								<IconInfoSecond size={20} color={'#F9F9F9'} />
							</Tooltip>
						</div>
					</div>
					<div className="inline-flex justify-between items-center p-1">
						<div className="w-1/3">
							<p className="text-white text-sm">
								{localToken.token_id ? 'Token ID' : 'Token Series ID'}
							</p>
						</div>
						<div className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 hover:bg-neutral-05 hover:border-neutral-10 rounded-lg cursor-pointer p-2">
							<p className="text-white text-sm">
								{localToken.token_id || localToken.token_series_id}
							</p>
							<IconCopySecond size={20} color={'#F9F9F9'} />
						</div>
					</div>
					<div className="inline-flex justify-between items-center p-1">
						<div className="w-1/3">
							<p className="text-white text-sm">Smart Contract</p>
						</div>
						<div className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 hover:bg-neutral-05 hover:border-neutral-10 rounded-lg cursor-pointer p-2">
							<p className="text-white text-sm">{localToken.contract_id}</p>
							<IconCopySecond size={20} color={'#F9F9F9'} />
						</div>
					</div>
					<div className="group inline-flex justify-between items-center p-1">
						<div className="w-1/3">
							<p className="text-white text-sm">NFT Link</p>
						</div>
						<div className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 hover:bg-neutral-05 hover:border-neutral-10 rounded-lg cursor-pointer p-2">
							<CopyLink
								link={parseImgUrl(localToken.metadata.media, null, {
									useOriginal: process.env.APP_ENV === 'production' ? true : false,
								})}
								afterCopy={() => {
									setTextCopied(TextCopyEnum.MEDIA)
									setTimeout(() => {
										setTextCopied(null)
									}, 2500)
								}}
							>
								<p className="text-white text-sm">
									{prettyTruncate(localToken.metadata.media, 30)}
								</p>
							</CopyLink>
							<IconCopySecond size={20} color={'#F9F9F9'} />
						</div>
						<span className="before:opacity-100 transition-opacity bg-neutral-01 border border-neutral-10 p-2 text-sm text-neutral-10 rounded-md absolute right-20 opacity-0 mx-auto">
							Copied
						</span>
					</div>
					{localToken.transaction_fee && (
						<div className="inline-flex justify-between items-center p-1">
							<div className="w-1/3">
								<p className="text-white text-sm">Locked Fee</p>
							</div>
							<div className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 hover:bg-neutral-05 hover:border-neutral-10 rounded-lg cursor-pointer p-2">
								<p className="text-white text-sm">{lockedTxFee} %</p>
								<IconInfoSecond size={20} color={'#F9F9F9'} />
							</div>
						</div>
					)}
				</div>
			)}

			{tab === TabEnum.DESCRIPTION && (
				<div className="overflow-y-auto">
					<div className="h-[326px] bg-neutral-01 border border-neutral-05 rounded-lg py-6">
						{fetching === TabEnum.DESCRIPTION && (
							<div className="w-full">
								<IconLoaderSecond size={30} className="mx-auto animate-spin" />
							</div>
						)}

						{fetching === null && localToken.description ? (
							<p className="text-sm text-neutral-10">{localToken.description}</p>
						) : (
							<IconEmptyDescription size={150} className="mx-auto mt-11 mb-6" />
						)}

						<div className="flex flex-row justify-around items-center pt-6">
							<div className="text-right text-xs text-neutral-10 font-bold block">
								<p>Collection</p>
								<p>Stats</p>
							</div>
							<div
								data-tip="Number of NFT that has been minted."
								className="text-center rounded-lg block "
							>
								<p className="text-white font-bold truncate text-xs">
									{collectionStats.total_cards || '---'}
								</p>
								<p className="text-gray-400 text-xs">{localeLn('Items')}</p>
							</div>
							<div data-tip="Total of unique owners." className="text-center block ">
								<p className="text-white font-bold truncate text-xs">
									{collectionStats.total_owners || '---'}
								</p>
								<p className="text-gray-400 text-xs">{localeLn('Owners')}</p>
							</div>
							<div data-tip="Total volume all time." className="text-center block">
								<p className="text-white font-bold truncate text-xs">
									{collectionStats.volume
										? formatNearAmount(collectionStats.volume, 2) + ' Ⓝ'
										: '---'}
								</p>
								<p className="text-gray-400 text-xs">{localeLn('TotalVolume')}</p>
							</div>
							<div data-tip="The cheapest price." className="text-center block ">
								<p className="text-white font-bold truncate text-xs">
									{collectionStats.floor_price
										? prettyBalance(collectionStats.floor_price, 24, 4) + ' Ⓝ'
										: '---'}
								</p>
								<p className="text-gray-400 text-xs">{localeLn('FloorPrice')}</p>
							</div>
							<div data-tip="Average price all time." className="text-center rounded-r block ">
								<p className="text-white font-bold truncate text-xs">
									{collectionStats.avg_price
										? prettyBalance(collectionStats.avg_price || '0', 24, 4) + 'Ⓝ'
										: '---'}
								</p>
								<p className="text-gray-400 text-xs">{localeLn('AveragePrice')}</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{tab === TabEnum.OWNERS && (
				<div className="overflow-y-auto">
					<div className="h-[326px]">
						{fetching === TabEnum.OWNERS && (
							<div className="w-full">
								<IconLoaderSecond size={30} className="mx-auto animate-spin" />
							</div>
						)}

						<TabOwnersSecond localToken={localToken} setFetching={setFetching} />
					</div>
				</div>
			)}

			{tab === TabEnum.OFFERS && (
				<div className="overflow-y-auto">
					<div className="h-[326px] bg-neutral-01 border border-neutral-05 rounded-lg p-1">
						{fetching === TabEnum.OFFERS && (
							<div className="w-full">
								<IconLoaderSecond size={30} className="mx-auto animate-spin" />
							</div>
						)}

						<TabOffersSecond localToken={localToken} />
					</div>
				</div>
			)}
		</div>
	)
}

export default TokenInformation
