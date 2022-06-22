import cachios from 'cachios'
import LinkToProfile from 'components/Common/LinkToProfile'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useEffect, useState } from 'react'
import { parseImgUrl, prettyBalance, timeAgo } from 'utils/common'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useIntl } from 'hooks/useIntl'
import Media from 'components/Common/Media'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { SHOW_TX_HASH_LINK } from 'constants/common'
import { IconShareActivity } from 'components/Icons'
const FETCH_TOKENS_LIMIT = 12

const TabHistory = ({ localToken }) => {
	const [history, setHistory] = useState([])
	const [idBefore, setIdBefore] = useState(null)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const { localeLn } = useIntl()

	useEffect(() => {
		if (localToken.token_series_id) {
			fetchHistory(true)
		}
	}, [localToken])

	const fetchHistory = async (fromStart = false) => {
		const _hasMore = fromStart ? true : hasMore
		const _id_before = fromStart ? null : idBefore
		const _history = fromStart ? [] : history

		if (!_hasMore || isFetching) {
			return
		}

		setIsFetching(true)

		const params = {
			_id_before: _id_before,
			__limit: FETCH_TOKENS_LIMIT,
		}

		if (localToken.token_id) {
			params.token_id = localToken.token_id
			params.contract_id = localToken.contract_id
		} else {
			params.token_series_id = localToken.token_series_id
			params.contract_id = localToken.contract_id
		}

		const resp = await cachios.get(`${process.env.V2_API_URL}/activities`, {
			params: params,
			ttl: 30,
		})
		const newData = resp.data.data

		const newHistory = [...(_history || []), ...newData.results]
		const _hasMoreFetch = newData.results.length < FETCH_TOKENS_LIMIT ? false : true

		setHistory(newHistory)
		if (_hasMoreFetch) setIdBefore(newData.results[newData.results.length - 1]._id)
		setHasMore(_hasMoreFetch)

		setIsFetching(false)
	}

	return (
		<div className="text-white">
			<InfiniteScroll
				dataLength={history.length}
				next={fetchHistory}
				hasMore={hasMore}
				scrollableTarget="TokenScroll"
				loader={
					<div className="bg-gray-800 mt-3 p-3 rounded-md shadow-md">
						<div className="text-white text-center">{localeLn('LoadingLoading')}</div>
					</div>
				}
			>
				{history.map((h) => (
					<Activity key={h._id} activity={h} />
				))}
			</InfiniteScroll>
		</div>
	)
}

