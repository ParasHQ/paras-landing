import { IconArrowSmall, IconCopied, IconInfo } from 'components/Icons'
import CopyLink from 'components/Common/CopyLink'
import useToken from 'hooks/useToken'
import IconCopySecond from 'components/Icons/component/IconCopySecond'
import IconInfoSecond from 'components/Icons/component/IconInfoSecond'
import { sentryCaptureException } from 'lib/sentry'
import IconOut from 'components/Icons/component/IconOut'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import IconEmptyDescription from 'components/Icons/component/IconEmptyDescription'
import JSBI from 'jsbi'
import cachios from 'cachios'
import ParasRequest from 'lib/ParasRequest'
import IconLoaderSecond from 'components/Icons/component/IconLoaderSecond'
import IconEmptyOffer from 'components/Icons/component/IconEmptyOffer'
import IconEmptyOwners from 'components/Icons/component/IconEmptyOwners'
import IconSort from 'components/Icons/component/IconSort'
import useStore from 'lib/store'
import { useIntl } from 'hooks/useIntl'
import ProfileImageBadge from 'components/Common/ProfileImageBadge'
import { parseImgUrl, prettyBalance, prettyTruncate } from 'utils/common'
import Button from 'components/Common/Button'

const FETCH_TOKENS_LIMIT = 100
const TabEnum = {
	INFO: 'Info',
	DESCRIPTION: 'Description',
	OWNERS: 'Owners',
	OFFERS: 'Offers',
}

const TokenInformation = ({ localToken, onBuy, onOffer }) => {
	const [tab, setTab] = useState(TabEnum.INFO)
	const [fetching, setFetching] = useState(null)
	const [collectionStats, setCollectionStats] = useState(null)
	const [owners, setOwners] = useState([])
	const [offers, setOffers] = useState([])

	useEffect(() => {
		fetchCollectionStats()
		fetchOwners([], null)
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
		// setData({ ...data, stats: newStat })
		setCollectionStats(newStat)

		setFetching(null)
	}

	const fetchOwners = async (owners, idNext) => {
		if (!localToken.token_series_id) return

		setFetching(TabEnum.OWNERS)

		const resp = await cachios.get(`${process.env.V2_API_URL}/token`, {
			params: {
				token_series_id: localToken.token_series_id,
				contract_id: localToken.contract_id,
				_id_next: idNext,
				__limit: FETCH_TOKENS_LIMIT,
				__sort: 'price::1',
			},
			ttl: 120,
		})

		let respData = resp.data.data.results
		const newOwners = [...owners, ...respData]
		// setData({ ...data, owners: newOwners })
		setOwners(newOwners)

		if (respData.length === FETCH_TOKENS_LIMIT) {
			fetchOwners(newOwners, respData[respData.length - 1]._id)
		} else {
			setFetching(null)
		}

		setFetching(null)
	}

	const fetchOffers = async () => {}

	return (
		<div className="bg-neutral-04 border border-neutral-05 rounded-lg my-6 px-5 py-6">
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
					<div className="bg-neutral-01 border border-neutral-05 rounded-lg py-10">
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
					</div>
				</div>
			)}

			{tab === TabEnum.OWNERS && (
				<div className="max-h-80 overflow-y-auto">
					<div className="bg-neutral-01 border border-neutral-05 rounded-lg">
						{fetching === TabEnum.OWNERS && (
							<div className="w-full">
								<IconLoaderSecond size={30} className="mx-auto animate-spin" />
							</div>
						)}

						{fetching === null && owners.length > 0 ? (
							<div>
								<div className="flex flex-row justify-between items-center p-1">
									<div className="inline-flex">
										<IconSort size={20} stroke={'#F9F9F9'} />
										<p className="text-xs text-neutral-10">Filter & Sort</p>
									</div>
									<div className="relative inline-flex gap-x-6">
										<div className="flex flex-row items-center gap-x-2">
											<input
												type="checkbox"
												className="w-auto border-neutral-10 rounded-lg"
												style={{ backgroundColor: '#151719' }}
											/>
											<p className="text-xs text-neutral-10">Buy</p>
										</div>
										<div className="flex flex-row items-center gap-x-2">
											<input
												type="checkbox"
												className="w-auto border-neutral-10 rounded-lg"
												style={{ backgroundColor: '#151719' }}
											/>
											<p className="text-xs text-neutral-10">Offer</p>
										</div>
										<div className="flex flex-row justify-between items-center bg-neutral-01 border border-neutral-05 rounded-lg p-2">
											<p className="text-neutral-10 text-xs mr-4">Price low to high</p>
											<IconArrowSmall size={20} className="rotate-90" />
										</div>
									</div>
								</div>
								<div className="grid grid-cols-12 p-2">
									<p className="text-xs text-neutral-10 col-span-4">Owner</p>
									<p className="text-xs text-neutral-10 col-span-2">Price</p>
									<p className="text-xs text-neutral-10 col-span-3">Owned Date</p>
									<p className="text-xs text-neutral-10 text-right col-span-3">Action</p>
									{owners.map((owner) => (
										<Owner key={owner.owner_id} initial={owner} onBuy={onBuy} onOffer={onOffer} />
									))}
								</div>
							</div>
						) : (
							<IconEmptyOwners size={100} className="mx-auto my-4" />
						)}
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

						{fetching === null && localToken.description ? (
							<p className="text-sm text-neutral-10">{localToken.description}</p>
						) : (
							<IconEmptyOffer size={100} className="mx-auto my-4" />
						)}
					</div>
				</div>
			)}
		</div>
	)
}

const Owner = ({ initial = {}, onBuy, onOffer, onUpdateListing }) => {
	const { token } = useToken({
		key: `${initial.contract_id}::${initial.token_series_id}/${initial.token_id}`,
		initialData: initial,
	})

	const store = useStore()
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
				<p className="text-md text-left text-neutral-10 font-bold">
					{checkTokenPrice().toString()} Ⓝ
				</p>
				{token?.price !== '0' && store.nearUsdPrice !== 0 && (
					<p className="text-[10px] text-gray-400 truncate">
						($
						{/* {prettyBalance(JSBI.BigInt(token.price) * store.nearUsdPrice, 24, 2)}) */}
					</p>
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
			<div className="col-span-3 inline-flex py-4">
				<Button size={'sm'}>Offer</Button>
			</div>
		</>
	)
}

export default TokenInformation
