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
import { prettyBalance, prettyTruncate, TabEnum } from 'utils/common'
import Button from 'components/Common/Button'
import TabOwnersSecond from 'components/Tabs/TabOwnersSecond'
import TabOffersSecond from 'components/Tabs/TabOffersSecond'

const TokenInformation = ({ localToken }) => {
	const { localeLn } = useIntl()

	const [tab, setTab] = useState(TabEnum.INFO)
	const [fetching, setFetching] = useState(null)
	const [collectionStats, setCollectionStats] = useState(null)

	useEffect(() => {
		fetchCollectionStats()
		fetchOffers()
	}, [])

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
				<div className="grid grid-rows-6 bg-neutral-01 border border-neutral-05 rounded-lg p-2 pb-10  ">
					<div className="inline-flex justify-between items-center p-1">
						<div className="w-1/3">
							<p className="text-white text-sm">Collection</p>
						</div>
						<Link
							href={`/collection/${localToken.metadata?.collection_id || localToken.contract_id}`}
						>
							<a className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 hover:bg-neutral-05 hover:border-neutral-10 rounded-lg cursor-pointer p-2">
								<p className="text-white text-sm">Skullpunkk</p>
								<IconOut size={20} stroke={'#F9F9F9'} className="text-right" />
							</a>
						</Link>
					</div>
					<div className="group inline-flex justify-between items-center p-1">
						<div className="w-1/3">
							<p className="text-white text-sm">Royalty</p>
						</div>
						<div className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 hover:bg-neutral-05 hover:border-neutral-10 rounded-lg cursor-pointer p-2">
							<p className="text-white text-sm">10 %</p>
							<IconInfoSecond size={20} color={'#F9F9F9'} />
						</div>
						<span className="group-hover:opacity-100 transition-opacity bg-neutral-01 border border-neutral-10 p-2 text-sm text-neutral-10 rounded-md absolute right-20 opacity-0 mx-auto">
							Royalty will split amongst account ids.
						</span>
					</div>
					<div className="inline-flex justify-between items-center p-1">
						<div className="w-1/3">
							<p className="text-white text-sm">Token ID</p>
						</div>
						<div className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 hover:bg-neutral-05 hover:border-neutral-10 rounded-lg cursor-pointer p-2">
							<p className="text-white text-sm">55018:1</p>
							<IconCopySecond size={20} color={'#F9F9F9'} />
						</div>
					</div>
					<div className="inline-flex justify-between items-center p-1">
						<div className="w-1/3">
							<p className="text-white text-sm">Smart Contract</p>
						</div>
						<div className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 hover:bg-neutral-05 hover:border-neutral-10 rounded-lg cursor-pointer p-2">
							<p className="text-white text-sm">x.paras.near</p>
							<IconCopySecond size={20} color={'#F9F9F9'} />
						</div>
					</div>
					<div className="inline-flex justify-between items-center p-1">
						<div className="w-1/3">
							<p className="text-white text-sm">NFT Link</p>
						</div>
						<div className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 hover:bg-neutral-05 hover:border-neutral-10 rounded-lg cursor-pointer p-2">
							<p className="text-white text-sm">https://ipfs.fleek.co/ipfs/baf...</p>
							<IconCopySecond size={20} color={'#F9F9F9'} />
						</div>
					</div>
					<div className="inline-flex justify-between items-center p-1">
						<div className="w-1/3">
							<p className="text-white text-sm">Locked Fee</p>
						</div>
						<div className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 hover:bg-neutral-05 hover:border-neutral-10 rounded-lg cursor-pointer p-2">
							<p className="text-white text-sm">2 %</p>
							<IconInfoSecond size={20} color={'#F9F9F9'} />
						</div>
					</div>
				</div>
			)}

			{tab === TabEnum.DESCRIPTION && (
				<div className="max-h-80 overflow-y-auto">
					<div className="bg-neutral-01 border border-neutral-05 rounded-lg py-6">
						{fetching === TabEnum.DESCRIPTION && (
							<div className="w-full">
								<IconLoaderSecond size={30} className="mx-auto animate-spin" />
							</div>
						)}

						{fetching === null && localToken.description ? (
							<p className="text-sm text-neutral-10">{localToken.description}</p>
						) : (
							<IconEmptyDescription size={100} className="mx-auto my-4" />
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
				<div className="max-h-80 overflow-y-auto">
					<div className="bg-neutral-01 border border-neutral-05 rounded-lg p-1">
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
				<div className="max-h-80 overflow-y-auto">
					<div className="bg-neutral-01 border border-neutral-05 rounded-lg py-10">
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

const Offer = ({ initial = {} }) => {
	const { token } = useToken({
		key: `${initial.contract_id}::${initial.token_series_id}/${initial.token_id}`,
		initialData: initial,
	})

	const [profile, setProfile] = useState([])
	const [ownedDate, setOwnedDate] = useState(null)
	const { currentUser } = useStore()
	const { localeLn } = useIntl()

	useEffect(() => {
		if (token.owner_id) {
			fetchOwnerProfile()
			fetchOwnedDate()
		}
	}, [token.owner_id])

	const fetchOwnerProfile = async () => {
		try {
			const resp = await cachios.get(`${process.env.V2_API_URL}/profiles`, {
				params: {
					accountId: token.owner_id,
				},
				ttl: 60,
			})
			const newData = resp.data.data.results[0] || {}
			setProfile(newData)
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const checkTokenPrice = () => {
		if (token && token.amount) {
			return prettyBalance(token.amount.$numberDecimal, 24, 2)
		} else if (token && token.price) {
			return prettyBalance(token.price, 24, 2)
		} else {
			return '---'
		}
	}

	const fetchOwnedDate = async () => {
		try {
			const resp = await cachios.get(`${process.env.V2_API_URL}/activities`, {
				params: {
					contract_id: token.contract_id,
					token_id: token.token_id,
					type: 'nft_transfer',
					to: token.owner_id,
					__limit: 1,
					__sort: '_id::-1',
				},
			})

			const newData = resp.data.data.results[0] || null
			setOwnedDate(newData.issued_at)
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	return (
		<>
			<div className="col-span-4 inline-flex items-center w-full py-2">
				<ProfileImageBadge
					imgUrl={profile.imgUrl}
					level={profile?.level}
					className="w-8 h-8 rounded-lg"
				/>
				<div className="flex flex-col justify-between items-stretch ml-2">
					<p className="text-xs font-bold mb-2 text-neutral-10">
						{prettyTruncate(token.owner_id, 24, 'address')}
					</p>
					<Link
						href={`/token/${token.contract_id}::${encodeURIComponent(token.token_series_id)}/${
							token.token_id && encodeURIComponent(token.token_id)
						}`}
					>
						<a className="text-sm font-thin text-neutral-10 truncate">
							{token.contract_id === process.env.NFT_CONTRACT_ID
								? `${localeLn('Edition')} #${token.edition_id}`
								: `#${token.token_id}`}
						</a>
					</Link>
				</div>
			</div>
			<div className="col-span-2 flex flex-col py-3">
				{token.price ? (
					<p className="text-md text-left text-neutral-10 font-bold">
						{checkTokenPrice().toString()} Ⓝ
					</p>
				) : (
					<div className="line-through text-red-600">
						<p className="text-lg font-bold text-gray-100">{localeLn('SALE')}</p>
					</div>
				)}
			</div>
			<div className="col-span-3 inline-flex py-4">
				<p className="text-xs text-neutral-10">
					{new Date(ownedDate).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}{' '}
				</p>
			</div>
			<div className="col-span-3 inline-flex py-4 justify-end">
				<p className="underline text-neutral-10 cursor-pointer">Reject</p>
				<Button size={'sm'}>Accept</Button>
			</div>
			<div className="col-span-12 border-b border-b-neutral-04 mb-2"></div>
		</>
	)
}

export default TokenInformation