const Activity = ({ activity }) => {
	const router = useRouter()
	const { localeLn } = useIntl()
	const [tradedTokenData, setTradedTokenData] = useState([])

	useEffect(() => {
		if (activity.type.includes('trade')) {
			fetchTradeToken()
		}
	}, [])

	const onClickNftTrade = () => {
		router.push(
			`/token/${tradedTokenData.contract_id}::${tradedTokenData.token_series_id}${
				activity.msg?.params?.buyer_token_id && `/${tradedTokenData.token_id}`
			}`
		)
	}

	const fetchTradeToken = async () => {
		const params = {
			token_id: activity.msg?.params?.buyer_token_id,
			contract_id: activity.msg?.params?.buyer_nft_contract_id,
			__limit: 1,
		}
		const resp = await cachios.get(`${process.env.V2_API_URL}/token`, {
			params: params,
			ttl: 30,
		})
		setTradedTokenData(resp.data.data.results[0])
	}

	const TextActivity = ({ type, msg }) => {
		if (type === 'add_market_data' && msg.params.is_auction) {
			return (
				<p>
					<LinkToProfile accountId={activity.msg.params.owner_id} />
					<span>
						{' '}
						{localeLn('put on auction for')} {prettyBalance(activity.msg.params.price, 24, 2)} Ⓝ
					</span>
				</p>
			)
		}

		if (type === 'add_bid') {
			return (
				<p>
					<LinkToProfile accountId={activity.msg.params.bidder_id} />
					<span>
						{' '}
						{localeLn('add bid for')} {formatNearAmount(activity.msg.params.amount)} Ⓝ
					</span>
				</p>
			)
		}

		if (type === 'cancel_bid') {
			return (
				<p>
					<LinkToProfile accountId={activity.msg.params.bidder_id} />
					<span> {localeLn('cancel bid from auction')}</span>
				</p>
			)
		}

		if (type === 'add_market_data' || type === 'update_market_data') {
			return (
				<p>
					<LinkToProfile accountId={activity.msg.params.owner_id} />
					<span>
						{' '}
						{localeLn('PutOnSaleFor')} {formatNearAmount(activity.msg.params.price)} Ⓝ
					</span>
				</p>
			)
		}

		if (type === 'add_trade' || type === 'delete_trade') {
			return (
				<div>
					<p className=" mb-2">
						<LinkToProfile accountId={activity.msg.params.buyer_id} />
						<span>
							{` `}
							{type.includes(`add`) ? `added` : `deleted`} offer NFT trade{' '}
							<span className="font-semibold">{tradedTokenData?.metadata?.title}</span>
						</span>
					</p>
					<div className="flex items-center mb-2">
						<div className="z-20 max-h-40 w-24 cursor-pointer border-4 border-gray-700 rounded-lg">
							<a
								onClick={(e) => {
									e.preventDefault()
									onClickNftTrade()
								}}
							>
								<Media
									className="rounded-lg overflow-hidden"
									url={parseImgUrl(tradedTokenData?.metadata?.media, null, {
										width: `600`,
										useOriginal: process.env.APP_ENV === 'production' ? false : true,
										isMediaCdn: true,
									})}
									seeDetails={true}
								/>
							</a>
						</div>
					</div>
				</div>
			)
		}

		if (type === 'accept_trade') {
			return (
				<div>
					<p className=" mb-2">
						<span className="font-bold">{activity.msg.params.sender_id}</span>
						<span>
							{` `}
							accepted NFT trade{' '}
							<span className="font-semibold">{tradedTokenData?.metadata?.title}</span>
						</span>
					</p>
					<div className="flex items-center mb-2">
						<div className="z-20 max-h-40 w-24 cursor-pointer border-4 border-gray-700 rounded-lg">
							<a
								onClick={(e) => {
									e.preventDefault()
									onClickNftTrade()
								}}
							>
								<Media
									className="rounded-lg overflow-hidden"
									url={parseImgUrl(tradedTokenData?.metadata?.media, null, {
										width: `600`,
										useOriginal: process.env.APP_ENV === 'production' ? false : true,
										isMediaCdn: true,
									})}
									seeDetails={true}
								/>
							</a>
						</div>
					</div>
				</div>
			)
		}

		if (type === 'delete_market_data') {
			return (
				<p>
					<LinkToProfile accountId={activity.msg.params.owner_id} />
					<span> {localeLn('RemoveFromSale')}</span>
				</p>
			)
		}

		if (type === 'nft_transfer' && msg?.is_staked) {
			return (
				<p>
					<LinkToProfile accountId={activity.from} />
					<span> {localeLn('StakedTo')} </span>

					<Link href="https://stake.paras.id">{activity.msg.seed_title}</Link>
				</p>
			)
		}

		if (type === 'nft_transfer' && activity.from === null) {
			const [, edition_id] = activity.msg.params.token_id.split(':')

			if (activity.price) {
				return (
					<p>
						<LinkToProfile accountId={activity.to} />
						<span> {localeLn('BoughtFrom')} </span>
						<LinkToProfile accountId={activity.from} />{' '}
						<span>
							{' '}
							{localeLn('for')} {formatNearAmount(activity.msg.params.price)} Ⓝ
						</span>
					</p>
				)
			}

			if (activity.to === activity.creator_id) {
				return (
					<p>
						<LinkToProfile accountId={activity.to} />
						<span>
							{' '}
							{localeLn('minted')} #{edition_id || 1}
						</span>
					</p>
				)
			}

			return (
				<p>
					<span>{localeLn('MintedBy')} </span>
					<LinkToProfile accountId={activity.to} />
				</p>
			)
		}

		if (type === 'nft_transfer' && activity.to === null) {
			const [, edition_id] = activity.msg.params.token_id.split(':')

			return (
				<p>
					<LinkToProfile accountId={activity.from} />
					<span>
						{' '}
						{localeLn('burned')} #{edition_id || 1}
					</span>
				</p>
			)
		}

		if (type === 'resolve_purchase' || type === 'nft_transfer') {
			if (activity.price) {
				if (activity.is_offer) {
					return (
						<p>
							<LinkToProfile
								className="text-gray-100 hover:border-gray-100"
								accountId={activity.from}
							/>
							<span> {localeLn('accepted offer from')} </span>
							<LinkToProfile
								className="text-gray-100 hover:border-gray-100"
								accountId={activity.to}
							/>{' '}
							<span>
								{' '}
								{localeLn('for')} {formatNearAmount(activity.msg.params.price)} Ⓝ
							</span>
						</p>
					)
				}
				return (
					<p>
						<LinkToProfile
							className="text-gray-100 hover:border-gray-100"
							accountId={activity.to}
						/>
						<span> {localeLn('BoughtFrom')} </span>
						<LinkToProfile
							className="text-gray-100 hover:border-gray-100"
							accountId={activity.from}
						/>{' '}
						{activity?.is_auction && 'with auction'}
						<span>
							{' '}
							{localeLn('for')} {formatNearAmount(activity.msg.params.price)} Ⓝ
						</span>
					</p>
				)
			}
			return (
				<p>
					<LinkToProfile accountId={activity.from} />
					<span> {localeLn('TransferredTo')} </span>
					<LinkToProfile accountId={activity.to} />
				</p>
			)
		}

		if (type === 'nft_create_series') {
			return (
				<p>
					<span>{localeLn('SeriesCreatedBy')} </span>
					<LinkToProfile accountId={activity.msg.params.creator_id} />
				</p>
			)
		}

		if (type === 'nft_set_series_price') {
			if (!activity.msg.params.price) {
				return (
					<p>
						<span>{localeLn('CreatorNotForSale')}</span>
					</p>
				)
			}
			return (
				<p>
					<span>
						{localeLn('CreatorOnSale')} {formatNearAmount(activity.msg.params.price)} Ⓝ
					</span>
				</p>
			)
		}

		if (type === 'nft_set_series_non_mintable') {
			return (
				<p>
					<span>{localeLn('CreatorNonMintable')} </span>
				</p>
			)
		}

		if (type === 'nft_decrease_series_copies') {
			return (
				<p>
					<span>
						{localeLn('CreatorDecreaseCopiesTo')} {activity.msg.params.copies}{' '}
					</span>
				</p>
			)
		}

		if (type === 'nft_decrease_series_copies') {
			return (
				<p>
					<span>
						{localeLn('Creator decrease the series copies to')} {activity.msg.params.copies}{' '}
					</span>
				</p>
			)
		}

		if (type === 'add_offer') {
			return (
				<p>
					<span>
						<LinkToProfile accountId={activity.from} />
					</span>
					<span> {localeLn('added offer for')}</span>
					<span> {formatNearAmount(activity.msg.params.price)} Ⓝ</span>
				</p>
			)
		}

		if (type === 'delete_offer') {
			return (
				<p>
					<span>
						<span>
							<LinkToProfile accountId={activity.from} />
						</span>
						<span> {localeLn('removed offer')}</span>
					</span>
				</p>
			)
		}

		return null
	}

	if (activity.type === 'resolve_purchase_fail' || activity.type === 'notification_add_offer') {
		return null
	}

	return (
		<div className="bg-gray-800 mt-3 p-3 rounded-md shadow-md flex items-center justify-between relative">
			<div className="w-11/12">
				<TextActivity type={activity.type} msg={activity.msg} />
				<p className="mt-1 text-sm">{timeAgo.format(new Date(activity.msg.datetime))}</p>
			</div>
			<div className="absolute top-2 right-2">
				<TxHashLink activity={activity} />
			</div>
		</div>
	)
}

const TxHashLink = ({ activity }) => {
	return (
		<>
			{SHOW_TX_HASH_LINK && activity.transaction_hash && (
				<a
					href={`https://${
						process.env.APP_ENV === 'production' ? `` : `testnet.`
					}nearblocks.io/txns/${activity.transaction_hash}${
						activity.msg?.receipt_id && `#${activity.msg?.receipt_id}`
					}`}
					target={`_blank`}
				>
					<div className="w-8 h-8 rounded-full transition-all duration-200 hover:bg-dark-primary-3 flex items-center justify-center">
						<IconShareActivity size={18} />
					</div>
				</a>
			)}
		</>
	)
}

export default TabHistory
